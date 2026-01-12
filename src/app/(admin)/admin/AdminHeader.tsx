"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, ChevronDown, LogOut, User, Settings, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AdminHeaderProps {
  sidebarCollapsed: boolean;
}

const AdminHeader = ({ sidebarCollapsed }: AdminHeaderProps) => {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  // ১. ইউজার ডেটা ফেচ করা (API থেকে)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // ২. লগআউট ফাংশন
  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        toast.success("Logged out successfully");
        router.push("/admin/login");
        router.refresh(); // রাউটার রিফ্রেশ করলে মিডলওয়্যার নতুন করে চেক করবে
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-6 z-30 transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search students, applications, documents..." 
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                5
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-background border border-border shadow-lg z-50">
            <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
                <span className="font-medium text-sm">New application submitted</span>
                <span className="text-xs text-muted-foreground">John Doe applied to Oxford University</span>
                <span className="text-xs text-muted-foreground">2 minutes ago</span>
              </DropdownMenuItem>
              {/* আরও নোটিফিকেশন... */}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-primary cursor-pointer justify-center">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown (Updated with Dynamic Data) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-muted">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm">
                {/* লোডিং অবস্থায় স্পিনার দেখাবে, ডাটা আসলে নামের আদ্যক্ষর */}
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  user?.name?.slice(0, 2).toUpperCase() || "AD"
                )}
              </div>
              <div className="hidden md:block text-left">
                {loading ? (
                  // লোডিং স্কেলিটন
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                    <div className="h-2 w-12 bg-muted animate-pulse rounded" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium text-foreground">
                      {user?.name || "Admin"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user?.role || "Staff"}
                    </p>
                  </>
                )}
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg z-50">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {/* লগআউট বাটন আপডেট করা হয়েছে */}
            <DropdownMenuItem 
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminHeader;