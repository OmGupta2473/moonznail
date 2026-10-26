-- MoonzNails development fixtures.
-- All rows: is_fixture = true, is_published = true, storage_path = null.
-- Fixture currency is USD — not a business decision.

-- Use deterministic UUIDs via md5 hash for re-runnability
-- Products
with product_data as (
  insert into public.products (id, slug, name, description, price_minor, currency, shape, length, finish, is_published, is_fixture, sort_order)
  values
    (md5('product-rosewater-almond')::uuid, 'rosewater-almond', 'Rosewater Almond', 'Soft pink almond press-on nails with a pearlescent finish. Hand-finished for a natural look.', 3200, 'USD', 'Almond', 'Short', 'Pearlescent', true, true, 1),
    (md5('product-moonlit-chrome')::uuid, 'moonlit-chrome', 'Moonlit Chrome', 'Mirror-chrome square nails that shift from silver to rose in the light. High-impact evening wear.', 3800, 'USD', 'Square', 'Medium', 'Chrome', true, true, 2),
    (md5('product-blush-square')::uuid, 'blush-square', 'Blush Square', 'Classic blush pink square tips. Everyday elegance with a gel-like shine.', 3000, 'USD', 'Square', 'Short', 'Gloss', true, true, 3),
    (md5('product-pearl-round')::uuid, 'pearl-round', 'Pearl Round', 'Creamy white round nails with a subtle shimmer. Bridal-ready and timeless.', 3400, 'USD', 'Round', 'Medium', 'Shimmer', true, true, 4)
  on conflict (slug) do nothing
)
select 1;

-- Collections
with collection_data as (
  insert into public.collections (id, slug, title, description, is_published, is_fixture, sort_order)
  values
    (md5('collection-new-arrivals')::uuid, 'new-arrivals', 'New Arrivals', 'Fresh from the studio. The latest designs, first to wear.', true, true, 1),
    (md5('collection-everyday-sets')::uuid, 'everyday-sets', 'Everyday Sets', 'Reliable favourites for daily wear. Comfort meets style.', true, true, 2)
  on conflict (slug) do nothing
)
select 1;

-- Collection products (distribute 4 products across 2 collections)
with cp_data as (
  insert into public.collection_products (collection_id, product_id, sort_order)
  select c.id, p.id, row_number() over (partition by c.id order by p.sort_order)
  from public.collections c
  cross join public.products p
  where c.slug = 'new-arrivals' and p.slug in ('rosewater-almond', 'moonlit-chrome')
     or c.slug = 'everyday-sets' and p.slug in ('blush-square', 'pearl-round')
  on conflict (collection_id, product_id) do nothing
)
select 1;

-- Looks
with look_data as (
  insert into public.looks (id, slug, title, story, tags, is_published, is_fixture, sort_order)
  values
    (md5('look-soft-mornings')::uuid, 'soft-mornings', 'Soft Mornings', 'A quiet start to the day. Pale pink and pearl tones for the moments before coffee.', '{pink,pearl,everyday,bridal}', true, true, 1),
    (md5('look-evening-glow')::uuid, 'evening-glow', 'Evening Glow', 'Chrome catches the last light. Bold square tips for nights that linger.', '{chrome,square,evening,statement}', true, true, 2),
    (md5('look-weekend-essentials')::uuid, 'weekend-essentials', 'Weekend Essentials', 'Blush and round — the pair that works with everything. Low maintenance, high confidence.', '{blush,round,casual,versatile}', true, true, 3)
  on conflict (slug) do nothing
)
select 1;

-- Look media (placeholder rows, storage_path null)
with lm_data as (
  insert into public.look_media (look_id, alt_text, sort_order)
  select l.id, l.title || ' hero image', 1
  from public.looks l
  where l.is_fixture
  on conflict do nothing
)
select 1;

-- Look products (link looks to products)
with lp_data as (
  insert into public.look_products (look_id, product_id, sort_order)
  values
    -- Soft Mornings -> rosewater-almond, pearl-round
    ((select id from public.looks where slug = 'soft-mornings'), (select id from public.products where slug = 'rosewater-almond'), 1),
    ((select id from public.looks where slug = 'soft-mornings'), (select id from public.products where slug = 'pearl-round'), 2),
    -- Evening Glow -> moonlit-chrome
    ((select id from public.looks where slug = 'evening-glow'), (select id from public.products where slug = 'moonlit-chrome'), 1),
    -- Weekend Essentials -> blush-square, rosewater-almond
    ((select id from public.looks where slug = 'weekend-essentials'), (select id from public.products where slug = 'blush-square'), 1),
    ((select id from public.looks where slug = 'weekend-essentials'), (select id from public.products where slug = 'rosewater-almond'), 2)
  on conflict (look_id, product_id) do nothing
)
select 1;

-- Services
with service_data as (
  insert into public.services (id, slug, title, summary, description, duration_minutes, from_price_minor, currency, is_published, is_fixture, sort_order)
  values
    (md5('service-custom-set')::uuid, 'custom-set', 'Custom Press-On Set', 'A set designed for your nail shape and length.', 'One-on-one consultation, custom sizing kit, and a hand-painted set made to your specifications. Includes two rounds of revisions.', 60, 8500, 'USD', true, true, 1),
    (md5('service-bridal-trial')::uuid, 'bridal-trial', 'Bridal Trial & Day-Of Set', 'Two sets: one for the trial, one for the wedding day.', 'Includes custom colour matching to your dress, express shipping for the day-of set, and a care kit. Trial scheduled 4-6 weeks before the wedding.', 90, 15000, 'USD', true, true, 2)
  on conflict (slug) do nothing
)
select 1;

-- Look services (link one service to a look)
with ls_data as (
  insert into public.look_services (look_id, service_id)
  values
    ((select id from public.looks where slug = 'soft-mornings'), (select id from public.services where slug = 'bridal-trial'))
  on conflict (look_id, service_id) do nothing
)
select 1;