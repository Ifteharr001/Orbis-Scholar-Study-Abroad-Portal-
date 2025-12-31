import Footer from "../components/footer/Footer";
import Navbar from "../components/navbar/Navbar";

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