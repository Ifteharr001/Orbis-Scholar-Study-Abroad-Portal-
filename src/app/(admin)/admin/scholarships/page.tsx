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
  Award,
  School,
  Banknote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

// ইন্টারফেস ডিফিনিশন
interface Scholarship {
  _id: string;
  name: string;
  type: string;
  tuitionFee: string;
  monthlyStipend: string;
  
  // প্যারেন্ট ইউনিভার্সিটির তথ্য
  universityId: string;
  universityName: string;
  universityLogo?: string;
  country: string;
}

export default function AdminScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ✅ ১. ডাটা ফেচিং
  const fetchScholarships = async () => {
    try {
      const res = await fetch("/api/admin/scholarships");
      const result = await res.json();
      if (result.success) {
        setScholarships(result.data);
        setFilteredScholarships(result.data);
      } else {
        toast.error("Failed to load scholarships");
      }
    } catch (error) {
        console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholarships();
  }, []);

  // ✅ ২. সার্চ ফিল্টার
  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = scholarships.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerSearch) ||
        s.universityName.toLowerCase().includes(lowerSearch) ||
        s.type.toLowerCase().includes(lowerSearch)
    );
    setFilteredScholarships(filtered);
  }, [search, scholarships]);

  // ✅ ৩. ডিলিট হ্যান্ডলার
  const handleDelete = async (scholarshipId: string, universityId: string) => {
    if (!confirm("Are you sure you want to delete this scholarship?")) return;

    setDeletingId(scholarshipId);
    try {
      const res = await fetch(`/api/admin/scholarships?id=${scholarshipId}&uniId=${universityId}`, {
        method: "DELETE",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success("Scholarship deleted successfully");
        // স্টেট আপডেট
        setScholarships((prev) => prev.filter((s) => s._id !== scholarshipId));
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
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">All Scholarships</h1>
          <p className="text-muted-foreground text-sm">
            Manage scholarships across all universities ({scholarships.length})
          </p>
        </div>
        <Link href="/admin/catalog/universities/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Scholarship via University
          </Button>
        </Link>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, university or type..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Scholarships Table */}
      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholarship Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Coverage Info</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No scholarships found.
                </TableCell>
              </TableRow>
            ) : (
              filteredScholarships.map((scholarship) => (
                <TableRow key={scholarship._id}>
                  {/* Name */}
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        {scholarship.name}
                    </div>
                  </TableCell>

                  {/* University */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden relative border">
                        {scholarship.universityLogo ? (
                          <Image 
                            src={scholarship.universityLogo} 
                            alt="logo" 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <School className="h-4 w-4 m-auto text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{scholarship.universityName}</div>
                        <div className="text-xs text-muted-foreground">
                           {scholarship.country}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  {/* Type */}
                  <TableCell>
                    <Badge variant="secondary">{scholarship.type}</Badge>
                  </TableCell>

                  {/* Coverage Details */}
                  <TableCell>
                    <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                            <Banknote className="h-3 w-3" /> 
                            Tuition: <span className="text-foreground font-medium">{scholarship.tuitionFee}</span>
                        </div>
                        {scholarship.monthlyStipend && (
                            <div className="text-xs text-green-600 font-medium">
                                Stipend: {scholarship.monthlyStipend}
                            </div>
                        )}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/catalog/universities/${scholarship.universityId}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4 text-blue-500" />
                        </Button>
                      </Link>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(scholarship._id, scholarship.universityId)}
                        disabled={deletingId === scholarship._id}
                      >
                        {deletingId === scholarship._id ? (
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