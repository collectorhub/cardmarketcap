import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Database,
  Layers3,
  LineChart,
  ShieldCheck,
} from "lucide-react";

const PLATFORM_FEATURES = [
  {
    title: "Market prices",
    description:
      "Clear pricing context built from available market information.",
    icon: LineChart,
  },
  {
    title: "Historical sales",
    description:
      "Past transactions organised to make market activity easier to understand.",
    icon: BarChart3,
  },
  {
    title: "Grading data",
    description:
      "Population and grading information connected to the relevant cards.",
    icon: ShieldCheck,
  },
  {
    title: "Card catalogue",
    description:
      "Structured card, set, variant and product information in one place.",
    icon: Database,
  },
  {
    title: "Market analytics",
    description:
      "Research tools and indicators designed to add useful market context.",
    icon: Layers3,
  },
  {
    title: "Research tools",
    description:
      "Search and discovery experiences for collectors, retailers and researchers.",
    icon: BookOpen,
  },
];

const PRINCIPLES = [
  {
    number: "01",
    title: "Transparency",
    description:
      "Users should be able to understand where information comes from, how it is processed and the limitations that may affect it.",
  },
  {
    number: "02",
    title: "Accuracy",
    description:
      "We continually review our catalogue, market records and matching systems to improve the reliability of the Platform.",
  },
  {
    number: "03",
    title: "Independence",
    description:
      "Our methodologies, analytics and research are developed without influence from manufacturers, grading companies or advertisers.",
  },
  {
    number: "04",
    title: "Consistency",
    description:
      "We aim to apply dependable standards across market coverage, catalogue information, analytics and research.",
  },
  {
    number: "05",
    title: "Continuous improvement",
    description:
      "Market intelligence is never complete, so the Platform continues to evolve alongside the collecting community.",
  },
];

const RELATED_PAGES = [
  {
    title: "Trust Centre",
    description:
      "Policies, disclosures and standards that explain how the Platform operates.",
    href: "/trust-centre",
  },
  {
    title: "Data Sources & Methodology",
    description:
      "Where our information comes from and how it is processed.",
    href: "/data-sources-methodology",
  },
  {
    title: "Data Corrections",
    description:
      "Report inaccurate, incomplete or missing information.",
    href: "/data-corrections",
  },
  {
    title: "Contact",
    description:
      "Reach the CardMarketCap team with questions or feedback.",
    href: "/contact",
  },
];

