// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, CreditCard, CheckCircle, Clock, FileText, Lock } from "lucide-react";
// import { toast } from "sonner";
// import { useSearchParams } from "next/navigation";

// // ইন্টারফেস (API থেকে যে ডাটা আসবে)
// interface Payment {
//   _id: string;
//   invoiceId: string;
//   serviceName: string;
//   amount: number;
//   createdAt: string; // Date String from DB
//   status: "Paid" | "Pending" | "Failed";
// }

// interface PaymentStats {
//   totalPaid: number;
//   totalPending: number;
//   totalInvoices: number;
// }

// export default function PaymentPage() {
//   const [payments, setPayments] = useState<Payment[]>([]);
//   const [stats, setStats] = useState<PaymentStats>({ totalPaid: 0, totalPending: 0, totalInvoices: 0 });
//   const [loading, setLoading] = useState(true);
//   const [processingId, setProcessingId] = useState<string | null>(null);
  
//   // URL থেকে পেমেন্ট স্ট্যাটাস চেক করার জন্য (Success/Cancel মেসেজ দেখানোর জন্য)
//   const searchParams = useSearchParams();

//   // ১. ডাটাবেস থেকে পেমেন্ট ডাটা আনা
//   useEffect(() => {
//     const fetchPaymentData = async () => {
//       try {
//         const res = await fetch("/api/student/payment-stats");
        
//         if (!res.ok) {
//           throw new Error("Failed to fetch payment data");
//         }

//         const data = await res.json();
//         setPayments(data.history || []); 
//         setStats(data.stats || { totalPaid: 0, totalPending: 0, totalInvoices: 0 });

//       } catch (error) {
//         console.error("Payment Fetch Error:", error);
//         toast.error("Could not load payment information");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaymentData();

//     // পেমেন্ট সাকসেস বা ক্যানসেল হলে মেসেজ দেখানো
//     if (searchParams.get("success")) {
//       toast.success("Payment successful! Invoice updated.");
//     } else if (searchParams.get("canceled")) {
//       toast.error("Payment canceled.");
//     }
//   }, [searchParams]);

//   // ২. Stripe পেমেন্ট হ্যান্ডলার (Real Integration) 💳
//   const handleStripePayment = async (invoiceId: string) => {
//     setProcessingId(invoiceId); // বাটনে লোডিং শুরু
    
//     try {
//       // আমাদের তৈরি করা API কল করা
//       const res = await fetch("/api/payment/checkout", { 
//         method: "POST", 
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ invoiceId }) // ইনভয়েস আইডি পাঠানো হচ্ছে
//       });
      
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Payment initiation failed");
//       }

//       // পেমেন্ট লিংক পেলে সেখানে রিডাইরেক্ট করা
//       if (data.url) {
//         window.location.href = data.url;
//       } else {
//         toast.error("Invalid payment link received");
//       }
      
//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message || "Failed to start payment");
//     } finally {
//       // এখানে লোডিং বন্ধ করছি না কারণ পেজ রিডাইরেক্ট হয়ে যাবে
//       // তবে এরর হলে লোডিং বন্ধ হবে
//       // setProcessingId(null); 
//     }
//   };

//   // ৩. ফিল্টারিং (Pending এবং Paid আলাদা করা)
//   const pendingInvoices = payments.filter((p) => p.status === "Pending");
//   const paidInvoices = payments.filter((p) => p.status === "Paid");

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
//         <Loader2 className="h-10 w-10 animate-spin text-primary" />
//         <p className="text-muted-foreground">Loading your financial data...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto py-8 space-y-8 max-w-5xl">
      
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments & Billing 💳</h1>
//           <p className="text-muted-foreground mt-1">Manage your invoices and make secure payments via Stripe.</p>
//         </div>
        
//         <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 text-sm font-medium">
//           <Lock className="h-4 w-4" />
//           Secured by Stripe
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-green-600">
//               ${stats.totalPaid.toFixed(2)}
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className={`text-2xl font-bold ${stats.totalPending > 0 ? "text-yellow-600" : "text-muted-foreground"}`}>
//               ${stats.totalPending.toFixed(2)}
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card>
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoices</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-foreground">
//               {stats.totalInvoices}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Pending Payments Section */}
//       <div className="space-y-4">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           <Clock className="h-5 w-5 text-yellow-600" /> Pending Invoices
//         </h2>
        
