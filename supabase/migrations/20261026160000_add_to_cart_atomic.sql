begin;

create or replace function public.add_to_cart_atomic(
  p_cart_id uuid,
  p_product_id uuid,
  p_quantity integer
) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_quantity is null or p_quantity < 1 or p_quantity > 10 then
    raise exception 'invalid_quantity';
  end if;

  insert into public.cart_items (cart_id, product_id, quantity)
  values (p_cart_id, p_product_id, p_quantity)
  on conflict (cart_id, product_id) do update
    set quantity = public.cart_items.quantity + excluded.quantity
    where public.cart_items.quantity + excluded.quantity <= 10;

  if not found then
    raise exception 'quantity_exceeded';
  end if;
end;
$$;

revoke all on function public.add_to_cart_atomic(uuid, uuid, integer)
  from public, anon, authenticated;

grant execute on function public.add_to_cart_atomic(uuid, uuid, integer)
  to service_role;

commit;