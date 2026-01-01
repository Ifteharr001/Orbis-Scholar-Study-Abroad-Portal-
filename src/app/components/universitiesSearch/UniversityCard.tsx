import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IUniversity } from "@/models/University";

interface Props {
  university: IUniversity;
}

export default function UniversityCard({ university }: Props) {
  return (
    <Link href={`/university/${university._id}`} className="block">
      <div className="group rounded-2xl bg-card border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <Image
            src={university.image || university.heroImage || "/placeholder.jpg"}
            alt={university.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Top-left badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs px-2 py-1">
              {university.ranking || (university.country ? `#1 in ${university.country}` : "Top Ranked")}
            </Badge>
          </div>

          {/* Top-right rating */}
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-xs font-medium shadow-md">
              <Star className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold">{typeof university.rating === 'number' ? university.rating.toFixed(1) : (university.rating ?? 'N/A')}</span>
            </div>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">{university.name}</h3>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <MapPin className="h-4 w-4" />
            <span>{university.location}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {university.programs?.slice(0,3).map((p, i) => (
              <span key={i} className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">{typeof p === 'string' ? p : p.name || p.degree || 'Program'}</span>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-destructive" />
              <span className="text-muted-foreground">Deadline:</span>
              <span className="font-medium text-foreground">{university.deadline || 'Open'}</span>
            </div>
          </div>

          <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90 transition-opacity">Apply Now</Button>
        </div>
      </div>
    </Link>
  );
}
