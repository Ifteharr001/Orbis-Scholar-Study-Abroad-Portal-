"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Play } from "lucide-react";
import { cn } from "@/lib/utils";

// ভিডিও ডাটার জন্য ইন্টারফেস
interface Video {
  thumbnail: string;
  title: string;
  duration: string;
  videoUrl?: string; // অপশনাল
}

// প্রপস ইন্টারফেস
interface GallerySectionProps {
  images?: string[]; // ইমেজের লিঙ্কের অ্যারে
  videos?: Video[];  // ভিডিও অবজেক্টের অ্যারে
}

const GallerySection = ({ images = [], videos = [] }: GallerySectionProps) => {
  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // যদি কোনো ইমেজ বা ভিডিও না থাকে, তবে কিছুই দেখাবে না (অথবা মেসেজ দেখাতে পারেন)
  if (images.length === 0 && videos.length === 0) {
    return <div className="text-muted-foreground">No gallery items available.</div>;
  }

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
        <>
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxImage(image)}
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
          ) : (
            <p className="text-muted-foreground">No images found.</p>
          )}
        </>
      )}

      {/* Videos Grid */}
      {activeTab === "videos" && (
        <>
          {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((video, index) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={video.thumbnail || "/placeholder-video.jpg"}
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
          ) : (
            <p className="text-muted-foreground">No videos found.</p>
          )}
        </>
      )}

      {/* Lightbox */}
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