//         {pendingInvoices.length === 0 ? (
//           <Card className="bg-muted/30 border-dashed">
//             <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
//               <CheckCircle className="h-10 w-10 mb-2 text-green-500" />
//               <p>You have no pending payments. Great job!</p>
//             </CardContent>
//           </Card>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {pendingInvoices.map((inv) => (
//               <Card key={inv._id} className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-all">
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <CardTitle className="text-lg">{inv.serviceName}</CardTitle>
//                       <CardDescription className="mt-1">Invoice ID: {inv.invoiceId}</CardDescription>
//                     </div>
//                     <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
//                       Unpaid
//                     </Badge>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex justify-between items-center text-sm mb-2">
//                     <span className="text-muted-foreground">Created Date:</span>
//                     <span className="font-medium">{new Date(inv.createdAt).toLocaleDateString()}</span>
//                   </div>
//                   <div className="flex justify-between items-center text-lg font-bold">
//                     <span>Amount:</span>
//                     <span>${inv.amount.toFixed(2)}</span>
//                   </div>
//                 </CardContent>
//                 <CardFooter>
//                   <Button 
//                     className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-medium" 
//                     // ⚠️ গুরত্বপূর্ণ পরিবর্তন: আমরা এখানে inv.invoiceId পাঠাচ্ছি (DB _id নয়)
//                     // কারণ ব্যাকএন্ডে আমরা invoiceId দিয়ে খুঁজছি
//                     onClick={() => handleStripePayment(inv.invoiceId)}
//                     disabled={processingId === inv.invoiceId}
//                   >
//                     {processingId === inv.invoiceId ? (
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     ) : (
//                       <CreditCard className="mr-2 h-4 w-4" />
//                     )}
//                     Pay with Stripe
//                   </Button>
//                 </CardFooter>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Payment History Section */}
//       <div className="space-y-4 pt-4">
//         <h2 className="text-xl font-semibold flex items-center gap-2">
//           <FileText className="h-5 w-5 text-muted-foreground" /> Payment History
//         </h2>
        
//         {paidInvoices.length === 0 ? (
//            <div className="text-center py-8 text-muted-foreground border rounded-md bg-muted/10">
//               No payment history found.
//            </div>
//         ) : (
//           <Card>
//             <CardContent className="p-0">
//               <div className="relative w-full overflow-auto">
//                 <table className="w-full caption-bottom text-sm text-left">
//                   <thead className="[&_tr]:border-b bg-muted/50">
//                     <tr className="border-b transition-colors hover:bg-muted/50">
//                       <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Invoice ID</th>
//                       <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Service</th>
//                       <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
//                       <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
//                       <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
//                       <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Receipt</th>
//                     </tr>
//                   </thead>
//                   <tbody className="[&_tr:last-child]:border-0">
//                     {paidInvoices.map((inv) => (
//                       <tr key={inv._id} className="border-b transition-colors hover:bg-muted/50">
//                         <td className="p-4 font-medium">{inv.invoiceId}</td>
//                         <td className="p-4">{inv.serviceName}</td>
//                         <td className="p-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
//                         <td className="p-4 font-semibold text-green-600">${inv.amount.toFixed(2)}</td>
//                         <td className="p-4">
//                           <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
//                             Paid
//                           </Badge>
//                         </td>
//                         <td className="p-4 text-right">
//                           <Button variant="ghost" size="sm" className="h-8 text-primary">Download</Button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, CheckCircle, Clock, FileText, Lock } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface Payment {
  _id: string;
  invoiceId: string;
  serviceName: string;
  amount: number;
  createdAt: string;
  status: "Paid" | "Pending" | "Failed";
}

interface PaymentStats {
  totalPaid: number;
  totalPending: number;
  totalInvoices: number;
}

export default function PaymentPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({ totalPaid: 0, totalPending: 0, totalInvoices: 0 });
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const res = await fetch("/api/student/payment-stats");
        
        const demoData: Payment[] = [
          {
            _id: "demo_id_1",
            invoiceId: "INV-DEMO-101",
            serviceName: "Application Fee - Oxford University (Demo)",
            amount: 50,
            createdAt: new Date().toISOString(),
            status: "Pending",
          },
          {
            _id: "demo_id_2",
            invoiceId: "INV-DEMO-005",
            serviceName: "Document Translation Service",
            amount: 25,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), 
            status: "Paid",
          }
        ];

        let finalPayments = demoData;
        let finalStats = { totalPaid: 25, totalPending: 50, totalInvoices: 2 };

        if (res.ok) {
          const data = await res.json();
          if (data.history && data.history.length > 0) {
            finalPayments = data.history;
            finalStats = data.stats;
          }
        }

        setPayments(finalPayments);
        setStats(finalStats);

      } catch (error) {
        console.error("Using demo data due to error:", error);
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

  const handleStripePayment = async (invoiceId: string) => {
    if (invoiceId.includes("DEMO")) {
      toast.warning("Payment successful! Invoice updated. (Demo Mode)");
      return;
    }

    setProcessingId(invoiceId);
    
    try {
      const res = await fetch("/api/payment/checkout", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId })
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
      // setProcessingId(null);
    }
  };

  const pendingInvoices = payments.filter((p) => p.status === "Pending");
  const paidInvoices = payments.filter((p) => p.status === "Paid");

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
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments & Billing 💳</h1>
          <p className="text-muted-foreground mt-1">Manage your invoices and make secure payments via Stripe.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 text-sm font-medium">
          <Lock className="h-4 w-4" />
          Secured by Stripe
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${stats.totalPaid.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.totalPending > 0 ? "text-yellow-600" : "text-muted-foreground"}`}>
              ${stats.totalPending.toFixed(2)}
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

      {/* Pending Payments Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-yellow-600" /> Pending Invoices
        </h2>
        
        {pendingInvoices.length === 0 ? (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mb-2 text-green-500" />
              <p>You have no pending payments. Great job!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingInvoices.map((inv) => (
              <Card key={inv._id} className="border-l-4 border-l-yellow-500 shadow-sm hover:shadow-md transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inv.serviceName}</CardTitle>
                      <CardDescription className="mt-1">Invoice ID: {inv.invoiceId}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Unpaid
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-muted-foreground">Created Date:</span>
                    <span className="font-medium">{new Date(inv.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Amount:</span>
                    <span>${inv.amount.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-[#635BFF] hover:bg-[#5851df] text-white font-medium" 
                    onClick={() => handleStripePayment(inv.invoiceId)}
                    disabled={processingId === inv.invoiceId}
                  >
                    {processingId === inv.invoiceId ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay with Stripe
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Payment History Section */}
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
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Service</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                      <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {paidInvoices.map((inv) => (
                      <tr key={inv._id} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 font-medium">{inv.invoiceId}</td>
                        <td className="p-4">{inv.serviceName}</td>
                        <td className="p-4">{new Date(inv.createdAt).toLocaleDateString()}</td>
                        <td className="p-4 font-semibold text-green-600">${inv.amount.toFixed(2)}</td>
                        <td className="p-4">
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            Paid
                          </Badge>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-primary">Download</Button>
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