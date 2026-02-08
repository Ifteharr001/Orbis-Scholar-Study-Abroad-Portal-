"use client";

import { useState } from "react";
import { 
  FileText, 
  Send, 
  Globe, 
  Search, 
  CheckCircle2, 
  UploadCloud,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

export default function OpenApplicationPage() {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application Submitted! Our counselors will analyze your profile.");
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-10" />
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-4 py-2 rounded-full mb-6">
            <FileText className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-100">Free Profile Assessment</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Don t Know Where to Apply? <br />
            <span className="text-blue-500">Let Us Find Your Match</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-lg leading-relaxed">
            Submit an open application. Our AI-driven system and expert counselors will analyze your academic profile to find the best universities and scholarships for you.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: FileText, title: "1. Submit Profile", desc: "Fill out your academic details and preferences below." },
              { icon: Search, title: "2. We Analyze", desc: "Our team checks eligibility for 500+ universities." },
              { icon: Send, title: "3. Get Matched", desc: "Receive a curated list of universities & scholarships." }
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <step.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-500 mt-1">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-10">
            
            <div className="lg:col-span-2">
              <Card className="shadow-lg border-none">
                <CardHeader className="bg-white border-b border-slate-100 p-8">
                  <CardTitle className="text-2xl font-bold">Student Details</CardTitle>
                  <CardDescription>Please provide accurate information for the best assessment.</CardDescription>
                </CardHeader>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-8">
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                        <div className="bg-primary/10 p-1.5 rounded text-primary"><CheckCircle2 className="h-4 w-4"/></div>
                        Personal Information
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Full Name *</Label>
                          <Input placeholder="Enter your full name" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number *</Label>
                          <Input placeholder="+880 1..." required />
                        </div>
                        <div className="space-y-2">
                          <Label>Email Address *</Label>
                          <Input type="email" placeholder="student@example.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label>City / Location</Label>
                          <Input placeholder="e.g. Dhaka, Chittagong" />
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                        <div className="bg-primary/10 p-1.5 rounded text-primary"><GraduationCap className="h-4 w-4"/></div>
                        Academic Background
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Highest Qualification *</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ssc">SSC / O-Levels</SelectItem>
                              <SelectItem value="hsc">HSC / A-Levels</SelectItem>
                              <SelectItem value="bachelor">Bachelors Degree</SelectItem>
                              <SelectItem value="masters">Masters Degree</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Result (GPA/CGPA) *</Label>
                          <Input placeholder="e.g. 5.00 or 3.5" required />
                        </div>
                        <div className="space-y-2">
                          <Label>Year of Passing</Label>
                          <Input placeholder="e.g. 2023" />
                        </div>
                        <div className="space-y-2">
                          <Label>English Proficiency (IELTS/Duolingo)</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="taken">Test Taken</SelectItem>
                              <SelectItem value="planning">Planning to take</SelectItem>
                              <SelectItem value="waiver">Looking for Waiver (MOI)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-primary">
                        <div className="bg-primary/10 p-1.5 rounded text-primary"><Globe className="h-4 w-4"/></div>
                        Study Preferences
                      </h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label>Preferred Country</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Any Destination" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="usa">USA</SelectItem>
                              <SelectItem value="canada">Canada</SelectItem>
                              <SelectItem value="australia">Australia</SelectItem>
                              <SelectItem value="europe">Europe (Shengen)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Preferred Major / Subject</Label>
                          <Input placeholder="e.g. Computer Science, MBA" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label>Budget Range (Yearly Tuition)</Label>
                          <RadioGroup defaultValue="medium" className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="low" id="r1" />
                              <Label htmlFor="r1">Low (&lt; $10k)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="medium" id="r2" />
                              <Label htmlFor="r2">Medium ($10k - $20k)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="high" id="r3" />
                              <Label htmlFor="r3">High ($20k+)</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-border" />

                    <div className="space-y-4">
                       <Label>Upload CV / Academic Transcripts (Optional)</Label>
                       <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition cursor-pointer">
                          <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600 font-medium">Click to upload files</p>
                          <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</p>
                          <Input type="file" className="hidden" />
                       </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Any Specific Requirements?</Label>
                        <Textarea placeholder="Tell us if you have study gaps, rejections, or specific needs..." rows={3} />
                    </div>

                    <Button type="submit" size="lg" className="w-full text-lg font-bold bg-blue-600 hover:bg-blue-700 h-12">
                      Submit for Free Assessment
                    </Button>

                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1 space-y-8">
              
              <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-4">Why Apply Here?</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <span className="text-slate-300 text-sm">Get matched with universities that fit your budget and grades.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <span className="text-slate-300 text-sm">Discover (Hidden Gem) universities with low tuition fees.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                      <span className="text-slate-300 text-sm">Get priority Scholarship assessment before applying officially.</span>
                    </li>
                  </ul>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Need Assistance?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    If you are facing issues filling out the form, feel free to call our helpline.
                  </p>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    Call: +880 1700-000000
                  </Button>
                </CardContent>
              </Card>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}