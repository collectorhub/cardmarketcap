import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import AboutUs from "@/components/AboutUs";

export const metadata: Metadata = {
  title: "About CardMarketCap",
  description:
    "Learn about CardMarketCap, our mission and our commitment to transparent, independent trading card market intelligence.",
  alternates: {
    canonical: "/about-us",
  },
  openGraph: {
    title: "About CardMarketCap",
    description:
      "Learn about the story, mission and principles behind CardMarketCap.",
    type: "website",
    url: "/about-us",
  },
};

export default function AboutUsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1">
        <AboutUs />
      </main>

      <div className="w-full pb-12 pt-6 sm:pt-8 md:pb-16 md:pt-12">
        <Newsletter />
      </div>

      {/* <Footer /> */}
    </div>
  );
}