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
  HelpCircle,
  ChevronDown, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/student/dashboard" }, 
  { icon: FileText, label: "My Applications", path: "/student/applications" },
  { icon: FolderOpen, label: "Documents", path: "/student/documents" },
  { icon: Gift, label: "Offers & Scholarships", path: "/student/offers" },
  
  
  { 
    icon: MessageCircle, 
    label: "Communication", 
    
    subItems: [
      { label: "My Counselor", path: "/student/counselor" },
      { label: "Messages", path: "/student/counselor/message" }
    ]
  },

  { icon: Plane, label: "Visa & Pre-Departure", path: "/student/visa" },
  { icon: CreditCard, label: "Payments", path: "/student/payments" },
  { icon: Calendar, label: "Appointments", path: "/student/appointments" },
  { icon: GraduationCap, label: "Universities & Programs", path: "/student/university-program" },
  { icon: User, label: "Profile & Settings", path: "/student/profile" },
  { icon: HelpCircle, label: "Helps & resources", path: "/student/help" },
];

const StudentSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession(); 
  
  const [userImage, setUserImage] = useState(session?.user?.image || "");
  const [userName, setUserName] = useState(session?.user?.name || "");

 
  const [openDropdown, setOpenDropdown] = useState<string | null>("Communication"); // ডিফল্টভাবে খোলা রাখতে চাইলে নাম দিন, নাহলে null

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  useEffect(() => {
    if (session?.user) {
        if (session.user.name && session.user.name !== userName) {
            setUserName(session.user.name);
        }
        if (session.user.image && session.user.image !== userImage) {
            setUserImage(session.user.image);
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const res = await fetch("/api/student/profile", { credentials: "include" }); 
          if (res.ok) {
             const data = await res.json();
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

      <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            
            if (item.subItems) {
                const isExpanded = openDropdown === item.label;
                const isChildActive = item.subItems.some(sub => pathname === sub.path);

                return (
                    <li key={item.label}>
                        <button
                            onClick={() => toggleDropdown(item.label)}
                            className={cn(
                                "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 font-medium cursor-pointer",
                                isChildActive || isExpanded
                                    ? "text-foreground bg-muted/50" 
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon className={cn("h-5 w-5", (isChildActive || isExpanded) ? "text-primary" : "text-muted-foreground/70")} />
                                {item.label}
                            </div>
                            {isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                        </button>

                        {isExpanded && (
                            <ul className="mt-1 ml-4 border-l border-border pl-2 space-y-1">
                                {item.subItems.map((sub) => {
                                    const isSubActive = pathname === sub.path;
                                    return (
                                        <li key={sub.path}>
                                            <Link
                                                href={sub.path}
                                                className={cn(
                                                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm transition-all",
                                                    isSubActive
                                                        ? "text-primary font-medium bg-primary/5"
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                )}
                                            >
                                                {sub.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </li>
                );
            }

            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  href={item.path || "#"}
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