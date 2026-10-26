begin;

-- ----------------------------------------------------------------- carts

create table public.carts (
  id            uuid primary key default gen_random_uuid(),
  session_hash  text unique not null,
  currency      text not null default 'INR' check (currency ~ '^[A-Z]{3}$'),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.carts enable row level security;
revoke all on public.carts from anon, authenticated;

-- ------------------------------------------------------------ cart_items

create table public.cart_items (
  id          uuid primary key default gen_random_uuid(),
  cart_id     uuid not null references public.carts(id) on delete cascade,
  product_id  uuid not null references public.products(id) on delete cascade,
  quantity    integer not null check (quantity > 0 and quantity <= 10),
  created_at  timestamptz not null default now(),
  unique (cart_id, product_id)
);

alter table public.cart_items enable row level security;
revoke all on public.cart_items from anon, authenticated;

-- --------------------------------------------------------------- orders

create table public.orders (
  id                    uuid primary key default gen_random_uuid(),
  order_number          text unique not null,
  access_token_hash     text unique not null,
  email                 text not null,
  customer_name         text not null,
  shipping_address      jsonb not null,
  currency              text not null default 'INR' check (currency ~ '^[A-Z]{3}$'),
  subtotal_minor        integer not null check (subtotal_minor >= 0),
  total_minor           integer not null check (total_minor >= 0),
  payment_status        text not null default 'pending'
                          check (payment_status in ('pending','paid','failed','refunded')),
  fulfilment_status     text not null default 'unfulfilled'
                          check (fulfilment_status in ('unfulfilled','processing','shipped','delivered','cancelled')),
  razorpay_order_id     text unique,
  razorpay_payment_id   text,
  razorpay_env          text not null check (razorpay_env in ('test','live')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index orders_email_idx on public.orders (email);
create index orders_payment_status_idx on public.orders (payment_status);

alter table public.orders enable row level security;
revoke all on public.orders from anon, authenticated;
grant select on public.orders to authenticated;

create policy "Owner can read all orders"
  on public.orders for select to authenticated
  using (public.is_owner());

-- ----------------------------------------------------------- order_items

create table public.order_items (
  id                uuid primary key default gen_random_uuid(),
  order_id          uuid not null references public.orders(id) on delete cascade,
  product_id        uuid not null references public.products(id),
  product_name      text not null,
  unit_price_minor  integer not null check (unit_price_minor >= 0),
  quantity          integer not null check (quantity > 0),
  line_total_minor  integer not null check (line_total_minor >= 0),
  created_at        timestamptz not null default now()
);

create index order_items_order_idx on public.order_items (order_id);

alter table public.order_items enable row level security;
revoke all on public.order_items from anon, authenticated;
grant select on public.order_items to authenticated;

create policy "Owner can read all order items"
  on public.order_items for select to authenticated
  using (public.is_owner());

-- ------------------------------------------------------- razorpay_events

create table public.razorpay_events (
  event_id      text primary key,
  event_type    text not null,
  processed_at  timestamptz not null default now()
);

alter table public.razorpay_events enable row level security;
revoke all on public.razorpay_events from anon, authenticated;

-- --------------------------------------------------------------- triggers

create trigger carts_set_updated_at
  before update on public.carts
  for each row execute function public.set_updated_at();

create trigger orders_set_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

commit;