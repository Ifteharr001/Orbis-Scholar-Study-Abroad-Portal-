/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, Plus, Trash2, ArrowLeft, Loader2, HelpCircle, Image as ImageIcon, FileText 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

// --- Zod Schemas ---

const feeStructureSchema = z.object({
  tuition: z.string().optional(),
  accommodation: z.string().optional(),
  insurance: z.string().optional(),
  visaExtension: z.string().optional(),
  medical: z.string().optional(),
});

const universitySchema = z.object({
  name: z.string().min(2, "Name is required"),
  slug: z.string().optional(),
  country: z.string().min(2, "Country is required"),
  location: z.string().min(2, "Location is required"),
  ranking: z.coerce.number().optional(), 
  
  founded: z.coerce.number().optional(),
  studentPopulation: z.coerce.number().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  
  image: z.string().optional(),
  logo: z.string().optional(),
  heroImage: z.string().optional(),

  deadline: z.string().optional(), 
  intakes: z.string().optional(),  // Input as comma-separated string, converted to array in submit
  
  // Single fields for general listing
  tuitionFee: z.string().optional(),
  applicationFee: z.string().optional(),
  acceptanceRate: z.string().optional(),
  
  aboutText: z.string().optional(),
  accommodationText: z.string().optional(), // Added

  // Complex Fees Object
  fees: z.object({
    bachelor: feeStructureSchema.optional(),
    master: feeStructureSchema.optional(),
    phd: feeStructureSchema.optional(),
  }).optional(),

  // Arrays
  requiredDocuments: z.array(z.object({ value: z.string() })).default([]), // Helper object for array field
  galleryImages: z.array(z.object({ url: z.string() })).default([]), // Helper object for array field

  programs: z.array(z.object({
    name: z.string().min(1, "Program Name Required"),
    degree: z.string().optional(),
    language: z.string().optional(),
    duration: z.string().optional(),
    tuitionFee: z.string().optional(),
    accommodationFee: z.string().optional(),
    deadline: z.string().optional(), 
    intakes: z.string().optional(),  
    hasScholarship: z.boolean().default(false),
  })).default([]), 

  scholarships: z.array(z.object({
    name: z.string().min(1, "Name Required"),
    type: z.string().optional(), 
    stipend: z.string().optional(),
    yearlyStipend: z.string().optional(),
    tuitionFee: z.string().optional(), 
    accommodationFee: z.string().optional(),
    insuranceFee: z.string().optional(),
  })).default([]), 

  faqs: z.array(z.object({
    question: z.string().min(1, "Question Required"),
    answer: z.string().min(1, "Answer Required"),
  })).default([]),
});

type UniversityFormValues = z.infer<typeof universitySchema>;

