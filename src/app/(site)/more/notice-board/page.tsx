"use client";

import { useState } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Pin, 
  Calendar, 
  AlertCircle,
  Filter,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function NoticeBoardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const handleDownload = (fileName: string) => {
    toast.success(`Downloading ${fileName}...`);
  };

  const notices = [
    {
      id: 1,
      title: "Office Closure Notice - Eid-ul-Fitr 2026",
      date: "12 Mar, 2026",
      category: "Holiday",
      isPinned: true,
      fileSize: "1.2 MB",
      fileName: "eid_notice_2026.pdf"
    },
    {
      id: 2,
      title: "Updated UK Visa Application Fees (Effective April)",
      date: "10 Mar, 2026",
      category: "Visa Update",
      isPinned: true,
      fileSize: "500 KB",
      fileName: "uk_visa_fees.pdf"
    },
    {
      id: 3,
      title: "IELTS Batch 45 - Class Schedule",
      date: "08 Mar, 2026",
      category: "Academic",
      isPinned: false,
      fileSize: "2.4 MB",
      fileName: "ielts_schedule_b45.pdf"
    },
    {
      id: 4,
      title: "Canada Student Direct Stream (SDS) Requirement Changes",
      date: "05 Mar, 2026",
      category: "Admission",
      isPinned: false,
      fileSize: "850 KB",
      fileName: "canada_sds_update.pdf"
    },
    {
      id: 5,
      title: "List of Required Documents for USA Interview",
      date: "01 Mar, 2026",
      category: "Visa Update",
      isPinned: false,
      fileSize: "3.1 MB",
      fileName: "usa_checklist.pdf"
    },
    {
      id: 6,
      title: "General Meeting for Fall 2026 Applicants",
      date: "28 Feb, 2026",
      category: "Event",
      isPinned: false,
      fileSize: "N/A",
      fileName: null 
    }
  ];

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || notice.category === category;
    return matchesSearch && matchesCategory;
  });

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-background font-sans">
      
      <section className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full mb-4 shadow-sm">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-600">Official Announcements</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-2">
            Notice Board
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Find all official updates, schedules, and downloadable forms here.
          </p>
        </div>
      </section>

      <section className="py-8 container mx-auto px-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search notices..." 
              className="pl-10 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4 text-slate-400" />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-[180px] bg-slate-50 border-slate-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Holiday">Holidays</SelectItem>
                <SelectItem value="Visa Update">Visa Updates</SelectItem>
                <SelectItem value="Academic">Academic</SelectItem>
                <SelectItem value="Admission">Admission</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="pb-20 container mx-auto px-4">
        
        {pinnedNotices.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Pin className="h-5 w-5 text-red-500 fill-red-500 transform rotate-45" /> Pinned / Urgent
            </h2>
            <div className="grid gap-4">
              {pinnedNotices.map((notice) => (
                <Card key={notice.id} className="border-l-4 border-l-red-500 shadow-sm hover:shadow-md transition-all bg-red-50/10">
                  <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="bg-red-100 p-3 rounded-full shrink-0">
                      <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                          {notice.category}
                        </Badge>
                        <span className="text-xs text-slate-500 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border">
                          <Calendar className="h-3 w-3" /> {notice.date}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                      {notice.fileName ? (
                        <Button variant="outline" className="w-full md:w-auto gap-2 border-red-200 text-red-700 hover:bg-red-50" onClick={() => handleDownload(notice.fileName!)}>
                          <Download className="h-4 w-4" /> Download
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full md:w-auto gap-2">
                          <Eye className="h-4 w-4" /> View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" /> Recent Notices
          </h2>
          
          {regularNotices.length > 0 ? (
            <div className="space-y-4">
              {regularNotices.map((notice) => (
                <div key={notice.id} className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center gap-4">
                  
                  <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-slate-50 rounded-lg border border-slate-100 shrink-0 text-slate-600">
                    <span className="text-xs font-bold uppercase">{notice.date.split(" ")[1]}</span>
                    <span className="text-xl font-bold">{notice.date.split(" ")[0]}</span>
                  </div>

                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1 md:hidden">
                        <Badge variant="outline">{notice.category}</Badge>
                        <span className="text-xs text-muted-foreground">{notice.date}</span>
                     </div>
                     <h3 className="text-base md:text-lg font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                       {notice.title}
                     </h3>
                     <div className="hidden md:flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="text-xs font-normal h-5">{notice.category}</Badge>
                        {notice.fileSize && (
                           <span className="text-xs text-slate-400">File size: {notice.fileSize}</span>
                        )}
                     </div>
                  </div>

                  <div className="w-full md:w-auto mt-2 md:mt-0">
                    {notice.fileName ? (
                      <Button size="sm" variant="secondary" className="w-full gap-2" onClick={() => handleDownload(notice.fileName!)}>
                        <Download className="h-4 w-4" /> <span className="md:hidden lg:inline">PDF</span>
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="w-full gap-2">
                        <Eye className="h-4 w-4" /> Read
                      </Button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
              <p className="text-slate-500">No notices found matching your search.</p>
            </div>
          )}
        </div>

      </section>

    </div>
  );
}