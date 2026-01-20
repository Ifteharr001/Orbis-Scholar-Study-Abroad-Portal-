"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Ticket as TicketIcon, MessageSquare, History, LifeBuoy } from "lucide-react";
import { toast } from "sonner";

interface Ticket {
  _id: string;
  subject: string;
  type: string;
  message: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
  reply?: string;
}

export default function CounselorHelpPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    subject: "",
    type: "General Issue",
    message: "",
  });

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/counselor/ticket");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/counselor/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Support ticket created successfully!");
        setFormData({ subject: "", type: "General Issue", message: "" }); 
        fetchTickets();
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
      
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-full">
            <LifeBuoy className="h-8 w-8 text-blue-600" />
        </div>
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Counselor Support</h1>
            <p className="text-muted-foreground">
            Contact admin for technical issues, payout queries, or student management help.
            </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <Card className="h-fit border-t-4 border-t-blue-600 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              Open New Ticket
            </CardTitle>
            <CardDescription>We usually respond within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Issue Category</label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({...formData, type: val})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General Issue">General Inquiry</SelectItem>
                    <SelectItem value="Student Issue">Student Management Issue</SelectItem>
                    <SelectItem value="Payout / Finance">Payout / Finance</SelectItem>
                    <SelectItem value="Technical Bug">Platform / Technical Bug</SelectItem>
                    <SelectItem value="Account Support">Account Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  placeholder="Briefly describe the issue..." 
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea 
                  placeholder="Provide detailed information so we can help you faster..." 
                  className="h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <TicketIcon className="h-5 w-5 text-gray-600" /> Your Requests
            </h2>
            <Badge variant="secondary">{tickets.length} Tickets</Badge>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16 border rounded-lg bg-muted/20 border-dashed">
              <History className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No support history found.</p>
            </div>
          ) : (
            <div className="space-y-4 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {tickets.map((ticket) => (
                <Card key={ticket._id} className="border hover:border-blue-300 transition-all shadow-sm group">
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
                      <Badge variant="outline" className="text-xs text-blue-600 border-blue-200 bg-blue-50">
                        {ticket.type}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-blue-700 transition-colors">{ticket.subject}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {ticket.message}
                      </p>
                    </div>

                    {ticket.reply && (
                      <div className="bg-slate-50 p-3 rounded-md text-sm mt-2 border border-slate-200">
                        <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-3 w-3 text-blue-600" />
                            <span className="font-bold text-slate-700">Admin Response:</span>
                        </div>
                        <p className="text-slate-600">{ticket.reply}</p>
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