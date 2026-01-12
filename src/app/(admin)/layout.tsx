"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // ১. dynamic ইমপোর্ট আনুন
import AdminHeader from "./admin/AdminHeader";
import { Toaster } from "sonner";

// ২. AdminSidebar কে ডায়নামিকালি ইমপোর্ট করুন এবং SSR বন্ধ করে দিন
const AdminSidebar = dynamic(() => import("./admin/AdminSidebar"), { 
  ssr: false, // এটি সার্ভারে রেন্ডার হবে না, ফলে ID মিসম্যাচ হবে না
  loading: () => <div className="w-16 md:w-64 h-screen bg-muted/20" /> // লোড হওয়ার আগে একটি খালি জায়গা দেখাবে
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarCollapsed(true);
      } else {
        setIsMobile(false);
        setSidebarCollapsed(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar (Dynamic Import) */}
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
      />

      {/* Header */}
      <AdminHeader sidebarCollapsed={sidebarCollapsed} />

      {/* Main Content Area */}
      <main
        className={`pt-20 px-6 pb-8 transition-all duration-300 ${
          sidebarCollapsed ? (isMobile ? "ml-0" : "ml-16") : (isMobile ? "ml-0" : "ml-64")
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}