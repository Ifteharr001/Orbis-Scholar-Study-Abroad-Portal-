import { MapPin, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoSidebarProps {
  institutionName: string;
  location: string;
}

const InfoSidebar = ({ institutionName, location }: InfoSidebarProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 h-fit shadow-sm">
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

        {/* Call to Action (CTA) */}
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-foreground font-medium mb-4 text-center">
            Are you ready to start building your future?
          </p>
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity font-semibold">
            <Phone className="h-4 w-4 mr-2" />
            Contact Admission Counsellor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoSidebar;