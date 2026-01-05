"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, Loader2 } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import ActionCenter from "../components/ActionCenter";
import CounselorCard from "../components/CounselorCard";
import OffersCard from "../components/OffersCard";
import ActiveApplications from "../components/ActiveApplications";
import { useAuth } from "@/hooks/useAuth";

export default function StudentDashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  // ১. সব ডাটা রাখার জন্য স্টেট
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // ২. API থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/student/dashboard-data");
          if (res.ok) {
            const result = await res.json();
            setData(result);
          }
        } catch (error) {
          console.error("Failed to fetch dashboard data");
        } finally {
          setLoadingData(false);
        }
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-background border-border rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, <span className="text-primary">{user?.name}</span>! 👋
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.email} | Student ID: {user?.id?.slice(-6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end mt-4 md:mt-0">
          
          {/* ডাটা পাঠানো হচ্ছে */}
          <DashboardStats stats={data?.stats} />

          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 h-full">
          <ActionCenter actions={data?.actions || []} />
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          <CounselorCard 
            counselor={data?.counselor} 
            unreadCount={data?.stats?.unreadMessages || 0}
          />
          
          <OffersCard applications={data?.applications || []} />
        </div>
        
      </div>

      {/* Bottom Section */}
      <div className="w-full">
        <ActiveApplications applications={data?.applications || []} />
      </div>

    </div>
  );
}