"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { TrendingUp } from "lucide-react";
import Link from "next/link";

interface AssetCardProps {
  asset: {
    id: string;
    name: string;
    number?: string;
    printed_number?: string;
    price?: string;
    floorPrice?: string;
    imageUrl?: string;
    small_image?: string;
    canonicalUrl?: string;
    card_slug?: string;
    type?: string;
    rarity?: string;
    game?: string;
  };
}

function OverflowMarquee({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const viewportRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const contentRef =
    useRef<HTMLSpanElement | null>(
      null
    );

  const [
    shouldAnimate,
    setShouldAnimate,
  ] = useState(false);

  const [
    duration,
    setDuration,
  ] = useState(7);

  useEffect(() => {
    const viewport =
      viewportRef.current;

    const content =
      contentRef.current;

    if (!viewport || !content) {
      return;
    }

    const measure = () => {
      const overflow =
        content.scrollWidth -
        viewport.clientWidth;

      const animate =
        overflow > 4;

      setShouldAnimate(animate);

      if (animate) {
        const distance =
          content.scrollWidth +
          22;

        setDuration(
          Math.max(
            5,
            distance / 28
          )
        );
      }
    };

    measure();

    const observer =
      new ResizeObserver(
        measure
      );

    observer.observe(viewport);
    observer.observe(content);

    return () =>
      observer.disconnect();
  }, [text]);

  return (
    <span
      ref={viewportRef}
      title={text}
      className={`group/rarity-marquee relative block min-w-0 overflow-hidden whitespace-nowrap ${className}`}
    >
      <span
        ref={contentRef}
        className={
          shouldAnimate
            ? "inline-flex min-w-max items-center will-change-transform group-hover/rarity-marquee:[animation-play-state:paused]"
            : "inline-flex min-w-max items-center"
        }
        style={
          shouldAnimate
            ? {
                animation:
                  `asset-card-rarity-marquee ${duration}s linear infinite`,
              }
            : undefined
        }
      >
        <span>{text}</span>

        {shouldAnimate ? (
          <>
            <span
              aria-hidden="true"
              className="mx-3 opacity-40"
            >
              •
            </span>

            <span aria-hidden="true">
              {text}
            </span>
          </>
        ) : null}
      </span>

      <style jsx>{`
        @keyframes asset-card-rarity-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(
              calc(-50% - 6px)
            );
          }
        }

        @media (
          prefers-reduced-motion:
            reduce
        ) {
          span[style*="asset-card-rarity-marquee"] {
            animation: none !important;
          }
        }
      `}</style>
    </span>
  );
}

export function AssetCard({
  asset,
}: AssetCardProps) {
  const gameValue =
    asset.game || "pokemon";

  const gameQuery =
    `?game=${gameValue}`;

  const cardId =
    asset.id ||
    asset.card_slug ||
    "";

  const rawPath =
    asset.canonicalUrl &&
    asset.canonicalUrl.trim() !== ""
      ? asset.canonicalUrl
      : `/${cardId}`;

  let baseUrl =
    rawPath;

  if (
    !baseUrl.startsWith(
      "/card"
    )
  ) {
    baseUrl =
      `/card${
        baseUrl.startsWith("/")
          ? ""
          : "/"
      }${baseUrl}`;
  }

  const detailHref =
    `${baseUrl}${gameQuery}`;

  const activeImage =
    asset.imageUrl ||
    asset.small_image ||
    "https://pokecollectorhub.com/assets/placeholder.png";

  const displayNum =
    asset.number ||
    asset.printed_number ||
    "000";

  const displayPrice =
    asset.price ||
    asset.floorPrice ||
    "";

  const rarityText =
    asset.rarity ||
    asset.type ||
    "Standard";

  const getRarityColor = (
    rarity: string = ""
  ) => {
    const normalized =
      rarity.toLowerCase();

    if (
      normalized.includes(
        "enchanted"
      ) ||
      normalized.includes(
        "secret"
      ) ||
      normalized.includes(
        "illustration"
      )
    ) {
      return "text-purple-500 dark:text-purple-400";
    }

    if (
      normalized.includes(
        "super"
      ) ||
      normalized.includes(
        "legendary"
      ) ||
      normalized.includes(
        "holo"
      )
    ) {
      return "text-orange-500 dark:text-orange-400";
    }

    if (
      normalized.includes(
        "rare"
      )
    ) {
      return "text-emerald-500 dark:text-emerald-400";
    }

    return "text-slate-400 dark:text-slate-500";
  };

  return (
    <Link
      href={detailHref}
      className="group block"
    >
      <div className="flex h-full flex-col rounded-[1.5rem] border border-slate-200 bg-white p-3 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#00BA88]/10 active:scale-[0.98] dark:border-white/5 dark:bg-slate-900 md:rounded-[2rem] md:p-5">
        <div className="relative mb-4 flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-xl bg-slate-50 p-2 dark:bg-slate-950/20 md:mb-6">
          <img
            src={activeImage}
            alt={
              asset.name ||
              "TCG Card"
            }
            className="max-h-full max-w-full object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src =
                "https://pokecollectorhub.com/assets/placeholder.png";
            }}
          />
        </div>

        <div className="flex flex-1 flex-col justify-between space-y-3">
          <div className="min-w-0">
            <h4 className="line-clamp-1 text-[12px] font-black tracking-tight text-slate-900 transition-colors group-hover:text-[#00BA88] dark:text-white md:text-[14px]">
              {asset.name ||
                "Unnamed Card"}
            </h4>

            <div className="mt-0.5 flex min-w-0 items-center gap-1 text-[10px] font-bold uppercase tracking-tight md:gap-1.5 md:text-[11px]">
              <span className="shrink-0 text-slate-400">
                #{displayNum}
              </span>

              <span className="shrink-0 text-slate-300 dark:text-slate-700">
                •
              </span>

              <OverflowMarquee
                text={rarityText}
                className={`min-w-0 flex-1 ${getRarityColor(
                  rarityText
                )}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-2.5 dark:border-white/5 md:pt-3">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 md:text-[9px]">
                Market Price
              </span>

              <span className="text-[12px] font-black leading-tight tabular-nums text-slate-900 dark:text-white md:text-base">
                {displayPrice &&
                displayPrice !==
                  "$0.00"
                  ? displayPrice
                  : "—"}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-emerald-500 md:gap-1 md:rounded-lg md:px-2 md:py-1">
              <TrendingUp
                size={11}
                className="stroke-[3]"
              />

              <span className="text-[8px] font-black uppercase md:text-[10px]">
                Live
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
