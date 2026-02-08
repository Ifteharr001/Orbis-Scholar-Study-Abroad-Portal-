"use client";

import { FileText, Hourglass, Gift, MessageSquare, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: {
    applications: number;
    pendingDocs: number;
    offers: number;
    unreadMessages: number;
    verifiedDocs: number; 
    rejectedDocs: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const data = [
    {
      title: "Applications",
      value: stats?.applications || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pending Docs",
      value: stats?.pendingDocs || 0,
      icon: Hourglass,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      title: "Offers",
      value: stats?.offers || 0,
      icon: Gift,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
    },

    {
      title: "Verified Docs",
      value: stats?.verifiedDocs || 0,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
      
      rejectedCount: stats?.rejectedDocs || 0 
    },
    {
      title: "Messages",
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
      {data.map((item, index) => (
        <Card key={index} className={cn("border shadow-sm hover:shadow-md transition-all relative overflow-hidden", item.border)}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3 h-full">
            
            <div className={cn("p-3 rounded-full", item.bg, item.color)}>
              <item.icon className="h-5 w-5" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {item.value}
              </h3>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                {item.title}
              </p>
            </div>

            {item.rejectedCount !== undefined && item.rejectedCount > 0 && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded-full border border-red-200 dark:border-red-800">
                    <XCircle className="h-3 w-3 text-red-600 dark:text-red-400" />
                    <span className="text-[10px] font-bold text-red-600 dark:text-red-400">
                        {item.rejectedCount} Rejected
                    </span>
                </div>
            )}

          </CardContent>
        </Card>
      ))}
    </div>
  );
}