"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Landmark, 
  Utensils, 
  Smartphone, 
  Train, 
  MapPin, 
  Camera,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function AboutChinaPage() {

  // জীবনযাত্রা সম্পর্কিত ফিচার
  const lifestyle = [
    {
      icon: Smartphone,
      title: "Cashless Society",
      desc: "Leave your wallet at home! From street food to shopping malls, pay for everything using WeChat Pay or Alipay on your phone."
    },
    {
      icon: Train,
      title: "High-Speed Travel",
      desc: "China has the world's largest high-speed rail network. Travel between cities at 350 km/h comfortably and affordably."
    },
    {
      icon: Utensils,
      title: "Food Paradise",
      desc: "Experience authentic Hot Pot, Dumplings, and Noodles. Food is incredibly cheap, diverse, and available 24/7."
    },
    {
      icon: Camera,
      title: "Scenic Beauty",
      desc: "From the Avatar mountains of Zhangjiajie to the futuristic skyline of Shanghai, China offers breathtaking views."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      
      {/* --- Section 1: Hero Banner --- */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=1600&q=80" 
          alt="Shanghai Skyline" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        
        <div className="container relative z-10 px-4 text-center text-white mt-20">
          <Badge className="bg-red-600 hover:bg-red-700 text-white border-none mb-4 px-4 py-1 text-md">
            Discover the Dragon
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold font-display mb-6">
            About <span className="text-yellow-400">China</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Where 5,000 years of history meets the future. Explore a country of innovation, culture, and endless opportunities.
          </p>
        </div>
      </section>

      {/* --- Section 2: Intro (Tradition vs Modernity) --- */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
             <Image 
               src="https://images.unsplash.com/photo-1526510336262-5c8c22736171?w=800&q=80"
               alt="Traditional China"
               fill
               className="object-cover group-hover:scale-110 transition-transform duration-700"
             />
             <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                <p className="font-bold text-slate-900 flex items-center gap-2">
                   <Landmark className="h-4 w-4 text-red-600" /> Ancient Heritage
                </p>
             </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
              A Blend of <span className="text-red-600">Old & New</span>
            </h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              China is a land of contrasts. You can walk through the Forbidden City in Beijing in the morning and take a Maglev train in Shanghai in the afternoon. 
            </p>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              For students, this means living in a society that values tradition and discipline while providing access to the most advanced technology in the world.
            </p>
            <div className="grid grid-cols-3 gap-4 text-center">
               <div className="bg-red-50 p-4 rounded-xl">
                  <h3 className="text-2xl font-bold text-red-600">1.4B</h3>
                  <p className="text-xs text-slate-500 uppercase font-bold">Population</p>
               </div>
               <div className="bg-red-50 p-4 rounded-xl">
                  <h3 className="text-2xl font-bold text-red-600">56</h3>
                  <p className="text-xs text-slate-500 uppercase font-bold">Ethnic Groups</p>
               </div>
               <div className="bg-red-50 p-4 rounded-xl">
                  <h3 className="text-2xl font-bold text-red-600">#2</h3>
                  <p className="text-xs text-slate-500 uppercase font-bold">Economy</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Section 3: Major Student Cities (Interactive Tabs) --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Student Cities</h2>
            <p className="text-muted-foreground">China has many mega-cities, each with its own unique vibe.</p>
          </div>

          <Tabs defaultValue="beijing" className="max-w-5xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto bg-white p-2 rounded-xl shadow-sm mb-8">
              <TabsTrigger value="beijing" className="py-3 text-md font-medium">Beijing</TabsTrigger>
              <TabsTrigger value="shanghai" className="py-3 text-md font-medium">Shanghai</TabsTrigger>
              <TabsTrigger value="hangzhou" className="py-3 text-md font-medium">Hangzhou</TabsTrigger>
              <TabsTrigger value="chengdu" className="py-3 text-md font-medium">Chengdu</TabsTrigger>
            </TabsList>

            {/* City Content Component */}
            {[
              { 
                id: "beijing", name: "Beijing", title: "The Political & Cultural Heart", 
                desc: "Home to top universities like Tsinghua and Peking University. Experience history at the Great Wall and modern tech hubs in Haidian district.",
                img: "https://images.unsplash.com/photo-1599587426629-9e6b4e6d4272?w=800&q=80"
              },
              { 
                id: "shanghai", name: "Shanghai", title: "The Global Financial Hub", 
                desc: "China's biggest city. A futuristic metropolis with a vibrant expat community, stunning skyline (The Bund), and fast-paced lifestyle.",
                img: "https://images.unsplash.com/photo-1548232979-6c557ee14752?w=800&q=80"
              },
              { 
                id: "hangzhou", name: "Hangzhou", title: "Tech City & Scenic Beauty", 
                desc: "Headquarters of Alibaba. Known as 'Paradise on Earth' for its West Lake. A perfect mix of nature and high-tech innovation.",
                img: "https://images.unsplash.com/photo-1525010996-51f893d144e5?w=800&q=80"
              },
              { 
                id: "chengdu", name: "Chengdu", title: "Home of Giant Pandas", 
                desc: "Famous for its relaxed lifestyle, spicy hot pot, and Panda Research Base. A very student-friendly and affordable city.",
                img: "https://images.unsplash.com/photo-1564858905399-53b0509a2592?w=800&q=80"
              }
            ].map((city) => (
              <TabsContent key={city.id} value={city.id} className="animate-in fade-in zoom-in-95 duration-300">
                <div className="grid md:grid-cols-2 gap-8 items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden">
                    <Image src={city.img} alt={city.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-widest mb-2">
                       <MapPin className="h-4 w-4" /> {city.name}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{city.title}</h3>
                    <p className="text-slate-600 mb-6 leading-relaxed">{city.desc}</p>
                    <Button variant="outline">View Universities in {city.name}</Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* --- Section 4: Life in China (Grid) --- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
              <div className="max-w-2xl">
                 <h2 className="text-3xl font-bold mb-4">Life as an International Student</h2>
                 <p className="text-slate-600">China offers a convenient and exciting lifestyle. Here is what you can expect.</p>
              </div>
           </div>

           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lifestyle.map((item, i) => (
                 <Card key={i} className="hover:border-red-500 hover:shadow-lg transition-all cursor-default">
                    <CardContent className="p-6">
                       <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-red-600">
                          <item.icon className="h-6 w-6" />
                       </div>
                       <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                       <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </CardContent>
                 </Card>
              ))}
           </div>
        </div>
      </section>

      {/* --- Section 5: CTA --- */}
      <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
         
         <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Explore Education in China</h2>
            <p className="text-slate-300 max-w-2xl mx-auto mb-10 text-lg">
               Ready to experience this amazing country yourself? Check out the benefits of studying in China.
            </p>
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-10 rounded-full text-lg" asChild>
               <Link href="/more/why-china">
                  Why Study in China? <ArrowRight className="ml-2 h-5 w-5" />
               </Link>
            </Button>
         </div>
      </section>

    </div>
  );
}