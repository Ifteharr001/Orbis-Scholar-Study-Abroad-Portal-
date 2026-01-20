"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  GraduationCap,
  BadgeDollarSign,
  CheckSquare,
  MessageSquare,
  BarChart3,
  HelpCircle,
  FolderOpen,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Menu,
  User as UserIcon,
  LogOut,
  UserCircle,
  Calendar
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";


interface SubItem {
  label: string;
  path: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon: React.ElementType;
  subItems?: SubItem[];
}

interface CounselorSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any; 
}

const sidebarItems: MenuItem[] = [
  { title: "Dashboard", href: "/counselor", icon: LayoutDashboard },
  { title: "My Students", href: "/counselor/students", icon: Users },
  { title: "Applications", href: "/counselor/applications", icon: FileText },
  { title: "Documents", href: "/counselor/documents", icon: FolderOpen },
  { title: "Universities", href: "/counselor/universities", icon: BookOpen },
  { title: "Scholarships", href: "/counselor/scholarships", icon: GraduationCap },
  { title: "Finance", href: "/counselor/finance", icon: BadgeDollarSign },
  { title: "Tasks", href: "/counselor/tasks", icon: CheckSquare },
  { title: "Communications", href: "/counselor/communications", icon: MessageSquare },
  { title: "Appointment", href: "/counselor/appointments", icon: Calendar },
  { title: "Reports", href: "/counselor/reports", icon: BarChart3 },
  { title: "Help & Docs", href: "/counselor/help", icon: HelpCircle },
  { title: "Profile", href: "/counselor/profile", icon: UserCircle },
];

export default function CounselorSidebar({ collapsed, setCollapsed, isMobile }: CounselorSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession(); 
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const user = session?.user || { name: "Counselor", email: "counselor@orbisscholar.com" };

  // Toggle Function
  const onToggle = () => {
    setCollapsed(!collapsed);
  };

  const toggleMenu = (path: string) => {
    setOpenMenus(prev => 
      prev.includes(path) 
        ? prev.filter(p => p !== path) 
        : [...prev, path]
    );
  };

  // Active Route Logic
  const isActive = (path: string) => {
    if (path === "/counselor") {
        return pathname === "/counselor";
    }
    return pathname === path || pathname.startsWith(`${path}/`);
  };
  
  const isParentActive = (item: MenuItem) => {
    if (isActive(item.href)) return true;
    return item.subItems?.some(sub => isActive(sub.path)) ?? false;
  };

  return (
    <>
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setCollapsed(true)}
        />
      )}

      <div 
        className={cn(
          "fixed left-0 top-0 h-full bg-background border-r border-border flex flex-col transition-all duration-300 z-50",
          collapsed ? isMobile ? "-translate-x-full" : "w-16" : "w-64"
        )}
      >
        {/* Logo Area */}
        <div className="p-4 border-b border-border flex items-center justify-between h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-foreground text-sm truncate">Orbis Scholar</h1>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">Counselor Portal</p>
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggle}
            className={cn("flex-shrink-0 hidden md:flex", collapsed && "mx-auto")}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
          
          {!collapsed && isMobile && (
             <Button variant="ghost" size="icon" onClick={() => setCollapsed(true)} className="md:hidden">
               <PanelLeftClose className="h-4 w-4" />
             </Button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-muted">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openMenus.includes(item.href);
              const parentActive = isParentActive(item);

              if (hasSubItems && !collapsed) {
                return (
                  <li key={item.href}>
                    <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.href)}>
                      <CollapsibleTrigger asChild>
                        <button
                          className={cn(
                            "flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm transition-colors group",
                            parentActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className={cn("h-5 w-5 flex-shrink-0", parentActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                          <span className="flex-1 text-left truncate">{item.title}</span>
                          {isOpen ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-9 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path} 
                            className={cn(
                              "block px-3 py-2 rounded-md text-sm transition-colors border-l-2 border-transparent",
                              isActive(subItem.path)
                                ? "text-primary border-primary bg-primary/5 font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                      isActive(item.href)
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive(item.href) ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {!collapsed && <span className="truncate">{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-background">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : <UserIcon className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                        {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                        </p>
                    </div>
                </div>
                
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
          </div>
        )}
        
        {collapsed && (
             <div className="p-4 border-t border-border flex justify-center">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    title="Logout" 
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                >
                    <LogOut className="h-5 w-5" />
                </Button>
             </div>
        )}
      </div>
      
      {isMobile && collapsed && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-3 left-4 z-50 md:hidden bg-background border-border shadow-sm"
          onClick={() => setCollapsed(false)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  );
}