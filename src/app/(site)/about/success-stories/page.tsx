import Image from "next/image";
import Link from "next/link";
import { 
  Quote, 
  MapPin, 
  GraduationCap, 
  Play, 
  Star, 
  ArrowRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function SuccessStoriesPage() {

  // ১. স্ট্যাটিক স্টোরি ডাটা (পরবর্তীতে ডাটাবেস থেকে আনা যাবে)
  const stories = [
    {
      id: 1,
      name: "Anika Tabassum",
      university: "University of Toronto",
      country: "Canada",
      course: "MSc in Data Science",
      scholarship: "$25,000 Scholarship",
      image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80",
      quote: "Orbis Scholar made my dream a reality. I never thought I could get a scholarship in Canada with my CGPA, but their SOP team did magic!",
    },
    {
      id: 2,
      name: "Rahim Ahmed",
      university: "University of Manchester",
      country: "UK",
      course: "LLM International Law",
      scholarship: "Fully Funded",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80",
      quote: "The visa process for the UK is tricky, but the mock interviews helped me gain confidence. I got my visa in just 7 days!",
    },
    {
      id: 3,
      name: "Priya Das",
      university: "Monash University",
      country: "Australia",
      course: "Bachelor of Business",
      scholarship: "20% Tuition Waiver",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80",
      quote: "From university selection to airport pickup, they guided me at every step. Highly recommended for Australia applications.",
    },
    {
      id: 4,
      name: "Sajid Hasan",
      university: "TU Munich",
      country: "Germany",
      course: "MSc Engineering",
      scholarship: "Free Tuition",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
      quote: "Applying to Germany requires precise documentation. Orbis Scholar ensured my blocked account and uni-assist application were perfect.",
    },
    {
      id: 5,
      name: "Mehereen Khan",
      university: "Arizona State University",
      country: "USA",
      course: "MBA",
      scholarship: "$10,000 Grant",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&q=80",
      quote: "I was worried about the US visa interview. The counselors took 5 mock interviews which prepared me for every possible question.",
    },
    {
      id: 6,
      name: "Arjun Reddy",
      university: "University of Auckland",
      country: "New Zealand",
      course: "IT & Computing",
      scholarship: "Partial Funding",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80",
      quote: "Best agency for honest advice. They didn't push me to expensive universities but found one that fit my budget perfectly.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* --- Section 1: Hero --- */}
      <section className="py-20 bg-muted/30 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-primary/10 text-primary border-none">Success Stories</Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Real Students, <br />
            <span className="text-primary">Real Results</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Dont just take our word for it. Read the stories of students who have successfully reached their dream destinations.
          </p>
        </div>
      </section>

      {/* --- Section 2: Achievement Stats --- */}
      <section className="bg-primary py-12 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-white/20">
            <div>
              <h3 className="text-4xl font-bold mb-1">$5M+</h3>
              <p className="text-sm opacity-90">Scholarships Secured</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">98%</h3>
              <p className="text-sm opacity-90">Visa Success Rate</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">50+</h3>
              <p className="text-sm opacity-90">Countries Covered</p>
            </div>
            <div>
              <h3 className="text-4xl font-bold mb-1">5000+</h3>
              <p className="text-sm opacity-90">Happy Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Stories Grid --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <Card key={story.id} className="group border-border hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              
              {/* Image & Location Badge */}
              <div className="relative h-60 w-full overflow-hidden rounded-t-xl">
                <Image
                  src={story.image}
                  alt={story.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="flex items-center gap-1 shadow-md bg-white/90 backdrop-blur text-black">
                    <MapPin className="h-3 w-3 text-primary" /> {story.country}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 flex-1 flex flex-col">
                {/* Scholarship Badge */}
                <div className="mb-4">
                   <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                      <Star className="h-3 w-3 mr-1 fill-primary" /> {story.scholarship}
                   </Badge>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{story.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <GraduationCap className="h-4 w-4" />
                    {story.university}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    {story.course}
                  </p>
                </div>

                {/* Quote Area */}
                <div className="mt-auto relative bg-muted/30 p-4 rounded-xl">
                  <Quote className="h-6 w-6 text-primary/20 absolute -top-3 -left-2 fill-primary" />
                  <p className="text-sm text-muted-foreground italic leading-relaxed relative z-10">
                    {story.quote}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* --- Section 4: Video Testimonial Feature --- */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Watch Success Stories</h2>
          
          <div className="relative max-w-4xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80"
              alt="Video Thumbnail"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
              <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Play className="h-8 w-8 text-primary fill-primary ml-1" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 text-left text-white">
              <h3 className="text-2xl font-bold">From Dhaka to London</h3>
              <p className="opacity-90">Watch Sarahs journey to Queen Mary University</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 5: CTA --- */}
      <section className="py-20 container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            You Could Be Next!
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start your application today and let us help you write your own success story.
          </p>
          <Button size="lg" className="bg-gradient-primary text-lg px-8" asChild>
            <Link href="/student/apply">
              Start Your Application <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

    </div>
  );
}