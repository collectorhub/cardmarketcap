import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import TrustCentre from "@/components/TrustCentre";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Trust Centre | CardMarketCap",
  description:
    "Explore CardMarketCap's methodology, privacy, legal, data correction and platform trust documents.",
  alternates: {
    canonical: "/trust-centre",
  },
  openGraph: {
    title: "CardMarketCap Trust Centre",
    description:
      "Learn how CardMarketCap handles market data, privacy, cookies, intellectual property and platform transparency.",
    type: "website",
    url: "/trust-centre",
  },
};

export default function TrustCentrePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1">
        <TrustCentre />
      </main>

      <div className="w-full pb-12 pt-6 sm:pt-8 md:pb-16 md:pt-12">
        <Newsletter />
      </div>

      {/* <Footer /> */}
    </div>
  );
}