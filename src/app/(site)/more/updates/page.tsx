"use client";

import { useState } from "react";
import { 
  Bell, 
  Calendar, 
  Filter, 
  AlertCircle, 
  CheckCircle2, 
  Megaphone, 
  Server,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function UpdatesPage() {
  const [filter, setFilter] = useState("All");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Subscribed to important updates!");
  };

  // স্ট্যাটিক আপডেট ডাটা
  const updates = [
    {
      id: 1,
      date: "08 Jan, 2026",
      type: "Important",
      category: "Visa Policy",
      title: "UK Student Visa Dependents Rule Update",
      description: "The UK government has updated the policy regarding dependents for master's students. Only research-based courses are now eligible for dependent visas.",
      icon: AlertCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-200"
    },
    {
      id: 2,
      date: "05 Jan, 2026",
      type: "New",
      category: "Partnership",
      title: "New Partnership with University of Alberta",
      description: "We are thrilled to announce our official partnership with UofA, Canada. Direct applications are now open for the Fall 2026 intake.",
      icon: CheckCircle2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-200"
    },
    {
      id: 3,
      date: "01 Jan, 2026",
      type: "System",
      category: "Maintenance",
      title: "Student Portal Maintenance Scheduled",
      description: "Our student dashboard will be down for maintenance on 10th Jan from 2:00 AM to 6:00 AM for server upgrades.",
      icon: Server,
      color: "text-slate-500",
      bgColor: "bg-slate-500/10",
      borderColor: "border-slate-200"
    },
    {
      id: 4,
      date: "28 Dec, 2025",
      type: "Event",
      category: "Announcement",
      title: "Orbis Scholar 5th Anniversary Celebration",
      description: "Join us in celebrating 5 years of excellence! We are offering a 50% discount on all processing fees for this week.",
      icon: Megaphone,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-200"
    }
  ];

  // ফিল্টার লজিক
  const filteredUpdates = filter === "All" 
    ? updates 
    : updates.filter(u => u.category === filter || u.type === filter);

  // ফিল্টার বাটন লিস্ট
  const filters = ["All", "Visa Policy", "Partnership", "Maintenance", "Announcement"];

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* --- Section 1: Hero Banner --- */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 mb-4">
            <Bell className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Live Notifications</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-display mb-4">
            Latest Updates & Notices
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Stay informed about the latest visa regulations, university partnerships, and company announcements.
          </p>
        </div>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-80" />
      </section>

      {/* --- Section 2: Filters & Timeline --- */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <div className="flex items-center gap-2 mr-2 text-muted-foreground font-medium">
                <Filter className="h-4 w-4" /> Filter by:
            </div>
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Timeline Feed */}
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            
            {filteredUpdates.length > 0 ? (
                filteredUpdates.map((update) => (
                <div key={update.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    
                    {/* Icon Circle (Center Line) */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ${update.bgColor} ${update.color}`}>
                        <update.icon className="w-5 h-5" />
                    </div>
                    
                    {/* Content Card */}
                    <Card className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border ${update.borderColor} shadow-sm hover:shadow-md transition-all`}>
                        <div className="flex justify-between items-start mb-2">
                            <Badge variant="outline" className={`${update.color} ${update.bgColor} border-none`}>
                                {update.type}
                            </Badge>
                            <div className="flex items-center text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3 mr-1" /> {update.date}
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">{update.title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {update.description}
                        </p>
                    </Card>
                    
                </div>
                ))
            ) : (
                <div className="text-center py-20">
                    <p className="text-muted-foreground">No updates found for this category.</p>
                </div>
            )}

          </div>
          
          <div className="text-center mt-12">
            <Button variant="outline">Load Older Updates</Button>
          </div>

        </div>
      </section>

      {/* --- Section 3: Subscribe CTA --- */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100">
                <h2 className="text-2xl font-bold mb-4">Don t Miss Important Notices</h2>
                <p className="text-slate-600 mb-8">
                    Subscribe to our dedicated notification channel to get instant alerts about visa changes and deadlines.
                </p>
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                    <Input placeholder="Enter your email" className="bg-white" required />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Notify Me</Button>
                </form>
            </div>
        </div>
      </section>

    </div>
  );
}