"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, UserX } from "lucide-react";

// ১. ডাটা টাইপ ইন্টারফেস
interface Counselor {
  name: string;
  email: string;
  phone?: string;
}

interface CounselorCardProps {
  counselor?: Counselor | null; // কাউন্সিলর নাও থাকতে পারে
  unreadCount?: number;
}

const CounselorCard = ({ counselor, unreadCount = 0 }: CounselorCardProps) => {
  
  // ২. যদি কাউন্সিলর অ্যাসাইন করা না থাকে (Empty State)
  if (!counselor) {
    return (
      <Card className="border-border shadow-sm bg-muted/20">
        <CardContent className="p-5 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
            <UserX className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No Counselor Assigned</h3>
            <p className="text-xs text-muted-foreground">
              Please contact support if you need assistance.
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
             <Link href="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ৩. নামের আদ্যক্ষর বের করা (যেমন: John Doe -> JD)
  const initials = counselor.name
    ? counselor.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "C";

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          {/* প্রোফাইল ইমেজ বা ইনিশিয়ালস */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-white font-semibold shadow-sm shrink-0">
            {initials}
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{counselor.name}</h3>
            <p className="text-sm text-muted-foreground mb-3">{counselor.email}</p>
            
            {/* ৪. আনরিড মেসেজ থাকলে শুধুমাত্র তখনই দেখাবে */}
            {unreadCount > 0 ? (
              <div className="flex items-center gap-2 mb-4 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  {unreadCount} unread messages
                </p>
              </div>
            ) : (
              <div className="mb-4 text-xs text-muted-foreground">
                No new messages
              </div>
            )}

            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/student/messages">
                <MessageCircle className="mr-2 h-4 w-4" />
                View All Messages
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounselorCard;