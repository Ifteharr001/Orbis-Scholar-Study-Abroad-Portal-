"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  const loading = status === "loading";
  const isAuthenticated = status === "authenticated";
  
  // session.user এর ভেতরে role এবং id আছে (যদি আপনি [...nextauth] এ সেট করে থাকেন)
  const user = session?.user || null;

  return {
    user,              // ইউজারের নাম, ইমেইল, রোল, ছবি ইত্যাদি
    loading,           // লোডিং স্ট্যাটাস (true/false)
    isAuthenticated,   // ইউজার লগইন আছে কিনা
    signIn,            // NextAuth এর লগইন ফাংশন
    signOut,           // NextAuth এর লগআউট ফাংশন
    role: user?.role,  
  };
}