"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Eye, X, FileText, Check, Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

// ডাটা টাইপ ইন্টারফেস (MongoDB এর সাথে মিল রেখে)
interface Document {
  _id?: string; // MongoDB ID
  name: string;
  status: "Pending" | "Verified" | "Rejected" | "Not Uploaded";
  feedback?: string;
  fileName?: string;
  category: "required" | "rejected" | "optional";
  fileUrl?: string;
}

// ডিফল্ট রিকোয়ারড ডকুমেন্ট লিস্ট (ডাটাবেসে না থাকলেও এগুলো দেখাবে)
const REQUIRED_DEFAULTS: Document[] = [
  { name: "Academic Transcript", status: "Not Uploaded", category: "required" },
  { name: "Passport Copy", status: "Not Uploaded", category: "required" },
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
      return "text-green-600 dark:text-green-400 font-medium";
    case "Pending":
      return "text-orange-500 dark:text-orange-400 font-medium";
    case "Rejected":
      return "text-white bg-red-500 px-3 py-1 rounded text-xs font-medium";
    case "Not Uploaded":
      return "text-muted-foreground";
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

  // ১. ডাটা ফেচ করা
  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/student/documents");
      const data = await res.json();

      if (Array.isArray(data)) {
        // মার্জিং লজিক: API ডাটা + ডিফল্ট রিকোয়ারড ডকুমেন্টস
        // যদি API তে রিকোয়ারড ডক না থাকে, তবে "Not Uploaded" হিসেবে দেখাবে
        const mergedDocs = [...data];

        REQUIRED_DEFAULTS.forEach((defDoc) => {
          const exists = data.find((d) => d.name === defDoc.name);
          if (!exists) {
            mergedDocs.push({ ...defDoc, _id: `temp-${defDoc.name}` });
          }
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

  // ২. কমন আপলোড ফাংশন (API Call)
  const processUpload = async (docName: string, category: string = "optional") => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      // রিয়েল প্রজেক্টে এখানে FormData ব্যবহার করে ফাইল আপলোড করতে হবে
      // আপাতত আমরা JSON পাঠাচ্ছি (আপনার আগের API অনুযায়ী)
      const res = await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: docName,
          fileName: selectedFile.name,
          category: category,
        }),
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Document Uploaded", {
        description: `${docName} has been processed successfully.`,
      });

      // লিস্ট রিফ্রেশ করা
      await fetchDocuments();

      // সব ডায়ালগ বন্ধ করা
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
    // যদি রিকোয়ারড লিস্টে থাকে তবে ক্যাটাগরি 'required' হবে, নাহলে 'optional'
    const isRequired = REQUIRED_DEFAULTS.some(d => d.name === selectedDocType);
    processUpload(selectedDocType, isRequired ? "required" : "optional");
  };

  const handleReplace = () => {
    if (!selectedFile || !selectedDocument) return;
    processUpload(selectedDocument.name, selectedDocument.category);
  };

  const handleFixReupload = () => {
    if (!selectedFile || !selectedDocument) return;
    // ফিক্স করলে সেটা আবার 'required' বা আগের ক্যাটাগরিতেই যাবে, স্ট্যাটাস Pending হবে (API হ্যান্ডেল করবে)
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
          <Button variant="outline" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => openViewDialog(doc)}>
            <Eye className="w-4 h-4 mr-1" /> View
          </Button>
        );
      case "Pending":
        return (
          <Button variant="outline" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => openReplaceDialog(doc)}>
            <RefreshCw className="w-4 h-4 mr-1" /> Replace
          </Button>
        );
      case "Rejected":
        return (
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white border-none" onClick={() => openFixDialog(doc)}>
            Fix & Re-upload
          </Button>
        );
      case "Not Uploaded":
        return (
          <Button variant="outline" size="sm" className="text-muted-foreground hover:bg-muted" onClick={() => handleUploadNew(doc)}>
            <Upload className="w-4 h-4 mr-1" /> Upload
          </Button>
        );
      default:
        return null;
    }
  };

  // ফিল্টারিং
  const requiredDocuments = documents.filter(d => d.category === "required");
  const rejectedDocuments = documents.filter(d => d.status === "Rejected"); // স্ট্যাটাস দিয়ে চেক করা ভালো
  const optionalDocuments = documents.filter(d => d.category === "optional" && d.status !== "Rejected");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Documents</h1>
          <p className="text-muted-foreground">Upload and manage your files safely.</p>
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
          Upload Document
        </Button>
      </div>

      {/* Required Documents */}
      <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-1">Required Documents</h2>
        <p className="text-sm text-muted-foreground mb-4">These are mandatory for your active applications.</p>
        
        <div className="space-y-0 divide-y divide-border">
          {requiredDocuments.map((doc, idx) => (
            <div key={doc._id || idx} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium text-foreground">{doc.name}</span>
                  {doc.fileName && (
                    <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                <span className={cn("text-sm", getStatusStyles(doc.status))}>{doc.status}</span>
                {getActionButton(doc)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rejected Documents (যদি থাকে) */}
      {rejectedDocuments.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-base font-semibold text-foreground mb-1">Rejected Documents</h2>
          <p className="text-sm text-muted-foreground mb-4">Please review the feedback and re-upload these documents.</p>
          
          <div className="space-y-3">
            {rejectedDocuments.map((doc, idx) => (
              <div key={doc._id || idx} className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-100 dark:border-red-900/30">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{doc.name}</span>
                      {doc.fileName && (
                        <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                      )}
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        <span className="font-medium">Feedback:</span> {doc.feedback || "Please re-upload clearly."}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4">
                    <span className={getStatusStyles(doc.status)}>{doc.status}</span>
                    {getActionButton(doc)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Documents */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
        <h2 className="text-base font-semibold text-foreground mb-1">Optional Documents</h2>
        <p className="text-sm text-muted-foreground mb-4">These documents can strengthen your application but are not mandatory.</p>
        
        {optionalDocuments.length === 0 ? (
           <p className="text-sm text-muted-foreground italic">No optional documents uploaded yet.</p>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {optionalDocuments.map((doc, idx) => (
              <div key={doc._id || idx} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <span className="text-sm font-medium text-foreground">{doc.name}</span>
                    {doc.fileName && (
                      <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4">
                  <span className={cn("text-sm", getStatusStyles(doc.status))}>{doc.status}</span>
                  {getActionButton(doc)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- DIALOGS (Upload / Replace / Fix / View) --- */}

      {/* 1. Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>Select a document type and upload your file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Document Type</Label>
              <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
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
              {selectedFile && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" /> {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Replace Dialog */}
      <Dialog open={replaceDialogOpen} onOpenChange={setReplaceDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Replace Document</DialogTitle>
            <DialogDescription>Upload a new version of {selectedDocument?.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New File</Label>
              <Input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setReplaceDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReplace} disabled={isUploading}>
              {isUploading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Replace Document"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 3. Fix Dialog */}
      <Dialog open={fixDialogOpen} onOpenChange={setFixDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fix & Re-upload</DialogTitle>
            <DialogDescription>Address feedback and upload corrected file.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
             {selectedDocument?.feedback && (
               <div className="bg-red-50 p-3 rounded text-sm text-red-600 border border-red-100">
                 Feedback: {selectedDocument.feedback}
               </div>
             )}
            <div className="space-y-2">
              <Label>Corrected File</Label>
              <Input type="file" accept=".pdf,.jpg,.png" onChange={handleFileChange} />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setFixDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleFixReupload} className="bg-cyan-500 hover:bg-cyan-600 text-white" disabled={isUploading}>
               {isUploading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Re-upload Document"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 4. View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>View Document</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="py-4 text-center">
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground">{selectedDocument.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedDocument.fileName}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className={cn("text-sm", getStatusStyles(selectedDocument.status))}>{selectedDocument.status}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
                <Button variant="outline" disabled>Download (Demo)</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}