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
  AlertTriangle, RefreshCcw, Trash2, Loader2, User, Search 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FraudItem {
  _id: string;
  studentName: string;
  studentEmail: string;
  universityName: string;
  programName: string;
  status: string;
  rejectionReason?: string; 
  flaggedDate: string;
}

export default function FraudFlagsPage() {
  const [flags, setFlags] = useState<FraudItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  
  const fetchFlags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/documents/fraud");
      const data = await res.json();

      if (data.success) {
        setFlags(data.data);
      } else {
        toast.error("Failed to load fraud flags");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlags();
  }, []);

  const handleRestore = async (id: string) => {
    if (!window.confirm("Are you sure you want to restore this application to 'Docs Pending'?")) return;
    
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Docs Pending" }),
      });

      if (res.ok) {
        toast.success("Application Restored! 🔄");
        setFlags((prev) => prev.filter((item) => item._id !== id));
      } else {
        toast.error("Failed to restore");
      }
    } catch (error) {
      toast.error("Server error");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredFlags = flags.filter(item => 
    item.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.studentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600 flex items-center gap-2">
            <AlertTriangle className="h-8 w-8" /> Fraud & Rejected Flags
          </h1>
          <p className="text-muted-foreground">Manage applications marked as rejected or suspicious.</p>
        </div>
      </div>

      <Card className="border-red-100 bg-red-50/20">
        <CardHeader className="pb-3">
            <CardTitle className="text-red-700">Flagged Repository</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search flagged students..." 
                    className="pl-9 max-w-md bg-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </CardContent>
      </Card>

      <div className="rounded-md border bg-card">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>University</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Flagged Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" /> Loading flags...
                            </div>
                        </TableCell>
                    </TableRow>
                ) : filteredFlags.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            <div className="flex flex-col items-center gap-2">
                                <AlertTriangle className="h-8 w-8 text-muted-foreground/30" />
                                <p>No fraud flags found. Good job!</p>
                            </div>
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredFlags.map((item) => (
                        <TableRow key={item._id} className="hover:bg-red-50/50">
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                        <User className="h-4 w-4 text-red-600" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{item.studentName}</div>
                                        <div className="text-xs text-muted-foreground">{item.studentEmail}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{item.universityName}</div>
                                <div className="text-xs text-muted-foreground">{item.programName}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                                    {item.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(item.flaggedDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                                    onClick={() => handleRestore(item._id)}
                                    disabled={!!processingId}
                                >
                                    {processingId === item._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-1" />}
                                    Restore
                                </Button>
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