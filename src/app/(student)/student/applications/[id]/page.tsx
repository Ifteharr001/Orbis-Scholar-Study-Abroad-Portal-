"use client";

import { use, useEffect, useState } from "react"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2, AlertCircle, Calendar, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import ApplicationTimeline from "../../components/ApplicationTimeline";
import ChecklistDocuments from "../../components/ChecklistDocuments";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// ✅ মডেলের সাথে মিল রেখে ইন্টারফেস আপডেট
interface ApplicationData {
  _id: string;
  universityName: string;
  programName: string; // Fixed: 'course' -> 'programName'
  status: string;
  applicationId?: string;
  appliedDate?: string; // তারিখ দেখানোর জন্য এড করা হলো
}

export default function ApplicationDetailsPage({ params }: PageProps) {
  // ১. প্যারামস আন র‍্যাপ করা (Next.js 15 Standard)
  const { id } = use(params);
  
  // ২. স্টেট ম্যানেজমেন্ট
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ৩. ডাটা ফেচ করা
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/student/applications/${id}`);
        
        if (!res.ok) {
            if (res.status === 404) throw new Error("Application not found");
            if (res.status === 401) throw new Error("Unauthorized access");
            throw new Error("Failed to load application");
        }

        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error(err);
        setError("Could not load the application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // স্ট্যাটাস কালার লজিক (Card Component এর সাথে মিল রেখে)
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Offer Received":
      case "Approved":
      case "Enrolled":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "In Review":
      case "Conditional Offer":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Visa Processing":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // এরর স্টেট
  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Error Loading Application</h2>
        <p className="text-muted-foreground">{error || "Application not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/student/applications">Back to List</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Back Link */}
      <Link
        href="/student/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Applications
      </Link>

      {/* 1. Header Card (Updated Design) */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-2xl font-bold text-foreground">
                    {application.universityName}
                 </h1>
                 <Badge variant="outline" className={cn("text-sm font-semibold px-2.5 py-0.5 border", getStatusStyles(application.status))}>
                    {application.status}
                 </Badge>
              </div>

              <p className="text-lg text-muted-foreground mb-4">
                Program: <span className="font-medium text-foreground">{application.programName}</span>
              </p>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                      <Hash className="h-3.5 w-3.5" />
                      ID: <span className="font-mono text-foreground">{application.applicationId || application._id.slice(-6).toUpperCase()}</span>
                  </div>
                  {application.appliedDate && (
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded">
                        <Calendar className="h-3.5 w-3.5" />
                        Applied: <span className="text-foreground">{new Date(application.appliedDate).toLocaleDateString()}</span>
                    </div>
                  )}
              </div>
            </div>
            
            {/* Action Buttons (Optional) */}
            <div className="flex gap-2">
                 <Button variant="outline">Contact Counselor</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side: Timeline (Main Progress) */}
          <div className="lg:col-span-2 space-y-6">
             {/* 2. Application Timeline */}
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Application Timeline</h3>
                  <ApplicationTimeline currentStatus={application.status} />
                </CardContent>
              </Card>

               {/* 4. Notes / Remarks Section (Optional Placeholder) */}
               <Card className="border-border shadow-sm">
                 <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-2">Counselor Remarks</h3>
                    <p className="text-sm text-muted-foreground">
                        No remarks added yet by your counselor. You will be notified once there is an update.
                    </p>
                 </CardContent>
               </Card>
          </div>

          {/* Right Side: Checklist */}
          <div className="lg:col-span-1">
              {/* 3. Checklist & Documents */}
              <Card className="border-border shadow-sm h-full">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                  <ChecklistDocuments 
                    documents={[]} // ফিউচারে এখানে API থেকে ডকুমেন্টস আসবে
                    tasks={[]} 
                  />
                </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}