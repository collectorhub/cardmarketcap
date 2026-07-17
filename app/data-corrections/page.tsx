import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  FileCheck2,
  SearchCheck,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import DataCorrectionForm from "@/components/data-corrections/DataCorrectionForm";

export const metadata: Metadata = {
  title: "Data Corrections | CardMarketCap",
  description:
    "Report inaccurate, incomplete or missing card data displayed on CardMarketCap.",
  alternates: {
    canonical: "/data-corrections",
  },
  openGraph: {
    title: "CardMarketCap Data Corrections",
    description:
      "Submit evidence-backed corrections for card, set, pricing, image or grading information.",
    type: "website",
    url: "/data-corrections",
  },
};

const REVIEW_STEPS = [
  {
    number: "01",
    title: "Submit the issue",
    description:
      "Provide the affected card, relevant page and a clear explanation of what appears incorrect.",
    icon: Database,
  },
  {
    number: "02",
    title: "We review the evidence",
    description:
      "The report may be checked against trusted sources, matching systems and available market records.",
    icon: SearchCheck,
  },
  {
    number: "03",
    title: "The record is resolved",
    description:
      "Where a change is supported, the relevant information is corrected or queued for an appropriate update.",
    icon: FileCheck2,
  },
];

export default function DataCorrectionsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1">
        <div className="relative isolate overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[620px] bg-[radial-gradient(circle_at_top,rgba(0,186,136,0.1),transparent_70%)]"
          />

          <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-12 pt-24 sm:px-5 sm:pt-28 md:px-8 md:pb-20 md:pt-32 lg:pt-24">
            <header className="border-b border-slate-200 pb-12 dark:border-slate-800 sm:pb-16 md:pb-20">
              <nav className="mb-5 flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00BA88] sm:text-[10px]">
                  CardMarketCap
                </span>

                <span className="text-[9px] text-slate-300 dark:text-slate-700 sm:text-[10px]">
                  /
                </span>

                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:text-[10px]">
                  Data Corrections
                </span>
              </nav>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
                <div className="min-w-0">
                  <h1 className="max-w-5xl text-[2.55rem] font-black leading-[1.03] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-[3.7rem]">
                    Help us keep data{" "}
                    <span className="text-[#00BA88]">
                      accurate.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-4xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
                    Report incorrect, incomplete or missing card information,
                    images, sets, prices, sales records or grading data.
                  </p>
                </div>

                <div className="max-w-sm border-l-2 border-[#00BA88] pl-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Best reports include
                  </p>

                  <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
                    The card, affected URL, expected correction and supporting
                    evidence.
                  </p>
                </div>
              </div>
            </header>

            <section className="grid items-start gap-10 py-12 sm:py-14 md:py-20 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
              <aside className="space-y-8 lg:sticky lg:top-28">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                    Submit a Correction
                  </p>

                  <h2 className="mt-3 max-w-xl text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                    Give us the details we need.
                  </h2>

                  <p className="mt-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                    Specific, evidence-backed reports are easier to review and
                    resolve. Please submit one primary issue per form.
                  </p>
                </div>

                <div className="border-y border-slate-200 dark:border-slate-800">
                  {[
                    "Card name, set and number",
                    "CardMarketCap page affected",
                    "What currently appears",
                    "What the correct information should be",
                    "A reliable source or evidence URL",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className={`flex items-start gap-4 py-4 ${
                        index < 4
                          ? "border-b border-slate-200 dark:border-slate-800"
                          : ""
                      }`}
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00BA88]" />

                      <p className="text-sm font-bold leading-6 text-slate-600 dark:text-slate-300">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs font-medium leading-6 text-slate-400">
                  Submitting a report does not guarantee an immediate change.
                  Some issues require additional verification or methodology
                  review.
                </p>
              </aside>

              <DataCorrectionForm />
            </section>

            <section className="border-t border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
              <div className="grid gap-10 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                    Review Process
                  </p>

                  <h2 className="mt-3 max-w-lg text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                    What happens next.
                  </h2>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-800">
                  {REVIEW_STEPS.map((step) => {
                    const Icon = step.icon;

                    return (
                      <article
                        key={step.number}
                        className="grid gap-3 border-b border-slate-200 py-6 dark:border-slate-800 sm:grid-cols-[56px_200px_minmax(0,1fr)] sm:gap-6 md:grid-cols-[70px_230px_minmax(0,1fr)] md:py-7"
                      >
                        <span className="text-[10px] font-black tracking-[0.2em] text-[#00BA88]">
                          {step.number}
                        </span>

                        <div className="flex items-start gap-3">
                          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#00BA88]" />

                          <h3 className="text-base font-black text-slate-950 dark:text-white sm:text-lg">
                            {step.title}
                          </h3>
                        </div>

                        <p className="max-w-3xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400">
                          {step.description}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="border-t border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
              <div className="grid gap-6 border-y border-slate-800 bg-slate-950 p-6 sm:p-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-12">
                <div>
                  <h2 className="text-2xl font-black tracking-[-0.025em] text-white sm:text-3xl">
                    Need help with your account instead?
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
                    Use the Contact page for login problems, technical support,
                    partnerships, advertising or general enquiries.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="group inline-flex min-h-11 items-center gap-2 text-sm font-black text-[#00BA88] transition-colors hover:text-[#00d69d]"
                >
                  Contact the team

                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="w-full pb-12 pt-6 sm:pt-8 md:pb-16 md:pt-12">
        <Newsletter />
      </div>

      <Footer />
    </div>
  );
}
