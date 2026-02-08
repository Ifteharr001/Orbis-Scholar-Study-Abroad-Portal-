"use client";

import { useState, useEffect } from "react";
import CounselorSidebar from "./CounselorSidebar";
import CounselorHeader from "./CounselorHeader";

export default function CounselorMainLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
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
   
      <CounselorSidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed} 
        isMobile={isMobile}
        user={user}
      />

      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${
          sidebarCollapsed ? (isMobile ? "ml-0" : "ml-16") : (isMobile ? "ml-0" : "ml-64")
        }`}
      >
        <CounselorHeader />
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}