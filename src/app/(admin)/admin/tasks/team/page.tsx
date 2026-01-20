"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Calendar, Loader2, Users, User as UserIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: "partner" | "counselor" | "staff";
  image?: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedToName: string;
  assignedToRole: string;
}

export default function TeamTasksPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal & Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/tasks/team");
      const data = await res.json();
      if (data.success) {
        setMembers(data.teamMembers);
        setTasks(data.tasks);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handle Member Selection (Multi-select)
  const toggleMember = (member: TeamMember) => {
    if (selectedMembers.find(m => m._id === member._id)) {
      setSelectedMembers(prev => prev.filter(m => m._id !== member._id));
    } else {
      setSelectedMembers(prev => [...prev, member]);
    }
  };

  // 3. Assign Task
  const handleAssignTask = async () => {
    if (!newTask.title || selectedMembers.length === 0) {
        return toast.error("Please enter a title and select at least one member");
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/tasks/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newTask,
            assignees: selectedMembers // পুরো অবজেক্ট পাঠানো হচ্ছে
        }),
      });

      if (res.ok) {
        toast.success(`Task assigned to ${selectedMembers.length} member(s)`);
        setIsDialogOpen(false);
        setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
        setSelectedMembers([]);
        fetchData(); // রিফ্রেশ
      } else {
        toast.error("Failed to assign task");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Delete Task
  const handleDelete = async (id: string) => {
    if(!confirm("Revoke this task?")) return;
    try {
        await fetch(`/api/admin/tasks/team?id=${id}`, { method: "DELETE" });
        setTasks(prev => prev.filter(t => t._id !== id));
        toast.success("Task revoked");
    } catch (error) {
        toast.error("Failed to delete");
    }
  };

  // Helpers
  const getRoleBadge = (role: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const colors: any = { partner: "bg-purple-100 text-purple-700", counselor: "bg-blue-100 text-blue-700", staff: "bg-orange-100 text-orange-700" };
    return <Badge className={colors[role] || "bg-gray-100"}>{role}</Badge>;
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Assignments</h1>
          <p className="text-muted-foreground">Assign tasks to partners, counselors, and staff.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Assign New Task
        </Button>
      </div>

      {/* Task List Table */}
      <Card>
        <CardHeader>
            <CardTitle>Assigned Tasks ({tasks.length})</CardTitle>
            <CardDescription>Track tasks you have assigned to your team.</CardDescription>
        </CardHeader>
        <CardContent>
            {tasks.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-md">
                    No active assignments found.
                </div>
            ) : (
                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task._id} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-sm transition-all">
                            <div className="flex gap-4 items-start">
                                <div className="mt-1 bg-primary/10 p-2 rounded-full text-primary">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{task.title}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        Assigned to: <span className="font-medium text-foreground">{task.assignedToName}</span>
                                        {getRoleBadge(task.assignedToRole)}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2 text-xs">
                                        <Badge variant="outline">{task.priority} Priority</Badge>
                                        <Badge variant={task.status === "Completed" ? "default" : "secondary"}>
                                            {task.status}
                                        </Badge>
                                        {task.dueDate && (
                                            <span className="flex items-center gap-1 text-muted-foreground">
                                                <Calendar className="h-3 w-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(task._id)} className="text-red-400 hover:text-red-600">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </CardContent>
      </Card>

      {/* Assign Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Task to Team</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            
            {/* Left: Task Details */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Task Title</label>
                    <Input 
                        placeholder="Task title..." 
                        value={newTask.title} 
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})} 
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Details</label>
                    <Textarea 
                        placeholder="Instructions..." 
                        value={newTask.description} 
                        onChange={(e) => setNewTask({...newTask, description: e.target.value})} 
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-sm font-medium mb-1 block">Priority</label>
                        <Select value={newTask.priority} onValueChange={(val) => setNewTask({...newTask, priority: val})}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Due Date</label>
                        <Input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
                    </div>
                </div>
            </div>

            {/* Right: Select Members */}
            <div className="border rounded-md p-4 bg-muted/20 flex flex-col h-full max-h-[350px]">
                <h4 className="font-semibold mb-3 flex items-center justify-between">
                    Select Assignees 
                    <Badge variant="secondary">{selectedMembers.length} selected</Badge>
                </h4>
                <div className="space-y-2 overflow-y-auto flex-1 pr-2">
                    {members.map(member => (
                        <div 
                            key={member._id} 
                            onClick={() => toggleMember(member)}
                            className={`flex items-center gap-3 p-2 rounded-md border cursor-pointer transition-all ${
                                selectedMembers.find(m => m._id === member._id) 
                                ? "bg-primary/10 border-primary" 
                                : "bg-card hover:bg-muted"
                            }`}
                        >
                            <Checkbox checked={!!selectedMembers.find(m => m._id === member._id)} />
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={member.image} />
                                <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{member.name}</p>
                                <div className="flex items-center gap-1">
                                    <Badge variant="outline" className="text-[10px] h-4 px-1">{member.role}</Badge>
                                    <span className="text-xs text-muted-foreground truncate">{member.email}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTask} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Assign Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}