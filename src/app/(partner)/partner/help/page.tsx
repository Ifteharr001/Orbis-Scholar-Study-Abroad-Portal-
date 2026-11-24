"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Mail,
  Phone,
  LifeBuoy,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Star,
  Shield,
  GraduationCap,
  CreditCard,
  Banknote,
  Users,
  Settings,
  FileText,
  Award,
  Link2
} from "lucide-react";
import { format } from "date-fns";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "video" | "document" | "link";
  url: string;
  category: string;
  featured?: boolean;
}

interface ContactInfo {
  email: string;
  phone: string;
  hours: string;
  responseTime: string;
}

export default function PartnerHelpPage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  // Mock FAQ data
  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I get my partner account approved?",
      answer: "After registering, your account will be reviewed by our admin team. You'll receive an email notification once your account is approved. This typically takes 1-2 business days. If you haven't heard back within 3 business days, please contact support.",
      category: "account"
    },
    {
      id: "2",
      question: "What can I manage in the partner dashboard?",
      answer: "As a partner, you can manage your students, applications, documents, and finance (invoices, payments, fee schedules). You cannot access admin-only features like university management, scholarship management, user management, or system settings.",
      category: "features"
    },
    {
      id: "3",
      question: "How do invoices and payments work?",
      answer: "In the Finance section, you can create invoices for students, track payments, and manage fee structures. When a payment is received, you can record it against an invoice. The system tracks statuses like draft, sent, paid, partial, overdue, and refunded.",
      category: "finance"
    },
    {
      id: "4",
      question: "How do I track student applications?",
      answer: "The Applications section shows all student applications linked to your account. You can filter by university, program, intake, and status. Click on any application to view details, documents, and update the application status.",
      category: "applications"
    },
    {
      id: "5",
      question: "What document types can I manage?",
      answer: "You can manage various document types including academic transcripts, language test scores, passport copies, financial documents, recommendation letters, and visa documents. Each document can be categorized and tracked for verification status.",
      category: "documents"
    },
    {
      id: "6",
      question: "How do I update my company profile?",
      answer: "Go to the Profile page where you can update your personal information (name, phone, role) and company details (name, website, address, phone). Changes are saved immediately and reflected across the platform.",
      category: "account"
    },
    {
      id: "7",
      question: "What are the different user roles in the partner portal?",
      answer: "Currently, the partner portal has a single 'Partner' role with full access to all partner features. In the future, we may add sub-roles like 'Partner Admin', 'Counselor', and 'Finance Manager' with granular permissions.",
      category: "account"
    }
  ];

  // Mock resources
  const resources: Resource[] = [
    {
      id: "1",
      title: "Partner Onboarding Guide",
      description: "Complete guide to getting started with your partner account, including account setup, university partnerships, and student management.",
      type: "guide",
      url: "/resources/partner-onboarding-guide.pdf",
      category: "getting-started",
      featured: true
    },
    {
      id: "2",
      title: "University Partnership Setup",
      description: "Step-by-step video tutorial on adding and configuring university partnerships, programs, and intakes.",
      type: "video",
      url: "https://www.youtube.com/watch?v=example",
      category: "universities",
      featured: true
    },
    {
      id: "3",
      title: "Scholarship Management Best Practices",
      description: "Document covering how to effectively create, manage, and track scholarships for your students.",
      type: "document",
      url: "/resources/scholarship-management.pdf",
      category: "scholarships"
    },
    {
      id: "4",
      title: "Finance & Invoicing Guide",
      description: "Comprehensive guide to creating invoices, recording payments, managing fee structures, and financial reporting.",
      type: "guide",
      url: "/resources/finance-guide.pdf",
      category: "finance"
    },
    {
      id: "5",
      title: "Application Processing Workflow",
      description: "Video walkthrough of the complete application lifecycle from submission to decision.",
      type: "video",
      url: "https://www.youtube.com/watch?v=example2",
      category: "applications"
    },
    {
      id: "6",
      title: "Document Verification Checklist",
      description: "Printable checklist for verifying student documents across different categories.",
      type: "document",
      url: "/resources/document-checklist.pdf",
      category: "documents"
    },
    {
      id: "7",
      title: "API Integration Documentation",
      description: "Technical documentation for integrating the partner portal with your internal systems via API.",
      type: "document",
      url: "/docs/api/partner",
      category: "technical"
    },
    {
      id: "8",
      title: "Student Communication Templates",
      description: "Pre-written email templates for common student communications at each stage of the application process.",
      type: "document",
      url: "/resources/communication-templates.docx",
      category: "communications"
    }
  ];

  const categories = [
    { id: "all", label: "All Topics", icon: HelpCircle },
    { id: "getting-started", label: "Getting Started", icon: BookOpen },
    { id: "account", label: "Account & Profile", icon: User },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "finance", label: "Finance & Payments", icon: CreditCard },
    { id: "technical", label: "Technical & API", icon: Settings }
  ];

  const contactInfo: ContactInfo = {
    email: "partners@orbisscholar.com",
    phone: "+1 (800) 555-0199",
    hours: "Monday - Friday, 9:00 AM - 6:00 PM EST",
    responseTime: "Within 24 hours"
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || resource.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "guide": return BookOpen;
      case "video": return <span className="text-red-500">▶</span>;
      case "document": return FileText;
      case "link": return ExternalLink;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "guide": return "bg-blue-100 text-blue-700";
      case "video": return "bg-red-100 text-red-700";
      case "document": return "bg-green-100 text-green-700";
      case "link": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <HelpCircle className="h-7 w-7 text-primary" />
            Help & Resources
          </h1>
          <p className="text-muted-foreground mt-1">Find answers, guides, and support for the partner portal</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <LifeBuoy className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4 pt-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search help articles, FAQs, and resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className="flex items-center gap-2"
          >
            <category.icon className="h-4 w-4" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* Quick Contact Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <LifeBuoy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Need More Help?</h3>
                <p className="text-sm text-muted-foreground">Our partner support team is here to assist you</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 md:ml-auto text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{contactInfo.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>{contactInfo.responseTime} response time</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Resources */}
      {filteredResources.filter(r => r.featured).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Featured Resources
            </CardTitle>
            <CardDescription>Essential guides to get you started quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.filter(r => r.featured).map((resource) => (
                <Link
                  key={resource.id}
                  href={resource.url}
                  target={resource.type === "link" || resource.url.startsWith("http") ? "_blank" : undefined}
                  rel={resource.type === "link" || resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      {(() => {
                        const Icon = getTypeIcon(resource.type);
                        return typeof Icon === "function" ? <Icon className="h-5 w-5" /> : Icon;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{resource.title}</p>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                      <Badge variant="outline" className={`${getTypeColor(resource.type)} mt-2`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>
            {filteredFAQs.length} question{filteredFAQs.length !== 1 ? "s" : ""} found
            {searchQuery && ` for "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredFAQs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <HelpCircle className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No FAQs found</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left py-4">
                    <span className="font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            All Resources & Guides
          </CardTitle>
          <CardDescription>
            {filteredResources.length} resource{filteredResources.length !== 1 ? "s" : ""} available
            {searchQuery && ` for "${searchQuery}"`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredResources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <BookOpen className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-lg font-medium">No resources found</p>
              <p className="text-sm">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="guide">Guides</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
                <TabsTrigger value="document">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((resource) => (
                    <Link
                      key={resource.id}
                      href={resource.url}
                      target={resource.type === "link" || resource.url.startsWith("http") ? "_blank" : undefined}
                      rel={resource.type === "link" || resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                          {(() => {
                            const Icon = getTypeIcon(resource.type);
                            return typeof Icon === "function" ? <Icon className="h-5 w-5" /> : Icon;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          {resource.featured && (
                            <Badge variant="secondary" className="mb-1 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                          <p className="font-medium truncate">{resource.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="outline" className={getTypeColor(resource.type)}>
                              {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                            </Badge>
                            {resource.url.startsWith("http") && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                External
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="guide">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.filter(r => r.type === "guide").map((resource) => (
                    <Link
                      key={resource.id}
                      href={resource.url}
                      target={resource.url.startsWith("http") ? "_blank" : undefined}
                      rel={resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {resource.featured && <Badge variant="secondary" className="mb-1 text-xs">Featured</Badge>}
                          <p className="font-medium truncate">{resource.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="video">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.filter(r => r.type === "video").map((resource) => (
                    <Link
                      key={resource.id}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 text-red-700 rounded-lg">
                          <span className="text-xl">▶</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {resource.featured && <Badge variant="secondary" className="mb-1 text-xs">Featured</Badge>}
                          <p className="font-medium truncate">{resource.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="document">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.filter(r => r.type === "document").map((resource) => (
                    <Link
                      key={resource.id}
                      href={resource.url}
                      target={resource.url.startsWith("http") ? "_blank" : undefined}
                      rel={resource.url.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {resource.featured && <Badge variant="secondary" className="mb-1 text-xs">Featured</Badge>}
                          <p className="font-medium truncate">{resource.title}</p>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{resource.description}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Quick Links
          </CardTitle>
          <CardDescription>Navigate to key partner portal sections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <Link href="/partner/dashboard" className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center">
              <GraduationCap className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="font-medium">Dashboard</p>
            </Link>
            <Link href="/partner/students" className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="font-medium">Students</p>
            </Link>
            <Link href="/partner/applications" className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center">
              <FileText className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="font-medium">Applications</p>
            </Link>
            <Link href="/partner/documents" className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center">
              <FileText className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="font-medium">Documents</p>
            </Link>
            <Link href="/partner/finance" className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center">
              <CreditCard className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="font-medium">Finance</p>
            </Link>
            <Link href="/partner/profile" className="p-4 border rounded-lg hover:shadow-md transition-shadow text-center">
              <Settings className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <p className="font-medium">Profile</p>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="bg-muted/50">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">Was this helpful?</h3>
          <p className="text-muted-foreground mb-4">Let us know if you found what you were looking for or if there's something we can improve.</p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <span className="text-2xl">👍</span>
              Yes, helpful
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <span className="text-2xl">👎</span>
              No, needs improvement
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}