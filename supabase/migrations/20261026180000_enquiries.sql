begin;

create table public.enquiries (
  id                 uuid primary key default gen_random_uuid(),
  reference_number   text unique not null,
  name               text not null check (length(trim(name)) between 2 and 100),
  email              text check (email is null or length(email) between 3 and 200),
  phone              text check (phone is null or length(phone) between 7 and 20),
  message            text not null check (length(trim(message)) between 10 and 2000),
  service_slug       text,
  service_title      text,
  look_slug          text,
  look_title         text,
  status             text not null default 'new'
                       check (status in ('new','replied','archived')),
  idempotency_key    text unique,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index enquiries_status_created_idx
  on public.enquiries (status, created_at desc);

create index enquiries_email_idx
  on public.enquiries (email) where email is not null;

alter table public.enquiries enable row level security;

-- Public reads are never allowed. Public inserts are never allowed via RLS.
-- Public submissions happen through a server action that uses the privileged
-- client, after full server-side validation. This keeps customer contact
-- details unreachable from any browser-originated query.
revoke all on public.enquiries from anon, authenticated;

-- The owner may read enquiries and update their status. Nothing else.
grant select, update on public.enquiries to authenticated;

create policy "Owner read enquiries"
  on public.enquiries for select to authenticated
  using (public.is_owner());

create policy "Owner update enquiries"
  on public.enquiries for update to authenticated
  using (public.is_owner()) with check (public.is_owner());

create trigger enquiries_set_updated_at
  before update on public.enquiries
  for each row execute function public.set_updated_at();

commit;