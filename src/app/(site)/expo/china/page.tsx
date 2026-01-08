"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Building2, 
  GraduationCap,
  ArrowRight,
  User,
  Mail,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function ChinaExpoPage() {
  
  // ফর্ম সাবমিশন হ্যান্ডলার
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে ভবিষ্যতে API কল হবে
    toast.success("Registration Successful! We will contact you soon.");
  };

  // স্ট্যাটিক ডাটা: ফিচারস
  const features = [
    "On-spot Admission Assessment",
    "Up to 100% Scholarship Opportunities",
    "Meet 50+ Top Chinese Universities",
    "MBBS & Engineering Special Counseling",
    "Application Fee Waiver",
    "Gift Hampers for Attendees"
  ];

  // স্ট্যাটিক ডাটা: ইউনিভার্সিটি
  const universities = [
    { name: "Tsinghua University", rank: "#1 in China", image: "https://images.unsplash.com/photo-1599587426629-9e6b4e6d4272?w=500&q=80" },
    { name: "Peking University", rank: "#2 in China", image: "https://images.unsplash.com/photo-1565038827725-b873322fb689?w=500&q=80" },
    { name: "Zhejiang University", rank: "Top 50 Global", image: "https://images.unsplash.com/photo-1548232979-6c557ee14752?w=500&q=80" },
    { name: "Fudan University", rank: "Research Leader", image: "https://images.unsplash.com/photo-1596282035850-2f96e174b595?w=500&q=80" },
    { name: "Shanghai Jiao Tong", rank: "Tech Giant", image: "https://images.unsplash.com/photo-1589196593264-5735c023d57d?w=500&q=80" },
    { name: "Wuhan University", rank: "Medical Top Choice", image: "https://images.unsplash.com/photo-1582260667353-839335a13364?w=500&q=80" },
  ];

  // স্ট্যাটিক ডাটা: শিডিউল
  const schedule = [
    { time: "10:00 AM", title: "Gates Open & Registration", desc: "Collect your ID card and welcome kit." },
    { time: "11:00 AM", title: "Keynote: Study in China 2026", desc: "Speaker: Cultural Attaché, Embassy of China." },
    { time: "12:00 PM", title: "University Stall Visits", desc: "Meet representatives one-on-one." },
    { time: "03:00 PM", title: "Scholarship Assessment", desc: "Bring your academic documents for spot evaluation." },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* --- Section 1: Hero (Banner) --- */}
      <section className="relative min-h-[600px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&q=80" 
            alt="China Expo Background" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        </div>

        <div className="container relative z-10 px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <Badge className="bg-red-600 text-white border-none mb-6 px-4 py-1 text-md">
              Biggest Event of 2026
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
              China Education <br />
              <span className="text-red-500">Expo 2026</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg mx-auto lg:mx-0">
              Unlock your future with fully funded scholarships. Meet representatives from top Chinese universities directly.
            </p>
            
            {/* Event Details Badges */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                <Calendar className="text-red-500 h-6 w-6" />
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase">Date</p>
                  <p className="font-bold">25th March, 2026</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
                <MapPin className="text-red-500 h-6 w-6" />
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase">Location</p>
                  <p className="font-bold">BICC, Dhaka</p>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-6 text-lg rounded-full" onClick={() => document.getElementById('register-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Register for Free
            </Button>
          </div>

          {/* Right Side: Visual Element (Optional - Glass Card) */}
          <div className="hidden lg:block relative">
             <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl">
                <div className="grid grid-cols-2 gap-4">
                    {features.slice(0, 4).map((f, i) => (
                        <div key={i} className="flex gap-3 items-start">
                             <div className="bg-red-600/20 p-2 rounded-full mt-1">
                                <CheckCircle2 className="h-4 w-4 text-red-500" />
                             </div>
                             <p className="text-sm font-medium">{f}</p>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- Section 2: Why Attend? --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Attend This Expo?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              This is not just an event; its a gateway to your career.
              China offers world-class education at an affordable cost.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-lg">{feature}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Participating Universities --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold">Participating Universities</h2>
            <p className="text-muted-foreground mt-2">Interact directly with delegates from these institutions.</p>
          </div>
          <Button variant="outline" className="hidden md:flex">View All</Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {universities.map((uni, index) => (
            <div key={index} className="group text-center">
              <div className="relative h-32 w-32 mx-auto rounded-full overflow-hidden border-4 border-muted group-hover:border-red-500 transition-colors mb-4">
                <Image src={uni.image} alt={uni.name} fill className="object-cover" />
              </div>
              <h3 className="font-bold text-sm mb-1">{uni.name}</h3>
              <p className="text-xs text-muted-foreground">{uni.rank}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Section 4: Event Schedule & Registration Form --- */}
      <section id="register-form" className="py-20 bg-black text-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16">
          
          {/* Left: Schedule */}
          <div>
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Clock className="text-red-500" /> Event Agenda
            </h2>
            <div className="space-y-8 border-l-2 border-white/10 ml-3 pl-8 relative">
              {schedule.map((item, index) => (
                <div key={index} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-red-600 border-4 border-black" />
                  <span className="text-red-500 font-bold text-sm uppercase tracking-wider">{item.time}</span>
                  <h3 className="text-xl font-bold mt-1">{item.title}</h3>
                  <p className="text-gray-400 mt-1 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="bg-white text-black p-8 rounded-3xl shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold">Book Your Seat</h3>
              <p className="text-muted-foreground text-sm">Limited spots available. Register now!</p>
            </div>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="John" className="pl-9 bg-gray-50" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-muted-foreground">Last Name</label>
                  <Input placeholder="Doe" className="bg-gray-50" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="email" placeholder="john@example.com" className="pl-9 bg-gray-50" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="tel" placeholder="+880 1XXX XXXXXX" className="pl-9 bg-gray-50" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-muted-foreground">Interested Degree</label>
                <Select>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bachelors">Bachelors (MBBS/Engineering)</SelectItem>
                    <SelectItem value="masters">Masters</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" size="lg" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold mt-4">
                Confirm Registration
              </Button>
            </form>
          </div>

        </div>
      </section>

      {/* --- Section 5: FAQ --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {[
              { q: "Is there any entry fee?", a: "No, the entry is completely free for all students and parents." },
              { q: "Can I bring my parents?", a: "Yes, we encourage students to come with their parents/guardians." },
              { q: "What documents should I bring?", a: "Bring copies of your academic transcripts and passport (if available) for spot assessment." },
              { q: "Will there be spot admission?", a: "Yes, selected universities will offer provisional offer letters to eligible candidates on the spot." }
            ].map((faq, index) => (
              <div key={index} className="bg-card p-6 rounded-xl border border-border">
                <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <span className="text-red-500">Q.</span> {faq.q}
                </h4>
                <p className="text-muted-foreground ml-6">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}