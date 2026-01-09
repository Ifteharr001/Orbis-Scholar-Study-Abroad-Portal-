"use client";

import { FileText, Hourglass, Gift, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsProps {
  stats: {
    applications: number;
    pendingDocs: number;
    offers: number;
    unreadMessages: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
  const data = [
    {
      title: "Applications Submitted",
      value: stats?.applications || 0,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pending Documents",
      value: stats?.pendingDocs || 0,
      icon: Hourglass,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      title: "Offers Received",
      value: stats?.offers || 0,
      icon: Gift,
      color: "text-green-600",
      bg: "bg-green-100 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
    },
    {
      title: "Unread Messages",
      value: stats?.unreadMessages || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-100 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {data.map((item, index) => (
        <Card key={index} className={cn("border shadow-sm hover:shadow-md transition-all", item.border)}>
          <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-3">
            
            {/* ১. আইকন রেন্ডারিং (আগে এটি ছিল না) */}
            <div className={cn("p-3 rounded-full", item.bg, item.color)}>
              <item.icon className="h-6 w-6" />
            </div>

            {/* ২. ভ্যালু এবং টাইটেল */}
            <div>
              <h3 className="text-2xl font-bold text-foreground">
                {item.value}
              </h3>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                {item.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}