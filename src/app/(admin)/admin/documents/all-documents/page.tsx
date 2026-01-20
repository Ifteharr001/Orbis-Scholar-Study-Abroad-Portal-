"use client";

import { useState, useEffect } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Search, FileText, Download, Loader2, ExternalLink, RefreshCw 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface DocumentItem {
  _id: string; 
  studentName: string;
  studentEmail: string;
  universityName: string;
  programName: string;
  docType: string; 
  url: string;
  uploadDate: string;
}

export default function AllDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/documents");
      const data = await res.json();

      if (data.success) {
        setDocuments(data.data);
      } else {
        toast.error("Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDownload = (url: string, fileNamePrefix: string) => {
    if (!url) return;

    if (url.startsWith("data:")) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${fileNamePrefix.replace(/\s+/g, "_")}_Document.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else {
        window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const filteredDocs = documents.filter(doc => 
    doc.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.universityName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Documents</h1>
          <p className="text-muted-foreground">Manage and track all student uploads.</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDocuments}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
            <CardTitle>Document Repository</CardTitle>
            <CardDescription>
                Showing {filteredDocs.length} files found.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search by student or university..." 
                    className="pl-9 max-w-md"
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
                    <TableHead>University / Program</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            <div className="flex justify-center items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" /> Loading documents...
                            </div>
                        </TableCell>
                    </TableRow>
                ) : filteredDocs.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                            No documents found.
                        </TableCell>
                    </TableRow>
                ) : (
                    filteredDocs.map((doc) => (
                        <TableRow key={doc._id} className="hover:bg-muted/50">
                            <TableCell>
                                <div className="font-medium">{doc.studentName}</div>
                                <div className="text-xs text-muted-foreground">{doc.studentEmail}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{doc.universityName}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[200px]">{doc.programName}</div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="gap-1 bg-blue-50 text-blue-700 border-blue-200">
                                    <FileText className="h-3 w-3" />
                                    {doc.docType}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground text-sm">
                                {new Date(doc.uploadDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => handleDownload(doc.url, doc.studentName)}
                                    >
                                        <Download className="h-4 w-4 mr-2" /> Download
                                    </Button>
                                    
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/applications/${doc._id}`}>
                                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                        </Link>
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