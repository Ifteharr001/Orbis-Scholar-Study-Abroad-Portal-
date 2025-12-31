"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

// Importing images
import heroImg1 from "@/assets/hero-img1.jpg";
import heroImg2 from "@/assets/hero-img2.jpg";
import heroImg3 from "@/assets/hero-img3.jpg";

type HeroImageCarouselProps = {
  className?: string;
};

const HeroImageCarousel = ({ className }: HeroImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(
    () => [
      {
        src: heroImg1,
        alt: "Group of students studying abroad together on campus",
      },
      {
        src: heroImg2,
        alt: "Scholarship students smiling together in a study abroad program",
      },
      {
        src: heroImg3,
        alt: "International students walking on a university campus abroad",
      },
    ],
    [],
  );

  useEffect(() => {
    if (!api || paused) return;

    const id = window.setInterval(() => {
      api.scrollNext();
    }, 4500);

    return () => window.clearInterval(id);
  }, [api, paused]);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl shadow-2xl border border-border",
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Carousel
        setApi={setApi} // <--- FIX: Arrow function soriye direct setApi dilam
        opts={{ loop: true, align: "start" }}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.alt} className="pl-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                // FIX: aspect-[4/5] warning remove kore aspect-4/5 dilam
                className="w-full object-cover aspect-4/5" 
                priority={true}
                quality={100}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroImageCarousel;