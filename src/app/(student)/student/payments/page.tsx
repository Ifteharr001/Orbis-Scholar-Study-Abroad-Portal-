"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, CheckCircle, Clock, FileText, Lock, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface Invoice {
  _id: string;
  invoiceId: string;
  programName?: string;
  type: string;
  amount: number;
  currency: string;
  createdAt: string;
  status: "Paid" | "Pending" | "Failed" | "Refunded";
}

interface PaymentStats {
  totalPaid: number;
  totalPending: number;
  totalInvoices: number;
}

function PaymentPageContent() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<PaymentStats>({ totalPaid: 0, totalPending: 0, totalInvoices: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const res = await fetch("/api/student/payment-stats", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.history || []);
          setStats(data.stats || { totalPaid: 0, totalPending: 0, totalInvoices: 0 });
        } else {
          toast.error("Failed to load payment info");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Could not fetch payment data");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentData();

    if (searchParams.get("success")) {
      toast.success("Payment successful! Invoice updated.");
    } else if (searchParams.get("canceled")) {
      toast.error("Payment canceled.");
    }
  }, [searchParams]);

  const handleStripePayment = async (mongoId: string) => {
    setProcessingId(mongoId);

    try {
      const res = await fetch("/api/student/payment/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ invoiceId: mongoId })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment initiation failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Invalid payment link received");
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to start payment");
    } finally {
      setTimeout(() => setProcessingId(null), 2000);
    }
  };

  const pendingInvoices = invoices.filter((inv) => inv.status === "Pending");
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your financial data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-5xl">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments & Billing 💳</h1>
          <p className="text-muted-foreground mt-1">Manage your program fees and invoices securely.</p>
        </div>

        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 text-sm font-medium">
          <Lock className="h-4 w-4" />
          Secured by Stripe
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalPaid.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalPending > 0 ? "text-yellow-600" : "text-muted-foreground"}`}>
              ${stats.totalPending.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {stats.totalInvoices}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" /> Due Invoices
        </h2>

        {pendingInvoices.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-2 text-green-500" />
              <p>You have no pending payments. All fees are cleared!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingInvoices.map((inv) => (
              <Card key={inv._id} className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-primary" />
                        {inv.programName || "University Program"}
                      </CardTitle>
                      <CardDescription className="mt-1 font-medium text-foreground/80">
                        {inv.type}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground mt-1">Invoice: {inv.invoiceId}</p>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200 shrink-0">
                      Unpaid
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm mb-2 pt-2 border-t">
                    <span className="text-muted-foreground">Due Date:</span>

                    <span className="font-medium">{new Date(inv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Due:</span>
                    <span>{inv.currency} {inv.amount.toLocaleString()}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-medium shadow-md"
                    onClick={() => handleStripePayment(inv._id)}
                    disabled={processingId === inv._id}
                  >
                    {processingId === inv._id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" /> Payment History
        </h2>

        {paidInvoices.length === 0 ? (
           <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
              No payment history found.
           </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                  <thead className="[&_tr]:border-b bg-muted/50">
                    <tr className="border-b transition-colors hover:bg-muted/50">
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Invoice ID</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Program / Service</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Paid On</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {paidInvoices.map((inv) => (
                      <tr key={inv._id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{inv.invoiceId}</td>
                        <td className="p-4">
                            <div className="font-medium">{inv.programName}</div>
                            <div className="text-xs text-muted-foreground">{inv.type}</div>
                        </td>
                        <td className="p-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-semibold text-green-600">{inv.currency} {inv.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Paid
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-primary hover:underline">Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}