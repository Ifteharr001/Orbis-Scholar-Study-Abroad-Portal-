"use client"; // 1. Client Side Interactivity-r jonno mandatory

import { useState } from "react";
import { useRouter } from "next/navigation"; // 2. useNavigate -> useRouter
import Link from "next/link"; // 3. Link from next/link
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
import { ArrowLeft, UserPlus } from "lucide-react";
import { toast } from "sonner"; // 4. Updated toast import (assuming sonner is used as per previous context)

const NewStudentPage = () => {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    country: "",
    address: "",
    programPreference: "",
    intakePreference: "",
    counselor: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    
    // Show success toast
    toast.success("Student Created", {
      description: "New student has been successfully added to the system.",
    });
    
    // Redirect to students list
    router.push("/admin/students");
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Student</h1>
          <p className="text-muted-foreground">Create a new student profile</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details about the student</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger>
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
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangladesh">Bangladesh</SelectItem>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="nepal">Nepal</SelectItem>
                  <SelectItem value="pakistan">Pakistan</SelectItem>
                  <SelectItem value="srilanka">Sri Lanka</SelectItem>
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
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Preferences</CardTitle>
            <CardDescription>Program and intake preferences</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="programPreference">Preferred Program</Label>
              <Select
                value={formData.programPreference}
                onValueChange={(value) => handleInputChange("programPreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bsc">BSc (Bachelor)</SelectItem>
                  <SelectItem value="msc">MSc (Master)</SelectItem>
                  <SelectItem value="mba">MBA</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="intakePreference">Preferred Intake</Label>
              <Select
                value={formData.intakePreference}
                onValueChange={(value) => handleInputChange("intakePreference", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select intake" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fall2024">Fall 2024</SelectItem>
                  <SelectItem value="spring2025">Spring 2025</SelectItem>
                  <SelectItem value="fall2025">Fall 2025</SelectItem>
                  <SelectItem value="spring2026">Spring 2026</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignment</CardTitle>
            <CardDescription>Assign a counselor to this student</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="counselor">Assigned Counselor</Label>
              <Select value={formData.counselor} onValueChange={(value) => handleInputChange("counselor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select counselor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sarah">Sarah Khan</SelectItem>
                  <SelectItem value="john">John Doe</SelectItem>
                  <SelectItem value="emily">Emily Chen</SelectItem>
                  <SelectItem value="michael">Michael Brown</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes about the student..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/students">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Create Student
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewStudentPage;