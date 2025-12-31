"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { Menu, X, ChevronDown, Phone, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const services = [
    { title: "Admission Assistance", href: "/services/admission", description: "Complete guidance for university admissions" },
    { title: "Visa Support", href: "/services/visa", description: "Expert visa application assistance" },
    { title: "Scholarship Guidance", href: "/services/scholarship", description: "Find and apply for scholarships" },
    { title: "Career Counseling", href: "/services/career", description: "Professional career guidance" },
  ];

  const aboutLinks = [
    { title: "About Us", href: "/about" },
    { title: "Our Team", href: "/about/team" },
    { title: "Success Stories", href: "/about/success-stories" },
    { title: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-6 text-sm">
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="h-4 w-4" />
              +1 (234) 567-890
            </a>
            <a href="mailto:info@studyabroad.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="h-4 w-4" />
              info@studyabroad.com
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <User className="h-4 w-4" />
              Student Login
            </Link>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
       <Link href="/" className="flex items-center gap-2">
       <Image 
            src={logo} 
            alt="Orbis Scholar Logo" 
            width={500} 
            height={150} 
            className="h-14 w-auto object-contain" 
            priority
            quality={100} 
          />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Home
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/universities" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Partner Universities
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/scholarships" className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                Scholarships
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-popover">
                  {services.map((service) => (
                    <li key={service.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={service.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{service.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {service.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium">About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 bg-popover">
                  {aboutLinks.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={link.href}
                          className="block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          {link.title}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

      {/* CTA Buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/consultation">Free Consultation</Link>
          </Button>
          
          <Button 
            className="bg-gradient-secondary hover:bg-none hover:bg-accent hover:text-accent-foreground transition-all duration-300" 
            asChild
          >
            <Link href="/apply">Apply Now</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background absolute w-full left-0 top-16 z-50 shadow-lg">
          <nav className="container py-4 space-y-4 mx-auto px-4">
            <Link href="/" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/universities" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Partner Universities
            </Link>
            <Link href="/scholarships" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Scholarships
            </Link>
            <div className="py-2">
              <span className="font-medium text-foreground">Services</span>
              <div className="ml-4 mt-2 space-y-2">
                {services.map((service) => (
                  <Link
                    key={service.title}
                    href={service.href}
                    className="block py-1 text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="py-2">
              <span className="font-medium text-foreground">About</span>
              <div className="ml-4 mt-2 space-y-2">
                {aboutLinks.map((link) => (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="block py-1 text-muted-foreground hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/consultation" onClick={() => setIsMobileMenuOpen(false)}>Free Consultation</Link>
              </Button>
              <Button className="w-full bg-gradient-secondary" asChild>
                <Link href="/apply" onClick={() => setIsMobileMenuOpen(false)}>Apply Now</Link>
              </Button>
              <Link href="/auth" className="flex items-center justify-center gap-2 py-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                <User className="h-4 w-4" />
                Student Login
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;