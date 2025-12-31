"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "programs", label: "Programs" },
  { id: "about", label: "About" },
  { id: "fees", label: "Fees Structure" },
  { id: "accommodation", label: "Accommodation" },
  { id: "admission", label: "Admission Process" },
  { id: "scholarships", label: "Scholarships" },
  { id: "faq", label: "FAQ" },
  { id: "gallery", label: "Gallery" },
];

const SectionNav = () => {
  const [activeSection, setActiveSection] = useState("programs");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 160;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-[56px] md:top-[70px] z-30 bg-background border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide py-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
                activeSection === section.id
                  ? "text-primary border-primary"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SectionNav;