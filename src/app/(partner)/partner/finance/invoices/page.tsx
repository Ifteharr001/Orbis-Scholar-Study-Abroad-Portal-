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
  Landmark,
  GraduationCap,
  User,
  DollarSign,
  Plus,
  Download,
  Mail,
  CheckCircle,
  AlertCircle,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  university: string;
  program: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled" | "refunded";
  dueDate: string;
  paidDate?: string;
  items: { description: string; amount: number; quantity: number }[];
  createdAt: string;
}

export default function PartnerInvoicesPage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const statuses = ["all", "draft", "sent", "paid", "partial", "overdue", "cancelled", "refunded"];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const params = new URLSearchParams({
          search,
          status: statusFilter,
          page: currentPage.toString(),
          limit: itemsPerPage.toString()
        });

        const res = await fetch(`/api/partner/finance/invoices?${params}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setInvoices([]);
          setTotalPages(1);
          return;
        }

        const data = await res.json();
        setInvoices(Array.isArray(data.invoices) ? data.invoices : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Invoices Load Error:", error);
        setInvoices([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchInvoices();
    } else {
      setLoading(false);
    }
  }, [session, search, statusFilter, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft": return "bg-gray-100 text-gray-700";
      case "sent": return "bg-blue-100 text-blue-700";
      case "paid": return "bg-green-100 text-green-700";
      case "partial": return "bg-yellow-100 text-yellow-700";
      case "overdue": return "bg-red-100 text-red-700";
      case "cancelled": return "bg-slate-100 text-slate-700";
      case "refunded": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return <CheckCircle className="h-3 w-3 mr-1" />;
      case "overdue": return <AlertCircle className="h-3 w-3 mr-1" />;
      case "partial": return <Clock className="h-3 w-3 mr-1" />;
      case "sent": return <Mail className="h-3 w-3 mr-1" />;
      default: return <FileText className="h-3 w-3 mr-1" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);
  const paidAmount = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const overdueCount = invoices.filter(i => i.status === "overdue").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Invoices
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track all invoices</p>
        </div>
        <div className="flex gap-2">
          <Link href="/partner/finance/invoices/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Invoice
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{invoices.length}</p>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg"><DollarSign className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Amount</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg"><CheckCircle className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">${paidAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-2xl font-bold">{overdueCount}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by invoice #, student, university..."
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
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Invoices ({invoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <FileText className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No invoices found</p>
              <p className="text-sm">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Invoices will appear here as they are created."}
              </p>
              {(search || statusFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all"); }} className="mt-4">
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
                      <TableHead className="w-40">Invoice #</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden md:table-cell">University & Program</TableHead>
                      <TableHead className="w-36">Amount</TableHead>
                      <TableHead className="w-36">Due Date</TableHead>
                      <TableHead className="w-36">Status</TableHead>
                      <TableHead className="w-50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">
                          <Link href={`/partner/finance/invoices/${invoice._id}`} className="text-primary hover:underline">
                            {invoice.invoiceNumber}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.studentName}</p>
                            <p className="text-xs text-muted-foreground">{invoice.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1 text-sm">
                            <span>{invoice.university}</span>
                            <span className="text-muted-foreground">{invoice.program}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {invoice.currency} {invoice.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {invoice.dueDate ? format(new Date(invoice.dueDate), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(invoice.status)}>
                            {getStatusIcon(invoice.status)}
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/partner/finance/invoices/${invoice._id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Send Email">
                              <Mail className="h-4 w-4" />
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
}