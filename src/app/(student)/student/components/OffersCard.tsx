"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, ArrowRight, Sparkles } from "lucide-react";

interface Application {
  status: string;
}

const OffersCard = ({ applications = [] }: { applications: Application[] }) => {
  
  const offerCount = applications.filter(
    (app) => 
      app.status === "Offer Received" || 
      app.status === "Approved" || 
      app.status === "Conditional Offer"
  ).length;

  const hasOffers = offerCount > 0;

  return (
    <Card className="border-border shadow-sm flex flex-col relative overflow-hidden">

      {hasOffers && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl" />
      )}

      <CardContent className="p-6 flex flex-col h-full justify-between">
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-lg ${hasOffers ? "bg-yellow-100 text-yellow-600" : "bg-muted text-muted-foreground"}`}>
               {hasOffers ? <Gift className="h-6 w-6" /> : <Gift className="h-6 w-6 opacity-50" />}
            </div>
            {hasOffers && <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />}
          </div>

          <h3 className="text-lg font-bold text-foreground">
            {hasOffers ? "Congratulations! 🎉" : "No Offers Yet"}
          </h3>
          
          <div className="mt-2 text-sm text-muted-foreground">
            {hasOffers ? (
              <p>
                You have received <span className="font-bold text-foreground text-lg mx-1">{offerCount}</span> 
                offer{offerCount > 1 ? "s" : ""} from universities.
              </p>
            ) : (
              <p>
                Your applications are being reviewed. Good news is on the way!
              </p>
            )}
          </div>
        </div>

      <Button 
  asChild 
  className={`w-full mt-6 text-white ${hasOffers ? "bg-primary hover:bg-yellow-600 border-none" : "bg-primary hover:bg-primary/90"}`}
  variant={hasOffers ? "default" : "outline"}
>
  <Link href="/student/applications"> 
      {hasOffers ? "View Your Offers" : "Track Applications"}
      <ArrowRight className="ml-2 h-4 w-4" />
  </Link>
</Button>
      </CardContent>
    </Card>
  );
};

export default OffersCard;