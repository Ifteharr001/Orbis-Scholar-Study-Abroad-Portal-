"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Loader2
} from "lucide-react";

interface Application {
  _id: string;
  applicationId: string;
  studentName: string;
  studentEmail: string;
  studentImage?: string;
  universityName: string;
  programName: string;
  intakePreference: string;
  status: string; 
  counselor?: string;
  createdAt: string;
  updatedAt: string;
  priority?: "high" | "medium" | "low";
}

const STAGE_CONFIG = [
  { label: "Applied", color: "bg-blue-600" },
  { label: "In Review", color: "bg-indigo-500" },
  { label: "Inquiry", color: "bg-slate-500" },
  { label: "Docs Pending", color: "bg-yellow-500" },
  { label: "Docs Verified", color: "bg-blue-500" },
  { label: "Submitted", color: "bg-purple-500" },
  { label: "Offer Received", color: "bg-green-500" },
  { label: "Visa Processing", color: "bg-orange-500" },
  { label: "Enrolled", color: "bg-emerald-600" },
  { label: "Rejected", color: "bg-red-500" },
];

export default function AllApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      
      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]); 

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    
    STAGE_CONFIG.forEach(stage => counts[stage.label] = 0);

    applications.forEach(app => {
      if (counts[app.status] !== undefined) {
        counts[app.status]++;
      } else {
        counts[app.status] = (counts[app.status] || 0) + 1;
      }
    });

    return STAGE_CONFIG.map(stage => ({
      ...stage,
      count: counts[stage.label] || 0
    }));
  }, [applications]);

  const filteredApplications = useMemo(() => {
    if (stageFilter === "all") return applications;
    return applications.filter(app => app.status === stageFilter);
  }, [applications, stageFilter]);


  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(a => a._id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedApplications(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const getStageColor = (stage: string) => {
    const s = stage ? stage.toLowerCase() : "";
    if (s.includes("offer")) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("reject")) return "bg-red-100 text-red-700 border-red-200";
    if (s.includes("review") || s.includes("process")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("submit")) return "bg-purple-100 text-purple-700 border-purple-200";
    if (s.includes("enroll")) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s.includes("doc")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (s === "applied") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-secondary text-secondary-foreground";
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
    
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Applications</h1>
          <p className="text-muted-foreground">Manage and track all student applications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Application
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`cursor-pointer hover:shadow-md transition-shadow ${stageFilter === stat.label ? "ring-2 ring-primary border-primary" : ""}`}
            onClick={() => setStageFilter(stageFilter === stat.label ? "all" : stat.label)}
          >
            <CardContent className="p-3 text-center">
              <div className={`w-2 h-2 rounded-full ${stat.color} mx-auto mb-2`} />
              <p className="text-xs text-muted-foreground truncate font-medium mb-1" title={stat.label}>
                {stat.label}
              </p>
              <p className="text-lg font-bold">{stat.count}</p> 
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by student, university, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {STAGE_CONFIG.map(stage => (
                  <SelectItem key={stage.label} value={stage.label}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0" onClick={() => fetchApplications()}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedApplications.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium">{selectedApplications.length} selected</span>
          <Button variant="outline" size="sm">Bulk Edit</Button>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredApplications.length > 0 && selectedApplications.length === filteredApplications.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[100px]">App ID</TableHead>
                  <TableHead className="min-w-[200px]">Student</TableHead>
                  <TableHead className="min-w-[180px]">University</TableHead>
                  <TableHead className="min-w-[150px]">Program</TableHead>
                  <TableHead className="min-w-[100px]">Intake</TableHead>
                  <TableHead className="min-w-[120px]">Stage</TableHead>
                  <TableHead className="min-w-[80px]">Priority</TableHead>
                  <TableHead className="min-w-[100px]">Applied Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading applications...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No applications found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app._id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedApplications.includes(app._id)}
                          onCheckedChange={() => toggleSelect(app._id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {app.applicationId || app._id.slice(-6).toUpperCase()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={app.studentImage} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {app.studentName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{app.studentName}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{app.universityName}</TableCell>
                      <TableCell className="text-sm">{app.programName}</TableCell>
                      <TableCell className="text-sm">{app.intakePreference || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getStageColor(app.status)}`}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs capitalize ${getPriorityColor(app.priority)}`}>
                          {app.priority || "Medium"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/admin/applications/${app._id}`}>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredApplications.length} applications
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
              <Button variant="outline" size="sm" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}