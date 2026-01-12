"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Updated imports
import Link from "next/link"; // Updated import
import { toast } from "sonner"; // Updated import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

// Mock student data
const studentData = {
  "STU001": {
    id: "STU001",
    name: "Rahul Ahmed",
    email: "rahul.ahmed@email.com",
    phone: "+880 1712-345678",
    country: "Bangladesh",
    city: "Dhaka",
    program: "MSc Computer Science",
    status: "Active",
    counselor: "Sarah Khan",
    dateOfBirth: "1998-05-20",
    passportNo: "BD12345678",
    address: "123 Main Street, Dhaka",
    notes: "Interested in AI and Machine Learning programs",
  },
};

const counselors = [
  { id: "C001", name: "Sarah Khan" },
  { id: "C002", name: "John Doe" },
  { id: "C003", name: "Emily Chen" },
  { id: "C004", name: "Ahmed Ali" },
];

const countries = [
  "Bangladesh",
  "India",
  "Pakistan",
  "Nepal",
  "Sri Lanka",
  "Nigeria",
  "Ghana",
  "Kenya",
];

const StudentEditPage = () => {
  const params = useParams();
  const studentId = params.studentId as string;
  const router = useRouter(); // Use useRouter for navigation
  
  const initialData = studentData[studentId as keyof typeof studentData] || studentData["STU001"];
  
  const [formData, setFormData] = useState({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    country: initialData.country,
    city: initialData.city,
    program: initialData.program,
    status: initialData.status,
    counselor: initialData.counselor,
    dateOfBirth: initialData.dateOfBirth,
    passportNo: initialData.passportNo,
    address: initialData.address,
    notes: initialData.notes,
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving student:", formData);
    
    toast.success("Student Updated", {
      description: "Student information has been updated successfully.",
    });
    
    // Redirect to student details page
    router.push(`/admin/students/${studentId}`);
  };

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
                    onChange={(e) => handleChange("email", e.target.value)}
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
                  <Label htmlFor="passportNo">Passport Number</Label>
                  <Input
                    id="passportNo"
                    value={formData.passportNo}
                    onChange={(e) => handleChange("passportNo", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
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
                      <SelectValue />
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {counselors.map((counselor) => (
                      <SelectItem key={counselor.id} value={counselor.name}>{counselor.name}</SelectItem>
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
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditPage;