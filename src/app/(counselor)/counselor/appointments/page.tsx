"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Check, X, Calendar, Clock, Video, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function CounselorAppointmentsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      const res = await fetch("/api/counselor/appointments");
      const data = await res.json();
      if (data.success) {
        setAppointments(data.appointments);
      }
    } catch (error) {
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id);
    try {
      const res = await fetch("/api/counselor/appointments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (res.ok) {
        toast.success(`Appointment ${status}`);
       
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAppointments(prev => prev.map((app: any) => 
            app._id === id ? { ...app, status: status } : app
        ));
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Error processing request");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-100 text-green-700">Confirmed</Badge>;
      case "rejected": return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
      case "completed": return <Badge className="bg-gray-100 text-gray-700">Completed</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-700">Pending Request</Badge>;
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // Filter lists
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pendingList = appointments.filter((a: any) => a.status === "pending");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const upcomingList = appointments.filter((a: any) => a.status === "approved");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pastList = appointments.filter((a: any) => ["rejected", "completed"].includes(a.status));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AppointmentCard = ({ app, isPending = false }: { app: any, isPending?: boolean }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/10 transition-colors gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={app.studentId?.image} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div>
          <h4 className="font-semibold">{app.studentId?.name || "Student"}</h4>
          <p className="text-sm text-muted-foreground">{app.topic}</p>
          <div className="flex flex-wrap gap-2 mt-1 text-xs text-muted-foreground">
             <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(app.date).toLocaleDateString()}</span>
             <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {app.time}</span>
             <span className="flex items-center gap-1">
                {app.type === "Online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />} {app.type}
             </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {!isPending && getStatusBadge(app.status)}
        
        {isPending && (
            <>
                <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={() => handleStatusUpdate(app._id, "rejected")}
                    disabled={!!processingId}
                >
                    {processingId === app._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                    Reject
                </Button>
                <Button 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleStatusUpdate(app._id, "approved")}
                    disabled={!!processingId}
                >
                    {processingId === app._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    Accept
                </Button>
            </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
        <p className="text-muted-foreground">Manage your student meeting requests.</p>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="pending">Requests ({pendingList.length})</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming ({upcomingList.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-4">
            {pendingList.length === 0 ? <p className="text-center text-muted-foreground py-10">No pending requests.</p> : 
             pendingList.map((app) => <AppointmentCard key={app._id} app={app} isPending={true} />)
            }
        </TabsContent>

        <TabsContent value="upcoming" className="mt-4 space-y-4">
            {upcomingList.length === 0 ? <p className="text-center text-muted-foreground py-10">No upcoming appointments.</p> : 
             upcomingList.map((app) => <AppointmentCard key={app._id} app={app} />)
            }
        </TabsContent>

        <TabsContent value="history" className="mt-4 space-y-4">
            {pastList.length === 0 ? <p className="text-center text-muted-foreground py-10">No history found.</p> : 
             pastList.map((app) => <AppointmentCard key={app._id} app={app} />)
            }
        </TabsContent>
      </Tabs>
    </div>
  );
}