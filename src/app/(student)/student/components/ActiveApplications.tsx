"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowRight, Building2, GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ১. ইন্টারফেস আপডেট (API থেকে এই ডাটাগুলো আসছে)
interface Application {
  _id?: string;
  universityName?: string; // Optional marked safe for TS
  programName?: string;
  status: string;
}

// ২. অ্যাডমিন পাইপলাইন অনুযায়ী স্টেজ লিস্ট (ক্রম অনুসারে)
const PIPELINE_STAGES = [
  "Applied",        // or New Applied
  "Inquiry",
  "In Review",
  "Docs Pending",
  "Docs Verified",
  "Submitted",
  "Offer Received",
  "Visa Processing",
  "Enrolled"
];

export default function ActiveApplications({ applications = [] }: { applications: Application[] }) {

  // প্রোগ্রেস ক্যালকুলেশন হেল্পার
  const getProgress = (status: string) => {
    if (status === "Rejected") return 100;
    
    // "New Applied" কে "Applied" হিসেবে ধরা হবে
    const normalizedStatus = status === "New Applied" ? "Applied" : status;
    const index = PIPELINE_STAGES.indexOf(normalizedStatus);
    
    if (index === -1) return 10; // অজানা স্ট্যাটাস হলে ১০%
    
    // (Current Index + 1) / Total Stages * 100
    return Math.round(((index + 1) / PIPELINE_STAGES.length) * 100);
  };

  // কালার হেল্পার
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      case "Enrolled": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Offer Received": return "bg-green-100 text-green-700 border-green-200";
      case "Visa Processing": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Docs Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  // যদি কোনো অ্যাপ্লিকেশন না থাকে (Empty State)
  if (applications.length === 0) {
    return (
        <Card className="border-border shadow-sm  flex flex-col justify-center">
            <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Start Your Journey</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    You have not applied to any universities yet.
                </p>
                <Button asChild className="w-full">
                    <Link href="/student/university-program">Apply Now</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm flex flex-col ">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-bold">Active Applications</CardTitle>
                <CardDescription>Track the status of your applications individually.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 p-0 hover:bg-transparent">
                <Link href="/student/applications" className="flex items-center gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] custom-scrollbar">
        {applications.map((app, index) => {
            const progress = getProgress(app.status);
            const isRejected = app.status === "Rejected";
            const isEnrolled = app.status === "Enrolled";

            return (
                <div key={app._id || index} className="border border-border rounded-lg p-4 bg-card hover:shadow-sm transition-all">
                    {/* Header: University & Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <div className="space-y-1">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                {app.universityName || "University Name"}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                {app.programName || "Program Name"}
                            </p>
                        </div>
                        <Badge variant="outline" className={cn("w-fit whitespace-nowrap", getStatusColor(app.status))}>
                            {app.status}
                        </Badge>
                    </div>

                    {/* Progress Bar Section */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Process Completion</span>
                            <span className={cn("font-medium", isRejected ? "text-red-600" : "text-primary")}>
                                {isRejected ? "Terminated" : `${progress}%`}
                            </span>
                        </div>
                        
                        {/* Custom Progress Bar */}
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full transition-all duration-500 ease-out rounded-full",
                                    isRejected ? "bg-red-500" : isEnrolled ? "bg-emerald-500" : "bg-primary"
                                )}
                                style={{ width: `${progress}%` }}
                            />
                        </div>

                        {/* Status Message based on Stage */}
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                            {isRejected ? (
                                <><AlertCircle className="h-3.5 w-3.5 text-red-500" /> Application has been rejected.</>
                            ) : isEnrolled ? (
                                <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Successfully Enrolled!</>
                            ) : (
                                "Your application is moving through the review stages."
                            )}
                        </p>
                    </div>
                </div>
            );
        })}
      </CardContent>
    </Card>
  );
}