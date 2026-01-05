"use client";

import { AlertTriangle, MessageCircle, CreditCard, Calendar, Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// ১. ডাটা টাইপ ইন্টারফেস তৈরি (যা ডাটাবেস থেকে আসবে)
interface ActionItem {
  _id: string;
  message: string;
  type: "urgent" | "info" | "success" | "alert";
  createdAt: string;
}

interface ActionCenterProps {
  actions?: ActionItem[]; // প্যারেন্ট থেকে আসা ডাটা
}

// ২. টাইপ অনুযায়ী স্টাইল এবং আইকন সিলেক্ট করার ফাংশন
const getActionStyles = (type: string) => {
  switch (type) {
    case "urgent":
      return {
        icon: AlertTriangle,
        iconBg: "bg-orange-100 dark:bg-orange-900/20",
        iconColor: "text-orange-600 dark:text-orange-400",
        badge: "Urgent",
        badgeColor: "bg-orange-500",
      };
    case "success":
      return {
        icon: CheckCircle,
        iconBg: "bg-green-100 dark:bg-green-900/20",
        iconColor: "text-green-600 dark:text-green-400",
        badge: "Success",
        badgeColor: "bg-green-500",
      };
    case "alert":
      return {
        icon: CreditCard,
        iconBg: "bg-red-100 dark:bg-red-900/20",
        iconColor: "text-red-600 dark:text-red-400",
        badge: "Payment",
        badgeColor: "bg-red-500",
      };
    case "info":
    default:
      return {
        icon: MessageCircle,
        iconBg: "bg-blue-100 dark:bg-blue-900/20",
        iconColor: "text-blue-600 dark:text-blue-400",
        badge: "New",
        badgeColor: "bg-blue-500",
      };
  }
};

const ActionCenter = ({ actions = [] }: ActionCenterProps) => {
  return (
    <Card className="border-border shadow-sm h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold">Action center</CardTitle>
        <CardDescription>Here&apos;s a single glance of where you stand.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 flex-1 overflow-y-auto">
        {/* ৩. যদি কোনো অ্যাকশন না থাকে */}
        {!actions || actions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
            <Info className="h-10 w-10 mb-2 opacity-20" />
            <p className="text-sm">No pending actions 🎉</p>
          </div>
        ) : (
          /* ৪. অ্যাকশন থাকলে ম্যাপ করা */
          actions.map((action, index) => {
            const style = getActionStyles(action.type);
            
            return (
              <div
                key={action._id || index}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", style.iconBg)}>
                    <style.icon className={cn("h-5 w-5", style.iconColor)} />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {action.message}
                  </span>
                </div>
                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-medium text-white whitespace-nowrap ml-2", style.badgeColor)}>
                  {style.badge}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ActionCenter;