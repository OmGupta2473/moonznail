import "server-only";
import { createPrivilegedClient } from "@/lib/supabase/admin";

export async function findCartByHash(sessionHash: string) {
  const supabase = createPrivilegedClient();
  const { data, error } = await supabase
    .from("carts")
    .select("id, currency")
    .eq("session_hash", sessionHash)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createCart(sessionHash: string, currency: string) {
  const supabase = createPrivilegedClient();
  const { data, error } = await supabase
    .from("carts")
    .insert({ session_hash: sessionHash, currency })
    .select("id, currency")
    .single();
  if (error) throw error;
  return data;
}