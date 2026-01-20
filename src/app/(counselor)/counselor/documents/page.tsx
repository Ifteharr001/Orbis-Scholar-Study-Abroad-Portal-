"use client";

import { useState, useEffect } from "react";
import { 
  Eye, 
  FileText, 
  User, 
  Loader2, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from "lucide-react";
import Image from "next/image";

// --- Types Definition ---
type Student = {
  id?: number | string;
  _id?: number | string;
  name: string;
  email?: string;
  image?: string;
};

type Document = {
  _id: string;
  name: string;      
  fileName: string;   
  fileUrl: string;    
  status: "Pending" | "Verified" | "Rejected"; 
  uploadedAt: string; 
  type?: string;
};

export default function CounselorDocumentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  
  const [selectedStudentId, setSelectedStudentId] = useState<number | string | null>(null);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);

  // ১. স্টুডেন্ট লোড করা (FIXED)
  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch("/api/counselor/students"); 
        if (!res.ok) throw new Error("Failed to fetch students");
        
        const data = await res.json();
        console.log("Students Data:", data); // ডিবাগিং এর জন্য

        // ✅ FIX: API রেসপন্স স্ট্রাকচার অনুযায়ী চেক করা
        if (data.success && Array.isArray(data.students)) {
            setStudents(data.students);
        } else if (Array.isArray(data)) {
            setStudents(data);
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

  // ২. ডকুমেন্ট লোড করা
  const handleStudentSelect = async (studentId: number | string) => {
    if(!studentId) return;
    setSelectedStudentId(studentId);
    setLoadingDocs(true);
    setDocuments([]); 

    try {
      const res = await fetch(`/api/counselor/documents?studentId=${studentId}`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      
      const data = await res.json();
      // ডকুমেন্ট API সরাসরি অ্যারে রিটার্ন করে, তাই এটি ঠিক আছে
      setDocuments(Array.isArray(data) ? data : []); 
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoadingDocs(false);
    }
  };

  const selectedStudentInfo = students.find((s) => (s.id || s._id) === selectedStudentId);

  // --- Helper: Status Badge Design ---
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Verified":
        return (
          <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            <CheckCircle size={12} /> Verified
          </span>
        );
      case "Rejected":
        return (
          <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
            <AlertCircle size={12} /> Rejected
          </span>
        );
      default: // Pending
        return (
          <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">
            <Clock size={12} /> Pending
          </span>
        );
    }
  };

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
                    <p className="text-xs text-gray-400 mt-1">Please ask admin to assign students.</p>
                </div>
            )}
          </div>
        )}
      </aside>

      {/* Main Content: Document Table */}
      <main className="flex-1 p-8 overflow-y-auto">
        {selectedStudentId ? (
          <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    {selectedStudentInfo?.name ? `${selectedStudentInfo.name}'s Documents` : 'Documents'}
                </h1>
            </div>

            {loadingDocs ? (
               <div className="flex justify-center items-center h-40">
                  <Loader2 className="animate-spin text-blue-600" size={32} />
               </div>
            ) : documents.length > 0 ? (
              <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
                    <tr>
                      <th className="p-4">Document Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Upload Date</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {documents.map((doc, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        {/* Name Column */}
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <FileText size={18} className="text-blue-500"/>
                                <div>
                                    <p className="font-medium text-gray-700">{doc.name}</p>
                                    <p className="text-xs text-gray-400">{doc.fileName}</p>
                                </div>
                            </div>
                        </td>

                        {/* Status Column */}
                        <td className="p-4">
                            {getStatusBadge(doc.status)}
                        </td>

                        {/* Date Column (Fixed) */}
                        <td className="p-4 text-gray-500 text-sm">
                            {doc.uploadedAt 
                                ? new Date(doc.uploadedAt).toLocaleDateString("en-GB") 
                                : "N/A"}
                        </td>

                        {/* Action Column */}
                        <td className="p-4 text-center">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-2 mx-auto transition"
                          >
                            <Eye size={14} /> Preview
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No documents found for this student.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
             <div className="text-center">
                <User size={48} className="mx-auto mb-3 opacity-20" />
                <p>Select a student from the sidebar to view their documents.</p>
             </div>
          </div>
        )}
      </main>

     {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col relative">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b shrink-0">
                <div>
                    <h3 className="font-bold text-lg">{previewDoc.name}</h3>
                    <p className="text-xs text-gray-500">{previewDoc.status}</p>
                </div>
                <button 
                    onClick={() => setPreviewDoc(null)}
                    className="p-1 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded transition"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 bg-gray-100 p-4 flex items-center justify-center overflow-hidden">
                {(previewDoc.fileUrl?.match(/\.(jpeg|jpg|png|webp)$/i)) ? (
                    <div className="relative w-full h-full min-h-[300px]">
                        <Image 
                            src={previewDoc.fileUrl} 
                            alt="Preview" 
                            fill
                            className="object-contain" 
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        />
                    </div>
                ) : (
                    <iframe 
                        src={previewDoc.fileUrl} 
                        className="w-full h-full rounded border"
                        title="Document Preview"
                    />
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}