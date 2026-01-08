"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, FileCheck, Plane, Briefcase, BookOpen, Users, ArrowRight, Sparkles, Loader2 } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: any = {
    
  graduation: GraduationCap,
  visa: FileCheck,
  scholarship: BookOpen,
  career: Briefcase,
  airport: Plane,
  support: Users,
  default: Sparkles,
};

export default function AllServicesPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Premium Services</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">We provide end-to-end support for students aspiring to study abroad.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon] || iconMap.default;
          return (
            <Link
              key={service._id}
              href={`/services/${service._id}`}
              className="group rounded-2xl bg-card border border-border p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6 group-hover:scale-110 transition-transform">
                <IconComponent className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <span className="text-primary font-medium flex items-center">Read Details <ArrowRight className="ml-2 w-4 h-4" /></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}