"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ApplicationCardProps {
  id: string;
  university: string;
  // ডাটাবেসের সব স্ট্যাটাস সাপোর্ট করার জন্য string দেওয়া হলো
  status: string; 
  program: string;
  lastUpdated: string;
}

const ApplicationCard = ({
  id,
  university,
  status,
  program,
  lastUpdated,
}: ApplicationCardProps) => {
  
  // স্ট্যাটাস অনুযায়ী ডায়নামিক কালার
  const getStatusStyles = () => {
    switch (status) {
      case "Offer Received":
      case "Approved":
      case "Enrolled":
        return "bg-green-600 hover:bg-green-700 text-white"; // Success
      
      case "Rejected":
        return "bg-red-600 hover:bg-red-700 text-white"; // Error
      
      case "Visa Processing":
        return "bg-purple-600 hover:bg-purple-700 text-white"; // Special Status
      
      case "In Review":
        return "bg-amber-500 hover:bg-amber-600 text-white"; // Warning/Pending
      
      case "Applied":
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white"; // Default Info
    }
  };

  return (
    <Link href={`/student/applications/${id}`} className="block h-full">
      <Card className="border-border shadow-sm hover:shadow-md transition-all cursor-pointer h-full group">
        <CardContent className="p-5 flex flex-col h-full">
          {/* ইউনিভার্সিটি নাম */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {university}
            </h3>
          </div>
          
          {/* স্ট্যাটাস ব্যাজ */}
          <div className="mb-4">
            <Badge className={cn("text-xs font-medium px-2.5 py-0.5 rounded-full border-none", getStatusStyles())}>
              {status}
            </Badge>
          </div>
          
          {/* প্রোগ্রাম এবং তারিখ */}
          <div className="mt-auto space-y-2">
            <p className="text-sm text-muted-foreground line-clamp-1" title={program}>
              <span className="font-medium text-foreground/80">Program: </span> 
              {program}
            </p>
            <p className="text-xs text-muted-foreground/70">
              Applied: {new Date(lastUpdated).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ApplicationCard;