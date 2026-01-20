"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // ✅ কাউন্সিলর লগইন হবে NextAuth দিয়ে
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Users, Mail, Lock } from "lucide-react";

export default function CounselorLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const callbackUrl = searchParams.get("callbackUrl") || "/counselor";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        loginType: "counselor", 
      });

      if (res?.error) {
        toast.error("Access Denied", {
          description: res.error || "Invalid credentials",
        });
      } else {
        toast.success("Welcome back!", {
          description: "Login successful.",
        });
        
        router.refresh(); 
        router.push(callbackUrl);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md border-t-4 border-t-blue-600 shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">Counselor Portal</CardTitle>
          <CardDescription>
            Secure login for counselors and advisors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="counselor@orbisscholar.com"
                  className="pl-9"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Access Dashboard"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
          <p>Need access? Contact Admin.</p>
          <p className="text-xs opacity-70">
            &copy; {new Date().getFullYear()} Orbis Scholar
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}