"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // ইউজারের তথ্য দেখানোর জন্য
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

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" }, 
  { icon: FileText, label: "My Applications", path: "/student/applications" },
  { icon: FolderOpen, label: "Documents", path: "/student/documents" },
  { icon: Gift, label: "Offers & Scholarships", path: "/student/offers" },
  { icon: Plane, label: "Visa & Pre-Departure", path: "/student/visa" },
  { icon: CreditCard, label: "Payments", path: "/student/payments" },
  { icon: MessageCircle, label: "My Counselor", path: "/student/counselor" }, // Path updated to typical convention
  { icon: Calendar, label: "Appointments", path: "/student/appointments" },
  { icon: GraduationCap, label: "Universities & Programs", path: "/student/university-program" }, // Path updated
  { icon: User, label: "Profile & Settings", path: "/student/profile" },
  { icon: HelpCircle, label: "Helps & resources", path: "/student/help" },
];

const StudentSidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth(); // অথেন্টিকেটেড ইউজারের নাম/ইমেইল পাওয়ার জন্য

  return (
    // fixed ক্লাস সরানো হয়েছে কারণ layout.tsx এটা হ্যান্ডেল করছে
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

      {/* User Profile (Dynamic) */}
      <div className="p-4 border-t border-border bg-muted/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {/* নামের প্রথম অক্ষর দেখাবে, না থাকলে 'S' */}
            {user?.name?.charAt(0).toUpperCase() || "S"}
          </div>
          <div className="overflow-hidden">
            <p className="font-medium text-foreground text-sm truncate">
              {user?.name || "Student"}
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-[140px]">
              {user?.email || "student@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;