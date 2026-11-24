"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Banknote,
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Landmark,
  GraduationCap,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Calculator,
  Percent,
  CreditCard,
  Banknote as BanknoteIcon,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Fee {
  _id: string;
  feeId: string;
  name: string;
  university: string;
  universityId: string;
  program: string;
  programId?: string;
  level: "undergraduate" | "graduate" | "phd" | "diploma" | "certificate" | "all";
  category: "tuition" | "application" | "registration" | "deposit" | "technology" | "library" | "lab" | "health" | "other";
  amount: number;
  currency: string;
  frequency: "one-time" | "per-semester" | "per-year" | "monthly";
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PartnerFeesPage() {
  const { data: session } = useSession();
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const categories = ["all", "tuition", "application", "registration", "deposit", "technology", "library", "lab", "health", "other"];
  const levels = ["all", "undergraduate", "graduate", "phd", "diploma", "certificate", "all"];
  const statuses = ["all", "active", "inactive"];

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const params = new URLSearchParams({
          search,
          category: categoryFilter,
          level: levelFilter,
          status: statusFilter,
          page: currentPage.toString(),
          limit: itemsPerPage.toString()
        });

        const res = await fetch(`/api/partner/finance/fees?${params}`, {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setFees([]);
          setTotalPages(1);
          return;
        }

        const data = await res.json();
        setFees(Array.isArray(data.fees) ? data.fees : []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Fees Load Error:", error);
        setFees([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchFees();
    } else {
      setLoading(false);
    }
  }, [session, search, categoryFilter, levelFilter, statusFilter, currentPage]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "tuition": return "bg-blue-100 text-blue-700";
      case "application": return "bg-green-100 text-green-700";
      case "registration": return "bg-purple-100 text-purple-700";
      case "deposit": return "bg-orange-100 text-orange-700";
      case "technology": return "bg-cyan-100 text-cyan-700";
      case "library": return "bg-indigo-100 text-indigo-700";
      case "lab": return "bg-red-100 text-red-700";
      case "health": return "bg-pink-100 text-pink-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "tuition": return "Tuition";
      case "application": return "Application";
      case "registration": return "Registration";
      case "deposit": return "Deposit";
      case "technology": return "Technology";
      case "library": return "Library";
      case "lab": return "Lab";
      case "health": return "Health";
      default: return category;
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "undergraduate": return "Undergraduate";
      case "graduate": return "Graduate";
      case "phd": return "PhD";
      case "diploma": return "Diploma";
      case "certificate": return "Certificate";
      case "all": return "All Levels";
      default: return level;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case "one-time": return "One-time";
      case "per-semester": return "Per Semester";
      case "per-year": return "Per Year";
      case "monthly": return "Monthly";
      default: return frequency;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const activeFees = fees.filter(f => f.isActive).length;
  const totalAmount = fees.filter(f => f.isActive).reduce((sum, f) => sum + f.amount, 0);
  const tuitionFees = fees.filter(f => f.category === "tuition" && f.isActive).length;
  const oneTimeFees = fees.filter(f => f.frequency === "one-time" && f.isActive).length;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Banknote className="h-7 w-7 text-primary" />
            Fee Structure
          </h1>
          <p className="text-muted-foreground mt-1">Manage university and program fee schedules</p>
        </div>
        <div className="flex gap-2">
          <Link href="/partner/finance/fees/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Fee
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg"><Banknote className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-2xl font-bold">{fees.length}</p>
              <p className="text-sm text-muted-foreground">Total Fees</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-green-100 rounded-lg"><CheckCircle className="h-5 w-5 text-green-600" /></div>
            <div>
              <p className="text-2xl font-bold">{activeFees}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg"><DollarSign className="h-5 w-5 text-yellow-600" /></div>
            <div>
              <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Active Total Value</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-lg"><GraduationCap className="h-5 w-5 text-blue-600" /></div>
            <div>
              <p className="text-2xl font-bold">{tuitionFees}</p>
              <p className="text-sm text-muted-foreground">Tuition Fees</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by fee name, university, program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level === "all" ? "All Levels" : getLevelLabel(level)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Fees Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>All Fees ({fees.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {fees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground border rounded-md border-dashed bg-muted/20">
              <Banknote className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No fees found</p>
              <p className="text-sm">
                {search || categoryFilter !== "all" || levelFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Fee structures will appear here as they are added."}
              </p>
              {(search || categoryFilter !== "all" || levelFilter !== "all" || statusFilter !== "all") && (
                <Button variant="outline" onClick={() => { setSearch(""); setCategoryFilter("all"); setLevelFilter("all"); setStatusFilter("all"); }} className="mt-4">
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-40">Fee ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>University</TableHead>
                      <TableHead className="hidden md:table-cell">Program</TableHead>
                      <TableHead className="hidden lg:table-cell">Level</TableHead>
                      <TableHead className="w-36">Category</TableHead>
                      <TableHead className="w-36">Amount</TableHead>
                      <TableHead className="w-36">Frequency</TableHead>
                      <TableHead className="w-32">Status</TableHead>
                      <TableHead className="w-40">Effective</TableHead>
                      <TableHead className="w-60 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.map((fee) => (
                      <TableRow key={fee._id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="font-mono text-sm">
                          <Link href={`/partner/finance/fees/${fee._id}`} className="text-primary hover:underline">
                            {fee.feeId}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{fee.name}</p>
                          {fee.description && <p className="text-xs text-muted-foreground line-clamp-1">{fee.description}</p>}
                        </TableCell>
                        <TableCell>
                          <span className="flex items-center gap-1 font-medium">
                            <Landmark className="h-3 w-3 text-muted-foreground" />
                            {fee.university}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {fee.program && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <GraduationCap className="h-3 w-3" />
                              {fee.program}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant="secondary">{getLevelLabel(fee.level)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(fee.category)}>
                            {getCategoryLabel(fee.category)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {fee.currency} {fee.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{getFrequencyLabel(fee.frequency)}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={fee.isActive ? "default" : "outline"}>
                            {fee.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {fee.effectiveFrom ? format(new Date(fee.effectiveFrom), "MMM d, yyyy") : "-"}
                          {fee.effectiveTo && (
                            <span className="mx-1">→</span>
                          )}
                          {fee.effectiveTo && format(new Date(fee.effectiveTo), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Link href={`/partner/finance/fees/${fee._id}`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="View Details">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/partner/finance/fees/${fee._id}/edit`}>
                              <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:bg-red-50" title="Delete">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}