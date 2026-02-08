"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MessageSquare,
  FileText,
  Building2,
  Clock,
  CheckCircle2,
  Plus,
  XCircle,
  Loader2,
  Save,
  User,
  Eye,
  ListTodo,
  Calendar,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Briefcase
} from "lucide-react";

const documentTypes = [
  "Passport Copy",
  "Academic Transcript",
  "IELTS/TOEFL Score",
  "Statement of Purpose",
  "Recommendation Letter",
  "Financial Documents",
  "Other",
];

const ApplicationDetailsPage = () => {
  const params = useParams();
  const applicationId = params.applicationId as string;

  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [application, setApplication] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [documents, setDocuments] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tasks, setTasks] = useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [internalNotes, setInternalNotes] = useState<any[]>([]);
  const [tempNote, setTempNote] = useState(""); 
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  // Request Document State
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requestForm, setRequestForm] = useState({
    documentType: "",
    customDocument: "",
    message: "",
    deadline: "",
    urgent: false,
  });

  // Task Dialog State
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", priority: "Medium", dueDate: "" });
  const [creatingTask, setCreatingTask] = useState(false);

  // Reject Dialog State
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Fetch Application Data
  const fetchApplicationData = async () => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        cache: "no-store", 
      });
      
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      
      setApplication(data.application);
      setDocuments(data.documents);
      setTasks(data.tasks || []);
      
      if (data.application && Array.isArray(data.application.internalNotes)) {
        setInternalNotes(data.application.internalNotes);
      } else {
        setInternalNotes([]); 
      }

    } catch (error) {
      console.error(error);
      toast.error("Error loading application details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, [applicationId]);

  const handleVerifyDocument = async (docId: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "update_document_status", 
            documentId: docId, 
            status: "Verified" 
        }),
      });

      if (res.ok) {
        toast.success("Document Verified");
        setDocuments((prev) =>
          prev.map((doc) => doc._id === docId ? { ...doc, status: "Verified" } : doc)
        );
      }
    } catch (error) {
      toast.error("Failed to verify document");
    }
  };

  const handleRejectDocument = async () => {
    if (!selectedDocId || !rejectReason) return;

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "update_document_status",
            documentId: selectedDocId,
            status: "Rejected", 
            feedback: rejectReason 
        }),
      });

      if (res.ok) {
        toast.error("Document Rejected");
        setDocuments((prev) =>
          prev.map((doc) => doc._id === selectedDocId ? { ...doc, status: "Rejected", feedback: rejectReason } : doc)
        );
        setRejectDialogOpen(false);
        setRejectReason("");
        setSelectedDocId(null);
      }
    } catch (error) {
      toast.error("Failed to reject document");
    }
  };

  const handleSaveNotes = async () => {
    if (!tempNote.trim()) return toast.error("Note cannot be empty");

    setSavingNotes(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            action: "update_notes",
            notes: tempNote 
        }),
      });

      if (res.ok) {
        toast.success("Note added successfully");
        setTempNote(""); 
        fetchApplicationData(); 
        setIsNoteDialogOpen(false); 
      } else {
        toast.error("Failed to save note");
      }
    } catch (error) {
      toast.error("Error saving note");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleRequestDocument = async () => {
    const docName = requestForm.documentType === "Other" ? requestForm.customDocument : requestForm.documentType;
    
    try {
       const res = await fetch(`/api/admin/applications/${applicationId}`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
           action: "request_document",
           studentEmail: application.studentEmail,
           documentName: docName,
           message: requestForm.message,
           deadline: requestForm.deadline
         })
       });

       if(res.ok){
         toast.success("Document Request Sent", {
           description: `Request for "${docName}" has been sent to the student.`,
         });
         setIsRequestDialogOpen(false);
         setRequestForm({ documentType: "", customDocument: "", message: "", deadline: "", urgent: false });
         fetchApplicationData();
       }
    } catch (error) {
        toast.error("Failed to send request");
    }
  };

  const handleCreateTask = async () => {
    if (!taskForm.title) return toast.error("Task title required");
    setCreatingTask(true);
    try {
        const res = await fetch(`/api/admin/applications/${applicationId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "create_task",
                studentEmail: application.studentEmail,
                title: taskForm.title,
                priority: taskForm.priority,
                dueDate: taskForm.dueDate
            })
        });

        if (res.ok) {
            toast.success("Task assigned to student");
            setIsTaskDialogOpen(false);
            setTaskForm({ title: "", priority: "Medium", dueDate: "" });
            fetchApplicationData();
        }
    } catch (error) {
        toast.error("Failed to create task");
    } finally {
        setCreatingTask(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!application) return <div className="p-10 text-center">Application not found</div>;

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/applications">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Application Details</h1>
            <p className="text-muted-foreground">{application.applicationId || application._id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize px-3 py-1">{application.status || "Processing"}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
       
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {application.studentName?.charAt(0) || "S"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{application.studentName}</p>
                <p className="text-sm text-muted-foreground">{application.studentEmail}</p>
              </div>
            </div>
            <Link href={`/admin/students/${application.studentId}`}>
              <Button variant="link" className="p-0 h-auto mt-2 text-sm">View Student Profile →</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{application.universityName}</p>
                <p className="text-sm text-muted-foreground">{application.programName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                {application.counselor?.image ? (
                    <AvatarImage src={application.counselor.image} alt="Counselor" />
                ) : (
                    <AvatarFallback className="bg-purple-100 text-purple-600 font-bold">
                    {application.counselor ? application.counselor.name?.charAt(0) : "?"}
                    </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="font-medium">
                    {application.counselor 
                      ? (typeof application.counselor === 'string' ? application.counselor : application.counselor.name)
                      : "No Counselor"}
                </p>
                <p className="text-sm text-muted-foreground">Assigned Counselor</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" /> Docs
          </TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2">
            <ListTodo className="h-4 w-4" /> Tasks
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <MessageSquare className="h-4 w-4" /> Notes
          </TabsTrigger>
          <TabsTrigger value="counselor" className="gap-2">
            <User className="h-4 w-4" /> Counselor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Student Documents</CardTitle>
              <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Request Document
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Document</DialogTitle>
                    <DialogDescription>Send a notification to the student requesting a specific document.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Document Type</Label>
                      <Select
                        value={requestForm.documentType}
                        onValueChange={(value) => setRequestForm(prev => ({ ...prev, documentType: value }))}
                      >
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {documentTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    {requestForm.documentType === "Other" && (
                      <div className="space-y-2">
                        <Label>Custom Name</Label>
                        <Input 
                            value={requestForm.customDocument}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, customDocument: e.target.value }))}
                            placeholder="Enter document name" 
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                        <Label>Message</Label>
                        <Textarea 
                            value={requestForm.message}
                            onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                            placeholder="Instructions for the student..." 
                        />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleRequestDocument}>Send Request</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {documents.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">No documents uploaded yet.</p>
                ) : (
                    documents.map((doc) => (
                    <div key={doc._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border gap-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            {doc.status === "Verified" ? (
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : doc.status === "Rejected" ? (
                                <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                                <Clock className="h-5 w-5 text-yellow-600" />
                            )}
                            <div>
                                <p className="font-medium">{doc.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge variant={doc.status === "Verified" ? "default" : "secondary"} className={
                                        doc.status === "Verified" ? "bg-green-100 text-green-700 hover:bg-green-100" : 
                                        doc.status === "Rejected" ? "bg-red-100 text-red-700 hover:bg-red-100" : 
                                        "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                                    }>
                                        {doc.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                {doc.feedback && (
                                    <p className="text-xs text-red-500 mt-1">Reason: {doc.feedback}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" asChild>
                                <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                    <Eye className="h-4 w-4" />
                                </a>
                            </Button>
                            {doc.status !== "Verified" && (
                                <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700 text-white h-8"
                                    onClick={() => handleVerifyDocument(doc._id)}
                                >
                                    Verify
                                </Button>
                            )}
                            {doc.status !== "Rejected" && (
                                <Button 
                                    size="sm" 
                                    variant="destructive"
                                    className="h-8"
                                    onClick={() => {
                                        setSelectedDocId(doc._id);
                                        setRejectDialogOpen(true);
                                    }}
                                >
                                    Reject
                                </Button>
                            )}
                        </div>
                    </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg">Student Tasks</CardTitle>
                    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="h-4 w-4 mr-2"/> Assign Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Assign Task to Student</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <Label>Title</Label>
                                    <Input 
                                        placeholder="e.g. Upload missing signature" 
                                        value={taskForm.title}
                                        onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Priority</Label>
                                        <Select onValueChange={(v) => setTaskForm({...taskForm, priority: v})} defaultValue="Medium">
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Due Date</Label>
                                        <Input type="date" onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})} />
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleCreateTask} disabled={creatingTask}>
                                    {creatingTask ? "Assigning..." : "Assign Task"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            No tasks assigned to this student.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task._id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        {task.status === "Completed" ? (
                                            <CheckCircle2 className="text-green-500 h-5 w-5"/>
                                        ) : (
                                            <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                                        )}
                                        <div>
                                            <p className={`font-medium ${task.status === "Completed" && "line-through text-muted-foreground"}`}>
                                                {task.title}
                                            </p>
                                            <div className="flex gap-2 text-xs text-muted-foreground">
                                                <span className={`${task.priority === "High" ? "text-red-500" : "text-blue-500"}`}>
                                                    {task.priority}
                                                </span>
                                                {task.dueDate && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3"/> 
                                                        Due: {new Date(task.dueDate).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{task.status}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Internal Notes</CardTitle>
              <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Plus className="h-4 w-4 mr-2"/> Add Note
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Internal Note</DialogTitle>
                        <DialogDescription>
                            Keep track of important details about this application. These are visible only to admins.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Note Details</Label>
                        <Textarea
                            value={tempNote}
                            onChange={(e) => setTempNote(e.target.value)}
                            placeholder="e.g. Spoke with student, they are waiting for transcript..."
                            rows={6}
                            className="mt-2"
                        />
                    </div>
                    <DialogFooter>
                        <Button onClick={handleSaveNotes} disabled={savingNotes}>
                            {savingNotes ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Note
                        </Button>
                    </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {internalNotes.length > 0 ? (
                  <div className="space-y-4">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {internalNotes.slice().reverse().map((note: any, index: number) => (
                          <div key={index} className="p-4 border rounded-lg bg-card hover:bg-muted/20 transition-all shadow-sm flex flex-col gap-2">
                              <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-2">
                                      <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center">
                                          <MessageSquare className="h-3 w-3 text-yellow-600" />
                                      </div>
                                      <span className="text-xs font-semibold text-muted-foreground uppercase">Internal Note</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {new Date(note.createdAt).toLocaleString()}
                                  </span>
                              </div>
                              
                              <p className="text-foreground whitespace-pre-wrap leading-relaxed pl-8">
                                  {note.content}
                              </p>
                              
                              <div className="flex justify-end mt-2 pl-8">
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                      Author: {note.author || "Admin"}
                                  </span>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg bg-muted/5">
                      <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                          <MessageSquare className="h-6 w-6 text-muted-foreground opacity-50" />
                      </div>
                      <h3 className="text-sm font-medium">No internal notes yet</h3>
                      <p className="text-xs mt-1">Add notes to track application progress internally.</p>
                      <Button variant="link" onClick={() => setIsNoteDialogOpen(true)} className="mt-2">
                          Add a note
                      </Button>
                  </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="counselor" className="mt-6">
            <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-gray-100 p-6">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Briefcase className="h-5 w-5" /> Counselor Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {application.counselor && typeof application.counselor === 'object' && application.counselor.email ? (
                        <div className="flex flex-col md:flex-row">
                            <div className="md:w-1/3 bg-muted/30 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r">
                                <div className="relative mb-4">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src={application.counselor.image} alt={application.counselor.name} />
                                        <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-600 font-bold">
                                            {application.counselor.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white" title="Active"></div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-800">{application.counselor.name}</h3>
                                <p className="text-sm text-indigo-600 font-medium mb-4">Assigned Counselor</p>
                                
                                <div className="w-full max-w-xs mt-4">
                                    <p className="text-xs text-muted-foreground">
                                        To change the counselor, please visit the student profile page.
                                    </p>
                                    <Link href={`/admin/students/${application.studentId}`}>
                                        <Button variant="outline" className="w-full mt-2">
                                            Go to Student Profile
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="md:w-2/3 p-8">
                                <h4 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
                                    <ShieldCheck className="h-5 w-5 text-green-600" /> Professional Details
                                </h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5" /> Email Address
                                        </p>
                                        <p className="font-medium text-gray-900">{application.counselor.email}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5" /> Phone Number
                                        </p>
                                        <p className="font-medium text-gray-900">{application.counselor.phone || "Not Provided"}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5" /> Location
                                        </p>
                                        <p className="font-medium text-gray-900">{application.counselor.country || "Global"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/10">
                            <div className="h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <User className="h-10 w-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No Counselor Assigned</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6 mt-2">
                                This application is currently not assigned to any counselor.
                                Please go to the student profile to assign a counselor.
                            </p>
                            <Link href={`/admin/students/${application.studentId}`}>
                                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200">
                                    Go to Student Profile
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reject Document</DialogTitle>
                <DialogDescription>Please provide a reason for rejection.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label>Reason</Label>
                <Textarea 
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="e.g., Image is blurry, Wrong document uploaded..."
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleRejectDocument}>Confirm Reject</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default ApplicationDetailsPage;