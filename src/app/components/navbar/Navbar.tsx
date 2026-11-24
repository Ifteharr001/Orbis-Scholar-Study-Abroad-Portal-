"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/logo.png";
import { 
  Menu, X, ChevronDown, Phone, Mail, User, 
  LayoutDashboard, LogOut, School
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth"; 

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
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  const services = [
    { title: "All Services", href: "/services", description: "View Our All Services" },
    { title: "Admission Assistance", href: "/services/695fce0a98bd3056f18d1c94", description: "Complete guidance for university admissions" },
    { title: "Visa Support", href: "/services/695fce5f98bd3056f18d1c99", description: "Expert visa application assistance" },
    { title: "Scholarship Guidance", href: "/services/695fce6c98bd3056f18d1c9e", description: "Find and apply for scholarships" },
    
  ];
  const toggleMobileSubmenu = (menu: string) => {
    setOpenMobileSubmenu(openMobileSubmenu === menu ? null : menu);
  };

  const aboutLinks = [
    { title: "About Us", href: "/about" },
    { title: "Our Team", href: "/about/team" },
    { title: "Success Stories", href: "/about/success-stories" },
  ];
  
  const expoLinks = [
   {title: "Expo In China", href: "/expo/china"},
   {title: "Expo In Overseas", href: "/expo/overseas"}
  ];

const moreLinks = [
  {title: "Partner", href: "/more/partner"},
  {title: "Blog", href: "/more/blog"},
  {title: "Event", href: "/more/event"},
  {title: "FAQ", href: "/more/faq"},
  {title: "Payment Process", href: "/more/payment-process"},
  {title: "Open Application", href: "/more/open-application"},
  {title: "Updates", href: "/more/updates"},
  {title: "Notice Board", href: "/more/notice-board"},
  {title: "Why China?", href: "/more/why-china"},
  {title: "About China", href: "/more/about-china"}
];

const contactLinks = [
  {title: "Contact Us", href: "/contact"},
  {title: "Head Office", href: "/contact/head-office"},
]




  const { role, isAuthenticated, signOut } = useAuth();
  
  return (
    <header className="sticky top-0 z-[100] w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="hidden md:block bg-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-6 text-sm">
            <a href="tel:+1234567890" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Phone className="h-4 w-4" />
              +86 131 6640 9570
            </a>
            <a href="mailto:info@studyabroad.com" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Mail className="h-4 w-4" />
              info@orbicsglobal.com
            </a>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
           {isAuthenticated ? (
              <div className="flex items-center gap-4">
               
                <Link
                  href={role === "partner" ? "/partner/dashboard" : "/student/dashboard"}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {role === "partner" ? "Partner Dashboard" : "Student Dashboard"}
                </Link>

                <div className="h-4 w-[1px] bg-primary-foreground/30"></div>

             
                <button
                  onClick={async () => {
                    const redirectUrl = role === "partner" ? "/partnerAuth" : "/userAuth";
                    await signOut({ callbackUrl: redirectUrl });
                  }}
                  className="flex items-center gap-2 hover:text-red-200 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/userAuth"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <User className="h-4 w-4" />
                  Student Login
                </Link>
                
                <span className="text-primary-foreground/30">|</span>

                <Link
                  href="/partnerAuth"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <School className="h-4 w-4" />
                  Partner Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container flex h-16 items-center justify-between mx-auto px-4 relative">
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
        <NavigationMenu className="hidden lg:flex relative z-[101]">
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
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 bg-popover/100 rounded-md shadow-lg">
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

            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger  className="text-sm font-medium">About</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 bg-popover/100 rounded-md shadow-lg">
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
            {/* expo button */}


<NavigationMenuItem className="relative">
              <NavigationMenuTrigger className="text-sm font-medium">Expo</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 bg-popover/100 rounded-md shadow-lg">
                  {expoLinks.map((link) => (
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


{/* more button */}



<NavigationMenuItem className="relative">
              <NavigationMenuTrigger className="text-sm font-medium">More</NavigationMenuTrigger>
              {/* ✅ Fix 3: Reverted to standard positioning but with solid background to prevent see-through */}
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 bg-popover/100 rounded-md shadow-lg">
                  {moreLinks.map((link) => (
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







{/* contact button */}
<NavigationMenuItem className="relative">
              <NavigationMenuTrigger className="text-sm font-medium">Contact</NavigationMenuTrigger>
              {/* ✅ Fix 3: Reverted to standard positioning but with solid background to prevent see-through */}
              <NavigationMenuContent>
                <ul className="grid w-[200px] gap-2 p-4 bg-popover/100 rounded-md shadow-lg">
                  {contactLinks.map((link) => (
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

      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <nav className="container py-4 space-y-1">
            <Link href="/" className="block py-3 text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/universities" className="block py-3 text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Partner Universities
            </Link>
            <Link href="/scholarships" className="block py-3 text-foreground hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>
              Scholarships
            </Link>
            
            {/* Services Dropdown */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary"
                onClick={() => toggleMobileSubmenu('services')}
              >
                <span className="font-medium">Services</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSubmenu === 'services' && "rotate-180")} />
              </button>
              {openMobileSubmenu === 'services' && (
                <div className="ml-4 border-l border-border pl-4 space-y-1">
                  {services.map((service) => (
                    <Link
                      key={service.title}
                      href={service.href}
                      className="block py-2 text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About Dropdown */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary"
                onClick={() => toggleMobileSubmenu('about')}
              >
                <span className="font-medium">About</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSubmenu === 'about' && "rotate-180")} />
              </button>
              {openMobileSubmenu === 'about' && (
                <div className="ml-4 border-l border-border pl-4 space-y-1">
                  {aboutLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block py-2 text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>



{/* Expo Dropdown */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary"
                onClick={() => toggleMobileSubmenu('expo')}
              >
                <span className="font-medium">Expo</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSubmenu === 'expo' && "rotate-180")} />
              </button>
              {openMobileSubmenu === 'expo' && (
                <div className="ml-4 border-l border-border pl-4 space-y-1">
                  {expoLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block py-2 text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>








{/* More Dropdown */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary"
                onClick={() => toggleMobileSubmenu('more')}
              >
                <span className="font-medium">Expo</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSubmenu === 'more' && "rotate-180")} />
              </button>
              {openMobileSubmenu === 'more' && (
                <div className="ml-4 border-l border-border pl-4 space-y-1">
                  {moreLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block py-2 text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>






{/* More Dropdown */}
            <div>
              <button
                className="flex items-center justify-between w-full py-3 text-foreground hover:text-primary"
                onClick={() => toggleMobileSubmenu('contact')}
              >
                <span className="font-medium">Contact</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSubmenu === 'contact' && "rotate-180")} />
              </button>
              {openMobileSubmenu === 'contact' && (
                <div className="ml-4 border-l border-border pl-4 space-y-1">
                  {contactLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="block py-2 text-muted-foreground hover:text-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>




            <div className="flex flex-col gap-3 pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link href="/consultation" onClick={() => setIsMobileMenuOpen(false)}>Free Consultation</Link>
              </Button>
              <Button className="w-full bg-gradient-secondary" asChild>
                <Link href="/apply" onClick={() => setIsMobileMenuOpen(false)}>Apply Now</Link>
              </Button>
              
              {isAuthenticated ? (
                <>
                  <Link 
                    href={role === "partner" ? "/partner/dashboard" : "/student/dashboard"}
                    className="flex items-center justify-center gap-2 py-2 text-primary font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {role === "partner" ? "Partner Dashboard" : "Student Dashboard"}
                  </Link>
                  <button
                    onClick={async () => {
                      const redirectUrl = role === "partner" ? "/partnerAuth" : "/userAuth";
                      await signOut({ callbackUrl: redirectUrl });
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 py-2 text-destructive font-medium w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/userAuth" className="flex items-center justify-center gap-2 py-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="h-4 w-4" />
                    Student Login
                  </Link>
                  <Link href="/partnerAuth" className="flex items-center justify-center gap-2 py-2 text-primary" onClick={() => setIsMobileMenuOpen(false)}>
                    <School className="h-4 w-4" />
                    Partner Login
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;