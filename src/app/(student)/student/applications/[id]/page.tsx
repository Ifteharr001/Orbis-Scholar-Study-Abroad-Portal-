"use client";

import { use, useEffect, useState } from "react"; 
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Settings, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import ApplicationTimeline from "../../components/ApplicationTimeline";
import ChecklistDocuments from "../../components/ChecklistDocuments";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ApplicationData {
  _id: string;
  universityName: string;
  course: string;
  status: string;
  applicationId?: string;
}

export default function ApplicationDetailsPage({ params }: PageProps) {
  // ১. প্যারামস আন র‍্যাপ করা (Next.js 15)
  const { id } = use(params);
  
  // ২. স্টেট ম্যানেজমেন্ট
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ৩. ডাটা ফেচ করা
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/student/applications/${id}`);
        if (!res.ok) throw new Error("Failed to load application");
        const data = await res.json();
        setApplication(data);
      } catch (err) {
        setError("Could not find the application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // স্ট্যাটাস কালার লজিক
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Offer Received":
      case "Approved":
      case "Enrolled":
        return "bg-green-600 hover:bg-green-700 text-white border-none";
      case "Rejected":
        return "bg-red-600 hover:bg-red-700 text-white border-none";
      case "In Review":
      case "Visa Processing":
        return "bg-amber-500 hover:bg-amber-600 text-white border-none";
      default:
        return "bg-blue-500 hover:bg-blue-600 text-white";
    }
  };

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // এরর স্টেট
  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-lg font-medium text-muted-foreground">{error || "Application not found"}</p>
        <Button variant="outline" asChild>
          <Link href="/student/applications">Go Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-background border-border rounded-lg"
          />
        </div>
        <div className="flex justify-end w-full md:w-auto">
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Back Link */}
      <Link
        href="/student/applications"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Applications
      </Link>

      {/* 1. Header Card */}
      <Card className="border-border shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {application.universityName}
              </h1>
              <p className="text-sm text-muted-foreground mb-1">
                Program: <span className="font-medium text-foreground">{application.course}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                 Application ID: {application.applicationId || application._id}
              </p>
            </div>
            <Badge className={cn("text-sm px-3 py-1 w-fit", getStatusStyles(application.status))}>
              {application.status}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* 2. Application Timeline (Dynamic Status Passed) */}
      <Card className="border-border shadow-sm mb-6">
        <CardContent className="p-6">
          {/* এখানে আমরা DB থেকে পাওয়া স্ট্যাটাস পাঠিয়ে দিচ্ছি */}
          <ApplicationTimeline currentStatus={application.status} />
        </CardContent>
      </Card>

      {/* 3. Checklist & Documents */}
      <Card className="border-border shadow-sm">
        <CardContent className="p-6">
          {/* ফিউচারে এখানে DB থেকে ডকুমেন্ট লিস্ট পাঠানো হবে, আপাতত খালি অ্যারে যাচ্ছে */}
          <ChecklistDocuments documents={[]} tasks={[]} />
        </CardContent>
      </Card>

    </div>
  );
}