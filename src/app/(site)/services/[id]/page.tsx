"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ডাটা টাইপ ডিফাইন করা (আপনার নতুন মডেল অনুযায়ী)
interface ServiceDetail {
  _id: string;
  title: string;
  description: string;
  icon: string;
  gallery: string[]; // একাধিক ইমেজ
  sections: {
    heading: string;
    body: string;
  }[]; // একাধিক সেকশন
}

export default function ServiceDetailsPage() {
  // URL থেকে ID নেওয়া (যেমন: services/65c0...)
  const params = useParams();
  const id = params?.id as string;

  const [service, setService] = useState<ServiceDetail | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [relatedServices, setRelatedServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // ১. মেইন সার্ভিস ফেচ করা
        const res = await fetch(`/api/services/${id}`);
        if (!res.ok) throw new Error("Service not found");
        const data = await res.json();
        setService(data);

        // ২. রিলেটেড সার্ভিস ফেচ করা
        const resAll = await fetch("/api/services");
        const allData = await resAll.json();
        
        // বর্তমান সার্ভিস বাদ দিয়ে অন্য ৩টি র‍্যান্ডম বা প্রথম ৩টি সার্ভিস নেওয়া
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const related = allData.filter((s: any) => s._id !== id).slice(0, 3);
        setRelatedServices(related);

      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p className="text-muted-foreground">Loading service details...</p>
      </div>
    );
  }

  // যদি সার্ভিস না পাওয়া যায়
  if (!service) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold text-destructive">Service Not Found</h2>
        <p className="text-muted-foreground mt-2">The service you are looking for does not exist.</p>
        <Button className="mt-6" asChild>
          <Link href="/services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Hero Section (Title & Description) */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm uppercase tracking-wide">
            Premium Service
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            {service.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {service.description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-gradient-primary text-lg px-8">
              Book Free Consultation
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        
        {/* 2. Gallery Grid (ইমেজগুলো দেখাবে) */}
        {service.gallery && service.gallery.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {service.gallery.map((img, index) => (
              <div 
                key={index} 
                className="relative h-64 w-full rounded-2xl overflow-hidden shadow-sm border border-border group"
              >
                <Image 
                  src={img} 
                  alt={`${service.title} gallery image ${index + 1}`} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            ))}
          </div>
        )}

        {/* 3. Dynamic Sections (বিস্তারিত তথ্য) */}
        <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Left Content (Sections) */}
          <div className="lg:col-span-2 space-y-12">
            {service.sections?.map((section, index) => (
              <div key={index} className="prose prose-lg dark:prose-invert max-w-none">
                <h3 className="flex items-center gap-3 text-2xl font-bold text-foreground mb-4">
                  <CheckCircle2 className="text-primary h-6 w-6" />
                  {section.heading}
                </h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {section.body}
                </p>
              </div>
            ))}
          </div>

          {/* Right Sidebar (Quick Info Card) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-2xl p-6 shadow-lg">
              <h4 className="text-xl font-bold mb-4">Why Choose Us?</h4>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  98% Visa Success Rate
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  Expert Counselors
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2" />
                  Direct University Partnerships
                </li>
              </ul>
              <Button className="w-full" size="lg">Apply Now</Button>
            </div>
          </div>
        </div>

        {/* 4. Related Services Section */}
        <div className="border-t border-border mt-20 pt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Other Services You Might Need</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {relatedServices.map((item: any) => (
              <Link 
                key={item._id} 
                href={`/services/${item._id}`} 
                className="group block bg-card p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                  {item.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}