import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import HelpCenterClient from "@/components/help-center/HelpCenterClient";

export const metadata: Metadata = {
  title: "Help Center | CardMarketCap",
  description:
    "Find answers about CardMarketCap accounts, card data, pricing, portfolios, buying links and platform support.",
  alternates: {
    canonical: "/help-center",
  },
  openGraph: {
    title: "CardMarketCap Help Center",
    description:
      "Browse common questions and support guidance for using CardMarketCap.",
    type: "website",
    url: "/help-center",
  },
};

export default function HelpCenterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1">
        <HelpCenterClient />
      </main>

      <div className="w-full pb-12 pt-6 sm:pt-8 md:pb-16 md:pt-12">
        <Newsletter />
      </div>

      {/* <Footer /> */}
    </div>
  );
}
