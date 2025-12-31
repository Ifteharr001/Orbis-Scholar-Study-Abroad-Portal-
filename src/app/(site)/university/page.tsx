"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ChevronDown, ChevronUp, CheckCircle, FileText, CreditCard, Home as HomeIcon } from "lucide-react";
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
import ScholarshipCard from "../../components/university/ScholarshipCard";
import ProgramCard from "../../components/university/ProgramCard";
import InfoSidebar from "../../components/university/InfoSidebar";
import SectionNav from "../../components/university/SectionNav";
import GallerySection from "../../components/university/GallerySection";

const universityData = {
  name: "Beihang University (Hangzhou International Campus)",
  location: "Hangzhou, Zhejiang Province",
  heroImage: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920",
  logo: "https://images.unsplash.com/photo-1562774053-701939374585?w=1920",
  programs: [
    {
      id: 1,
      name: "Computer Science & Technology",
      degree: "Undergraduate/Bachelor Degree",
      language: "English",
      duration: "4 Years",
      tuitionFee: "¥30,000.00",
      accommodationFee: "¥2,000.00",
      hasScholarship: true,
    },
    {
      id: 2,
      name: "International Trade & Economics",
      degree: "Undergraduate/Bachelor Degree",
      language: "English",
      duration: "4 Years",
      tuitionFee: "¥30,000.00",
      accommodationFee: "¥2,000.00",
      hasScholarship: true,
    },
  ],
  scholarships: [
    {
      name: "Beihang University Scholarship for Bachelor Degree - Type A",
      type: "Type A",
      tuitionFee: "Free",
      accommodationFee: "Free",
      insuranceFee: "N/A",
      monthlyStipend: "¥2,500",
      yearlyStipend: "N/A",
    },
    {
      name: "Beihang University Scholarship for Bachelor Degree - Type B",
      type: "Type B",
      tuitionFee: "Free",
      accommodationFee: "N/A",
      insuranceFee: "N/A",
      monthlyStipend: "N/A",
      yearlyStipend: "N/A",
    },
    {
      name: "Beihang University Scholarship for Bachelor Degree - Type C",
      type: "Type C",
      tuitionFee: "¥7,000",
      accommodationFee: "N/A",
      insuranceFee: "N/A",
      monthlyStipend: "N/A",
      yearlyStipend: "N/A",
    },
    {
      name: "Beihang University Scholarship for Bachelor Degree - Type D",
      type: "Type D",
      tuitionFee: "¥15,000",
      accommodationFee: "N/A",
      insuranceFee: "N/A",
      monthlyStipend: "N/A",
      yearlyStipend: "N/A",
    },
    {
      name: "Beihang University Scholarship for Bachelor Degree - Type E",
      type: "Type E",
      tuitionFee: "¥21,000",
      accommodationFee: "N/A",
      insuranceFee: "N/A",
      monthlyStipend: "N/A",
      yearlyStipend: "N/A",
    },
  ],
  fees: {
    bachelor: {
      tuition: "¥30,000 – ¥30,000",
      accommodation: "¥4,000 – ¥4,000",
      insurance: "¥800",
      visaExtension: "¥400",
      medical: "¥500",
    },
  },
  requiredDocuments: [
    "Passport Information Page – Valid until at least September 30, 2026",
    "Highest Education Diploma or Certificate of Expected Graduation",
    "Official Academic Transcripts – Covering all completed high school subjects",
    "Foreigner Physical Examination Form and Blood Test Report – Must be issued within the last six months",
    "Proof of English Proficiency – Such as TOEFL, IELTS, Duolingo, or an equivalent certificate",
    "Financial Guarantee Letter and Proof of Funds",
    "Birth Certificate of the applicant",
    "Parents' Nationality Certificates",
    "Certificate of Non-Criminal Record – Issued within the last six months",
    "Integrity Commitment Letter",
    "Guardian Notarization Documents – Required for applicants under 18 years old",
  ],
  faqs: [
    {
      question: "What are the admission requirements for international students?",
      answer: "International students must have completed high school education, provide proof of English proficiency (IELTS 5.5+ or equivalent), and submit all required documents including passport, transcripts, and health examination.",
    },
    {
      question: "Is there an age limit for applicants?",
      answer: "Undergraduate applicants should generally be between 18-25 years old. Applicants under 18 require guardian notarization documents.",
    },
    {
      question: "When does the academic year start?",
      answer: "The academic year typically begins in September. Application deadlines are usually in May-June for the fall semester.",
    },
    {
      question: "Can I work part-time while studying?",
      answer: "International students on study visas have limited work opportunities. Part-time work may be allowed on campus with proper authorization.",
    },
  ],
};

