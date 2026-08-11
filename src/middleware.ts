import { NextRequest, NextResponse } from "next/server";

const COOKIE = "ei_admin_session";

const PUBLIC_ADMIN = [
  "/admin/login",
  "/admin/recuperar-senha",
  "/admin/redefinir-senha",
];

/** Lightweight JWT payload check for Edge middleware (signature verified in Node routes). */
function parseSession(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"))
    ) as { exp?: number; role?: string; mcp?: boolean };
    if (!payload.role || !["admin", "editor", "author"].includes(payload.role)) return null;
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin")) return NextResponse.next();
  if (PUBLIC_ADMIN.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get(COOKIE)?.value;
  const session = token ? parseSession(token) : null;
  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (session.mcp && !pathname.startsWith("/admin/alterar-senha")) {
    return NextResponse.redirect(new URL("/admin/alterar-senha", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
