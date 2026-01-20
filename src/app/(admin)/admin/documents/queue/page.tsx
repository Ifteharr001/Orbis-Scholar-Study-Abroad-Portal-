"use client";

import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, XCircle, Loader2, User, RefreshCw
} from "lucide-react";
import { toast } from "sonner";

interface QueueItem {
  _id: string;
  studentName: string;
  studentEmail: string;
  universityName: string;
  programName: string;
  status: string;
  appliedDate: string;
}

export default function VerificationQueuePage() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/documents/queue"); 
      const data = await res.json();

      if (data.success) {
        setQueue(data.data);
      } else {
        console.error("API Error:", data); 
        toast.error("Failed to load data");
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Something went wrong connecting to server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setProcessingId(id);
    
    const newStatus = action === "approve" ? "Docs Verified" : "Rejected"; 

    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(action === "approve" ? "Status Updated to Verified " : "Application Rejected ");
        setQueue((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error("Action failed");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Docs Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Inquiry": return "bg-slate-100 text-slate-800 border-slate-200";
      case "In Review": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 p-6">
      
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Verification Queue</h1>
            <p className="text-muted-foreground">Applications waiting for review or documents.</p>
        </div>
        <Button variant="outline" onClick={fetchQueue}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queue.length}</div>
            <p className="text-xs text-muted-foreground">Docs Pending, Inquiry & In Review</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>University / Program</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" /> Loading...
                            </div>
                        </TableCell>
                    </TableRow>
                ) : queue.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            No applications pending review.
                        </TableCell>
                    </TableRow>
                ) : (
                    queue.map((item) => (
                        <TableRow key={item._id} className="hover:bg-muted/50">
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{item.studentName}</div>
                                        <div className="text-xs text-muted-foreground">{item.studentEmail}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{item.universityName}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{item.programName}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className={getStatusColor(item.status)}>
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(item.appliedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleAction(item._id, "reject")}
                                        disabled={!!processingId}
                                    >
                                        <XCircle className="h-4 w-4 mr-1" /> Reject
                                    </Button>
                                    
                                    <Button 
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleAction(item._id, "approve")}
                                        disabled={!!processingId}
                                    >
                                        {processingId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-1" />}
                                        Verify Docs
                                    </Button>
                                </div>
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