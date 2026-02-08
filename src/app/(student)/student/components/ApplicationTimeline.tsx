"use client";

import { cn } from "@/lib/utils";
import { Check, Circle, Clock, XCircle } from "lucide-react"; 

const STEPS_ORDER = [
  "Shortlisted",
  "Draft",
  "Submitted",         
  "University Review",   
  "Offer Received",   
  "Offer Accepted",
  "Visa Lodged",         
  "Biometrics",
  "Visa Decision",
  "Enrolled",
];

interface TimelineProps {
  currentStatus?: string;
}

const ApplicationTimeline = ({ currentStatus = "Applied" }: TimelineProps) => {
  
  const isRejected = currentStatus === "Rejected";

  const getStepIndex = (status: string) => {
    const map: Record<string, string> = {
      "Applied": "Submitted",
      "In Review": "University Review",
      "Conditional Offer": "Offer Received",
      "Offer Received": "Offer Received",
      "Visa Processing": "Visa Lodged",
      "Enrolled": "Enrolled",
      "Rejected": "Submitted", 
    };

    const targetLabel = map[status] || status;
    return STEPS_ORDER.indexOf(targetLabel);
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="h-full">
      <div className="relative space-y-0 ml-2">
        
        <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-border/40" />

        {STEPS_ORDER.map((label, index) => {
          let status: "completed" | "current" | "pending" | "error" = "pending";
          
          if (index < activeIndex) {
            status = "completed";
          } else if (index === activeIndex) {
            status = isRejected ? "error" : "current";
          } else {
            status = "pending";
          }

          return (
            <div key={index} className="relative flex items-start gap-4 pb-8 last:pb-0 group">
              
              <div
                className={cn(
                  "relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 transition-all duration-300 bg-background",
                  status === "completed" ? "bg-green-100 border-green-500 text-green-600" :
                  status === "current" ? "border-primary text-primary ring-4 ring-primary/10" :
                  status === "error" ? "bg-red-100 border-red-500 text-red-600" :
                  "border-muted-foreground/30 text-muted-foreground/30"
                )}
              >
                {status === "completed" && <Check className="w-4 h-4" />}
                {status === "current" && <Clock className="w-4 h-4 animate-pulse" />}
                {status === "error" && <XCircle className="w-4 h-4" />}
                {status === "pending" && <Circle className="w-3 h-3" />}
              </div>

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