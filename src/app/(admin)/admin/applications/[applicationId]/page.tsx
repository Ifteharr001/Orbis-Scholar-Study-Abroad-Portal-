"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"; // Changed: Imported directly from sonner
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  Edit,
  MessageSquare,
  FileText,
  Building2,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Mail
} from "lucide-react";

// Mock application data (Previous mock data...)
const applicationData = {
  "APP-001": {
    id: "APP-001",
    student: {
      id: "STU001",
      name: "Rahim Ahmed",
      email: "rahim@email.com",
      phone: "+880 1712-345678",
    },
    university: "University of Toronto",
    program: "Computer Science",
    intake: "Fall 2025",
    stage: "Docs Pending",
    priority: "high",
    submittedDate: "2025-01-02",
    lastUpdated: "2025-01-06",
    counselor: {
      id: "C001",
      name: "Sarah Khan",
      email: "sarah.khan@company.com",
    },
    documents: [
      { id: "D001", name: "Passport Copy", status: "verified", uploadedAt: "2025-01-02", required: true },
      { id: "D002", name: "Academic Transcript", status: "verified", uploadedAt: "2025-01-03", required: true },
      { id: "D003", name: "IELTS Score", status: "pending", uploadedAt: "2025-01-05", required: true },
      { id: "D004", name: "Statement of Purpose", status: "missing", uploadedAt: null, required: true },
      { id: "D005", name: "Recommendation Letter 1", status: "missing", uploadedAt: null, required: true },
      { id: "D006", name: "Recommendation Letter 2", status: "missing", uploadedAt: null, required: false },
    ],
    documentRequests: [
      { id: "REQ001", document: "IELTS Score", message: "Please upload clear scanned copy of IELTS score", requestedAt: "2025-01-04", status: "fulfilled" },
      { id: "REQ002", document: "Statement of Purpose", message: "Please submit your SOP by Jan 15", requestedAt: "2025-01-06", status: "pending" },
    ],
    timeline: [
      { id: 1, action: "Application Created", date: "2025-01-02", user: "Sarah Khan" },
      { id: 2, action: "Documents Uploaded", date: "2025-01-03", user: "Rahim Ahmed" },
      { id: 3, action: "Document Request Sent", date: "2025-01-04", user: "Sarah Khan" },
      { id: 4, action: "Stage Changed to Docs Pending", date: "2025-01-06", user: "System" },
    ],
    notes: "Strong candidate. High CGPA. Needs SOP review.",
  },
};

const documentTypes = [
  "Passport Copy",
  "Academic Transcript",
  "IELTS/TOEFL Score",
  "Statement of Purpose",
  "Recommendation Letter",
  "CV/Resume",
  "Financial Documents",
  "Offer Letter",
  "Visa Documents",
  "Other",
];

const ApplicationDetailsPage = () => {
  const params = useParams();
  const applicationId = params.applicationId as string;
  
  // Removed: const { toast } = useToast(); (Sonner doesn't need this hook)
  
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    documentType: "",
    customDocument: "",
    message: "",
    deadline: "",
    urgent: false,
  });
  
  const application = applicationData[applicationId as keyof typeof applicationData] || applicationData["APP-001"];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Inquiry": return "bg-slate-100 text-slate-700";
      case "Docs Pending": return "bg-yellow-100 text-yellow-700";
      case "Docs Verified": return "bg-blue-100 text-blue-700";
      case "Submitted": return "bg-purple-100 text-purple-700";
      case "Offer Received": return "bg-green-100 text-green-700";
      case "Visa Processing": return "bg-orange-100 text-orange-700";
      case "Enrolled": return "bg-emerald-100 text-emerald-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDocStatusColor = (status: string) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "missing": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case "verified": return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "pending": return <Clock className="h-4 w-4 text-yellow-600" />;
      case "missing": return <AlertCircle className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  const handleRequestDocument = () => {
    const docName = requestForm.documentType === "Other" ? requestForm.customDocument : requestForm.documentType;
    console.log("Requesting document:", {
      ...requestForm,
      documentName: docName,
    });
    
    // Updated: Using Sonner toast syntax
    toast.success("Document Request Sent", {
      description: `Request for "${docName}" has been sent to the student.`,
    });

    setIsRequestDialogOpen(false);
    setRequestForm({
      documentType: "",
      customDocument: "",
      message: "",
      deadline: "",
      urgent: false,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/applications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Application Details</h1>
            <p className="text-muted-foreground">{application.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStageColor(application.stage)}>{application.stage}</Badge>
          <Button variant="outline" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {application.student.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{application.student.name}</p>
                <p className="text-sm text-muted-foreground">{application.student.email}</p>
              </div>
            </div>
            <Link href={`/admin/students/${application.student.id}`}>
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">View Student Profile →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">{application.university}</p>
                <p className="text-sm text-muted-foreground">{application.program}</p>
              </div>
            </div>
            <p className="text-sm mt-2"><span className="text-muted-foreground">Intake:</span> {application.intake}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {application.counselor.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{application.counselor.name}</p>
                <p className="text-sm text-muted-foreground">Counselor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Requests</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Notes</span>
          </TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Application Documents</CardTitle>
              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Request Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Request Document from Student</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Document Type</Label>
                      <Select
                        value={requestForm.documentType}
                        onValueChange={(value) => setRequestForm(prev => ({ ...prev, documentType: value }))}
                      >
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
                    
                    {requestForm.documentType === "Other" && (
                      <div className="space-y-2">
                        <Label>Document Name</Label>
                        <Input
                          placeholder="Enter document name"
                          value={requestForm.customDocument}
                          onChange={(e) => setRequestForm(prev => ({ ...prev, customDocument: e.target.value }))}
                        />
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label>Message to Student</Label>
                      <Textarea
                        placeholder="Add instructions or details about the document..."
                        value={requestForm.message}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Deadline (Optional)</Label>
                      <Input
                        type="date"
                        value={requestForm.deadline}
                        onChange={(e) => setRequestForm(prev => ({ ...prev, deadline: e.target.value }))}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="urgent"
                        checked={requestForm.urgent}
                        onCheckedChange={(checked) => setRequestForm(prev => ({ ...prev, urgent: checked as boolean }))}
                      />
                      <Label htmlFor="urgent" className="text-sm">Mark as urgent</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsRequestDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleRequestDocument} className="gap-2">
                      <Send className="h-4 w-4" />
                      Send Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {application.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getDocStatusIcon(doc.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{doc.name}</p>
                          {doc.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                        </div>
                        {doc.uploadedAt ? (
                          <p className="text-sm text-muted-foreground">Uploaded: {doc.uploadedAt}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Not uploaded</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDocStatusColor(doc.status)} variant="secondary">
                        {doc.status}
                      </Badge>
                      {doc.status !== "verified" && (
                        <Button variant="ghost" size="sm">Request</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Document Requests History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.documentRequests.map((req) => (
                  <div key={req.id} className="p-4 rounded-lg border space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{req.document}</span>
                      </div>
                      <Badge variant={req.status === "fulfilled" ? "default" : "secondary"}>
                        {req.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.message}</p>
                    <p className="text-xs text-muted-foreground">Requested on {req.requestedAt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Application Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-6">
                  {application.timeline.map((event) => (
                    <div key={event.id} className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 top-1 h-4 w-4 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium">{event.action}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.user}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={application.notes}
                placeholder="Add notes about this application..."
                rows={6}
              />
              <Button className="mt-4">Save Notes</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApplicationDetailsPage;