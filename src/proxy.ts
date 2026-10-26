import { createServerSupabaseClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export default async function proxy(request: Request) {
  const url = new URL(request.url);

  const protectedPaths = ["/admin", "/pending"];
  const isProtected = protectedPaths.some((path) => url.pathname.startsWith(path));

  const isAuthPath = url.pathname.startsWith("/login") || url.pathname.startsWith("/auth/callback");

  if (!isProtected || isAuthPath) {
    return NextResponse.next();
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", url.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}