"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Handshake, 
  Globe2, 
  TrendingUp, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function PartnerPage() {
  
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Request Sent! Our partnership team will contact you.");
  };

  const benefits = [
    {
      icon: Users,
      title: "Access to High-Quality Students",
      desc: "Connect with thousands of pre-screened, qualified students actively looking for study abroad opportunities."
    },
    {
      icon: TrendingUp,
      title: "Increased Brand Visibility",
      desc: "Showcase your institution to a global audience through our expos, webinars, and digital platforms."
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      desc: "Get access to recruitment trends and student analytics to optimize your enrollment strategy."
    },
    {
      icon: Handshake,
      title: "Dedicated Support Team",
      desc: "Our expert counselors work as an extension of your team to ensure high conversion rates."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* --- Section 1: Hero Banner --- */}
      <section className="relative py-24 overflow-hidden bg-slate-900 text-white">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1600&q=80" 
            alt="Partnership Background" 
            fill 
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/0 to-slate-900/90" />
        </div>

        <div className="container relative z-10 px-4 text-center">
          <Badge variant="outline" className="mb-6 text-blue-400 border-blue-400/30 px-4 py-1">
            Grow With Us
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 leading-tight">
            Partner with <span className="text-blue-500">Orbis Scholar</span> <br />
            Expand Your Global Reach
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join our network of 500+ global universities and institutions. Together, lets shape the future of international education and empower the next generation of leaders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-12 px-8 text-lg" onClick={() => document.getElementById('partner-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Become a Partner
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white/20 bg-transparent h-12 px-8 text-lg">
              View Success Stories
            </Button>
          </div>
        </div>
      </section>

      {/* --- Section 2: Stats --- */}
      <section className="py-10 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Partner Universities", value: "200+" },
              { label: "Student Applications", value: "15k+" },
              { label: "Countries Covered", value: "25+" },
              { label: "Years of Excellence", value: "10+" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Why Partner With Us --- */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Collaborate with Orbis Scholar?</h2>
            <p className="text-slate-600">
              We bridge the gap between ambitious students and world-class institutions through technology, expertise, and personalized counseling.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((item, index) => (
              <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8 flex items-start gap-6">
                  <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                    <item.icon className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 4: Who We Work With --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
                alt="Business Meeting"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-blue-900/10" />
            </div>

            {/* Right Content */}
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Who Can Join Our Network?</h2>
              <p className="text-slate-600 mb-8 text-lg">
                Whether you represent a university or a recruitment agency, we have tailored solutions for you.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Universities & Colleges</h3>
                    <p className="text-slate-500 mt-2">
                      Recruit diverse and qualified students from emerging markets with verified academic backgrounds.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="mt-1">
                    <Globe2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Education Agents</h3>
                    <p className="text-slate-500 mt-2">
                      Access our portfolio of 500+ institutions and use our portal to process applications faster.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Service Providers</h3>
                    <p className="text-slate-500 mt-2">
                      Accommodation, insurance, and travel partners looking to serve international students.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Section 5: Partnership Form --- */}
      <section id="partner-form" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-blue-600 p-8 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">Lets Build a Partnership</h2>
              <p className="text-blue-100">Fill out the form below and our partnerships team will get back to you within 24 hours.</p>
            </div>
            
            <form onSubmit={handlePartnerSubmit} className="p-8 md:p-12 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Organization Name *</label>
                  <Input placeholder="University / Company Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Website URL</label>
                  <Input placeholder="https://example.com" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Contact Person *</label>
                  <Input placeholder="Full Name" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Job Title</label>
                  <Input placeholder="e.g. Admission Director" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Work Email *</label>
                  <Input type="email" placeholder="email@organization.com" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <Input placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Partnership Type</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                  <option>University / Institution</option>
                  <option>Recruitment Partner / Agent</option>
                  <option>Service Provider (Housing/Finance)</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Message</label>
                <Textarea placeholder="Tell us how you would like to collaborate..." rows={4} />
              </div>

              <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-bold">
                Submit Partnership Request <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}