"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const images = [
  "https://images.unsplash.com/photo-1562774053-701939374585?w=600",
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600",
  "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=600",
  "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600",
  "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=600",
];

const videos = [
  {
    thumbnail: "https://images.unsplash.com/photo-1562774053-701939374585?w=400",
    title: "Campus Tour 2024",
    duration: "4:42",
  },
  {
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400",
    title: "Student Life at Beihang",
    duration: "3:15",
  },
];

const GallerySection = () => {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("images")}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-colors",
            activeTab === "images"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Images
        </button>
        <button
          onClick={() => setActiveTab("videos")}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-medium transition-colors",
            activeTab === "videos"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          Videos
        </button>
      </div>

      {/* Images Grid */}
      {activeTab === "images" && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setLightboxImage(image)}
              // Added 'relative' so Next.js Image 'fill' works correctly
              className="relative aspect-video rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image
                src={image}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </button>
          ))}
        </div>
      )}

      {/* Videos Grid */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((video, index) => (
            <div
              key={index}
              // Added 'relative' so Next.js Image 'fill' works correctly
              className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center group-hover:bg-foreground/50 transition-colors z-10">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                  <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-foreground/80 to-transparent z-10">
                <p className="text-background font-medium">{video.title}</p>
                <p className="text-background/80 text-sm">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox (Updated to use Next.js Image) */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 text-background hover:bg-background/20 rounded-full z-50"
          >
            <X className="h-6 w-6" />
          </button>
          
          {/* Wrapper div for Next.js Image with fill/contain */}
          <div className="relative w-full max-w-5xl h-[80vh] md:h-[90vh]">
            <Image
              src={lightboxImage}
              alt="Gallery full view"
              fill
              className="object-contain"
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GallerySection;