"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

// ১. ইন্টারফেস ডিফাইন করা
interface Application {
  status: string;
  // ভবিষ্যতে আরও ফিল্ড লাগলে এখানে এড করতে পারবেন (যেমন: universityName)
}

// ২. ফিক্স: 'any[]' এর বদলে 'Application[]' ব্যবহার করা হয়েছে
const ActiveApplications = ({ applications = [] }: { applications: Application[] }) => {
  
  const counts = {
    applied: applications.filter(a => a.status === "Applied").length,
    inReview: applications.filter(a => a.status === "In Review").length,
    offer: applications.filter(a => a.status === "Offer Received").length,
    visa: applications.filter(a => a.status === "Visa Processing").length,
    enrolled: applications.filter(a => a.status === "Enrolled").length,
  };

  const stages = [
    { 
      label: "Applied", 
      count: counts.applied, 
      isActive: counts.applied > 0 
    },
    { 
      label: "In Review", 
      count: counts.inReview, 
      isActive: counts.inReview > 0 
    },
    { 
      label: "Offer", 
      count: counts.offer, 
      isActive: counts.offer > 0 
    },
    { 
      label: "Visa", 
      count: counts.visa, 
      isActive: counts.visa > 0 
    },
    { 
      label: "Enrolled", 
      count: counts.enrolled, 
      isActive: counts.enrolled > 0, 
      isCompleted: counts.enrolled > 0 
    },
  ];

  return (
    <Card className="border-border shadow-sm h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">My Active Applications</CardTitle>
        <CardDescription>An overview of your progress across all applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-start md:justify-center gap-6 md:gap-12 py-6 overflow-x-auto no-scrollbar px-2">
          {stages.map((stage, index) => (
            <div key={index} className="flex flex-col items-center min-w-[80px]">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mb-3 transition-colors shadow-sm",
                  stage.isCompleted
                    ? "bg-green-500 text-white"
                    : stage.isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {stage.isCompleted ? (
                  <Check className="h-6 w-6" />
                ) : (
                  <span className="text-lg font-bold">{stage.count}</span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground text-center whitespace-nowrap">
                {stage.label}
              </span>
              <span className="text-xs text-muted-foreground text-center whitespace-nowrap">
                {stage.count} Apps
              </span>
            </div>
          ))}
        </div>
        
        <Button asChild variant="outline" className="w-full mt-4 border-border hover:bg-muted">
          <Link href="/student/applications">
            View All Applications
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActiveApplications;