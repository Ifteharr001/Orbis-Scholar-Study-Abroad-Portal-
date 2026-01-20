"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { 
  Search, Loader2, Eye, Building2, Calendar, FileText, User 
} from "lucide-react";

// ডাটা টাইপ ইন্টারফেস
interface ApplicationData {
  _id: string;
  applicationId: string;
  firstName: string;
  lastName: string;
  studentEmail: string;
  universityName: string;
  programName: string;
  status: string;
  appliedDate: string;
  createdAt: string;
}

export default function CounselorApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [filteredApps, setFilteredApps] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // ১. ডাটা ফেচ করা
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/counselor/applications", {
            cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setApplications(data.applications);
            setFilteredApps(data.applications);
          }
        }
      } catch (error) {
        console.error("Failed to fetch applications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // ২. সার্চ লজিক
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = applications.filter(
      (app) =>
        (app.firstName + " " + app.lastName).toLowerCase().includes(lowerSearch) ||
        app.studentEmail.toLowerCase().includes(lowerSearch) ||
        app.universityName.toLowerCase().includes(lowerSearch) ||
        (app.applicationId || "").toLowerCase().includes(lowerSearch)
    );
    setFilteredApps(filtered);
  }, [search, applications]);

  // ৩. স্ট্যাটাস অনুযায়ী ব্যাজ কালার
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Enrolled": return "bg-green-500 hover:bg-green-600";
      case "Rejected": return "bg-red-500 hover:bg-red-600";
      case "Offer Received": return "bg-blue-500 hover:bg-blue-600";
      case "Visa Processing": return "bg-purple-500 hover:bg-purple-600";
      default: return "bg-secondary hover:bg-secondary/80 text-secondary-foreground";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            My Applications
          </h1>
          <p className="text-muted-foreground">
            View and manage university applications assigned to you ({applications.length}).
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student, university or ID..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader className="p-0"></CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="pl-6">App ID</TableHead>
                        <TableHead>Student</TableHead>
                        <TableHead>University & Program</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied Date</TableHead>
                        <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredApps.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                No applications found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredApps.map((app) => (
                            <TableRow key={app._id} className="hover:bg-muted/50 transition-colors">
                                
                                {/* Application ID */}
                                <TableCell className="pl-6 font-mono text-xs font-medium">
                                    {app.applicationId || app._id.slice(-6).toUpperCase()}
                                </TableCell>
                                
                                {/* Student Info */}
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium flex items-center gap-1">
                                            <User className="h-3 w-3 text-muted-foreground" />
                                            {app.firstName} {app.lastName}
                                        </span>
                                        <span className="text-xs text-muted-foreground ml-4">
                                            {app.studentEmail}
                                        </span>
                                    </div>
                                </TableCell>
                                
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{app.universityName}</span>
                                            <span className="text-xs text-muted-foreground">{app.programName}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                
                                {/* Status Badge */}
                                <TableCell>
                                    <Badge className={`${getStatusBadge(app.status)} whitespace-nowrap`}>
                                        {app.status}
                                    </Badge>
                                </TableCell>
                                
                                {/* Date */}
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                
                                {/* Action Button */}
                                <TableCell className="text-right pr-6">
                                    <Link href={`/counselor/applications/${app._id}`}>
                                        <Button variant="outline" size="sm" className="h-8 gap-1">
                                            <Eye className="h-3.5 w-3.5" /> Detail
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}