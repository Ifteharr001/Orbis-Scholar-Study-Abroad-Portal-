"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, FileText, ListTodo, UploadCloud, AlertCircle } from "lucide-react";

// ১. ডাটা টাইপ ডিফাইন করা
export interface DocumentItem {
  id?: string;
  name: string;
  status: "Verified" | "Pending" | "Rejected" | "Not Uploaded";
  feedback?: string; // রিজেকশন রিজন দেখানোর জন্য
}

export interface TaskItem {
  id?: string;
  name: string;
  status: "To Do" | "Done";
}

interface ChecklistProps {
  documents?: DocumentItem[];
  tasks?: TaskItem[];
}

// সফট কালার স্টাইল (Card & Timeline এর সাথে মিল রেখে)
const getDocumentStatusStyles = (status: string) => {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
    case "Pending":
      return "bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200";
    case "Rejected":
      return "bg-red-100 text-red-700 hover:bg-red-200 border-red-200";
    case "Not Uploaded":
    default:
      return "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200";
  }
};

const getTaskStatusStyles = (status: string) => {
  switch (status) {
    case "To Do":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "Done":
      return "bg-green-100 text-green-700 border-green-200";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const ChecklistDocuments = ({ documents = [], tasks = [] }: ChecklistProps) => {
  return (
    <div className="h-full flex flex-col">
      
      {/* --- Documents Section --- */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-primary/10 rounded-md">
             <FileText className="h-4 w-4 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Documents
          </h3>
        </div>
        
        <div className="space-y-3">
          {documents.length === 0 ? (
             <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No documents required yet.</p>
             </div>
          ) : (
            documents.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-background border border-border rounded-lg hover:shadow-sm transition-all group"
              >
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {doc.name}
                    </span>
                    {/* রিজেক্ট হলে ওয়ার্নিং মেসেজ */}
                    {doc.status === "Rejected" && (
                        <span className="text-[10px] text-red-500 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Please re-upload
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 border font-medium", getDocumentStatusStyles(doc.status))}>
                        {doc.status}
                    </Badge>
                    
                    {/* আপলোড বাটন (শুধুমাত্র যদি আপলোড না থাকে বা রিজেক্ট হয়) */}
                    {(doc.status === "Not Uploaded" || doc.status === "Rejected") && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                            <UploadCloud className="h-4 w-4" />
                        </Button>
                    )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* --- Tasks Section --- */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-blue-100 rounded-md">
             <ListTodo className="h-4 w-4 text-blue-600" />
          </div>
          <h3 className="text-base font-semibold text-foreground">
            Tasks for you
          </h3>
        </div>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
             <div className="text-center py-6 bg-muted/20 rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No pending tasks.</p>
             </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 px-4 bg-background border border-border rounded-lg hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-3">
                   {task.status === "Done" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                   ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors" />
                   )}
                   
                  <span className={cn(
                      "text-sm font-medium transition-colors",
                      task.status === "Done" ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                      {task.name}
                  </span>
                </div>
                
                <Badge variant="outline" className={cn("text-[10px] px-2 py-0.5 border font-medium", getTaskStatusStyles(task.status))}>
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