"use client";

export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  Settings,
  Shield,
  Bell,
  Save,
  Edit,
  Camera,
  X,
  Check
} from "lucide-react";
import { toast } from "sonner";

interface PartnerProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName: string;
  role: string;
  companyWebsite?: string;
  companyAddress?: string;
  companyCity?: string;
  companyCountry?: string;
  companyPhone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PartnerProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PartnerProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/partner/profile", {
          cache: "no-store",
          credentials: "include"
        });

        if (!res.ok) {
          setProfile(null);
          return;
        }

        const data = await res.json();
        setProfile(data.profile);
        setFormData(data.profile || {});
      } catch (error) {
        console.error("Profile Load Error:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const res = await fetch("/api/partner/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const error = await res.json();
        toast.error(error.message || "Failed to save profile");
        return;
      }

      const data = await res.json();
      setProfile(data.profile);
      setFormData(data.profile);
      setEditing(false);
      toast.success("Profile saved successfully");
    } catch (error) {
      console.error("Profile Save Error:", error);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <User className="h-12 w-12 mb-4 opacity-30" />
        <p className="text-lg font-medium">Profile not found</p>
        <p className="text-sm">Unable to load your profile information.</p>
      </div>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <User className="h-7 w-7 text-primary" />
            Profile
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account and company information</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl overflow-hidden">
                {profile.avatar ? (
                  <img src={profile.avatar} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  fullName.charAt(0).toUpperCase()
                )}
              </div>
              {editing && (
                <Button variant="outline" size="sm" className="absolute bottom-0 right-0 -translate-y-1/2 translate-x-1/2 rounded-full p-1">
                  <Camera className="h-3 w-3" />
                </Button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <p className="text-primary font-medium">{profile.role}</p>
              <p className="text-muted-foreground mt-1">{profile.companyName}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="flex gap-2 md:ml-auto">
              {editing ? (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your login credentials and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {editing ? (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName || ""}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    required
                    disabled
                    className="bg-muted flex-1"
                  />
                  <span className="text-xs text-muted-foreground">Email cannot be changed</span>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role / Title</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role || ""}
                    onChange={handleInputChange}
                    placeholder="e.g., Regional Director, Senior Counselor"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</Label>
                <p className="font-medium mt-1">{fullName}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Role</Label>
                <p className="font-medium mt-1">{profile.role}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Email</Label>
                <p className="font-medium mt-1 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {profile.email}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</Label>
                <p className="font-medium mt-1 flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  {profile.phone || "Not provided"}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>Your organization's details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {editing ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName || ""}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyWebsite">Company Website</Label>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyWebsite"
                    name="companyWebsite"
                    type="url"
                    value={formData.companyWebsite || ""}
                    onChange={handleInputChange}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyPhone">Company Phone</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companyPhone"
                    name="companyPhone"
                    type="tel"
                    value={formData.companyPhone || ""}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Textarea
                  id="companyAddress"
                  name="companyAddress"
                  value={formData.companyAddress || ""}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Street address, suite, building..."
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="companyCity">City</Label>
                  <Input
                    id="companyCity"
                    name="companyCity"
                    value={formData.companyCity || ""}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyCountry">Country</Label>
                  <Input
                    id="companyCountry"
                    name="companyCountry"
                    value={formData.companyCountry || ""}
                    onChange={handleInputChange}
                    placeholder="United States"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider">Company Name</Label>
                  <p className="font-medium mt-1">{profile.companyName}</p>
                </div>
              </div>
              {profile.companyWebsite && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Website</Label>
                    <p className="font-medium mt-1">
                      <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                        {profile.companyWebsite}
                        <Globe className="h-3 w-3" />
                      </a>
                    </p>
                  </div>
                </div>
              )}
              {profile.companyPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</Label>
                    <p className="font-medium mt-1">{profile.companyPhone}</p>
                  </div>
                </div>
              )}
              {profile.companyAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Address</Label>
                    <p className="font-medium mt-1 whitespace-pre-line">{profile.companyAddress}</p>
                    {profile.companyCity && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {profile.companyCity}{profile.companyCountry && `, ${profile.companyCountry}`}
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!profile.companyWebsite && !profile.companyPhone && !profile.companyAddress && (
                <p className="text-muted-foreground text-center py-4">No company information provided yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Preferences
          </CardTitle>
          <CardDescription>Manage your account security and notification settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">Update your login password</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change Password</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Notification Preferences</p>
                <p className="text-sm text-muted-foreground">Configure email and in-app notifications</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Settings className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Enable 2FA</Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <Shield className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Irreversible actions that permanently affect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <X className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
              </div>
            </div>
            <Button variant="destructive" size="sm">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}