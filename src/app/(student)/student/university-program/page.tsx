"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link"; // ✅ Link ইম্পোর্ট করা হয়েছে
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, GraduationCap, Loader2, Eye, DollarSign, Clock } from "lucide-react";
import { toast } from "sonner";

interface Program {
  id: string;
  universityId: string; // ✅ এই ID দিয়ে আমরা রাউটিং করব
  program: string;
  university: string;
  location: string;
  degree: string;
  tuitionFee: string;
  scholarshipType: string;
}

export default function UniversityProgramPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch("/api/all-scholarships");
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setPrograms(data);
        }
      } catch (error) {
        console.error("Failed to fetch programs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter(p => 
      searchQuery === "" ||
      p.university.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [programs, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 container mx-auto py-6">
      
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Browse Programs 🎓</h1>
          <p className="text-muted-foreground">Find your dream university and apply instantly.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Uni, Course or Country..." 
            className="pl-10 bg-background border-border"
            value={searchQuery}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredPrograms.length === 0 ? (
        <div className="text-center py-20 border rounded-lg bg-muted/10">
          <p className="text-muted-foreground text-lg">No programs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <Card key={program.id} className="hover:shadow-lg transition-all border-border flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {program.degree}
                  </Badge>
                  <span className="text-2xl">🏛️</span>
                </div>
                <CardTitle className="mt-3 text-xl line-clamp-1" title={program.university}>
                  {program.university}
                </CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {program.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-3 flex-1 space-y-3">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  {program.program}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" /> {program.tuitionFee}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Full Time
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2 mt-auto">
               <Link 
  // ✅ কুয়েরি প্যারামিটার হিসেবে ডাটা পাঠানো হচ্ছে
  href={`/student/apply?program=${encodeURIComponent(program.program)}&university=${encodeURIComponent(program.university)}`} 
  className="w-full"
>
  <Button className="w-full">
    Apply No
  </Button>
</Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}