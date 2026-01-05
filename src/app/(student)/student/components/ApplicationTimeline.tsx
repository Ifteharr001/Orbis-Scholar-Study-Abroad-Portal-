"use client";

import { cn } from "@/lib/utils";

// ১. টাইমলাইনের সব ধাপের নাম (অর্ডার অনুযায়ী)
const STEPS_ORDER = [
  "Shortlisted",
  "Draft",
  "Submitted", // Database: "Applied"
  "Payment",
  "University Review", // Database: "In Review"
  "Offer (Cond./Uncond.)", // Database: "Offer Received"
  "Offer Accepted",
  "Visa Lodged", // Database: "Visa Processing"
  "Biometrics",
  "Visa Decision",
  "Pre-departure",
  "Enrolled",
];

interface TimelineProps {
  currentStatus?: string; // ডাটাবেস থেকে আসা স্ট্যাটাস
}

const ApplicationsTime = ({ currentStatus = "Submitted" }: TimelineProps) => {
  
  // ২. ডাটাবেসের স্ট্যাটাসকে টাইমলাইনের লেবেলের সাথে ম্যাপ করা
  const getMappedStatusIndex = (status: string) => {
    // ডাটাবেসের স্ট্যাটাস -> টাইমলাইন লেবেল
    const map: Record<string, string> = {
      "Applied": "Submitted",
      "In Review": "University Review",
      "Offer Received": "Offer (Cond./Uncond.)",
      "Visa Processing": "Visa Lodged",
      "Enrolled": "Enrolled",
      // বাকিগুলো সরাসরি মিললে ভালো, না মিললে ডিফল্ট ০
    };

    const targetLabel = map[status] || status;
    return STEPS_ORDER.indexOf(targetLabel);
  };

  const activeIndex = getMappedStatusIndex(currentStatus);

  return (
    <div className="h-full">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Application Timeline
      </h2>
      
      <div className="relative space-y-0 ml-2">
        {/* Connecting Line (উলম্ব দাগ) */}
        <div className="absolute left-[7px] top-2 bottom-4 w-[2px] bg-border/60" />

        {STEPS_ORDER.map((label, index) => {
          // ৩. প্রতিটি ধাপের অবস্থা নির্ণয় করা
          let status: "completed" | "in-progress" | "pending" = "pending";
          
          if (index < activeIndex) status = "completed";
          else if (index === activeIndex) status = "in-progress";
          else status = "pending";

          return (
            <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0 group">
              {/* Status Dot */}
              <div
                className={cn(
                  "relative z-10 w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition-all duration-300",
                  status === "completed"
                    ? "bg-green-500 border-green-500"
                    : status === "in-progress"
                    ? "bg-background border-primary ring-2 ring-primary/20 animate-pulse"
                    : "bg-muted border-muted-foreground/30"
                )}
              >
                {/* Active Dot Center */}
                {status === "in-progress" && (
                  <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </div>

              {/* Content */}
              <div className="-mt-0.5">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  status === "pending" ? "text-muted-foreground" : "text-foreground"
                )}>
                  {label}
                </p>
                <p className={cn(
                  "text-xs mt-0.5",
                  status === "completed" ? "text-green-600 dark:text-green-400" :
                  status === "in-progress" ? "text-primary font-medium" :
                  "text-muted-foreground/70"
                )}>
                  {status === "completed" ? "Completed" : status === "in-progress" ? "Current Stage" : "Pending"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationsTime;