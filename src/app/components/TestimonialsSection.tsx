"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const TestimonialsSection = () => {
  const [activeTab, setActiveTab] = useState<"students" | "partners">("students");
  const [currentIndex, setCurrentIndex] = useState(0);

  const studentTestimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "MBA Student at Harvard",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "StudyAbroad made my dream of studying at Harvard a reality. Their guidance throughout the application process was invaluable. I couldn't have done it without their support!",
      country: "USA",
    },
    {
      id: 2,
      name: "James Chen",
      role: "Engineering Student at Oxford",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "The team helped me secure a full scholarship and guided me through every step. Their expertise in UK admissions is unmatched. Highly recommended!",
      country: "UK",
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Computer Science at Toronto",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "From visa support to finding accommodation, StudyAbroad was with me every step of the way. They truly care about their students' success.",
      country: "Canada",
    },
  ];

  const partnerTestimonials = [
    {
      id: 1,
      name: "Dr. Michael Brown",
      role: "Admissions Director, MIT",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "StudyAbroad consistently sends us well-prepared, high-quality candidates. Their pre-screening process and guidance to students make our job easier.",
      country: "USA",
    },
    {
      id: 2,
      name: "Prof. Emily Carter",
      role: "International Coordinator, Cambridge",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      quote: "Our partnership with StudyAbroad has brought exceptional international students to our institution. Their professionalism is outstanding.",
      country: "UK",
    },
  ];

  const testimonials = activeTab === "students" ? studentTestimonials : partnerTestimonials;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            What People Say About Us
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-10">
          <Button
            variant={activeTab === "students" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("students");
              setCurrentIndex(0);
            }}
            className={activeTab === "students" ? "bg-gradient-primary" : ""}
          >
            Student Reviews
          </Button>
          <Button
            variant={activeTab === "partners" ? "default" : "outline"}
            onClick={() => {
              setActiveTab("partners");
              setCurrentIndex(0);
            }}
            className={activeTab === "partners" ? "bg-gradient-primary" : ""}
          >
            Partner Testimonials
          </Button>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary shadow-lg">
                <Quote className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Avatar */}
              <div className="shrink-0">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  width={96}
                  height={96}
                  className="h-24 w-24 rounded-full object-cover border-4 border-primary/20"
                />
              </div>

              {/* Content */}
              <div className="text-center md:text-left">
                <p className="text-lg text-foreground leading-relaxed mb-6">
                 &ldquo;{testimonials[currentIndex].quote}&rdquo;
                </p>
                <div>
                  <h4 className="font-display text-xl font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-muted-foreground">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center md:justify-end gap-3 mt-8">
              <button
                onClick={prevSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex ? "w-8 bg-primary" : "w-2 bg-muted"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;