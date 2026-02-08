"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Plus, Trash2, GripVertical, Loader2
} from "lucide-react";
import { toast } from "sonner";

interface PipelineItem {
  _id: string;
  name: string;
  color: string;
  order: number;
}

const colors = [
  "#2563eb",
  "#16a34a", 
  "#dc2626", 
  "#d97706", 
  "#9333ea",
  "#0891b2", 
  "#475569",
];

export default function PipelinesPage() {
  const [pipelines, setPipelines] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [adding, setAdding] = useState(false);

  const fetchPipelines = async () => {
    try {
      const res = await fetch("/api/admin/settings/pipelines");
      const data = await res.json();
      if (data.success) {
        setPipelines(data.data);
      }
    } catch (error) {
      toast.error("Failed to load pipelines");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipelines();
  }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setAdding(true);

    try {
      const res = await fetch("/api/admin/settings/pipelines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, color: selectedColor }),
      });

      if (res.ok) {
        toast.success("Stage added successfully");
        setNewName("");
        fetchPipelines();
      } else {
        toast.error("Failed to add");
      }
    } catch (error) {
      toast.error("Error occurred");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will remove this stage form settings.")) return;

    try {
      const res = await fetch(`/api/admin/settings/pipelines?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Stage removed");
        setPipelines(prev => prev.filter(p => p._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto animate-in fade-in-50">
      
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pipeline Configuration</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Customize the application stages (e.g. Applied, Offer Received, Visa Approved).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Active Stages</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin h-6 w-6 text-muted-foreground" />
              </div>
            ) : pipelines.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                No stages configured yet.
              </div>
            ) : (
              <div className="space-y-3">
                {pipelines.map((item) => (
                  <div 
                    key={item._id} 
                    className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="cursor-move text-slate-300 group-hover:text-slate-500">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <div 
                        className="w-3 h-3 rounded-full ring-2 ring-offset-1 ring-white" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Create New Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Stage Name</label>
                <Input 
                  placeholder="e.g. Visa Processing" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase">Badge Color</label>
                <div className="flex flex-wrap gap-3 p-3 bg-slate-50 rounded-lg border">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full shadow-sm transition-all ${
                        selectedColor === c ? "ring-2 ring-offset-2 ring-slate-900 scale-110" : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <Button 
                className="w-full mt-2 bg-slate-900 hover:bg-slate-800" 
                onClick={handleAdd} 
                disabled={adding || !newName}
              >
                {adding ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Save Stage
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}