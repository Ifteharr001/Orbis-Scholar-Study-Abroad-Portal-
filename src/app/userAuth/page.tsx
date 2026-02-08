"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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


const loginSchema = z.object({
  email: z.string().trim().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, { message: "Full name is required" }).max(100),
  email: z.string().trim().email({ message: "Please enter a valid email" }),
  phone: z.string().trim().min(5, { message: "Phone number is required" }),
  gender: z.string().min(1, { message: "Please select gender" }),
  country: z.string().min(1, { message: "Please select country" }),
  programPreference: z.string().min(1, { message: "Please select a program" }), 
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

const countryCodes = [
  { code: "+91", country: "IN" },
  { code: "+977", country: "NP" },
  { code: "+880", country: "BD" },
  { code: "+92", country: "PK" },
  { code: "+94", country: "LK" },
  { code: "+234", country: "NG" },
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
];

const programs = ["Bachelors", "Masters", "PhD", "Diploma"]; 

// --- Main Form Component ---
const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [programPreference, setProgramPreference] = useState(""); 

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/student/dashboard";
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
        phone: countryCode + phone,
        gender,
        country,
        programPreference,
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

  // --- Handle Submit ---
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
          loginType: "student",
          callbackUrl: callbackUrl, 
        });

        if (result?.error) {
          toast.error("Login failed", {
            description: "Invalid email or password",
          });
          setIsSubmitting(false);
        } else {
          toast.success("Login Successful!", {
            description: "Welcome to your dashboard",
          });
          
          router.refresh();
          router.push(callbackUrl);
        }
      } else {
        
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            password,
            phone: countryCode + phone,
            gender,
            country,
            programPreference, 
            role: "student",
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Registration failed");
        }

        toast.success("Account created!", {
          description: "Please login with your new account.",
        });
        
        setIsLogin(true); 
      }
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";
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
            Get Unlimited Access To World Class Universities
          </p>
          <Link href="/partnerAuth" className="text-primary hover:underline font-medium inline-block">
            Become a Partner
          </Link>
          <div className="mt-8 relative w-full h-auto">
            <Image
              src={signupIllustration}
              alt="Student applying online"
              className="w-full max-w-sm mx-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>

      
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {isLogin ? "Student Login" : "Student Registration"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
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

                <div className="space-y-1.5">
                  <Label>Mobile</Label>
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.code} {c.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Mobile Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className={`flex-1 ${errors.phone ? "border-destructive" : ""}`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </>
            )}

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
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                    <Label>Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                        <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.gender && <p className="text-xs text-destructive">{errors.gender}</p>}
                    </div>

                    <div className="space-y-1.5">
                    <Label>Country</Label>
                    <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                        <SelectValue placeholder="Country" />
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
                </div>
                <div className="space-y-1.5">
                  <Label>Interested Program</Label>
                  <Select value={programPreference} onValueChange={setProgramPreference}>
                    <SelectTrigger className={errors.programPreference ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select Program Level" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.programPreference && <p className="text-xs text-destructive">{errors.programPreference}</p>}
                </div>
              </>
            )}

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
            </div>

            {!isLogin && (
              <>
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                </div>

                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    className={errors.terms ? "border-destructive" : ""}
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground leading-snug">
                    By joining, I read and agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">Terms</Link> and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
                {errors.terms && <p className="text-xs text-destructive">{errors.terms}</p>}
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground pt-2">
              {isLogin ? (
                <>
                  Don&apos;t have an account?{" "}
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
const AuthPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
};

export default AuthPage;