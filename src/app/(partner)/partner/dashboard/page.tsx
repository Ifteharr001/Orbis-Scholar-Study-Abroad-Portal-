"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  FolderOpen,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Loader2,
  Building2,
  Settings,
  HelpCircle
} from "lucide-react";
import { toast } from "sonner";

interface Student {
  _id: string;
  name: string;
  email: string;
  image?: string;
  status: string;
  country: string;
  joinedAt: string;
}

interface Application {
  _id: string;
  studentName: string;
  university: string;
  program: string;
  status: string;
  createdAt: string;
}

interface DashboardStats {
  totalStudents: number;
  activeApplications: number;
  pendingDocuments: number;
  totalRevenue: number;
  recentStudents: Student[];
  recentApplications: Application[];
}

export default function PartnerDashboardPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    activeApplications: 0,
    pendingDocuments: 0,
    totalRevenue: 0,
    recentStudents: [],
    recentApplications: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/partner/dashboard", {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          // If API doesn't exist yet, use empty state
          setStats({
            totalStudents: 0,
            activeApplications: 0,
            pendingDocuments: 0,
            totalRevenue: 0,
            recentStudents: [],
            recentApplications: []
          });
          return;
        }

        const data = await res.json();
        setStats({
          totalStudents: data.totalStudents || 0,
          activeApplications: data.activeApplications || 0,
          pendingDocuments: data.pendingDocuments || 0,
          totalRevenue: data.totalRevenue || 0,
          recentStudents: Array.isArray(data.recentStudents) ? data.recentStudents : [],
          recentApplications: Array.isArray(data.recentApplications) ? data.recentApplications : []
        });
      } catch (error) {
        console.error("Dashboard Load Error:", error);
        // Empty state on error
        setStats({
          totalStudents: 0,
          activeApplications: 0,
          pendingDocuments: 0,
          totalRevenue: 0,
          recentStudents: [],
          recentApplications: []
        });
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "accepted":
      case "enrolled":
        return "bg-green-100 text-green-700";
      case "pending":
      case "submitted":
      case "under review":
        return "bg-yellow-100 text-yellow-700";
      case "completed":
      case "approved":
        return "bg-blue-100 text-blue-700";
      case "rejected":
      case "declined":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
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
            Welcome back, <span className="font-semibold text-foreground">{session?.user?.name || "Partner"}</span>. Here's an overview of your portal.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link href="/partner/students">
            <Button>Manage Students</Button>
          </Link>
          <Link href="/partner/applications">
            <Button variant="outline">View Applications</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              Students assigned to you
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Documents</CardTitle>
            <FolderOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingDocuments}</div>
            <p className="text-xs text-orange-600 font-medium mt-1">
              Requires verification
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue?.toLocaleString() || "0"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Revenue from successful placements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Students */}
        <Card className="col-span-2 shadow-sm border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Students</CardTitle>
              <CardDescription>Students recently assigned to you</CardDescription>
            </div>
            <Link href="/partner/students" className="text-sm text-primary hover:underline flex items-center">
              View All <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
                  <Users className="h-10 w-10 mb-2 opacity-20" />
                  <p>No students assigned yet.</p>
                  <p className="text-sm">Students will appear here once admin assigns them to you.</p>
                </div>
              ) : (
                stats.recentStudents.slice(0, 5).map((student) => (
                  <div key={student._id} className="flex items-center justify-between p-3 bg-card hover:bg-muted/50 rounded-lg border transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-semibold">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-semibold leading-none text-foreground group-hover:text-primary transition-colors">
                          {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                      <Link href={`/partner/students/${student._id}`}>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="col-span-1 shadow-sm border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Applications
              {stats.activeApplications > 0 && <Badge variant="secondary" className="ml-auto text-[10px] h-5">{stats.activeApplications}</Badge>}
            </CardTitle>
            <CardDescription>Latest application updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentApplications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
                  <FileText className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">No applications yet</p>
                </div>
              ) : (
                stats.recentApplications.slice(0, 5).map((app) => (
                  <div key={app._id} className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                    <div className="flex-1 space-y-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <p className="text-sm font-medium leading-none line-clamp-1">{app.studentName}</p>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 border ${getStatusColor(app.status)}`}>
                          {app.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{app.university} - {app.program}</p>
                      <Link href={`/partner/applications/${app._id}`} className="text-xs text-primary hover:underline">View Details</Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Cards - Quick Access to All Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Quick Access</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/partner/students" className="block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full border-border bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-primary/10 rounded-full mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Students</h3>
                <p className="text-sm text-muted-foreground">Manage your students</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/applications" className="block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full border-border bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Applications</h3>
                <p className="text-sm text-muted-foreground">Track applications</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/documents" className="block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full border-border bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-orange-100 rounded-full mb-4">
                  <FolderOpen className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Documents</h3>
                <p className="text-sm text-muted-foreground">Verify documents</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/finance" className="block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full border-border bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-green-100 rounded-full mb-4">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Finance</h3>
                <p className="text-sm text-muted-foreground">Invoices & payments</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/profile" className="block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full border-border bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-gray-100 rounded-full mb-4">
                  <Settings className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Profile & Settings</h3>
                <p className="text-sm text-muted-foreground">Update your profile</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/partner/help" className="block">
            <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-200 h-full border-border bg-gradient-to-br from-card to-muted/30">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-3 bg-cyan-100 rounded-full mb-4">
                  <HelpCircle className="h-6 w-6 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Help & Resources</h3>
                <p className="text-sm text-muted-foreground">Guides & support</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}