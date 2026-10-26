begin;

grant insert, update, delete on public.products to authenticated;
grant insert, update, delete on public.product_media to authenticated;
grant insert, update, delete on public.collections to authenticated;
grant insert, update, delete on public.looks to authenticated;
grant insert, update, delete on public.services to authenticated;
grant insert, update, delete on public.collection_products to authenticated;
grant insert, update, delete on public.look_products to authenticated;
grant insert, update, delete on public.look_services to authenticated;

commit;