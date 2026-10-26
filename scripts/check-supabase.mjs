import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

try {
  const { error } = await supabase.auth.getSession();
  if (error) {
    console.error("Supabase reachable: no", error.message);
    process.exit(1);
  }
  const host = new URL(url).hostname;
  console.log(`Supabase reachable: yes ${host}`);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("Supabase reachable: no", message);
  process.exit(1);
}