export default function NewUniversityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); 

  const form = useForm<UniversityFormValues>({
    resolver: zodResolver(universitySchema) as any,
    defaultValues: {
      name: "",
      country: "",
      location: "",
      slug: "",
      image: "",
      logo: "",
      heroImage: "",
      deadline: "",
      intakes: "",
      tuitionFee: "",
      applicationFee: "",
      acceptanceRate: "",
      aboutText: "",
      accommodationText: "",
      ranking: 0,
      founded: 0,
      studentPopulation: 0,
      rating: 0,
      fees: {
        bachelor: { tuition: "", accommodation: "", insurance: "", visaExtension: "", medical: "" },
        master: { tuition: "", accommodation: "", insurance: "", visaExtension: "", medical: "" },
        phd: { tuition: "", accommodation: "", insurance: "", visaExtension: "", medical: "" },
      },
      requiredDocuments: [],
      galleryImages: [],
      programs: [], 
      scholarships: [],
      faqs: [],
    },
  });

  // Field Arrays
  const { fields: programFields, append: appendProgram, remove: removeProgram } = 
    useFieldArray({ control: form.control, name: "programs" });

  const { fields: scholarshipFields, append: appendScholarship, remove: removeScholarship } = 
    useFieldArray({ control: form.control, name: "scholarships" });

  const { fields: faqFields, append: appendFAQ, remove: removeFAQ } = 
    useFieldArray({ control: form.control, name: "faqs" });

  const { fields: docFields, append: appendDoc, remove: removeDoc } = 
    useFieldArray({ control: form.control, name: "requiredDocuments" });

  const { fields: galleryFields, append: appendGallery, remove: removeGallery } = 
    useFieldArray({ control: form.control, name: "galleryImages" });

  // Handle File Upload (Generic)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      toast.error("Image size too large! Max size is 5MB.");
      e.target.value = ""; 
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (data.url) {
        callback(data.url);
        toast.success("Uploaded successfully!");
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      toast.error("Something went wrong during upload");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    const formattedData = {
      ...data,
      intakes: data.intakes ? data.intakes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      requiredDocuments: data.requiredDocuments.map((d: any) => d.value), 
      galleryImages: data.galleryImages.map((g: any) => g.url), 
      programs: data.programs.map((p: any) => ({
        ...p,
        intakes: p.intakes ? p.intakes.split(",").map((s: string) => s.trim()).filter(Boolean) : []
      }))
    };

    try {
      const res = await fetch("/api/admin/universities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("University created successfully! 🎉");
        router.push("/admin/catalog/universities");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 pb-20">
      
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2 border-b">
        <div className="flex items-center gap-2">
            <Link href="/admin/catalog/universities">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold">Add New University</h1>
                <p className="text-muted-foreground text-sm">Fill in all details matching the model.</p>
            </div>
        </div>
        
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading || uploading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Save University
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 space-x-6 overflow-x-auto">
                    <TabsTrigger value="basic" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Basic Info</TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Stats & Media</TabsTrigger>
                    <TabsTrigger value="fees" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Fees Structure</TabsTrigger>
                    <TabsTrigger value="programs" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Programs ({programFields.length})</TabsTrigger>
                    <TabsTrigger value="scholarships" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Scholarships ({scholarshipFields.length})</TabsTrigger>
                    <TabsTrigger value="content" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Content & FAQ</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Identity & Location</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control as any} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University Name</FormLabel>
                                    <FormControl><Input placeholder="e.g. Nanjing University" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="ranking" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Global Ranking</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g. 150" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="country" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl><Input placeholder="e.g. China" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="location" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City / Location</FormLabel>
                                    <FormControl><Input placeholder="e.g. Nanjing, Jiangsu" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Deadlines & General Fees</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control as any} name="deadline" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>General Deadline</FormLabel>
                                    <FormControl><Input placeholder="e.g. 30th June" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="intakes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>General Intakes (Comma Separated)</FormLabel>
                                    <FormControl><Input placeholder="e.g. March, September" {...field} /></FormControl>
                                    <FormDescription>Separate multiple intakes with commas.</FormDescription>
                                </FormItem>
                            )} />
                             <FormField control={form.control as any} name="applicationFee" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Application Fee</FormLabel>
                                    <FormControl><Input placeholder="e.g. 500 RMB / 100 USD" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="details" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Statistics & Ratings</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control as any} name="founded" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Founded Year</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g. 1902" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="studentPopulation" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Student Population</FormLabel>
                                    <FormControl><Input type="number" placeholder="e.g. 30000" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="rating" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating (0-5)</FormLabel>
                                    <FormControl><Input type="number" max={5} placeholder="4.5" {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Images & URLs</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <FormField control={form.control as any} name="logo" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>University Logo</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <Input 
                                                    type="file" 
                                                    accept="image/*"
                                                    disabled={uploading}
                                                    onChange={(e) => handleFileUpload(e, (url) => form.setValue("logo", url))}
                                                    className="cursor-pointer"
                                                />
                                                {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                            </div>
                                            
                                            <div className="flex gap-3 items-center">
                                                <Input placeholder="Or paste URL..." {...field} className="flex-1" />
                                                {field.value && (
                                                    <div className="relative h-12 w-12 border rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                                                        <img src={field.value} alt="Logo" className="object-contain h-full w-full" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control as any} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Main Image</FormLabel>
                                    <FormControl>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-4">
                                                <Input 
                                                    type="file" 
                                                    accept="image/*"
                                                    disabled={uploading}
                                                    onChange={(e) => handleFileUpload(e, (url) => form.setValue("image", url))}
                                                    className="cursor-pointer"
                                                />
                                                {uploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                            </div>

                                            <div className="flex gap-3 items-center">
                                                <Input placeholder="Or paste URL..." {...field} className="flex-1" />
                                                {field.value && (
                                                    <div className="relative h-12 w-20 border rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                                                        <img src={field.value} alt="Main" className="object-cover h-full w-full" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                      <CardHeader><CardTitle>Gallery Images</CardTitle></CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {galleryFields.map((field, index) => (
                            <div key={field.id} className="relative group border rounded-lg overflow-hidden h-24">
                              <img src={form.getValues(`galleryImages.${index}.url`)} alt="Gallery" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => removeGallery(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center gap-4">
                           <Input 
                              type="file" 
                              accept="image/*"
                              disabled={uploading}
                              onChange={(e) => handleFileUpload(e, (url) => appendGallery({ url }))}
                              className="cursor-pointer max-w-xs"
                          />
                          <span className="text-muted-foreground text-sm">Upload images for gallery</span>
                        </div>
                      </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fees" className="mt-6 space-y-6">
                  {['bachelor', 'master', 'phd'].map((level) => (
                    <Card key={level} className="border-l-4 border-l-blue-500">
                      <CardHeader><CardTitle className="capitalize">{level} Fees Structure</CardTitle></CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField control={form.control as any} name={`fees.${level}.tuition`} render={({ field }) => (
                          <FormItem><FormLabel>Tuition Fee (Yearly)</FormLabel><FormControl><Input placeholder="e.g. 15000 RMB" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control as any} name={`fees.${level}.accommodation`} render={({ field }) => (
                          <FormItem><FormLabel>Accommodation Fee</FormLabel><FormControl><Input placeholder="e.g. 4000 RMB" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control as any} name={`fees.${level}.insurance`} render={({ field }) => (
                          <FormItem><FormLabel>Insurance Fee</FormLabel><FormControl><Input placeholder="e.g. 800 RMB" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control as any} name={`fees.${level}.visaExtension`} render={({ field }) => (
                          <FormItem><FormLabel>Visa Fee</FormLabel><FormControl><Input placeholder="e.g. 400 RMB" {...field} /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control as any} name={`fees.${level}.medical`} render={({ field }) => (
                          <FormItem><FormLabel>Medical Fee</FormLabel><FormControl><Input placeholder="e.g. 500 RMB" {...field} /></FormControl></FormItem>
                        )} />
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="programs" className="mt-6">
                    <div className="space-y-4">
                        {programFields.map((field, index) => (
                            <Card key={field.id} className="relative border-l-4 border-l-purple-500">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                    onClick={() => removeProgram(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control as any} name={`programs.${index}.name`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Program Name</FormLabel>
                                                <FormControl><Input placeholder="e.g. Computer Science" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                         <FormField control={form.control as any} name={`programs.${index}.degree`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Degree</FormLabel>
                                                <FormControl><Input placeholder="Bachelor/Master" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-md">
                                        <FormField control={form.control as any} name={`programs.${index}.tuitionFee`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tuition Fee</FormLabel>
                                                <FormControl><Input placeholder="e.g. 18000 RMB" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control as any} name={`programs.${index}.accommodationFee`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Accommodation Fee</FormLabel>
                                                <FormControl><Input placeholder="e.g. 5000 RMB" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                         <FormField control={form.control as any} name={`programs.${index}.deadline`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deadline</FormLabel>
                                                <FormControl><Input placeholder="e.g. June 30" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control as any} name={`programs.${index}.intakes`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Intakes</FormLabel>
                                                <FormControl><Input placeholder="March, Sept" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed py-6 text-muted-foreground"
                            onClick={() => appendProgram({ 
                                name: "", 
                                degree: "", 
                                language: "",
                                duration: "",
                                tuitionFee: "", 
                                accommodationFee: "",
                                deadline: "",
                                intakes: "",
                                hasScholarship: false 
                            })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Program
                        </Button>
                    </div>
                </TabsContent>

                <TabsContent value="scholarships" className="mt-6">
                    <div className="space-y-4">
                        {scholarshipFields.map((field, index) => (
                            <Card key={field.id} className="relative border-l-4 border-l-green-500">
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="absolute top-2 right-2 text-red-500 hover:bg-red-50"
                                    onClick={() => removeScholarship(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <CardContent className="pt-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <FormField control={form.control as any} name={`scholarships.${index}.name`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Scholarship Name</FormLabel>
                                                <FormControl><Input placeholder="e.g. Presidential Scholarship" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control as any} name={`scholarships.${index}.type`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Type</FormLabel>
                                                <FormControl><Input placeholder="Full Funded / Partial" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-muted/30 p-4 rounded-md">
                                        <FormField control={form.control as any} name={`scholarships.${index}.stipend`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Monthly Stipend</FormLabel>
                                                <FormControl><Input placeholder="e.g. 2500 RMB" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control as any} name={`scholarships.${index}.tuitionFee`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tuition Cover</FormLabel>
                                                <FormControl><Input placeholder="e.g. Free / 50% Off" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                        <FormField control={form.control as any} name={`scholarships.${index}.accommodationFee`} render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Dorm Cover</FormLabel>
                                                <FormControl><Input placeholder="e.g. Free" {...field} /></FormControl>
                                            </FormItem>
                                        )} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed py-6 text-muted-foreground"
                            onClick={() => appendScholarship({ 
                                name: "", 
                                type: "", 
                                stipend: "",
                                yearlyStipend: "",
                                tuitionFee: "",
                                accommodationFee: "",
                                insuranceFee: ""
                            })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Scholarship
                        </Button>
                    </div>
                </TabsContent>

                 <TabsContent value="content" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>Descriptions</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <FormField control={form.control as any} name="aboutText" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>About University</FormLabel>
                                    <FormControl>
                                        <Textarea className="min-h-[150px]" placeholder="Detailed description about the university..." {...field} />
                                    </FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="accommodationText" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accommodation Details</FormLabel>
                                    <FormControl>
                                        <Textarea className="min-h-[100px]" placeholder="Dormitory info, pricing, facilities..." {...field} />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader><CardTitle>Required Documents</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {docFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <FormField control={form.control as any} name={`requiredDocuments.${index}.value`} render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl><Input placeholder="e.g. Valid Passport" {...field} /></FormControl>
                                        </FormItem>
                                    )} />
                                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDoc(index)}>
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" size="sm" onClick={() => appendDoc({ value: "" })}>
                                <Plus className="h-4 w-4 mr-2" /> Add Document
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <HelpCircle className="h-4 w-4" /> Frequently Asked Questions
                        </h3>
                        {faqFields.map((field, index) => (
                            <div key={field.id} className="flex gap-4 items-start p-4 border rounded-lg bg-white">
                                <div className="flex-1 space-y-3">
                                    <FormField control={form.control as any} name={`faqs.${index}.question`} render={({ field }) => (
                                        <Input placeholder="Question (e.g. Is IELTS required?)" {...field} />
                                    )} />
                                    <FormField control={form.control as any} name={`faqs.${index}.answer`} render={({ field }) => (
                                        <Textarea placeholder="Answer..." className="min-h-[60px]" {...field} />
                                    )} />
                                </div>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500"
                                    onClick={() => removeFAQ(index)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed"
                            onClick={() => appendFAQ({ question: "", answer: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add FAQ
                        </Button>
                    </div>
                 </TabsContent>
            </Tabs>
        </form>
      </Form>
    </div>
  );
}