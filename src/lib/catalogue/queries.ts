// server-only module
import { createPublicClient } from "@/lib/supabase/public";
import {
  CatalogueError,
  Collection,
  CollectionWithProducts,
  CollectionRow,
  Look,
  LookWithRelations,
  LookRow,
  Product,
  ProductMedia,
  ProductMediaRow,
  ProductRow,
  Service,
  ServiceRow,
} from "./types";

// ------------------------------------------------------------ mappers

function mapMedia(rows: ProductMediaRow[] | null | undefined): ProductMedia[] {
  if (!rows || rows.length === 0) return [];
  return [...rows]
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((r) => ({
      storagePath: r.storage_path,
      altText: r.alt_text,
      width: r.width,
      height: r.height,
    }));
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    priceMinor: row.price_minor,
    currency: row.currency,
    shape: row.shape,
    length: row.length,
    finish: row.finish,
    isFixture: row.is_fixture,
    media: mapMedia(row.product_media),
  };
}

function mapCollection(row: CollectionRow): Collection {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    isFixture: row.is_fixture,
  };
}

function mapLook(row: LookRow): Look {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    story: row.story,
    tags: row.tags ?? [],
    isFixture: row.is_fixture,
    media: mapMedia(row.look_media),
  };
}

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    description: row.description,
    durationMinutes: row.duration_minutes,
    fromPriceMinor: row.from_price_minor,
    currency: row.currency,
    isFixture: row.is_fixture,
  };
}

// --------------------------------------------------------------- column lists

const PRODUCT_COLS = `
  id, slug, name, description, price_minor, currency, shape, length, finish, is_fixture,
  product_media (storage_path, alt_text, width, height, sort_order)
`;

const LOOK_COLS = `
  id, slug, title, story, tags, is_fixture,
  look_media (storage_path, alt_text, width, height, sort_order)
`;

const SERVICE_COLS = `
  id, slug, title, summary, description, duration_minutes, from_price_minor, currency, is_fixture
`;

const COLLECTION_COLS = `id, slug, title, description, is_fixture`;

// ------------------------------------------------------------ products

export type ProductFilters = {
  collection?: string;
  shape?: string;
  length?: string;
};

export async function getProducts(filters: ProductFilters = {}): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(PRODUCT_COLS)
    .eq("is_published", true)
    .order("sort_order")
    .order("name");

  if (filters.shape) query = query.eq("shape", filters.shape);
  if (filters.length) query = query.eq("length", filters.length);

  if (filters.collection) {
    const { data: col, error: colErr } = await supabase
      .from("collections")
      .select("id")
      .eq("slug", filters.collection)
      .eq("is_published", true)
      .maybeSingle();

    if (colErr) throw new CatalogueError("Failed to resolve collection", colErr);
    if (!col) return []; // Unknown or unpublished collection => no products

    const { data: links, error: linkErr } = await supabase
      .from("collection_products")
      .select("product_id")
      .eq("collection_id", col.id);

    if (linkErr) throw new CatalogueError("Failed to load collection products", linkErr);
    if (!links || links.length === 0) return [];

    query = query.in("id", links.map((l) => l.product_id));
  }

  const { data, error } = await query;
  if (error) throw new CatalogueError("Failed to load products", error);
  return (data as unknown as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_COLS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) throw new CatalogueError("Failed to load product", error);
  if (!data) return null;
  return mapProduct(data as unknown as ProductRow);
}

// ---------------------------------------------------------- collections

export async function getCollections(): Promise<Collection[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("collections")
    .select(COLLECTION_COLS)
    .eq("is_published", true)
    .order("sort_order");

  if (error) throw new CatalogueError("Failed to load collections", error);
  return (data as unknown as CollectionRow[]).map(mapCollection);
}

export async function getCollectionByHandle(slug: string): Promise<CollectionWithProducts | null> {
  const supabase = createPublicClient();
  const { data: col, error: colErr } = await supabase
    .from("collections")
    .select(COLLECTION_COLS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (colErr) throw new CatalogueError("Failed to load collection", colErr);
  if (!col) return null;

  const { data: links, error: linkErr } = await supabase
    .from("collection_products")
    .select("product_id, sort_order")
    .eq("collection_id", col.id)
    .order("sort_order");

  if (linkErr) throw new CatalogueError("Failed to load collection products", linkErr);

  const base = mapCollection(col as unknown as CollectionRow);
  if (!links || links.length === 0) return { ...base, products: [] };

  const ids = links.map((l) => l.product_id);
  const { data: rows, error: pErr } = await supabase
    .from("products")
    .select(PRODUCT_COLS)
    .in("id", ids)
    .eq("is_published", true);

  if (pErr) throw new CatalogueError("Failed to load collection products", pErr);

  const byId = new Map((rows as unknown as ProductRow[]).map((r) => [r.id, r]));
  const products = links
    .map((l) => byId.get(l.product_id))
    .filter((r): r is ProductRow => Boolean(r))
    .map(mapProduct);

  return { ...base, products };
}

// ---------------------------------------------------------------- looks

export async function getLooks(): Promise<Look[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("looks")
    .select(LOOK_COLS)
    .eq("is_published", true)
    .order("sort_order");

  if (error) throw new CatalogueError("Failed to load looks", error);
  return (data as unknown as LookRow[]).map(mapLook);
}

export async function getLookBySlug(slug: string): Promise<LookWithRelations | null> {
  const supabase = createPublicClient();
  const { data: look, error: lookErr } = await supabase
    .from("looks")
    .select(LOOK_COLS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (lookErr) throw new CatalogueError("Failed to load look", lookErr);
  if (!look) return null;

  const base = mapLook(look as unknown as LookRow);

  // Linked products, preserving look_products.sort_order
  const { data: lp, error: lpErr } = await supabase
    .from("look_products")
    .select("product_id, sort_order")
    .eq("look_id", base.id)
    .order("sort_order");

  if (lpErr) throw new CatalogueError("Failed to load look products", lpErr);

  let products: Product[] = [];
  if (lp && lp.length > 0) {
    const { data: rows, error: pErr } = await supabase
      .from("products")
      .select(PRODUCT_COLS)
      .in("id", lp.map((l) => l.product_id))
      .eq("is_published", true);
    if (pErr) throw new CatalogueError("Failed to load look products", pErr);

    const byId = new Map((rows as unknown as ProductRow[]).map((r) => [r.id, r]));
    products = lp
      .map((l) => byId.get(l.product_id))
      .filter((r): r is ProductRow => Boolean(r))
      .map(mapProduct);
  }

  // Linked services (no ordering column in schema; alphabetical)
  const { data: ls, error: lsErr } = await supabase
    .from("look_services")
    .select("service_id")
    .eq("look_id", base.id);

  if (lsErr) throw new CatalogueError("Failed to load look services", lsErr);

  let services: Service[] = [];
  if (ls && ls.length > 0) {
    const { data: rows, error: sErr } = await supabase
      .from("services")
      .select(SERVICE_COLS)
      .in("id", ls.map((l) => l.service_id))
      .eq("is_published", true)
      .order("title");
    if (sErr) throw new CatalogueError("Failed to load look services", sErr);
    services = (rows as unknown as ServiceRow[]).map(mapService);
  }

  return { ...base, products, services };
}

// ------------------------------------------------------------- services

export async function getServices(): Promise<Service[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_COLS)
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw new CatalogueError("Failed to load services", error);
  return (data as unknown as ServiceRow[]).map(mapService);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("services")
    .select(SERVICE_COLS)
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw new CatalogueError("Failed to load service", error);
  if (!data) return null;
  return mapService(data as unknown as ServiceRow);
}