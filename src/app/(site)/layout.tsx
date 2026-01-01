"use client";

import dynamic from "next/dynamic";
import Footer from "../components/footer/Footer";

const Navbar = dynamic(() => import("../components/navbar/Navbar"), {
  ssr: false,
});

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
        {children}
      <Footer />
    </div>
  );
}