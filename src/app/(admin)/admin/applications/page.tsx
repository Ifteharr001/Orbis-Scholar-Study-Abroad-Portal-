"use client"; // 1. Client side interactivity-r jonno eti mandatory

import { useState } from "react";
import Link from "next/link"; // 2. react-router-dom er bodole next/link
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Plus 
} from "lucide-react";

// Types
interface Application {
  id: string;
  studentName: string;
  studentEmail: string;
  university: string;
  program: string;
  intake: string;
  stage: string;
  counselor: string;
  submittedDate: string;
  lastUpdated: string;
  priority: "high" | "medium" | "low";
}

// Mock Data
const applications: Application[] = [
  { id: "APP-001", studentName: "Rahim Ahmed", studentEmail: "rahim@email.com", university: "University of Toronto", program: "Computer Science", intake: "Fall 2025", stage: "Docs Pending", counselor: "Sarah Khan", submittedDate: "2025-01-02", lastUpdated: "2025-01-06", priority: "high" },
  { id: "APP-002", studentName: "Fatima Hassan", studentEmail: "fatima@email.com", university: "McGill University", program: "Business Admin", intake: "Fall 2025", stage: "Inquiry", counselor: "Ahmed Ali", submittedDate: "2025-01-03", lastUpdated: "2025-01-05", priority: "medium" },
  { id: "APP-003", studentName: "Karim Uddin", studentEmail: "karim@email.com", university: "University of British Columbia", program: "Engineering", intake: "Winter 2025", stage: "Docs Verified", counselor: "Sarah Khan", submittedDate: "2025-01-01", lastUpdated: "2025-01-07", priority: "high" },
  { id: "APP-004", studentName: "Nasreen Begum", studentEmail: "nasreen@email.com", university: "University of Melbourne", program: "Data Science", intake: "Fall 2025", stage: "Submitted", counselor: "Ahmed Ali", submittedDate: "2024-12-28", lastUpdated: "2025-01-04", priority: "medium" },
  { id: "APP-005", studentName: "Imran Hossain", studentEmail: "imran@email.com", university: "University of Sydney", program: "MBA", intake: "Fall 2025", stage: "Offer Received", counselor: "Sarah Khan", submittedDate: "2024-12-20", lastUpdated: "2025-01-03", priority: "low" },
  { id: "APP-006", studentName: "Ayesha Rahman", studentEmail: "ayesha@email.com", university: "University of Oxford", program: "Law", intake: "Fall 2025", stage: "Visa Processing", counselor: "Ahmed Ali", submittedDate: "2024-12-15", lastUpdated: "2025-01-02", priority: "high" },
  { id: "APP-007", studentName: "Tariq Islam", studentEmail: "tariq@email.com", university: "University of Cambridge", program: "Medicine", intake: "Fall 2025", stage: "Enrolled", counselor: "Sarah Khan", submittedDate: "2024-11-10", lastUpdated: "2025-01-01", priority: "high" },
  { id: "APP-008", studentName: "Sadia Akter", studentEmail: "sadia@email.com", university: "Harvard University", program: "Economics", intake: "Fall 2025", stage: "Inquiry", counselor: "Ahmed Ali", submittedDate: "2025-01-05", lastUpdated: "2025-01-06", priority: "medium" },
];

const stageStats = [
  { label: "Inquiry", count: 2, color: "bg-slate-500" },
  { label: "Docs Pending", count: 1, color: "bg-yellow-500" },
  { label: "Docs Verified", count: 1, color: "bg-blue-500" },
  { label: "Submitted", count: 1, color: "bg-purple-500" },
  { label: "Offer Received", count: 1, color: "bg-green-500" },
  { label: "Visa Processing", count: 1, color: "bg-orange-500" },
  { label: "Enrolled", count: 1, color: "bg-emerald-600" },
];

const getStageColor = (stage: string) => {
  switch (stage) {
    case "Inquiry": return "bg-slate-100 text-slate-700 border-slate-200";
    case "Docs Pending": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "Docs Verified": return "bg-blue-100 text-blue-700 border-blue-200";
    case "Submitted": return "bg-purple-100 text-purple-700 border-purple-200";
    case "Offer Received": return "bg-green-100 text-green-700 border-green-200";
    case "Visa Processing": return "bg-orange-100 text-orange-700 border-orange-200";
    case "Enrolled": return "bg-emerald-100 text-emerald-700 border-emerald-200";
    default: return "bg-muted text-muted-foreground";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "bg-red-100 text-red-700";
    case "medium": return "bg-yellow-100 text-yellow-700";
    case "low": return "bg-green-100 text-green-700";
    default: return "bg-muted text-muted-foreground";
  }
};

const AllApplicationsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === "all" || app.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map(a => a.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedApplications(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {stageStats.map((stat) => (
          <Card
            key={stat.label}
            className={`cursor-pointer hover:shadow-md transition-shadow ${stageFilter === stat.label ? "ring-2 ring-primary" : ""}`}
            onClick={() => setStageFilter(stageFilter === stat.label ? "all" : stat.label)}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stat.color}`} />
                <span className="text-xs text-muted-foreground truncate">{stat.label}</span>
              </div>
              <p className="text-xl font-bold mt-1">{stat.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
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
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="Inquiry">Inquiry</SelectItem>
                <SelectItem value="Docs Pending">Docs Pending</SelectItem>
                <SelectItem value="Docs Verified">Docs Verified</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Offer Received">Offer Received</SelectItem>
                <SelectItem value="Visa Processing">Visa Processing</SelectItem>
                <SelectItem value="Enrolled">Enrolled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Actions */}
      {selectedApplications.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-primary/10 rounded-lg animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-medium">{selectedApplications.length} selected</span>
          <Button variant="outline" size="sm">Bulk Edit</Button>
          <Button variant="outline" size="sm">Export Selected</Button>
          <Button variant="destructive" size="sm">Delete</Button>
        </div>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="min-w-[80px]">ID</TableHead>
                  <TableHead className="min-w-[200px]">Student</TableHead>
                  <TableHead className="min-w-[180px]">University</TableHead>
                  <TableHead className="min-w-[120px]">Program</TableHead>
                  <TableHead className="min-w-[100px]">Intake</TableHead>
                  <TableHead className="min-w-[120px]">Stage</TableHead>
                  <TableHead className="min-w-[80px]">Priority</TableHead>
                  <TableHead className="min-w-[120px]">Counselor</TableHead>
                  <TableHead className="min-w-[100px]">Last Updated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No applications found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApplications.map((app) => (
                    <TableRow key={app.id} className="hover:bg-muted/50">
                      <TableCell>
                        <Checkbox
                          checked={selectedApplications.includes(app.id)}
                          onCheckedChange={() => toggleSelect(app.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-xs">{app.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {app.studentName.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{app.studentName}</p>
                            <p className="text-xs text-muted-foreground truncate">{app.studentEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{app.university}</TableCell>
                      <TableCell className="text-sm">{app.program}</TableCell>
                      <TableCell className="text-sm">{app.intake}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs ${getStageColor(app.stage)}`}>
                          {app.stage}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-xs capitalize ${getPriorityColor(app.priority)}`}>
                          {app.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{app.counselor}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{app.lastUpdated}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* Updated Next.js Link */}
                            <Link href={`/admin/applications/${app.id}`}>
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

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredApplications.length} of {applications.length} applications
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllApplicationsPage;