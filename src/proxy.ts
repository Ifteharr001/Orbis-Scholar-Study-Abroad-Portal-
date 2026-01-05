import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// নাম পরিবর্তন: middleware -> proxy
export async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const { pathname } = request.nextUrl;

  // ১. লগইন ছাড়া এক্সেস বন্ধ করা
  if (!token) {
    if (pathname.startsWith("/student") || pathname.startsWith("/partner")) {
      return NextResponse.redirect(new URL("/userAuth", request.url));
    }
  }

  // ২. রোল ভিত্তিক সিকিউরিটি
  if (token) {
    const userRole = token.role; 

    // Partner -> Student Dashboard এ এক্সেস করতে চাইলে আটকাবে
    if (pathname.startsWith("/student") && userRole !== "student") {
      return NextResponse.redirect(new URL("/partner/dashboard", request.url));
    }

    // Student -> Partner Dashboard এ এক্সেস করতে চাইলে আটকাবে
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