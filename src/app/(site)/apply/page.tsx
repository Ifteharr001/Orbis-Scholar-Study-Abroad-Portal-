"use client";

import { useState, Suspense } from "react"; 
import { useRouter, useSearchParams } from "next/navigation"; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner"; 

const ApplyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); 

  // ✅ ফিক্স ১: সরাসরি URL থেকে ভ্যালুগুলো ভেরিয়েবলে নিয়ে নিলাম
  const urlProgramName = searchParams.get("programName") || ""; 
  const urlUniversityName = searchParams.get("universityName") || "";

  // ✅ ফিক্স: isSubmitting স্টেট কম্পোনেন্টের ভেতরে আনা হয়েছে
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ ফিক্স ২: useEffect বাদ দিয়েছি। সরাসরি useState-এ ভ্যালু সেট করেছি।
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    address: "",
    programName: urlProgramName, // ডিফল্ট ভ্যালু হিসেবে URL এর ডাটা
    universityName: urlUniversityName, // ডিফল্ট ভ্যালু হিসেবে URL এর ডাটা
    intakePreference: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const promise = fetch("/api/student/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const res = await promise;
      const data = await res.json();

      if (res.ok) {
        toast.success(`Application submitted for ${formData.programName}`);
        router.push("/student/applications"); 
      } else {
        toast.error(data.message || "Failed to submit application");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 container mx-auto py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} disabled={isSubmitting}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Program Application</h1>
          <p className="text-muted-foreground">
            Applying for <span className="font-semibold text-primary">{formData.programName || "Program"}</span> at <span className="font-semibold">{formData.universityName || "University"}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Verify your details before applying</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
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
              <Label htmlFor="country">Country *</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                rows={2}
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>

        {/* Program Details (Auto Filled) */}
        <Card>
          <CardHeader>
            <CardTitle>Program Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>University</Label>
              {/* Disabled input but shows the value */}
              <Input value={formData.universityName} disabled className="bg-muted text-foreground font-medium" />
            </div>
            <div className="space-y-2">
              <Label>Program Name</Label>
              {/* Disabled input but shows the value */}
              <Input value={formData.programName} disabled className="bg-muted text-foreground font-medium" />
            </div>
            
            <div className="space-y-2 sm:col-span-2">
              <Label>Select Intake *</Label>
              <Select onValueChange={(value) => handleInputChange("intakePreference", value)}>
                <SelectTrigger disabled={isSubmitting}>
                  <SelectValue placeholder="Select preferred intake" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall2024">Fall 2024</SelectItem>
                  <SelectItem value="spring2025">Spring 2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default function ApplyPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <ApplyForm />
    </Suspense>
  );
}