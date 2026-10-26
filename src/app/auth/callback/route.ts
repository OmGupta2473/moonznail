import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const origin = "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=InvalidLink", origin));
  }

  const supabase = await createServerSupabaseClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/login?error=InvalidLink", origin));
  }

  return NextResponse.redirect(new URL("/pending", origin));
}