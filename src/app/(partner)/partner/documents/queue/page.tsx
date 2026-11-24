"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  FolderOpen,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  X,
  AlertCircle,
  FileText,
  Clock,
  User,
  Filter
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
  priority: "high" | "normal" | "low";
}

export default function PartnerDocumentsQueuePage() {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const params = new URLSearchParams({
          status: "pending",
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
        console.error("Queue Load Error:", error);
        setDocuments([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchQueue();
    } else {
      setLoading(false);
    }
  }, [session, currentPage]);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "normal": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const pendingCount = documents.length;
  const highPriorityCount = documents.filter(d => d.priority === "high").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderOpen className="h-7 w-7 text-primary" />
            Verification Queue
          </h1>
          <p className="text-muted-foreground mt-1">Documents pending verification</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className={highPriorityCount > 0 ? "bg-red-100 text-red-700" : ""}>
            {highPriorityCount} High Priority
          </Badge>
          <Badge variant="secondary" className="h-5 text-[10px]">
            {pendingCount} Total Pending
          </Badge>
        </div>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FolderOpen className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Review</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{highPriorityCount}</p>
              <p className="text-sm text-muted-foreground">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {documents.length > 0
                  ? Math.min(...documents.map(d => {
                      const hours = (Date.now() - new Date(d.uploadedAt).getTime()) / (1000 * 60 * 60);
                      return Math.round(hours);
                    }))
                  : 0}h
              </p>
              <p className="text-sm text-muted-foreground">Oldest Pending</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Documents Awaiting Verification</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <FolderOpen className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">Verification queue is empty</p>
              <p className="text-sm">All documents have been processed!</p>
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
                      <TableHead className="w-36">Priority</TableHead>
                      <TableHead className="w-40">Submitted</TableHead>
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
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm">{doc.studentName}</p>
                              <p className="text-xs text-muted-foreground">{doc.studentEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm capitalize">{doc.type}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getPriorityColor(doc.priority)}>
                            {doc.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM d, yyyy HH:mm") : "-"}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/partner/documents/${doc._id}`}>
                              <Button variant="ghost" size="sm" className="gap-1">
                                <Eye className="h-3 w-3" />
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700"
                              onClick={() => verifyDocument(doc._id)}
                            >
                              <Check className="h-3 w-3" />
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-red-600 hover:bg-red-50 border-red-200"
                              onClick={() => rejectDocument(doc._id)}
                            >
                              <X className="h-3 w-3" />
                              Reject
                            </Button>
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