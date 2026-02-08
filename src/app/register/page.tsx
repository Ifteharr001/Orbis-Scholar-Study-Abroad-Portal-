"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, CheckCircle, AlertCircle, ShieldCheck, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RegisterForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  
  const [loading, setLoading] = useState(false); 
  const [verifying, setVerifying] = useState(true); 
  const [inviteData, setInviteData] = useState<{ email: string; role: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
  });

  
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        return;
      }

      try {
        
        const res = await fetch(`/api/verify-token?token=${token}`); //
        const data = await res.json();

        if (res.ok) {
          setInviteData(data);
        } else {
          toast.error(data.message || "Invalid invitation link");
        }
      } catch (error) {
        toast.error("Failed to verify invitation");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
    }

    setLoading(true);

    try {
      
      const res = await fetch("/api/register", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          name: formData.name,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        

        setTimeout(() => {
            if (inviteData?.role === "admin") {
                router.push("/admin/login");
            } else if (inviteData?.role === "counselor") {
                router.push("/counselor/login"); 
            } else {
                router.push("/login"); 
            }
        }, 1500);

      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-muted/10">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Verifying invitation...</p>
      </div>
    );
  }

  if (!inviteData) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted/10 p-4">
        <Card className="w-full max-w-md border-destructive/20 shadow-lg">
          <CardContent className="pt-8 text-center flex flex-col items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-full">
                <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-destructive">Invalid Link</h2>
                <p className="mt-2 text-muted-foreground">
                    This invitation link is invalid or has expired. Please contact the administrator for a new one.
                </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
                {inviteData.role === 'admin' ? <ShieldCheck className="h-6 w-6 text-primary" /> : <UserCheck className="h-6 w-6 text-primary" />}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Complete Registration</CardTitle>
          <CardDescription>
            You are accepting an invitation for:
          </CardDescription>
          
          <div className="flex flex-col items-center gap-2 pt-2">
             <div className="px-3 py-1 bg-muted rounded-full text-sm font-medium text-foreground border">
                {inviteData.email}
             </div>
             <Badge variant={inviteData.role === 'admin' ? 'destructive' : 'default'} className="capitalize">
                {inviteData.role}
             </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                required
                autoFocus
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Sarah Khan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Set Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                required
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
              ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Setup
                  </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center text-xs text-muted-foreground">
            Make sure to remember your password for login.
        </CardFooter>
      </Card>
    </div>
  );
};

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}