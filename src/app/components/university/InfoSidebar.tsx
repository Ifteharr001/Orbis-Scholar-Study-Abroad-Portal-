import { MapPin, Phone, Building, Calendar, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ ইন্টারফেস আপডেট করা হয়েছে যাতে প্যারেন্ট কম্পোনেন্ট থেকে ডাটা আসলে এরর না দেয়
interface InfoSidebarProps {
  institutionName: string;
  location: string;
  deadline?: string;      // নতুন: ডেডলাইন (Optional)
  intakes?: string[];     // নতুন: ইনটেক অ্যারে (Optional)
  tuitionRange?: string;  // নতুন: টিউশন ফি (Optional)
}

const InfoSidebar = ({ 
  institutionName, 
  location, 
  deadline, 
  intakes, 
  tuitionRange 
}: InfoSidebarProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 h-fit shadow-sm sticky top-24">
      <div className="space-y-6">
        
        {/* Institution Name */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Institution
          </p>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Building className="h-4 w-4 text-primary flex-shrink-0" />
            </div>
            <p className="font-semibold text-foreground leading-tight">
              {institutionName}
            </p>
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Location
          </p>
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
            </div>
            <p className="text-foreground leading-tight">{location}</p>
          </div>
        </div>

        {/* ✅ Deadline (যদি ডাটা থাকে তবেই দেখাবে) */}
        {deadline && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
              Next Deadline
            </p>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-red-50 border border-red-100">
                <Clock className="h-4 w-4 text-red-600 flex-shrink-0" />
              </div>
              <p className="text-foreground leading-tight font-medium text-sm mt-1">
                {deadline}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Intakes (যদি ডাটা থাকে তবেই দেখাবে) */}
        {intakes && intakes.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
              Available Intakes
            </p>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-blue-50 border border-blue-100">
                <Calendar className="h-4 w-4 text-blue-600 flex-shrink-0" />
              </div>
              <p className="text-foreground leading-tight text-sm mt-1">
                {Array.isArray(intakes) ? intakes.join(", ") : intakes}
              </p>
            </div>
          </div>
        )}

        {/* ✅ Tuition Range (যদি ডাটা থাকে তবেই দেখাবে) */}
        {tuitionRange && (
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
              Avg. Tuition Fee
            </p>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-50 border border-green-100">
                <DollarSign className="h-4 w-4 text-green-600 flex-shrink-0" />
              </div>
              <p className="text-foreground leading-tight text-sm mt-1">
                {tuitionRange}
              </p>
            </div>
          </div>
        )}

        {/* Call to Action (CTA) */}
        <div className="pt-6 border-t border-border mt-2">
          <p className="text-sm text-foreground font-medium mb-4 text-center">
            Are you ready to start building your future?
          </p>
          <Button className="w-full font-semibold">
            <Phone className="h-4 w-4 mr-2" />
            Contact Admission Counsellor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoSidebar;