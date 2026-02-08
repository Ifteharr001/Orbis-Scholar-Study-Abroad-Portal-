"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  TrendingUp, 
  Wallet, 
  Award, 
  ShieldCheck, 
  Globe2, 
  BookOpen, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WhyChinaPage() {
  
  const benefits = [
    {
      icon: Wallet,
      title: "Affordable Education",
      desc: "Tuition fees in China are 70% lower than in the USA or UK. You can complete a degree for as low as $2,000/year."
    },
    {
      icon: Award,
      title: "Fully Funded Scholarships",
      desc: "The Chinese Government (CSC), Provincial, and University scholarships often cover full tuition, accommodation, and monthly stipends."
    },
    {
      icon: TrendingUp,
      title: "Economic Powerhouse",
      desc: "As the world's 2nd largest economy, China offers immense internship and job opportunities in tech, trade, and engineering."
    },
    {
      icon: ShieldCheck,
      title: "Safe Environment",
      desc: "China is one of the safest countries for international students with a very low crime rate and modern infrastructure."
    },
    {
      icon: BookOpen,
      title: "English Taught Programs",
      desc: "You don't need to know Chinese! Thousands of universities offer MBBS, Engineering, and Business degrees fully in English."
    },
    {
      icon: Globe2,
      title: "Global Recognition",
      desc: "Degrees from Chinese universities are recognized globally by WHO, MOE, and engineering councils worldwide."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      
      <section className="relative py-24 flex items-center justify-center overflow-hidden">
    
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.unsplash.com/photo-1547981609-4b6bfe6770b0?w=1600&q=80" 
            alt="Great Wall of China" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-red-900/70 to-black/50" />
        </div>

        <div className="container relative z-10 px-4 text-center text-white">
          <Badge className="bg-yellow-500 text-black hover:bg-yellow-400 border-none mb-6 px-4 py-1.5 text-md font-bold">
            #1 Study Destination in Asia
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            Why Study in <span className="text-yellow-400">China?</span>
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed mb-10">
            Experience world-class education without the burden of student debt. Join over 500,000 international students exploring the future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold h-14 px-8 text-lg rounded-full">
              Explore Universities
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent h-14 px-8 text-lg rounded-full">
              Check Scholarships
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Reasons to Choose China</h2>
            <p className="text-muted-foreground">More than just a degree, it  an investment in your future.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((item, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                    <item.icon className="h-7 w-7 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Quality Education, <br/>
                <span className="text-red-600">Fraction of the Cost</span>
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                One of the biggest advantages of studying in China is affordability. While western universities charge exorbitant fees, China offers the same quality of education at government-subsidized rates.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 h-6 w-6" />
                    <span className="font-medium text-slate-800">Low Tuition Fees ($2,000 - $4,000 / year)</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 h-6 w-6" />
                    <span className="font-medium text-slate-800">Affordable Dormitories ($500 - $1,000 / year)</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="text-green-500 h-6 w-6" />
                    <span className="font-medium text-slate-800">Cheap Living Cost (~$200 / month)</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-500 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-slate-900 text-white p-8 rounded-2xl shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-center border-b border-white/10 pb-4">Yearly Cost Comparison (Avg.)</h3>
                
                <div className="grid grid-cols-3 gap-4 text-center mb-6 text-sm md:text-base">
                   <div className="text-slate-400">Country</div>
                   <div className="text-slate-400">Tuition</div>
                   <div className="text-slate-400">Living</div>
                </div>

                <div className="space-y-4">
                   <div className="grid grid-cols-3 gap-4 text-center items-center py-3 bg-white/5 rounded-lg">
                      <div className="font-bold">USA 🇺🇸</div>
                      <div>$25,000+</div>
                      <div>$15,000+</div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-center items-center py-3 bg-white/5 rounded-lg">
                      <div className="font-bold">UK 🇬🇧</div>
                      <div>$20,000+</div>
                      <div>$12,000+</div>
                   </div>
                   <div className="grid grid-cols-3 gap-4 text-center items-center py-4 bg-gradient-to-r from-red-600 to-red-700 rounded-lg transform scale-105 shadow-lg border border-red-500">
                      <div className="font-bold">China 🇨🇳</div>
                      <div className="font-bold text-yellow-300">$2,500</div>
                      <div className="font-bold text-yellow-300">$2,000</div>
                   </div>
                </div>
                
                <p className="text-center text-xs text-slate-400 mt-6">* Costs are estimates and vary by city.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">Popular Programs for International Students</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "MBBS & Medicine",
              "Computer Science",
              "Civil Engineering",
              "International Business",
              "Mechanical Eng.",
              "Chinese Language",
              "Architecture",
              "Aeronautical Eng."
            ].map((course, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm font-semibold text-slate-700 hover:text-red-600 hover:border-red-200 transition-colors cursor-default">
                {course}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Journey in China?
          </h2>
          <p className="text-red-100 text-lg mb-8">
            We are the official admission partners for 50+ top Chinese universities. Get your admission letter in just 7 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 font-bold h-14 px-10 rounded-full text-lg shadow-lg" asChild>
              <Link href="/student/apply">Apply Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-red-200 bg-transparent text-white hover:bg-red-700 font-bold h-14 px-10 rounded-full text-lg" asChild>
              <Link href="/contact">Talk to Counselor</Link>
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}