"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // 👈 ১. Import
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, Download, MoreHorizontal, Eye, Trash2, UserPlus, Loader2, X } from "lucide-react";

// Interface
interface Student {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  status: string;
  createdAt: string;
  image?: string;
  programPreference?: { degree: string; country: string }; 
  applications?: { _id: string; programName: string; universityName: string }[];
}

const AllStudentsPage = () => {
  const searchParams = useSearchParams(); // 👈 ২. Hook Use
  const segmentId = searchParams.get("segment"); // URL থেকে 'segment' প্যারামিটার নেওয়া

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        // ৩. Query Params তৈরি
        const params = new URLSearchParams();
        if (segmentId) params.append("segment", segmentId); // সেগমেন্ট আইডি থাকলে পাঠানো হবে
        if (statusFilter !== "all") params.append("status", statusFilter); // স্ট্যাটাস ফিল্টার থাকলে পাঠানো হবে (API তে হ্যান্ডেল করতে হবে)

        const res = await fetch(`/api/admin/students?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setStudents(data.students);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [segmentId, statusFilter]); // segmentId চেঞ্জ হলে রি-ফেচ হবে

  // Client-side search filtering (API তেও করা যায়, এখানে সিম্পল রাখা হলো)
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    // Status filter API তে হ্যান্ডেল করলে এখানে আর দরকার নেই, তবে ডাবল চেকের জন্য রাখা যায়
    const matchesStatus = statusFilter === "all" || (student.status && student.status.toLowerCase() === statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const s = status ? status.toLowerCase() : "active";
    switch (s) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "blocked": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Students</h1>
          <p className="text-muted-foreground">Manage and view all registered students</p>
        </div>
        <Link href="/admin/students/new">
          <Button className="gap-2 w-full sm:w-auto">
            <UserPlus className="h-4 w-4" />
            Add New Student
          </Button>
        </Link>
      </div>

      {/* ৪. সেগমেন্ট ফিল্টার একটিভ থাকলে ব্যানার দেখানো */}
      {segmentId && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700">
          <span className="text-sm font-medium">Filtering by Segment ID: {segmentId}</span>
          <Link href="/admin/students">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-blue-100">
              <X className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Program / Applications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading students...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No students found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={student.image} alt={student.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {student.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {student._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{student.email}</p>
                          <p className="text-xs text-muted-foreground">{student.phone || "N/A"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{student.country || "N/A"}</TableCell>
                      
                      <TableCell className="max-w-[200px]">
                        {student.applications && student.applications.length > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="truncate font-medium text-sm">
                              {student.applications[0].programName}
                            </span>
                            {student.applications.length > 1 && (
                              <Badge variant="outline" className="text-xs px-1 py-0 h-5">
                                +{student.applications.length - 1}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            {student.programPreference?.degree || "Not set"}
                          </span>
                        )}
                      </TableCell>

                      <TableCell>
                        <Badge className={getStatusColor(student.status)} variant="secondary">
                          {student.status || "active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/admin/students/${student._id}`}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem className="gap-2 text-destructive cursor-pointer">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllStudentsPage;