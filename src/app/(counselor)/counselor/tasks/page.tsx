"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Loader2, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedBy: string; 
}

export default function CounselorTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // ১. ডাটা ফেচিং
  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/counselor/tasks");
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    setUpdatingId(taskId);
    try {
      const res = await fetch("/api/counselor/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Task marked as ${newStatus}`);

        setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error updating task");
    } finally {
      setUpdatingId(null);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "High": return "bg-red-100 text-red-700 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-green-100 text-green-700 border-green-200";
    }
  };

  const getStatusIcon = (s: string) => {
    if (s === "Completed") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (s === "In Progress") return <Clock className="h-4 w-4 text-blue-600" />;
    return <AlertCircle className="h-4 w-4 text-slate-500" />;
  };

  if (loading) return <div className="flex h-[80vh] items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Tasks</h1>
        <p className="text-muted-foreground">Tasks assigned to you by the administration.</p>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
              <p>You have no pending tasks! Great job.</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task._id} className={`transition-all hover:shadow-md border-l-4 ${task.status === 'Completed' ? 'border-l-green-500 opacity-75' : 'border-l-blue-500'}`}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`font-semibold text-lg ${task.status === 'Completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h3>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">
                      {task.description || "No description provided."}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                      <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded">
                        <Calendar className="h-3 w-3" />
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Deadline"}
                      </div>
                      <div>
                        Assigned By: <span className="font-medium text-slate-700">{task.assignedBy}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start md:items-center min-w-[180px]">
                    <div className="w-full space-y-1">
                        <label className="text-xs font-medium text-muted-foreground ml-1">Current Status</label>
                        <Select 
                            value={task.status} 
                            onValueChange={(val) => handleStatusChange(task._id, val)}
                            disabled={updatingId === task._id}
                        >
                        <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                                {updatingId === task._id ? <Loader2 className="h-4 w-4 animate-spin" /> : getStatusIcon(task.status)}
                                <SelectValue />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}