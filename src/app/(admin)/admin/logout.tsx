"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./AdminSidebar"; 
import AdminHeader from "./AdminHeader";   

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // মোবাইল রেসপন্সিভনেস হ্যান্ডেল করার জন্য
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

    // ইনিশিয়াল চেক
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar */}
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
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}