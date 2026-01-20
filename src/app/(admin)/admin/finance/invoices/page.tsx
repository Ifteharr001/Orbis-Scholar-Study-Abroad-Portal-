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
  DollarSign, 
  CheckCircle, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

interface Invoice {
  _id: string;
  invoiceId: string;
  studentName: string;
  studentEmail: string;
  programName?: string;
  amount: number;
  currency: string;
  type: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
  createdAt: string;
  paymentMethod?: string;
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Fetch Data
  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/admin/finance/invoices");
      const result = await res.json();
      if (result.success) {
        setInvoices(result.data);
        setFilteredInvoices(result.data);
      }
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    let data = invoices;

    if (search) {
      const lowerSearch = search.toLowerCase();
      data = data.filter(inv => 
        inv.studentName.toLowerCase().includes(lowerSearch) ||
        inv.invoiceId.toLowerCase().includes(lowerSearch) ||
        inv.studentEmail.toLowerCase().includes(lowerSearch)
      );
    }

    if (statusFilter !== "All") {
      data = data.filter(inv => inv.status === statusFilter);
    }

    setFilteredInvoices(data);
  }, [search, statusFilter, invoices]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/finance/invoices", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Invoice marked as ${newStatus}`);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setInvoices(prev => prev.map(inv => inv._id === id ? { ...inv, status: newStatus as any } : inv));
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid": return "bg-green-100 text-green-800 hover:bg-green-100 border-green-200";
      case "Pending": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200";
      case "Failed": return "bg-red-100 text-red-800 hover:bg-red-100 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const totalRevenue = invoices.filter(i => i.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = invoices.filter(i => i.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">Manage student payments and fees.</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Collected from paid invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">${pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting clearance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invoices.length}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Invoice ID, Name or Email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No invoices found.
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell className="font-medium">{inv.invoiceId}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{inv.studentName}</span>
                      <span className="text-xs text-muted-foreground">{inv.studentEmail}</span>
                    </div>
                  </TableCell>
                  <TableCell>{inv.type}</TableCell>
                  <TableCell className="font-bold">
                    {inv.currency} {inv.amount}
                  </TableCell>
                  <TableCell>{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(inv.status)} variant="outline">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {inv.status === "Pending" && (
                        <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleStatusUpdate(inv._id, "Paid")}
                        >
                            Mark Paid
                        </Button>
                    )}
                    {inv.status === "Paid" && (
                        <Button size="sm" variant="ghost" disabled>
                            Completed
                        </Button>
                    )}
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