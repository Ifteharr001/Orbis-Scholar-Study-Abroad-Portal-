"use client";

import { GraduationCap, Globe, Clock, Award, AlertCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProgramCardProps {
  name: string;
  universityName: string;
  degree: string;
  language: string;
  duration: string;
  tuitionFee: string;
  accommodationFee: string;
  hasScholarship?: boolean;
  deadline?: string;      // ✅ নতুন যোগ করা হয়েছে
  intakes?: string[];     // ✅ নতুন যোগ করা হয়েছে
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
  deadline,
  intakes,
  onApply,
}: ProgramCardProps) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleApplyClick = () => {
    if (onApply) {
      onApply();
      return;
    }

    const params = new URLSearchParams({
      programName: name,
      universityName: universityName,
    });
    const targetUrl = `/apply?${params.toString()}`;

    if (!isAuthenticated) {
      router.push(`/userAuth?callbackUrl=${encodeURIComponent(targetUrl)}`);
    } else {
      router.push(targetUrl);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Left Side: Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          
          <p className="text-sm text-muted-foreground mb-3 font-medium">
            {universityName}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
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

          {/* ✅ New Section: Deadline & Intakes */}
          {(deadline || (intakes && intakes.length > 0)) && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-dashed border-border/60">
              {deadline && (
                <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 px-2 py-1 rounded border border-red-100">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span className="font-semibold">Deadline: {deadline}</span>
                </div>
              )}
              {intakes && intakes.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="font-semibold">
                    Intakes: {Array.isArray(intakes) ? intakes.join(", ") : intakes}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Fees & Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6 border-t lg:border-t-0 lg:border-l border-border pt-4 lg:pt-0 lg:pl-6">
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
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200 flex items-center gap-1">
                <Award className="h-3 w-3" />
                Scholarship
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