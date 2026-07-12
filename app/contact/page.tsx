import type { Metadata } from "next";
import Link from "next/link";
import { Mail, ArrowUpRight } from "lucide-react";

import {
  FaXTwitter,
  FaInstagram,
  FaDiscord,
  FaWhatsapp,
} from "react-icons/fa6";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Newsletter } from "@/components/Newsletter";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact CardMarketCap",
  description:
    "Contact CardMarketCap by email or connect with us through our official social channels.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact CardMarketCap",
    description:
      "Reach CardMarketCap by email or through our official social channels.",
    type: "website",
    url: "/contact",
  },
};

const CONTACT_LINKS = [
  {
    name: "Email",
    description:
      "For support, partnerships, advertising, corrections and general enquiries.",
    href: "mailto:hello@cardmarketcap.com",
    value: "hello@cardmarketcap.com",
    icon: Mail,
  },
  {
    name: "WhatsApp",
    description:
      "For quick conversations and direct enquiries.",
    href: "https://wa.me/000000000000",
    value: "Message us on WhatsApp",
    icon: FaWhatsapp,
  },
  {
    name: "X",
    description:
      "Follow platform updates, product announcements and market conversations.",
    href: "https://x.com/cardmarketcap",
    value: "@cardmarketcap",
    icon: FaXTwitter,
  },
  {
    name: "Discord",
    description:
      "Join the community and connect with other collectors.",
    href: "https://discord.gg/your-invite",
    value: "Join our Discord",
    icon: FaDiscord,
  },
  {
    name: "Instagram",
    description:
      "Follow CardMarketCap for platform updates and visual content.",
    href: "https://instagram.com/cardmarketcap",
    value: "@cardmarketcap",
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
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(0,186,136,0.09),transparent_70%)]"
          />

          <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-12 pt-24 sm:px-5 sm:pt-28 md:px-8 md:pb-20 md:pt-32 lg:pt-24">
            {/* Hero */}
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
                    Reach us by email for support, partnerships, advertising,
                    platform feedback, data corrections or business enquiries.
                    You can also connect with us through our official social
                    channels.
                  </p>
                </div>

                <div className="max-w-sm border-l-2 border-[#00BA88] pl-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Best way to reach us
                  </p>

                  <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
                    Email is the most reliable channel for detailed enquiries.
                  </p>
                </div>
              </div>
            </header>

            {/* Contact channels */}
            <section className="border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
              <div className="grid items-start gap-10 lg:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)] lg:gap-14 xl:grid-cols-[minmax(420px,0.82fr)_minmax(0,1.18fr)] xl:gap-20">
                <div className="max-w-xl self-start lg:sticky lg:top-28">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                    Contact Channels
                  </p>

                  <h2 className="mt-3 text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                    Choose the channel that works best.
                  </h2>

                  <p className="mt-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                    For formal support requests, data issues, advertising,
                    partnerships or legal enquiries, please use email. Social
                    channels are best for quick questions and community
                    updates.
                  </p>
                </div>

                <div className="min-w-0 border-t border-slate-200 dark:border-slate-800">
                  {CONTACT_LINKS.map((contact) => {
                    const Icon = contact.icon;
                    const isExternal = contact.href.startsWith("http");

                    return (
                      <Link
                        key={contact.name}
                        href={contact.href}
                        target={isExternal ? "_blank" : undefined}
                        rel={
                          isExternal
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="group grid min-w-0 grid-cols-[52px_minmax(0,1fr)_28px] items-start gap-4 border-b border-slate-200 py-7 transition-colors dark:border-slate-800 sm:grid-cols-[60px_minmax(0,1fr)_32px] sm:gap-5 sm:py-8"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00BA88]/10 text-[#00BA88] transition-transform duration-300 group-hover:scale-105">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 pr-2 sm:pr-6">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-black text-slate-950 transition-colors group-hover:text-[#00BA88] dark:text-white sm:text-lg">
                              {contact.name}
                            </h3>

                            {contact.name === "Email" ? (
                              <span className="rounded-full bg-[#00BA88]/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[#00BA88]">
                                Recommended
                              </span>
                            ) : null}
                          </div>

                          <p className="mt-1 max-w-4xl text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                            {contact.description}
                          </p>

                          <p className="mt-2 break-words text-sm font-bold text-slate-800 dark:text-slate-200">
                            {contact.value}
                          </p>
                        </div>

                        <div className="flex justify-end pt-1">
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#00BA88] dark:text-slate-700" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Before contacting */}
            <section className="py-12 sm:py-14 md:py-20">
              <div className="grid items-start gap-10 lg:grid-cols-[minmax(360px,0.8fr)_minmax(0,1.2fr)] lg:gap-14 xl:grid-cols-[minmax(420px,0.82fr)_minmax(0,1.18fr)] xl:gap-20">
                <div className="max-w-xl self-start lg:sticky lg:top-28">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                    Before Contacting Us
                  </p>

                  <h2 className="mt-3 text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                    Help us respond faster.
                  </h2>

                  <p className="mt-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                    Providing the right details in your first message helps us
                    understand your enquiry and respond more efficiently.
                  </p>
                </div>

                <div className="min-w-0 border-t border-slate-200 dark:border-slate-800">
                  <article className="grid min-w-0 gap-3 border-b border-slate-200 py-7 dark:border-slate-800 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-10 sm:py-8 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <h3 className="text-base font-black leading-7 text-slate-950 dark:text-white sm:text-lg">
                      Data corrections
                    </h3>

                    <p className="text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                      Include the card name, set, card number, relevant URL
                      and any supporting evidence that may help us review the
                      issue.
                    </p>
                  </article>

                  <article className="grid min-w-0 gap-3 border-b border-slate-200 py-7 dark:border-slate-800 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-10 sm:py-8 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <h3 className="text-base font-black leading-7 text-slate-950 dark:text-white sm:text-lg">
                      Support enquiries
                    </h3>

                    <p className="text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                      Include the email associated with your account, the
                      page affected and a clear description of what happened.
                    </p>
                  </article>

                  <article className="grid min-w-0 gap-3 border-b border-slate-200 py-7 last:border-b-0 dark:border-slate-800 sm:grid-cols-[230px_minmax(0,1fr)] sm:gap-10 sm:py-8 xl:grid-cols-[260px_minmax(0,1fr)]">
                    <h3 className="text-base font-black leading-7 text-slate-950 dark:text-white sm:text-lg">
                      Partnerships and advertising
                    </h3>

                    <p className="text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                      Tell us about your organisation, the opportunity and
                      what you would like to discuss with CardMarketCap.
                    </p>
                  </article>
                </div>
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