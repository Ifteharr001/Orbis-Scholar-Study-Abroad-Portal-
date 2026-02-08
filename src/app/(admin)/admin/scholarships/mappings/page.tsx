"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Save, Link2, BookOpen, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Program {
  _id: string;
  name: string;
}

interface Scholarship {
  _id: string;
  name: string;
  applicablePrograms?: string[];
}

interface University {
  _id: string;
  name: string;
  programs: Program[];
  scholarships: Scholarship[];
}

export default function ScholarshipMappingsPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedUniId, setSelectedUniId] = useState<string>("");
  const [selectedScholarshipId, setSelectedScholarshipId] = useState<string>("");
  const [mappedPrograms, setMappedPrograms] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/admin/scholarships/mappings");
        const result = await res.json();
        if (result.success) {
          setUniversities(result.data);
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUniChange = (uniId: string) => {
    setSelectedUniId(uniId);
    setSelectedScholarshipId("");
    setMappedPrograms([]);
  };

  const handleScholarshipChange = (scholarshipId: string) => {
    setSelectedScholarshipId(scholarshipId);
    
    const uni = universities.find(u => u._id === selectedUniId);
    const scholarship = uni?.scholarships.find(s => s._id === scholarshipId);
    
    if (scholarship && scholarship.applicablePrograms) {
      setMappedPrograms(scholarship.applicablePrograms);
    } else {
      setMappedPrograms([]);
    }
  };

  const toggleProgram = (programId: string) => {
    setMappedPrograms(prev => 
      prev.includes(programId) 
        ? prev.filter(id => id !== programId)
        : [...prev, programId]
    );
  };

  const handleSelectAll = () => {
    const uni = universities.find(u => u._id === selectedUniId);
    if (!uni) return;
    
    if (mappedPrograms.length === uni.programs.length) {
      setMappedPrograms([]); 
    } else {
      setMappedPrograms(uni.programs.map(p => p._id)); 
    }
  };

  const handleSave = async () => {
    if (!selectedUniId || !selectedScholarshipId) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/scholarships/mappings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityId: selectedUniId,
          scholarshipId: selectedScholarshipId,
          programIds: mappedPrograms
        }),
      });

      if (res.ok) {
        toast.success("Mapping saved successfully! 🔗");
        
        const updatedUnis = universities.map(u => {
            if (u._id === selectedUniId) {
                const updatedSch = u.scholarships.map(s => 
                    s._id === selectedScholarshipId ? { ...s, applicablePrograms: mappedPrograms } : s
                );
                return { ...u, scholarships: updatedSch };
            }
            return u;
        });
        setUniversities(updatedUnis);

      } else {
        toast.error("Failed to save mapping");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const currentUni = universities.find(u => u._id === selectedUniId);
  const currentScholarship = currentUni?.scholarships.find(s => s._id === selectedScholarshipId);

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="h-6 w-6 text-primary" /> Scholarship Mappings
        </h1>
        <p className="text-muted-foreground">Link scholarships to specific programs.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Step 1: Select Context</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Select University</label>
                <Select value={selectedUniId} onValueChange={handleUniChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Choose University..." />
                    </SelectTrigger>
                    <SelectContent>
                        {universities.map(uni => (
                            <SelectItem key={uni._id} value={uni._id}>{uni.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Select Scholarship</label>
                <Select value={selectedScholarshipId} onValueChange={handleScholarshipChange} disabled={!selectedUniId}>
                    <SelectTrigger>
                        <SelectValue placeholder={!selectedUniId ? "Select University First" : "Choose Scholarship..."} />
                    </SelectTrigger>
                    <SelectContent>
                        {currentUni?.scholarships.map(sch => (
                            <SelectItem key={sch._id} value={sch._id}>{sch.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>

      {selectedUniId && selectedScholarshipId && currentUni && (
        <Card className="border-primary/20 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                        Available Programs
                    </CardTitle>
                    <CardDescription>
                        Select programs eligible for <strong>{currentScholarship?.name}</strong>
                    </CardDescription>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-sm px-3 py-1">
                        Selected: {mappedPrograms.length}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={handleSelectAll}>
                        {mappedPrograms.length === currentUni.programs.length ? "Deselect All" : "Select All"}
                    </Button>
                </div>
            </CardHeader>
            
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2 border rounded-md bg-muted/10">
                    {currentUni.programs.length > 0 ? (
                        currentUni.programs.map((program) => (
                            <div 
                                key={program._id} 
                                className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                    mappedPrograms.includes(program._id) 
                                    ? "bg-blue-50 border-blue-200 shadow-sm" 
                                    : "bg-card border-border hover:bg-muted"
                                }`}
                                onClick={() => toggleProgram(program._id)}
                            >
                                <Checkbox 
                                    checked={mappedPrograms.includes(program._id)}
                                    onCheckedChange={() => toggleProgram(program._id)}
                                />
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none flex items-center gap-2">
                                        <GraduationCap className="h-3 w-3" />
                                        {program.name}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No programs found in this university.
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <Button onClick={handleSave} disabled={saving} className="min-w-[150px]">
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Mapping
                    </Button>
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}