"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { Plus, MoreHorizontal, Users, Trash2, Tag, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface Segment {
  _id: string;
  name: string;
  description: string;
  studentCount: number;
  conditions: string[];
  color: string;
  createdAt: string;
}

const StudentSegmentsPage = () => {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    color: "bg-blue-500",
    conditions: [] as string[]
  });

  const [condField, setCondField] = useState("Country");
  const [condValue, setCondValue] = useState("");

  const fetchSegments = async () => {
    try {
      const res = await fetch("/api/admin/students/segments"); 
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSegments(data.segments || []);
    } catch (error) {
      console.error("Failed to fetch segments", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const addCondition = () => {
    if (!condValue) return;
    const conditionString = `${condField} = ${condValue}`;
    if (!newSegment.conditions.includes(conditionString)) {
        setNewSegment({
            ...newSegment,
            conditions: [...newSegment.conditions, conditionString]
        });
    }
    setCondValue(""); 
  };

  const removeCondition = (index: number) => {
    const updated = [...newSegment.conditions];
    updated.splice(index, 1);
    setNewSegment({ ...newSegment, conditions: updated });
  };
  const handleCreateSegment = async () => {
    if (newSegment.conditions.length === 0) {
        toast.error("Please add at least one condition");
        return;
    }

    setCreating(true);
    try {
      const res = await fetch("/api/admin/students/segments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSegment),
      });

      if (res.ok) {
        toast.success("Segment Created Successfully");
        setCreateDialogOpen(false);
        setNewSegment({ name: "", description: "", color: "bg-blue-500", conditions: [] });
        fetchSegments(); 
      } else {
        toast.error("Failed to create segment");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSegment = async (id: string) => {
 
    if (!confirm("Are you sure you want to delete this segment?")) return;

    try {
        const res = await fetch(`/api/admin/students/segments?id=${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            toast.success("Segment Deleted");
           
            setSegments(segments.filter((seg) => seg._id !== id));
        } else {
            toast.error("Failed to delete segment");
        }
    } catch (error) {
        toast.error("Error deleting segment");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <DialogDescription>Define criteria to filter students</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="segmentName">Segment Name</Label>
                <Input
                  id="segmentName"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                  placeholder="e.g., Indian Students"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="segmentDescription">Description</Label>
                <Input
                  id="segmentDescription"
                  value={newSegment.description}
                  onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                  placeholder="e.g., Students from India"
                />
              </div>
              <div className="space-y-2">
                <Label>Color Code</Label>
                <Select
                  value={newSegment.color}
                  onValueChange={(value) => setNewSegment({ ...newSegment, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-blue-500">Blue</SelectItem>
                    <SelectItem value="bg-green-500">Green</SelectItem>
                    <SelectItem value="bg-purple-500">Purple</SelectItem>
                    <SelectItem value="bg-orange-500">Orange</SelectItem>
                    <SelectItem value="bg-red-500">Red</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 border p-3 rounded-md bg-muted/20">
                <Label>Add Conditions</Label>
                <div className="flex gap-2">
                    <Select value={condField} onValueChange={setCondField}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Country">Country</SelectItem>
                            <SelectItem value="Program">Program</SelectItem>
                            <SelectItem value="Intake">Intake</SelectItem>
                            <SelectItem value="Status">Status</SelectItem>
                            <SelectItem value="Counselor">Counselor</SelectItem>
                            <SelectItem value="Gender">Gender</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="flex items-center px-2 font-bold text-muted-foreground">=</div>
                    <Input 
                        value={condValue}
                        onChange={(e) => setCondValue(e.target.value)}
                        placeholder="Value (e.g. India)"
                        className="flex-1"
                    />
                    <Button type="button" onClick={addCondition} size="sm">Add</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                    {newSegment.conditions.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">No conditions added yet.</span>
                    )}
                    {newSegment.conditions.map((cond, idx) => (
                        <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                            {cond}
                            <div 
                                onClick={() => removeCondition(idx)}
                                className="cursor-pointer hover:bg-muted rounded-full p-0.5"
                            >
                                <X className="h-3 w-3" />
                            </div>
                        </Badge>
                    ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSegment} disabled={!newSegment.name || creating}>
                  {creating ? "Creating..." : "Create Segment"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {segments.map((segment) => (
          <Card key={segment._id} className="relative overflow-hidden hover:shadow-md transition-shadow">
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
                    <DropdownMenuItem 
                        className="gap-2 text-destructive cursor-pointer"
                        onClick={() => handleDeleteSegment(segment._id)}
                    >
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
                  <span className="text-2xl font-bold">{segment.studentCount || 0}</span>
                  <span className="text-sm text-muted-foreground">students</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {segment.conditions && segment.conditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    Created: {segment.createdAt ? new Date(segment.createdAt).toLocaleDateString() : "N/A"}
                  </span>
                  <Link href={`/admin/students?segment=${segment._id}`}>
                    <Button variant="outline" size="sm">
                        View Students
                    </Button>
                  </Link>
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