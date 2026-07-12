"use client";

import Link from "next/link";
import Image from "next/image";
import type { IconType } from "react-icons";
import {
  FaTwitter,
  FaInstagram,
  FaDiscord,
} from "react-icons/fa";

type FooterSection = {
  title: string;
  links: Array<{
    name: string;
    href: string;
    icon?: IconType;
  }>;
};

const footerSections: FooterSection[] = [
  {
    title: "Socials",
    links: [
      {
        name: "X (Twitter)",
        href: "#",
        icon: FaTwitter,
      },
      {
        name: "Instagram",
        href: "#",
        icon: FaInstagram,
      },
      {
        name: "Discord",
        href: "#",
        icon: FaDiscord,
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "Contact us",
        href: "/contact",
      },
      {
        name: "Request form",
        href: "/request",
      },
      {
        name: "API Documentation",
        href: "/api-docs",
      },
      {
        name: "Help Center",
        href: "/help",
      },
    ],
  },
  {
    title: "Company",
    links: [
      // {
      //   name: "About us",
      //   href: "/about-us",
      // },
      {
        name: "Trust Centre",
        href: "/trust-centre",
      },
      {
        name: "Advertise",
        href: "/advertise",
      },
    ],
  },
  {
    title: "Products",
    links: [
      {
        name: "Card Sets",
        href: "/sets",
      },
      {
        name: "Portfolio",
        href: "/portfolio",
      },
      {
        name: "Watchlist",
        href: "/portfolio/watchlist",
      },
      // {
      //   name: "Indicators",
      //   href: "/indicators",
      // },
      // {
      //   name: "Indices",
      //   href: "/indices",
      // },
      {
        name: "Shop",
        href: "/shop",
      },
    ],
  },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-[#F9FAFB] transition-colors duration-300 dark:border-slate-800 dark:bg-[#020617]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 md:px-8 md:py-16 lg:px-10">
        <div className="mb-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:gap-x-10 md:grid-cols-3 md:gap-12 lg:mb-16 lg:grid-cols-6">
          <div className="col-span-2 space-y-6">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
              aria-label="CardMarketCap home"
            >
              <div className="relative h-7 w-7 shrink-0">
                <Image
                  src="/logo.png"
                  alt="CardMarketCap logo"
                  fill
                  sizes="28px"
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <span className="font-heading text-xl font-bold tracking-tighter text-slate-900 dark:text-white">
                CardMarket
                <span className="text-[#00BA88]">
                  Cap
                </span>
              </span>
            </Link>

            <p className="max-w-sm text-sm font-medium leading-7 text-slate-500 dark:text-slate-400">
              Independent market intelligence for trading cards and
              collectibles. Explore prices, analytics, research,
              portfolio tools and live market activity in one platform.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="h-2 w-2 rounded-full bg-[#00BA88] animate-pulse" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Live Market Data
              </span>
            </div>
          </div>

          {footerSections.map((section) => (
            <div
              key={section.title}
              className="min-w-0 space-y-5"
            >
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">
                {section.title}
              </h4>

              <ul className="space-y-3">
                {section.links.map((link) => {
                  const Icon = link.icon;

                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="group inline-flex max-w-full items-center gap-2 text-[13px] font-semibold leading-5 text-slate-500 transition-colors hover:text-[#00BA88] dark:text-slate-400 dark:hover:text-[#00BA88]"
                      >
                        {Icon ? (
                          <Icon className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-colors group-hover:text-[#00BA88]" />
                        ) : null}

                        <span className="break-words">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-5 border-t border-slate-100 pt-8 dark:border-slate-900 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-center text-[12px] font-medium leading-6 text-slate-400 dark:text-slate-600 md:text-left">
            © {currentYear} CardMarketCap. All rights reserved.
            Market data is provided for informational and research
            purposes only.
          </p>

          <div className="hidden items-center gap-4 border-l border-slate-200 pl-6 dark:border-slate-800 md:flex">
            <span className="text-[11px] font-medium italic normal-case text-slate-300 dark:text-slate-700">
              Systems Nominal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}