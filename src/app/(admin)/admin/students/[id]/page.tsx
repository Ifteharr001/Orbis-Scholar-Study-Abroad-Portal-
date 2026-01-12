"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, 
  GraduationCap, MessageSquare, FileText, User, Edit, 
  ExternalLink, Download, Eye 
} from "lucide-react";

// ইন্টারফেস ডিফিনিশন
interface Application {
  _id: string;
  universityName: string;
  programName: string;
  status: string;
  appliedDate: string;
  applicationId?: string;
  intakePreference?: string;
}

// ✅ Document ইন্টারফেস আপডেট (আপনার মডেল অনুযায়ী)
interface StudentDocument {
  _id: string;
  name: string;      // যেমন: Passport
  fileName: string;  // যেমন: passport.pdf
  fileUrl: string;
  status: "Pending" | "Verified" | "Rejected";
  uploadedAt: string;
}

interface Conversation {
  id: number;
  sender: string;
  role: string;
  message: string;
  timestamp: string;
  isStudent: boolean;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  status: string;
  createdAt: string;
  image?: string;
  programPreference?: { degree: string; country: string };
  counselor?: { name: string; email: string; avatar?: string };
  applications?: Application[]; 
  documents?: StudentDocument[]; // ✅ অ্যারে টাইপ ঠিক করা হলো
  conversations?: Conversation[]; 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StudentDetailsPage({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.studentId || resolvedParams.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!id) return;

      try {
        const res = await fetch(`/api/admin/students/${id}`);
        
        if (!res.ok) {
           setLoading(false);
           return;
        }

        const data = await res.json();
        
        setStudent({
          ...data.student,
          applications: data.applications || [], 
          documents: data.documents || [], // ✅ API থেকে আসা ডকুমেন্টস সেট করা হলো
          conversations: [], 
          counselor: { name: "Not Assigned", email: "N/A" } 
        });
      } catch (error) {
        console.error("Error fetching student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [id, resolvedParams]);

  const getStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : "active";
    switch (s) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getAppStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : "";
    if (s.includes("offer")) return "bg-green-100 text-green-800 border-green-200";
    if (s.includes("reject")) return "bg-red-100 text-red-800 border-red-200";
    if (s.includes("review") || s.includes("process")) return "bg-blue-100 text-blue-800 border-blue-200";
    return "bg-secondary text-secondary-foreground";
  };

  // ✅ ডকুমেন্টস স্ট্যাটাস কালার
  const getDocStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "bg-green-100 text-green-700 border-green-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-2 h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <h2 className="text-xl font-semibold text-red-500">Student Not Found</h2>
        <Link href="/admin/students">
          <Button variant="outline">Go Back to List</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
       <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/students">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Student Details</h1>
            <p className="text-muted-foreground">View and manage student information</p>
          </div>
        </div>
        <Link href={`/admin/students/${id}/edit`}>
          <Button className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Student
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={student.image} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {student.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">{student.name}</h2>
                  <p className="text-muted-foreground">Student ID: {student._id.slice(-6).toUpperCase()}</p>
                </div>
                <Badge className={getStatusColor(student.status)}>{student.status || "Active"}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone || "N/A"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.city || "Unknown"}, {student.country || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="overview" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="applications" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Applications</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="conversations" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Conversations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{student.country || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Degree</p>
                    <p className="font-medium">{student.programPreference?.degree || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assigned Counselor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {student.counselor?.name.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.counselor?.name}</p>
                    <p className="text-sm text-muted-foreground">{student.counselor?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="mt-6">
          <Card>
             <CardContent className="p-6">
               {student.applications && student.applications.length > 0 ? (
                 <div className="space-y-4">
                   {student.applications.map((app) => (
                     <div key={app._id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-base">{app.universityName}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground/80">{app.programName}</span>
                            <span>•</span>
                            <span>{app.intakePreference || "N/A"}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">App ID: {app.applicationId || app._id.slice(-6).toUpperCase()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className={getAppStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          <Link href={`/admin/applications/${app._id}`}>
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-10 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <GraduationCap className="h-10 w-10 opacity-20" />
                    <p>No applications found for this student.</p>
                    <Button variant="outline" size="sm" className="mt-2">Create New Application</Button>
                 </div>
               )}
             </CardContent>
          </Card>
        </TabsContent>

        {/* ✅ Documents Tab - আপডেট করা হয়েছে */}
        <TabsContent value="documents" className="mt-6">
          <Card>
             <CardContent className="p-6">
               {student.documents && student.documents.length > 0 ? (
                 <div className="space-y-3">
                   {student.documents.map((doc) => (
                     <div key={doc._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <FileText className="h-5 w-5" />
                         </div>
                         <div>
                           <p className="font-medium text-sm">{doc.name}</p>
                           <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                         <Badge variant="outline" className={getDocStatusColor(doc.status)}>
                           {doc.status}
                         </Badge>
                         <p className="text-xs text-muted-foreground hidden md:block">
                           {new Date(doc.uploadedAt).toLocaleDateString()}
                         </p>
                         {/* ফাইল দেখার বা ডাউনলোড করার বাটন */}
                         {doc.fileUrl && (
                           <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                             <Button variant="ghost" size="icon">
                               <Eye className="h-4 w-4" />
                             </Button>
                           </Link>
                         )}
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-10 text-center text-muted-foreground flex flex-col items-center gap-2">
                    <FileText className="h-10 w-10 opacity-20" />
                    <p>No documents uploaded by this student yet.</p>
                    <Button variant="outline" size="sm" className="mt-2">Upload Document</Button>
                 </div>
               )}
             </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversations" className="mt-6">
          <Card>
             <CardContent className="py-10 text-center text-muted-foreground">
                No conversations yet. (Coming Soon)
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};