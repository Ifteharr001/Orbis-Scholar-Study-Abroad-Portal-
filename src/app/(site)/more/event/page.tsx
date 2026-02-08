"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  ArrowRight, 
  Bell, 
  Ticket,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function EventsPage() {
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Subscribed! You will receive event updates.");
  };

  const featuredEvents = [
    {
      id: 1,
      title: "China Education Expo 2026",
      date: "25 March, 2026",
      location: "BICC, Dhaka",
      image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800&q=80",
      category: "Mega Expo",
      link: "/expo/china",
      description: "Meet top Chinese universities and get on-spot scholarship assessment."
    },
    {
      id: 2,
      title: "Grand Overseas Education Expo",
      date: "10 April, 2026",
      location: "Westin, Dhaka",
      image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&q=80",
      category: "Multi-Country",
      link: "/expo/overseas",
      description: "Your gateway to UK, USA, Canada & Australia. Apply for free!"
    }
  ];

  const seminars = [
    {
      id: 3,
      title: "IELTS Masterclass Workshop",
      date: "15 Feb, 2026",
      time: "3:00 PM - 5:00 PM",
      location: "Orbis Office, Banani",
      type: "Offline",
      image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=500&q=80"
    },
    {
      id: 4,
      title: "USA Visa Interview Prep",
      date: "20 Feb, 2026",
      time: "8:00 PM - 9:30 PM",
      location: "Zoom (Online)",
      type: "Webinar",
      image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500&q=80"
    },
    {
      id: 5,
      title: "Canada SOP Writing Session",
      date: "28 Feb, 2026",
      time: "4:00 PM - 6:00 PM",
      location: "Orbis Office, Banani",
      type: "Offline",
      image: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=500&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      
   
      <section className="py-20 bg-muted/30 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
            Upcoming Events
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Join Our Global <br />
            <span className="text-primary">Education Events</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with universities, attend workshops, and get expert guidance. Dont miss out on opportunities to shape your future.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mb-20 pointer-events-none" />
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
            <Ticket className="text-primary h-6 w-6" />
            <h2 className="text-2xl font-bold">Featured Expos</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredEvents.map((event) => (
            <div key={event.id} className="group relative rounded-3xl overflow-hidden shadow-lg border border-border">
          
              <div className="absolute inset-0">
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              </div>

              <div className="relative h-[400px] p-8 flex flex-col justify-end text-white">
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-medium border border-white/20">
                  {event.category}
                </div>
                
                <h3 className="text-3xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-300 mb-6 line-clamp-2">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6 text-sm font-medium">
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg">
                    <MapPin className="h-4 w-4 text-primary" /> {event.location}
                  </div>
                </div>

                <Button size="lg" className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90" asChild>
                  <Link href={event.link}>
                    Register Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Seminars & Workshops</h2>
              <p className="text-muted-foreground">Expert sessions to boost your preparation.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {seminars.map((seminar) => (
              <Card key={seminar.id} className="hover:shadow-lg transition-all border-border overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image 
                    src={seminar.image} 
                    alt={seminar.title} 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant={seminar.type === "Webinar" ? "secondary" : "default"}>
                        {seminar.type === "Webinar" ? <Video className="h-3 w-3 mr-1"/> : <MapPin className="h-3 w-3 mr-1"/>}
                        {seminar.type}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="text-sm text-primary font-semibold mb-2">
                    {seminar.date}
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2">{seminar.title}</h3>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" /> {seminar.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" /> {seminar.location}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full">
                    Book Seat
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Glimpses of Past Events</h2>
          <p className="text-muted-foreground">We have hosted 50+ successful events in the last 2 years.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80" alt="Gallery 1" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                <p className="text-white font-bold text-lg">UK Education Fair 2025</p>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80" alt="Gallery 2" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="relative rounded-2xl overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&q=80" alt="Gallery 3" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
          </div>
          <div className="col-span-2 relative rounded-2xl overflow-hidden group">
            <Image src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" alt="Gallery 4" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-black/80 to-transparent w-full">
                <p className="text-white font-bold text-lg">Pre-departure Session</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <Bell className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Never Miss an Event</h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Subscribe to our newsletter and get notified about upcoming education expos, scholarship deadlines, and free workshops.
          </p>
          
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
            <Input 
              type="email" 
              placeholder="Enter your email address" 
              className="bg-white text-black border-none h-12 text-lg px-6 rounded-full shadow-lg" 
              required
            />
            <Button type="submit" size="lg" className="bg-black hover:bg-black/80 text-white font-bold h-12 px-8 rounded-full shadow-lg">
              Subscribe
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
}