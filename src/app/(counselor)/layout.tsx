import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CounselorMainLayout from "./counselor/CounselorMainLayout";

export default async function CounselorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/counselor/login"); 
  }

  // ২. রোল চেক
  if (session.user?.role !== "counselor") {
    redirect("/unauthorized");
  }

  return (
    <CounselorMainLayout user={session.user || null}>
      {children}
    </CounselorMainLayout>
  );
}