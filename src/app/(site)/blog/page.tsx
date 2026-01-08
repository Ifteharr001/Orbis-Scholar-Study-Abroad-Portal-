"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface NewsItem {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  createdAt: string;
}

export default function BlogPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        setNews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-10 text-center">All Articles & News</h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {news.map((item) => (
          <Link href={`/blog/${item._id}`} key={item._id} className="group block border rounded-xl overflow-hidden hover:shadow-xl transition">
            <div className="relative h-60">
              <Image src={item.image} alt={item.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
            </div>
            <div className="p-6">
              <Badge className="mb-2">{item.category}</Badge>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary">{item.title}</h2>
              <p className="text-muted-foreground line-clamp-3">{item.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}