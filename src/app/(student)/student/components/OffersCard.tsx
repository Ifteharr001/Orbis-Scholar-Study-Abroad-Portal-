"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

// ১. টাইপ ইন্টারফেস
interface Application {
  status: string;
}

const OffersCard = ({ applications = [] }: { applications: Application[] }) => {
  
  // ২. শুধুমাত্র অফার পাওয়া অ্যাপ্লিকেশনগুলো গণনা করা
  const offerCount = applications.filter(
    (app) => app.status === "Offer Received" || app.status === "Approved"
  ).length;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">My Offers</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          {/* ৩. কন্ডিশনাল রেন্ডারিং: অফার থাকলে সংখ্যা দেখাবে, না থাকলে মেসেজ */}
          {offerCount > 0 ? (
            <p className="text-sm text-muted-foreground">
              You have <span className="font-semibold text-foreground">{offerCount} new offer{offerCount > 1 ? "s" : ""}</span> waiting for review.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              No offers received yet. Keep checking!
            </p>
          )}
        </div>
        
        <Button asChild variant="outline" className="w-full border-border hover:bg-muted text-foreground">
          <Link href="/student/offers">
            View Offers
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default OffersCard;