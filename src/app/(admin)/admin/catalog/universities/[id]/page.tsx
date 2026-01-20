/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation"; 
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
  Save, Plus, Trash2, ArrowLeft, Loader2, HelpCircle 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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
  intakes: z.string().optional(),  
  tuitionFee: z.string().optional(),
  applicationFee: z.string().optional(),
  acceptanceRate: z.string().optional(),
  
  aboutText: z.string().optional(),
  
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

export default function EditUniversityPage() {
  const router = useRouter();
  const params = useParams(); 
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<UniversityFormValues>({
    resolver: zodResolver(universitySchema) as any,
    defaultValues: {
      name: "",
      country: "",
      location: "",
      programs: [], 
      scholarships: [],
      faqs: [],
    },
  });

  const { fields: programFields, append: appendProgram, remove: removeProgram } = 
    useFieldArray({ control: form.control, name: "programs" });

  const { fields: scholarshipFields, append: appendScholarship, remove: removeScholarship } = 
    useFieldArray({ control: form.control, name: "scholarships" });

  const { fields: faqFields, append: appendFAQ, remove: removeFAQ } = 
    useFieldArray({ control: form.control, name: "faqs" });

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        const res = await fetch(`/api/admin/universities/${id}`);
        const result = await res.json();

        if (result.success && result.data) {
          const data = result.data;

          const formattedData = {
            ...data,
            intakes: Array.isArray(data.intakes) ? data.intakes.join(", ") : data.intakes,
            programs: data.programs?.map((p: any) => ({
                ...p,
                intakes: Array.isArray(p.intakes) ? p.intakes.join(", ") : p.intakes
            })) || []
          };

          form.reset(formattedData); 
        } else {
          toast.error("University not found");
          router.push("/admin/catalog/universities");
        }
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchUniversity();
  }, [id, form, router]);

  const onSubmit = async (data: any) => {
    setLoading(true);

    const formattedData = {
      ...data,
      intakes: data.intakes ? data.intakes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      programs: data.programs.map((p: any) => ({
        ...p,
        intakes: p.intakes ? p.intakes.split(",").map((s: string) => s.trim()).filter(Boolean) : []
      }))
    };

    try {
      const res = await fetch(`/api/admin/universities/${id}`, {
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("University updated successfully! 🔄");
        router.push("/admin/catalog/universities");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-20">
      
      <div className="flex items-center justify-between sticky top-0 bg-background z-10 py-2 border-b">
        <div className="flex items-center gap-2">
            <Link href="/admin/catalog/universities">
                <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold">Edit University</h1>
                <p className="text-muted-foreground text-sm">Update details for {form.getValues("name")}</p>
            </div>
        </div>
        
        <Button onClick={form.handleSubmit(onSubmit)} disabled={loading}>
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Update University
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Tabs defaultValue="basic" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 space-x-6 overflow-x-auto">
                    <TabsTrigger value="basic" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Basic Info</TabsTrigger>
                    <TabsTrigger value="details" className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none px-4 h-full">Stats & Media</TabsTrigger>
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
                        <CardHeader><CardTitle>Deadlines & Fees</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control as any} name="deadline" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>General Deadline</FormLabel>
                                    <FormControl><Input placeholder="e.g. 30th June" {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="intakes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Intakes (Comma Separated)</FormLabel>
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
                                    <FormLabel>Logo URL</FormLabel>
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control as any} name="image" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Main Image URL</FormLabel>
                                    <FormControl><Input placeholder="https://..." {...field} /></FormControl>
                                </FormItem>
                            )} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="programs" className="mt-6">
                    <div className="space-y-4">
                        {programFields.map((field, index) => (
                            <Card key={field.id} className="relative border-l-4 border-l-blue-500">
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
                            onClick={() => appendProgram({ name: "", degree: "", tuitionFee: "", hasScholarship: false })}
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
                            onClick={() => appendScholarship({ name: "", type: "", stipend: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add Scholarship
                        </Button>
                    </div>
                </TabsContent>

                 <TabsContent value="content" className="mt-6 space-y-6">
                    <Card>
                        <CardHeader><CardTitle>About University</CardTitle></CardHeader>
                        <CardContent>
                            <FormField control={form.control as any} name="aboutText" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea className="min-h-[150px]" placeholder="Detailed description about the university..." {...field} />
                                    </FormControl>
                                </FormItem>
                            )} />
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