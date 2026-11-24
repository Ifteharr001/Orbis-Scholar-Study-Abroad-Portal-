"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  FileText,
  Mail,
  CheckSquare,
  Calendar,
  AlertCircle,
  Check,
  X,
  Loader2,
  Filter
} from "lucide-react";
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

export default function CounselorNotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Mock data - in real app, this would come from an API
  const mockNotifications: Notification[] = [
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
    {
      id: "5",
      type: "application",
      title: "Application Status Updated",
      message: "Application for Lisa Anderson moved to 'Under Review'",
      time: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      read: true,
      link: "/counselor/applications",
    },
    {
      id: "6",
      type: "document",
      title: "New Document Uploaded",
      message: "David Kim uploaded IELTS certificate",
      time: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
      read: true,
      link: "/counselor/documents",
    },
    {
      id: "7",
      type: "message",
      title: "Student Query",
      message: "James Smith asked about scholarship opportunities",
      time: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      read: false,
      link: "/counselor/communications",
    },
    {
      id: "8",
      type: "task",
      title: "Task Completed",
      message: "You completed: Review financial documents for Anna Lee",
      time: new Date(Date.now() - 1000 * 60 * 60 * 168).toISOString(),
      read: true,
      link: "/counselor/tasks",
    },
  ];

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, []);

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "application":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "message":
        return <Mail className="h-5 w-5 text-green-500" />;
      case "task":
        return <CheckSquare className="h-5 w-5 text-orange-500" />;
      case "appointment":
        return <Calendar className="h-5 w-5 text-purple-500" />;
      case "document":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: Notification["type"]) => {
    switch (type) {
      case "application": return "Application";
      case "message": return "Message";
      case "task": return "Task";
      case "appointment": return "Appointment";
      case "document": return "Document";
      default: return "Notification";
    }
  };

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "application": return "bg-blue-100 text-blue-700 border-blue-200";
      case "message": return "bg-green-100 text-green-700 border-green-200";
      case "task": return "bg-orange-100 text-orange-700 border-orange-200";
      case "appointment": return "bg-purple-100 text-purple-700 border-purple-200";
      case "document": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all your notifications
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1">
              <Check className="h-4 w-4" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle className="text-lg">All Notifications</CardTitle>
            <CardDescription>
              {notifications.length} total • {unreadCount} unread
            </CardDescription>
            <div className="flex items-center gap-2 border rounded-lg p-1 bg-muted/30">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                size="sm"
                className="gap-1"
                onClick={() => setFilter("all")}
              >
                <Filter className="h-3 w-3" />
                All
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "ghost"}
                size="sm"
                className="gap-1"
                onClick={() => setFilter("unread")}
              >
                <Bell className="h-3 w-3" />
                Unread
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No notifications found</p>
              <p className="text-sm">
                {filter === "unread"
                  ? "All caught up! No unread notifications."
                  : "You're all caught up. New notifications will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 border-b last:border-0 transition-colors ${
                    !notification.read ? "bg-primary/5" : "bg-card"
                  } hover:bg-muted/30`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`p-2 rounded-lg border ${getTypeColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className={`font-medium ${!notification.read ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`text-xs h-5 px-2 ${getTypeColor(notification.type)}`}
                          >
                            {getTypeLabel(notification.type)}
                          </Badge>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(notification.time), { addSuffix: true })}
                        </span>
                        {notification.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              markAsRead(notification.id);
                              window.location.href = notification.link!;
                            }}
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredNotifications.length > 0 && (
            <div className="mt-6 pt-4 border-t flex justify-center">
              <Button variant="outline" onClick={() => setIsLoadingMore(true)} disabled={isLoadingMore}>
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}