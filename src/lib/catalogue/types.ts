// Row shapes as they arrive from Supabase (snake_case).
export type ProductMediaRow = {
  storage_path: string | null;
  alt_text: string;
  width: number | null;
  height: number | null;
  sort_order: number;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price_minor: number | null;
  currency: string | null;
  shape: string | null;
  length: string | null;
  finish: string | null;
  is_fixture: boolean;
  product_media: ProductMediaRow[];
};

export type CollectionRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  is_fixture: boolean;
};

export type LookRow = {
  id: string;
  slug: string;
  title: string;
  story: string | null;
  tags: string[];
  is_fixture: boolean;
  look_media: ProductMediaRow[];
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  duration_minutes: number | null;
  from_price_minor: number | null;
  currency: string | null;
  is_fixture: boolean;
};

// Application types (camelCase). Only these leave the data layer.
export type ProductMedia = {
  storagePath: string | null;
  altText: string;
  width: number | null;
  height: number | null;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceMinor: number | null;
  currency: string | null;
  shape: string | null;
  length: string | null;
  finish: string | null;
  isFixture: boolean;
  media: ProductMedia[];
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  isFixture: boolean;
};

export type CollectionWithProducts = Collection & { products: Product[] };

export type Look = {
  id: string;
  slug: string;
  title: string;
  story: string | null;
  tags: string[];
  isFixture: boolean;
  media: ProductMedia[];
};

export type LookWithRelations = Look & {
  products: Product[];
  services: Service[];
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  durationMinutes: number | null;
  fromPriceMinor: number | null;
  currency: string | null;
  isFixture: boolean;
};

export class CatalogueError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "CatalogueError";
    this.cause = cause;
  }
}