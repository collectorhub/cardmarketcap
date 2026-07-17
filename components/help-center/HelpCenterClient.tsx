"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Database,
  ExternalLink,
  Search,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type HelpCategory =
  | "all"
  | "getting-started"
  | "account"
  | "market-data"
  | "portfolio"
  | "buying"
  | "data-corrections";

type HelpArticle = {
  id: string;
  category: Exclude<HelpCategory, "all">;
  question: string;
  answer: string;
  relatedHref?: string;
  relatedLabel?: string;
};

const CATEGORIES: Array<{
  id: HelpCategory;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    id: "all",
    label: "All topics",
    description: "Browse every help article.",
    icon: BookOpen,
  },
  {
    id: "getting-started",
    label: "Getting started",
    description: "Learn the basics of CardMarketCap.",
    icon: CircleHelp,
  },
  {
    id: "account",
    label: "Account",
    description: "Sign-in, profile and access questions.",
    icon: UserRound,
  },
  {
    id: "market-data",
    label: "Market data",
    description: "Prices, sales and population information.",
    icon: BarChart3,
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Tracking cards and watchlists.",
    icon: CreditCard,
  },
  {
    id: "buying",
    label: "Buying links",
    description: "External marketplace listings.",
    icon: ShoppingCart,
  },
  {
    id: "data-corrections",
    label: "Data corrections",
    description: "Report inaccurate or missing information.",
    icon: Database,
  },
];

const ARTICLES: HelpArticle[] = [
  {
    id: "what-is-cardmarketcap",
    category: "getting-started",
    question: "What is CardMarketCap?",
    answer:
      "CardMarketCap is an independent market intelligence platform for trading cards and collectibles. It brings together card catalogue information, market prices, historical sales, grading data and analytics to help users understand the market.",
  },
  {
    id: "supported-cards",
    category: "getting-started",
    question: "Which cards and games are supported?",
    answer:
      "Coverage depends on the catalogue and datasets currently available to CardMarketCap. Pokémon is a core area of coverage, with other trading card games and product categories being expanded over time.",
  },
  {
    id: "search-card",
    category: "getting-started",
    question: "How do I find a specific card?",
    answer:
      "Use the global search or Card Search page and enter the card name, set, card number or a combination of those details. More specific searches usually return better matches.",
  },
  {
    id: "create-account",
    category: "account",
    question: "Do I need an account to use CardMarketCap?",
    answer:
      "Public market pages may be available without an account. Features such as saved portfolios, watchlists, alerts or member-only tools may require you to sign in.",
  },
  {
    id: "cannot-sign-in",
    category: "account",
    question: "What should I do if I cannot sign in?",
    answer:
      "Confirm that you are using the correct email and authentication method. If the issue continues, contact support and include the email associated with your account, the page affected and any error message shown.",
    relatedHref: "/contact",
    relatedLabel: "Contact support",
  },
  {
    id: "account-security",
    category: "account",
    question: "How should I protect my account?",
    answer:
      "Use a unique password where password authentication is available, keep access to your email secure and never share login codes or account credentials. CardMarketCap support will not ask for your password.",
  },
  {
    id: "market-price",
    category: "market-data",
    question: "What does the displayed market price mean?",
    answer:
      "Displayed prices are market estimates based on available information and CardMarketCap methodologies. They provide market guidance and are not guaranteed sale prices, formal appraisals or offers to buy or sell.",
    relatedHref: "/data-sources-methodology",
    relatedLabel: "Read the methodology",
  },
  {
    id: "zero-price",
    category: "market-data",
    question: "Why does a card sometimes show $0.00?",
    answer:
      "A zero value can mean that there is not enough suitable data for the selected card, grade or period, or that the record has not yet been fully matched. It should not automatically be interpreted as the card having no value.",
  },
  {
    id: "historical-sales",
    category: "market-data",
    question: "Where do historical sales come from?",
    answer:
      "Historical sales may come from marketplace information, licensed datasets or other sources available to CardMarketCap. Records can be normalised, matched, deduplicated or excluded where clearly invalid.",
    relatedHref: "/data-sources-methodology",
    relatedLabel: "View data sources",
  },
  {
    id: "population-report",
    category: "market-data",
    question: "What is a population report?",
    answer:
      "A population report shows how many copies of a card have been graded at particular grades where grading data is available. Totals can change as grading companies update their records.",
  },
  {
    id: "add-portfolio",
    category: "portfolio",
    question: "How do I add a card to my portfolio?",
    answer:
      "Open the portfolio area, choose Add Card, find the correct card and select the relevant grade, quantity and purchase details where supported. Confirm the card and variant before saving.",
  },
  {
    id: "portfolio-value",
    category: "portfolio",
    question: "How is portfolio value calculated?",
    answer:
      "Portfolio totals are based on the cards and quantities you have saved together with the market information available for the selected grades. Missing data can affect the displayed total.",
  },
  {
    id: "watchlist",
    category: "portfolio",
    question: "What is the difference between a portfolio and a watchlist?",
    answer:
      "A portfolio is intended for cards you own or actively track as holdings. A watchlist is for cards you want to follow without adding them to your owned collection.",
  },
  {
    id: "buy-links",
    category: "buying",
    question: "Does CardMarketCap sell cards directly?",
    answer:
      "CardMarketCap may provide links to third-party marketplaces, but it does not generally act as the seller. Purchases are completed on the external marketplace and are subject to that marketplace's terms.",
  },
  {
    id: "affiliate-links",
    category: "buying",
    question: "Are marketplace links affiliate links?",
    answer:
      "Some outbound marketplace links may be affiliate links. CardMarketCap may receive a commission when an eligible purchase is completed, without changing the price paid by the user.",
  },
  {
    id: "listing-accuracy",
    category: "buying",
    question: "Why does an external listing not exactly match the card?",
    answer:
      "Marketplace search results are provided by third parties and seller listing information can be incomplete or inconsistent. Always verify the card, grade, language, condition and listing details before purchasing.",
  },
  {
    id: "report-card-error",
    category: "data-corrections",
    question: "How do I report incorrect card information?",
    answer:
      "Use the Data Corrections process and include the card name, set, card number, relevant CardMarketCap URL and supporting evidence where possible.",
    relatedHref: "/data-corrections",
    relatedLabel: "Submit a correction",
  },
  {
    id: "report-price",
    category: "data-corrections",
    question: "Can I report a price that looks incorrect?",
    answer:
      "Yes. Include the card, grade, displayed price, relevant URL and evidence that may help with the review. A report does not guarantee an immediate change because pricing may depend on broader methodology and data quality.",
    relatedHref: "/data-corrections",
    relatedLabel: "Report a data issue",
  },
];

