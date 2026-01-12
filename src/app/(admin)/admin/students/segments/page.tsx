"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Users, Edit, Trash2, Copy, Filter, Tag } from "lucide-react";
import { toast } from "sonner"; // Updated import for Sonner

const segments = [
  {
    id: "SEG001",
    name: "High Intent - MBA",
    description: "Students who showed interest in MBA programs with high engagement",
    studentCount: 245,
    conditions: ["Program = MBA", "Engagement > 70%", "Country = Bangladesh"],
    color: "bg-blue-500",
    createdAt: "2024-01-10",
  },
  {
    id: "SEG002",
    name: "UK Applicants",
    description: "Students applying to UK universities",
    studentCount: 189,
    conditions: ["Destination = UK", "Status = Active"],
    color: "bg-red-500",
    createdAt: "2024-01-12",
  },
  {
    id: "SEG003",
    name: "Scholarship Eligible",
    description: "Students eligible for scholarship programs",
    studentCount: 156,
    conditions: ["GPA > 3.5", "IELTS > 7.0", "Financial Need = Yes"],
    color: "bg-green-500",
    createdAt: "2024-01-15",
  },
  {
    id: "SEG004",
    name: "Fall 2024 Intake",
    description: "Students targeting Fall 2024 intake",
    studentCount: 312,
    conditions: ["Intake = Fall 2024", "Status = Active"],
    color: "bg-purple-500",
    createdAt: "2024-01-18",
  },
  {
    id: "SEG005",
    name: "Dormant Leads",
    description: "Students with no activity in last 30 days",
    studentCount: 78,
    conditions: ["Last Activity > 30 days", "Status != Enrolled"],
    color: "bg-yellow-500",
    createdAt: "2024-01-20",
  },
  {
    id: "SEG006",
    name: "Partner Referrals",
    description: "Students referred by partner agencies",
    studentCount: 134,
    conditions: ["Source = Partner", "Has Referral Code"],
    color: "bg-orange-500",
    createdAt: "2024-01-22",
  },
];

const StudentSegmentsPage = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
  });

  const handleCreateSegment = () => {
    // Updated toast syntax for Sonner
    toast.success("Segment Created", {
      description: `"${newSegment.name}" segment has been created successfully.`,
    });
    setCreateDialogOpen(false);
    setNewSegment({ name: "", description: "", color: "bg-blue-500" });
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Student Segments</h1>
          <p className="text-muted-foreground">Create and manage student segments for targeted actions</p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Segment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Segment</DialogTitle>
              <DialogDescription>
                Define a segment to group students based on specific criteria
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="segmentName">Segment Name</Label>
                <Input
                  id="segmentName"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                  placeholder="e.g., High Priority Leads"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segmentDescription">Description</Label>
                <Input
                  id="segmentDescription"
                  value={newSegment.description}
                  onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                  placeholder="Brief description of this segment"
                />
              </div>
              <div className="space-y-2">
                <Label>Segment Color</Label>
                <Select
                  value={newSegment.color}
                  onValueChange={(value) => setNewSegment({ ...newSegment, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-blue-500" /> Blue
                      </div>
                    </SelectItem>
                    <SelectItem value="bg-red-500">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-red-500" /> Red
                      </div>
                    </SelectItem>
                    <SelectItem value="bg-green-500">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-green-500" /> Green
                      </div>
                    </SelectItem>
                    <SelectItem value="bg-purple-500">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-purple-500" /> Purple
                      </div>
                    </SelectItem>
                    <SelectItem value="bg-yellow-500">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-yellow-500" /> Yellow
                      </div>
                    </SelectItem>
                    <SelectItem value="bg-orange-500">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 rounded bg-orange-500" /> Orange
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Filter className="h-4 w-4" />
                    <span>Conditions will be defined after creation</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSegment} disabled={!newSegment.name}>
                  Create Segment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => (
          <Card key={segment.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${segment.color}`} />
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Edit className="h-4 w-4" /> Edit Segment
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 cursor-pointer">
                      <Copy className="h-4 w-4" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription>{segment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{segment.studentCount}</span>
                  <span className="text-sm text-muted-foreground">students</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {segment.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Created: {segment.createdAt}
                  </span>
                  <Button variant="outline" size="sm">
                    View Students
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentSegmentsPage;