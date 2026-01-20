"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ApplyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ URL থেকে প্রোগ্রাম এবং ইউনিভার্সিটির নাম নেওয়া
  const urlProgramName = searchParams.get("programName") || "";
  const urlUniversityName = searchParams.get("universityName") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // ✅ নতুন: ইনটেক লোড করার জন্য স্টেট
  const [availableIntakes, setAvailableIntakes] = useState<string[]>([]);
  const [isIntakesLoading, setIsIntakesLoading] = useState(false);

  // ✅ ফর্ম স্টেট ইনিশিয়ালাইজেশন
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    address: "",
    programName: urlProgramName,
    universityName: urlUniversityName,
    intakePreference: "",
  });

  useEffect(() => {
    const fetchProgramIntakes = async () => {
      if (!urlProgramName || !urlUniversityName) return;

      setIsIntakesLoading(true);
      try {
        const response = await fetch(`/api/student/apply?universityName=${encodeURIComponent(urlUniversityName)}&programName=${encodeURIComponent(urlProgramName)}`);
        
        
        const data = await response.json();

        if (data.success && data.intakes) {
          setAvailableIntakes(data.intakes);
        } else {
          setAvailableIntakes([]); 
        }
      } catch (error) {
        console.error("Failed to fetch intakes:", error);
      } finally {
        setIsIntakesLoading(false);
      }
    };

    fetchProgramIntakes();
  }, [urlProgramName, urlUniversityName]);

  // ইনপুট হ্যান্ডেলিং ফাংশন
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // সাবমিট হ্যান্ডেলিং ফাংশন
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.intakePreference) {
      toast.error("Please select an intake preference.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/student/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Application submitted successfully for ${formData.programName}!`);
        router.push("/student/applications");
      } else {
        toast.error(data.message || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 container mx-auto py-8 px-4 max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} disabled={isSubmitting}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Program Application</h1>
          <p className="text-muted-foreground mt-1">
            Apply for <span className="font-semibold text-primary">{formData.programName || "Program"}</span> at <span className="font-semibold text-foreground">{formData.universityName || "University"}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Card 1: Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Please provide your accurate personal details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+88017..."
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender <span className="text-red-500">*</span></Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Nationality <span className="text-red-500">*</span></Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="nigeria">Nigeria</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Full Address <span className="text-red-500">*</span></Label>
              <Textarea
                id="address"
                placeholder="House, Road, City, Zip Code"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={3}
                required
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Program Details */}
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
            <CardDescription>Confirm the program and university details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Target University</Label>
              <Input 
                value={formData.universityName} 
                disabled 
                className="bg-muted text-foreground font-medium opacity-100 cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2">
              <Label>Target Program</Label>
              <Input 
                value={formData.programName} 
                disabled 
                className="bg-muted text-foreground font-medium opacity-100 cursor-not-allowed" 
              />
            </div>
            
            {/* ✅ ডায়নামিক ইনটেক সেলেকশন */}
            <div className="space-y-2 sm:col-span-2">
              <Label>Preferred Intake <span className="text-red-500">*</span></Label>
              <Select onValueChange={(value) => handleInputChange("intakePreference", value)} disabled={isSubmitting || isIntakesLoading}>
                <SelectTrigger>
                  <SelectValue placeholder={isIntakesLoading ? "Loading intakes..." : "Select preferred intake session"} />
                </SelectTrigger>
                <SelectContent>
                  {isIntakesLoading ? (
                    <div className="p-2 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading...
                    </div>
                  ) : availableIntakes.length > 0 ? (
                    availableIntakes.map((intake, index) => (
                      <SelectItem key={index} value={intake}>
                        {intake}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="general" disabled>
                      No specific intakes found (General Application)
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()} 
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="min-w-[150px]">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <ApplyForm />
    </Suspense>
  );
}