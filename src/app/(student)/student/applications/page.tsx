"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Settings, Loader2, Plus, FileText } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard"; 
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Application {
  _id: string;
  applicationId: string; 
  universityName: string;
  programName: string; 
  status: string;
  appliedDate: string;
}

export default function MyApplicationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!isAuthenticated) return;

      try {
        const res = await fetch("/api/student/dashboard-data", {
          credentials: "include",
        });
        const data = await res.json();
        
        if (res.ok && data.applications) {
          setApplications(data.applications);
        } else {
          toast.error("Failed to load applications");
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthenticated]);

  const filteredApplications = applications.filter((app) =>
    app.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.programName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.applicationId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
     
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Uni, Program or ID..."
            className="pl-10 bg-background border-border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-auto flex justify-end gap-2">
           <Button asChild className="bg-primary text-white">
              <Link href="/student/university-program">
                 <Plus className="mr-2 h-4 w-4" /> New Application
              </Link>
           </Button>
             
           <DropdownMenu>
             <DropdownMenuTrigger asChild>
               <Button variant="outline" size="icon" className="text-muted-foreground hover:text-primary cursor-pointer">
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

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[500px]">
        <div className="mb-6 border-b pb-4 border-border/50">
          <h1 className="text-xl font-semibold text-foreground mb-1 flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            My Applications
            <span className="text-sm font-normal text-muted-foreground ml-2 bg-muted px-2 py-0.5 rounded-full">
              {filteredApplications.length} Total
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Track the status of your university applications.
          </p>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted/30 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No applications found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              You haven t applied to any universities yet, or no results matched your search.
            </p>
            <Button variant="default" asChild>
                <Link href="/student/university-program">Start Applying Now</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <ApplicationCard 
                key={app._id} 
                id={app._id} 
                applicationId={app.applicationId} 
                university={app.universityName} 
                status={app.status}
                program={app.programName}
                lastUpdated={new Date(app.appliedDate).toLocaleDateString("en-US", {
                    day: 'numeric', month: 'short', year: 'numeric'
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}