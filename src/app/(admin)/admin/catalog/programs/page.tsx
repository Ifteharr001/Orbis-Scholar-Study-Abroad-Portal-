"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Pencil, 
  Trash2, 
  Search, 
  Plus, 
  Loader2, 
  GraduationCap, 
  MapPin, 
  School 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

interface Program {
  _id: string;
  name: string;
  degree: string;
  language: string;
  duration: string;
  tuitionFee: string;
  hasScholarship: boolean;
  
  universityId: string;
  universityName: string;
  universityLogo?: string;
  country: string;
}

export default function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchPrograms = async () => {
    try {
      const res = await fetch("/api/admin/programs");
      const data = await res.json();
      if (data.success) {
        setPrograms(data.data);
        setFilteredPrograms(data.data);
      } else {
        toast.error("Failed to load programs");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = programs.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.universityName.toLowerCase().includes(lowerSearch) ||
        p.degree.toLowerCase().includes(lowerSearch)
    );
    setFilteredPrograms(filtered);
  }, [search, programs]);

  const handleDelete = async (programId: string, universityId: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;

    setDeletingId(programId);
    try {
      const res = await fetch(`/api/admin/programs?id=${programId}&uniId=${universityId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Program deleted successfully");
   
        setPrograms((prev) => prev.filter((p) => p._id !== programId));
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
        console.error(error);
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Programs</h1>
          <p className="text-muted-foreground text-sm">
            Manage programs across all universities ({programs.length})
          </p>
        </div>
        <Link href="/admin/catalog/universities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Program via University
          </Button>
        </Link>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by program, university or degree..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Degree & Info</TableHead>
              <TableHead>Tuition Fee</TableHead>
              <TableHead>Scholarship</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrograms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No programs found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPrograms.map((program) => (
                <TableRow key={program._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                        {program.name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden relative border">
                        {program.universityLogo ? (
                          <Image 
                            src={program.universityLogo} 
                            alt="logo" 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <School className="h-4 w-4 m-auto text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{program.universityName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> {program.country}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                        <Badge variant="outline">{program.degree}</Badge>
                        <div className="text-xs text-muted-foreground">
                            {program.duration} • {program.language}
                        </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground text-sm">
                    {program.tuitionFee}
                  </TableCell>

                  <TableCell>
                    {program.hasScholarship ? (
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                            Available
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="text-muted-foreground">None</Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/catalog/universities/${program.universityId}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(program._id, program.universityId)}
                        disabled={deletingId === program._id}
                      >
                        {deletingId === program._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}