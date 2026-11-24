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
  FolderOpen,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  AlertCircle,
  FileText,
  Download,
  Upload,
  MoreVertical
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Document {
  _id: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  type: string;
  name: string;
  status: string;
  uploadedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export default function PartnerDocumentsPage() {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const statuses = ["all", "pending", "verified", "rejected", "expired"];
  const types = ["all", "passport", "transcript", "ielts", "toefl", "cv", "sop", "lor", "financial", "visa", "other"];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const params = new URLSearchParams({
          search,
          status: statusFilter,
          type: typeFilter,
          page: currentPage.toString(),
          limit: itemsPerPage.toString()
        });

        const res = await fetch(`/api/partner/documents?${params}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setDocuments([]);
          setTotalPages(1);
          return;
        }

        const data = await res.json();
        setDocuments(Array.isArray(data.documents) ? data.documents : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Documents Load Error:", error);
        setDocuments([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDocuments();
    } else {
      setLoading(false);
    }
  }, [session, search, statusFilter, typeFilter, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "verified":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "expired":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "passport": return "📘";
      case "transcript": return "📄";
      case "ielts": return "📝";
      case "toefl": return "📝";
      case "cv": return "📋";
      case "sop": return "📝";
      case "lor": return "📨";
      case "financial": return "💰";
      case "visa": return "🛂";
      default: return "📄";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = documents.filter(d => d.status.toLowerCase() === "pending").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderOpen className="h-7 w-7 text-primary" />
            Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and verify student documents
            {pendingCount > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 text-[10px] bg-yellow-100 text-yellow-700">
                {pendingCount} pending
              </Badge>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/partner/documents/upload">
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student, document name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
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
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Documents ({documents.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <FolderOpen className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No documents found</p>
              <p className="text-sm">
                {search || statusFilter !== "all" || typeFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Documents will appear here when students upload them."}
              </p>
              {(search || statusFilter !== "all" || typeFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all"); setTypeFilter("all"); }} className="mt-4">
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
                      <TableHead className="w-40">Document</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden md:table-cell">Type</TableHead>
                      <TableHead className="w-36">Status</TableHead>
                      <TableHead className="w-40">Uploaded</TableHead>
                      <TableHead className="w-50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-lg">
                              {getTypeIcon(doc.type)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{doc.studentName}</p>
                            <p className="text-xs text-muted-foreground">{doc.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm capitalize">{doc.type}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/partner/documents/${doc._id}`} title="View Details">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            {doc.status.toLowerCase() === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600 hover:bg-green-50"
                                  title="Verify"
                                  onClick={() => verifyDocument(doc._id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                                  title="Reject"
                                  onClick={() => rejectDocument(doc._id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
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

  function verifyDocument(id: string) {
    toast.success("Document verified");
    // In real app: call API to verify
  }

  function rejectDocument(id: string) {
    toast.info("Document rejected");
    // In real app: call API to reject
  }
}