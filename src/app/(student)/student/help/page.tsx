"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Ticket as TicketIcon, MessageSquare, History } from "lucide-react";
import { toast } from "sonner";

// ইন্টারফেস
interface Ticket {
  _id: string;
  subject: string;
  type: string;
  message: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
  reply?: string;
}

export default function HelpSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ফর্ম ডাটা
  const [formData, setFormData] = useState({
    subject: "",
    type: "General Issue",
    message: "",
  });

  // ১. ডাটা ফেচ করা
  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/student/ticket");
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // ২. টিকেট সাবমিট করা
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/student/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Support ticket created successfully!");
        setFormData({ subject: "", type: "General Issue", message: "" }); // ফর্ম রিসেট
        fetchTickets(); // লিস্ট আপডেট
      } else {
        toast.error("Failed to submit ticket");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-5xl">
      
      {/* হেডার */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support 🛠️</h1>
        <p className="text-muted-foreground mt-2">
          Facing an issue or need a counselor? Create a ticket and we will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* বাম পাশ: টিকেট তৈরি করার ফর্ম */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Create New Ticket
            </CardTitle>
            <CardDescription>Describe your issue or request clearly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Type</label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({...formData, type: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Issue">General Issue</SelectItem>
                    <SelectItem value="Counselor Request">Counselor Request 🎓</SelectItem>
                    <SelectItem value="Technical Problem">Technical Problem</SelectItem>
                    <SelectItem value="Payment Issue">Payment Issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  placeholder="e.g., I need help with my application..." 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Explain your problem in detail..." 
                  className="h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Ticket"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ডান পাশ: টিকেটের হিস্ট্রি */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5" /> Your Ticket History
            </h2>
            <Badge variant="outline">{tickets.length} Tickets</Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-10 border rounded-lg bg-muted/20">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No tickets found.</p>
            </div>
          ) : (
            <div className="space-y-4 h-[600px] overflow-y-auto pr-2">
              {tickets.map((ticket) => (
                <Card key={ticket._id} className="border-l-4 border-l-primary shadow-sm hover:shadow-md transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge 
                          variant={ticket.status === "Open" ? "default" : "secondary"}
                          className={
                            ticket.status === "Open" ? "bg-green-600 hover:bg-green-700" : 
                            ticket.status === "In Progress" ? "bg-blue-600" : "bg-gray-500"
                          }
                        >
                          {ticket.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-3">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant="outline">{ticket.type}</Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ticket.message}
                      </p>
                    </div>

                    {ticket.reply && (
                      <div className="bg-muted/50 p-3 rounded-md text-sm mt-2 border border-primary/20">
                        <span className="font-bold text-primary block mb-1">Admin Reply:</span>
                        {ticket.reply}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}