import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      "We recognise that market intelligence is never complete, so the Platform continues to evolve alongside the collecting community.",
  },
];

const PLATFORM_FEATURES = [
  "Market prices",
  "Historical sales",
  "Grading information",
  "Catalogue data",
  "Market analytics",
  "Research tools",
];

const RELATED_PAGES = [
  {
    title: "Data Sources & Methodology",
    href: "/data-sources-methodology",
  },
  {
    title: "Data Corrections",
    href: "/data-corrections",
  },
  {
    title: "Terms of Use",
    href: "/terms-of-use",
  },
  {
    title: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    title: "Disclaimer",
    href: "/disclaimer",
  },
  {
    title: "Trust Centre",
    href: "/trust-centre",
  },
];

export default function AboutUs() {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(circle_at_top,rgba(0,186,136,0.09),transparent_70%)] sm:h-[560px]"
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-4 pb-8 pt-24 sm:px-5 sm:pt-28 md:px-8 md:pb-14 md:pt-32">
        {/* Hero */}
        <section className="w-full border-b border-slate-200 pb-12 dark:border-slate-800 sm:pb-14 md:pb-20">
          <div className="w-full">
            <nav className="mb-5 flex flex-wrap items-center gap-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#00BA88] sm:text-[10px]">
                Company
              </span>

              <span className="text-[9px] text-slate-300 dark:text-slate-700 sm:text-[10px]">
                /
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 sm:text-[10px]">
                About Us
              </span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-12">
              <div className="min-w-0">
                <h1 className="max-w-6xl text-[2.55rem] font-black leading-[1.04] tracking-[-0.04em] text-slate-950 dark:text-white sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.45rem]">
                  Building trusted market intelligence for{" "}
                  <span className="text-[#00BA88]">
                    trading cards.
                  </span>
                </h1>

                <p className="mt-6 max-w-4xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8 md:text-lg">
                  CardMarketCap brings market prices, historical sales,
                  grading information, catalogue data and analytics into one
                  transparent platform for the global collecting community.
                </p>
              </div>

              <div className="w-fit border-l-2 border-[#00BA88] pl-4 lg:mb-2 lg:min-w-[145px]">
                <p className="text-[9px] font-black uppercase tracking-[0.18em] text-slate-400 sm:text-[10px]">
                  Last updated
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                  July 9, 2026
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="grid w-full gap-7 border-b border-slate-200 py-12 dark:border-slate-800 sm:gap-9 sm:py-14 md:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
              Our Story
            </p>

            <h2 className="mt-3 max-w-xl text-[1.85rem] font-black leading-tight tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
              Collectors deserve better information.
            </h2>
          </div>

          <div className="max-w-4xl space-y-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
            <p>
              CardMarketCap, the “Platform”, is owned and operated by
              Lowbridge Media Ventures Ltd, referred to as “Lowbridge”, “we”,
              “our” or “us”.
            </p>

            <p>
              We created CardMarketCap because we believe collectors deserve
              better market information. The trading card hobby has grown
              into a global market, yet reliable data often remains
              fragmented across multiple marketplaces, grading companies and
              independent resources.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="w-full border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid gap-7 sm:gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Our Mission
              </p>
            </div>

            <div className="max-w-5xl">
              <p className="text-[1.6rem] font-black leading-[1.25] tracking-[-0.025em] text-slate-950 dark:text-white sm:text-3xl md:text-[2rem] md:leading-[1.3]">
                To build the world&apos;s most trusted market intelligence
                platform for trading cards and collectibles.
              </p>

              <p className="mt-5 max-w-4xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                We aim to provide collectors, retailers, investors,
                researchers and enthusiasts with transparent information
                that helps them better understand the market.
              </p>
            </div>
          </div>
        </section>

        {/* What we build */}
        <section className="w-full border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                What We Build
              </p>

              <h2 className="mt-3 text-[1.85rem] font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
                More than a price guide.
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                CardMarketCap brings together market prices, historical
                sales, grading information, catalogue data, analytics and
                research tools into a single experience designed to help
                users make informed decisions.
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800">
              {PLATFORM_FEATURES.map((feature, index) => (
                <div
                  key={feature}
                  className="grid grid-cols-[34px_1fr] items-center gap-3 border-b border-slate-200 py-4 dark:border-slate-800 sm:grid-cols-[45px_1fr] sm:py-5"
                >
                  <span className="text-[9px] font-black tracking-[0.18em] text-[#00BA88] sm:text-[10px]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="text-sm font-black text-slate-900 dark:text-white sm:text-base">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="w-full border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
              Our Principles
            </p>

            <h2 className="mt-3 text-[1.85rem] font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
              The standards behind everything we build.
            </h2>

            <p className="mt-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
              Everything we build is guided by transparency, accuracy,
              independence, consistency and continuous improvement.
            </p>
          </div>

          <div className="mt-9 sm:mt-10">
            {PRINCIPLES.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-3 border-t border-slate-200 py-6 first:border-t-0 first:pt-0 dark:border-slate-800 sm:grid-cols-[64px_190px_1fr] sm:gap-6 md:grid-cols-[80px_240px_1fr] md:py-7"
              >
                <span className="text-[10px] font-black tracking-[0.2em] text-[#00BA88]">
                  {principle.number}
                </span>

                <h3 className="text-base font-black text-slate-950 dark:text-white sm:text-lg">
                  {principle.title}
                </h3>

                <p className="max-w-4xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Independence and continuous improvement */}
        <section className="w-full border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            <article>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Independent by Design
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-slate-950 dark:text-white sm:text-3xl">
                Built without outside influence.
              </h2>

              <div className="mt-5 max-w-2xl space-y-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                <p>
                  Lowbridge develops the Platform independently. Our
                  methodologies, analytics and research are created without
                  influence from card manufacturers, grading companies,
                  marketplaces or advertisers.
                </p>

                <p>
                  Where third-party information is used, it is incorporated
                  to provide broader market context rather than to favour any
                  organisation.
                </p>
              </div>
            </article>

            <article className="border-t border-slate-200 pt-10 dark:border-slate-800 lg:border-l lg:border-t-0 lg:pl-20 lg:pt-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Continuous Improvement
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-slate-950 dark:text-white sm:text-3xl">
                A platform that keeps evolving.
              </h2>

              <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:text-base sm:leading-8">
                Building a comprehensive market intelligence platform is an
                ongoing process. We continually refine our catalogue,
                improve our matching systems, expand market coverage,
                enhance analytics and respond to feedback from the
                collecting community.
              </p>
            </article>
          </div>
        </section>

        {/* Community and future */}
        <section className="w-full border-b border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="overflow-hidden rounded-[1.5rem] bg-slate-950 sm:rounded-[1.75rem]">
            <div className="grid lg:grid-cols-2">
              <article className="p-6 sm:p-9 lg:p-12 xl:p-14">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                  Built with the Community
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-white sm:text-3xl">
                  Better information is built together.
                </h2>

                <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                  Constructive feedback from collectors, retailers and
                  researchers helps improve the Platform every day. We
                  welcome thoughtful suggestions and data corrections
                  because they help make CardMarketCap more accurate and
                  valuable for everyone.
                </p>

                <Link
                  href="/data-corrections"
                  className="group mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-black text-[#00BA88] transition-colors hover:text-[#00d69d]"
                >
                  Submit a data correction

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </article>

              <article className="border-t border-slate-800 bg-slate-900/80 p-6 sm:p-9 lg:border-l lg:border-t-0 lg:p-12 xl:p-14">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                  Looking Ahead
                </p>

                <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-white sm:text-3xl">
                  Intelligence beyond prices.
                </h2>

                <p className="mt-5 max-w-2xl text-[15px] font-medium leading-7 text-slate-300 sm:text-base sm:leading-8">
                  Our ambition extends beyond displaying prices. As
                  CardMarketCap evolves, Lowbridge intends to continue
                  investing in richer market intelligence, transparency,
                  research tools and analytical features that help users
                  better understand the trading card market.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Thank you */}
        <section className="mx-auto max-w-4xl py-14 text-left sm:py-16 sm:text-center md:py-24">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
            Thank You
          </p>

          <h2 className="mt-3 text-[1.85rem] font-black tracking-[-0.03em] text-slate-950 dark:text-white sm:text-3xl md:text-4xl">
            Thank you for being part of CardMarketCap.
          </h2>

          <p className="mt-5 text-[15px] font-medium leading-7 text-slate-600 dark:text-slate-400 sm:mx-auto sm:mt-6 sm:max-w-3xl sm:text-base sm:leading-8">
            Whether you visit the Platform occasionally or rely on it every
            day, thank you for being part of the CardMarketCap community. We
            appreciate your trust and remain committed to earning it through
            the quality of our work.
          </p>
        </section>

        {/* Related pages */}
        <section className="w-full border-t border-slate-200 py-12 dark:border-slate-800 sm:py-14 md:py-20">
          <div className="grid gap-9 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00BA88]">
                Related Pages
              </p>

              <h2 className="mt-3 text-2xl font-black tracking-[-0.025em] text-slate-950 dark:text-white sm:text-3xl">
                Trust Centre documents
              </h2>

              <p className="mt-4 max-w-2xl text-sm font-medium leading-7 text-slate-600 dark:text-slate-400">
                This page should be read alongside the policies,
                methodologies and disclosures that explain how CardMarketCap
                operates.
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800">
              {RELATED_PAGES.map((page) => (
                <Link
                  key={page.title}
                  href={page.href}
                  className="group flex min-h-16 items-center justify-between gap-4 border-b border-slate-200 py-4 dark:border-slate-800 sm:min-h-[72px] sm:py-5"
                >
                  <span className="pr-3 text-sm font-black text-slate-900 transition-colors group-hover:text-[#00BA88] dark:text-white sm:text-base">
                    {page.title}
                  </span>

                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#00BA88]" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}