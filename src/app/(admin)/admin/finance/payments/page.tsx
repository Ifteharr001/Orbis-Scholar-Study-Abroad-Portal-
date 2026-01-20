"use client";

import { useState, useEffect } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Search, 
  Download, 
  CreditCard, 
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";
import { toast } from "sonner";

interface Payment {
  _id: string;
  transactionId: string;
  invoiceId: string;
  studentName: string;
  amount: number;
  currency: string;
  method: string;
  status: "Completed" | "Refunded" | "Failed";
  date: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");

  // Fetch Data
  const fetchPayments = async () => {
    try {
      const res = await fetch("/api/admin/finance/payments");
      const result = await res.json();
      if (result.success) {
        setPayments(result.data);
        setFilteredPayments(result.data);
      }
    } catch (error) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // Filter Logic
  useEffect(() => {
    let data = payments;

    // Search Filter
    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(p => 
        p.studentName.toLowerCase().includes(lowerSearch) ||
        p.transactionId.toLowerCase().includes(lowerSearch)
      );
    }

    if (methodFilter !== "All") {
      data = data.filter(p => p.method === methodFilter);
    }

    setFilteredPayments(data);
  }, [search, methodFilter, payments]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "Refunded": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Failed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalCollected = payments
    .filter(p => p.status === "Completed")
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const totalRefunded = payments
    .filter(p => p.status === "Refunded")
    .reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments History</h1>
          <p className="text-muted-foreground">Real-time transaction logs and receipts.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successful transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunded</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalRefunded.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Reversed transactions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">Total records found</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Transaction ID or Student Name..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={methodFilter} onValueChange={setMethodFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Methods</SelectItem>
            <SelectItem value="Credit Card">Credit Card</SelectItem>
            <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
            <SelectItem value="PayPal">PayPal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((pay) => (
                <TableRow key={pay._id}>
                  <TableCell className="font-mono text-xs">{pay.transactionId}</TableCell>
                  <TableCell className="font-medium">{pay.studentName}</TableCell>
                  <TableCell>{new Date(pay.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-3 w-3 text-muted-foreground" />
                        {pay.method}
                    </div>
                  </TableCell>
                  <TableCell className="font-bold">
                    {pay.currency} {pay.amount}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(pay.status)} variant="outline">
                      {pay.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">View Receipt</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}