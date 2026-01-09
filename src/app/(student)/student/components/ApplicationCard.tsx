"use client";

import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Calendar, Hash } from "lucide-react";

interface ApplicationCardProps {
  id: string; // MongoDB _id (লিংকের জন্য)
  applicationId?: string; // Human Readable ID (যেমন: APP-1234)
  university: string;
  status: string;
  program: string;
  lastUpdated: string; // এটি Parent থেকে formatted string হিসেবে আসছে
}

const ApplicationCard = ({
  id,
  applicationId,
  university,
  status,
  program,
  lastUpdated,
}: ApplicationCardProps) => {
  
  // স্ট্যাটাস অনুযায়ী ডায়নামিক কালার এবং স্টাইল
  const getStatusStyles = () => {
    switch (status) {
      case "Offer Received":
      case "Approved":
      case "Enrolled":
        return "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"; // Success (Soft style)
      
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"; // Error
      
      case "Visa Processing":
        return "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200"; 
      
      case "In Review":
      case "Conditional Offer": // ✅ নতুন স্ট্যাটাস যোগ করা হলো
        return "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"; 
      
      case "Applied":
      default:
        return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"; 
    }
  };

  return (
    <Link href={`/student/applications/${id}`} className="block group">
      <Card className="border-border shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col relative overflow-hidden">
        
        {/* টপ কালার বার (ঐচ্ছিক ডিজাইন এলিমেন্ট) */}
        <div className={cn("h-1 w-full", 
            status === "Offer Received" ? "bg-green-500" : 
            status === "Rejected" ? "bg-red-500" : "bg-primary/50"
        )} />

        <CardContent className="p-5 flex-1">
          {/* হেডার: স্ট্যাটাস এবং আইডি */}
          <div className="flex justify-between items-start mb-3 gap-2">
            <Badge variant="outline" className={cn("rounded-md px-2 py-0.5 border font-semibold transition-colors", getStatusStyles())}>
              {status}
            </Badge>
            {applicationId && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Hash className="h-3 w-3" /> {applicationId}
                </span>
            )}
          </div>
          
          {/* ইউনিভার্সিটি নাম */}
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {university}
          </h3>
          
          {/* প্রোগ্রাম নাম */}
          <p className="text-sm text-muted-foreground line-clamp-2" title={program}>
            {program}
          </p>
        </CardContent>
        
        {/* ফুটার: তারিখ */}
        <CardFooter className="px-5 py-3 bg-muted/20 border-t border-border mt-auto">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1.5 h-3.5 w-3.5" />
            <span>Applied: {lastUpdated}</span> 
            {/* ⚠️ এখানে new Date() ব্যবহার করবেন না, কারণ Parent অলরেডি ফরম্যাট করেছে */}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ApplicationCard;