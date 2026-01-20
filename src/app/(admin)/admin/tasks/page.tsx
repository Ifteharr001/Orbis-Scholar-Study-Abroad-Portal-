"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Trash2, Plus, Calendar, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "Pending" | "In Progress" | "Completed";
  priority: "Low" | "Medium" | "High";
  dueDate?: string;
}

export default function MyTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Add Modal State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Tasks
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/admin/tasks");
      const result = await res.json();
      if (result.success) setTasks(result.data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Add Task
  const handleAddTask = async () => {
    if (!newTask.title) return toast.error("Title is required");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });
      
      if (res.ok) {
        toast.success("Task added!");
        setIsDialogOpen(false);
        setNewTask({ title: "", description: "", priority: "Medium", dueDate: "" });
        fetchTasks();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Toggle Status
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setTasks(prev => prev.map(t => t._id === id ? { ...t, status: newStatus as any } : t));

    try {
      await fetch("/api/admin/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
    } catch (error) {
      toast.error("Failed to update status");
      fetchTasks(); 
    }
  };

  // 4. Delete Task
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this task?")) return;
    
    setTasks(prev => prev.filter(t => t._id !== id)); 

    try {
      await fetch(`/api/admin/tasks?id=${id}`, { method: "DELETE" });
      toast.success("Task deleted");
    } catch (error) {
      toast.error("Failed to delete");
      fetchTasks();
    }
  };

  // Helpers
  const getPriorityColor = (p: string) => {
    if (p === "High") return "bg-red-100 text-red-700 border-red-200";
    if (p === "Medium") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  // Stats
  const completedCount = tasks.filter(t => t.status === "Completed").length;
  const pendingCount = tasks.length - completedCount;

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
          <p className="text-muted-foreground mt-1">
            You have <span className="font-bold text-primary">{pendingCount}</span> pending tasks.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add New Task
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
        <div 
          className="bg-green-500 h-full transition-all duration-500" 
          style={{ width: `${tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0}%` }}
        />
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {tasks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg text-muted-foreground">
                No tasks found. Create one to get started!
            </div>
        ) : (
            tasks.map((task) => (
            <Card key={task._id} className={`transition-all hover:shadow-md ${task.status === "Completed" ? "opacity-60 bg-muted/20" : ""}`}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                
                {/* Left: Checkbox & Info */}
                <div className="flex items-start gap-4">
                    <button 
                        onClick={() => toggleStatus(task._id, task.status)}
                        className={`mt-1 transition-colors ${task.status === "Completed" ? "text-green-500" : "text-gray-300 hover:text-gray-400"}`}
                    >
                        {task.status === "Completed" ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                    </button>
                    
                    <div className="space-y-1">
                        <h3 className={`font-medium ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                            {task.title}
                        </h3>
                        {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                        
                        <div className="flex items-center gap-2 pt-1">
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </Badge>
                            {task.dueDate && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Delete */}
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(task._id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>

                </CardContent>
            </Card>
            ))
        )}
      </div>

      {/* Add Task Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
                <label className="text-sm font-medium mb-1 block">Task Title</label>
                <Input 
                    placeholder="What needs to be done?" 
                    value={newTask.title} 
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} 
                />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium mb-1 block">Priority</label>
                    <Select 
                        value={newTask.priority} 
                        onValueChange={(val) => setNewTask({ ...newTask, priority: val })}
                    >
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
                    <Input 
                        type="date" 
                        value={newTask.dueDate} 
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} 
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                <Textarea 
                    placeholder="Add extra details..." 
                    value={newTask.description} 
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} 
                />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTask} disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}