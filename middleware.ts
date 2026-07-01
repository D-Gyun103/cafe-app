import { NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import { sessionOptions, type AdminSessionData } from "@/lib/session";

async function isAuthenticated(request: NextRequest) {
  const cookie = request.cookies.get(sessionOptions.cookieName)?.value;
  if (!cookie) return false;
  try {
    const data = await unsealData<AdminSessionData>(cookie, {
      password: sessionOptions.password,
    });
    return Boolean(data.adminId);
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!(await isAuthenticated(request))) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/api/admin") && pathname !== "/api/admin/login") {
    if (!(await isAuthenticated(request))) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
