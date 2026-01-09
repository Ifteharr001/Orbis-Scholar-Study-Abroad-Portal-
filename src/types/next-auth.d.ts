import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      image?: string; // ✅ ইমেজ টাইপ যোগ করা হলো
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    image?: string; // ✅ ইউজার ইন্টারফেসেও ইমেজ যোগ করা হলো
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    picture?: string; // ✅ JWT তে ছবির জন্য picture ফিল্ড থাকে
  }
}