"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DollarSign,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Landmark,
  GraduationCap,
  User,
  FileText,
  CreditCard,
  Banknote,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Send
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Invoice {
  _id: string;
  invoiceNumber: string;
  studentName: string;
  studentId: string;
  university: string;
  program: string;
  amount: number;
  currency: string;
  status: "draft" | "sent" | "paid" | "partial" | "overdue" | "cancelled" | "refunded";
  dueDate: string;
  paidDate?: string;
  createdAt: string;
}

export default function PartnerFinancePage() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const statuses = ["all", "draft", "sent", "paid", "partial", "overdue", "cancelled", "refunded"];

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const params = new URLSearchParams({
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
  }, [session, statusFilter, currentPage]);

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
      case "sent": return <Send className="h-3 w-3 mr-1" />;
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

  // Calculate stats
  const totalInvoiced = invoices.reduce((sum, i) => sum + i.amount, 0);
  const totalPaid = invoices.filter(i => i.status === "paid").reduce((sum, i) => sum + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === "sent" || i.status === "partial").reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0);
  const overdueCount = invoices.filter(i => i.status === "overdue").length;
  const paidCount = invoices.filter(i => i.status === "paid").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <DollarSign className="h-7 w-7 text-primary" />
            Finance
          </h1>
          <p className="text-muted-foreground mt-1">Manage invoices, payments, and financial records</p>
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
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg"><DollarSign className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">${totalInvoiced.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Invoiced</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg"><Banknote className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalPaid.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Collected</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-red-100 rounded-lg"><AlertCircle className="h-5 w-5 text-red-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalOverdue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Overdue</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg"><TrendingUp className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{invoices.length > 0 ? ((totalPaid / totalInvoiced) * 100).toFixed(1) : 0}%</p>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/partner/finance/invoices" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Invoices</p>
                <p className="text-sm text-muted-foreground">Manage all invoices</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/partner/finance/payments" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-green/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Payments</p>
                <p className="text-sm text-muted-foreground">Track received payments</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/partner/finance/fees" className="block">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-blue/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Banknote className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Fee Structure</p>
                <p className="text-sm text-muted-foreground">Manage fee schedules</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Invoices */}
      <Card>
        <CardHeader className="pb-2 flex flex-row justify-between items-center">
          <CardTitle>Recent Invoices ({invoices.length})</CardTitle>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
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
        </CardHeader>
        <CardContent className="pt-0">
          {invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <FileText className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No invoices found</p>
              <p className="text-sm">
                {statusFilter !== "all"
                  ? "Try adjusting your filter criteria."
                  : "Invoices will appear here as they are created."}
              </p>
              {statusFilter !== "all" && (
                <Button variant="outline" onClick={() => setStatusFilter("all")} className="mt-4">
                  Clear Filter
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
                        <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.studentName}</p>
                            <p className="text-xs text-muted-foreground">{invoice.studentId}</p>
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
