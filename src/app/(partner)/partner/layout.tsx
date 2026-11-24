import type { Metadata } from "next";
import PartnerSidebar from "./PartnerSidebar";

export const metadata: Metadata = {
  title: "Partner Dashboard | Orbis Scholar",
  description: "Partner portal for managing student applications",
};

export const dynamic = "force-dynamic";

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex">
      <PartnerSidebar />
      <main className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <div className="container mx-auto px-4 py-8 w-full max-w-full">
          {children}
        </div>
      </main>
    </div>
  );
}