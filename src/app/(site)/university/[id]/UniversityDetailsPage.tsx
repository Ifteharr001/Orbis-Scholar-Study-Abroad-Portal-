"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, CheckCircle, FileText, CreditCard, Calendar } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";



// ✅ 1. মডেল থেকে ইন্টারফেস ইম্পোর্ট (Strict Type)
import { IUniversity } from "@/models/University";
import SectionNav from "@/app/components/university/SectionNav";
import ProgramCard from "@/app/components/university/ProgramCard";
import ScholarshipCard from "@/app/components/university/ScholarshipCard";
import InfoSidebar from "@/app/components/university/InfoSidebar";
import GallerySection from "@/app/components/university/GallerySection";

// ✅ 2. Props ইন্টারফেস
interface Props {
  universityData: IUniversity;
}

const UniversityDetailsPage = ({ universityData }: Props) => {
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullAccommodation, setShowFullAccommodation] = useState(false);
  const [showFullAdmission, setShowFullAdmission] = useState(false);

  // Helper variables with Fallback
  const aboutText = universityData.aboutText || "Detailed information is being updated.";
  const accommodationText = universityData.accommodationText || "Accommodation details are being updated.";

  // Text truncation helper
  const getTruncatedText = (text: string, paragraphs: number = 2) => {
    if (!text) return "";
    const parts = text.split("\n\n");
    if (parts.length <= paragraphs) return text;
    return parts.slice(0, paragraphs).join("\n\n");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${universityData.heroImage || universityData.image || "/placeholder-university.jpg"})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/60" />
        </div>
        <div className="container relative h-full flex items-center mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="hidden md:block w-32 h-32 rounded-full bg-white p-1.5 shadow-xl relative overflow-hidden flex-shrink-0">
              <Image
                src={universityData.logo || "/placeholder-logo.png"}
                alt={universityData.name}
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                {universityData.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-white/90 text-sm mb-4">
                 <span className="flex items-center gap-1"><Calendar className="h-4 w-4"/> Founded: {universityData.founded || "N/A"}</span>
                 {universityData.ranking && <span className="bg-white/20 px-2 py-0.5 rounded text-xs">Rank #{universityData.ranking}</span>}
              </div>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" className="text-white/80 hover:text-white transition-colors">
                        Homepage
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/universities" className="text-white/80 hover:text-white transition-colors">
                        Find a University
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-medium">
                      {universityData.name}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </section>

      {/* Section Navigation (Sticky) */}
      <SectionNav />

      {/* Main Content */}
      <div className="container py-12 mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Main Content Area */}
          <div className="flex-1 space-y-16">
            
            {/* Programs Section */}
            <section id="programs" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">Programs</h2>
              <div className="space-y-4">
                {universityData.programs && universityData.programs.length > 0 ? (
                  universityData.programs.map((program, index) => (
                    <ProgramCard
                      key={index}
                      name={program.name}
                      universityName={universityData.name}
                      degree={program.degree}
                      language={program.language}
                      duration={program.duration}
                      tuitionFee={program.tuitionFee}
                      accommodationFee={program.accommodationFee}
                      hasScholarship={program.hasScholarship}
                      deadline={program.deadline} 
                      intakes={program.intakes}   
                    />
                  ))
                ) : (
                  <div className="p-8 text-center border rounded-lg bg-muted/20 text-muted-foreground">
                    No programs listed specifically for this university yet.
                  </div>
                )}
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">About</h2>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-foreground mb-4">About {universityData.name}</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  <p className="whitespace-pre-line">
                    {showFullAbout ? aboutText : getTruncatedText(aboutText)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullAbout(!showFullAbout)}
                  className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline cursor-pointer transition-all"
                >
                  {showFullAbout ? (
                    <>See Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>See More <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </section>

            {/* Fees Structure Section */}
            <section id="fees" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">Fees Structure</h2>
              {universityData.fees?.bachelor ? (
                <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                  <div className="bg-muted/50 px-6 py-4 border-b">
                    <h3 className="font-semibold text-foreground">Bachelor Degree Costs (Estimated)</h3>
                  </div>
                  <div className="divide-y divide-border">
                    <div className="flex justify-between items-center px-6 py-4 hover:bg-muted/10 transition-colors">
                      <span className="text-muted-foreground">Tuition Fee (Yearly)</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.tuition || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4 hover:bg-muted/10 transition-colors">
                      <span className="text-muted-foreground">Accommodation Fees</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.accommodation || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4 hover:bg-muted/10 transition-colors">
                      <span className="text-muted-foreground">Insurance Fee</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.insurance || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4 hover:bg-muted/10 transition-colors">
                      <span className="text-muted-foreground">Visa Extension Fee</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.visaExtension || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4 hover:bg-muted/10 transition-colors">
                      <span className="text-muted-foreground">Medical Checkup</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.medical || "N/A"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-6 text-muted-foreground text-center">
                  Detailed fees structure is currently being updated. Please check specific programs.
                </div>
              )}
            </section>

            {/* Accommodation Section */}
            <section id="accommodation" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">Accommodation</h2>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed">
                  <p className="whitespace-pre-line">
                    {showFullAccommodation ? accommodationText : getTruncatedText(accommodationText)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFullAccommodation(!showFullAccommodation)}
                  className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline cursor-pointer transition-all"
                >
                  {showFullAccommodation ? (
                    <>See Less <ChevronUp className="h-4 w-4" /></>
                  ) : (
                    <>See More <ChevronDown className="h-4 w-4" /></>
                  )}
                </button>
              </div>
            </section>

            {/* Admission Process Section */}
            <section id="admission" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">Admission Process</h2>
              <div className="space-y-6">
                
                {/* Application Fee */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <CreditCard className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Application Fee</h3>
                  </div>
                  <p className="text-muted-foreground pl-12">
                    Applicants must pay a <strong className="text-foreground">{universityData.applicationFee || "Standard"}</strong> non-refundable application fee when submitting their application.
                  </p>
                </div>

                {/* Required Documents */}
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">Required Documents</h3>
                  </div>
                  <ul className="space-y-3 pl-2">
                    {universityData.requiredDocuments && universityData.requiredDocuments.length > 0 ? (
                      (showFullAdmission
                        ? universityData.requiredDocuments
                        : universityData.requiredDocuments.slice(0, 5)
                      ).map((doc, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground text-sm">{doc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground italic pl-10">Standard documents required (Passport, Photo, Transcripts).</li>
                    )}
                  </ul>
                  {universityData.requiredDocuments && universityData.requiredDocuments.length > 5 && (
                    <button
                      onClick={() => setShowFullAdmission(!showFullAdmission)}
                      className="mt-4 ml-10 flex items-center gap-2 text-primary font-medium hover:underline text-sm"
                    >
                      {showFullAdmission ? (
                        <>See Less <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>See More <ChevronDown className="h-4 w-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Scholarships Section */}
            <section id="scholarships" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">Scholarships</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {universityData.scholarships && universityData.scholarships.length > 0 ? (
                  universityData.scholarships.map((scholarship, index) => (
                    <ScholarshipCard
                      key={index}
                      name={scholarship.name}
                      type={scholarship.type}
                      tuitionFee={scholarship.tuitionFee}
                      accommodationFee={scholarship.accommodationFee}
                      insuranceFee={scholarship.insuranceFee}
                      monthlyStipend={scholarship.monthlyStipend}
                      yearlyStipend={scholarship.yearlyStipend}
                    />
                  ))
                ) : (
                  <div className="col-span-full p-6 bg-muted/20 border rounded-lg text-center text-muted-foreground">
                    No specific scholarships listed at this moment. Contact us for general opportunities.
                  </div>
                )}
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">FAQ</h2>
              <Accordion type="single" collapsible className="bg-card rounded-xl border border-border shadow-sm">
                {universityData.faqs && universityData.faqs.length > 0 ? (
                  universityData.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border-b last:border-0">
                      <AccordionTrigger className="px-6 py-4 text-left hover:no-underline hover:bg-muted/5 transition-colors">
                        <span className="font-medium text-foreground">{faq.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4 pt-0 text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="p-6 text-muted-foreground text-center">No FAQs available currently.</div>
                )}
              </Accordion>
            </section>

            {/* Gallery Section */}
            <section id="gallery" className="scroll-mt-24">
              <h2 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-3">Gallery</h2>
              <GallerySection 
                  images={universityData.galleryImages || []} 
                  videos={universityData.galleryVideos || []} 
              />
            </section>
          </div>

          {/* Right Column: Sidebar (Sticky) */}
          <div className="w-full lg:w-80 h-fit lg:sticky lg:top-24">
            <InfoSidebar
              institutionName={universityData.name}
              location={universityData.location}
              deadline={universityData.deadline} // ডাটাবেস থেকে ডেডলাইন
              intakes={universityData.intakes}   // ডাটাবেস থেকে ইনটেক
              tuitionRange={universityData.tuitionFee} // রেঞ্জ বা এভারেজ ফি
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default UniversityDetailsPage;