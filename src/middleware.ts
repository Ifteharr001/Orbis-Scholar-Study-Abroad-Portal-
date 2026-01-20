import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; 
import { jwtVerify } from "jose"; 

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================================
  // ১. ADMIN AUTHENTICATION (Custom Cookie + Jose)
  // ============================================================
  if (pathname.startsWith("/admin")) {
    const adminToken = request.cookies.get("token")?.value;
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "your-secret-key-change-it"
    );

    const verifyAdminToken = async (token: string) => {
      try {
        await jwtVerify(token, secret);
        return true;
      } catch (error) {
        return false;
      }
    };

    if (pathname.includes("/login") || pathname.includes("/register")) {
      if (adminToken && (await verifyAdminToken(adminToken))) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      return NextResponse.next();
    }

    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValid = await verifyAdminToken(adminToken);
    if (!isValid) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    return NextResponse.next();
  }

  // ============================================================
  // ২. COUNSELOR / STUDENT / PARTNER AUTHENTICATION (NextAuth)
  // ============================================================
  
  if (pathname === "/counselor/login") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if (token && token.role === "counselor") {
        return NextResponse.redirect(new URL("/counselor/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/student") || pathname.startsWith("/partner") || pathname.startsWith("/counselor")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
     
      const signInPage = pathname.startsWith("/counselor") ? "/counselor/login" : "/userAuth";
      
      const loginUrl = new URL(signInPage, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = token.role;

    if (pathname.startsWith("/student") && userRole !== "student") {
      if (userRole === "partner") return NextResponse.redirect(new URL("/partner/dashboard", request.url));
      if (userRole === "counselor") return NextResponse.redirect(new URL("/counselor", request.url));
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/partner") && userRole !== "partner") {
      if (userRole === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
      if (userRole === "counselor") return NextResponse.redirect(new URL("/counselor", request.url));
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/counselor") && userRole !== "counselor") {
      if (userRole === "student") return NextResponse.redirect(new URL("/student/dashboard", request.url));
      if (userRole === "partner") return NextResponse.redirect(new URL("/partner/dashboard", request.url));
      return NextResponse.rewrite(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/partner/:path*",
    "/counselor/:path*", 
    "/admin/:path*",
  ],
};