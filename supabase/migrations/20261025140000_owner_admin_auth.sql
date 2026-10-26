-- 1. Admins Table
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
revoke all on public.admins from anon, authenticated;
-- No public access. Membership must be provisioned manually via SQL Editor.

-- 2. Owner Check Function
create or replace function public.is_owner()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (select 1 from public.admins where user_id = auth.uid());
end;
$$;

revoke execute on function public.is_owner() from public, anon;
grant execute on function public.is_owner() to authenticated;

-- 3. Primary Tables (products, collections, looks, services)
grant insert, update, delete on public.products to authenticated;
create policy "Owners can read all products" on public.products for select to authenticated using (public.is_owner());
create policy "Owners can insert products" on public.products for insert to authenticated with check (public.is_owner());
create policy "Owners can update products" on public.products for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "Owners can delete products" on public.products for delete to authenticated using (public.is_owner());

grant insert, update, delete on public.collections to authenticated;
create policy "Owners can read all collections" on public.collections for select to authenticated using (public.is_owner());
create policy "Owners can insert collections" on public.collections for insert to authenticated with check (public.is_owner());
create policy "Owners can update collections" on public.collections for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "Owners can delete collections" on public.collections for delete to authenticated using (public.is_owner());

grant insert, update, delete on public.looks to authenticated;
create policy "Owners can read all looks" on public.looks for select to authenticated using (public.is_owner());
create policy "Owners can insert looks" on public.looks for insert to authenticated with check (public.is_owner());
create policy "Owners can update looks" on public.looks for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "Owners can delete looks" on public.looks for delete to authenticated using (public.is_owner());

grant insert, update, delete on public.services to authenticated;
create policy "Owners can read all services" on public.services for select to authenticated using (public.is_owner());
create policy "Owners can insert services" on public.services for insert to authenticated with check (public.is_owner());
create policy "Owners can update services" on public.services for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "Owners can delete services" on public.services for delete to authenticated using (public.is_owner());

-- 4. Media Tables (product_media, look_media)
grant insert, update, delete on public.product_media to authenticated;
create policy "Owners can read all product media" on public.product_media for select to authenticated using (public.is_owner());
create policy "Owners can insert product media" on public.product_media for insert to authenticated with check (public.is_owner());
create policy "Owners can update product media" on public.product_media for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "Owners can delete product media" on public.product_media for delete to authenticated using (public.is_owner());

grant insert, update, delete on public.look_media to authenticated;
create policy "Owners can read all look media" on public.look_media for select to authenticated using (public.is_owner());
create policy "Owners can insert look media" on public.look_media for insert to authenticated with check (public.is_owner());
create policy "Owners can update look media" on public.look_media for update to authenticated using (public.is_owner()) with check (public.is_owner());
create policy "Owners can delete look media" on public.look_media for delete to authenticated using (public.is_owner());

-- 5. Relationship Tables (collection_products, look_products, look_services)
grant insert, delete on public.collection_products to authenticated;
create policy "Owners can read all collection products" on public.collection_products for select to authenticated using (public.is_owner());
create policy "Owners can insert collection products" on public.collection_products for insert to authenticated with check (public.is_owner());
create policy "Owners can delete collection products" on public.collection_products for delete to authenticated using (public.is_owner());

grant insert, delete on public.look_products to authenticated;
create policy "Owners can read all look products" on public.look_products for select to authenticated using (public.is_owner());
create policy "Owners can insert look products" on public.look_products for insert to authenticated with check (public.is_owner());
create policy "Owners can delete look products" on public.look_products for delete to authenticated using (public.is_owner());

grant insert, delete on public.look_services to authenticated;
create policy "Owners can read all look services" on public.look_services for select to authenticated using (public.is_owner());
create policy "Owners can insert look services" on public.look_services for insert to authenticated with check (public.is_owner());
create policy "Owners can delete look services" on public.look_services for delete to authenticated using (public.is_owner());

-- 6. Storage RLS
grant insert, update, delete on storage.objects to authenticated;
create policy "Owner upload media" on storage.objects for insert to authenticated with check (bucket_id = 'product-media' and public.is_owner());
create policy "Owner update media" on storage.objects for update to authenticated using (bucket_id = 'product-media' and public.is_owner());
create policy "Owner delete media" on storage.objects for delete to authenticated using (bucket_id = 'product-media' and public.is_owner());