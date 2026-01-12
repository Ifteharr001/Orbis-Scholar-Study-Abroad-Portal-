"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Download, FileSpreadsheet, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Updated import

const importHistory = [
  {
    id: "IMP001",
    fileName: "students_batch_jan2024.xlsx",
    uploadedBy: "Sarah Khan",
    uploadedAt: "2024-01-28 14:30",
    totalRecords: 150,
    successful: 145,
    failed: 5,
    status: "Completed",
  },
  {
    id: "IMP002",
    fileName: "new_leads_q1.csv",
    uploadedBy: "John Doe",
    uploadedAt: "2024-01-25 10:15",
    totalRecords: 80,
    successful: 80,
    failed: 0,
    status: "Completed",
  },
  {
    id: "IMP003",
    fileName: "partner_referrals.xlsx",
    uploadedBy: "Emily Chen",
    uploadedAt: "2024-01-20 16:45",
    totalRecords: 45,
    successful: 0,
    failed: 0,
    status: "Processing",
  },
  {
    id: "IMP004",
    fileName: "bulk_update.csv",
    uploadedBy: "Sarah Khan",
    uploadedAt: "2024-01-15 09:00",
    totalRecords: 200,
    successful: 0,
    failed: 200,
    status: "Failed",
  },
];

const StudentImportsPage = () => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      toast.success("Import Started", {
        description: `Processing ${selectedFile.name}...`,
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "Processing":
        return <Clock className="h-4 w-4 text-yellow-600 animate-spin" />;
      case "Failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      case "Processing":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "Failed":
        return "bg-red-100 text-red-800 hover:bg-red-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Import Students</h1>
          <p className="text-muted-foreground">Bulk import students from CSV or Excel files</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                New Import
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Import Students</DialogTitle>
                <DialogDescription>
                  Upload a CSV or Excel file to bulk import students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileSpreadsheet className="h-12 w-12 text-green-600" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFile(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Drag and drop your file here, or
                      </p>
                      <label htmlFor="file-upload">
                        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-3 cursor-pointer">
                          Browse Files
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: CSV, XLSX, XLS
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpload} disabled={!selectedFile}>
                    Start Import
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">225</p>
                <p className="text-sm text-muted-foreground">Successful Imports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">205</p>
                <p className="text-sm text-muted-foreground">Failed Records</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-yellow-100 p-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">1</p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>View past import jobs and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Success</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importHistory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{item.fileName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.uploadedBy}</TableCell>
                  <TableCell>{item.uploadedAt}</TableCell>
                  <TableCell>{item.totalRecords}</TableCell>
                  <TableCell className="text-green-600">{item.successful}</TableCell>
                  <TableCell className="text-red-600">{item.failed}</TableCell>
                  <TableCell>
                    <Badge className={`gap-1 ${getStatusColor(item.status)}`} variant="secondary">
                      {getStatusIcon(item.status)}
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentImportsPage;