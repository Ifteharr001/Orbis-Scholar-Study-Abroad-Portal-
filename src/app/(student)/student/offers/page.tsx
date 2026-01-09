"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, X, Download, HelpCircle, Loader2, ArrowRightLeft, Gift, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface Offer {
  _id: string;
  universityName: string;
  programName: string;
  status: string;
  scholarship?: string;
  expiryDate?: string;
  tuitionFee?: string;
  location?: string;
  duration?: string;
  startDate?: string;
  accommodation?: string;
  workPermit?: string; // "Yes" | "No" or boolean
}

export default function OffersPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOffers = async () => {
      if (isAuthenticated && user?.email) { 
        try {
          const res = await fetch(`/api/student/offers?email=${user.email}`);
          const result = await res.json();

          if (result.success && Array.isArray(result.data)) {
            setOffers(result.data);
          } else {
             // Handle case where API returns success: false or invalid format
             console.error("Invalid data format:", result);
             toast.error("Failed to load offers.");
          }

        } catch (error) {
          console.error("Failed to fetch offers", error);
          toast.error("Could not fetch offers.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOffers();
  }, [isAuthenticated, user?.email]);

  const getStatusColor = (status: string) => {
    if (status.includes("Conditional") || status.includes("Offer") || status.includes("Approved")) {
      return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded";
    }
    if (status.includes("Waiting") || status.includes("Pending")) {
      return "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded";
    }
    return "text-muted-foreground bg-muted px-2 py-0.5 rounded";
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
    } else {
        toast.info("Select at least 2 offers to compare.");
    }
  };

  const selectedOffersData = offers.filter((offer) =>
    selectedOffers.includes(offer._id)
  );

  const formatDate = (dateString?: string) => {
      if (!dateString || dateString === "N/A") return "N/A";
      try {
          return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
      } catch (e) {
          return dateString;
      }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Offers & Scholarships</h1>
          <p className="text-muted-foreground mt-1">Review, compare, and accept your university offers.</p>
        </div>
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleCompare}
          disabled={selectedOffers.length < 2}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Compare Offers ({selectedOffers.length})
        </Button>
      </div>

      {selectedOffers.length < 2 && offers.length > 1 && (
        <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/20">
             <AlertCircle className="h-4 w-4" />
             Select checkboxes on the cards to compare multiple offers side-by-side.
        </div>
      )}

      {/* Offers Grid */}
      {offers.length === 0 ? (
         <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-border rounded-xl bg-muted/5">
            <div className="bg-muted p-4 rounded-full mb-4">
                <Gift className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No Offers Yet</h3>
            <p className="text-muted-foreground max-w-sm text-center mt-1">
                Your applications are currently being reviewed. Once you receive an offer, it will appear here.
            </p>
         </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div key={offer._id} className={cn("bg-card rounded-xl border border-border p-6 shadow-sm transition-all hover:shadow-md", selectedOffers.includes(offer._id) && "ring-2 ring-primary border-primary")}>
              
              {/* Card Header & Selection */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    id={`offer-${offer._id}`}
                    checked={selectedOffers.includes(offer._id)}
                    onCheckedChange={() => toggleOfferSelection(offer._id)}
                    className="mt-1"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-foreground">{offer.universityName}</h2>
                    <p className="text-sm font-medium text-muted-foreground">{offer.programName}</p>
                  </div>
                </div>
                <span className={cn("text-xs font-semibold whitespace-nowrap", getStatusColor(offer.status))}>
                  {offer.status}
                </span>
              </div>

              <div className="ml-8 space-y-4">
                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-4 rounded-lg border border-border/50">
                      <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">Scholarship</p>
                          <p className={cn("font-medium", offer.scholarship && offer.scholarship !== "N/A" ? "text-green-600 dark:text-green-400" : "text-foreground")}>
                              {offer.scholarship || "None"}
                          </p>
                      </div>
                       <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">Tuition Fee</p>
                          <p className="font-medium text-foreground">
                              {offer.tuitionFee || "TBD"}
                          </p>
                      </div>
                      <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">Duration</p>
                          <p className="font-medium text-foreground">
                              {offer.duration || "N/A"}
                          </p>
                      </div>
                      <div>
                          <p className="text-xs text-muted-foreground font-medium mb-1">Expiry Date</p>
                          <p className={cn("font-medium", !offer.expiryDate ? "text-muted-foreground" : "text-red-500")}>
                              {formatDate(offer.expiryDate)}
                          </p>
                      </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Button 
                        size="sm" 
                        disabled={!offer.status.toLowerCase().includes("offer") && !offer.status.toLowerCase().includes("approved")}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Accept Offer
                    </Button>

                    <Button 
                        variant="outline" 
                        size="sm" 
                        disabled={!offer.status.toLowerCase().includes("offer") && !offer.status.toLowerCase().includes("approved")}
                        className="text-foreground"
                    >
                        <Download className="w-3.5 h-3.5 mr-2" />
                        Download Letter
                    </Button>

                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground hover:text-foreground ml-auto"
                    >
                        <HelpCircle className="w-4 h-4 mr-2" />
                        Need Help?
                    </Button>
                  </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Compare Dialog */}
      <Dialog open={compareDialogOpen} onOpenChange={setCompareDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="px-1">
            <DialogTitle>Compare Offers</DialogTitle>
            <DialogDescription>Side-by-side comparison of your selected university offers.</DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 flex-1 overflow-auto border rounded-lg">
            <table className="w-full border-collapse text-sm">
              <thead className="bg-muted/50 sticky top-0 z-10">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-muted-foreground w-40 border-b bg-muted/50">Feature</th>
                  {selectedOffersData.map((offer) => (
                    <th key={offer._id} className="text-left py-4 px-6 font-bold text-foreground border-b min-w-[200px] bg-muted/50 border-l border-border/50">
                      {offer.universityName}
                      <div className="mt-1 text-xs font-normal text-muted-foreground">{offer.programName}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                    { label: "Status", key: "status", render: (val: string) => <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", getStatusColor(val))}>{val}</span> },
                    { label: "Tuition Fee", key: "tuitionFee" },
                    { label: "Scholarship", key: "scholarship", className: "text-green-600 font-medium" },
                    { label: "Location", key: "location" },
                    { label: "Duration", key: "duration" },
                    { label: "Start Date", key: "startDate" },
                    { label: "Accommodation", key: "accommodation" },
                    { label: "Work Permit", key: "workPermit", render: (val: string) => val === "Yes" ? <div className="flex items-center gap-1 text-green-600"><Check className="h-4 w-4" /> Yes</div> : <div className="flex items-center gap-1 text-red-500"><X className="h-4 w-4" /> No</div> },
                    { label: "Offer Expiry", key: "expiryDate", render: (val: string) => formatDate(val) },
                ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-6 font-medium text-muted-foreground">{row.label}</td>
                        {selectedOffersData.map((offer) => (
                            <td key={offer._id} className={cn("py-4 px-6 text-foreground border-l border-border/50", row.className)}>
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {row.render ? row.render((offer as any)[row.key]) : ((offer as any)[row.key] || "N/A")}
                            </td>
                        ))}
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}