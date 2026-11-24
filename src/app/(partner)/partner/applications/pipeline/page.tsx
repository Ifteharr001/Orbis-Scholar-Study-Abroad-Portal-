"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowRight,
  Filter
} from "lucide-react";
import { toast } from "sonner";

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  applications: Application[];
}

interface Application {
  _id: string;
  studentName: string;
  university: string;
  program: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const initialStages: PipelineStage[] = [
  { id: "draft", name: "Draft", color: "bg-gray-100", applications: [] },
  { id: "submitted", name: "Submitted", color: "bg-blue-100", applications: [] },
  { id: "under-review", name: "Under Review", color: "bg-yellow-100", applications: [] },
  { id: "accepted", name: "Accepted", color: "bg-green-100", applications: [] },
  { id: "enrolled", name: "Enrolled", color: "bg-emerald-100", applications: [] },
  { id: "rejected", name: "Rejected", color: "bg-red-100", applications: [] },
];

const statusToStage: Record<string, string> = {
  "draft": "draft",
  "submitted": "submitted",
  "under review": "under-review",
  "accepted": "accepted",
  "enrolled": "enrolled",
  "rejected": "rejected",
  "waitlisted": "under-review",
  "deferred": "under-review",
  "withdrawn": "rejected",
};

export default function PartnerApplicationsPipelinePage() {
  const { data: session } = useSession();
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPipeline = async () => {
      try {
        const res = await fetch("/api/partner/applications?limit=100", {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setStages(initialStages);
          return;
        }

        const data = await res.json();
        const applications: Application[] = Array.isArray(data.applications) ? data.applications : [];

        // Organize applications into pipeline stages
        const newStages = initialStages.map(stage => ({
          ...stage,
          applications: applications.filter(app => statusToStage[app.status?.toLowerCase()] === stage.id)
        }));

        setStages(newStages);
      } catch (error) {
        console.error("Pipeline Load Error:", error);
        setStages(initialStages);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchPipeline();
    } else {
      setLoading(false);
    }
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft": return "bg-gray-100 text-gray-700";
      case "submitted": return "bg-blue-100 text-blue-700";
      case "under review": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-green-100 text-green-700";
      case "enrolled": return "bg-emerald-100 text-emerald-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "waitlisted": return "bg-orange-100 text-orange-700";
      case "deferred": return "bg-purple-100 text-purple-700";
      case "withdrawn": return "bg-slate-100 text-slate-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const totalApplications = stages.reduce((sum, stage) => sum + stage.applications.length, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Application Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">Visual overview of all applications across stages ({totalApplications} total)</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <Card key={stage.id} className="min-w-[320px] max-w-[320px] flex-shrink-0" style={{ backgroundColor: stage.color }}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold capitalize">{stage.name}</CardTitle>
                <Badge variant="secondary" className="text-[10px] h-5">
                  {stage.applications.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {stage.applications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No applications</p>
              ) : (
                <div className="space-y-3">
                  {stage.applications.map((app) => (
                    <div
                      key={app._id}
                      className="bg-card border rounded-lg p-3 hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{app.studentName}</p>
                          <p className="text-xs text-muted-foreground truncate">{app.university}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{app.program}</p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] h-4 ${getStatusColor(app.status)}`}>
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {totalApplications === 0 && (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="py-16 text-center">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-muted-foreground">No applications in pipeline</p>
            <p className="text-sm text-muted-foreground mt-1">Applications will appear here as students submit them</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}