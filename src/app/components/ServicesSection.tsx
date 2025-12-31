"use client";

import Link from "next/link";
import { 
  GraduationCap, 
  FileCheck, 
  Plane, 
  Briefcase, 
  BookOpen, 
  Users,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ServicesSection = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Admission Assistance",
      description: "Complete guidance from university selection to application submission with expert support.",
      href: "/services/admission",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: FileCheck,
      title: "Visa Support",
      description: "Expert assistance with visa documentation, interviews, and application processes.",
      href: "/services/visa",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: BookOpen,
      title: "Scholarship Guidance",
      description: "Find and apply for scholarships that match your academic profile and financial needs.",
      href: "/services/scholarship",
      color: "bg-success/10 text-success",
    },
    {
      icon: Briefcase,
      title: "Career Counseling",
      description: "Professional guidance to help you choose the right career path and course of study.",
      href: "/services/career",
      color: "bg-info/10 text-info",
    },
    {
      icon: Plane,
      title: "Airport Pickup",
      description: "Complimentary airport pickup service to ensure a smooth arrival at your destination.",
      href: "/services/airport",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: Users,
      title: "Student Support",
      description: "24/7 support for all your queries before, during, and after your study abroad journey.",
      href: "/services/support",
      color: "bg-destructive/10 text-destructive",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            What We Offer
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Our Services
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Comprehensive support at every step of your study abroad journey, from application to arrival
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.title}
              href={service.href}
              className="group rounded-2xl bg-card border border-border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.color} mb-5`}>
                <service.icon className="h-7 w-7" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>
              <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                Learn More
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;