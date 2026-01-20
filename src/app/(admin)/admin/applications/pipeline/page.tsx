"use client";

import { useState, useEffect, DragEvent, useRef } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, MoreHorizontal, GripVertical, Calendar, 
  Building2, Loader2, Plus, UploadCloud, Link as LinkIcon, FileText 
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; 

interface Application {
  _id: string;
  studentName: string;
  studentEmail?: string;
  studentImage?: string;
  universityName: string;
  programName: string;
  intakePreference: string;
  counselor?: string;
  status: string;
  createdAt: string;
  priority?: "high" | "medium" | "low";
  offerLetterUrl?: string; 
}

interface Stage {
  id: string;
  name: string;
  color: string;
  applications: Application[];
}

const STAGE_CONFIG = [
  { id: "Applied", name: "New Applied", color: "bg-blue-600" },
  { id: "Inquiry", name: "Inquiry", color: "bg-slate-500" },
  { id: "In Review", name: "In Review", color: "bg-indigo-500" },
  { id: "Docs Pending", name: "Docs Pending", color: "bg-yellow-500" },
  { id: "Docs Verified", name: "Docs Verified", color: "bg-blue-500" },
  { id: "Submitted", name: "Submitted", color: "bg-purple-500" },
  { id: "Offer Received", name: "Offer Received", color: "bg-green-500" },
  { id: "Visa Processing", name: "Visa Processing", color: "bg-orange-500" },
  { id: "Enrolled", name: "Enrolled", color: "bg-emerald-600" },
  { id: "Rejected", name: "Rejected", color: "bg-red-500" },
];

