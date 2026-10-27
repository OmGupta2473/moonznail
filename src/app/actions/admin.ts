"use server";

import { verifyOwner } from "@/lib/admin-auth";
import { revalidatePath } from "next/cache";

export type AdminResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; reason: "unauthorized" | "invalid_input" | "db_error" | "server_error"; message: string };

function getString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (value === null || value === undefined) return null;
  if (value instanceof File) return null;
  return value.toString();
}
function getFiles(formData: FormData, key: string): File[] {
  return formData.getAll(key).filter((v) => v instanceof File && v.size > 0) as File[];
}


function getNumber(formData: FormData, key: string): number | null {
  const value = formData.get(key);
  if (value === null || value === undefined) return null;
  if (value instanceof File) return null;
  const num = Number(value.toString());
  return isNaN(num) ? null : num;
}

function getBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "true";
}

function validateUUID(id: string | null): string | null {
  // null means "no id provided" (create case) — not an error
  if (id === null) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return "Invalid ID format";
  }
  return null;
}

function validatePriceMinor(value: number | null): string | null {
  if (value === null) return "Price is required";
  if (isNaN(value) || value < 0) return "Price must be a non-negative number";
  return null;
}

function validateDuration(value: number | null): string | null {
  if (value === null || value === undefined) return null;
  if (isNaN(value) || value <= 0) return "Duration must be a positive number";
  return null;
}

function validateCurrency(value: string | null): string | null {
  if (!value) return null;
  if (!/^[A-Z]{3}$/.test(value)) return "Currency must be a 3-letter ISO code";
  return null;
}

async function handleUpload(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  file: File,
  bucket: string = "product-media"
): Promise<string> {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only JPEG, PNG, WebP, and MP4 are allowed.");
  }
  if (file.size > 16 * 1024 * 1024) {
    throw new Error("File size must be less than 16MB.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "webp";
  const fileName = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

  return fileName;
}

export async function createUpdateProduct(formData: FormData): Promise<AdminResult<{ id: string }>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const id = getString(formData, "id") || "";
  const isNew = !id;
  const idErr = isNew ? null : validateUUID(id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };
  const validatedId = isNew ? crypto.randomUUID() : id;

  const name = getString(formData, "name")?.trim();
  if (!name) return { ok: false, reason: "invalid_input", message: "Name is required." };

  const slug = getString(formData, "slug")?.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, reason: "invalid_input", message: "Slug must be lowercase, hyphens only." };
  }

  const description = getString(formData, "description")?.trim() || null;
  const priceMinor = getNumber(formData, "price_minor");
  const priceErr = validatePriceMinor(priceMinor);
  if (priceErr) return { ok: false, reason: "invalid_input", message: priceErr };
  const currency = getString(formData, "currency")?.trim().toUpperCase();
  const currencyErr = validateCurrency(currency ?? null);
  if (currencyErr) return { ok: false, reason: "invalid_input", message: currencyErr };
  const shape = getString(formData, "shape")?.trim() || null;
  const length = getString(formData, "length")?.trim() || null;
  const finish = getString(formData, "finish")?.trim() || null;
  const isPublished = getBoolean(formData, "is_published");
  const sortOrder = getNumber(formData, "sort_order") || 0;

  const mediaFiles = getFiles(formData, "media");

  try {
    // Upload all media files
    const uploadedPaths: string[] = [];
    for (const mediaFile of mediaFiles) {
      const storagePath = await handleUpload(supabase, mediaFile);
      uploadedPaths.push(storagePath);
    }

    if (isNew) {
      const { error } = await supabase.from("products").insert({
        id: validatedId,
        slug,
        name,
        description,
        price_minor: priceMinor,
        currency,
        shape,
        length,
        finish,
        is_published: isPublished,
        is_fixture: false,
        sort_order: sortOrder,
      });

      if (error) throw error;

      // Insert all media files
      for (let i = 0; i < uploadedPaths.length; i++) {
        const { error: mediaError } = await supabase.from("product_media").insert({
          product_id: validatedId,
          storage_path: uploadedPaths[i],
          alt_text: name,
          sort_order: i,
        });
        if (mediaError) {
          // Clean up uploaded files
          await supabase.storage.from("product-media").remove(uploadedPaths);
          throw mediaError;
        }
      }
    } else {
      const { error } = await supabase.from("products").update({
        name,
        slug,
        description,
        price_minor: priceMinor,
        currency,
        shape,
        length,
        finish,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      }).eq("id", validatedId);

      if (error) throw error;

      // If new media files uploaded, add them
      if (uploadedPaths.length > 0) {
        // Get current max sort_order
        const { data: existingMedia } = await supabase
          .from("product_media")
          .select("sort_order")
          .eq("product_id", validatedId)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle();

        let nextSortOrder = (existingMedia?.sort_order ?? -1) + 1;

        for (const path of uploadedPaths) {
          const { error: mediaError } = await supabase.from("product_media").insert({
            product_id: validatedId,
            storage_path: path,
            alt_text: name,
            sort_order: nextSortOrder++,
          });
          if (mediaError) {
            // Clean up
            await supabase.storage.from("product-media").remove(uploadedPaths);
            throw mediaError;
          }
        }
      }
    }
  } catch (err: unknown) {
    console.error("createUpdateProduct failed", err);
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return { ok: false, reason: "invalid_input", message: "A record with this slug already exists. Choose a different slug." };
    }
    return { ok: false, reason: "db_error", message: "Save failed. Please try again." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/products/" + slug);
  revalidatePath("/");
  return { ok: true, data: { id: validatedId } };
}

