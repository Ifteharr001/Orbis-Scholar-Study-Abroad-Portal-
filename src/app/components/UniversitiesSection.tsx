"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const UniversitiesSection = () => {
  const universities = [
    {
      id: 1,
      name: "Harvard University",
      location: "Cambridge, USA",
      image: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ranking: "#1 in USA",
      deadline: "Jan 15, 2025",
      daysLeft: 16,
      programs: ["Business", "Engineering", "Medicine"],
      rating: 4.9,
    },
    {
      id: 2,
      name: "University of Oxford",
      location: "Oxford, UK",
      image: "https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ranking: "#1 in UK",
      deadline: "Jan 22, 2025",
      daysLeft: 23,
      programs: ["Law", "Arts", "Sciences"],
      rating: 4.8,
    },
    {
      id: 3,
      name: "University of Toronto",
      location: "Toronto, Canada",
      image: "https://images.unsplash.com/photo-1569534402-bc1e9523d498?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ranking: "#1 in Canada",
      deadline: "Feb 1, 2025",
      daysLeft: 33,
      programs: ["Computer Science", "Business", "Engineering"],
      rating: 4.7,
    },
    {
      id: 4,
      name: "University of Melbourne",
      location: "Melbourne, Australia",
      image: "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      ranking: "#1 in Australia",
      deadline: "Feb 28, 2025",
      daysLeft: 60,
      programs: ["Architecture", "Design", "Sciences"],
      rating: 4.6,
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Top Destinations
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              Featured Universities
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Explore our partner universities with upcoming application deadlines
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/universities">
              View All Universities
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* University Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {universities.map((university) => (
            <Link
              href={`/university/${university.id}`}
              key={university.id}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={university.image}
                  alt={university.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute top-3 left-3">
                  <Badge className="bg-secondary text-secondary-foreground">
                    {university.ranking}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium">
                    <Star className="h-3 w-3 fill-warning text-warning" />
                    {university.rating}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
                  {university.name}
                </h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-4 w-4" />
                  {university.location}
                </div>

                {/* Programs */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {university.programs.slice(0, 2).map((program) => (
                    <span
                      key={program}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {program}
                    </span>
                  ))}
                  {university.programs.length > 2 && (
                    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      +{university.programs.length - 2}
                    </span>
                  )}
                </div>

                {/* Deadline */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="h-4 w-4 text-destructive" />
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-medium text-foreground">{university.deadline}</span>
                  </div>
                </div>

                <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">
                  Apply Now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;