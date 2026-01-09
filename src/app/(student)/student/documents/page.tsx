"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Eye, X, FileText, Check, Loader2, RefreshCw, AlertCircle, Badge } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Data Type Interface
interface Document {
  _id?: string;
  name: string;
  status: "Pending" | "Verified" | "Rejected" | "Not Uploaded";
  feedback?: string;
  fileName?: string;
  category: "required" | "rejected" | "optional";
  fileUrl?: string;
  uploadedAt?: string;
}

// Default Required Documents
const REQUIRED_DEFAULTS: Partial<Document>[] = [
  { name: "Academic Transcript", category: "required" },
  { name: "Passport Copy", category: "required" },
];

const documentTypes = [
  "Academic Transcript",
  "Passport Copy",
  "IELTS Certificate",
  "TOEFL Certificate",
  "Letter of Recommendation",
  "Statement of Purpose",
  "CV/Resume",
  "Financial Statement",
  "Other",
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Verified":
      return "text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded";
    case "Pending":
      return "text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded";
    case "Rejected":
      return "text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded";
    case "Not Uploaded":
      return "text-muted-foreground bg-muted px-2 py-0.5 rounded";
    default:
      return "text-muted-foreground";
  }
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Dialog States
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [fixDialogOpen, setFixDialogOpen] = useState(false);

  // Selection States
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocType, setSelectedDocType] = useState<string>("");

  // 1. Fetch Documents
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/student/documents");
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();

      if (Array.isArray(data)) {
        // Merge Logic: API Data + Default Required Docs
        const mergedDocs: Document[] = [...data];

        REQUIRED_DEFAULTS.forEach((defDoc) => {
          const exists = data.find((d) => d.name === defDoc.name);
          if (!exists) {
            mergedDocs.push({
              _id: `temp-${defDoc.name?.replace(/\s+/g, '-').toLowerCase()}`,
              name: defDoc.name!,
              status: "Not Uploaded",
              category: "required",
            });
          }
        });

        // Sort: Required first, then others
        mergedDocs.sort((a, b) => {
            if (a.category === 'required' && b.category !== 'required') return -1;
            if (a.category !== 'required' && b.category === 'required') return 1;
            return 0;
        });

        setDocuments(mergedDocs);
      }
    } catch (error) {
      console.error("Failed to fetch documents", error);
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 2. Common Upload Function
  const processUpload = async (docName: string, category: string = "optional") => {
    if (!selectedFile) {
        toast.error("No file selected");
        return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload to cloud storage (S3/Cloudinary) here
      // and get a URL. We are simulating this by sending metadata to our API.
      // The API (previous step) expects: name, fileName, fileUrl, category
      
      // Simulating a file URL
      const fakeUrl = URL.createObjectURL(selectedFile);

      const res = await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          fileName: selectedFile.name,
          fileUrl: fakeUrl, // Sending the fake URL
          category: category,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Document Uploaded", {
        description: `${docName} has been processed successfully.`,
      });

      await fetchDocuments();

      // Reset all states
      setUploadDialogOpen(false);
      setReplaceDialogOpen(false);
      setFixDialogOpen(false);
      setSelectedFile(null);
      setSelectedDocType("");
      setSelectedDocument(null);

    } catch (error) {
      console.error(error);
      toast.error("Upload Failed", { description: "Something went wrong. Please try again." });
    } finally {
      setIsUploading(false);
    }
  };

  // --- Handlers ---

  const handleUpload = () => {
    if (!selectedFile || !selectedDocType) {
      toast.error("Missing Information", { description: "Please select a document type and file." });
      return;
    }
    const isRequired = REQUIRED_DEFAULTS.some(d => d.name === selectedDocType);
    processUpload(selectedDocType, isRequired ? "required" : "optional");
  };

  const handleReplace = () => {
    if (!selectedFile || !selectedDocument) return;
    processUpload(selectedDocument.name, selectedDocument.category);
  };

  const handleFixReupload = () => {
    if (!selectedFile || !selectedDocument) return;
    processUpload(selectedDocument.name, selectedDocument.category);
  };

  const handleUploadNew = (doc: Document) => {
    setSelectedDocument(doc);
    setSelectedDocType(doc.name);
    setUploadDialogOpen(true);
  };

  const openViewDialog = (doc: Document) => {
    setSelectedDocument(doc);
    setViewDialogOpen(true);
  };

  const openReplaceDialog = (doc: Document) => {
    setSelectedDocument(doc);
    setReplaceDialogOpen(true);
  };

  const openFixDialog = (doc: Document) => {
    setSelectedDocument(doc);
    setFixDialogOpen(true);
  };

  // --- Helper to Render Action Buttons ---
  const getActionButton = (doc: Document) => {
    switch (doc.status) {
      case "Verified":
        return (
          <Button variant="ghost" size="sm" onClick={() => openViewDialog(doc)}>
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
        );
      case "Pending":
        return (
          <div className="flex gap-2">
             <Button variant="ghost" size="sm" onClick={() => openViewDialog(doc)}>
                <Eye className="w-4 h-4" />
             </Button>
             <Button variant="outline" size="sm" onClick={() => openReplaceDialog(doc)}>
                <RefreshCw className="w-4 h-4 mr-1" /> Replace
             </Button>
          </div>
        );
      case "Rejected":
        return (
          <Button size="sm" variant="destructive" onClick={() => openFixDialog(doc)}>
            Fix & Re-upload
          </Button>
        );
      case "Not Uploaded":
        return (
          <Button variant="outline" size="sm" onClick={() => handleUploadNew(doc)}>
            <Upload className="w-4 h-4 mr-1" /> Upload
          </Button>
        );
      default:
        return null;
    }
  };

  const requiredDocuments = documents.filter(d => d.category === "required");
  const rejectedDocuments = documents.filter(d => d.status === "Rejected");
  const optionalDocuments = documents.filter(d => d.category === "optional" && d.status !== "Rejected");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground mt-1">Upload and manage your required files for application.</p>
        </div>
        <Button 
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => {
            setSelectedDocument(null);
            setSelectedDocType("");
            setUploadDialogOpen(true);
          }}
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload New Document
        </Button>
      </div>

      {/* Rejected Documents Alert Section */}
      {rejectedDocuments.length > 0 && (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Action Required
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
                {rejectedDocuments.map((doc, idx) => (
                <div key={doc._id || idx} className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-foreground">{doc.name}</h3>
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700")}>Rejected</span>
                    </div>
                    <div className="bg-white dark:bg-background p-3 rounded border border-red-100 text-sm text-muted-foreground mb-4">
                        <span className="font-semibold text-red-600 mr-1">Feedback:</span> 
                        {doc.feedback || "Document is not clear or incorrect."}
                    </div>
                    <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={() => openFixDialog(doc)}>
                        Fix & Re-upload
                    </Button>
                </div>
                ))}
            </div>
        </div>
      )}

      {/* Required Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b pb-2">Required Documents</h2>
        <div className="bg-card border border-border rounded-lg shadow-sm divide-y divide-border">
          {requiredDocuments.map((doc, idx) => (
            <div key={doc._id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className={cn("p-2.5 rounded-lg", doc.status === "Verified" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground")}>
                    <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{doc.name}</p>
                  {doc.fileName ? (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" /> {doc.fileName}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Mandatory</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                <span className={cn("text-xs", getStatusStyles(doc.status))}>{doc.status}</span>
                {getActionButton(doc)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Documents */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground border-b pb-2">Optional Documents</h2>
        
        {optionalDocuments.length === 0 ? (
            <div className="text-center py-10 bg-muted/20 border border-dashed rounded-lg">
                <p className="text-muted-foreground text-sm">You haven t uploaded any optional documents yet.</p>
            </div>
        ) : (
            <div className="bg-card border border-border rounded-lg shadow-sm divide-y divide-border">
            {optionalDocuments.map((doc, idx) => (
                <div key={doc._id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-muted text-muted-foreground">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                    </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
                    <span className={cn("text-xs", getStatusStyles(doc.status))}>{doc.status}</span>
                    {getActionButton(doc)}
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* --- DIALOGS --- */}

      {/* 1. Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Select document type and upload your file (PDF/Image).</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedDocType} onValueChange={setSelectedDocType} disabled={!!selectedDocument}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Replace / Fix Dialog (Reused for simplicity) */}
      <Dialog open={replaceDialogOpen || fixDialogOpen} onOpenChange={(open) => {
          if(!open) { setReplaceDialogOpen(false); setFixDialogOpen(false); }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{fixDialogOpen ? "Fix & Re-upload" : "Replace Document"}</DialogTitle>
            <DialogDescription>Upload a new version for {selectedDocument?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             {fixDialogOpen && selectedDocument?.feedback && (
                <div className="bg-red-50 p-3 rounded text-sm text-red-600 border border-red-100">
                  <span className="font-semibold">Reason:</span> {selectedDocument.feedback}
                </div>
             )}
            <div className="space-y-2">
              <Label>Select New File</Label>
              <Input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReplaceDialogOpen(false); setFixDialogOpen(false); }}>Cancel</Button>
            <Button onClick={fixDialogOpen ? handleFixReupload : handleReplace} disabled={isUploading}>
              {isUploading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Upload New Version"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3. View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
  <div className="py-6 text-center space-y-4">
    <div className="bg-muted/30 p-8 rounded-lg border border-dashed flex flex-col items-center justify-center">
      <FileText className="w-12 h-12 text-primary mb-2" />
      <h3 className="font-semibold">{selectedDocument.name}</h3>
      <p className="text-sm text-muted-foreground">{selectedDocument.fileName}</p>
      
      <Badge className="mt-2 bg-transparent border border-border text-foreground hover:bg-muted">
        {selectedDocument.status}
      </Badge>
    </div>
    
    <div className="flex justify-center gap-3">
      <Button 
        variant="outline" 
        onClick={() => window.open(selectedDocument.fileUrl, '_blank')} 
        disabled={!selectedDocument.fileUrl}
      >
        Open in New Tab
      </Button>
    </div>
  </div>
)}
        </DialogContent>
      </Dialog>

    </div>
  );
}