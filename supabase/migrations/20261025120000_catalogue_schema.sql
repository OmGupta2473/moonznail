-- MoonzNails catalogue schema.
-- Public browsing only. No customers, orders, cart, payment, or inventory.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.set_updated_at() from anon, authenticated;

-- ---------------------------------------------------------------- products

create table public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name          text not null check (length(btrim(name)) > 0),
  description   text,
  price_minor   integer check (price_minor is null or price_minor >= 0),
  currency      text check (currency is null or currency ~ '^[A-Z]{3}$'),
  shape         text,
  length        text,
  finish        text,
  is_published  boolean not null default false,
  is_fixture    boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

create index products_published_idx
  on public.products (sort_order, created_at desc)
  where is_published;

-- ----------------------------------------------------------- product media

create table public.product_media (
  id            uuid primary key default gen_random_uuid(),
  product_id    uuid not null references public.products(id) on delete cascade,
  storage_path  text,
  alt_text      text not null default '',
  width         integer check (width is null or width > 0),
  height        integer check (height is null or height > 0),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index product_media_product_idx
  on public.product_media (product_id, sort_order);

-- ------------------------------------------------------------- collections

create table public.collections (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (length(btrim(title)) > 0),
  description   text,
  is_published  boolean not null default false,
  is_fixture    boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

create table public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id    uuid not null references public.products(id) on delete cascade,
  sort_order    integer not null default 0,
  primary key (collection_id, product_id)
);

create index collection_products_product_idx
  on public.collection_products (product_id);

-- ------------------------------------------------------------------- looks

create table public.looks (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (length(btrim(title)) > 0),
  story         text,
  tags          text[] not null default '{}',
  is_published  boolean not null default false,
  is_fixture    boolean not null default false,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create trigger looks_set_updated_at
  before update on public.looks
  for each row execute function public.set_updated_at();

create index looks_published_idx
  on public.looks (sort_order, created_at desc)
  where is_published;

create table public.look_media (
  id            uuid primary key default gen_random_uuid(),
  look_id       uuid not null references public.looks(id) on delete cascade,
  storage_path  text,
  alt_text      text not null default '',
  width         integer check (width is null or width > 0),
  height        integer check (height is null or height > 0),
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now()
);

create index look_media_look_idx
  on public.look_media (look_id, sort_order);

create table public.look_products (
  look_id     uuid not null references public.looks(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  sort_order  integer not null default 0,
  primary key (look_id, product_id)
);

-- ---------------------------------------------------------------- services

create table public.services (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null check (length(btrim(title)) > 0),
  summary          text,
  description      text,
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  from_price_minor integer check (from_price_minor is null or from_price_minor >= 0),
  currency         text check (currency is null or currency ~ '^[A-Z]{3}$'),
  is_published     boolean not null default false,
  is_fixture       boolean not null default false,
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

create table public.look_services (
  look_id     uuid not null references public.looks(id) on delete cascade,
  service_id  uuid not null references public.services(id) on delete cascade,
  primary key (look_id, service_id)
);

-- ------------------------------------------------------- access control

alter table public.products            enable row level security;
alter table public.product_media       enable row level security;
alter table public.collections         enable row level security;
alter table public.collection_products enable row level security;
alter table public.looks               enable row level security;
alter table public.look_media          enable row level security;
alter table public.look_products       enable row level security;
alter table public.services            enable row level security;
alter table public.look_services       enable row level security;

-- Remove the default grants. Policies alone do not remove them.
revoke all on public.products            from anon, authenticated;
revoke all on public.product_media       from anon, authenticated;
revoke all on public.collections         from anon, authenticated;
revoke all on public.collection_products from anon, authenticated;
revoke all on public.looks               from anon, authenticated;
revoke all on public.look_media          from anon, authenticated;
revoke all on public.look_products       from anon, authenticated;
revoke all on public.services            from anon, authenticated;
revoke all on public.look_services       from anon, authenticated;

-- Public visitors may read, nothing else.
grant select on public.products            to anon, authenticated;
grant select on public.product_media       to anon, authenticated;
grant select on public.collections         to anon, authenticated;
grant select on public.collection_products to anon, authenticated;
grant select on public.looks               to anon, authenticated;
grant select on public.look_media          to anon, authenticated;
grant select on public.look_products       to anon, authenticated;
grant select on public.services            to anon, authenticated;
grant select on public.look_services       to anon, authenticated;

create policy "Published products are readable"
  on public.products for select to anon, authenticated
  using (is_published);

create policy "Media of published products is readable"
  on public.product_media for select to anon, authenticated
  using (exists (
    select 1 from public.products p
    where p.id = product_media.product_id and p.is_published
  ));

create policy "Published collections are readable"
  on public.collections for select to anon, authenticated
  using (is_published);

create policy "Published looks are readable"
  on public.looks for select to anon, authenticated
  using (is_published);

create policy "Media of published looks is readable"
  on public.look_media for select to anon, authenticated
  using (exists (
    select 1 from public.looks l
    where l.id = look_media.look_id and l.is_published
  ));

create policy "Published services are readable"
  on public.services for select to anon, authenticated
  using (is_published);

-- Join tables carry only identifiers and ordering, never titles or copy.
-- The application always resolves them alongside their published parent, and
-- the parent tables above are the authority on publication. Granting read here
-- keeps the policies simple and avoids recursive policy evaluation.
create policy "Join rows are readable"
  on public.collection_products for select to anon, authenticated using (true);
create policy "Join rows are readable"
  on public.look_products       for select to anon, authenticated using (true);
create policy "Join rows are readable"
  on public.look_services       for select to anon, authenticated using (true);

-- --------------------------------------------------------------- storage

insert into storage.buckets (id, name, public)
values ('product-media', 'product-media', true)
on conflict (id) do nothing;

create policy "Public read for product media"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'product-media');

-- No insert, update, or delete policy exists for clients.
-- Uploads happen through the dashboard or a future authenticated admin batch.