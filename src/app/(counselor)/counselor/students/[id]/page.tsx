"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, Mail, Phone, Calendar, 
  ArrowLeft, Building2, ExternalLink, GraduationCap, AlertCircle 
} from "lucide-react";
import { toast } from "sonner"; 
import Image from "next/image";

interface Student {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    createdAt: string;
    notes?: string;
}

interface Application {
    _id: string;
    universityName: string;
    programName: string;
    applicationId?: string;
    appliedDate?: string;
    createdAt: string;
    status: string;
}

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.studentId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  
  const [student, setStudent] = useState<Student | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!studentId) return;

    const fetchStudentDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/counselor/students/${studentId}`, {
            cache: 'no-store'
        });
        
        const data = await res.json();

        if (res.ok && data.success) {
          setStudent(data.student);
          setApplications(data.applications || []); 
        } else {
          const errorMsg = data.error || "Failed to load student data";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false); 
      }
    };

    fetchStudentDetails();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col h-[80vh] items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading student profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <div className="bg-red-50 p-4 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-red-600">Error Loading Profile</h2>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/counselor/students">
            <Button variant="outline">Back to My Students</Button>
        </Link>
      </div>
    );
  }

  if (!student) {
    return <div className="p-10 text-center">Student not found.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6">
      
      <Link href="/counselor/students">
        <Button variant="ghost" size="sm" className="gap-2 mb-2">
            <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-1 h-fit shadow-md border-t-4 border-t-primary">
            <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 relative">
<Avatar className="h-32 w-32 border-4 border-muted relative overflow-hidden">
    {student.image ? (
        <div className="relative w-full h-full">
            <Image 
                src={student.image} 
                alt={student.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 128px"
            />
        </div>
    ) : (
        <AvatarFallback className="text-4xl bg-primary/10 text-primary w-full h-full flex items-center justify-center">
            {student.name?.charAt(0)}
        </AvatarFallback>
    )}
</Avatar>
                    <div className="absolute bottom-1 right-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white" title="Active"></div>
                </div>
                <CardTitle className="text-2xl">{student.name}</CardTitle>
                <CardDescription className="text-sm">Student ID: {student._id.slice(-6).toUpperCase()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                            <Mail className="h-4 w-4" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-muted-foreground">Email</p>
                            <p className="font-medium truncate" title={student.email}>{student.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                            <Phone className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Phone</p>
                            <p className="font-medium">{student.phone || "N/A"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                            <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Joined</p>
                            <p className="font-medium">{new Date(student.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div>
                    <h4 className="font-semibold mb-2 text-sm">Counselor Note</h4>
                    <div className="bg-muted/30 p-3 rounded-md text-sm text-muted-foreground italic min-h-[80px]">
                        {student.notes || "No general notes for this student."}
                    </div>
                </div>
            </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-6">
            <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <GraduationCap className="h-6 w-6 text-primary" />
                    Applications History
                </h2>
                <p className="text-muted-foreground text-sm">
                    Track all university applications for this student.
                </p>
            </div>

            {applications.length === 0 ? (
                <Card>
                    <CardContent className="p-10 text-center text-muted-foreground bg-muted/10 border-2 border-dashed">
                        No applications found for this student.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <Card key={app._id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
                            <CardContent className="p-5">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Building2 className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{app.universityName}</h3>
                                            <p className="text-sm text-muted-foreground">{app.programName}</p>
                                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                                                <Badge variant="outline" className="font-normal">
                                                    App ID: {app.applicationId || "N/A"}
                                                </Badge>
                                                <span>•</span>
                                                <span>Applied: {new Date(app.appliedDate || app.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        <Badge className={`px-3 py-1 ${
                                            app.status === 'Enrolled' ? 'bg-green-500' :
                                            app.status === 'Rejected' ? 'bg-red-500' :
                                            'bg-blue-500'
                                        }`}>
                                            {app.status}
                                        </Badge>
                                        
                                        <Link href={`/counselor/applications/${app._id}`}>
                                            <Button size="sm" variant="outline" className="gap-2">
                                                Manage Application <ExternalLink className="h-3 w-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>

      </div>
    </div>
  );
}