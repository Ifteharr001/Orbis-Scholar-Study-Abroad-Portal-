"use client";

import { useState, useEffect, useRef, ChangeEvent } from "react";
import { User, Mail, Phone, MapPin, GraduationCap, Bell, Shield, Eye, Moon, Camera, Save, LogOut, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useSession, signOut } from "next-auth/react";

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    programPreference: "",
    gender: "",
    image: ""
  });

  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: false,
    darkMode: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/student/profile");
        
        if (res.ok) {
          const data = await res.json();
          setProfile({
            fullName: data.fullName || "",
            email: data.email || "",
            phone: data.phone || "",
            country: data.country || "",
            programPreference: data.programPreference || "Masters",
            gender: data.gender || "Male",
            image: data.image || ""
          });
        }
      } catch (error) {
        console.error("Failed to load profile", error);
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchProfile();
    }
  }, [session]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB Limit check
          toast.error("File size too large (Max 5MB)");
          return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Update session to reflect changes immediately
      await update({
        ...session,
        user: {
          ...session?.user,
          name: profile.fullName,
          image: profile.image,
        },
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
    toast.success("Logged out successfully");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-foreground">Profile & Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted border border-border w-full md:w-auto justify-start overflow-x-auto">
          <TabsTrigger value="profile">
            <User className="w-4 h-4 mr-2" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Eye className="w-4 h-4 mr-2" /> Preferences
          </TabsTrigger>
        </TabsList>

        {/* --- Profile Tab --- */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details here</CardDescription>
                </div>
                <Button 
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "border-border hover:bg-muted" : "bg-primary text-primary-foreground hover:bg-primary/90"}
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleImageUpload}
              />

              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <Avatar className="w-24 h-24 border-4 border-background shadow-md">
                    <AvatarImage src={profile.image || session?.user?.image || "/placeholder.svg"} className="object-cover" />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {profile.fullName ? profile.fullName.substring(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  
                  {isEditing && (
                    <button 
                      onClick={triggerFileInput}
                      className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-lg cursor-pointer ring-2 ring-background"
                      title="Upload Photo"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{profile.fullName || "User Name"}</h3>
                  <p className="text-muted-foreground">{profile.email || "user@example.com"}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded dark:bg-blue-900/30 dark:text-blue-400">
                    Student Account
                  </span>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> Full Name
                  </Label>
                  <Input 
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    disabled={!isEditing}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" /> Email Address
                  </Label>
                  <Input 
                    id="email"
                    value={profile.email}
                    disabled={true} 
                    className="bg-muted opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" /> Phone Number
                  </Label>
                  <Input 
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    disabled={!isEditing}
                    placeholder="+880..."
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" /> Country
                  </Label>
                  <Select 
                    value={profile.country} 
                    onValueChange={(value) => setProfile({...profile, country: value})}
                    disabled={!isEditing} // ✅ Disabled prop on Select works correctly here
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                      <SelectItem value="India">India</SelectItem>
                      <SelectItem value="Pakistan">Pakistan</SelectItem>
                      <SelectItem value="Nepal">Nepal</SelectItem>
                      <SelectItem value="Sri Lanka">Sri Lanka</SelectItem>
                      <SelectItem value="Nigeria">Nigeria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" /> Program Preference
                  </Label>
                  <Select 
                    value={profile.programPreference} 
                    onValueChange={(value) => setProfile({...profile, programPreference: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bachelors">Bachelors Degree</SelectItem>
                      <SelectItem value="Masters">Masters Degree</SelectItem>
                      <SelectItem value="PhD">PhD</SelectItem>
                      <SelectItem value="Diploma">Diploma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" /> Gender
                  </Label>
                  <Select 
                    value={profile.gender} 
                    onValueChange={(value) => setProfile({...profile, gender: value})}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end pt-4 border-t border-border">
                  <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 min-w-[140px]">
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Notifications Tab --- */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to receive updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive application updates via email</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive urgent alerts via text message</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Security Tab --- */}
        <TabsContent value="security" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch 
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
                />
              </div>
              <Separator />
              <div className="pt-2">
                <Button variant="destructive" onClick={handleLogout} className="gap-2 w-full sm:w-auto">
                  <LogOut className="w-4 h-4" />
                  Logout from Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- Preferences Tab --- */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-full">
                     <Moon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base font-medium">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Toggle dark theme appearance</p>
                  </div>
                </div>
                <Switch 
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({...settings, darkMode: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}