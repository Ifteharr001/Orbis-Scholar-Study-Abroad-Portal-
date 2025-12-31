import { MapPin, Phone, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InfoSidebarProps {
  institutionName: string;
  location: string;
}

const InfoSidebar = ({ institutionName, location }: InfoSidebarProps) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Institution</p>
          <div className="flex items-start gap-2">
            <Building className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
            <p className="font-semibold text-foreground">{institutionName}</p>
          </div>
        </div>

        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Location</p>
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
            <p className="text-foreground">{location}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-foreground font-medium mb-4">
            Are you ready to start building your future?
          </p>
          <Button className="w-full bg-gradient-primary hover:opacity-90">
            <Phone className="h-4 w-4 mr-2" />
            Contact Admission Counsellor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InfoSidebar;