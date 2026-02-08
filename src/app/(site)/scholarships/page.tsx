"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import NewsSection from "@/app/components/NewsSection";

interface Scholarship {
  id: string;
  universityId: string;
  program: string;
  university: string;
  location: string; 
  degree: string;
  language: string;
  tuitionFee: string;
  accommodationFee: string;
  scholarshipType: string;
}

const FilterSection = ({ 
  title, 
  children, 
  defaultOpen = false 
}: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b border-border pb-3 mb-2">
      <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors uppercase">
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

const parseFee = (feeString: string) => {
  if (!feeString || feeString.toLowerCase() === "free") return 0;
  const num = parseInt(feeString.replace(/[^0-9]/g, ''));
  return isNaN(num) ? 999999 : num;
};

const ScholarshipsPage = () => {
  const [allScholarships, setAllScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [scholarshipTypeFilter, setScholarshipTypeFilter] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [universityFilter, setUniversityFilter] = useState("");
  const [languageFilter, setLanguageFilter] = useState("");
  
  const [locationFilter, setLocationFilter] = useState(""); 
  const [majorFilter, setMajorFilter] = useState(""); 
  const [tuitionFilter, setTuitionFilter] = useState(""); 
  const [accommodationFilter, setAccommodationFilter] = useState(""); 

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await fetch("/api/all-scholarships");
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllScholarships(data);
        }
      } catch (error) {
        console.error("Error fetching scholarships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScholarships();
  }, []);
  const uniqueUniversities = useMemo(() => [...new Set(allScholarships.map(s => s.university))].sort(), [allScholarships]);
  const uniqueDegrees = useMemo(() => [...new Set(allScholarships.map(s => s.degree))].sort(), [allScholarships]);
  const uniqueLanguages = useMemo(() => [...new Set(allScholarships.map(s => s.language))].sort(), [allScholarships]);
  const uniqueScholarshipTypes = useMemo(() => [...new Set(allScholarships.map(s => s.scholarshipType))].sort(), [allScholarships]);
  
  const uniqueLocations = useMemo(() => [...new Set(allScholarships.map(s => s.location))].filter(Boolean).sort(), [allScholarships]);
  const uniqueMajors = useMemo(() => [...new Set(allScholarships.map(s => s.program))].sort(), [allScholarships]);


  const filteredScholarships = useMemo(() => {
    return allScholarships.filter(scholarship => {
    
      const matchesSearch = searchQuery === "" || 
        scholarship.program.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholarship.university.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesScholarshipType = scholarshipTypeFilter === "" || scholarshipTypeFilter === "all" ||
        scholarship.scholarshipType === scholarshipTypeFilter;
      
      const matchesDegree = degreeFilter === "" || degreeFilter === "all" ||
        scholarship.degree === degreeFilter;
      
      const matchesLanguage = languageFilter === "" || languageFilter === "all" ||
        scholarship.language === languageFilter;
      
      const matchesUniversity = universityFilter === "" || universityFilter === "all" ||
        scholarship.university === universityFilter;

      const matchesLocation = locationFilter === "" || locationFilter === "all" || 
        scholarship.location === locationFilter;

      const matchesMajor = majorFilter === "" || majorFilter === "all" || 
        scholarship.program === majorFilter;

      let matchesTuition = true;
      if (tuitionFilter && tuitionFilter !== "all") {
        const fee = parseFee(scholarship.tuitionFee);
        if (tuitionFilter === "free") matchesTuition = fee === 0;
        else if (tuitionFilter === "0-15000") matchesTuition = fee > 0 && fee <= 15000;
        else if (tuitionFilter === "15000-30000") matchesTuition = fee > 15000 && fee <= 30000;
        else if (tuitionFilter === "30000+") matchesTuition = fee > 30000;
      }

      let matchesAccommodation = true;
      if (accommodationFilter && accommodationFilter !== "all") {
        const fee = parseFee(scholarship.accommodationFee);
        if (accommodationFilter === "free") matchesAccommodation = fee === 0;
        else if (accommodationFilter === "0-4000") matchesAccommodation = fee > 0 && fee <= 4000;
        else if (accommodationFilter === "4000-8000") matchesAccommodation = fee > 4000 && fee <= 8000;
        else if (accommodationFilter === "8000+") matchesAccommodation = fee > 8000;
      }
      
      return matchesSearch && matchesScholarshipType && matchesDegree && matchesLanguage && matchesUniversity && matchesLocation && matchesMajor && matchesTuition && matchesAccommodation;
    });
  }, [allScholarships, searchQuery, scholarshipTypeFilter, degreeFilter, languageFilter, universityFilter, locationFilter, majorFilter, tuitionFilter, accommodationFilter]);

  const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentScholarships = filteredScholarships.slice(startIndex, endIndex);

  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink onClick={() => setCurrentPage(1)} className="cursor-pointer">1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="last">
          <PaginationLink onClick={() => setCurrentPage(totalPages)} className="cursor-pointer">{totalPages}</PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="min-h-screen flex flex-col">
   
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary/90 to-primary flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920')] bg-cover bg-center opacity-30" />
        <h1 className="relative text-3xl md:text-5xl font-bold text-primary-foreground tracking-wide">
          SCHOLARSHIP
        </h1>
      </div>

      <main className="flex-1 bg-background">
        <div className="container py-8 mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
       
            <aside className="w-full lg:w-72 shrink-0">
              <div className="bg-card rounded-lg border border-border p-4 sticky top-24 max-h-[calc(100vh-100px)] overflow-y-auto">
                <h2 className="text-lg font-bold text-primary mb-4 border-b pb-2">FILTER PROGRAMS</h2>
                
                <div className="space-y-1">
                  
                  <FilterSection title="SCHOLARSHIP TYPE" defaultOpen>
                    <Select onValueChange={handleFilterChange(setScholarshipTypeFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {uniqueScholarshipTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  {/* 2. Degree */}
                  <FilterSection title="DEGREE / TYPE" defaultOpen>
                    <Select onValueChange={handleFilterChange(setDegreeFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Degree" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Degrees</SelectItem>
                        {uniqueDegrees.map(degree => (
                          <SelectItem key={degree} value={degree}>{degree}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <FilterSection title="MAJOR / SUBJECT">
                    <Select onValueChange={handleFilterChange(setMajorFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Majors</SelectItem>
                        {uniqueMajors.map(major => (
                          <SelectItem key={major} value={major}>{major}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <FilterSection title="UNIVERSITY">
                    <Select onValueChange={handleFilterChange(setUniversityFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select University" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Universities</SelectItem>
                        {uniqueUniversities.map(uni => (
                          <SelectItem key={uni} value={uni}>{uni}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <FilterSection title="CITY / PROVINCE">
                    <Select onValueChange={handleFilterChange(setLocationFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {uniqueLocations.map(loc => (
                          <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <FilterSection title="LANGUAGE">
                    <Select onValueChange={handleFilterChange(setLanguageFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Languages</SelectItem>
                        {uniqueLanguages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <FilterSection title="TUITION FEES">
                    <Select onValueChange={handleFilterChange(setTuitionFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranges</SelectItem>
                        <SelectItem value="free">Free / Full Scholarship</SelectItem>
                        <SelectItem value="0-15000">¥0 - ¥15,000</SelectItem>
                        <SelectItem value="15000-30000">¥15,000 - ¥30,000</SelectItem>
                        <SelectItem value="30000+">¥30,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </FilterSection>

                  <FilterSection title="ACCOMMODATION FEES">
                    <Select onValueChange={handleFilterChange(setAccommodationFilter)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranges</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="0-4000">¥0 - ¥4,000</SelectItem>
                        <SelectItem value="4000-8000">¥4,000 - ¥8,000</SelectItem>
                        <SelectItem value="8000+">¥8,000+</SelectItem>
                      </SelectContent>
                    </Select>
                  </FilterSection>

                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                Scholarship Programs ({filteredScholarships.length})
              </h2>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Select 
                    value={itemsPerPage.toString()} 
                    onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">per page</span>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="rounded-lg border border-border overflow-hidden bg-card">
                {isLoading ? (
                  <div className="p-20 flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : currentScholarships.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Major / Subject</TableHead>
                        <TableHead className="font-semibold">University</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Fees Coverage</TableHead>
                        <TableHead className="font-semibold text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentScholarships.map((scholarship) => (
                        <TableRow key={scholarship.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{scholarship.program}</TableCell>
                          <TableCell>
                            <Link href={`/university/${scholarship.universityId}`} className="text-primary hover:underline">
                              {scholarship.university}
                            </Link>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{scholarship.location}</TableCell>
                          <TableCell>{scholarship.scholarshipType}</TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span className="text-muted-foreground text-xs">Tuition: <span className="text-foreground font-medium">{scholarship.tuitionFee}</span></span>
                              <span className="text-muted-foreground text-xs">Accomm: <span className="text-foreground font-medium">{scholarship.accommodationFee}</span></span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" className="bg-gradient-secondary hover:bg-primary/90" asChild>
                              <Link href={`/university/${scholarship.universityId}`}>
                                View
                              </Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="p-10 text-center text-muted-foreground">
                    No scholarships found matching your criteria.
                  </div>
                )}
              </div>

              {!isLoading && currentScholarships.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredScholarships.length)} of {filteredScholarships.length} Scholarships
                  </p>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>
        </div>
        <NewsSection />
      </main>
    </div>
  );
};

export default ScholarshipsPage;