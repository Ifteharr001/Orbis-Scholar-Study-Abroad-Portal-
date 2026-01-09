"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Gift, 
  Plane, 
  CreditCard, 
  MessageCircle, 
  Calendar, 
  GraduationCap, 
  User, 
  HelpCircle 
} from "lucide-react";
import { cn } from "@/lib/utils"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" }, 
  { icon: FileText, label: "My Applications", path: "/student/applications" },
  { icon: FolderOpen, label: "Documents", path: "/student/documents" },
  { icon: Gift, label: "Offers & Scholarships", path: "/student/offers" },
  { icon: Plane, label: "Visa & Pre-Departure", path: "/student/visa" },
  { icon: CreditCard, label: "Payments", path: "/student/payments" },
  { icon: MessageCircle, label: "My Counselor", path: "/student/counselor" },
  { icon: Calendar, label: "Appointments", path: "/student/appointments" },
  { icon: GraduationCap, label: "Universities & Programs", path: "/student/university-program" },
  { icon: User, label: "Profile & Settings", path: "/student/profile" },
  { icon: HelpCircle, label: "Helps & resources", path: "/student/help" },
];

const StudentSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession(); 
  
  // Initialize state
  const [userImage, setUserImage] = useState(session?.user?.image || "");
  const [userName, setUserName] = useState(session?.user?.name || "");

  // ✅ FIX: "Cascading Update" আটকানোর জন্য কন্ডিশনাল চেক যোগ করা হয়েছে
  useEffect(() => {
    if (session?.user) {
        // যদি সেশনের নাম স্টেটের নামের সাথে না মিলে, তবেই আপডেট হবে
        if (session.user.name && session.user.name !== userName) {
            setUserName(session.user.name);
        }
        // যদি সেশনের ছবি স্টেটের ছবির সাথে না মিলে, তবেই আপডেট হবে
        if (session.user.image && session.user.image !== userImage) {
            setUserImage(session.user.image);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]); 

  // Optional: Fetch latest from DB to ensure sync
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch("/api/student/profile"); 
          if (res.ok) {
             const data = await res.json();
             // এখানেও ডুপ্লিকেট রেন্ডার এড়াতে চেক করা ভালো
             if (data.image && data.image !== userImage) setUserImage(data.image);
             if (data.fullName && data.fullName !== userName) setUserName(data.fullName);
          }
        } catch (error) {
          console.error("Failed to load profile data", error);
        }
      }
    };

    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  return (
    <div className="h-full w-full bg-background border-r border-border flex flex-col">
      
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-foreground text-base">Orbis Scholar</h1>
            <p className="text-xs text-muted-foreground">Student Portal</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground/70")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border bg-muted/5">
        <div className="flex items-center gap-3">
          
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage 
              src={userImage || "/placeholder.svg"} 
              alt="User Image" 
              className="object-cover" 
            />
            <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-semibold">
              {(userName || "S").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="overflow-hidden">
            <p className="font-medium text-foreground text-sm truncate">
              {userName || "Student"}
            </p>
            
            <p className="text-xs text-muted-foreground truncate max-w-[140px]" title={session?.user?.email || ""}>
              {session?.user?.email || "student@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;