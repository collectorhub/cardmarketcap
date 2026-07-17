import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  ShieldCheck,
} from "lucide-react";
import {
  FaDiscord,
  FaInstagram,
  FaXTwitter,
} from "react-icons/fa6";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact CardMarketCap",
  description:
    "Contact CardMarketCap for support, partnerships, advertising, corrections and general enquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact CardMarketCap",
    description:
      "Send CardMarketCap a secure enquiry or connect through our official social channels.",
    type: "website",
    url: "/contact",
  },
};

const SOCIAL_LINKS = [
  {
    name: "X",
    value: "@cardmarketcap",
    href: "https://x.com/cardmarketcap",
    icon: FaXTwitter,
  },
  {
    name: "Discord",
    value: "Join our community",
    href: "https://discord.gg/your-invite",
    icon: FaDiscord,
  },
  {
    name: "Instagram",
    value: "@cardmarketcap",
    href: "https://instagram.com/cardmarketcap",
    icon: FaInstagram,
  },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F9FAFB] transition-colors duration-300 dark:bg-[#020617]">
      <Navbar />

      <div className="lg:hidden">
        <Sidebar />
      </div>

      <main className="flex-1">
        <div className="relative">
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
                  Contact
                </span>
              </nav>

              <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
                <div>
                  <h1 className="max-w-5xl text-[2.55rem] font-black leading-[1.04] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-[3.6rem]">
                    Let&apos;s connect with{" "}
                    <span className="text-[#00BA88]">
                      CardMarketCap.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-4xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
                    Send us a message for support, partnerships, advertising,
                    platform feedback, data corrections or business enquiries.
                    Your request will be routed to the right team.
                  </p>
                </div>

                <div className="max-w-sm border-l-2 border-[#00BA88] pl-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Best way to reach us
                  </p>

                  <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
                    Use the secure form below so we receive all the details
                    needed to help you quickly.
                  </p>
                </div>
              </div>
            </header>

            <section className="py-12 sm:py-14 md:py-20">
              <div className="grid items-start gap-10 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-14 xl:grid-cols-[minmax(360px,0.76fr)_minmax(0,1.24fr)] xl:gap-20">
                <aside className="space-y-8 lg:sticky lg:top-28">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                      Contact CardMarketCap
                    </p>

                    <h2 className="mt-3 text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                      Tell us how we can help.
                    </h2>

                    <p className="mt-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                      Choose the enquiry type and include as much relevant
                      information as possible. The form adapts to your request.
                    </p>
                  </div>

                  <div className="border-y border-slate-200 dark:border-slate-800">
                    <div className="flex items-start gap-4 border-b border-slate-200 py-5 dark:border-slate-800">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-[#00BA88]">
                        <Clock3 className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-950 dark:text-white">
                          Typical response
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                          Within one business day.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 border-b border-slate-200 py-5 dark:border-slate-800">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-[#00BA88]">
                        <ShieldCheck className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-950 dark:text-white">
                          Secure submission
                        </p>
                        <p className="mt-1 text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                          Server-validated and protected from spam.
                        </p>
                      </div>
                    </div>

                    <a
                      href="mailto:hello@cardmarketcap.com"
                      className="group flex items-start gap-4 py-5"
                    >
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-[#00BA88]">
                        <Mail className="h-[18px] w-[18px]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-black text-slate-950 transition-colors group-hover:text-[#00BA88] dark:text-white">
                          Email
                        </p>
                        <p className="mt-1 break-all text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                          hello@cardmarketcap.com
                        </p>
                      </div>

                      <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#00BA88] dark:text-slate-700" />
                    </a>
                  </div>

                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                      Official channels
                    </p>

                    <div className="border-y border-slate-200 dark:border-slate-800">
                      {SOCIAL_LINKS.map((social, index) => {
                        const Icon = social.icon;

                        return (
                          <Link
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group flex items-center gap-4 py-4 transition-colors ${
                              index < SOCIAL_LINKS.length - 1
                                ? "border-b border-slate-200 dark:border-slate-800"
                                : ""
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center text-[#00BA88]">
                              <Icon className="h-[17px] w-[17px]" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-black text-slate-950 transition-colors group-hover:text-[#00BA88] dark:text-white">
                                {social.name}
                              </p>
                              <p className="mt-0.5 truncate text-sm font-medium text-slate-500 dark:text-slate-400">
                                {social.value}
                              </p>
                            </div>

                            <ArrowUpRight className="h-4 w-4 shrink-0 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#00BA88] dark:text-slate-700" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                <ContactForm />
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
