"use client";

import { GraduationCap, Globe, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProgramCardProps {
  name: string;
  universityName: string; // University Name গ্রহণ করার জন্য
  degree: string;
  language: string;
  duration: string;
  tuitionFee: string;
  accommodationFee: string;
  hasScholarship?: boolean;
  onApply?: () => void;
}

const ProgramCard = ({
  name,
  universityName,
  degree,
  language,
  duration,
  tuitionFee,
  accommodationFee,
  hasScholarship = true,
  onApply,
}: ProgramCardProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleApplyClick = () => {
    // ১. কাস্টম অন-ক্লিক থাকলে সেটা রান করবে
    if (onApply) {
      onApply();
      return;
    }

    // ২. লগইন না থাকলে লগইন পেজে পাঠাবে
    if (!isAuthenticated) {
      router.push("/userAuth");
    } else {
      // ৩. লগইন থাকলে অ্যাপ্লাই পেজে পাঠাবে এবং সাথে ডেটা নিয়ে যাবে
      // URLSearchParams ব্যবহার করা হয়েছে যাতে স্পেস বা স্পেশাল ক্যারেক্টার নিয়ে সমস্যা না হয়
      const params = new URLSearchParams({
        programName: name,
        universityName: universityName,
      });

      router.push(`/apply?${params.toString()}`);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          {/* Program Name */}
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          
          {/* University Name (Show here) */}
          <p className="text-sm text-muted-foreground mb-3 font-medium">
            {universityName}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal">
              <GraduationCap className="h-3.5 w-3.5 text-primary" />
              {degree}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal">
              <Globe className="h-3.5 w-3.5 text-primary" />
              {language}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1.5 text-xs font-normal">
              <Clock className="h-3.5 w-3.5 text-primary" />
              {duration}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
          <div className="flex gap-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Tuition Fees</p>
              <p className="text-lg font-semibold text-primary">{tuitionFee}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Accommodation</p>
              <p className="text-lg font-semibold text-primary">{accommodationFee}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasScholarship && (
              <Badge className="bg-secondary text-secondary-foreground flex items-center gap-1">
                <Award className="h-3 w-3" />
                Scholarship Available
              </Badge>
            )}
            <Button onClick={handleApplyClick} className="bg-gradient-primary hover:opacity-90">
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramCard;