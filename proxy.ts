import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("access_token")?.value;

  if (!token && pathname.startsWith("/home")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
