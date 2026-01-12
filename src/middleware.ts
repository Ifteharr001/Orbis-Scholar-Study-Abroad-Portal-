import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt"; // For Student/Partner (NextAuth)
import { jwtVerify } from "jose"; // For Admin (Custom Auth)

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

    // টোকেন ভেরিফাই করার হেল্পার ফাংশন
    const verifyAdminToken = async (token: string) => {
      try {
        await jwtVerify(token, secret);
        return true;
      } catch (error) {
        return false;
      }
    };

    // A. যদি কেউ Login বা Register পেজে থাকে
    if (pathname.includes("/login") || pathname.includes("/register")) {
      // যদি অলরেডি লগইন করা থাকে, ড্যাশবোর্ডে পাঠিয়ে দিব
      if (adminToken && (await verifyAdminToken(adminToken))) {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }
      // লগইন না থাকলে এই পেজগুলোতে থাকতে পারবে
      return NextResponse.next();
    }

    // B. অ্যাডমিনের প্রোটেক্টেড রাউট (Dashboard, Settings, etc.)
    if (!adminToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const isValid = await verifyAdminToken(adminToken);
    if (!isValid) {
      // টোকেন ভুয়া হলে লগইন পেজে পাঠাবো এবং কুকি ডিলিট করে দিব
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    // সব ঠিক থাকলে অ্যাডমিনকে যেতে দিব
    return NextResponse.next();
  }

  // ============================================================
  // ২. STUDENT / PARTNER AUTHENTICATION (NextAuth)
  // ============================================================
  // শুধুমাত্র student বা partner রাউটের জন্য NextAuth চেক করব
  if (pathname.startsWith("/student") || pathname.startsWith("/partner")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // A. ইউজার যদি লগইন না থাকে
    if (!token) {
      const loginUrl = new URL("/userAuth", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // B. রোল ভিত্তিক রিডাইরেকশন (Role Based Access Control)
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

// কনফিগারে অ্যাডমিন রাউট যোগ করা হয়েছে
export const config = {
  matcher: [
    "/student/:path*",
    "/partner/:path*",
    "/admin/:path*", // ⚠️ নতুন অ্যাডমিন রাউট যোগ করা হলো
  ],
};