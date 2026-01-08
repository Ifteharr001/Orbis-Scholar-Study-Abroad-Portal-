"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Globe2, 
  Plane, 
  GraduationCap, 
  FileCheck, 
  MapPin, 
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle,
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

export default function OverseasExpoPage() {
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Registration Successful! See you at the Expo.");
  };

  // স্ট্যাটিক ডাটা: দেশসমূহ
  const countries = [
    { name: "USA", offer: "SAT/GRE Waiver Options", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=500&q=80" },
    { name: "UK", offer: "2 Years PSW Rights", image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&q=80" },
    { name: "Canada", offer: "PR Opportunity", image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=500&q=80" },
    { name: "Australia", offer: "Scholarships up to 50%", image: "https://images.unsplash.com/photo-1523482580672-01e6f06378c5?w=500&q=80" },
  ];

  // স্ট্যাটিক ডাটা: বেনিফিট
  const benefits = [
    { icon: Globe2, title: "100+ Universities", desc: "Meet delegates from top-ranked global universities under one roof." },
    { icon: FileCheck, title: "On-Spot Assessment", desc: "Get your profile evaluated instantly and secure provisional offers." },
    { icon: Sparkles, title: "Application Waiver", desc: "Save up to $500 on application fees by applying at the event." },
    { icon: Plane, title: "Visa Guidance", desc: "Expert sessions on student visa policies for 2026 intakes." },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* --- Section 1: Hero Banner --- */}
      <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80" 
            alt="Overseas Expo Background" 
            fill 
            className="object-cover"
          />
          {/* Blue Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/95 via-blue-900/80 to-blue-800/50" />
        </div>

        <div className="container relative z-10 px-4 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 animate-fade-in">
            <Globe2 className="h-4 w-4 text-cyan-400" />
            <span className="text-sm font-medium tracking-wide">Gateway to Global Education</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 leading-tight">
            Grand Overseas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Education Expo 2026
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your one-stop destination to study in UK, USA, Canada, & Australia. 
            Connect with universities, counselors, and visa experts.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* Date Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-200 uppercase">When</p>
                <p className="font-bold text-lg">10 April, 2026</p>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl flex items-center gap-4 min-w-[200px]">
              <div className="bg-cyan-500/20 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-xs text-blue-200 uppercase">Where</p>
                <p className="font-bold text-lg">Westin, Dhaka</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <Button 
  size="lg" 
  className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold text-lg px-10 py-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all hover:scale-105"
  onClick={() => document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' })}
>
  Get Free Entry Ticket
</Button>
          </div>
        </div>
      </section>

      {/* --- Section 2: Participating Countries --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Focus Destinations</h2>
            <p className="text-muted-foreground">Explore opportunities in the worlds leading educational hubs.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country, index) => (
              <div key={index} className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer shadow-lg">
                <Image 
                  src={country.image} 
                  alt={country.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <h3 className="text-2xl font-bold text-white mb-1">{country.name}</h3>
                  <div className="flex items-center gap-2 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Sparkles className="h-4 w-4" /> {country.offer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Why Attend (Benefits) --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div>
              <Badge variant="outline" className="mb-4 text-blue-600 border-blue-200 bg-blue-50">Why Attend?</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                One Event, <br /> 
                <span className="text-blue-600">Infinite Possibilities</span>
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Stop browsing endlessly online. Meet the decision-makers directly and get your answers in minutes, not weeks.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg h-fit">
                      <benefit.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{benefit.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed mt-1">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="relative h-[500px] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <Image 
                 src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
                 alt="Students discussing"
                 fill
                 className="object-cover"
              />
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg max-w-[200px]">
                <p className="text-3xl font-bold text-blue-600">5,000+</p>
                <p className="text-xs text-slate-600 font-semibold uppercase">Students Placed Globally</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Section 4: Registration Area --- */}
      <section id="registration" className="py-24 bg-slate-900 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            
            {/* Left Side: CTA Content */}
            <div className="lg:w-2/5 bg-blue-600 p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-3xl font-bold mb-4">Secure Your Spot</h3>
                <p className="text-blue-100 mb-8 text-lg">
                  Pre-register to skip the queue and get a VIP consultation slot with your preferred university.
                </p>
                <ul className="space-y-4">
                  {["Free Entry Ticket", "Priority Counseling", "Gift Hamper", "Scholarship Guide E-book"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium">
                      <CheckCircle className="h-5 w-5 text-cyan-300" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Pattern Overlay */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-white">
              <form onSubmit={handleRegister} className="grid md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input placeholder="Enter your name" className="pl-10 bg-slate-50 border-slate-200" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Phone Number</label>
                  <Input placeholder="+880 1XXX XXXXXX" className="bg-slate-50 border-slate-200" required />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input type="email" placeholder="student@example.com" className="pl-10 bg-slate-50 border-slate-200" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Preferred Destination</label>
                  <Select>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">USA</SelectItem>
                      <SelectItem value="uk">UK</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="australia">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Current Education</label>
                  <Select>
                    <SelectTrigger className="bg-slate-50 border-slate-200">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hsc">HSC / A-Levels</SelectItem>
                      <SelectItem value="bachelor">Bachelors</SelectItem>
                      <SelectItem value="masters">Masters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 mt-4">
                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 text-lg">
                    Book My Free Ticket
                  </Button>
                  <p className="text-xs text-center text-slate-400 mt-4">
                    By registering, you agree to our terms and privacy policy.
                  </p>
                </div>

              </form>
            </div>

          </div>
        </div>
      </section>

      {/* --- Section 5: Universities Marquee (Optional Visual) --- */}
      <section className="py-12 border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-8">Participating Universities Include</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        
                <span className="text-2xl font-serif font-bold text-slate-800">Harvard</span>
                <span className="text-2xl font-serif font-bold text-slate-800">Oxford</span>
                <span className="text-2xl font-serif font-bold text-slate-800">Melbourne</span>
                <span className="text-2xl font-serif font-bold text-slate-800">Toronto</span>
                <span className="text-2xl font-serif font-bold text-slate-800">Manchester</span>
            </div>
        </div>
      </section>

    </div>
  );
}