export default function ApplicationsPipelinePage() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [draggedApp, setDraggedApp] = useState<{ app: Application; fromStageId: string } | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ app: Application; toStageId: string } | null>(null);
  
  const [offerLink, setOfferLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>(""); 
  const [isProcessingFile, setIsProcessingFile] = useState(false); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      
      if (res.ok) {
        organizeDataIntoStages(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to fetch pipeline:", error);
      toast.error("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const organizeDataIntoStages = (apps: Application[]) => {
    const newStages = STAGE_CONFIG.map(config => ({
      ...config,
      applications: apps.filter(app => app.status === config.id)
    }));
    setStages(newStages);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getDaysAgo = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  };


  const handleDragStart = (e: DragEvent<HTMLDivElement>, app: Application, stageId: string) => {
    setDraggedApp({ app, fromStageId: stageId });
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget) e.currentTarget.style.opacity = "0.5";
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggedApp(null);
    setDragOverStageId(null);
    if (e.currentTarget) e.currentTarget.style.opacity = "1";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault();
    if (dragOverStageId !== stageId) setDragOverStageId(stageId);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>, toStageId: string) => {
    e.preventDefault();
    setDragOverStageId(null);

    if (!draggedApp) return;
    if (draggedApp.fromStageId === toStageId) return;

    const { app } = draggedApp;

    if (toStageId === "Offer Received") {
      setPendingMove({ app, toStageId }); 
      setOfferLink(""); 
      setSelectedFile(null);
      setFileData("");
      setIsOfferModalOpen(true); 
      setDraggedApp(null); 
      return; 
    }

    executeStageMove(app, toStageId);
    setDraggedApp(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const executeStageMove = async (app: Application, toStageId: string, extraData: any = {}) => {
    const fromStageId = draggedApp?.fromStageId || stages.find(s => s.applications.find(a => a._id === app._id))?.id;

    const updatedStages = stages.map(stage => {
      if (stage.id === fromStageId) {
        return { ...stage, applications: stage.applications.filter(a => a._id !== app._id) };
      }
      if (stage.id === toStageId) {
        return { ...stage, applications: [...stage.applications, { ...app, status: toStageId, ...extraData }] };
      }
      return stage;
    });
    setStages(updatedStages);

    try {
      const res = await fetch(`/api/admin/applications/${app._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status: toStageId,
          ...extraData 
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      const toStageName = stages.find(s => s.id === toStageId)?.name;
      toast.success("Stage Updated", {
        description: `${app.studentName} moved to ${toStageName}`
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to save changes. Reverting...");
      fetchApplications();
    }
  };

  const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("File is too large! Max limit is 5MB.");
        if (fileInputRef.current) fileInputRef.current.value = ""; 
        return;
      }

      setSelectedFile(file);
      setOfferLink(""); 
      setIsProcessingFile(true); 
      
      try {
        const base64String = await toBase64(file);
        setFileData(base64String);
      } catch (err) {
        toast.error("Error processing file");
        console.error(err);
        setSelectedFile(null);
      } finally {
        setIsProcessingFile(false); 
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.click();
    }
  };

  
  const handleConfirmOffer = () => {
    if (!pendingMove) return;
    
    if (!offerLink && !selectedFile) {
      toast.error("Please provide an offer letter link or upload a file.");
      return;
    }

    const finalUrl = selectedFile ? fileData : offerLink;
    
    if (selectedFile && !finalUrl) {
        toast.error("File processing error. Please try again.");
        return;
    }

    
    executeStageMove(pendingMove.app, pendingMove.toStageId, { offerLetterUrl: finalUrl });
    
    setIsOfferModalOpen(false);
    setPendingMove(null);
    setSelectedFile(null);
    setFileData("");
  };

  const handleCancelOffer = () => {
    setIsOfferModalOpen(false);
    setPendingMove(null);
    setSelectedFile(null);
    setFileData("");
    toast.info("Move cancelled");
  };

  
  const filteredStages = stages.map(stage => ({
    ...stage,
    applications: stage.applications.filter(app =>
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.universityName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 h-[calc(100vh-100px)] flex flex-col">
      
      <div className="flex-none space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Applications Pipeline</h1>
            <p className="text-muted-foreground">Drag and drop to move applications between stages</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/applications">
                 <Button variant="outline" size="sm">List View</Button>
            </Link>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" /> New Application
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by student or university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Counselor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counselors</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      
      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-max h-full">
          {filteredStages.map((stage) => (
            <div
              key={stage.id}
              className="w-[300px] flex flex-col h-full"
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <CardHeader className="p-3 bg-muted/30 border rounded-t-lg flex-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                    <CardTitle className="text-sm font-medium">{stage.name}</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stage.applications.length}
                  </Badge>
                </div>
              </CardHeader>

              <div 
                className={`flex-1 p-2 bg-muted/10 border-x border-b rounded-b-lg space-y-3 overflow-y-auto transition-colors ${
                   dragOverStageId === stage.id ? "bg-primary/5 border-primary/50" : ""
                }`}
              >
                {stage.applications.map((app) => (
                  <Card
                    key={app._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app, stage.id)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 select-none bg-background relative group"
                  >
                    <CardContent className="p-3 space-y-3">

                      <div className="flex items-start gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground mt-1 opacity-50 group-hover:opacity-100" />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={app.studentImage} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                             {app.studentName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{app.studentName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                             {app.counselor || "No Counselor"}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 -mr-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/admin/applications/${app._id}`}>
                              <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                            </Link>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      
                      <div className="space-y-1 pl-7">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                           <Building2 className="h-3 w-3" />
                           <span className="truncate">{app.universityName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                           <Calendar className="h-3 w-3" />
                           <span className="truncate">{app.intakePreference || "N/A"}</span>
                        </div>
                        
                        {app.offerLetterUrl && (
                            <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                <LinkIcon className="h-3 w-3" />
                                <span className="truncate font-medium">Offer Attached</span>
                            </div>
                        )}
                      </div>

                      
                      <div className="flex items-center justify-between pt-2 pl-7 border-t mt-2">
                         <div className="text-[10px] text-muted-foreground">
                            {getDaysAgo(app.createdAt)} days ago
                         </div>
                         {app.priority && (
                           <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 capitalize ${getPriorityColor(app.priority)}`}>
                             {app.priority}
                           </Badge>
                         )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {stage.applications.length === 0 && (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed rounded-lg border-muted/50 text-muted-foreground text-xs">
                    Drop items here
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <Dialog open={isOfferModalOpen} onOpenChange={(open) => !open && handleCancelOffer()}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Upload Offer Letter</DialogTitle>
                <DialogDescription>
                    Please provide the Offer Letter for <span className="font-semibold text-foreground">{pendingMove?.app.studentName}</span> to proceed.
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="link">Offer Letter Link (PDF/Drive)</Label>
                    <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            id="link" 
                            placeholder="https://drive.google.com/..." 
                            className="pl-9"
                            value={offerLink}
                            onChange={(e) => {
                                setOfferLink(e.target.value);
                                if(e.target.value) {
                                    setSelectedFile(null); 
                                    setFileData("");
                                }
                            }}
                        />
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx"
                />
                <Button 
                    variant="outline" 
                    className={`w-full border-dashed ${selectedFile ? 'border-primary bg-primary/5 text-primary' : ''}`}
                    onClick={handleUploadClick}
                    disabled={isProcessingFile}
                >
                    {isProcessingFile ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                            Processing...
                        </>
                    ) : selectedFile ? (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            {selectedFile.name} (Change)
                        </>
                    ) : (
                        <>
                            <UploadCloud className="mr-2 h-4 w-4" /> 
                            Upload File (PDF/Doc) (Max 5MB)
                        </>
                    )}
                </Button>
            </div>

            <DialogFooter>
                <Button variant="outline" onClick={handleCancelOffer}>Cancel</Button>
                <Button 
                    onClick={handleConfirmOffer} 
                    disabled={(!offerLink && !selectedFile) || isProcessingFile}
                >
                    Confirm & Move
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}