const UniversityDetailsPage = () => {
  const params = useParams();
  const id = params?.id; // Access ID safely
  
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [showFullAccommodation, setShowFullAccommodation] = useState(false);
  const [showFullAdmission, setShowFullAdmission] = useState(false);

  const aboutText = `The Beihang University Hangzhou Innovation Institute (HZI), founded through collaboration between Beihang University, Zhejiang Province, and the Hangzhou and Binjiang District Governments, is a leading hub for technological innovation and talent development in China. Situated in Hangzhou's vibrant Binjiang District, the institute bridges education, research, and industry, fostering breakthroughs that support China's innovation-driven growth.

HZI focuses on key research areas such as artificial intelligence, information technology, Internet Plus, life and health sciences, and new materials. Its "7 + 1 + 3 + N" innovation model includes seven major research centers, one national-level platform, and several provincial and municipal innovation bases. This structure promotes collaborative research and rapid transformation of scientific achievements into industrial applications.

With nearly 300 researchers, including 83 experts from Beihang University and 37 national-level talents, the institute upholds world-class academic standards. Over 60% of its team holds doctoral degrees, and partnerships with leading companies like Huawei and NetEase enable students to engage in real-world projects through joint training and research programs.

Through its forward-thinking vision, the Beihang University Hangzhou Innovation Institute is vital in advancing technological innovation, cultivating high-level talent, and contributing to China's leadership in global science and industry.`;

  const accommodationText = `The Beihang University Hangzhou Innovation Institute (HZI) provides all students with well-furnished and affordable on-campus accommodation. Located at No. 166 Shuanghongqiao Street, Pingyao Town, Yuhang District, Hangzhou, the dormitories offer a comfortable and secure living environment within walking distance of classrooms, laboratories, and cafeterias.

Each room is equipped with basic facilities, including a bed, desk, chair, wardrobe, air conditioning, and high-speed internet. Students can stay in single or shared rooms, depending on availability and program level. The residence environment is clean, peaceful, and conducive to both study and rest.

Accommodation at the Hangzhou campus is very affordable. The annual fee is 4,000 CNY per student, covering the entire academic year. Rooms are assigned on a first-come, first-served basis, so students are encouraged to apply early through the university's international office.

With modern facilities and a supportive atmosphere, the Beihang University Hangzhou Innovation Institute ensures that every student enjoys a safe, convenient, and community-oriented campus life.`;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${universityData.heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        <div className="container relative h-full flex items-center mx-auto px-4">
          <div className="flex items-center gap-6">
            <div className="hidden md:block w-32 h-32 rounded-full bg-background p-2 shadow-lg relative overflow-hidden">
               {/* Using Next.js Image component - Ensure 'images.unsplash.com' is in next.config.js */}
              <Image
                src={universityData.logo}
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
                {universityData.programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    name={program.name}
                    degree={program.degree}
                    language={program.language}
                    duration={program.duration}
                    tuitionFee={program.tuitionFee}
                    accommodationFee={program.accommodationFee}
                    hasScholarship={program.hasScholarship}
                  />
                ))}
              </div>
            </section>

            {/* About Section */}
            <section id="about">
              <h2 className="text-2xl font-bold text-primary mb-6">About</h2>
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Beihang University Hangzhou Innovation Institute: Driving Innovation and Research Excellence
                </h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line">
                    {showFullAbout ? aboutText : aboutText.split("\n\n").slice(0, 2).join("\n\n")}
                  </p>
                </div>
                <button
                  onClick={() => setShowFullAbout(!showFullAbout)}
                  className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline"
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
            </section>

            {/* Accommodation Section */}
            <section id="accommodation">
              <h2 className="text-2xl font-bold text-primary mb-6">Accommodation</h2>
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p className="whitespace-pre-line">
                    {showFullAccommodation
                      ? accommodationText
                      : accommodationText.split("\n\n").slice(0, 2).join("\n\n")}
                  </p>
                </div>
                <button
                  onClick={() => setShowFullAccommodation(!showFullAccommodation)}
                  className="mt-4 flex items-center gap-2 text-primary font-medium hover:underline"
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
                {/* Application Fee */}
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
                    {(showFullAdmission
                      ? universityData.requiredDocuments
                      : universityData.requiredDocuments.slice(0, 5)
                    ).map((doc, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{doc}</span>
                      </li>
                    ))}
                  </ul>
                  {universityData.requiredDocuments.length > 5 && (
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
                {universityData.scholarships.map((scholarship, index) => (
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
                ))}
              </div>
            </section>

            {/* FAQ Section */}
            <section id="faq">
              <h2 className="text-2xl font-bold text-primary mb-6">FAQ</h2>
              <Accordion type="single" collapsible className="bg-card rounded-xl border border-border">
                {universityData.faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="px-6 text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-6 text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Gallery Section */}
            <section id="gallery">
              <h2 className="text-2xl font-bold text-primary mb-6">Gallery</h2>
              <GallerySection />
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80">
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