export async function createUpdateLook(formData: FormData): Promise<AdminResult<{ id: string }>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const id = getString(formData, "id") || "";
  const isNew = !id;
  const idErr = validateUUID(isNew ? null : id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };
  const validatedId = isNew ? crypto.randomUUID() : id;

  const title = getString(formData, "title")?.trim();
  if (!title) return { ok: false, reason: "invalid_input", message: "Title is required." };

  const slug = getString(formData, "slug")?.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, reason: "invalid_input", message: "Slug must be lowercase, hyphens only." };
  }

  const story = getString(formData, "story")?.trim() || null;
  const tagsString = getString(formData, "tags") || "";
  const tags = tagsString.split(",").map(t => t.trim()).filter(Boolean);
  const isPublished = getBoolean(formData, "is_published");
  const sortOrder = getNumber(formData, "sort_order") || 0;

  const mediaFiles = getFiles(formData, "media");

  try {
    const uploadedPaths: string[] = [];
    for (const mediaFile of mediaFiles) {
      const storagePath = await handleUpload(supabase, mediaFile);
      uploadedPaths.push(storagePath);
    }

    if (isNew) {
      const { error } = await supabase.from("looks").insert({
        id: validatedId,
        slug,
        title,
        story,
        tags,
        is_published: isPublished,
        is_fixture: false,
        sort_order: sortOrder,
      });

      if (error) throw error;

      for (let i = 0; i < uploadedPaths.length; i++) {
        const { error: mediaError } = await supabase.from("look_media").insert({
          look_id: validatedId,
          storage_path: uploadedPaths[i],
          alt_text: title,
          sort_order: i,
        });
        if (mediaError) {
          await supabase.storage.from("product-media").remove(uploadedPaths);
          throw mediaError;
        }
      }
    } else {
      const { error } = await supabase.from("looks").update({
        title,
        slug,
        story,
        tags,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      }).eq("id", validatedId);

      if (error) throw error;

      if (uploadedPaths.length > 0) {
        const { data: existingMedia } = await supabase
          .from("look_media")
          .select("sort_order")
          .eq("look_id", validatedId)
          .order("sort_order", { ascending: false })
          .limit(1)
          .maybeSingle();

        let nextSortOrder = (existingMedia?.sort_order ?? -1) + 1;

        for (const path of uploadedPaths) {
          const { error: mediaError } = await supabase.from("look_media").insert({
            look_id: validatedId,
            storage_path: path,
            alt_text: title,
            sort_order: nextSortOrder++,
          });
          if (mediaError) {
            await supabase.storage.from("product-media").remove(uploadedPaths);
            throw mediaError;
          }
        }
      }
    }
  } catch (err: unknown) {
    console.error("createUpdateLook failed", err);
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return { ok: false, reason: "invalid_input", message: "A record with this slug already exists. Choose a different slug." };
    }
    return { ok: false, reason: "db_error", message: "Save failed. Please try again." };
  }

  revalidatePath("/admin/looks");
  revalidatePath("/looks");
  revalidatePath("/looks/" + slug);
  revalidatePath("/");
  return { ok: true, data: { id: validatedId } };
}

