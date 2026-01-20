"use client";

import { useState, useEffect } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Pencil, 
  Search, 
  Loader2, 
  Calendar, 
  Plus,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Image from "next/image";

interface UniversityIntake {
  _id: string;
  name: string;
  logo?: string;
  country: string;
  intakes: string[];
}

export default function AdminIntakesPage() {
  const [data, setData] = useState<UniversityIntake[]>([]);
  const [filteredData, setFilteredData] = useState<UniversityIntake[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<UniversityIntake | null>(null);
  const [editIntakes, setEditIntakes] = useState<string[]>([]);
  const [newIntakeInput, setNewIntakeInput] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchIntakes = async () => {
    try {
      const res = await fetch("/api/admin/intakes");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setFilteredData(result.data);
      } else {
        toast.error("Failed to load intakes");
      }
    } catch (error) {
        console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntakes();
  }, []);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter((item) =>
      item.name.toLowerCase().includes(lowerSearch) ||
      item.country.toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [search, data]);

  const openEditModal = (uni: UniversityIntake) => {
    setSelectedUni(uni);
    setEditIntakes([...(uni.intakes || [])]); 
    setIsDialogOpen(true);
  };

  const handleAddIntake = () => {
    if (newIntakeInput.trim() && !editIntakes.includes(newIntakeInput.trim())) {
      setEditIntakes([...editIntakes, newIntakeInput.trim()]);
      setNewIntakeInput("");
    }
  };

  const handleRemoveIntake = (intakeToRemove: string) => {
    setEditIntakes(editIntakes.filter(i => i !== intakeToRemove));
  };

  const handleSave = async () => {
    if (!selectedUni) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/intakes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUni._id, intakes: editIntakes }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Intakes updated successfully");
        const updatedList = data.map(u => 
            u._id === selectedUni._id ? { ...u, intakes: editIntakes } : u
        );
        setData(updatedList);
        setIsDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch (error) {
        console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
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
          <h1 className="text-2xl font-bold tracking-tight">Manage Intakes</h1>
          <p className="text-muted-foreground text-sm">
            Manage admission seasons for all universities.
          </p>
        </div>
      </div>

    
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search university..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Current Intakes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                  No universities found.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((uni) => (
                <TableRow key={uni._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden relative border">
                        {uni.logo ? (
                          <Image 
                            src={uni.logo} 
                            alt="logo" 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                            {uni.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{uni.name}</div>
                        <div className="text-xs text-muted-foreground">
                           {uni.country}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                        {uni.intakes && uni.intakes.length > 0 ? (
                            uni.intakes.map((intake, idx) => (
                                <Badge key={idx} variant="secondary" className="font-normal">
                                    <Calendar className="h-3 w-3 mr-1 opacity-70" />
                                    {intake}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground text-sm italic">No intakes set</span>
                        )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(uni)}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Intakes</DialogTitle>
            <DialogDescription>
              Update intake seasons for <strong>{selectedUni?.name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex gap-2">
                <Input 
                    placeholder="Add intake (e.g. March 2025)" 
                    value={newIntakeInput}
                    onChange={(e) => setNewIntakeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddIntake()}
                />
                <Button onClick={handleAddIntake} size="icon">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2 border p-3 rounded-md min-h-[80px] bg-muted/20">
                {editIntakes.length > 0 ? (
                    editIntakes.map((intake, idx) => (
                        <Badge key={idx} className="pl-2 pr-1 py-1 flex items-center gap-1">
                            {intake}
                            <button 
                                onClick={() => handleRemoveIntake(intake)}
                                className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))
                ) : (
                    <span className="text-sm text-muted-foreground m-auto">No intakes added yet.</span>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}