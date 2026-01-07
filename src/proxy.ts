import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  if (!token) {
    if (pathname.startsWith("/student") || pathname.startsWith("/partner")) {
      return NextResponse.redirect(new URL("/userAuth", request.url));
    }
  }

  if (token) {
    const userRole = token.role; 

    if (pathname.startsWith("/student") && userRole !== "student") {
      return NextResponse.redirect(new URL("/partner/dashboard", request.url));
    }

    if (pathname.startsWith("/partner") && userRole !== "partner") {
      return NextResponse.redirect(new URL("/student/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/partner/:path*",
  ],
};