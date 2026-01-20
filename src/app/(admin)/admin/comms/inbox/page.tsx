"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Search, Loader2, Send, User, MessageSquare, ShieldCheck 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

type Student = {
  _id: string;
  name: string;
  email: string;
  image?: string;
};

type Message = {
  _id: string;
  sender: {
    _id: string;
    name: string;
    role: string;
    image?: string;
  };
  text: string;
  senderRole: "student" | "counselor" | "admin";
  createdAt: string;
};

export default function AdminStudentChatPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/admin/users?role=student"); 
        const data = await res.json();
        if (data.success) {
            setStudents(data.users);
            setFilteredStudents(data.users);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingList(false);
      }
    }
    fetchStudents();
  }, []);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    const filtered = students.filter(s => 
      s.name.toLowerCase().includes(lowerSearch) || 
      s.email.toLowerCase().includes(lowerSearch)
    );
    setFilteredStudents(filtered);
  }, [searchQuery, students]);

  const fetchMessages = async (studentId: string) => {
    setLoadingChat(true);
    try {
      const res = await fetch(`/api/admin/conversation?studentId=${studentId}`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error("Failed to load chat");
    } finally {
      setLoadingChat(false);
    }
  };

  const handleStudentSelect = (studentId: string) => {
    if (studentId === selectedStudentId) return;
    setSelectedStudentId(studentId);
    fetchMessages(studentId);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || !selectedStudentId) return;

    const tempText = inputText;
    setInputText("");
    setSending(true);

    try {
        const res = await fetch("/api/admin/conversation", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentId: selectedStudentId, text: tempText })
        });
        const data = await res.json();

        if (data.success) {
            setMessages(prev => [...prev, data.message]);
        } else {
            toast.error("Failed to send");
            setInputText(tempText);
        }
    } catch (error) {
        toast.error("Network error");
    } finally {
        setSending(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedStudentInfo = students.find(s => s._id === selectedStudentId);

  return (
    <div className="flex h-[calc(100vh-60px)] bg-background border rounded-lg overflow-hidden m-4 shadow-sm">
      
      <aside className="w-1/3 min-w-[300px] border-r bg-card flex flex-col">
        <div className="p-4 border-b space-y-3">
            <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> Student List
            </h2>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search student by name..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>
        
        <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
                {loadingList ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary" /></div>
                ) : filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                        <button
                            key={student._id} 
                            onClick={() => handleStudentSelect(student._id)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors border ${
                            selectedStudentId === student._id
                                ? "bg-primary/10 border-primary/20"
                                : "hover:bg-muted border-transparent"
                            }`}
                        >
                            <Avatar>
                                <AvatarImage src={student.image} />
                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="overflow-hidden text-sm">
                                <p className="font-semibold truncate">{student.name}</p>
                                <p className="text-xs text-muted-foreground truncate">{student.email}</p>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">No students found.</div>
                )}
            </div>
        </ScrollArea>
      </aside>

      <main className="flex-1 flex flex-col bg-muted/20">
        {selectedStudentId && selectedStudentInfo ? (
          <>
            <div className="p-4 border-b bg-card flex items-center gap-3 shadow-sm">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedStudentInfo.image} />
                    <AvatarFallback>{selectedStudentInfo.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-bold text-foreground">{selectedStudentInfo.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedStudentInfo.email}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {loadingChat ? (
                    <div className="flex justify-center h-full items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
                        <MessageSquare className="h-12 w-12 mb-2" />
                        <p>No conversation yet. Send a message to start.</p>
                    </div>
                ) : (
                    messages.map((msg, idx) => {
                        const isAdminMsg = msg.senderRole === "admin";
                        
                        return (
                            <div key={idx} className={`flex w-full ${isAdminMsg ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col max-w-[70%] ${isAdminMsg ? 'items-end' : 'items-start'}`}>
                                    
                                    <span className="text-[10px] text-muted-foreground mb-1 ml-1 flex items-center gap-1">
                                        {isAdminMsg ? (
                                            <><ShieldCheck className="h-3 w-3 text-blue-600" /> <span className="font-bold text-blue-600">Admin</span></>
                                        ) : (
                                            <><User className="h-3 w-3" /> {msg.sender.name}</>
                                        )}
                                        <span className="opacity-50">• {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </span>

                                    <div className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                        isAdminMsg 
                                        ? 'bg-blue-600 text-white rounded-tr-none' 
                                        : 'bg-white border border-border text-foreground rounded-tl-none'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-card border-t">
                <form onSubmit={handleSendMessage} className="flex gap-2 relative">
                    <Input 
                        placeholder={`Message ${selectedStudentInfo.name} as Admin...`} 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="flex-1 pr-10"
                    />
                    <Button type="submit" disabled={sending || !inputText.trim()} className="bg-blue-600 hover:bg-blue-700">
                        {sending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                    </Button>
                </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-3">
             <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                <User className="h-10 w-10 opacity-20" />
             </div>
             <p>Select a student from the sidebar to view conversations.</p>
          </div>
        )}
      </main>
    </div>
  );
}