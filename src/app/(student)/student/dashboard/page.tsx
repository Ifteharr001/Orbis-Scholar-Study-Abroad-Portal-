"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, Loader2, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import DashboardStats from "../components/DashboardStats";
import ActionCenter from "../components/ActionCenter";
import ActiveApplications from "../components/ActiveApplications";
import CounselorCard from "../components/CounselorCard";
import OffersCard from "../components/OffersCard";

interface Application {
  _id: string;
  universityName: string;
  programName: string;
  status: string;
  appliedDate: string;
  applicationId?: string;
}

interface Action {
  _id: string;
  message: string;
  type: "urgent" | "info" | "success" | "alert";
  createdAt: string;
  link?: string;
}

interface Counselor {
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface DashboardStatsData {
    applications: number;
    pendingDocs: number;
    offers: number;
    unreadMessages: number;
    verifiedDocs: number;
    rejectedDocs: number;
}

interface DashboardData {
  stats: DashboardStatsData;
  applications: Application[];
  actions: Action[]; 
  counselor: Counselor | null;
}

export default function StudentDashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // ডাটা ফেচিং লজিক
  useEffect(() => {
    if (authLoading) return;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/student/dashboard-data", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoadingData(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      setLoadingData(false);
    }
  }, [authLoading, isAuthenticated]);


  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center h-[80vh] w-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">
             Welcome back, <span className="text-primary">{user?.name?.split(' ')[0]}</span>! 👋
           </h1>
           <p className="text-muted-foreground mt-1">
             Here is what’s happening with your applications today.
           </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="relative w-full md:w-64 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-background border-border rounded-full"
            />
          </div>
          
          <Button variant="outline" size="icon" className="rounded-full relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            {data?.actions && data.actions.length > 0 && (
                <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      <DashboardStats stats={data?.stats || { 
          applications: 0, 
          pendingDocs: 0, 
          offers: 0, 
          unreadMessages: 0, 
          verifiedDocs: 0, 
          rejectedDocs: 0 
      }} />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (Main Content) */}
        <div className="xl:col-span-2 space-y-8">
          <ActionCenter initialActions={data?.actions || []} />
          <ActiveApplications applications={data?.applications || []} />
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          
          {/* 🔥 FIX: এখানে কন্ডিশন তুলে দিয়ে সরাসরি কম্পোনেন্ট বসানো হলো */}
          {/* যদি data.counselor null থাকে, কম্পোনেন্ট নিজেই হ্যান্ডেল করবে */}
          <CounselorCard
             counselor={data?.counselor} 
             unreadCount={data?.stats?.unreadMessages || 0}
          />
          
          <OffersCard applications={data?.applications || []} />
        </div>
        
      </div>
    </div>
  );
}