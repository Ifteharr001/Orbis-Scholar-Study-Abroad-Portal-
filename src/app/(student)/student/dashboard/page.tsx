"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, Loader2, Bell } from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import ActionCenter from "../components/ActionCenter";
import CounselorCard from "../components/CounselorCard";
import OffersCard from "../components/OffersCard";
import ActiveApplications from "../components/ActiveApplications";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// ✅ ১. ইন্টারফেসগুলো কম্পোনেন্টের Props এর সাথে মিলিয়ে ঠিক করা হলো

interface Application {
  _id: string;
  universityName: string;
  programName: string;
  status: string;
  appliedDate: string;
  applicationId?: string;
}

// ⚠️ FIX: ActionCenter কম্পোনেন্ট যা আশা করে, সেই অনুযায়ী আপডেট করা হয়েছে
interface Action {
  _id: string;          // আগে id ছিল
  message: string;      // আগে title/description ছিল
  type: "urgent" | "info" | "success" | "alert"; // alert টাইপ যুক্ত করা হয়েছে
  createdAt: string;    // এটি মিসিং ছিল
}

interface Counselor {
  name: string;
  email: string;
  phone?: string;
  image?: string;
}

interface DashboardData {
  stats: {
    applications: number;
    pendingDocs: number;
    offers: number;
    unreadMessages: number;
  };
  applications: Application[];
  actions: Action[]; 
  counselor: Counselor | null;
}

export default function StudentDashboardPage() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // ২. API থেকে ডাটা ফেচ করা
useEffect(() => {
  if (authLoading) return;

  const fetchData = async () => {
    try {
      const res = await fetch("/api/student/dashboard-data", {
        credentials: "include",
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
          
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Stats Section */}
      {data?.stats && <DashboardStats stats={data.stats} />}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
          <ActionCenter actions={data?.actions || []} />
          <ActiveApplications applications={data?.applications || []} />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
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