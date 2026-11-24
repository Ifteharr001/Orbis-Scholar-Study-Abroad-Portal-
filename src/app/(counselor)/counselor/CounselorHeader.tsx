"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Bell, User, LogOut, Check, X, Mail, AlertCircle, Calendar, FileText, CheckSquare } from "lucide-react";
import CounselorSidebar from "./CounselorSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  type: "application" | "message" | "task" | "appointment" | "document";
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

export default function CounselorHeader() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "application",
      title: "New Application Submitted",
      message: "John Doe submitted an application for University of Toronto",
      time: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      link: "/counselor/applications",
    },
    {
      id: "2",
      type: "message",
      title: "New Message from Student",
      message: "Sarah Wilson sent you a message regarding visa documents",
      time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: false,
      link: "/counselor/communications",
    },
    {
      id: "3",
      type: "task",
      title: "Task Due Soon",
      message: "Review application documents for Michael Chen - due tomorrow",
      time: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
      link: "/counselor/tasks",
    },
    {
      id: "4",
      type: "appointment",
      title: "Upcoming Appointment",
      message: "Meeting with Emily Brown scheduled for tomorrow at 10:00 AM",
      time: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      read: true,
      link: "/counselor/appointments",
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "message":
        return <Mail className="h-4 w-4 text-green-500" />;
      case "task":
        return <CheckSquare className="h-4 w-4 text-orange-500" />;
      case "appointment":
        return <Calendar className="h-4 w-4 text-purple-500" />;
      case "document":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <CounselorSidebar
              collapsed={false}
              setCollapsed={() => {}}
              isMobile={true}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              user={(session?.user as any) || null}
            />
          </SheetContent>
        </Sheet>

        <h1 className="text-lg font-semibold md:hidden">Orbis Scholar</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-600 text-white text-[10px] font-medium flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <DropdownMenuLabel className="font-semibold">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-primary"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-[350px] w-full">
              <div className="py-2">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                      onClick={() => {
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                        }
                      }}
                      onSelect={(e) => {
                        e.preventDefault();
                        markAsRead(notification.id);
                        if (notification.link) {
                          window.location.href = notification.link;
                        }
                      }}
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${!notification.read ? "font-semibold" : ""}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
                      )}
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </ScrollArea>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem
              asChild
              className="text-center text-primary hover:bg-primary/10 px-4 py-2"
            >
              <Link href="/counselor/notifications" className="text-sm font-medium">
                View All Notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {session?.user?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
                <span className="text-[10px] font-bold text-blue-600 mt-1 uppercase">Counselor</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/counselor/profile">
                <User className="mr-2 h-4 w-4" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/counselor/login" })}
              className="text-red-600 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}