"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FileText,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  ArrowRight,
  University,
  GraduationCap,
  Calendar,
  Flag
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Application {
  _id: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  university: string;
  program: string;
  intake: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function PartnerApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [intakeFilter, setIntakeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const statuses = ["all", "draft", "submitted", "under review", "accepted", "rejected", "waitlisted", "deferred", "enrolled", "withdrawn"];
  const intakes = ["all", "fall-2024", "spring-2025", "fall-2025", "spring-2026"];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const params = new URLSearchParams({
          search,
          status: statusFilter,
          intake: intakeFilter,
          page: currentPage.toString(),
          limit: itemsPerPage.toString()
        });

        const res = await fetch(`/api/partner/applications?${params}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setApplications([]);
          setTotalPages(1);
          return;
        }

        const data = await res.json();
        setApplications(Array.isArray(data.applications) ? data.applications : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Applications Load Error:", error);
        setApplications([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, [session, search, statusFilter, intakeFilter, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "under review":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-green-100 text-green-700";
      case "enrolled":
        return "bg-emerald-100 text-emerald-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "waitlisted":
        return "bg-orange-100 text-orange-700";
      case "deferred":
        return "bg-purple-100 text-purple-700";
      case "withdrawn":
        return "bg-slate-100 text-slate-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Applications
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage student applications</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student, university, program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={intakeFilter} onValueChange={setIntakeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Intakes" />
              </SelectTrigger>
              <SelectContent>
                {intakes.map((intake) => (
                  <SelectItem key={intake} value={intake}>
                    {intake === "all" ? "All Intakes" : intake.replace("-", " ").toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Applications ({applications.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <FileText className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No applications found</p>
              <p className="text-sm">
                {search || statusFilter !== "all" || intakeFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Applications will appear here when students apply through your portal."}
              </p>
              {(search || statusFilter !== "all" || intakeFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all"); setIntakeFilter("all"); }} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Student</TableHead>
                      <TableHead>University & Program</TableHead>
                      <TableHead className="hidden md:table-cell">Intake</TableHead>
                      <TableHead className="w-36">Status</TableHead>
                      <TableHead className="w-40">Applied</TableHead>
                      <TableHead className="w-50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow key={app._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div>
                            <p className="font-medium">{app.studentName}</p>
                            <p className="text-xs text-muted-foreground">{app.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <University className="h-3 w-3 text-muted-foreground" />
                              <span>{app.university}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{app.program}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Flag className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{app.intake.replace("-", " ").toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {app.createdAt ? format(new Date(app.createdAt), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/partner/applications/${app._id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}