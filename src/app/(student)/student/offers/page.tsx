"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X, Download, HelpCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

// ডাটা টাইপ ইন্টারফেস
interface Offer {
  _id: string; // MongoDB ID
  universityName: string;
  course: string;
  status: string;
  scholarship: string;
  expiryDate: string;
  tuitionFee: string;
  location: string;
  duration: string;
  startDate: string;
  accommodation: string;
  workPermit: string;
}

export default function OffersPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // ১. স্টেট ম্যানেজমেন্ট
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]); // number[] থেকে string[] করা হলো (_id এর জন্য)
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  // ২. ডাটা ফেচ করা
  useEffect(() => {
    const fetchOffers = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/student/offers");
          const data = await res.json();
          if (Array.isArray(data)) {
            setOffers(data);
          }
        } catch (error) {
          console.error("Failed to fetch offers", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOffers();
  }, [isAuthenticated]);

  // স্ট্যাটাস কালার হেল্পার
  const getStatusColor = (status: string) => {
    if (status.includes("Conditional") || status.includes("Offer") || status.includes("Approved")) {
      return "text-green-600 dark:text-green-400";
    }
    if (status.includes("Waiting")) {
      return "text-orange-500 dark:text-orange-400";
    }
    return "text-foreground";
  };

  const toggleOfferSelection = (offerId: string) => {
    setSelectedOffers((prev) =>
      prev.includes(offerId)
        ? prev.filter((id) => id !== offerId)
        : [...prev, offerId]
    );
  };

  const handleCompare = () => {
    if (selectedOffers.length >= 2) {
      setCompareDialogOpen(true);
    }
  };

  const selectedOffersData = offers.filter((offer) =>
    selectedOffers.includes(offer._id)
  );

  // লোডিং স্টেট
  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Offers & Scholarships</h1>
          <p className="text-muted-foreground">Review, compare, and accept or decline your offers.</p>
        </div>
        <Button 
          variant="outline" 
          className="border-border text-foreground"
          onClick={handleCompare}
          disabled={selectedOffers.length < 2}
        >
          Compare Offers ({selectedOffers.length})
        </Button>
      </div>

      {/* Selection hint */}
      {selectedOffers.length < 2 && offers.length > 1 && (
        <p className="text-sm text-muted-foreground mb-4">
          Select at least 2 offers to compare
        </p>
      )}

      {/* Offers Grid */}
      {offers.length === 0 ? (
         <div className="text-center py-10 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No offers received yet.</p>
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-card rounded-lg border border-border p-6 shadow-sm">
              {/* Selection Checkbox */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedOffers.includes(offer._id)}
                    onCheckedChange={() => toggleOfferSelection(offer._id)}
                    className="mt-1"
                  />
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{offer.universityName}</h2>
                    <p className="text-sm text-muted-foreground">{offer.course}</p>
                  </div>
                </div>
                <span className={cn("text-sm font-medium", getStatusColor(offer.status))}>
                  {offer.status}
                </span>
              </div>

              {/* Scholarship */}
              <div className="mb-3 ml-7">
                <p className="text-xs text-muted-foreground font-medium">Scholarship</p>
                <p className={cn("text-sm", offer.scholarship && offer.scholarship !== "N/A" ? "text-cyan-600 dark:text-cyan-400 font-medium" : "text-muted-foreground")}>
                  {offer.scholarship || "N/A"}
                </p>
              </div>

              {/* Expiry Date */}
              <div className="mb-6 ml-7">
                <p className="text-xs text-muted-foreground font-medium">Expiry Date</p>
                <p className={cn("text-sm", offer.expiryDate && offer.expiryDate !== "N/A" ? "text-foreground" : "text-muted-foreground")}>
                  {offer.expiryDate || "N/A"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 ml-7">
                <Button 
                  size="sm" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                >
                  Accept Offer
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground text-xs hover:text-foreground px-2 h-8"
                >
                  <Download className="w-3 h-3 mr-1.5" />
                  Letter
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-cyan-600 dark:text-cyan-400 text-xs hover:bg-cyan-50 dark:hover:bg-cyan-900/20 px-2 h-8"
                >
                  <HelpCircle className="w-3 h-3 mr-1.5" />
                  Clarify
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compare Offers</DialogTitle>
          </DialogHeader>
          
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Feature</th>
                  {selectedOffersData.map((offer) => (
                    <th key={offer._id} className="text-left py-3 px-4 text-sm font-semibold text-foreground">
                      {offer.universityName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Program</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm text-foreground">{offer.course}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Status</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className={cn("py-3 px-4 text-sm font-medium", getStatusColor(offer.status))}>
                      {offer.status}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Tuition Fee</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm text-foreground">{offer.tuitionFee || "N/A"}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Scholarship</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className={cn("py-3 px-4 text-sm", offer.scholarship !== "N/A" ? "text-cyan-600 dark:text-cyan-400 font-medium" : "text-muted-foreground")}>
                      {offer.scholarship || "N/A"}
                    </td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Location</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm text-foreground">{offer.location || "N/A"}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Duration</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm text-foreground">{offer.duration || "N/A"}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Start Date</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm text-foreground">{offer.startDate || "N/A"}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Accommodation</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm text-foreground">{offer.accommodation}</td>
                  ))}
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3 px-4 text-sm text-muted-foreground">Work Permit</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className="py-3 px-4 text-sm">
                      {offer.workPermit === "Yes" ? (
                        <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <X className="h-5 w-5 text-red-500" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-muted-foreground">Expiry Date</td>
                  {selectedOffersData.map((offer) => (
                    <td key={offer._id} className={cn("py-3 px-4 text-sm", offer.expiryDate !== "N/A" ? "text-foreground" : "text-muted-foreground")}>
                      {offer.expiryDate || "N/A"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}