"use client"; // 1. Client Side Interactivity-r jonno mandatory

import { useState, DragEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, GripVertical, Calendar, Building2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner"; 

// Types
interface Application {
  id: string;
  studentName: string;
  studentAvatar?: string;
  university: string;
  program: string;
  intake: string;
  counselor: string;
  daysInStage: number;
  priority: "high" | "medium" | "low";
}

interface Stage {
  id: string;
  name: string;
  color: string;
  applications: Application[];
}

// Mock Data
const initialStages: Stage[] = [
  {
    id: "inquiry",
    name: "Inquiry",
    color: "bg-slate-500",
    applications: [
      { id: "1", studentName: "Rahim Ahmed", university: "University of Toronto", program: "Computer Science", intake: "Fall 2025", counselor: "Sarah Khan", daysInStage: 2, priority: "high" },
      { id: "2", studentName: "Fatima Hassan", university: "McGill University", program: "Business Admin", intake: "Fall 2025", counselor: "Ahmed Ali", daysInStage: 5, priority: "medium" },
    ]
  },
  {
    id: "docs_pending",
    name: "Docs Pending",
    color: "bg-yellow-500",
    applications: [
      { id: "3", studentName: "Karim Uddin", university: "University of British Columbia", program: "Engineering", intake: "Winter 2025", counselor: "Sarah Khan", daysInStage: 3, priority: "high" },
    ]
  },
  {
    id: "docs_verified",
    name: "Docs Verified",
    color: "bg-blue-500",
    applications: [
      { id: "4", studentName: "Nasreen Begum", university: "University of Melbourne", program: "Data Science", intake: "Fall 2025", counselor: "Ahmed Ali", daysInStage: 1, priority: "medium" },
      { id: "5", studentName: "Imran Hossain", university: "University of Sydney", program: "MBA", intake: "Fall 2025", counselor: "Sarah Khan", daysInStage: 4, priority: "low" },
    ]
  },
  {
    id: "submitted",
    name: "Submitted",
    color: "bg-purple-500",
    applications: [
      { id: "6", studentName: "Ayesha Rahman", university: "University of Oxford", program: "Law", intake: "Fall 2025", counselor: "Ahmed Ali", daysInStage: 7, priority: "high" },
    ]
  },
  {
    id: "offer_received",
    name: "Offer Received",
    color: "bg-green-500",
    applications: [
      { id: "7", studentName: "Tariq Islam", university: "University of Cambridge", program: "Medicine", intake: "Fall 2025", counselor: "Sarah Khan", daysInStage: 2, priority: "high" },
    ]
  },
  {
    id: "visa_processing",
    name: "Visa Processing",
    color: "bg-orange-500",
    applications: []
  },
  {
    id: "enrolled",
    name: "Enrolled",
    color: "bg-emerald-600",
    applications: []
  }
];

const ApplicationsPipelinePage = () => {
  const [stages, setStages] = useState<Stage[]>(initialStages);
  const [searchQuery, setSearchQuery] = useState("");
  const [draggedApp, setDraggedApp] = useState<{ app: Application; fromStageId: string } | null>(null);
  const [dragOverStageId, setDragOverStageId] = useState<string | null>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, app: Application, stageId: string) => {
    setDraggedApp({ app, fromStageId: stageId });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", app.id);
    
    // Add visual feedback (Optional: Next.js often handles this well without manual opacity, but keeping it for feel)
    if (e.currentTarget) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    setDraggedApp(null);
    setDragOverStageId(null);
    if (e.currentTarget) {
      e.currentTarget.style.opacity = "1";
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
    if (dragOverStageId !== stageId) {
        setDragOverStageId(stageId);
    }
  };

  const handleDragLeave = () => {
    setDragOverStageId(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, toStageId: string) => {
    e.preventDefault();
    setDragOverStageId(null);

    if (!draggedApp) return;
    if (draggedApp.fromStageId === toStageId) return;

    const { app, fromStageId } = draggedApp;

    // Update Local State
    setStages(prevStages => {
      return prevStages.map(stage => {
        // Remove from old stage
        if (stage.id === fromStageId) {
          return {
            ...stage,
            applications: stage.applications.filter(a => a.id !== app.id)
          };
        }
        // Add to new stage
        if (stage.id === toStageId) {
          return {
            ...stage,
            applications: [...stage.applications, { ...app, daysInStage: 0 }] // Reset days in stage on move
          };
        }
        return stage;
      });
    });

    // Show Success Toast
    const toStageName = stages.find(s => s.id === toStageId)?.name;
    toast.success("Application Moved", {
        description: `${app.studentName} has been moved to ${toStageName}.`
    });
    
    setDraggedApp(null);

    // TODO: Here you would typically make an API call to save the new stage
    // await updateApplicationStage(app.id, toStageId);
  };

  const filteredStages = stages.map(stage => ({
    ...stage,
    applications: stage.applications.filter(app =>
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.university.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }));

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Applications Pipeline</h1>
          <p className="text-muted-foreground">Drag and drop to move applications between stages</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Counselor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counselors</SelectItem>
              <SelectItem value="sarah">Sarah Khan</SelectItem>
              <SelectItem value="ahmed">Ahmed Ali</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search applications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Kanban Board Container */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-250px)]">
        {filteredStages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-[300px]"
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <Card className={`h-full bg-muted/30 transition-all duration-200 border-2 ${
                dragOverStageId === stage.id ? "border-primary bg-primary/5 shadow-md" : "border-transparent"
            }`}>
              <CardHeader className="pb-3 sticky top-0 bg-muted/30 backdrop-blur-sm z-10">
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
              <CardContent className="space-y-3 min-h-[200px]">
                {stage.applications.map((app) => (
                  <Card
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app, stage.id)}
                    onDragEnd={handleDragEnd}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 select-none bg-background"
                  >
                    <CardContent className="p-3 space-y-3">
                      {/* Drag Handle & Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 max-w-[85%]">
                          <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0 cursor-grab" />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={app.studentAvatar} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {app.studentName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{app.studentName}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.counselor}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Edit Application</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">Add Note</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive cursor-pointer">Archive</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Details */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Building2 className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{app.university}</span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate pl-4">{app.program}</p>
                      </div>

                      {/* Footer Info */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{app.intake}</span>
                        </div>
                        <Badge variant="outline" className={`text-xs capitalize ${getPriorityColor(app.priority)}`}>
                          {app.priority}
                        </Badge>
                      </div>

                      <div className="text-[10px] text-muted-foreground text-right">
                        {app.daysInStage} day{app.daysInStage !== 1 ? "s" : ""} in stage
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Empty State for Drop Zone */}
                {stage.applications.length === 0 && (
                  <div className={`flex items-center justify-center h-32 border-2 border-dashed rounded-lg transition-colors ${
                    dragOverStageId === stage.id ? "border-primary bg-primary/10" : "border-muted/50"
                  }`}>
                    <p className="text-sm text-muted-foreground">
                      {dragOverStageId === stage.id ? "Drop here" : "No applications"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPipelinePage;