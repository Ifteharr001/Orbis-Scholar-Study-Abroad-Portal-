"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; 
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, User, Briefcase, MapPin, Phone, Globe } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function CounselorProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession(); 
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    image: "", 
    gender: "",
    country: "",
    bio: "",
    experience: "",
    availability: "",
    specializations: "",
    languages: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/counselor/profile");
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            image: data.image || "",
            gender: data.gender || "",
            country: data.country || "",
            bio: data.bio || "",
            experience: data.experience || "",
            availability: data.availability || "",
            specializations: data.specializations ? data.specializations.join(", ") : "",
            languages: data.languages ? data.languages.join(", ") : "",
          });
        } else {
          toast.error("Failed to load profile");
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        specializations: formData.specializations.split(",").map((s) => s.trim()).filter((s) => s),
        languages: formData.languages.split(",").map((s) => s.trim()).filter((s) => s),
      };

      const res = await fetch("/api/counselor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        
        await update({
          ...session,
          user: {
            ...session?.user,
            name: formData.name,
            image: formData.image, 
          },
        });

        toast.success("Profile updated successfully!");
        router.refresh(); 
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and professional details.</p>
        </div>
        <Button onClick={handleSubmit} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-muted">
                    <AvatarImage src={formData.image} alt={formData.name} />
                    <AvatarFallback className="text-4xl">{formData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="w-full space-y-2">
                    <Label htmlFor="image" className="text-xs">Image URL</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="image" 
                            name="image" 
                            value={formData.image} 
                            onChange={handleChange} 
                            placeholder="https://..." 
                        />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        Paste a direct image link here.
                    </p>
                </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" /> Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Input id="gender" name="gender" value={formData.gender} onChange={handleChange} placeholder="e.g. Male/Female" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9" id="country" name="country" value={formData.country} onChange={handleChange} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-primary" /> Professional Details
                    </CardTitle>
                    <CardDescription>This information will be visible to students.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio / About Me</Label>
                        <Textarea 
                            id="bio" 
                            name="bio" 
                            value={formData.bio} 
                            onChange={handleChange} 
                            rows={4} 
                            placeholder="Tell students about your expertise..."
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="experience">Experience</Label>
                            <Input id="experience" name="experience" value={formData.experience} onChange={handleChange} placeholder="e.g. 5 Years" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="availability">Availability</Label>
                            <Input id="availability" name="availability" value={formData.availability} onChange={handleChange} placeholder="e.g. Mon-Fri, 9am-5pm" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="specializations">Specializations (comma separated)</Label>
                        <Input 
                            id="specializations" 
                            name="specializations" 
                            value={formData.specializations} 
                            onChange={handleChange} 
                            placeholder="e.g. Visa Processing, Scholarship, USA" 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="languages">Languages (comma separated)</Label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input 
                                className="pl-9"
                                id="languages" 
                                name="languages" 
                                value={formData.languages} 
                                onChange={handleChange} 
                                placeholder="e.g. English, Bengali, Hindi" 
                            />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}