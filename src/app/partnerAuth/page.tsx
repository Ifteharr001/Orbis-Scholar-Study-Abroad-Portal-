"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import signupIllustration from "@/assets/signup-illustration.png";

// Zod স্কিমা
const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Full name is required" }).max(100),
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  gender: z.string().min(1, { message: "Please select gender" }),
  country: z.string().min(1, { message: "Please select country" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, { message: "You must accept the terms" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const countries = [
  "India", "Nepal", "Bangladesh", "Pakistan", "Sri Lanka", "Nigeria", 
  "Kenya", "Ghana", "Philippines", "Vietnam", "Indonesia", "Malaysia",
  "United States", "United Kingdom", "Canada", "Australia", "Germany", "France"
];

const PartnerAuth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const validateForm = () => {
    if (isLogin) {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    } else {
      const result = signupSchema.safeParse({
        fullName,
        email,
        gender,
        country,
        password,
        confirmPassword,
        terms: termsAccepted,
      });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((err) => {
          fieldErrors[err.path[0] as string] = err.message;
        });
        setErrors(fieldErrors);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
          loginType: "partner",
        });

        if (result?.error) {
          toast.error("Login failed", {
            description: "Invalid email or password",
          });
        } else {
          toast.success("Welcome back!", {
            description: "Redirecting to Partner Dashboard...",
          });
          router.push("/partner/dashboard");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            password,
            gender,
            country,
            role: "partner", 
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }

        toast.success("Account created!", {
          description: "Please login to continue.",
        });
        
        setIsLogin(true);
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error("Error", {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 border-r border-border bg-muted/30">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-3xl font-bold text-foreground uppercase tracking-wide">
            Apply with <span className="text-primary">StudyAbroad</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Get Unlimited Access To World Class Universitys
          </p>
          <p className="text-foreground font-medium">Be Our Partner</p>
          <div className="mt-8 relative w-full h-auto">
            <Image
              src={signupIllustration}
              alt="Partner applying online"
              className="w-full max-w-sm mx-auto"
              priority
            />
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {isLogin ? "Partner Login" : "Partner Sign up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={errors.fullName ? "border-destructive" : ""}
                    disabled={isSubmitting}
                  />
                  {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-destructive" : ""}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
            </div>

            {!isLogin && (
              <>
                {/* Gender */}
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
                </div>

                {/* Country */}
                <div className="space-y-1.5">
                  <Label>Country</Label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                      <SelectValue placeholder="select one country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c} value={c.toLowerCase()}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.country && <p className="text-xs text-destructive">{errors.country}</p>}
                </div>
              </>
            )}

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pr-10 ${errors.password ? "border-destructive" : ""}`}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {!isLogin && (
              <>
                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`pr-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary hover:text-primary/80"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked: boolean) => setTermsAccepted(checked)}
                    className={errors.terms ? "border-destructive" : ""}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug">
                    By joining, I read and agree to the{" "}
                    <Link href="/terms" className="text-primary underline">Terms & Conditions</Link>,{" "}
                    <Link href="/privacy" className="text-primary underline">Privacy policy</Link>, and{" "}
                    <Link href="/refund" className="text-primary underline">Return and Refund Policy</Link>.
                  </label>
                </div>
                {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}
              </>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Sign up"}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              {isLogin ? (
                <>
                  Do not have an account?{" "}
                  <button type="button" onClick={() => { setIsLogin(false); setErrors({}); }} className="text-primary hover:underline font-medium">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button type="button" onClick={() => { setIsLogin(true); setErrors({}); }} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerAuth;