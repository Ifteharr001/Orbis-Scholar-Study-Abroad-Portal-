"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, User, Send } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Ticket {
  _id: string;
  userEmail: string;
  userName?: string;
  role: "student" | "counselor";
  subject: string;
  type: string;
  message: string;
  status: "Open" | "In Progress" | "Closed";
  createdAt: string;
  reply?: string;
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [newStatus, setNewStatus] = useState<string>("Closed");
  const [submitting, setSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await fetch("/api/admin/tickets");
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
      }
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleReplySubmit = async () => {
    if (!selectedTicket || !replyText) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedTicket._id,
          reply: replyText,
          status: newStatus
        }),
      });

      if (res.ok) {
        toast.success("Reply sent successfully");
        fetchTickets(); 
        setSelectedTicket(null);
        setReplyText("");
      } else {
        toast.error("Failed to send reply");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting reply");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
      case "Closed": return "bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200";
      default: return "bg-gray-100";
    }
  };

  const studentTickets = tickets.filter(t => t.role === "student" || !t.role);
  const counselorTickets = tickets.filter(t => t.role === "counselor");

  const TicketCard = ({ ticket }: { ticket: Ticket }) => (
    <Card className="hover:shadow-md transition-all border-l-4 border-l-primary/50 mb-4">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-2 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={getStatusColor(ticket.status)}>
                {ticket.status}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {ticket.type}
              </Badge>
              <span className="text-xs text-muted-foreground ml-auto md:ml-2">
                {formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}
              </span>
            </div>
            
            <h3 className="font-semibold text-lg text-foreground">{ticket.subject}</h3>
            <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded-md border">
              {ticket.message}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
              <User className="h-3 w-3" />
              <span className="font-medium">{ticket.userName || "Unknown User"}</span>
              <span>•</span>
              <span>{ticket.userEmail}</span>
            </div>

            {ticket.reply && (
              <div className="mt-3 bg-blue-50/50 p-3 rounded-md border border-blue-100">
                <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                    <Send className="h-3 w-3" /> Admin Reply:
                </p>
                <p className="text-sm text-slate-700">{ticket.reply}</p>
              </div>
            )}
          </div>

          <div className="shrink-0">
             <Button 
               size="sm" 
               variant={ticket.reply ? "outline" : "default"}
               onClick={() => {
                 setSelectedTicket(ticket);
                 setReplyText(ticket.reply || ""); 
                 setNewStatus(ticket.status);
               }}
             >
                {ticket.reply ? "Edit Reply" : "Reply"}
             </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Help & Support Center</h1>
           <p className="text-muted-foreground">Manage and resolve support tickets.</p>
        </div>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="students">Student Requests ({studentTickets.length})</TabsTrigger>
          <TabsTrigger value="counselors">Counselor Requests ({counselorTickets.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6 space-y-4">
           {studentTickets.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                No support tickets from students found.
             </div>
           ) : (
             studentTickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)
           )}
        </TabsContent>

        <TabsContent value="counselors" className="mt-6 space-y-4">
           {counselorTickets.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                No support tickets from counselors found.
             </div>
           ) : (
             counselorTickets.map(ticket => <TicketCard key={ticket._id} ticket={ticket} />)
           )}
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
               Replying to <strong>{selectedTicket?.subject}</strong>
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
               <label className="text-sm font-medium">Your Message</label>
               <Textarea 
                 placeholder="Type your response here..." 
                 rows={5}
                 value={replyText}
                 onChange={(e) => setReplyText(e.target.value)}
                 className="resize-none"
               />
            </div>

            <div className="space-y-2">
               <label className="text-sm font-medium">Update Status</label>
               <Select value={newStatus} onValueChange={setNewStatus}>
                 <SelectTrigger>
                   <SelectValue />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="Open">Keep Open</SelectItem>
                   <SelectItem value="In Progress">In Progress</SelectItem>
                   <SelectItem value="Closed">Close Ticket</SelectItem>
                 </SelectContent>
               </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTicket(null)}>Cancel</Button>
            <Button onClick={handleReplySubmit} disabled={submitting}>
              {submitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}