import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  Target, 
  Globe, 
  Award, 
  CheckCircle2, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  
  // ১. স্ট্যাটিক স্ট্যাটস ডাটা
  const stats = [
    { label: "Students Placed", value: "5,000+", icon: Users },
    { label: "Partner Universities", value: "200+", icon: Globe },
    { label: "Visa Success Rate", value: "98%", icon: CheckCircle2 },
    { label: "Years Experience", value: "10+", icon: Award },
  ];

  // ২. স্ট্যাটিক টিম ডাটা (আপনারা পরে ছবি চেঞ্জ করে নেবেন)
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80",
    },
    {
      name: "David Smith",
      role: "Head counselor",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
    },
    {
      name: "Emily Davis",
      role: "Visa Expert",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* --- Section 1: Hero --- */}
      <section className="relative py-20 overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4" variant="secondary">About Orbis Scholar</Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">
            Empowering Dreams, <br />
            <span className="text-primary">Global Opportunities</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            We bridge the gap between ambitious students and world-class universities. Your journey to global education starts here.
          </p>
        </div>
      </section>

     {/* --- Section 2: Stats Grid --- */}
      <section className="py-12 bg-gradient-hero border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                
                <div className="inline-flex p-3 rounded-full bg-white/10 text-white mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <stat.icon className="h-6 w-6" />
                </div>

                <h3 className="text-3xl font-bold mb-1 text-white">{stat.value}</h3>

                <p className="text-sm text-white/80 font-medium uppercase tracking-wide">
                  {stat.label}
                </p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 3: Our Mission (Image + Text) --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80"
              alt="Our Mission"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
              Why We Do What We Do
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              At Orbis Scholar, we believe that education has no borders. Our mission is to democratize access to global education for students everywhere. We understand that the process of studying abroad can be overwhelming, filled with paperwork and uncertainty.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Thats why we built a platform that simplifies everything—from selecting the right university to landing in your dream destination. We are not just consultants; we are career architects.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {["Transparent Process", "Expert Guidance", "Global Network", "Post-Arrival Support"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-5 w-5" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 4: Our Team --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Experts</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our team consists of former international students and certified career counselors who have been in your shoes.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all border-border">
                <div className="relative h-80 w-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="text-center pt-6 pb-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- Section 5: CTA --- */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="bg-primary text-primary-foreground rounded-3xl p-12 relative overflow-hidden">
          {/* Decorative Circle */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Dont let confusion hold you back. Schedule a free consultation with our experts today and take the first step towards your dream university.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="font-bold">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
                <Link href="/services">
                  Explore Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}