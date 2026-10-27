import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=MissingCode`);
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Auth exchange failed:", error.message);
    // If the code was already used, or the cookie is missing, it lands here
    return NextResponse.redirect(`${origin}/login?error=InvalidLink`);
  }

  return NextResponse.redirect(`${origin}/pending`);
}