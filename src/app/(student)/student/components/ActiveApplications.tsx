"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ১. ইন্টারফেস আপডেট
interface Application {
  status: string;
}

const ActiveApplications = ({ applications = [] }: { applications: Application[] }) => {
  
  // ২. লজিক আপডেট: বিভিন্ন স্ট্যাটাস গ্রুপ করা
  const counts = {
    applied: applications.filter(a => a.status === "Applied" || a.status === "Submitted").length,
    inReview: applications.filter(a => a.status === "In Review" || a.status === "University Review").length,
    offer: applications.filter(a => a.status === "Offer Received" || a.status === "Conditional Offer").length,
    visa: applications.filter(a => a.status === "Visa Processing" || a.status === "Visa Lodged").length,
    enrolled: applications.filter(a => a.status === "Enrolled").length,
  };

  const stages = [
    { label: "Applied", count: counts.applied, step: 1 },
    { label: "In Review", count: counts.inReview, step: 2 },
    { label: "Offer", count: counts.offer, step: 3 },
    { label: "Visa", count: counts.visa, step: 4 },
    { label: "Enrolled", count: counts.enrolled, step: 5 },
  ];

  // যদি কোনো অ্যাপ্লিকেশন না থাকে (Empty State)
  if (applications.length === 0) {
    return (
        <Card className="border-border shadow-sm h-full flex flex-col justify-center">
            <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Start Your Journey</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    You haven t applied to any universities yet.
                </p>
                <Button asChild className="w-full">
                    <Link href="/student/university-program">Apply Now</Link>
                </Button>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm flex flex-col">
      <CardHeader className="pb-2 border-b border-border/50">
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-xl font-bold">Application Pipeline</CardTitle>
                <CardDescription>Real-time status of your applications.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 p-0 hover:bg-transparent">
                <Link href="/student/applications" className="flex items-center gap-1">
                    View All <ArrowRight className="h-4 w-4" />
                </Link>
            </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center py-6">
        <div className="relative">
            {/* Connecting Line (Background) */}
            <div className="absolute top-[28px] left-0 w-full h-[2px] bg-border z-0 hidden md:block" />

            <div className="flex items-start justify-between relative z-10 overflow-x-auto pb-2 no-scrollbar px-1">
            {stages.map((stage, index) => {
                const isActive = stage.count > 0;
                
                return (
                    <div key={index} className="flex flex-col items-center min-w-[70px] group cursor-default">
                    {/* Circle Counter */}
                    <div
                        className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-all duration-300 border-4 border-background shadow-sm",
                        isActive
                            ? "bg-primary text-primary-foreground scale-110 shadow-md ring-2 ring-primary/20"
                            : "bg-muted text-muted-foreground border-muted"
                        )}
                    >
                        {stage.label === "Enrolled" && isActive ? (
                             <Check className="h-6 w-6" />
                        ) : (
                             <span className="text-xl font-bold">{stage.count}</span>
                        )}
                    </div>
                    
                    {/* Labels */}
                    <span className={cn(
                        "text-sm font-semibold text-center whitespace-nowrap transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                        {stage.label}
                    </span>
                    </div>
                );
            })}
            </div>
        </div>
        
        {/* Footer Info */}
        <div className="mt-6 bg-muted/30 rounded-lg p-3 flex items-center justify-center text-xs text-muted-foreground">
             Total <span className="font-bold text-foreground mx-1">{applications.length}</span> active applications being tracked.
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveApplications;