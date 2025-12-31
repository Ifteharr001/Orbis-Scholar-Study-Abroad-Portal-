"use client";

import { useState } from "react";
import { Search, GraduationCap, BookOpen, Award, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import HeroImageCarousel from "./HeroImageCarousel";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const programTypes = [
    { icon: GraduationCap, label: "Bachelor", color: "bg-primary" },
    { icon: BookOpen, label: "Masters", color: "bg-secondary" },
    { icon: Award, label: "PhD", color: "bg-green-600" }, // success color fix
    { icon: FileText, label: "Diploma", color: "bg-blue-500" }, // info color fix
  ];

  const intakeDates = [
    "Spring 2025",
    "Fall 2025",
    "Spring 2026",
    "Fall 2026",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <div className="container relative py-16 lg:py-24 mx-auto px-4">
       <div className="grid gap-12 lg:grid-cols-[55%_45%] lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                #1 Study Abroad Consultancy
              </span>
              <h1 className="font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Your Gateway to{" "}
                <span className="text-gradient">Global Education</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Unlock world-class education opportunities. We connect ambitious students with top universities across the globe.
              </p>
            </div>

            {/* Search Box */}
            <div className="rounded-2xl bg-card p-6 shadow-lg border border-border">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Search Universities
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="University name, course, or country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Intake
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intake" />
                    </SelectTrigger>
                    <SelectContent>
                      {intakeDates.map((date) => (
                        <SelectItem key={date} value={date.toLowerCase().replace(" ", "-")}>
                          {date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">
                <Search className="h-4 w-4 mr-2" />
                Find Universities
              </Button>
            </div>

            {/* Program Type Badges */}
            <div className="flex flex-wrap gap-3">
              {programTypes.map((program) => (
                <button
                  key={program.label}
                  className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-sm border border-border hover:border-primary transition-colors"
                >
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full ${program.color}`}>
                    <program.icon className="h-3.5 w-3.5 text-white" />
                  </span>
                  {program.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl opacity-20 blur-2xl transform rotate-6" />
              <HeroImageCarousel />
              
              {/* Floating Cards */}
              <div className="absolute -left-8 top-1/4 animate-float">
                <div className="rounded-xl bg-card p-4 shadow-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">500+</p>
                      <p className="text-xs text-muted-foreground">Universities</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -right-8 bottom-1/4 animate-float" style={{ animationDelay: "2s" }}>
                <div className="rounded-xl bg-card p-4 shadow-lg border border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10">
                      <Award className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">98%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;