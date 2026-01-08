"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, FileCheck, Plane, Briefcase, 
  BookOpen, Users, ArrowRight, Loader2, Sparkles 
} from "lucide-react"; 
import { Button } from "@/components/ui/button";

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

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

const ServicesSection = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/services");
        const data = await res.json();
        setServices(data.slice(0, 6)); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <div className="py-20 text-center flex justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">What We Offer</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">Our Services</h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Comprehensive support at every step of your study abroad journey
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
    
            const IconComponent = iconMap[service.icon] || iconMap.default;

            return (
              <Link
                key={service._id}
                href={`/services/${service._id}`} 
                className="group rounded-2xl bg-card border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconComponent className="h-7 w-7" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                  {service.description}
                </p>
                <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-primary hover:opacity-90" asChild>
            <Link href="/services">
              View All Services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;