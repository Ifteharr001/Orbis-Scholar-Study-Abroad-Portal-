"use client";

import { use, useEffect, useState } from "react"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
    ArrowLeft, Loader2, AlertCircle, Hash, 
    CheckCircle2, XCircle, GraduationCap, Building2,
    Check, ExternalLink, Loader
} from "lucide-react";
import { cn } from "@/lib/utils";
import ChecklistDocuments from "../../components/ChecklistDocuments"; 

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ApplicationData {
  _id: string;
  universityName: string;
  programName: string;
  status: string;
  applicationId?: string;
  appliedDate?: string;
}

const TIMELINE_STEPS = [
    { label: "Application Received", statusMatch: ["Applied", "New Applied"], description: "We have received your application." },
    { label: "Inquiry In Progress", statusMatch: ["Inquiry"], description: "We are verifying your initial details." },
    { label: "Under Review", statusMatch: ["In Review", "Docs Pending"], description: "Your documents are being reviewed by our team." },
    { label: "Documents Verified", statusMatch: ["Docs Verified"], description: "All documents have been verified successfully." },
    { label: "Submitted to University", statusMatch: ["Submitted"], description: "Application submitted to the university portal." },
    { label: "Offer Received", statusMatch: ["Offer Received", "Conditional Offer", "Approved"], description: "Congratulations! The university has issued an offer." },
    { label: "Visa Processing", statusMatch: ["Visa Processing", "Visa Lodged"], description: "Visa application process has started." },
    { label: "Enrolled", statusMatch: ["Enrolled"], description: "Successfully enrolled in the program." }
];

const REQUIRED_DOCUMENTS_LIST = [
    { _id: "1", name: "Passport Copy", status: "Required", fileName: "Pending Upload" },
    { _id: "2", name: "Academic Transcript", status: "Required", fileName: "Pending Upload" },
    { _id: "3", name: "Higher Secondary Certificate", status: "Required", fileName: "Pending Upload" },
    { _id: "4", name: "English Proficiency Test", status: "Optional", fileName: "Optional" },
];

export default function ApplicationDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/student/applications/${id}`);
        
        if (!res.ok) {
            if (res.status === 404) throw new Error("Application not found");
            throw new Error("Failed to load application");
        }

        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error(err);
        setError("Could not load the application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const getStatusColor = (status: string) => {
    if (["Offer Received", "Enrolled", "Approved"].includes(status)) return "text-green-600 bg-green-50 border-green-200";
    if (["Rejected"].includes(status)) return "text-red-600 bg-red-50 border-red-200";
    if (["Visa Processing"].includes(status)) return "text-purple-600 bg-purple-50 border-purple-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const getCurrentStepIndex = (status: string) => {
      if (status === "Rejected") return -1;
      const index = TIMELINE_STEPS.findIndex(step => step.statusMatch.includes(status));
      return index !== -1 ? index : 0; 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Error Loading Application</h2>
        <Button variant="outline" asChild>
          <Link href="/student/applications">Back to List</Link>
        </Button>
      </div>
    );
  }

  const statusColorClass = getStatusColor(application.status);
  const currentStepIndex = getCurrentStepIndex(application.status);
  const isRejected = application.status === "Rejected";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      
      <Link href="/student/applications" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
        <ArrowLeft className="h-4 w-4" />
        Back to My Applications
      </Link>

      <Card className={cn("border shadow-sm overflow-hidden", statusColorClass.split(' ')[2])}>
        <div className={cn("h-2 w-full", isRejected ? "bg-red-500" : "bg-primary/80")} />
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-muted rounded-lg">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold text-foreground leading-tight">{application.universityName}</h1>
                    <p className="text-muted-foreground flex items-center gap-2 text-sm mt-1">
                        <GraduationCap className="h-4 w-4" /> {application.programName}
                    </p>
                 </div>
              </div>
              <div className="flex flex-wrap gap-3 text-sm pt-2">
                  <div className="flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md border border-border/50">
                      <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-mono text-foreground font-medium">
                        {application.applicationId || application._id.slice(-6).toUpperCase()}
                      </span>
                  </div>
              </div>
            </div>
            <div className={cn("flex flex-col items-end gap-2 p-4 rounded-lg border min-w-[200px]", statusColorClass)}>
                <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Current Status</span>
                <span className="text-lg font-bold">{application.status}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
              <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg">Application Status Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                    {isRejected ? (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800">
                            <XCircle className="h-6 w-6" />
                            <div>
                                <p className="font-semibold">Application Rejected</p>
                                <p className="text-sm">Unfortunately, this application has been rejected. Please contact support for details.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="relative pl-4 ml-2 space-y-8 before:absolute before:inset-0 before:ml-2 before:h-full before:w-0.5 before:-translate-x-1/2 before:bg-muted before:content-['']">
                            
                            {TIMELINE_STEPS.map((step, index) => {
                                const isCompleted = index < currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const isFuture = index > currentStepIndex;

                                return (
                                    <div key={index} className="relative flex gap-4 items-start group">
                                        <div className={cn(
                                            "absolute left-0 -translate-x-[calc(50%+8px)] ml-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-background transition-all",
                                            isCompleted ? "border-primary bg-primary text-primary-foreground" :
                                            isCurrent ? "border-primary ring-4 ring-primary/20 text-primary scale-110" :
                                            "border-muted text-muted-foreground"
                                        )}>
                                            {isCompleted ? <Check className="h-4 w-4" /> : 
                                             isCurrent ? <Loader2 className="h-4 w-4 animate-spin" /> : 
                                             <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />}
                                        </div>

                                        <div className={cn("flex flex-col gap-1 -mt-1 pl-4 transition-all", isFuture && "opacity-50 grayscale")}>
                                            <h4 className={cn("font-semibold text-base", isCurrent ? "text-primary" : "text-foreground")}>
                                                {step.label}
                                            </h4>
                                            <p className="text-sm text-muted-foreground max-w-md">
                                                {step.description}
                                            </p>
                                            
                                            {isCurrent && (
                                                <span className="mt-2 inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                    Current Stage
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                 <CardHeader>
                    <CardTitle className="text-lg">Counselor Remarks</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="bg-muted/30 p-4 rounded-lg border border-dashed text-center">
                         <p className="text-sm text-muted-foreground">
                             No specific remarks added yet. You will be notified via email for any urgent actions.
                         </p>
                     </div>
                 </CardContent>
              </Card>
          </div>

          <div className="lg:col-span-1">
              <Card className="border-border shadow-sm h-full flex flex-col hover:border-primary/50 transition-colors">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Required Documents</CardTitle>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent className="flex-1">
                  
                  <div className="pointer-events-none">
                    <ChecklistDocuments 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        documents={REQUIRED_DOCUMENTS_LIST as any} 
                        tasks={[]} 
                    />
                  </div>
                  
                  <div className="mt-6">
                    <Button asChild className="w-full">
                        <Link href="/student/documents">
                             Manage & Upload Documents
                        </Link>
                    </Button>
                  </div>

                  <Separator className="my-6" />
                  
                  <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start" asChild>
                          <Link href="/student/messages">Contact Support</Link>
                      </Button>
                  </div>
                </CardContent>
              </Card>
          </div>
      </div>
    </div>
  );
}