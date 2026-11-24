"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, Loader2, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  useEffect(() => {
    // Don't fetch if auth is still loading
    if (authLoading) return;

    const fetchData = async () => {
      // If not authenticated yet, don't fetch - the component will re-render when auth state changes
      if (!isAuthenticated) {
        setLoadingData(false);
        return;
      }

      try {
        const res = await fetch("/api/student/dashboard-data", {
          cache: "no-store",
          credentials: "include",
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

    fetchData();
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full relative cursor-pointer">
                <Bell className="h-5 w-5 text-muted-foreground" />
                {data?.actions && data.actions.length > 0 && (
                    <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-background" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2">
              <DropdownMenuLabel className="font-bold flex items-center justify-between">
                <span>Notifications</span>
                <span className="text-xs text-muted-foreground font-normal">
                  {data?.actions?.length || 0} updates
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto space-y-1 py-1">
                {data?.actions && data.actions.length > 0 ? (
                  data.actions.map((action, idx) => (
                    <DropdownMenuItem key={idx} asChild className="cursor-pointer p-2 focus:bg-muted">
                      <Link href={action.link || "/student/documents"} className="flex flex-col gap-1 w-full">
                        <span className="text-xs font-medium text-foreground">{action.message}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(action.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary cursor-pointer">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Settings & Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/student/profile">Profile & Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/student/help">Help & Resources</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DashboardStats stats={data?.stats || { 
          applications: 0, 
          pendingDocs: 0, 
          offers: 0, 
          unreadMessages: 0, 
          verifiedDocs: 0, 
          rejectedDocs: 0 
      }} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 space-y-8">
          <ActionCenter initialActions={data?.actions || []} />
          <ActiveApplications applications={data?.applications || []} />
        </div>

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