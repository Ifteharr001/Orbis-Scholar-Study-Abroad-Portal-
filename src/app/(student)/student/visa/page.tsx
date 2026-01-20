"use client";

import { useState, useEffect, useCallback } from "react";
// ... (বাকি ইম্পোর্ট আগের মতোই)
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
  CheckCircle2, Circle, Clock, ExternalLink, Upload, 
  Plane, MapPin, Calendar as CalendarIcon, FileText, Lock, 
  ChevronDown, ChevronUp, Eye, Loader2 
} from "lucide-react";

// ... (ইন্টারফেসগুলো আগের মতোই থাকবে)
interface Task {
  id: number;
  name: string;
  status: "done" | "pending" | "locked" | "verified";
  auto: boolean;
  hasLink: boolean;
  hasUpload: boolean;
  fileUrl?: string;
  fileName?: string;
}

interface PackingItem {
  _id?: string;
  name: string;
  checked: boolean;
}

interface VisaUpdatePayload {
  tasks?: Task[];
  progress?: number;
  packingList?: PackingItem[];
  medicalDate?: Date;
  embassyDate?: Date;
  travel?: {
    departureDate?: string;
    flightNumber?: string;
    departureTime?: string;
    arrivalTime?: string;
    accommodationAddress?: string;
    needsPickup?: boolean;
  };
}