export async function createUpdateService(formData: FormData): Promise<AdminResult<{ id: string }>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const id = getString(formData, "id") || "";
  const isNew = !id;
  const idErr = validateUUID(isNew ? null : id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };
  const validatedId = isNew ? crypto.randomUUID() : id;

  const title = getString(formData, "title")?.trim();
  if (!title) return { ok: false, reason: "invalid_input", message: "Title is required." };

  const slug = getString(formData, "slug")?.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, reason: "invalid_input", message: "Slug must be lowercase, hyphens only." };
  }

  const summary = getString(formData, "summary")?.trim() || null;
  const description = getString(formData, "description")?.trim() || null;
  const durationMinutes = getNumber(formData, "duration_minutes");
  const durationErr = validateDuration(durationMinutes);
  if (durationErr) return { ok: false, reason: "invalid_input", message: durationErr };
  const fromPriceMinor = getNumber(formData, "from_price_minor");
  const priceErr = validatePriceMinor(fromPriceMinor);
  if (priceErr) return { ok: false, reason: "invalid_input", message: priceErr };
  const currency = getString(formData, "currency")?.trim().toUpperCase();
  const currencyErr = validateCurrency(currency ?? null);
  if (currencyErr) return { ok: false, reason: "invalid_input", message: currencyErr };
  const isPublished = getBoolean(formData, "is_published");
  const sortOrder = getNumber(formData, "sort_order") || 0;

  try {
    if (isNew) {
      const { error } = await supabase.from("services").insert({
        id: validatedId,
        slug,
        title,
        summary,
        description,
        duration_minutes: durationMinutes,
        from_price_minor: fromPriceMinor,
        currency,
        is_published: isPublished,
        is_fixture: false,
        sort_order: sortOrder,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase.from("services").update({
        title,
        slug,
        summary,
        description,
        duration_minutes: durationMinutes,
        from_price_minor: fromPriceMinor,
        currency,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      }).eq("id", validatedId);

      if (error) throw error;
    }
  } catch (err: unknown) {
    console.error("createUpdateService failed", err);
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return { ok: false, reason: "invalid_input", message: "A record with this slug already exists. Choose a different slug." };
    }
    return { ok: false, reason: "db_error", message: "Save failed. Please try again." };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/services/" + slug);
  revalidatePath("/");
  return { ok: true, data: { id: validatedId } };
}

export async function createUpdateCollection(formData: FormData): Promise<AdminResult<{ id: string }>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const id = getString(formData, "id") || "";
  const isNew = !id;
  const idErr = validateUUID(isNew ? null : id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };
  const validatedId = isNew ? crypto.randomUUID() : id;

  const title = getString(formData, "title")?.trim();
  if (!title) return { ok: false, reason: "invalid_input", message: "Title is required." };

  const slug = getString(formData, "slug")?.trim().toLowerCase();
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, reason: "invalid_input", message: "Slug must be lowercase, hyphens only." };
  }

  const description = getString(formData, "description")?.trim() || null;
  const isPublished = getBoolean(formData, "is_published");
 const sortOrder = getNumber(formData, "sort_order") || 0;

  try {
    if (isNew) {
      const { error } = await supabase.from("collections").insert({
        id: validatedId,
        slug,
        title,
        description,
        is_published: isPublished,
        is_fixture: false,
        sort_order: sortOrder,
      });

      if (error) throw error;
    } else {
      const { error } = await supabase.from("collections").update({
        title,
        slug,
        description,
        is_published: isPublished,
        sort_order: sortOrder,
        updated_at: new Date().toISOString(),
      }).eq("id", validatedId);

      if (error) throw error;
    }
  } catch (err: unknown) {
    console.error("createUpdateCollection failed", err);
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "23505"
    ) {
      return { ok: false, reason: "invalid_input", message: "A record with this slug already exists. Choose a different slug." };
    }
    return { ok: false, reason: "db_error", message: "Save failed. Please try again." };
  }

  revalidatePath("/admin/collections");
  revalidatePath("/shop");
  revalidatePath("/collections/" + slug);
  revalidatePath("/");
  return { ok: true, data: { id: validatedId } };
}

export async function togglePublish(
  entityType: "product" | "look" | "service" | "collection",
  id: string,
  status: boolean
): Promise<AdminResult> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const idErr = validateUUID(id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };

  const tableMap: Record<string, string> = {
    product: "products",
    look: "looks",
    service: "services",
    collection: "collections",
  };

  const table = tableMap[entityType];
  if (!table) return { ok: false, reason: "invalid_input", message: "Invalid entity type" };

  try {
    const { error } = await supabase
      .from(table)
      .update({ is_published: status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) throw error;
  } catch (err) {
    console.error("togglePublish failed", err);
    return { ok: false, reason: "db_error", message: "Save failed. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath("/looks");
  revalidatePath("/services");
  revalidatePath("/collections");
  revalidatePath("/");
  return { ok: true };
}

export async function updateRelationships(
  parentType: "look" | "collection",
  parentId: string,
  childType: "product" | "service",
  childIds: string[]
): Promise<AdminResult> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const idErr = validateUUID(parentId);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };

  const uniqueChildIds = [...new Set(childIds.filter(Boolean))].map(validateUUID);
  const childIdErr = uniqueChildIds.find(e => typeof e === "string");
  if (childIdErr) return { ok: false, reason: "invalid_input", message: childIdErr };

  let linkTable: string;
  let parentCol: string;
  let childCol: string;

  if (parentType === "look" && childType === "product") {
    linkTable = "look_products";
    parentCol = "look_id";
    childCol = "product_id";
  } else if (parentType === "look" && childType === "service") {
    linkTable = "look_services";
    parentCol = "look_id";
    childCol = "service_id";
  } else if (parentType === "collection" && childType === "product") {
    linkTable = "collection_products";
    parentCol = "collection_id";
    childCol = "product_id";
  } else {
    return { ok: false, reason: "invalid_input", message: "Invalid relationship type" };
  }

  try {
    await supabase.from(linkTable).delete().eq(parentCol, parentId);

    if (uniqueChildIds.length > 0) {
      const rows = uniqueChildIds.map((childId, index) => ({
        [parentCol]: parentId,
        [childCol]: childId,
        sort_order: index,
      }));

      const { error } = await supabase.from(linkTable).insert(rows);
      if (error) throw error;
    }
  } catch (err) {
    console.error("updateRelationships failed", err);
    return { ok: false, reason: "db_error", message: "Save failed. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/looks");
  revalidatePath("/collections");
  revalidatePath("/products");
  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true };
}

