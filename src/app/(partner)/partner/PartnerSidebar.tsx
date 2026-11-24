"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  FolderOpen,
  DollarSign,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Menu,
  LogOut,
  UserCircle,
  User,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
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

interface PartnerSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}

const sidebarItems: MenuItem[] = [
  { title: "Dashboard", href: "/partner/dashboard", icon: LayoutDashboard },
  {
    title: "Students",
    href: "/partner/students",
    icon: Users,
    subItems: [
      { label: "My Students", path: "/partner/students" },
      { label: "Add Student", path: "/partner/students/new" },
    ]
  },
  {
    title: "Applications",
    href: "/partner/applications",
    icon: FileText,
    subItems: [
      { label: "All Applications", path: "/partner/applications" },
      { label: "Pipeline", path: "/partner/applications/pipeline" },
    ]
  },
  {
    title: "Documents",
    href: "/partner/documents",
    icon: FolderOpen,
    subItems: [
      { label: "All Documents", path: "/partner/documents" },
      { label: "Verification Queue", path: "/partner/documents/queue" },
    ]
  },
  {
    title: "Finance",
    href: "/partner/finance",
    icon: DollarSign,
    subItems: [
      { label: "Invoices", path: "/partner/finance/invoices" },
      { label: "Payments", path: "/partner/finance/payments" },
      { label: "Fee Schedules", path: "/partner/finance/fees" },
    ]
  },
  { title: "Profile & Settings", href: "/partner/profile", icon: Settings },
  { title: "Help & Resources", href: "/partner/help", icon: HelpCircle },
];

export default function PartnerSidebar({ collapsed, setCollapsed, isMobile, user }: PartnerSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const userData = user || session?.user || { name: "Partner", email: "partner@orbisscholar.com" };

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

  const isActive = (path: string) => {
    if (path === "/partner/dashboard") {
        return pathname === "/partner" || pathname === "/partner/dashboard";
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

        <div className="p-4 border-b border-border flex items-center justify-between h-16">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-foreground text-sm truncate">Orbis Scholar</h1>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">Partner Portal</p>
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
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-background">
                        {userData.name ? userData.name.slice(0, 2).toUpperCase() : <UserCircle className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                        {userData.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                        {userData.email}
                        </p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-500"
                    onClick={() => signOut({ callbackUrl: "/partnerAuth" })}
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
                    onClick={() => signOut({ callbackUrl: "/partnerAuth" })}
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