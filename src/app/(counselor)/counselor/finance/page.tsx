"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  User, 
  Loader2, 
  Search,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- Types Definition ---
type Student = {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  image?: string;
};

type Payment = {
  _id: string;
  amount: number;
  date: string;
  method: string; 
  status: "Paid" | "Pending" | "Failed" | "Overdue";
  invoiceId?: string;
  reference?: string;
};

export default function CounselorFinancePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/counselor/students"); 
        const data = await res.json();
        
        if (data.success && Array.isArray(data.students)) {
            setStudents(data.students);
        } else {
            setStudents([]); 
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoadingStudents(false);
      }
    }
    fetchStudents();
  }, []);

  const handleStudentSelect = async (studentId: string) => {
    if(!studentId) return;
    setSelectedStudentId(studentId);
    setLoadingPayments(true);
    setPayments([]); 

    try {
      const res = await fetch(`/api/counselor/finance?studentId=${studentId}`);
      const data = await res.json();
      
      if (data.success && Array.isArray(data.data)) {
        setPayments(data.data);
      } else {
        setPayments([]);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  const selectedStudentInfo = students.find((s) => (s.id || s._id) === selectedStudentId);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>;
      case "Pending": return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case "Failed": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const totalPaid = payments
    .filter(p => p.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar: Student List */}
      <aside className="w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">My Students</h2>
        {loadingStudents ? (
          <div className="flex justify-center mt-10 text-gray-400">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {students.length > 0 ? (
                students.map((student) => {
                    const sId = student.id || student._id;
                    return (
                        <button
                            key={sId} 
                            onClick={() => handleStudentSelect(sId!)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                            selectedStudentId === sId
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "hover:bg-gray-100 text-gray-600"
                            }`}
                        >
                            <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                {student.image ? (
                                    <Image 
                                        src={student.image} 
                                        alt={student.name} 
                                        fill 
                                        className="object-cover"
                                        sizes="40px"
                                    />
                                ) : (
                                    <User size={20} className="text-gray-500" />
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="font-semibold text-sm truncate">{student.name}</p>
                                <p className="text-xs text-gray-400 truncate">{student.email}</p>
                            </div>
                        </button>
                    )
                })
            ) : (
                <div className="text-center py-10">
                    <p className="text-sm text-gray-500">No students assigned.</p>
                </div>
            )}
          </div>
        )}
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {selectedStudentId ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {selectedStudentInfo?.name ? `${selectedStudentInfo.name}'s Finance` : 'Finance Records'}
                    </h1>
                    <p className="text-muted-foreground text-sm">View payment history and status.</p>
                </div>
                
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                    <p className="text-xs text-green-600 uppercase font-bold">Total Paid</p>
                    <p className="text-xl font-bold text-green-700">${totalPaid.toLocaleString()}</p>
                </div>
            </div>

            {loadingPayments ? (
               <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
               </div>
            ) : payments.length > 0 ? (
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method</th>
                      <th className="p-4">Reference / Invoice</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {payments.map((pay) => (
                      <tr key={pay._id} className="hover:bg-gray-50">
                        <td className="p-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-gray-400"/>
                                {new Date(pay.date).toLocaleDateString("en-GB")}
                            </div>
                        </td>

                        <td className="p-4 font-semibold text-gray-800">
                            ${pay.amount.toLocaleString()}
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CreditCard size={14} className="text-gray-400"/>
                                {pay.method}
                            </div>
                        </td>

                        <td className="p-4 text-xs text-gray-500 font-mono">
                            {pay.invoiceId || pay.reference || "N/A"}
                        </td>

                        <td className="p-4 text-center">
                            {getStatusBadge(pay.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <DollarSign className="mx-auto h-10 w-10 text-gray-300 mb-2" />
                <p className="text-gray-500">No payment records found for this student.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
             <div className="text-center">
                <CreditCard size={48} className="mx-auto mb-3 opacity-20" />
                <p>Select a student from the sidebar to view their finance records.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}