// ---- Fetch helpers for edit forms ----

export async function getProductForEdit(id: string): Promise<AdminResult<{
  id: string; name: string; slug: string; description: string | null;
  price_minor: number | null; currency: string | null; shape: string | null;
  length: string | null; finish: string | null; is_published: boolean;
  sort_order: number;
}>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const idErr = validateUUID(id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };

  try {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, name, slug, description, price_minor, currency, shape, length, finish,
        is_published, sort_order,
        product_media (storage_path, alt_text, width, height, sort_order)
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { ok: false, reason: "invalid_input", message: "Product not found" };

    return {
      ok: true, data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        description: data.description ?? null,
        price_minor: data.price_minor,
        currency: data.currency,
        shape: data.shape ?? null,
        length: data.length ?? null,
        finish: data.finish ?? null,
        is_published: data.is_published,
        sort_order: data.sort_order ?? 0,
      }
    };
  } catch (err) {
    console.error("getProductForEdit failed", err);
    return { ok: false, reason: "db_error", message: "Load failed. Please try again." };
  }
}

export async function getLookForEdit(id: string): Promise<AdminResult<{
  id: string; title: string; slug: string; story: string | null; tags: string[];
  is_published: boolean; sort_order: number;
}>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const idErr = validateUUID(id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };

  try {
    const { data, error } = await supabase
      .from("looks")
      .select("id, title, slug, story, tags, is_published, sort_order")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { ok: false, reason: "invalid_input", message: "Look not found" };

    return {
      ok: true, data: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        story: data.story ?? null,
        tags: data.tags ?? [],
        is_published: data.is_published,
        sort_order: data.sort_order ?? 0,
      }
    };
  } catch (err) {
    console.error("getLookForEdit failed", err);
    return { ok: false, reason: "db_error", message: "Load failed. Please try again." };
  }
}

export async function getServiceForEdit(id: string): Promise<AdminResult<{
  id: string; title: string; slug: string; summary: string | null; description: string | null;
  duration_minutes: number | null; from_price_minor: number | null; currency: string | null;
  is_published: boolean; sort_order: number;
}>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const idErr = validateUUID(id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };

  try {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { ok: false, reason: "invalid_input", message: "Service not found" };

    return {
      ok: true, data: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        summary: data.summary ?? null,
        description: data.description ?? null,
        duration_minutes: data.duration_minutes,
        from_price_minor: data.from_price_minor,
        currency: data.currency,
        is_published: data.is_published,
        sort_order: data.sort_order ?? 0,
      }
    };
  } catch (err) {
    console.error("getServiceForEdit failed", err);
    return { ok: false, reason: "db_error", message: "Load failed. Please try again." };
  }
}

export async function getCollectionForEdit(id: string): Promise<AdminResult<{
  id: string; title: string; slug: string; description: string | null;
  is_published: boolean; sort_order: number;
}>> {
  let supabase;
  try {
    const result = await verifyOwner();
    supabase = result.supabase;
  } catch {
    return { ok: false, reason: "unauthorized", message: "Not authorized" };
  }

  const idErr = validateUUID(id);
  if (idErr) return { ok: false, reason: "invalid_input", message: idErr };

  try {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) return { ok: false, reason: "invalid_input", message: "Collection not found" };

    return {
      ok: true, data: {
        id: data.id,
        title: data.title,
        slug: data.slug,
        description: data.description ?? null,
        is_published: data.is_published,
        sort_order: data.sort_order ?? 0,
      }
    };
  } catch (err) {
    console.error("getCollectionForEdit failed", err);
    return { ok: false, reason: "db_error", message: "Load failed. Please try again." };
  }
}