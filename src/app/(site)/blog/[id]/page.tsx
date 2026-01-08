"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation"; // ID ধরার জন্য
import { Loader2, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NewsDetail {
  _id: string;
  title: string;
  content: string; // ফুল কন্টেন্ট
  image: string;
  category: string;
  createdAt: string;
}

export default function BlogDetailsPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/news/${id}`);
        const data = await res.json();
        setBlog(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin" /></div>;
  if (!blog) return <div className="text-center py-20">Blog not found</div>;

  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-8">
        <Image src={blog.image} alt={blog.title} fill className="object-cover" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Badge variant="secondary" className="px-3 py-1 flex items-center gap-1">
          <Tag className="w-3 h-3" /> {blog.category}
        </Badge>
        <span className="text-muted-foreground text-sm flex items-center gap-1">
          <Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">{blog.title}</h1>

      <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
        {blog.content}
      </div>
    </div>
  );
}