export default function AboutUs() {
  return (
    <div className="relative isolate w-full max-w-full overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(0,186,136,0.1),transparent_70%)] sm:h-[600px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-12 pt-24 sm:px-5 sm:pt-28 md:px-8 md:pb-20 md:pt-32 lg:pt-24">
        {/* Hero */}
        <header className="border-b border-slate-200 pb-12 dark:border-slate-800 sm:pb-16 md:pb-20">
          <nav className="mb-5 flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00BA88] sm:text-[10px]">
              CardMarketCap
            </span>

            <span className="text-[9px] text-slate-300 dark:text-slate-700 sm:text-[10px]">
              /
            </span>

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:text-[10px]">
              About Us
            </span>
          </nav>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end lg:gap-16">
            <div className="min-w-0">
              <h1 className="max-w-5xl text-[2.55rem] font-black leading-[1.03] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-[3.7rem]">
                Better data for{" "}
                <span className="text-[#00BA88]">
                  card collectors.
                </span>
              </h1>

              <p className="mt-6 max-w-4xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
                CardMarketCap brings pricing, sales, grading, catalogue data
                and market analytics into one transparent platform for the
                global trading card community.
              </p>
            </div>

            <div className="max-w-sm border-l-2 border-[#00BA88] pl-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">
                Our focus
              </p>

              <p className="mt-2 text-sm font-bold leading-6 text-slate-800 dark:text-slate-200">
                Make trading card market information easier to find,
                understand and trust.
              </p>
            </div>
          </div>
        </header>

        {/* Story and mission */}
        <section className="grid gap-10 border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
              Our Story
            </p>

            <h2 className="mt-3 max-w-lg text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
              Built because market data was too fragmented.
            </h2>
          </div>

          <div className="max-w-4xl">
            <div className="space-y-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
              <p>
                CardMarketCap is owned and operated by Lowbridge Media
                Ventures Ltd. We created the Platform because collectors
                deserve better market information.
              </p>

              <p>
                Trading cards have grown into a global market, yet useful
                information is still spread across marketplaces, grading
                companies and independent resources. CardMarketCap brings
                those signals together in a clearer, more consistent
                experience.
              </p>
            </div>

            <div className="mt-10 border-l-2 border-[#00BA88] pl-5 sm:pl-7">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Our Mission
              </p>

              <p className="mt-3 max-w-4xl text-[1.45rem] font-black leading-[1.35] tracking-[-0.02em] text-slate-950 dark:text-white sm:text-2xl md:text-[1.8rem]">
                To build the world&apos;s most trusted market intelligence
                platform for trading cards and collectibles.
              </p>
            </div>
          </div>
        </section>

        {/* What we build */}
        <section className="border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                What We Build
              </p>

              <h2 className="mt-3 max-w-lg text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                More than a price guide.
              </h2>

              <p className="mt-5 max-w-xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                One platform for discovering cards, understanding the market
                and making better-informed decisions.
              </p>
            </div>

            <div className="grid gap-x-8 border-t border-slate-200 dark:border-slate-800 sm:grid-cols-2">
              {PLATFORM_FEATURES.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="border-b border-slate-200 py-6 dark:border-slate-800 sm:min-h-[170px] sm:py-7"
                  >
                    <Icon className="h-5 w-5 text-[#00BA88]" />

                    <h3 className="mt-4 text-base font-black text-slate-950 dark:text-white sm:text-lg">
                      {feature.title}
                    </h3>

                    <p className="mt-2 max-w-md text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                      {feature.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid gap-8 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Our Principles
              </p>

              <h2 className="mt-3 max-w-lg text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                How we earn trust.
              </h2>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800">
              {PRINCIPLES.map((principle) => (
                <article
                  key={principle.number}
                  className="grid gap-3 border-b border-slate-200 py-6 dark:border-slate-800 sm:grid-cols-[56px_190px_minmax(0,1fr)] sm:gap-6 md:grid-cols-[70px_220px_minmax(0,1fr)] md:py-7"
                >
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#00BA88]">
                    {principle.number}
                  </span>

                  <h3 className="text-base font-black text-slate-950 dark:text-white sm:text-lg">
                    {principle.title}
                  </h3>

                  <p className="max-w-3xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Independence and future */}
        <section className="border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid overflow-hidden border-y border-slate-800 bg-slate-950 lg:grid-cols-2">
            <article className="p-6 sm:p-9 lg:p-12 xl:p-14">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Independent by Design
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-white sm:text-3xl">
                Built without outside influence.
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                Lowbridge develops the Platform independently. Our
                methodologies, analytics and research are created without
                influence from card manufacturers, grading companies,
                marketplaces or advertisers.
              </p>
            </article>

            <article className="border-t border-slate-800 bg-slate-900/55 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-12 xl:p-14">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Looking Ahead
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-white sm:text-3xl">
                Intelligence beyond prices.
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                We continue to improve catalogue coverage, matching systems,
                analytics and research tools so users can understand more of
                the market, not just the latest price.
              </p>
            </article>
          </div>
        </section>

        {/* Community */}
        <section className="grid gap-10 border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
              Built with the Community
            </p>

            <h2 className="mt-3 max-w-lg text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
              Better information is built together.
            </h2>
          </div>

          <div className="max-w-4xl">
            <p className="text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
              Constructive feedback from collectors, retailers and
              researchers helps improve CardMarketCap. We welcome thoughtful
              suggestions and evidence-backed corrections because they make
              the Platform more accurate and useful for everyone.
            </p>

            <Link
              href="/data-corrections"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[#00BA88] transition-colors hover:text-[#00d69d]"
            >
              Submit a data correction

              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Related pages */}
        <section className="py-12 sm:py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(300px,0.72fr)_minmax(0,1.28fr)] lg:gap-16 xl:gap-24">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Explore More
              </p>

              <h2 className="mt-3 max-w-lg text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                Learn how we operate.
              </h2>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800">
              {RELATED_PAGES.map((page) => (
                <Link
                  key={page.title}
                  href={page.href}
                  className="group grid gap-2 border-b border-slate-200 py-5 dark:border-slate-800 sm:grid-cols-[220px_minmax(0,1fr)_24px] sm:items-center sm:gap-8 sm:py-6"
                >
                  <span className="text-sm font-black text-slate-950 transition-colors group-hover:text-[#00BA88] dark:text-white sm:text-base">
                    {page.title}
                  </span>

                  <span className="text-sm font-medium leading-6 text-slate-500 dark:text-slate-400">
                    {page.description}
                  </span>

                  <ArrowRight className="hidden h-4 w-4 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[#00BA88] dark:text-slate-700 sm:block" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
