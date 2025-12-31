"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const NewsSection = () => {
  const news = [
    {
      id: 1,
      title: "Top 10 Scholarships for International Students in 2025",
      excerpt: "Discover the best scholarship opportunities available for international students studying abroad this year.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "Dec 28, 2024",
      category: "Scholarships",
    },
    {
      id: 2,
      title: "New Partnership with Top Australian Universities",
      excerpt: "We're excited to announce our new partnerships with leading universities across Australia.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "Dec 25, 2024",
      category: "News",
    },
    {
      id: 3,
      title: "How to Prepare for Your Student Visa Interview",
      excerpt: "Essential tips and strategies to help you ace your student visa interview and secure approval.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      date: "Dec 22, 2024",
      category: "Tips",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Latest Updates
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2">
              News & Resources
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg">
              Stay updated with the latest news, tips, and resources for studying abroad
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/blog">
              View All Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article) => (
            <article
              key={article.id}
              className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary">{article.category}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground line-clamp-2 mb-4">
                  {article.excerpt}
                </p>
                <Link
                  href={`/blog/${article.id}`}
                  className="inline-flex items-center text-primary font-medium hover:gap-2 transition-all"
                >
                  Read More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;