export default function VisaPreDeparturePage() {
  // ... (স্টেট ভেরিয়েবলগুলো আগের মতোই)
  const [loading, setLoading] = useState(true);
  const [visaProgress, setVisaProgress] = useState(0);
  const [visaTasks, setVisaTasks] = useState<Task[]>([]);
  const [packingItems, setPackingItems] = useState<PackingItem[]>([]);
  
  const [medicalDate, setMedicalDate] = useState<Date>();
  const [embassyDate, setEmbassyDate] = useState<Date>();
  
  const [travelData, setTravelData] = useState({
    departureDate: "",
    flightNumber: "",
    departureTime: "",
    arrivalTime: "",
    accommodationAddress: "",
  });
  const [needsPickup, setNeedsPickup] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    visaApplication: true,
    appointments: false,
    travel: false,
    preDeparture: false,
  });

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch Data (Same as before)
  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/student/visa-process");
      if (!res.ok) throw new Error("Failed to fetch data");
      
      const data = await res.json();
      
      if (data) {
        setVisaProgress(data.progress || 0);
        setVisaTasks(data.tasks || []);
        setPackingItems(data.packingList || []);
        if (data.medicalDate) setMedicalDate(new Date(data.medicalDate));
        if (data.embassyDate) setEmbassyDate(new Date(data.embassyDate));
        if (data.travel) {
          setTravelData({
             departureDate: data.travel.departureDate ? format(new Date(data.travel.departureDate), "yyyy-MM-dd") : "",
             flightNumber: data.travel.flightNumber || "",
             departureTime: data.travel.departureTime || "",
             arrivalTime: data.travel.arrivalTime || "",
             accommodationAddress: data.travel.accommodationAddress || "",
          });
          setNeedsPickup(data.travel.needsPickup || false);
        }
      }
    } catch (error) {
      console.error("Failed to load visa data", error);
      toast.error("Failed to load visa process details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateVisaProcess = async (updates: VisaUpdatePayload) => {
    try {
      const res = await fetch("/api/student/visa-process", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    }
  };

  // 🔥 Fix: Sequential Unlock Logic Here
  const handleTaskUpdate = async (taskId: number, newStatus: string, fileData?: { fileName: string, fileUrl: string }) => {
    const updatedTasks = visaTasks.map(t => 
      t.id === taskId 
        ? { ...t, status: newStatus as Task["status"], ...(fileData || {}) } 
        : t
    );
    
    // ✅ Logic: যদি বর্তমান টাস্ক 'done' হয়, তবে পরের টাস্ক 'locked' থেকে 'pending' হবে
    if (newStatus === "done") {
        const currentTaskIndex = updatedTasks.findIndex(t => t.id === taskId);
        // যদি পরের টাস্ক থাকে
        if (currentTaskIndex < updatedTasks.length - 1) {
            const nextTask = updatedTasks[currentTaskIndex + 1];
            // যদি পরের টাস্ক লক করা থাকে, তবে সেটা আনলক করো
            if (nextTask.status === "locked") {
                updatedTasks[currentTaskIndex + 1] = { ...nextTask, status: "pending" };
                toast.info(`Next step unlocked: ${nextTask.name}`);
            }
        }
    }

    // Progress Calculation
    const completedCount = updatedTasks.filter(t => t.status === "done" || t.status === "verified").length;
    const newProgress = Math.round((completedCount / updatedTasks.length) * 100);

    // Optimistic Update
    setVisaTasks(updatedTasks);
    setVisaProgress(newProgress);

    // API Call
    await updateVisaProcess({ 
      tasks: updatedTasks, 
      progress: newProgress 
    });
  };

  // ... (Rest of the handlers: handleUpload, handleFormComplete etc. remain SAME)
  const handleUpload = async () => {
    if (selectedFile && selectedTask) {
      const dummyUrl = URL.createObjectURL(selectedFile); 
      await handleTaskUpdate(selectedTask.id, "done", { 
        fileName: selectedFile.name, 
        fileUrl: dummyUrl 
      });
      setUploadDialogOpen(false);
      setSelectedFile(null);
      toast.success(`${selectedTask.name} uploaded successfully!`);
    } else {
        toast.error("Please select a file.");
    }
  };

  const handleFormComplete = async () => {
    if (selectedTask) {
      await handleTaskUpdate(selectedTask.id, "done");
      setFormDialogOpen(false);
      toast.success(`${selectedTask.name} marked as complete!`);
    }
  };

  const handlePackingToggle = async (index: number) => {
    const newPackingList = [...packingItems];
    newPackingList[index].checked = !newPackingList[index].checked;
    setPackingItems(newPackingList);
    await updateVisaProcess({ packingList: newPackingList });
  };

  useEffect(() => {
    if (!loading && (medicalDate || embassyDate)) {
      const timer = setTimeout(() => {
        updateVisaProcess({ medicalDate, embassyDate });
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [medicalDate, embassyDate, loading]);

  const handleTravelChange = (field: string, value: string) => {
    setTravelData(prev => ({ ...prev, [field]: value }));
  };

  const saveTravelDetails = () => {
    updateVisaProcess({ 
      travel: { 
        ...travelData, 
        needsPickup 
      } 
    });
    toast.success("Travel details saved!");
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // ✅ Fix: Generic URL or UK specific
  const formUrls: { [key: number]: string } = {
    2: "https://visas-immigration.service.gov.uk/product/uk-visit-visa", // UK Link
  };

  // ... (Helpers: getStatusBadge, getStatusIcon remain SAME)
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Done</Badge>;
      case "pending": return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Pending</Badge>;
      case "verified": return <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">Verified</Badge>;
      case "locked": return <Badge className="bg-gray-100 text-gray-500 hover:bg-gray-100">Locked</Badge>;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case "pending": return <Clock className="w-5 h-5 text-orange-500" />;
      case "locked": return <Lock className="w-5 h-5 text-gray-400" />;
      default: return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center h-[60vh] items-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;
  }

  // JSX Return (Same structure, verify the Header Text)
  return (
    <div className="space-y-6 pb-10">
      <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-2xl p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="flex-1">
            {/* ✅ নিশ্চিত করুন টাইটেল ঠিক আছে */}
            <h1 className="text-2xl font-bold mb-2">Visa Process for United Kingdom</h1> 
            <p className="text-cyan-100 mb-6">Track your visa application and pre-departure tasks</p>
            {/* ... rest of the UI ... */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                  <circle cx="48" cy="48" r="40" stroke="white" strokeWidth="8" fill="none" strokeDasharray={`${visaProgress * 2.51} 251`} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold">{visaProgress}%</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-cyan-100 mb-1">Next Action</p>
                <p className="text-lg font-semibold">
                  {visaTasks.find(t => t.status === "pending")?.name || "All Tasks Completed!"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 min-w-[280px] w-full md:w-auto border border-white/20">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">Embassy Details</span>
            </div>
            {/* ✅ UK Embassy Address */}
            <p className="text-sm text-cyan-100 mb-1">British High Commission</p>
            <p className="text-sm text-cyan-100">Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>

      {/* 1. Visa Tasks (UI Code remains same, logic updated above) */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <button onClick={() => toggleSection('visaApplication')} className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900 flex items-center justify-center text-cyan-700 dark:text-cyan-400 font-semibold text-sm">1</div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">Visa Application</h2>
              <p className="text-sm text-muted-foreground">Complete all required documents</p>
            </div>
          </div>
          {expandedSections.visaApplication ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {expandedSections.visaApplication && (
          <div className="border-t border-border p-5 space-y-4">
            {visaTasks.map((task) => (
              <div key={task.id} className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-all gap-4", task.status === "done" ? "bg-green-50/50 border-green-200" : "bg-muted/30 border-border", task.status === "locked" && "opacity-60")}>
                <div className="flex items-center gap-3">
                  {getStatusIcon(task.status)}
                  <span className={cn("font-medium", task.status === "done" ? "text-green-700" : "text-foreground")}>{task.name}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(task.status)}
                  
                  {/* Action Buttons */}
                  {task.hasUpload && task.status === "done" && (
                    <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => { setSelectedTask(task); setViewDialogOpen(true); }}>
                      <Eye className="w-3 h-3 mr-1" /> View
                    </Button>
                  )}
                  {task.hasLink && task.status === "pending" && (
                    <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => { setSelectedTask(task); setFormDialogOpen(true); }}>
                      <ExternalLink className="w-3 h-3 mr-1" /> Open Form
                    </Button>
                  )}
                  {task.hasUpload && task.status === "pending" && (
                      <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => { setSelectedTask(task); setUploadDialogOpen(true); }}>
                        <Upload className="w-3 h-3 mr-1" /> Upload
                      </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ... (Rest of the UI for Appointments, Travel, Pre-Departure, Dialogs stays EXACTLY same) */}
      {/* 2. Appointments */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        {/* ... Appointment UI Code ... */}
        <button onClick={() => toggleSection('appointments')} className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">2</div>
            <div className="text-left">
              <h2 className="font-semibold text-foreground">Appointments</h2>
              <p className="text-sm text-muted-foreground">Schedule medical and embassy visits</p>
            </div>
          </div>
          {expandedSections.appointments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {expandedSections.appointments && (
          <div className="border-t border-border p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <label className="text-sm font-medium mb-2 block">Medical Appointment</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal border-border bg-background">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {medicalDate ? format(medicalDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={medicalDate} onSelect={setMedicalDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="p-4 rounded-lg border border-border bg-muted/30">
                <label className="text-sm font-medium mb-2 block">Embassy Interview</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal border-border bg-background">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {embassyDate ? format(embassyDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={embassyDate} onSelect={setEmbassyDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
          </div>
        )}
      </div>

      {/* 3. Travel */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
         <button onClick={() => toggleSection('travel')} className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">3</div>
              <div className="text-left">
                <h2 className="font-semibold text-foreground">Travel & Accommodation</h2>
                <p className="text-sm text-muted-foreground">Flight details and pickup</p>
              </div>
            </div>
            {expandedSections.travel ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
         </button>

         {expandedSections.travel && (
            <div className="border-t border-border p-5 space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Departure Date</label>
                    <Input type="date" value={travelData.departureDate} onChange={(e) => handleTravelChange('departureDate', e.target.value)} className="bg-background"/>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Flight Number</label>
                    <Input placeholder="e.g. BA123" value={travelData.flightNumber} onChange={(e) => handleTravelChange('flightNumber', e.target.value)} className="bg-background"/>
                  </div>
               </div>
               <div className="p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                      <Plane className="w-5 h-5 text-cyan-600" />
                      <div>
                        <p className="font-medium text-foreground">Airport Pickup Service</p>
                        <p className="text-sm text-muted-foreground">Request pickup assistance</p>
                      </div>
                  </div>
                  <Switch checked={needsPickup} onCheckedChange={setNeedsPickup} />
               </div>
               <Button onClick={saveTravelDetails} className="w-full bg-cyan-600 text-white hover:bg-cyan-700">Save Travel Details</Button>
            </div>
         )}
      </div>

      {/* 4. Pre-Departure */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
         <button onClick={() => toggleSection('preDeparture')} className="w-full flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold text-sm">4</div>
               <h2 className="font-semibold text-foreground">Pre-Departure Packing</h2>
            </div>
            {expandedSections.preDeparture ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
         </button>

         {expandedSections.preDeparture && (
            <div className="border-t border-border p-5">
               <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-cyan-600"/> Packing Checklist</h3>
               <div className="space-y-3">
                  {packingItems.map((item, index) => (
                     <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border transition-colors hover:bg-muted/50">
                        <Checkbox id={`pack-${index}`} checked={item.checked} onCheckedChange={() => handlePackingToggle(index)} />
                        <label htmlFor={`pack-${index}`} className="text-sm cursor-pointer w-full select-none">{item.name}</label>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>

      {/* Dialogs (Upload, Form, View) - Same as before */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
           <DialogHeader><DialogTitle>Upload {selectedTask?.name}</DialogTitle></DialogHeader>
           <div className="py-4">
              <Input type="file" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} accept=".pdf,.jpg,.jpeg,.png"/>
           </div>
           <DialogFooter>
              <Button onClick={handleUpload}>Upload</Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
         <DialogContent>
            <DialogHeader><DialogTitle>{selectedTask?.name}</DialogTitle></DialogHeader>
            <div className="space-y-4">
               <p className="text-sm text-muted-foreground">Please complete the official form first.</p>
               <Button className="w-full" variant="outline" onClick={() => window.open(formUrls[selectedTask?.id || 0], '_blank')}>
                 <ExternalLink className="mr-2 h-4 w-4"/> Go to Official Site
               </Button>
               <Button className="w-full" onClick={handleFormComplete}>Mark as Completed</Button>
            </div>
         </DialogContent>
      </Dialog>

    </div>
  );
}