"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, UserX, Mail, User, Phone } from "lucide-react";

// ১. ডাটা টাইপ ইন্টারফেস (ব্যাকএন্ডের সাথে মিল রেখে)
interface Counselor {
  name: string;
  email: string;
  phone?: string;
  image?: string; // ✅ ইমেজ সাপোর্ট যোগ করা হলো
}

interface CounselorCardProps {
  counselor?: Counselor | null;
  unreadCount?: number;
}

const CounselorCard = ({ counselor, unreadCount = 0 }: CounselorCardProps) => {
  
  // ২. যদি কাউন্সিলর অ্যাসাইন করা না থাকে (Empty State)
  if (!counselor) {
    return (
      <Card className="border-border shadow-sm bg-muted/20 ">
        <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full gap-3">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border">
            <UserX className="h-7 w-7" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No Counselor Assigned</h3>
            <p className="text-sm text-muted-foreground max-w-[200px] mx-auto mt-1">
              Please contact support to get assigned to an expert counselor.
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-2 w-full bg-primary text-primary-foreground max-w-[180px]" asChild>
             <Link href="/contact">Contact Support</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ৩. নামের আদ্যক্ষর বের করা
  const initials = counselor.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* ✅ Avatar Component ব্যবহার (ছবি বা ইনিশিয়ালস) */}
          <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
            <AvatarImage src={counselor.image} alt={counselor.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="mb-2">
                <h3 className="font-bold text-foreground truncate text-lg leading-tight">
                    {counselor.name}
                </h3>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate" title={counselor.email}>{counselor.email}</span>
                </div>
                {counselor.phone && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{counselor.phone}</span>
                    </div>
                )}
            </div>
            
            {/* ৪. আনরিড মেসেজ ইন্ডিকেটর */}
            {unreadCount > 0 ? (
              <div className="flex items-center gap-2 mb-4 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">
                  {unreadCount} New Messages
                </p>
              </div>
            ) : (
              <div className="mb-4 text-xs text-muted-foreground py-1.5">
                All caught up! No new messages.
              </div>
            )}

            {/* অ্যাকশন বাটনস */}
            <div className="grid grid-cols-2 gap-2">
                <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                    <Link href="/student/messages">
                        <MessageCircle className="mr-2 h-3.5 w-3.5" />
                        Chat
                    </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href="/student/counselor">
                        <User className="mr-2 h-3.5 w-3.5" />
                        Profile
                    </Link>
                </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CounselorCard;