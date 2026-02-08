"use client"; 

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  FolderCheck, 
  Landmark,
  GraduationCap,
  DollarSign,
  CheckSquare,
  MessageSquare,
  Handshake,
  BarChart3,
  ShieldAlert,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: SubItem[];
}

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile: boolean;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

const menuItems: MenuItem[] = [
  { 
    icon: LayoutDashboard, 
    label: "Dashboard", 
    path: "/admin/dashboard"
  },
  { 
    icon: Users, 
    label: "Students", 
    path: "/admin/students",
    subItems: [
      { label: "All Students", path: "/admin/students" },
      { label: "New Student", path: "/admin/students/new" },
      { label: "Imports", path: "/admin/students/imports" },
      { label: "Segments", path: "/admin/students/segments" },
    ]
  },
  { 
    icon: FileText, 
    label: "Applications", 
    path: "/admin/applications",
    subItems: [
      { label: "Pipeline (Kanban)", path: "/admin/applications/pipeline" },
      { label: "All Applications", path: "/admin/applications" },
    ]
  },
  { 
    icon: FolderCheck, 
    label: "Documents", 
    path: "/admin/documents",
    subItems: [
      { label: "Verification Queue", path: "/admin/documents/queue" },
      { label: "All Documents", path: "/admin/documents/all-documents" },
      { label: "Fraud Flags", path: "/admin/documents/fraud" },
    ]
  },
  { 
    icon: Landmark, 
    label: "Universities & Programs", 
    path: "/admin/catalog",
    subItems: [
      { label: "Universities", path: "/admin/catalog/universities" },
      { label: "Programs", path: "/admin/catalog/programs" },
      { label: "Intakes", path: "/admin/catalog/intakes" },
    ]
  },
  { 
    icon: GraduationCap, 
    label: "Scholarships", 
    path: "/admin/scholarships",
    subItems: [
      { label: "All Scholarships", path: "/admin/scholarships" },
      { label: "Mappings", path: "/admin/scholarships/mappings" },
    ]
  },
  { 
    icon: DollarSign, 
    label: "Finance", 
    path: "/admin/finance",
    subItems: [
      { label: "Invoices", path: "/admin/finance/invoices" },
      { label: "Payments", path: "/admin/finance/payments" },
      { label: "Fee Schedules", path: "/admin/finance/fees" },
    ]
  },
  { 
    icon: CheckSquare, 
    label: "Tasks", 
    path: "/admin/tasks",
    subItems: [
      { label: "My Tasks", path: "/admin/tasks" },
      { label: "Team Tasks", path: "/admin/tasks/team" },
    ]
  },
  { 
    icon: MessageSquare, 
    label: "Communications", 
    path: "/admin/comms",
    subItems: [
      { label: "Inbox", path: "/admin/comms/inbox" },
    ]
  },
  { 
    icon: Handshake, 
    label: "Agents & Partners", 
    path: "/admin/agents",
    subItems: [
      { label: "All Agents", path: "/admin/agents" },
      { label: "Referrals", path: "/admin/agents/referrals" },
      { label: "Contracts", path: "/admin/agents/contracts" },
    ]
  },
  { 
    icon: BarChart3, 
    label: "Reports & Analytics", 
    path: "/admin/reports",
    subItems: [
      { label: "Funnels", path: "/admin/reports/funnels" },
      { label: "Conversions", path: "/admin/reports/conversions" },
    ]
  },
  { 
    icon: ShieldAlert, 
    label: "Audit & Security", 
    path: "/admin/security",
    subItems: [
      { label: "Audit Log", path: "/admin/security/audit" },
    ]
  },
  { 
    icon: Settings, 
    label: "Settings", 
    path: "/admin/settings",
    subItems: [
      { label: "Users & Roles", path: "/admin/settings/users" },
      { label: "Pipelines", path: "/admin/settings/pipelines" },
    ]
  },
  { 
    icon: HelpCircle, 
    label: "Help & Docs", 
    path: "/admin/help",
    subItems: [
      { label: "Support", path: "/admin/help/support" },
    ]
  },
];

const AdminSidebar = ({ collapsed, setCollapsed, isMobile, user }: AdminSidebarProps) => {
  const pathname = usePathname(); 
  const [openMenus, setOpenMenus] = useState<string[]>([]);

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

  const isActive = (path: string) => pathname === path;
  
  const isParentActive = (item: MenuItem) => {
    if (isActive(item.path)) return true;
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
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h1 className="font-bold text-foreground text-sm truncate">Orbischolar</h1>
                <p className="text-[10px] text-muted-foreground truncate uppercase tracking-wider">Admin Portal</p>
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
            {menuItems.map((item) => {
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isOpen = openMenus.includes(item.path);
              const parentActive = isParentActive(item);

              if (hasSubItems && !collapsed) {
                return (
                  <li key={item.path}>
                    <Collapsible open={isOpen} onOpenChange={() => toggleMenu(item.path)}>
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
                          <span className="flex-1 text-left truncate">{item.label}</span>
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
                <li key={item.path}>
                  <Link
                    href={hasSubItems ? item.subItems![0].path : item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors group",
                      parentActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <item.icon className={cn("h-5 w-5 flex-shrink-0", parentActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 ring-2 ring-background">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : "OW"}
              </div>
              <div className="min-w-0">
                <p className="font-medium text-foreground text-sm truncate">
                  {user?.name || "Owner Admin"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email || "owner@orbischolar.com"}
                </p>
              </div>
            </div>
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
};

export default AdminSidebar;