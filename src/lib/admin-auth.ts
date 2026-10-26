import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function verifyOwner() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) throw new Error("Unauthorized");

  const { data: isOwner, error: rpcError } = await supabase.rpc("is_owner");
  if (rpcError || !isOwner) throw new Error("Unauthorized");

  return { supabase, user };
}