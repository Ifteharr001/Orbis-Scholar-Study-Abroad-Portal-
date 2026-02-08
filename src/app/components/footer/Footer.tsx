import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, MapPin, Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo2.png";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const Footer = () => {
  const quickLinks = [
    { title: "Home", href: "/" },
    { title: "Partner Universities", href: "/universities" },
    { title: "Scholarships", href: "/scholarships" },
    { title: "Success Stories", href: "/about/success-stories" },
    { title: "Contact Us", href: "/contact" },
  ];

  const services = [
    { title: "Admission Assistance", href: "/services/admission" },
    { title: "Visa Support", href: "/services/visa" },
    { title: "Scholarship Guidance", href: "/services/scholarship" },
    { title: "Career Counseling", href: "/services/career" },
    { title: "Airport Pickup", href: "/services/airport" },
  ];

  const destinations = [
    { title: "Study in USA", href: "/destinations/usa" },
    { title: "Study in UK", href: "/destinations/uk" },
    { title: "Study in Canada", href: "/destinations/canada" },
    { title: "Study in Australia", href: "/destinations/australia" },
    { title: "Study in Germany", href: "/destinations/germany" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <footer className="bg-foreground text-background">
    
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
    
          <div className="lg:col-span-2">
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
            <p className="text-background/70 mb-6 max-w-sm">
              Your trusted partner for international education. We help students achieve their dreams of studying at top universities worldwide.
            </p>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3">Subscribe to Newsletter</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button size="icon" className="bg-gradient-secondary shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-background/10 hover:bg-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.title}>
                  <Link
                    href={service.href}
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-secondary mt-0.5" />
                <span className="text-background/70">
                  123 Education Street, Suite 100<br />
                  New York, NY 10001
                </span>
              </li>
              <li>
                <a href="tel:+1234567890" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                  <Phone className="h-5 w-5 text-secondary" />
                  +86 131 6640 9570

                </a>
              </li>
              <li>
                <a href="mailto:info@studyabroad.com" className="flex items-center gap-3 text-background/70 hover:text-background transition-colors">
                  <Mail className="h-5 w-5 text-secondary" />
                  info@orbicsglobal.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-background/60 text-sm text-center md:text-left">
            © {new Date().getFullYear()} TechByBee. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-background/60 hover:text-background transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-background/60 hover:text-background transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;