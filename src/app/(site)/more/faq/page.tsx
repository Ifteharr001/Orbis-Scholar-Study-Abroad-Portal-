"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  GraduationCap, 
  Plane, 
  FileCheck, 
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const faqs = [
    {
      category: "General",
      question: "What services does Orbis Scholar provide?",
      answer: "We offer end-to-end study abroad services including university selection, application processing, SOP writing, scholarship guidance, visa application, and post-arrival support."
    },
    {
      category: "General",
      question: "Do you charge for consultation?",
      answer: "Our initial counseling session is completely FREE. We charge a service fee only when you decide to start your application process with us."
    },
    {
      category: "Admission",
      question: "Which countries can I apply to?",
      answer: "We specialize in applications for the UK, USA, Canada, Australia, Germany, Malaysia, and China. We also assist with select European countries."
    },
    {
      category: "Admission",
      question: "Can I apply without IELTS?",
      answer: "Yes! Many universities in the UK, USA, and Malaysia accept Medium of Instruction (MOI) letters or alternative tests like Duolingo. However, IELTS is recommended for better scholarship chances."
    },
    {
      category: "Admission",
      question: "What is the processing time for an offer letter?",
      answer: "It varies by country. UK universities usually take 1-2 weeks, while Canada and USA can take 4-8 weeks. Our partner universities offer priority processing."
    },
    {
      category: "Visa",
      question: "What is your visa success rate?",
      answer: "We are proud to maintain a 98% visa success rate over the last 5 years, thanks to our rigorous document verification and mock interview sessions."
    },
    {
      category: "Visa",
      question: "Do you help with bank statements/financial proof?",
      answer: "Yes, we guide you on how to present your financial documents correctly to meet the embassy's requirements and avoid rejection."
    },
    {
      category: "Scholarship",
      question: "Can I get a 100% scholarship?",
      answer: "Full scholarships are highly competitive and depend on your academic profile (GPA, IELTS, Extra-curriculars). We help you apply for government grants like Chevening or Fulbright if eligible."
    },
    {
      category: "Scholarship",
      question: "Are there scholarships for low CGPA students?",
      answer: "Yes, many universities offer bursaries or discounts ranging from £1,000 to £5,000 based on the region you are applying from, regardless of CGPA."
    }
  ];

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { name: "All", icon: HelpCircle },
    { name: "General", icon: MessageCircle },
    { name: "Admission", icon: GraduationCap },
    { name: "Visa", icon: Plane },
    { name: "Scholarship", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Frequently Asked <span className="text-primary">Questions</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to know about the product and billing. Can’t find the answer you’re looking for? Please chat to our friendly team.
          </p>
          
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search for questions (e.g. visa, ielts, cost)..." 
              className="pl-12 h-12 text-lg rounded-full shadow-sm bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="py-10 border-b border-border sticky top-0 z-10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex justify-start md:justify-center gap-4 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.name
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <cat.icon className="h-4 w-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4 max-w-3xl">
        {filteredFaqs.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-4">
            {filteredFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-xl px-4 bg-card">
                <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary py-4">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-lg font-bold text-muted-foreground">No questions found matching {searchQuery}</h3>
            <p className="text-sm text-muted-foreground mt-2">Try searching for something else or contact us directly.</p>
          </div>
        )}
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto bg-card border border-border p-8 rounded-3xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8">
              Can t find the answer you are looking for? Please chat to our friendly team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:opacity-90">
                <MessageCircle className="mr-2 h-4 w-4" /> Chat with Us
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                   Contact Support <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}