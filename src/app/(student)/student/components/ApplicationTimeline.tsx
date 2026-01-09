"use client";

import { cn } from "@/lib/utils";
import { Check, Circle, Clock, XCircle } from "lucide-react"; // আইকন ইম্পোর্ট

// ১. টাইমলাইনের সব ধাপ (Display Labels)
const STEPS_ORDER = [
  "Shortlisted",
  "Draft",
  "Submitted",           // DB: "Applied"
  "University Review",   // DB: "In Review"
  "Offer Received",      // DB: "Offer Received", "Conditional Offer"
  "Offer Accepted",
  "Visa Lodged",         // DB: "Visa Processing"
  "Biometrics",
  "Visa Decision",
  "Enrolled",
];

interface TimelineProps {
  currentStatus?: string;
}

const ApplicationTimeline = ({ currentStatus = "Applied" }: TimelineProps) => {
  
  // ২. রিজেক্টেড কিনা চেক করা
  const isRejected = currentStatus === "Rejected";

  // ৩. ডাটাবেসের স্ট্যাটাস -> টাইমলাইন স্টেপ ম্যাপিং
  const getStepIndex = (status: string) => {
    const map: Record<string, string> = {
      "Applied": "Submitted",
      "In Review": "University Review",
      "Conditional Offer": "Offer Received",
      "Offer Received": "Offer Received",
      "Visa Processing": "Visa Lodged",
      "Enrolled": "Enrolled",
      "Rejected": "Submitted", // রিজেক্ট হলে অন্তত সাবমিটেড পর্যন্ত দেখাবে (লাল হয়ে)
    };

    const targetLabel = map[status] || status;
    return STEPS_ORDER.indexOf(targetLabel);
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="h-full">
      <div className="relative space-y-0 ml-2">
        
        {/* Connecting Line (উলম্ব দাগ) */}
        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-border/40" />

        {STEPS_ORDER.map((label, index) => {
          // লজিক: ধাপটি কি শেষ? নাকি চলছে? নাকি বাকি?
          let status: "completed" | "current" | "pending" | "error" = "pending";
          
          if (index < activeIndex) {
            status = "completed";
          } else if (index === activeIndex) {
            status = isRejected ? "error" : "current"; // রিজেক্ট হলে এরর দেখাবে
          } else {
            status = "pending";
          }

          return (
            <div key={index} className="relative flex items-start gap-4 pb-8 last:pb-0 group">
              
              {/* Status Icon Wrapper */}
              <div
                className={cn(
                  "relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300 bg-background",
                  status === "completed" ? "bg-green-100 border-green-500 text-green-600" :
                  status === "current" ? "border-primary text-primary ring-4 ring-primary/10" :
                  status === "error" ? "bg-red-100 border-red-500 text-red-600" :
                  "border-muted-foreground/30 text-muted-foreground/30"
                )}
              >
                {/* Icons inside the bubble */}
                {status === "completed" && <Check className="w-4 h-4" />}
                {status === "current" && <Clock className="w-4 h-4 animate-pulse" />}
                {status === "error" && <XCircle className="w-4 h-4" />}
                {status === "pending" && <Circle className="w-3 h-3" />}
              </div>

              {/* Text Content */}
              <div className="pt-1">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  status === "pending" ? "text-muted-foreground" : "text-foreground",
                  status === "error" && "text-red-600"
                )}>
                  {label}
                </p>
                
                <p className="text-xs text-muted-foreground/70 mt-0.5">
                  {status === "completed" ? "Done" : 
                   status === "current" ? "In Progress" : 
                   status === "error" ? "Application Rejected" : 
                   "Upcoming"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationTimeline;