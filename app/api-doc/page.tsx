import type { Metadata } from "next";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "API Documentation | CardMarketCap",
  description:
    "CardMarketCap API documentation is coming soon.",
  alternates: {
    canonical: "/api-documentation",
  },
  openGraph: {
    title: "CardMarketCap API Documentation",
    description:
      "Developer access to CardMarketCap data and tools is coming soon.",
    type: "website",
    url: "/api-documentation",
  },
};

export default function ApiDocumentationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex flex-1 items-center h-screen">
        <section className="relative isolate w-full overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,186,136,0.11),transparent_68%)]"
          />

          <div className="relative mx-auto flex min-h-[72vh] w-full max-w-[1100px] flex-col items-center justify-center px-4 py-24 text-center sm:px-6 md:px-8">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#00BA88] sm:text-xs">
              API Documentation
            </p>

            <h1 className="mt-4 text-[2.7rem] font-black leading-[1.02] tracking-[-0.045em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-[4.4rem]">
              Coming{" "}
              <span className="text-[#00BA88]">
                soon.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
              We are preparing developer access to selected CardMarketCap data
              and tools. Full documentation will be published here when the API
              is ready.
            </p>
          </div>
        </section>
      </main>

      <div className="w-full pb-12 pt-6 sm:pt-8 md:pb-16 md:pt-12">
        <Newsletter />
      </div>

      {/* <Footer /> */}
    </div>
  );
}
