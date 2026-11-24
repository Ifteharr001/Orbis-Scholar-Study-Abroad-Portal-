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
  CreditCard,
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
  Banknote,
  Receipt,
  Plus,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Banknote as BanknoteIcon
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Payment {
  _id: string;
  paymentId: string;
  invoiceNumber: string;
  invoiceId: string;
  studentName: string;
  studentId: string;
  studentEmail: string;
  university: string;
  program: string;
  amount: number;
  currency: string;
  method: "bank_transfer" | "credit_card" | "paypal" | "stripe" | "cash" | "other";
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  transactionId?: string;
  paidAt: string;
  createdAt: string;
}

export default function PartnerPaymentsPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const statuses = ["all", "pending", "completed", "failed", "refunded", "cancelled"];
  const methods = ["all", "bank_transfer", "credit_card", "paypal", "stripe", "cash", "other"];

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const params = new URLSearchParams({
          search,
          status: statusFilter,
          method: methodFilter,
          page: currentPage.toString(),
          limit: itemsPerPage.toString()
        });

        const res = await fetch(`/api/partner/finance/payments?${params}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setPayments([]);
          setTotalPages(1);
          return;
        }

        const data = await res.json();
        setPayments(Array.isArray(data.payments) ? data.payments : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Payments Load Error:", error);
        setPayments([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPayments();
    } else {
      setLoading(false);
    }
  }, [session, search, statusFilter, methodFilter, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "completed": return "bg-green-100 text-green-700";
      case "failed": return "bg-red-100 text-red-700";
      case "refunded": return "bg-purple-100 text-purple-700";
      case "cancelled": return "bg-slate-100 text-slate-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed": return <CheckCircle className="h-3 w-3 mr-1" />;
      case "failed": return <XCircle className="h-3 w-3 mr-1" />;
      case "pending": return <Clock className="h-3 w-3 mr-1" />;
      case "refunded": return <BanknoteIcon className="h-3 w-3 mr-1" />;
      default: return <Receipt className="h-3 w-3 mr-1" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case "bank_transfer": return "Bank Transfer";
      case "credit_card": return "Credit Card";
      case "paypal": return "PayPal";
      case "stripe": return "Stripe";
      case "cash": return "Cash";
      default: return method;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const totalReceived = payments.filter(p => p.status === "completed").reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === "pending").reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter(p => p.status === "completed").length;
  const failedCount = payments.filter(p => p.status === "failed").length;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <CreditCard className="h-7 w-7 text-primary" />
            Payments
          </h1>
          <p className="text-muted-foreground mt-1">Track and manage received payments</p>
        </div>
        <div className="flex gap-2">
          <Link href="/partner/finance/payments/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg"><CreditCard className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{payments.length}</p>
              <p className="text-sm text-muted-foreground">Total Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg"><Banknote className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalReceived.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Received</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg"><Clock className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-2xl font-bold">${pendingAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg"><CheckCircle className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
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
                placeholder="Search by payment ID, student, invoice..."
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
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method === "all" ? "All Methods" : getMethodLabel(method)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Payments ({payments.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <CreditCard className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No payments found</p>
              <p className="text-sm">
                {search || statusFilter !== "all" || methodFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Payments will appear here as they are recorded."}
              </p>
              {(search || statusFilter !== "all" || methodFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearch(""); setStatusFilter("all"); setMethodFilter("all"); }} className="mt-4">
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
                      <TableHead className="w-40">Payment ID</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="hidden md:table-cell">University & Program</TableHead>
                      <TableHead className="w-36">Amount</TableHead>
                      <TableHead className="w-36">Method</TableHead>
                      <TableHead className="w-36">Status</TableHead>
                      <TableHead className="w-40">Date</TableHead>
                      <TableHead className="w-50 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">
                          <Link href={`/partner/finance/payments/${payment._id}`} className="text-primary hover:underline">
                            {payment.paymentId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link href={`/partner/finance/invoices/${payment.invoiceId}`} className="text-primary hover:underline font-mono text-sm">
                            {payment.invoiceNumber}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{payment.studentName}</p>
                            <p className="text-xs text-muted-foreground">{payment.studentEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="space-y-1 text-sm">
                            <span>{payment.university}</span>
                            <span className="text-muted-foreground">{payment.program}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {payment.currency} {payment.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="secondary">{getMethodLabel(payment.method)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(payment.status)}>
                            {getStatusIcon(payment.status)}
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {payment.paidAt ? format(new Date(payment.paidAt), "MMM d, yyyy") : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/partner/finance/payments/${payment._id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8" title="Download Receipt">
                              <Download className="h-4 w-4" />
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