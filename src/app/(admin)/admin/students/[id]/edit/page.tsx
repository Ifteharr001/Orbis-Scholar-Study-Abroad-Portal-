"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

// Mock counselors (এটিও চাইলে API থেকে আনা যায়)
const counselors = [
  "Sarah Khan",
  "John Doe",
  "Emily Chen",
  "Ahmed Ali",
];

const countries = [
  "Bangladesh", "India", "Pakistan", "Nepal", "Sri Lanka", 
  "Nigeria", "Ghana", "Kenya", "UK", "USA", "Canada"
];

const StudentEditPage = () => {
  const params = useParams();
  // ফোল্ডার নেম [id] তাই params.id ব্যবহার করতে হবে
  const studentId = params.id as string; 
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    program: "",
    status: "",
    counselor: "",
    dateOfBirth: "",
    passportNo: "", // যদি মডেলে না থাকে তবে এটি কাজ করবে না, তবে আমি রেখেছি
    address: "",
    notes: "",
  });

  // ১. ডাটাবেস থেকে স্টুডেন্ট ইনফো নিয়ে আসা
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await fetch(`/api/admin/students/${studentId}`);
        if (!res.ok) throw new Error("Failed to fetch student");
        
        const data = await res.json();
        const student = data.student;

        // ডাটা সেট করা (API থেকে যা আসবে)
        setFormData({
            name: student.name || "",
            email: student.email || "",
            phone: student.phone || "",
            country: student.country || "",
            city: student.city || "", // যদি মডেলে না থাকে তবে খালি থাকবে
            // programPreference যদি অবজেক্ট হয় তবে degree নিবে, আর স্ট্রিং হলে সরাসরি
            program: typeof student.programPreference === 'object' ? student.programPreference?.degree : student.programPreference || "",
            status: student.status || "active",
            counselor: student.counselor || "",
            // Date format YYYY-MM-DD তে কনভার্ট করা
            dateOfBirth: student.dob ? new Date(student.dob).toISOString().split('T')[0] : "",
            passportNo: student.passportNo || "",
            address: student.address || "",
            notes: student.notes || "",
        });
      } catch (error) {
        console.error("Error:", error);
        toast.error("Could not load student data");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) {
        fetchStudent();
    }
  }, [studentId]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ২. ডাটা আপডেট করা (PUT Request)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
        const res = await fetch(`/api/admin/students/${studentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                // Backend এ field mapping ঠিক রাখার জন্য
                dob: formData.dateOfBirth, 
                programPreference: formData.program 
            }),
        });

        if (!res.ok) throw new Error("Update failed");

        toast.success("Student Updated", {
            description: "Student information has been updated successfully.",
        });
        
        // Redirect to details page
        router.push(`/admin/students/${studentId}`);
        router.refresh(); // ডাটা রিফ্রেশ করার জন্য

    } catch (error) {
        console.error("Update Error:", error);
        toast.error("Failed to update student information");
    } finally {
        setSaving(false);
    }
  };

  if (loading) {
      return (
          <div className="flex h-[50vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      );
  }

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/students/${studentId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit Student</h1>
          <p className="text-muted-foreground">Update student information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled // ইমেইল সাধারণত এডিট করতে দেওয়া হয় না
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select value={formData.country} onValueChange={(value) => handleChange("country", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Full Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Academic Interest</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="program">Preferred Program</Label>
                <Input
                  id="program"
                  value={formData.program}
                  onChange={(e) => handleChange("program", e.target.value)}
                  placeholder="e.g. MSc Computer Science"
                />
              </div>
            </CardContent>
          </Card>

          {/* Counselor Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Counselor Assignment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="counselor">Assigned Counselor</Label>
                <Select value={formData.counselor} onValueChange={(value) => handleChange("counselor", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Counselor" />
                  </SelectTrigger>
                  <SelectContent>
                    {counselors.map((counselor) => (
                      <SelectItem key={counselor} value={counselor}>{counselor}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Add any internal notes about this student..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link href={`/admin/students/${studentId}`}>
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" className="gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditPage;