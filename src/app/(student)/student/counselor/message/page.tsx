"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  User, Loader2, Send, MessageSquare, MoreVertical, Phone, Video,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Counselor = {
  _id: string;
  name: string;
  image?: string;
  isOnline?: boolean;
};

type Message = {
  _id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
};

export default function StudentMessagePage() {
  const { user } = useAuth(); 
  const [counselor, setCounselor] = useState<Counselor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchData = async () => {
    try {
    
      const resCounselor = await fetch("/api/student/counselor", { credentials: "include" });
      const dataCounselor = await resCounselor.json();

      if (dataCounselor.counselor) {
        setCounselor({
            _id: dataCounselor.counselor.id,
            name: dataCounselor.counselor.name,
            image: dataCounselor.counselor.image,
            isOnline: true
        });
      }

      const resMsg = await fetch("/api/student/message", { credentials: "include" });
      const dataMsg = await resMsg.json();
      if (dataMsg.success) {
        setMessages(dataMsg.messages);
      }

    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    const interval = setInterval(async () => {
        const resMsg = await fetch("/api/student/message", { credentials: "include" });
        const dataMsg = await resMsg.json();
        if (dataMsg.success) {
            setMessages(dataMsg.messages);
        }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const tempText = inputText;
    setInputText(""); 
    setSending(true);

    try {
        const res = await fetch("/api/student/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ text: tempText })
        });
        const data = await res.json();

        if (data.success) {
            setMessages(prev => [...prev, data.message]); 
        } else {
            toast.error("Failed to send message");
            setInputText(tempText); 
        }
    } catch (error) {
        toast.error("Network error");
    } finally {
        setSending(false);
    }
  };

  if (loading) {
      return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 border rounded-lg overflow-hidden m-4">
      
      <aside className="w-1/4 min-w-[250px] bg-white border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-4 border-b bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-800">Messages</h2>
            <p className="text-xs text-muted-foreground">Direct line to your counselor</p>
        </div>
        
        <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
                {counselor ? (
                    <button
                        className="w-full text-left p-3 rounded-lg flex items-center gap-3 bg-blue-50 border border-blue-200 shadow-sm transition-colors"
                    >
                        <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {counselor.image ? (
                                <Image src={counselor.image} alt={counselor.name} fill className="object-cover" sizes="40px" />
                            ) : (
                                <User size={20} className="text-gray-500" />
                            )}
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                        </div>
                        <div className="overflow-hidden flex-1">
                            <div className="flex justify-between items-center">
                                <p className="font-semibold text-sm truncate">{counselor.name}</p>
                            </div>
                            <p className="text-xs text-gray-500 truncate">Online</p>
                        </div>
                    </button>
                ) : (
                    <div className="text-center py-10 text-gray-400 text-sm">No counselor assigned.</div>
                )}
            </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col bg-white">
        {counselor ? (
          <>
            <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={counselor.image} />
                        <AvatarFallback>{counselor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-gray-800">{counselor.name}</h3>
                        <p className="text-xs text-green-600 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span> Active Now
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="icon" disabled><Phone className="h-4 w-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="icon" disabled><Video className="h-4 w-4 text-gray-500" /></Button>
                    <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4 text-gray-500" /></Button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <MessageSquare className="h-12 w-12 mb-2 opacity-20" />
                        <p>No messages yet. Say Hello!</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isMe = msg.sender === user?.id; 
                        
                        return (
                            <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                    isMe 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white text-gray-800 border rounded-bl-none'
                                }`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                        placeholder="Type a message..." 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-blue-500"
                    />
                    <Button type="submit" disabled={sending || !inputText.trim()} className="bg-blue-600 hover:bg-blue-700">
                        {sending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400 flex-col gap-3">
             <AlertCircle className="h-10 w-10 text-red-400" />
             <p>Please wait for a counselor to be assigned.</p>
          </div>
        )}
      </main>
    </div>
  );
}