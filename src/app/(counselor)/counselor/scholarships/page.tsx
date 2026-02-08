"use client";

import { useState, useEffect } from "react";
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
  Search, 
  Loader2, 
  Award,
  School,
  Banknote
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

interface Scholarship {
  _id: string;
  name: string;
  type: string;
  tuitionFee: string;
  monthlyStipend: string;
  
  universityId: string;
  universityName: string;
  universityLogo?: string;
  country: string;
}

export default function CounselorScholarshipsPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchScholarships = async () => {
    try {
      const res = await fetch("/api/counselor/scholarships");
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
          <h1 className="text-2xl font-bold tracking-tight">Available Scholarships</h1>
          <p className="text-muted-foreground text-sm">
            Browse scholarships offered by partner universities ({scholarships.length})
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, university or type..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Scholarship Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Coverage Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredScholarships.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No scholarships found.
                </TableCell>
              </TableRow>
            ) : (
              filteredScholarships.map((scholarship) => (
                <TableRow key={scholarship._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-yellow-600" />
                        {scholarship.name}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden relative border shrink-0">
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

                  <TableCell>
                    <Badge variant="secondary">{scholarship.type}</Badge>
                  </TableCell>

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

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}