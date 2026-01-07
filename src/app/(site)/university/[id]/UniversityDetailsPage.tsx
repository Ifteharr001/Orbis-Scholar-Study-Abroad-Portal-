"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronDown, ChevronUp, CheckCircle, FileText, CreditCard } from "lucide-react";
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

// কম্পোনেন্ট ইম্পোর্ট (পাথ ঠিক করা হয়েছে)
import ScholarshipCard from "../../../components/university/ScholarshipCard";
import ProgramCard from "../../../components/university/ProgramCard";
import InfoSidebar from "../../../components/university/InfoSidebar";
import SectionNav from "../../../components/university/SectionNav";
import GallerySection from "../../../components/university/GallerySection";

// ✅ 1. মডেল থেকে ইন্টারফেস ইম্পোর্ট (Strict Type)
import { IUniversity } from "@/models/University";

// ✅ 2. Props ইন্টারফেসে 'any' বাদ দিয়ে 'IUniversity' ব্যবহার
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
          style={{ backgroundImage: `url(${universityData.heroImage || universityData.image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        <div className="container relative h-full flex items-center mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="hidden md:block w-32 h-32 rounded-full bg-background p-2 shadow-lg relative overflow-hidden">
              <Image
                src={universityData.logo || "/placeholder-logo.png"}
                alt={universityData.name}
                width={128}
                height={128}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-bold text-primary-foreground mb-4">
                {universityData.name}
              </h1>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground">
                        Homepage
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-primary-foreground/60" />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/universities" className="text-primary-foreground/80 hover:text-primary-foreground">
                        Find a University
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-primary-foreground/60" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-primary-foreground">
                      University Details
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </section>

      {/* Section Navigation */}
      <SectionNav />

      {/* Main Content */}
      <div className="container py-12 mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="flex-1 space-y-16">
            
            {/* Programs Section */}
            <section id="programs">
              <h2 className="text-2xl font-bold text-primary mb-6">Programs</h2>
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
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">No programs listed yet.</p>
                )}
              </div>
            </section>

            {/* About Section */}
            <section id="about">
              <h2 className="text-2xl font-bold text-primary mb-6">About</h2>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">About {universityData.name}</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
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
                    <>
                      See Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Fees Structure Section */}
            <section id="fees">
              <h2 className="text-2xl font-bold text-primary mb-6">Fees Structure</h2>
              {universityData.fees?.bachelor ? (
                <div className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="bg-muted px-6 py-3">
                    <h3 className="font-semibold text-foreground">Bachelor</h3>
                  </div>
                  <div className="divide-y divide-border">
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="text-muted-foreground">Tuition Fee (Yearly)</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.tuition}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="text-muted-foreground">Accommodation Fees</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.accommodation}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="text-muted-foreground">Insurance Fee</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.insurance}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="text-muted-foreground">Visa Extension Fee</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.visaExtension}</span>
                    </div>
                    <div className="flex justify-between items-center px-6 py-4">
                      <span className="text-muted-foreground">Medical in China Fee</span>
                      <span className="font-semibold text-foreground">{universityData.fees.bachelor.medical}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-xl border border-border p-6 text-muted-foreground">
                  Fees information currently unavailable.
                </div>
              )}
            </section>

            {/* Accommodation Section */}
            <section id="accommodation">
              <h2 className="text-2xl font-bold text-primary mb-6">Accommodation</h2>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
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
                    <>
                      See Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      See More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* Admission Process Section */}
            <section id="admission">
              <h2 className="text-2xl font-bold text-primary mb-6">Admission Process</h2>
              <div className="space-y-6">
                {/* 
                
              ication Fee */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Application Fee</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Applicants must pay a <strong className="text-foreground">non-refundable application fee of 400 CNY</strong> when submitting their application.
                  </p>
                </div>

                {/* Required Documents */}
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Required Documents</h3>
                  </div>
                  <ul className="space-y-3">
                    {universityData.requiredDocuments && universityData.requiredDocuments.length > 0 ? (
                      (showFullAdmission
                        ? universityData.requiredDocuments
                        : universityData.requiredDocuments.slice(0, 5)
                      ).map((doc, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{doc}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">Document list updating...</li>
                    )}
                  </ul>
                  {universityData.requiredDocuments && universityData.requiredDocuments.length > 5 && (
                    <button
                      onClick={() => setShowFullAdmission(!showFullAdmission)}
                      className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline"
                    >
                      {showFullAdmission ? (
                        <>
                          See Less <ChevronUp className="h-4 w-4" />
                        </>
                      ) : (
                        <>
                          See More <ChevronDown className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Scholarships Section */}
            <section id="scholarships">
              <h2 className="text-2xl font-bold text-primary mb-6">Scholarships</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {universityData.scholarships && universityData.scholarships.length > 0 ? (
                  // ✅ এখানেও ': any' নেই।
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
                  <p className="text-muted-foreground col-span-full">No scholarships listed.</p>
                )}
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq">
              <h2 className="text-2xl font-bold text-primary mb-6">FAQ</h2>
              <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
                {universityData.faqs && universityData.faqs.length > 0 ? (
                  // ✅ এখানেও ': any' নেই।
                  universityData.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`}>
                      <AccordionTrigger className="px-6 text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="px-6 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))
                ) : (
                  <div className="p-6 text-muted-foreground">No FAQs available.</div>
                )}
              </Accordion>
            </section>

            {/* Gallery Section */}
<section id="gallery">
  <h2 className="text-2xl font-bold text-primary mb-6">Gallery</h2>
  
  {/* ✅ ডাটাবেস থেকে পাওয়া ডাটা এখানে পাস করা হচ্ছে */}
  <GallerySection 
     images={universityData.galleryImages || []} 
     videos={universityData.galleryVideos || []} 
  />
</section>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 lg:sticky lg:top-[140px] lg:h-fit">
            <InfoSidebar
              institutionName={universityData.name}
              location={universityData.location}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityDetailsPage;