"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Pencil, Building2, Banknote } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface FeeStructure {
  tuition: string;
  accommodation: string;
  insurance: string;
  visaExtension: string;
  medical: string;
}

interface UniversityFees {
  bachelor: FeeStructure;
  master: FeeStructure;
  phd: FeeStructure;
}

interface University {
  _id: string;
  name: string;
  logo?: string;
  country: string;
  fees?: UniversityFees;
}

const defaultFeeStructure: FeeStructure = {
  tuition: "",
  accommodation: "",
  insurance: "",
  visaExtension: "",
  medical: ""
};

const defaultFees: UniversityFees = {
  bachelor: { ...defaultFeeStructure },
  master: { ...defaultFeeStructure },
  phd: { ...defaultFeeStructure }
};

export default function FeeSchedulesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUnis, setFilteredUnis] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [editFees, setEditFees] = useState<UniversityFees>(defaultFees);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/finance/fee-schedules");
      const result = await res.json();
      if (result.success) {
        setUniversities(result.data);
        setFilteredUnis(result.data);
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    setFilteredUnis(universities.filter(u => u.name.toLowerCase().includes(lower)));
  }, [search, universities]);

  const handleEditClick = (uni: University) => {
    setSelectedUni(uni);
    setEditFees(uni.fees || defaultFees);
    setIsDialogOpen(true);
  };

  const handleInputChange = (degree: keyof UniversityFees, field: keyof FeeStructure, value: string) => {
    setEditFees(prev => ({
      ...prev,
      [degree]: {
        ...prev[degree],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedUni) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/finance/fee-schedules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedUni._id, fees: editFees }),
      });

      if (res.ok) {
        toast.success("Fee schedule updated!");
        setUniversities(prev => prev.map(u => 
          u._id === selectedUni._id ? { ...u, fees: editFees } : u
        ));
        setIsDialogOpen(false);
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Schedules</h1>
          <p className="text-muted-foreground">Set tuition and accommodation fees for universities.</p>
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

      
      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Bachelor Tuition</TableHead>
              <TableHead>Master Tuition</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUnis.map((uni) => (
              <TableRow key={uni._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 overflow-hidden relative border">
                      {uni.logo ? (
                        <Image src={uni.logo} alt="logo" fill className="object-cover" />
                      ) : (
                        <Building2 className="h-4 w-4 m-auto text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{uni.name}</div>
                      <div className="text-xs text-muted-foreground">{uni.country}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{uni.fees?.bachelor?.tuition || <span className="text-muted-foreground text-xs">Not Set</span>}</TableCell>
                <TableCell>{uni.fees?.master?.tuition || <span className="text-muted-foreground text-xs">Not Set</span>}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEditClick(uni)}>
                    <Pencil className="h-3 w-3 mr-2" /> Manage Fees
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Fees: {selectedUni?.name}</DialogTitle>
            <DialogDescription>
              Update the standard fee structure. Amounts should include currency (e.g., 20,000 RMB/Year).
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="bachelor" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bachelor">Bachelor</TabsTrigger>
              <TabsTrigger value="master">Master</TabsTrigger>
              <TabsTrigger value="phd">PhD</TabsTrigger>
            </TabsList>

            {(['bachelor', 'master', 'phd'] as const).map((degree) => (
              <TabsContent key={degree} value={degree} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tuition Fee</Label>
                    <div className="relative">
                        <Banknote className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="e.g. 15,000 RMB/Year" 
                            className="pl-8"
                            value={editFees[degree]?.tuition || ""}
                            onChange={(e) => handleInputChange(degree, "tuition", e.target.value)}
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Accommodation Fee</Label>
                    <Input 
                        placeholder="e.g. 3,000 RMB/Year" 
                        value={editFees[degree]?.accommodation || ""}
                        onChange={(e) => handleInputChange(degree, "accommodation", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Insurance Fee</Label>
                    <Input 
                        placeholder="e.g. 800 RMB/Year" 
                        value={editFees[degree]?.insurance || ""}
                        onChange={(e) => handleInputChange(degree, "insurance", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Visa Extension</Label>
                    <Input 
                        placeholder="e.g. 400 RMB/Year" 
                        value={editFees[degree]?.visaExtension || ""}
                        onChange={(e) => handleInputChange(degree, "visaExtension", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Medical Checkup</Label>
                    <Input 
                        placeholder="e.g. 500 RMB (One time)" 
                        value={editFees[degree]?.medical || ""}
                        onChange={(e) => handleInputChange(degree, "medical", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
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