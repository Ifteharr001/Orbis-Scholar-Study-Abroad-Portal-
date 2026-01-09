"use client";

import { AlertTriangle, MessageCircle, CreditCard, Info, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ১. ডাটা টাইপ ইন্টারফেস
interface ActionItem {
  _id: string;
  message: string;
  type: "urgent" | "info" | "success" | "alert";
  createdAt: string; // ISO String Expected
}

interface ActionCenterProps {
  actions?: ActionItem[];
}

// ২. সফট কালার স্কিম (বাকি ড্যাশবোর্ডের সাথে মিল রেখে)
const getActionStyles = (type: string) => {
  switch (type) {
    case "urgent":
      return {
        icon: AlertTriangle,
        bg: "bg-red-50 dark:bg-red-900/10",
        border: "border-red-100 dark:border-red-800",
        iconColor: "text-red-600 dark:text-red-400",
        badge: "Urgent",
        badgeStyle: "bg-red-100 text-red-700 hover:bg-red-200 border-red-200",
      };
    case "success":
      return {
        icon: CheckCircle2,
        bg: "bg-green-50 dark:bg-green-900/10",
        border: "border-green-100 dark:border-green-800",
        iconColor: "text-green-600 dark:text-green-400",
        badge: "Done",
        badgeStyle: "bg-green-100 text-green-700 hover:bg-green-200 border-green-200",
      };
    case "alert": // Payment or Warning
      return {
        icon: CreditCard,
        bg: "bg-amber-50 dark:bg-amber-900/10",
        border: "border-amber-100 dark:border-amber-800",
        iconColor: "text-amber-600 dark:text-amber-400",
        badge: "Action",
        badgeStyle: "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200",
      };
    case "info":
    default:
      return {
        icon: MessageCircle,
        bg: "bg-blue-50 dark:bg-blue-900/10",
        border: "border-blue-100 dark:border-blue-800",
        iconColor: "text-blue-600 dark:text-blue-400",
        badge: "New",
        badgeStyle: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200",
      };
  }
};

const ActionCenter = ({ actions = [] }: ActionCenterProps) => {
  return (
    <Card className="border-border shadow-sm  flex flex-col">
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold">Action Center</CardTitle>
            <CardDescription className="mt-1">
               Updates requiring your attention.
            </CardDescription>
          </div>
          {/* View All Button */}
          {actions.length > 0 && (
             <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" asChild>
                <Link href="/student/notifications">View All</Link>
             </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0 flex-1 overflow-hidden">
        {/* ৩. স্ক্রলেবল এরিয়া */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-3 custom-scrollbar">
          
          {!actions || actions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
              <div className="bg-muted/50 p-4 rounded-full">
                 <Info className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">All caught up!</p>
                <p className="text-xs text-muted-foreground">No pending actions for now.</p>
              </div>
            </div>
          ) : (
            actions.map((action, index) => {
              const style = getActionStyles(action.type);
              
              return (
                <div
                  key={action._id || index}
                  className={cn(
                    "flex items-start gap-4 p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer group",
                    style.bg,
                    style.border
                  )}
                >
                  {/* Icon */}
                  <div className={cn("mt-1 p-1.5 rounded-full bg-white dark:bg-background shadow-sm shrink-0", style.iconColor)}>
                    <style.icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                       <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                         {action.message}
                       </p>
                       <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 border-none shadow-none", style.badgeStyle)}>
                          {style.badge}
                       </Badge>
                    </div>
                    
                    {/* Time Display */}
                    <div className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground/80">
                       <Clock className="h-3 w-3" />
                       <span>
                          {new Date(action.createdAt).toLocaleDateString(undefined, {
                             month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                       </span>
                    </div>
                  </div>
                  
                  {/* Hover Arrow */}
                  <ArrowRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground/50 transition-all -translate-x-2 group-hover:translate-x-0 self-center" />
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActionCenter;