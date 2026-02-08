"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Calendar, Clock, Video, MapPin, User, Plus, CheckCircle2, XCircle, CalendarDays, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, isPast, isFuture, isToday } from "date-fns";
import { toast } from "sonner";

interface Appointment {
  _id: string;
  topic: string;
  counselorId?: {
    _id: string;
    name: string;
    image?: string;
  };
  date: string;
  time: string;
  duration?: string;
  type: "video" | "in-person";
  status: "confirmed" | "pending" | "completed" | "cancelled";
  meetingLink?: string;
}

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200">Confirmed</Badge>;
    case "pending": return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200">Pending</Badge>;
    case "completed": return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">Completed</Badge>;
    case "cancelled": return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">Cancelled</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [notes, setNotes] = useState("");

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/student/appointments");
      
      if (!res.ok) throw new Error("Failed to fetch");
      
      const data = await res.json();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (error) {
      console.error("Failed to fetch appointments", error);
      toast.error("Could not load appointments");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime || !selectedType || !selectedTopic) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsBooking(true);

    try {
      const res = await fetch("/api/student/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          type: selectedType,
          date: selectedDate,
          time: selectedTime,
          notes
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Booking failed");

      toast.success("Appointment booked successfully!");
      
      setIsBookingOpen(false);
      setSelectedDate(undefined);
      setSelectedTime("");
      setSelectedType("");
      setSelectedTopic("");
      setNotes("");
      
      fetchAppointments();

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to book appointment";
      toast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  const upcomingAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return (isFuture(appDate) || isToday(appDate)) && app.status !== "completed" && app.status !== "cancelled";
  });

  const pastAppointments = appointments.filter(app => {
    const appDate = new Date(app.date);
    return (isPast(appDate) && !isToday(appDate)) || app.status === "completed" || app.status === "cancelled";
  });

  if (loading) {
    return <div className="flex justify-center h-[60vh] items-center"><Loader2 className="animate-spin h-8 w-8 text-primary"/></div>;
  }

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage your counseling sessions</p>
        </div>
        
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>Schedule a session with your assigned counselor</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              
              <div className="space-y-2">
                <Label>Topic *</Label>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="University Selection">University Selection</SelectItem>
                    <SelectItem value="Visa Guidance">Visa Guidance</SelectItem>
                    <SelectItem value="Scholarship Help">Scholarship Help</SelectItem>
                    <SelectItem value="Document Review">Document Review</SelectItem>
                    <SelectItem value="General Consultation">General Consultation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Appointment Type *</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="video">Video Call</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Select Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal border-border",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Select Time *</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Additional Notes</Label>
                <Textarea 
                  placeholder="Any specific topics or questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsBookingOpen(false)}>Cancel</Button>
              <Button onClick={handleBookAppointment} disabled={isBooking}>
                {isBooking ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Book Appointment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{upcomingAppointments.length}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pastAppointments.filter(a => a.status === "completed").length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{pastAppointments.filter(a => a.status === "cancelled").length}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-muted border border-border w-full md:w-auto">
          <TabsTrigger value="upcoming" className="flex-1 md:flex-none">Upcoming ({upcomingAppointments.length})</TabsTrigger>
          <TabsTrigger value="past" className="flex-1 md:flex-none">Past ({pastAppointments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} />
            ))
          ) : (
            <Card className="border-border border-dashed">
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Upcoming Appointments</h3>
                <p className="text-muted-foreground mb-4">You dont have any scheduled appointments.</p>
                <Button onClick={() => setIsBookingOpen(true)} variant="outline">Book Your First Appointment</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <AppointmentCard key={appointment._id} appointment={appointment} showActions={false} />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-10">No past appointments found.</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AppointmentCard({ appointment, showActions = true }: { appointment: Appointment; showActions?: boolean }) {
  
  const handleJoinMeeting = () => {
    if (appointment.meetingLink) {
      window.open(appointment.meetingLink, "_blank");
    } else {
      toast.error("Meeting link not available yet.");
    }
  };

  const handleCancel = () => {
      toast.info("Please contact support to cancel confirm appointments.");
  };

  return (
    <Card className="hover:shadow-md transition-shadow border-border">
      <CardContent className="p-5">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary shrink-0">
              <span className="text-lg font-bold">{format(new Date(appointment.date), "dd")}</span>
              <span className="text-xs uppercase">{format(new Date(appointment.date), "MMM")}</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground text-lg">{appointment.topic}</h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span>{appointment.counselorId?.name || "Assigned Counselor"}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-muted px-2 py-0.5 rounded text-xs">
                  {appointment.type === "video" ? <Video className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  <span className="capitalize">{appointment.type === "video" ? "Video Call" : "In-Person"}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 w-full md:w-auto mt-2 md:mt-0">
            {getStatusBadge(appointment.status)}
            
            {showActions && appointment.status !== "cancelled" && (
              <div className="flex gap-2 mt-1">
                {appointment.type === "video" && appointment.status === "confirmed" && (
                  <Button size="sm" className="gap-1 bg-primary text-primary-foreground h-8" onClick={handleJoinMeeting}>
                    <Video className="w-3.5 h-3.5" />
                    Join
                  </Button>
                )}
                {appointment.status === "pending" && (
                    <Button size="sm" variant="ghost" className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={handleCancel}>
                        Cancel
                    </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}