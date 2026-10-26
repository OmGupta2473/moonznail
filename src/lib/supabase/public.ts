// server-only module
import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseEnv } from "@/lib/env";

export function createPublicClient() {
  const { url, key } = supabaseEnv();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}