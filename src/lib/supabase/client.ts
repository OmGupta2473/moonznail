import { createBrowserClient } from "@supabase/ssr";
import { supabaseEnv } from "@/lib/env";

export function createBrowserSupabaseClient() {
  const { url, key } = supabaseEnv();
  return createBrowserClient(url, key);
}