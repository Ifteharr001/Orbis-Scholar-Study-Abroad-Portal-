"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Settings, Loader2, Plus } from "lucide-react";
import ApplicationCard from "../components/ApplicationCard";
import { useAuth } from "@/hooks/useAuth";

// ডাটাবেস থেকে আসা ডাটার টাইপ
interface Application {
  _id: string;
  universityName: string;
  course: string;
  status: string;
  appliedDate: string;
}

export default function MyApplicationsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // স্টেট ম্যানেজমেন্ট
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // ১. API থেকে ডাটা ফেচ করা
  useEffect(() => {
    const fetchApplications = async () => {
      if (isAuthenticated) {
        try {
          // আমরা ড্যাশবোর্ডের API টিই ব্যবহার করছি কারণ সেখানে অলরেডি অ্যাপ্লিকেশন লিস্ট আছে
          const res = await fetch("/api/student/dashboard-data");
          const data = await res.json();
          
          if (data.applications) {
            setApplications(data.applications);
          }
        } catch (error) {
          console.error("Failed to fetch applications:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplications();
  }, [isAuthenticated]);

  // ২. সার্চ লজিক (ফ্রন্টএন্ড ফিল্টারিং)
  const filteredApplications = applications.filter((app) =>
    app.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // লোডিং স্ক্রিন
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] w-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search university or course..."
            className="pl-10 bg-background border-border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Actions */}
        <div className="w-full md:w-auto flex justify-end gap-2">
            {/* নতুন অ্যাপ্লিকেশন বাটন (ফিউচারের জন্য) */}
            <Button asChild>
  {/* আগে ছিল /student/apply, এখন হবে /student/university-program */}
  <Link href="/student/university-program">
     <Plus className="mr-2 h-4 w-4" /> Start New Application
  </Link>
</Button>
             
             <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
               <Settings className="h-5 w-5" />
             </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[500px]">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-foreground mb-1">
            My Active Applications
          </h1>
          <p className="text-sm text-muted-foreground">
            Track all your applications in one place.
          </p>
        </div>

        {/* ৩. লিস্ট রেন্ডারিং */}
        {filteredApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground mb-4">No applications found.</p>
            <Button variant="outline" asChild>
                <Link href="/student/university-program">Start Applying</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApplications.map((app) => (
              <ApplicationCard 
                key={app._id} 
                id={app._id} // এটি URL প্যারামিটার হিসেবে যাবে [id] পেজে
                university={app.universityName} // DB field mapping
                status={app.status}
                program={app.course} // DB field mapping
                lastUpdated={app.appliedDate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}