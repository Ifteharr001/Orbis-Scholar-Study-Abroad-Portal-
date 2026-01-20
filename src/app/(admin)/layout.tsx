"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic"; 
import AdminHeader from "./admin/AdminHeader";
import { Toaster } from "sonner";

const AdminSidebar = dynamic(() => import("./admin/AdminSidebar"), { 
  loading: () => <div className="w-16 md:w-64 h-screen bg-muted/20" /> 
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
      <AdminSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        isMobile={isMobile}
      />

      <AdminHeader sidebarCollapsed={sidebarCollapsed} />

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