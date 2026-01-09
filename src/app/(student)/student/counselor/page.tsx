"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Phone, Mail, Video, MessageCircle, Calendar, Star, MapPin, Clock, Users, Send, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface Counselor {
  name: string;
  title: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  languages: string[];
  specializations: string[];
  rating: number;
  totalStudents: number;
  successRate: number;
  experience: string;
  availability: string;
  bio: string;
  image?: string;
}

export default function MyCounselorPage() {
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState("");
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchCounselor = async () => {
      if (isAuthenticated) {
        try {
          const res = await fetch("/api/student/counselor");
          if (!res.ok) {
              throw new Error("Failed to fetch");
          }
          const data = await res.json();
          setCounselor(data.counselor);
        } catch (error) {
          console.error("Failed to fetch counselor info", error);
          setFetchError(true);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCounselor();
  }, [isAuthenticated]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }
    // Future API integration for sending messages
    toast.success("Message sent to your counselor!");
    setMessage("");
  };

  const recentActivities = [
    { action: "Reviewed your SOP draft", time: "2 hours ago" },
    { action: "Sent university shortlist", time: "Yesterday" },
    { action: "Updated visa checklist", time: "3 days ago" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (fetchError) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <h2 className="text-xl font-semibold">Error Loading Counselor Info</h2>
          <p className="text-muted-foreground">Unable to load your counselors information at this time.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      );
  }

  // If no counselor is assigned
  if (!counselor) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="bg-muted p-4 rounded-full">
            <Users className="h-10 w-10 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">No Counselor Assigned Yet</h2>
        <p className="text-muted-foreground max-w-md">
          We are currently matching you with the best counselor for your profile. Please check back later or contact support.
        </p>
        <Button onClick={() => window.location.href = '/contact'}>Contact Support</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">My Counselor</h1>
        <p className="text-muted-foreground">Your dedicated education advisor</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Counselor Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar & Basic Info */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <Avatar className="w-28 h-28 mb-4">
                    <AvatarImage src={counselor.image} alt={counselor.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                      {counselor.name ? counselor.name.split(' ').map(n => n[0]).join('').substring(0, 2) : "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-foreground">{counselor.rating}</span>
                    <span className="text-sm text-muted-foreground">rating</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Available</Badge>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{counselor.name}</h2>
                    <p className="text-primary font-medium">{counselor.title}</p>
                  </div>

                  <p className="text-muted-foreground">{counselor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {counselor.specializations.map((spec) => (
                      <Badge key={spec} variant="secondary" className="bg-secondary text-secondary-foreground">{spec}</Badge>
                    ))}
                  </div>

                  <Separator className="bg-border" />

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg border border-border">
                      <p className="text-2xl font-bold text-primary">{counselor.totalStudents}+</p>
                      <p className="text-xs text-muted-foreground">Students Helped</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg border border-border">
                      <p className="text-2xl font-bold text-primary">{counselor.successRate}%</p>
                      <p className="text-xs text-muted-foreground">Success Rate</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg border border-border">
                      <p className="text-2xl font-bold text-primary">{counselor.experience}</p>
                      <p className="text-xs text-muted-foreground">Experience</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Message */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-foreground" />
                Send a Quick Message
              </CardTitle>
              <CardDescription>Get in touch with your counselor directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[120px] bg-background border-border"
              />
              <Button onClick={handleSendMessage} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Send className="w-4 h-4" />
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>What your counselor has been doing for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-foreground">{activity.action}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                <Mail className="w-5 h-5 text-primary" />
                <div className="overflow-hidden">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground truncate" title={counselor.email}>{counselor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                <Phone className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{counselor.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{counselor.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Availability</p>
                  <p className="text-sm font-medium text-foreground">{counselor.availability}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full gap-2 justify-start border-border text-foreground hover:bg-muted" variant="outline">
                <Video className="w-4 h-4" />
                Start Video Call
              </Button>
              <Button 
                className="w-full gap-2 justify-start border-border text-foreground hover:bg-muted" 
                variant="outline"
                onClick={() => window.open(`tel:${counselor.phone}`)}
              >
                <Phone className="w-4 h-4" />
                Call Now
              </Button>
              {counselor.whatsapp && (
                  <Button 
                    className="w-full gap-2 justify-start bg-green-600 hover:bg-green-700 text-white border-none"
                    onClick={() => window.open(`https://wa.me/${counselor.whatsapp?.replace(/[^0-9]/g, '')}`, '_blank')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
              )}
              {/* Updated: Links to the appointments page */}
              <Button asChild className="w-full gap-2 justify-start border-border text-foreground hover:bg-muted" variant="outline">
                <Link href="/student/appointments">
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                </Link>
              </Button>
              <Button 
                className="w-full gap-2 justify-start border-border text-foreground hover:bg-muted" 
                variant="outline"
                onClick={() => window.open(`mailto:${counselor.email}`)}
              >
                <Mail className="w-4 h-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-foreground" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {counselor.languages.map((lang) => (
                  <Badge key={lang} variant="outline" className="border-border text-foreground">{lang}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}