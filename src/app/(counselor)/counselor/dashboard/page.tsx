"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  FileText, 
  CheckSquare, 
  Clock, 
  ArrowRight, 
  Loader2, 
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Student {
  _id: string;
  name: string;
  email: string;
  image?: string;
  joinedAt: string;
}

interface Task {
  _id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
  status: string;
}

interface DashboardStats {
  totalStudents: number;
  activeApplications: number;
  pendingTasks: number;
  recentStudents: Student[];
  upcomingTasks: Task[];
}

export default function CounselorDashboard() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeApplications: 0,
    pendingTasks: 0,
    recentStudents: [],
    upcomingTasks: []   
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/counselor/dashboard");
        if (!res.ok) {
            throw new Error("Failed to fetch dashboard data");
        }
        const data = await res.json();
        
        setStats({
            totalStudents: data.totalStudents || 0,
            activeApplications: data.activeApplications || 0,
            pendingTasks: data.pendingTasks || 0,
            recentStudents: Array.isArray(data.recentStudents) ? data.recentStudents : [],
            upcomingTasks: Array.isArray(data.upcomingTasks) ? data.upcomingTasks : []
        });

      } catch (error) {
        console.error("Dashboard Load Error:", error);
        toast.error("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const getPriorityColor = (priority: string) => {
      switch(priority) {
          case "High": return "text-red-500 border-red-200 bg-red-50";
          case "Medium": return "text-yellow-600 border-yellow-200 bg-yellow-50";
          default: return "text-green-600 border-green-200 bg-green-50";
      }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in-50 p-6 md:p-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, <span className="font-semibold text-foreground">{session?.user?.name || "Counselor"}</span>. Here is an overview of your activity.
          </p>
        </div>
        <div className="flex gap-2">
            <Link href="/counselor/tasks">
                <Button variant="outline">View All Tasks</Button>
            </Link>
            <Link href="/counselor/students">
                <Button>Manage Students</Button>
            </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Active students assigned
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeApplications}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Applications currently in progress
            </p>
          </CardContent>
        </Card>

       
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTasks}</div>
            <p className="text-xs text-orange-600 font-medium mt-1">
              Requires your attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        
        <Card className="col-span-4 shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recently updated student applications.</CardDescription>
            </div>
            <Link href="/counselor/students" className="text-sm text-primary hover:underline flex items-center">
                View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
                  <Users className="h-10 w-10 mb-2 opacity-20" />
                  <p>No recent student activity found.</p>
                </div>
              ) : (
                stats.recentStudents.map((student) => (
                  <div key={student._id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 rounded-lg border transition-colors group">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={student.image} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1">
                        <p className="text-sm font-semibold leading-none text-foreground group-hover:text-primary transition-colors">
                            {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <Link href={`/counselor/students/${student._id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                Priority Tasks
                {stats.pendingTasks > 0 && <Badge variant="destructive" className="ml-auto text-[10px] h-5">{stats.pendingTasks}</Badge>}
            </CardTitle>
            <CardDescription>Tasks requiring immediate action.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {stats.upcomingTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
                        <CheckSquare className="h-10 w-10 mb-2 opacity-20" />
                        <p>All caught up! No pending tasks.</p>
                    </div>
                ) : (
                    stats.upcomingTasks.map((task) => (
                        <div key={task._id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                            <div className="mt-1">
                                {task.priority === 'High' ? (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium leading-none line-clamp-1">{task.title}</p>
                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border ${getPriorityColor(task.priority)}`}>
                                        {task.priority}
                                    </Badge>
                                </div>
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-xs text-muted-foreground">
                                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                                    </span>
                                    <Link href={`/counselor/tasks`}>
                                        <span className="text-[10px] text-primary hover:underline cursor-pointer">View</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}