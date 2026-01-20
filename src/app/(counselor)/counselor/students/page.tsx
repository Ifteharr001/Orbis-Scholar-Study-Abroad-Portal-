"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Loader2, Eye, Calendar, User, Phone, Mail } from "lucide-react";

interface StudentProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  createdAt: string;
}

export default function CounselorStudentsPage() {
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch("/api/counselor/students", {
            cache: 'no-store'
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStudents(data.students);
            setFilteredStudents(data.students);
          }
        }
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Search Logic (Name or Email)
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerSearch) ||
        s.email.toLowerCase().includes(lowerSearch)
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Students</h1>
          <p className="text-muted-foreground">
            Total {students.length} unique students under your counseling.
          </p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search student by name or email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader className="p-0"></CardHeader>
        <CardContent className="p-0">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="pl-6">Student Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="text-right pr-6">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                No students found assigned to you.
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredStudents.map((student) => (
                            <TableRow key={student._id} className="hover:bg-muted/50 transition-colors">
                                <TableCell className="pl-6 font-medium">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={student.image} />
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                                {student.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium leading-none">{student.name}</p>
                                            <p className="text-xs text-muted-foreground mt-1 font-mono">
                                                ID: {student._id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                </TableCell>
                                
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Mail className="h-3.5 w-3.5" />
                                        {student.email}
                                    </div>
                                </TableCell>
                                
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Phone className="h-3.5 w-3.5" />
                                        {student.phone || "N/A"}
                                    </div>
                                </TableCell>
                                
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {new Date(student.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                
                                <TableCell className="text-right pr-6">
                                    <Link href={`/counselor/students/${student._id}`}>
                                        <Button variant="outline" size="sm">
                                            <User className="h-4 w-4 mr-2" /> View Profile
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
}