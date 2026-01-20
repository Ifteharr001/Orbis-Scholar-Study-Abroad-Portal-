"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Loader2, ArrowLeft, Mail, Phone, MapPin, Calendar, 
  GraduationCap, FileText, User, Edit, 
  ExternalLink, Eye, Briefcase, ShieldCheck, UserPlus
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

interface StudentDocument {
  _id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  status: "Pending" | "Verified" | "Rejected";
  uploadedAt: string;
  feedback?: string;
}

interface Counselor {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  country?: string;
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
  counselor?: Counselor;
  applications?: Application[]; 
  documents?: StudentDocument[]; 
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function StudentDetailsPage({ params }: { params: Promise<any> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.studentId || resolvedParams.id;

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  // Counselor Assignment States
  const [counselorsList, setCounselorsList] = useState<Counselor[]>([]);
  const [isCounselorDialogOpen, setIsCounselorDialogOpen] = useState(false);
  const [assigningCounselor, setAssigningCounselor] = useState(false);

  // ১. স্টুডেন্ট ডাটা আনা
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
        documents: data.documents || [], 
      });
    } catch (error) {
      console.error("Error fetching student:", error);
    } finally {
      setLoading(false);
    }
  };

  // ২. কাউন্সিলর লিস্ট আনা
  const fetchCounselors = async () => {
    try {
      const res = await fetch(`/api/admin/counselor?role=counselor`); 
      const data = await res.json();
      if (res.ok) {
        setCounselorsList(data);
      }
    } catch (error) {
      console.error("Failed to fetch counselors:", error);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchCounselors();
  }, [id, resolvedParams]);

  // ৩. কাউন্সিলর অ্যাসাইন করার ফাংশন
  const handleAssignCounselor = async (counselorId: string) => {
    const selectedCounselor = counselorsList.find((c) => c._id === counselorId);
    if (!selectedCounselor) return;

    setAssigningCounselor(true);
    try {
        // স্টুডেন্ট আপডেটের জন্য API কল (আপনার API স্ট্রাকচার অনুযায়ী)
        const res = await fetch(`/api/admin/students/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "assign_counselor",
                counselorId: selectedCounselor._id,
            })
        });

        if (res.ok) {
            toast.success(`Counselor Assigned: ${selectedCounselor.name}`);
            setStudent((prev) => prev ? ({ ...prev, counselor: selectedCounselor }) : null);
            setIsCounselorDialogOpen(false);
        } else {
            toast.error("Failed to assign counselor");
        }
    } catch (error) {
        toast.error("Error assigning counselor");
        console.error(error);
    } finally {
        setAssigningCounselor(false);
    }
  };


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
          {/* ✅ Conversations ট্যাবটি এখন Counselor ট্যাবে পরিবর্তন করা হয়েছে */}
          <TabsTrigger value="counselor" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Counselor</span>
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
                      {student.counselor?.name ? student.counselor.name.slice(0, 1) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{student.counselor?.name || "Not Assigned"}</p>
                    <p className="text-sm text-muted-foreground">{student.counselor?.email || "N/A"}</p>
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
                 </div>
               )}
             </CardContent>
          </Card>
        </TabsContent>

        {/* ✅ Counselor Tab (Updated Design & Assign Logic) */}
        <TabsContent value="counselor" className="mt-6">
            <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="bg-gray-100 p-6">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Briefcase className="h-5 w-5" /> Counselor Profile
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {student.counselor && typeof student.counselor === 'object' && student.counselor.email !== "N/A" ? (
                        <div className="flex flex-col md:flex-row">
                            {/* Left Side: Avatar & Main Info */}
                            <div className="md:w-1/3 bg-muted/30 p-8 flex flex-col items-center text-center border-b md:border-b-0 md:border-r">
                                <div className="relative mb-4">
                                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                        <AvatarImage src={student.counselor.image} alt={student.counselor.name} />
                                        <AvatarFallback className="text-4xl bg-indigo-100 text-indigo-600 font-bold">
                                            {student.counselor.name?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white" title="Active"></div>
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-800">{student.counselor.name}</h3>
                                <p className="text-sm text-indigo-600 font-medium mb-4">Assigned Counselor</p>
                                
                                <div className="flex gap-2 w-full max-w-xs">
                                    <Button size="sm" variant="outline" className="flex-1 w-full text-white bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsCounselorDialogOpen(true)}>
                                        <Edit className="h-3 w-3 mr-2" /> Reassign
                                    </Button>
                                </div>
                            </div>

                            {/* Right Side: Detailed Stats */}
                            <div className="md:w-2/3 p-8">
                                <h4 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-700">
                                    <ShieldCheck className="h-5 w-5 text-green-600" /> Professional Details
                                </h4>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                            <Mail className="h-3.5 w-3.5" /> Email Address
                                        </p>
                                        <p className="font-medium text-gray-900">{student.counselor.email}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                            <Phone className="h-3.5 w-3.5" /> Phone Number
                                        </p>
                                        <p className="font-medium text-gray-900">{student.counselor.phone || "Not Provided"}</p>
                                    </div>

                                    <div className="space-y-1">
                                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5" /> Location
                                        </p>
                                        <p className="font-medium text-gray-900">{student.counselor.country || "Global"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        // No Counselor State
                        <div className="flex flex-col items-center justify-center py-16 text-center bg-muted/10">
                            <div className="h-24 w-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
                                <UserPlus className="h-10 w-10 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Unassigned Student</h3>
                            <p className="text-muted-foreground max-w-md mx-auto mb-6 mt-2">
                                This student is currently not assigned to any counselor. Assign one to start processing.
                            </p>
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200" onClick={() => setIsCounselorDialogOpen(true)}>
                                <UserPlus className="mr-2 h-5 w-5" /> Assign Counselor Now
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Counselor Dialog (Now in Student Page) */}
      <Dialog open={isCounselorDialogOpen} onOpenChange={setIsCounselorDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Assign Counselor</DialogTitle>
                <DialogDescription>Select a counselor from the list below.</DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto py-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {counselorsList.map((counselor) => (
                            <TableRow key={counselor._id} className="hover:bg-muted/50">
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback>{counselor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {counselor.name}
                                </TableCell>
                                <TableCell>{counselor.email}</TableCell>
                                <TableCell>{counselor.phone || "N/A"}</TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="sm" 
                                        variant={student.counselor?._id === counselor._id ? "secondary" : "default"}
                                        disabled={assigningCounselor || student.counselor?._id === counselor._id}
                                        onClick={() => handleAssignCounselor(counselor._id)} 
                                    >
                                        {student.counselor?._id === counselor._id ? "Assigned" : (assigningCounselor ? "..." : "Assign")}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsCounselorDialogOpen(false)}>Close</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};