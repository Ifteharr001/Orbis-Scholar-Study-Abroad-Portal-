"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, MessageSquare, FileText, Building2, Clock, CheckCircle2,
  Plus, XCircle, Loader2, Eye, ListTodo, Mail, Phone, AlertTriangle
} from "lucide-react";

const statusOptions = [
    "Applied", "Docs Pending", "Docs Verified", "Submitted", 
    "Offer Received", "Visa Processing", "Enrolled", "Rejected"
];

export default function CounselorAppDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: "", priority: "Medium", dueDate: "" });

  // Reject Dialog
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/counselor/applications/${applicationId}`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load");
        return;
      }

      setApplication(data.application);
      setDocuments(data.documents);
      setTasks(data.tasks);
      
      if (data.application && Array.isArray(data.application.internalNotes)) {
        setInternalNotes(data.application.internalNotes);
      } else {
        setInternalNotes([]);
      }

    } catch (error) {
      console.error(error);
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (applicationId) fetchApplicationData();
  }, [applicationId]);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
        const res = await fetch(`/api/counselor/applications/${applicationId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "update_status", status: newStatus })
        });
        if(res.ok) {
            toast.success(`Status updated to ${newStatus}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setApplication((prev: any) => ({ ...prev, status: newStatus }));
        }
    } catch {
        toast.error("Failed to update status");
    } finally {
        setUpdatingStatus(false);
    }
  };


  const handleSaveNotes = async () => {
    if(!tempNote.trim()) return;
    try {
      const res = await fetch(`/api/counselor/applications/${applicationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_notes", notes: tempNote }),
      });
      if (res.ok) {
        toast.success("Note added");
        setTempNote(""); setIsNoteDialogOpen(false); fetchApplicationData();
      }
    } catch { toast.error("Failed to add note"); }
  };

  const handleCreateTask = async () => {
    try {
        const res = await fetch(`/api/counselor/applications/${applicationId}`, {
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
            toast.success("Task assigned");
            setIsTaskDialogOpen(false); fetchApplicationData();
        }
    } catch { toast.error("Failed"); }
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (error) return (
    <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h2 className="text-xl font-bold">{error}</h2>
        <Button onClick={() => router.back()}>Go Back</Button>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in-50">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/counselor/applications">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Application Details</h1>
            <p className="text-muted-foreground">{application.applicationId || "N/A"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Select 
                value={application.status} 
                onValueChange={handleStatusChange} 
                disabled={updatingStatus}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {statusOptions.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary">{application.studentName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{application.studentName}</p>
              <div className="flex flex-col text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Mail className="h-3 w-3"/> {application.studentEmail}</span>
                <span className="flex items-center gap-1"><Phone className="h-3 w-3"/> {application.studentPhone || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold">{application.universityName}</p>
              <p className="text-sm text-muted-foreground">{application.programName}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="documents" className="gap-2"><FileText className="h-4 w-4"/> Docs</TabsTrigger>
          <TabsTrigger value="tasks" className="gap-2"><ListTodo className="h-4 w-4"/> Tasks</TabsTrigger>
          <TabsTrigger value="notes" className="gap-2"><MessageSquare className="h-4 w-4"/> Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Documents</CardTitle>
            </CardHeader>
            <CardContent>
                {documents.length === 0 ? <p className="text-center text-muted-foreground py-4">No documents uploaded yet.</p> : (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <div key={doc._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/5">
                                <div className="flex items-center gap-3">
                                    {doc.status === "Verified" ? <CheckCircle2 className="text-green-500 h-5 w-5"/> : doc.status === "Rejected" ? <XCircle className="text-red-500 h-5 w-5"/> : <Clock className="text-yellow-500 h-5 w-5"/>}
                                    <div>
                                        <p className="font-medium">{doc.name}</p>
                                        <div className="flex gap-2">
                                            <Badge variant={doc.status === "Verified" ? "default" : "outline"} className={doc.status === "Verified" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}>
                                                {doc.status}
                                            </Badge>
                                            {doc.feedback && <span className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="h-3 w-3"/> {doc.feedback}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Eye className="h-4 w-4 text-primary"/>
                                        </a>
                                    </Button>
                                    
                                   
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-lg">Tasks</CardTitle>
                    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                        <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 h-4 w-4"/> Assign Task</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
                            <div className="space-y-4 py-4">
                                <Input placeholder="Title" onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Select onValueChange={(v) => setTaskForm({...taskForm, priority: v})} defaultValue="Medium">
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent><SelectItem value="Low">Low</SelectItem><SelectItem value="Medium">Medium</SelectItem><SelectItem value="High">High</SelectItem></SelectContent>
                                    </Select>
                                    <Input type="date" onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})} />
                                </div>
                            </div>
                            <DialogFooter><Button onClick={handleCreateTask}>Assign</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {tasks.length === 0 ? <p className="text-center text-muted-foreground py-4">No tasks assigned.</p> : (
                        <div className="space-y-3">
                            {tasks.map(task => (
                                <div key={task._id} className="flex justify-between items-center p-3 border rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {task.status === "Completed" ? <CheckCircle2 className="text-green-500"/> : <div className="h-5 w-5 rounded-full border-2"/>}
                                        <div>
                                            <p className={`font-medium ${task.status === "Completed" && "line-through text-muted-foreground"}`}>{task.title}</p>
                                            <span className="text-xs text-muted-foreground">{task.priority} • Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}</span>
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

        {/* --- NOTES TAB --- */}
        <TabsContent value="notes" className="mt-6">
            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-lg">Internal Notes</CardTitle>
                    <Dialog open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                        <DialogTrigger asChild><Button size="sm"><Plus className="mr-2 h-4 w-4"/> Add Note</Button></DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add Note</DialogTitle></DialogHeader>
                            <Textarea placeholder="Write note..." rows={5} onChange={(e) => setTempNote(e.target.value)} />
                            <DialogFooter><Button onClick={handleSaveNotes}>Save Note</Button></DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {internalNotes.length === 0 ? <p className="text-center text-muted-foreground py-4">No notes yet.</p> : (
                        <div className="space-y-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {internalNotes.slice().reverse().map((note: any, i) => (
                                <div key={i} className="p-4 border rounded-lg bg-card hover:bg-muted/10">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-4 w-4 text-yellow-500"/>
                                            <span className="text-xs font-semibold text-muted-foreground uppercase">{note.author || "Note"}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm">{note.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>

    
    </div>
  );
}