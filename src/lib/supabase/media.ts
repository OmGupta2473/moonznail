import { supabaseEnv } from "@/lib/env";

// Encodes each path segment while preserving slash separators.
// Rejects '..' to prevent path traversal if a path is ever user-supplied.
export function publicMediaUrl(storagePath: string | null): string | null {
  if (!storagePath) return null;
  const segments = storagePath.split("/").filter((s) => s.length > 0 && s !== "." && s !== "..");
  if (segments.length === 0) return null;
  const encoded = segments.map(encodeURIComponent).join("/");
  const { url } = supabaseEnv();
  return `${url}/storage/v1/object/public/product-media/${encoded}`;
}