"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IUniversity } from "@/models/University";

const UniversitiesSection = () => {
  const [universities, setUniversities] = useState<IUniversity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await fetch("/api/universities");
        const data = await response.json();
        setUniversities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setUniversities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              Loading universities...
            </div>
          ) : universities?.length > 0 ? (
            universities.map((university) => (
              <Link
                href={`/university/${university._id}`}
                key={String(university._id)}
                className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={university.image || university.heroImage || "https://images.unsplash.com/photo-1562774053-701939374585"}
                    alt={university.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="text-xs">
                      {university.ranking || university.country || "Top Ranked"}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <div className="flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium">
                      <Star className="h-3 w-3 text-warning" />
                      {typeof university.rating === 'number' ? university.rating.toFixed(1) : (university.rating ?? 'N/A')}
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
                    {university.programs?.slice(0, 2).map((program, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {typeof program === "object" ? program.name : program}
                      </span>
                    ))}
                    {university.programs && university.programs.length > 2 && (
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
                      <span className="font-medium text-foreground">
                        {university.deadline || "Open"}
                      </span>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">
                    Apply Now
                  </Button>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-muted-foreground">
              No universities found. Please add data via Thunder Client.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UniversitiesSection;