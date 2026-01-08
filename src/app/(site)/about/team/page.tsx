import Image from "next/image";
import Link from "next/link";
import { 
  Linkedin, 
  Twitter, 
  Mail, 
  ArrowRight,
  GraduationCap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function TeamPage() {

  // ১. স্ট্যাটিক টিম ডাটা (আপনারা ছবি ও নাম চেঞ্জ করে নেবেন)
  const teamMembers = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Founder & CEO",
      bio: "Former Harvard alumni with 15+ years of experience in international education and career counseling.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sarah@orbisscholar.com"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Head of Admissions",
      bio: "Expert in Ivy League and UK University admissions. Helped 1000+ students secure scholarships.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "michael@orbisscholar.com"
      }
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Visa Consultant",
      bio: "Certified immigration specialist ensuring 99% visa success rate for USA, Canada, and Australia.",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emily@orbisscholar.com"
      }
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Student Mentor",
      bio: "Provides pre-departure briefing and post-arrival support to ensure students settle in comfortably.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "james@orbisscholar.com"
      }
    },
    {
      id: 5,
      name: "Sophia Martinez",
      role: "Scholarship Expert",
      bio: "Specializes in finding fully funded scholarships and grants for meritorious students.",
      image: "https://images.unsplash.com/photo-1598550874175-4d7112ee7f38?w=800&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sophia@orbisscholar.com"
      }
    },
    {
      id: 6,
      name: "David Kim",
      role: "University Partner Manager",
      bio: "Manages relationships with 200+ universities globally to ensure fast offer letters.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@orbisscholar.com"
      }
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* --- Section 1: Hero --- */}
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4" variant="outline">Meet The Team</Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Guides, Mentors, & <br />
            <span className="text-primary">Career Architects</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We are a team of dedicated professionals committed to shaping your future. Meet the people behind your success stories.
          </p>
        </div>
      </section>

      {/* --- Section 2: Team Grid --- */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden group border-border hover:shadow-xl transition-all duration-300">
                
                {/* Image Area */}
                <div className="relative h-80 w-full overflow-hidden bg-muted">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Social Overlay (Only shows on hover) */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link href={member.social.linkedin} className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors">
                      <Linkedin className="h-5 w-5" />
                    </Link>
                    <Link href={member.social.twitter} className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors">
                      <Twitter className="h-5 w-5" />
                    </Link>
                    <Link href={`mailto:${member.social.email}`} className="p-3 bg-white rounded-full text-black hover:bg-primary hover:text-white transition-colors">
                      <Mail className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                {/* Content Area */}
                <CardContent className="text-center pt-8 pb-8 px-6">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-4">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Join Us CTA --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-card border border-border p-10 rounded-3xl shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <GraduationCap className="h-8 w-8 text-primary" />
                <span className="text-lg font-semibold text-primary">Join Orbis Scholar</span>
              </div>
              <h2 className="text-3xl font-bold mb-3">Are you passionate about education?</h2>
              <p className="text-muted-foreground max-w-lg">
                We are always looking for talented counselors and partners to join our mission of democratizing global education.
              </p>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="bg-primary hover:opacity-90">
                Join Our Team
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Contact Us <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}