function ArticleRow({
  article,
  isOpen,
  onToggle,
}: {
  article: HelpArticle;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="border-b border-slate-200 dark:border-slate-800">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-start justify-between gap-5 py-5 text-left sm:py-6"
      >
        <span className="text-sm font-black leading-6 text-slate-950 transition-colors group-hover:text-[#00BA88] dark:text-white sm:text-base">
          {article.question}
        </span>

        <ChevronDown
          className={cn(
            "mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200",
            isOpen && "rotate-180 text-[#00BA88]"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-200",
          isOpen
            ? "grid-rows-[1fr] pb-6 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <p className="max-w-4xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-[15px]">
            {article.answer}
          </p>

          {article.relatedHref && article.relatedLabel && (
            <Link
              href={article.relatedHref}
              className="group mt-4 inline-flex items-center gap-2 text-xs font-black text-[#00BA88] transition-colors hover:text-[#00d69d] sm:text-sm"
            >
              {article.relatedLabel}

              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default function HelpCenterClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<HelpCategory>("all");
  const [openArticleId, setOpenArticleId] =
    useState<string | null>(ARTICLES[0]?.id || null);

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return ARTICLES.filter((article) => {
      const categoryMatches =
        category === "all" || article.category === category;

      if (!categoryMatches) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return `${article.question} ${article.answer}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [category, query]);

  const activeCategory = CATEGORIES.find(
    (item) => item.id === category
  );

  return (
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
              Help Center
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <h1 className="max-w-5xl text-[2.55rem] font-black leading-[1.03] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-[3.7rem]">
                How can we{" "}
                <span className="text-[#00BA88]">
                  help?
                </span>
              </h1>

              <p className="mt-6 max-w-4xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
                Find answers about accounts, market data, portfolios,
                marketplace links and reporting information that needs review.
              </p>
            </div>

            <div className="max-w-sm border-l-2 border-[#00BA88] pl-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Still need help?
              </p>

              <Link
                href="/contact"
                className="group mt-2 inline-flex items-center gap-2 text-sm font-bold leading-6 text-slate-800 transition-colors hover:text-[#00BA88] dark:text-slate-200"
              >
                Contact our team

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="relative mt-9 max-w-3xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search help articles..."
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-12 text-sm font-bold text-slate-950 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-[#00BA88] focus:ring-4 focus:ring-[#00BA88]/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white sm:text-base"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </header>

        <section className="grid items-start gap-10 py-12 sm:py-14 md:py-20 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-16 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="w-full self-start lg:sticky lg:top-28 lg:z-20 lg:h-fit">
            <div className="lg:hidden">
              <p className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Browse topics
              </p>

              <div className="overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex w-max min-w-full gap-2 pr-1">
                  {CATEGORIES.map((item) => {
                    const isActive = category === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setCategory(item.id);
                          setOpenArticleId(null);
                        }}
                        className={cn(
                          "shrink-0 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-black transition-all duration-300",
                          isActive
                            ? "border-[#00BA88] bg-[#00BA88]/10 text-[#00BA88] shadow-sm shadow-[#00BA88]/10"
                            : "border-slate-200 bg-white text-slate-600 hover:border-[#00BA88] hover:text-[#00BA88] dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <nav
              aria-label="Help Center topics"
              className="hidden w-full border-t border-slate-200 dark:border-slate-800 lg:block"
            >
              {CATEGORIES.map((item, index) => {
                const isActive = category === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCategory(item.id);
                      setOpenArticleId(null);
                    }}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "group relative grid w-full grid-cols-[32px_minmax(0,1fr)] gap-3 border-b py-4 pl-3 pr-2 text-left transition-all duration-300",
                      isActive
                        ? "border-[#00BA88]/20 bg-[#00BA88]/[0.07]"
                        : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900/50"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#00BA88] transition-all duration-300",
                        isActive
                          ? "scale-y-100 opacity-100"
                          : "scale-y-50 opacity-0"
                      )}
                    />

                    <span
                      className={cn(
                        "pt-0.5 text-[9px] font-black tracking-[0.16em] transition-colors duration-300",
                        isActive
                          ? "text-[#00BA88]"
                          : "text-slate-400 group-hover:text-[#00BA88] dark:text-slate-600"
                      )}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0">
                      <span
                        className={cn(
                          "block text-sm font-black transition-colors duration-300",
                          isActive
                            ? "text-[#00BA88]"
                            : "text-slate-700 group-hover:text-[#00BA88] dark:text-slate-300"
                        )}
                      >
                        {item.label}
                      </span>

                      <span className="mt-1 block text-xs font-medium leading-5 text-slate-400 dark:text-slate-500">
                        {item.description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                  {activeCategory?.label || "Help articles"}
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl">
                  {query
                    ? `Results for “${query.trim()}”`
                    : "Frequently asked questions"}
                </h2>
              </div>

              <p className="text-xs font-bold text-slate-400">
                {filteredArticles.length}{" "}
                {filteredArticles.length === 1 ? "article" : "articles"}
              </p>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="border-t border-slate-200 dark:border-slate-800">
                {filteredArticles.map((article) => (
                  <ArticleRow
                    key={article.id}
                    article={article}
                    isOpen={openArticleId === article.id}
                    onToggle={() =>
                      setOpenArticleId((current) =>
                        current === article.id ? null : article.id
                      )
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="border-y border-slate-200 py-16 text-center dark:border-slate-800">
                <CircleHelp className="mx-auto h-9 w-9 text-slate-300 dark:text-slate-700" />

                <h3 className="mt-4 text-lg font-black text-slate-950 dark:text-white">
                  No matching articles
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                  Try a different search phrase or browse another help topic.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("all");
                  }}
                  className="mt-5 text-sm font-black text-[#00BA88]"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid overflow-hidden border-y border-slate-800 bg-slate-950 lg:grid-cols-3">
            <article className="p-6 sm:p-8 lg:p-10">
              <ShieldCheck className="h-5 w-5 text-[#00BA88]" />

              <h2 className="mt-4 text-xl font-black text-white">
                Account or technical issue
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
                Send the page affected, your account email and a clear
                description of what happened.
              </p>

              <Link
                href="/contact"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-black text-[#00BA88]"
              >
                Contact support

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>

            <article className="border-t border-slate-800 bg-slate-900/45 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <Database className="h-5 w-5 text-[#00BA88]" />

              <h2 className="mt-4 text-xl font-black text-white">
                Incorrect card data
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
                Report incorrect card details, sets, images, prices or grading
                information with supporting evidence.
              </p>

              <Link
                href="/data-corrections"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-black text-[#00BA88]"
              >
                Submit a correction

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>

            <article className="border-t border-slate-800 p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <ExternalLink className="h-5 w-5 text-[#00BA88]" />

              <h2 className="mt-4 text-xl font-black text-white">
                Policies and methodology
              </h2>

              <p className="mt-3 text-sm font-medium leading-7 text-slate-300">
                Review how data is processed and the policies that govern the
                Platform.
              </p>

              <Link
                href="/trust-centre"
                className="group mt-5 inline-flex items-center gap-2 text-sm font-black text-[#00BA88]"
              >
                Visit Trust Centre

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
}
