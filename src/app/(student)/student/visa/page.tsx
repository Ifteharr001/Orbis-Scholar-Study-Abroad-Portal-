"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Download, 
  ExternalLink, 
  Upload, 
  Plane, 
  MapPin, 
  Calendar as CalendarIcon,
  FileText,
  Lock,
  ChevronDown,
  ChevronUp,
  X,
  Eye
} from "lucide-react";

export default function VisaPreDeparturePage() {
  const [visaProgress, setVisaProgress] = useState(40);
  const [expandedSections, setExpandedSections] = useState({
    visaApplication: true,
    appointments: false,
    travel: false,
    preDeparture: false,
  });
  const [medicalDate, setMedicalDate] = useState<Date>();
  const [embassyDate, setEmbassyDate] = useState<Date>();
  const [needsPickup, setNeedsPickup] = useState(false);

  // Dialog states
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  // Define task interface for better type safety
  interface Task {
    id: number;
    name: string;
    status: "done" | "pending" | "locked" | "verified";
    auto: boolean;
    hasLink: boolean;
    hasUpload: boolean;
  }

  const [visaTasks, setVisaTasks] = useState<Task[]>([
    { id: 1, name: "CAS/Offer Letter Received", status: "done", auto: true, hasLink: false, hasUpload: false },
    { id: 2, name: "Visa Application Form (DS-160)", status: "pending", auto: false, hasLink: true, hasUpload: false },
    { id: 3, name: "Visa Fee Payment", status: "pending", auto: false, hasLink: false, hasUpload: true },
    { id: 4, name: "Appointment Booking", status: "locked", auto: false, hasLink: false, hasUpload: false },
    { id: 5, name: "Biometric Submission", status: "locked", auto: false, hasLink: false, hasUpload: false },
    { id: 6, name: "Medical Test Report", status: "locked", auto: false, hasLink: false, hasUpload: true },
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: number]: { name: string; url: string } }>({});

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Form URLs for different tasks
  const formUrls: { [key: number]: string } = {
    2: "https://ceac.state.gov/genniv/", // DS-160 form example
  };

  // Handle opening form dialog
  const openFormDialog = (task: Task) => {
    setSelectedTask(task);
    setFormDialogOpen(true);
  };

  // Handle opening upload dialog
  const openUploadDialog = (task: Task) => {
    setSelectedTask(task);
    setSelectedFile(null);
    setUploadDialogOpen(true);
  };

  // Handle opening view dialog
  const openViewDialog = (task: Task) => {
    setSelectedTask(task);
    setViewDialogOpen(true);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Update progress based on completed tasks
  const updateProgress = () => {
    setTimeout(() => {
      setVisaTasks(prev => {
        const completedCount = prev.filter(t => t.status === "done").length;
        const totalCount = prev.length;
        setVisaProgress(Math.round((completedCount / totalCount) * 100));
        return prev;
      });
    }, 100);
  };

  // Handle upload
  const handleUpload = () => {
    if (selectedFile && selectedTask) {
      setUploadedFiles(prev => ({
        ...prev,
        [selectedTask.id]: {
          name: selectedFile.name,
          url: URL.createObjectURL(selectedFile)
        }
      }));
      
      // Update task status
      setVisaTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: "done" }
          : task
      ));
      
      setUploadDialogOpen(false);
      setSelectedFile(null);
      toast.success(`${selectedTask.name} uploaded successfully!`);
      
      // Recalculate progress
      updateProgress();
    }
  };

  // Handle form completion
  const handleFormComplete = () => {
    if (selectedTask) {
      setVisaTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? { ...task, status: "done" }
          : task
      ));
      
      setFormDialogOpen(false);
      toast.success(`${selectedTask.name} completed successfully!`);
      
      updateProgress();
    }
  };

  const packingItems = [
    { name: "Passport & Visa Copy", checked: false },
    { name: "Flight Tickets", checked: false },
    { name: "University Documents", checked: false },
    { name: "Cash & Cards", checked: false },
    { name: "Winter Clothing", checked: false },
    { name: "Medicines", checked: false },
    { name: "Electronics & Adapters", checked: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Done</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">Pending</Badge>;
      case "verified":
        return <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 dark:bg-cyan-900/30 dark:text-cyan-400">Verified</Badge>;
      case "locked":
        return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100 dark:bg-muted dark:text-muted-foreground">Locked</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />;
      case "locked":
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Section with Progress */}
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Visa Process for United Kingdom</h1>
            <p className="text-cyan-100 mb-6">Track your visa application and pre-departure tasks</p>
            
            {/* Progress Circle */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="white"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${visaProgress * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{visaProgress}%</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-cyan-100 mb-1">Next Action</p>
                <p className="text-lg font-semibold">Submit Biometric Confirmation</p>
              </div>
            </div>
          </div>
          
          {/* Embassy Details */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[280px] w-full md:w-auto">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Embassy Details</span>
            </div>
            <p className="text-sm text-cyan-100 mb-1">British High Commission</p>
            <p className="text-sm text-cyan-100">Dhaka, Bangladesh</p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 text-white hover:bg-white/20 p-0 h-auto font-normal hover:text-white"
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View on Map
            </Button>
          </div>
        </div>
      </div>

      {/* Visa Task Checklist */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('visaApplication')}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-semibold text-sm">
              1
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">Visa Application</h2>
              <p className="text-sm text-muted-foreground">Complete all required documents</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400">In Progress</Badge>
            {expandedSections.visaApplication ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>
        
        {expandedSections.visaApplication && (
          <div className="border-t border-border p-5 space-y-4">
            {visaTasks.map((task) => (
              <div 
                key={task.id} 
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-all gap-4",
                  task.status === "done" ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-900/30" : "bg-muted/30 border-border",
                  task.status === "locked" && "opacity-60"
                )}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <span className={cn(
                    "font-medium",
                    task.status === "done" ? "text-green-700 dark:text-green-500" : "text-foreground",
                    task.status === "locked" && "text-muted-foreground"
                  )}>
                    {task.name}
                  </span>
                  {task.auto && (
                    <span className="text-xs text-muted-foreground">(Auto-verified)</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {getStatusBadge(task.status)}
                  
                  {/* View button for completed uploaded tasks */}
                  {task.hasUpload && task.status === "done" && uploadedFiles[task.id] && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8"
                      onClick={() => openViewDialog(task)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  )}
                  
                  {task.hasLink && task.status !== "locked" && task.status !== "done" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8"
                      onClick={() => openFormDialog(task)}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Open Form
                    </Button>
                  )}
                  
                  {task.hasUpload && task.status !== "locked" && task.status !== "done" && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-xs h-8"
                      onClick={() => openUploadDialog(task)}
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointments Section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('appointments')}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
              2
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">Appointments</h2>
              <p className="text-sm text-muted-foreground">Schedule medical and embassy visits</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-muted text-muted-foreground hover:bg-muted">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
            {expandedSections.appointments ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>
        
        {expandedSections.appointments && (
          <div className="border-t border-border p-5">
            <p className="text-sm text-muted-foreground mb-4">Complete Step 1 to unlock appointment scheduling.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-50 pointer-events-none">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <label className="text-sm font-medium text-foreground mb-2 block">Medical Appointment</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal border-border">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {medicalDate ? format(medicalDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={medicalDate}
                      onSelect={setMedicalDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <label className="text-sm font-medium text-foreground mb-2 block">Embassy Interview</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal border-border">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {embassyDate ? format(embassyDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={embassyDate}
                      onSelect={setEmbassyDate}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Travel & Accommodation Section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('travel')}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
              3
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">Travel & Accommodation</h2>
              <p className="text-sm text-muted-foreground">Flight details and pickup request</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-muted text-muted-foreground hover:bg-muted">
              <Lock className="w-3 h-3 mr-1" />
              Locked
            </Badge>
            {expandedSections.travel ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>
        
        {expandedSections.travel && (
          <div className="border-t border-border p-5">
            <p className="text-sm text-muted-foreground mb-4">This section will unlock after your visa is approved.</p>
            
            <div className="opacity-50 pointer-events-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Departure Date</label>
                  <Input type="date" className="border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Flight Number</label>
                  <Input placeholder="e.g., BA123" className="border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Departure Time</label>
                  <Input type="time" className="border-border" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Arrival Time</label>
                  <Input type="time" className="border-border" />
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-900/30 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Plane className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <div>
                      <p className="font-medium text-foreground">Airport Pickup Service</p>
                      <p className="text-sm text-muted-foreground">Request pickup assistance at arrival</p>
                    </div>
                  </div>
                  <Switch checked={needsPickup} onCheckedChange={setNeedsPickup} />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Accommodation Address</label>
                <Input placeholder="Enter your accommodation address" className="border-border" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pre-Departure Orientation Section */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <button
          onClick={() => toggleSection('preDeparture')}
          className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">
              4
            </div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">Pre-Departure Orientation</h2>
              <p className="text-sm text-muted-foreground">Guides, packing list and session booking</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {expandedSections.preDeparture ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </button>
        
        {expandedSections.preDeparture && (
          <div className="border-t border-border p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Packing Checklist */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  Packing Checklist
                </h3>
                <div className="space-y-3">
                  {packingItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border">
                      <Checkbox id={`pack-${index}`} />
                      <label htmlFor={`pack-${index}`} className="text-sm text-foreground cursor-pointer">
                        {item.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Resources */}
              <div className="space-y-4">
                {/* Orientation Session */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-900/10 border border-cyan-200 dark:border-cyan-900/30">
                  <h3 className="font-semibold text-gray-900 dark:text-cyan-100 mb-2">Orientation Session</h3>
                  <p className="text-sm text-gray-600 dark:text-cyan-200/70 mb-4">
                    Join our live pre-departure session to learn about life abroad
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-cyan-200/60 mb-4">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Next Session: January 15, 2026 at 7:00 PM</span>
                  </div>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white border-none">
                    Join Session
                  </Button>
                </div>
                
                {/* Download Guides */}
                <div className="p-5 rounded-xl border border-border">
                  <h3 className="font-semibold text-foreground mb-4">Download Guides</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start text-left border-border">
                      <Download className="w-4 h-4 mr-2" />
                      Survival Guide for UK
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left border-border">
                      <Download className="w-4 h-4 mr-2" />
                      Student Visa FAQ
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-left border-border">
                      <Download className="w-4 h-4 mr-2" />
                      Airport Arrival Guide
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-600" />
              {selectedTask?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-muted/50 rounded-lg p-4 mb-4 border border-border">
              <p className="text-sm text-muted-foreground mb-4">
                You will be redirected to the official form website. After completing the form, return here and mark it as complete.
              </p>
              <Button 
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
                onClick={() => {
                  if (selectedTask && formUrls[selectedTask.id]) {
                    window.open(formUrls[selectedTask.id], '_blank');
                  }
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Official Form
              </Button>
            </div>
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Once youve completed the form, click below to mark it as done:
              </p>
              <Button 
                onClick={handleFormComplete}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Mark as Completed
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-600" />
              Upload {selectedTask?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center mb-4 bg-muted/10">
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-600" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Drag and drop your file here, or</p>
                  <label className="cursor-pointer">
                    <span className="text-cyan-600 hover:text-cyan-700 font-medium">browse files</span>
                    <Input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground mt-2">PDF, JPG, PNG (Max 10MB)</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-600" />
              View {selectedTask?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedTask && uploadedFiles[selectedTask.id] && (
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{uploadedFiles[selectedTask.id].name}</p>
                    <p className="text-sm text-muted-foreground">Uploaded successfully</p>
                  </div>
                </div>
                
                {uploadedFiles[selectedTask.id].name.match(/\.(jpg|jpeg|png)$/i) && (
                  <div className="mb-4 border border-border rounded-lg overflow-hidden">
                    <img 
                      src={uploadedFiles[selectedTask.id].url} 
                      alt="Document preview"
                      className="max-h-80 w-full object-contain bg-muted/20"
                    />
                  </div>
                )}
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = uploadedFiles[selectedTask.id].url;
                      link.download = uploadedFiles[selectedTask.id].name;
                      link.click();
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setViewDialogOpen(false);
                      openUploadDialog(selectedTask);
                    }}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Replace
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}