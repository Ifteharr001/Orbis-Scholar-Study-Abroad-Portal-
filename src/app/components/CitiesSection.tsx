"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CitiesSection = () => {
  const cities = [
    {
      name: "New York",
      country: "USA",
      universities: 85,
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "London",
      country: "UK",
      universities: 72,
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Toronto",
      country: "Canada",
      universities: 45,
      image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Sydney",
      country: "Australia",
      universities: 38,
      image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Berlin",
      country: "Germany",
      universities: 52,
      image: "https://images.unsplash.com/photo-1560969184-10fe8719e047?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
    {
      name: "Dubai",
      country: "UAE",
      universities: 28,
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Popular Destinations
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
            Find Universities by City
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Explore top study destinations around the world and discover universities in your dream city
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city, index) => (
            <Link
              key={city.name}
              href={`/destinations/${city.country.toLowerCase()}`}
              className={`group relative overflow-hidden rounded-2xl ${
                index === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 0 ? "h-[400px] lg:h-full" : "h-48"}`}>
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-bold text-primary-foreground">
                        {city.name}
                      </h3>
                      <p className="text-primary-foreground/80 text-sm">
                        {city.country} • {city.universities} Universities
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur group-hover:bg-primary transition-colors">
                      <ArrowRight className="h-5 w-5 text-primary-foreground group-hover:text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CitiesSection;