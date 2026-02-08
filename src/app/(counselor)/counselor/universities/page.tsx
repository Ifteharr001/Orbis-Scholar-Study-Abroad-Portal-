"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  Search, MapPin, Loader2, Globe, 
  Calendar, DollarSign, GraduationCap, ImageIcon
} from "lucide-react"; 
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface University {
  _id: string;
  name: string;
  country: string;
  location: string;
  ranking?: number;
  slug: string;
  image?: string;
  logo?: string;
  tuitionFee?: string;
  deadline?: string;
  scholarshipAvailable?: boolean;
}

export default function CounselorUniversityPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUniversities = async () => {
    try {
      const res = await fetch("/api/counselor/universities"); 
      const data = await res.json();
      if (data.success) {
        setUniversities(data.data);
      }
    } catch (error) {
      toast.error("Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const filteredList = universities.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">University Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">Browse our partner universities and scholarship opportunities.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 max-w-md bg-white p-1 rounded-sm border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search university, country..." 
          className="border-none focus-visible:ring-0 rounded-sm shadow-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-sm bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[400px] font-semibold text-slate-700">University Info</TableHead>
              <TableHead className="font-semibold text-slate-700">Location</TableHead>
              <TableHead className="font-semibold text-slate-700">Tuition & Aid</TableHead>
              <TableHead className="font-semibold text-slate-700">Deadline</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin h-5 w-5" /> Loading catalog...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                  No universities found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((uni) => (
                <TableRow key={uni._id} className="hover:bg-slate-50/50 border-b border-slate-100 transition-colors">
                  
                  <TableCell className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 flex-shrink-0 bg-white border border-slate-200 rounded-sm flex items-center justify-center overflow-hidden">
                           {uni.logo || uni.image ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={uni.logo || uni.image} alt={uni.name} className="w-full h-full object-cover" />
                           ) : (
                             <ImageIcon className="h-5 w-5 text-slate-300" />
                           )}
                        </div>
                        <div>
                           <div className="font-bold text-slate-800 text-base leading-tight">{uni.name}</div>
                           <div className="flex items-center gap-2 mt-1">
                              {uni.ranking ? (
                                <Badge variant="secondary" className="rounded-sm bg-slate-100 text-slate-600 text-[10px] px-1.5 h-5 border-slate-200">
                                   Rank #{uni.ranking}
                                </Badge>
                              ) : null}
                              <span className="text-xs text-slate-400">ID: {uni.slug}</span>
                           </div>
                        </div>
                      </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                       <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <Globe className="h-3.5 w-3.5 text-blue-500" /> {uni.country}
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="h-3.5 w-3.5" /> {uni.location}
                       </div>
                    </div>
                  </TableCell>

                  <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-slate-700">
                           <DollarSign className="h-3.5 w-3.5 text-green-600" /> 
                           <span className="font-medium">{uni.tuitionFee || "TBD"}</span>
                        </div>
                        <Badge variant="outline" className={`rounded-sm w-fit text-[10px] px-1.5 py-0 ${
                            uni.scholarshipAvailable !== false 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-slate-50 text-slate-500 border-slate-200"
                        }`}>
                           <GraduationCap className="h-3 w-3 mr-1" />
                           {uni.scholarshipAvailable !== false ? "Scholarship" : "No Aid"}
                        </Badge>
                      </div>
                  </TableCell>

                  <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-orange-400" />
                        <span className={!uni.deadline ? "text-muted-foreground text-xs" : "font-medium"}>
                            {uni.deadline || "Not Set"}
                        </span>
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