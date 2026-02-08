"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { 
  Plus, Search, Edit, Trash2, MapPin, Loader2, Globe, 
  Calendar, DollarSign, GraduationCap, ImageIcon, BookOpen, Layers
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
  applicationFee?: string;
  fees?: {
    bachelor?: { tuition: string };
    master?: { tuition: string };
    phd?: { tuition: string };
  };

  deadline?: string;      
  intakes?: string[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  programs?: any[]; 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scholarships?: any[]; 
}

export default function UniversityCatalogPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUniversities = async () => {
    try {
      const res = await fetch("/api/admin/universities?limit=100"); 
      const data = await res.json();
      
      if (data.success) {
        setUniversities(data.data);
      } else {
        toast.error("Failed to fetch data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error loading universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university?")) return;
    try {
      const res = await fetch(`/api/admin/universities/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("University deleted!");
        setUniversities(prev => prev.filter(u => u._id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  const filteredList = universities.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">University Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage partner universities, deadlines, and scholarship info.</p>
        </div>
        <Link href="/admin/catalog/universities/new">
          <Button className="rounded-sm bg-slate-900 text-white hover:bg-slate-800">
            <Plus className="mr-2 h-4 w-4" /> Add University
          </Button>
        </Link>
      </div>

    
      <div className="flex items-center gap-2 max-w-md bg-white p-1 rounded-sm border shadow-sm">
        <Search className="h-4 w-4 text-muted-foreground ml-2" />
        <Input 
          placeholder="Search by university or country..." 
          className="border-none focus-visible:ring-0 rounded-sm shadow-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-sm bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[300px] font-semibold text-slate-700">University Info</TableHead>
              <TableHead className="font-semibold text-slate-700">Location & Stats</TableHead>
              <TableHead className="font-semibold text-slate-700">Tuition & Aid</TableHead>
              <TableHead className="font-semibold text-slate-700">Deadline & Intake</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <Loader2 className="animate-spin h-5 w-5" /> Loading catalog...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No universities found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredList.map((uni) => {
                const displayTuition = uni.tuitionFee 
                  || uni.fees?.bachelor?.tuition 
                  || uni.fees?.master?.tuition 
                  || "TBD";
                
                const scholarshipCount = uni.scholarships?.length || 0;
                const programCount = uni.programs?.length || 0;
                const hasDeadline = uni.deadline && uni.deadline.length > 0;

                return (
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
                                <span className="text-xs text-slate-400 truncate max-w-[100px] uppercase">ID: {uni.slug}</span>
                             </div>
                          </div>
                       </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                         <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                            <Globe className="h-3.5 w-3.5 text-blue-500" /> {uni.country}
                         </div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" /> {uni.location}
                         </div>
                         <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <BookOpen className="h-3.5 w-3.5 text-purple-500" /> 
                            <span className="font-medium text-slate-700">
                                {programCount > 0 ? `${programCount} Programs` : "0 Programs"}
                            </span>
                         </div>
                      </div>
                    </TableCell>

                    <TableCell>
                       <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-sm text-slate-700">
                             <DollarSign className="h-3.5 w-3.5 text-green-600" /> 
                             <span className="font-medium">{displayTuition}</span>
                          </div>
                          <Badge variant="outline" className={`rounded-sm w-fit text-[10px] px-2 py-0.5 ${
                             scholarshipCount > 0
                             ? "bg-green-50 text-green-700 border-green-200" 
                             : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}>
                             <GraduationCap className="h-3 w-3 mr-1" />
                             {scholarshipCount > 0 ? `${scholarshipCount} Scholarships` : "No Aid Listed"}
                          </Badge>
                       </div>
                    </TableCell>

                    <TableCell>
                       <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-sm text-slate-700">
                             <Calendar className={`h-4 w-4 ${hasDeadline ? "text-orange-500" : "text-slate-300"}`} />
                             <span className={!hasDeadline ? "text-muted-foreground text-xs italic" : "font-medium"}>
                                 {uni.deadline || "Deadline not set"}
                             </span>
                          </div>
                          {uni.intakes && uni.intakes.length > 0 && (
                             <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Layers className="h-3.5 w-3.5" />
                                <span>{Array.isArray(uni.intakes) ? uni.intakes.join(", ") : uni.intakes}</span>
                             </div>
                          )}
                       </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/catalog/universities/${uni._id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-sm hover:bg-blue-50 hover:text-blue-600 border border-transparent hover:border-blue-100">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 rounded-sm hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100"
                          onClick={() => handleDelete(uni._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>

                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}