"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, FileText, ListTodo } from "lucide-react";

// ১. ডাটা টাইপ ডিফাইন করা (যাতে প্যারেন্ট থেকে সঠিক ডাটা আসে)
export interface DocumentItem {
  name: string;
  status: "Verified" | "Pending" | "Rejected" | "Not Uploaded";
}

export interface TaskItem {
  name: string;
  status: "To Do" | "Done";
}

interface ChecklistProps {
  documents?: DocumentItem[]; // অপশনাল, না থাকলে এরর দিবে না
  tasks?: TaskItem[];
}

const getDocumentStatusStyles = (status: string) => {
  switch (status) {
    case "Verified":
      return "bg-green-600/90 hover:bg-green-600 text-white border-transparent";
    case "Pending":
      return "bg-amber-500/90 hover:bg-amber-500 text-white border-transparent";
    case "Rejected":
      return "bg-red-500/90 hover:bg-red-500 text-white border-transparent";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const getTaskStatusStyles = (status: string) => {
  switch (status) {
    case "To Do":
      return "bg-blue-500/90 hover:bg-blue-500 text-white border-transparent";
    case "Done":
      return "bg-green-600/90 hover:bg-green-600 text-white border-transparent";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

const ChecklistDocuments = ({ documents = [], tasks = [] }: ChecklistProps) => {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Checklist & Documents
        </h2>
        <p className="text-sm text-muted-foreground">
          Track all your applications in one place.
        </p>
      </div>

      {/* Documents Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 pl-4 border-l-4 border-primary/50">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-base font-medium text-foreground">
            Documents
          </h3>
        </div>
        
        <div className="space-y-3">
          {documents.length === 0 ? (
             <p className="text-sm text-muted-foreground italic pl-4">No documents required yet.</p>
          ) : (
            documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-muted/30 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <span className="text-sm text-foreground/90 font-medium group-hover:text-primary transition-colors">
                  {doc.name}
                </span>
                <Badge className={cn("text-[10px] px-2 py-0.5 shadow-none", getDocumentStatusStyles(doc.status))}>
                  {doc.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tasks Section */}
      <div>
        <div className="flex items-center gap-2 mb-4 pl-4 border-l-4 border-blue-500/50">
          <ListTodo className="h-4 w-4 text-blue-500" />
          <h3 className="text-base font-medium text-foreground">
            Tasks for you
          </h3>
        </div>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
             <p className="text-sm text-muted-foreground italic pl-4">No pending tasks.</p>
          ) : (
            tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-muted/30 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                   {/* Task Icon Indicator */}
                   {task.status === "Done" ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                   ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                   )}
                  <span className={cn(
                      "text-sm font-medium transition-colors",
                      task.status === "Done" ? "text-muted-foreground line-through" : "text-foreground/90"
                  )}>
                      {task.name}
                  </span>
                </div>
                <Badge className={cn("text-[10px] px-2 py-0.5 shadow-none", getTaskStatusStyles(task.status))}>
                  {task.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChecklistDocuments;