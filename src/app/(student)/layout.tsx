import { Toaster } from "@/components/ui/sonner";
import StudentSidebar from "./student/StudentSidebar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/10">
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-border bg-card">
        <StudentSidebar />
      </div>

      <main className="flex-1 md:pl-64">
        <div className="container py-6 md:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
         <Toaster />
      </main>
    </div>
  );
}