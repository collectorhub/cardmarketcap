"use client";

import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowUpRight,
} from "lucide-react";

import type {
  AdvertRecord,
} from "@/lib/queries/admin/adverts";

function advertKey(
  advert: AdvertRecord,
  index: number
) {
  return `${advert.provider}-${advert.id}-${index}`;
}

export default function RotatingAdvert({
  adverts,
  interval = 10000,
  className = "",
}: {
  adverts: AdvertRecord[];
  interval?: number;
  className?: string;
}) {
  const reduceMotion =
    useReducedMotion();

  const validAdverts = useMemo(
    () =>
      (
        Array.isArray(adverts)
          ? adverts
          : []
      ).filter((advert) => {
        const targetUrl =
          advert.targetUrl ||
          advert.target_url;

        return Boolean(
          advert?.id &&
          advert?.title &&
          targetUrl
        );
      }),
    [adverts]
  );

  const [index, setIndex] =
    useState(0);

  const [paused, setPaused] =
    useState(false);

  useEffect(() => {
    setIndex(0);
  }, [validAdverts]);

  useEffect(() => {
    if (
      validAdverts.length <= 1 ||
      paused
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          setIndex(
            (current) =>
              (current + 1) %
              validAdverts.length
          );
        }
      }, Math.max(5000, interval));

    return () =>
      window.clearInterval(timer);
  }, [
    interval,
    paused,
    validAdverts.length,
  ]);

  if (!validAdverts.length) {
    return null;
  }

  const safeIndex =
    index % validAdverts.length;

  const advert =
    validAdverts[safeIndex];

  const imageUrl =
    advert.imageUrl ||
    advert.image_url ||
    "";

  const targetUrl =
    advert.targetUrl ||
    advert.target_url ||
    "#";

  const ctaLabel =
    advert.ctaLabel ||
    advert.cta_label ||
    "Learn More";

  return (
    <div
      className={className}
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      onFocusCapture={() =>
        setPaused(true)
      }
      onBlurCapture={() =>
        setPaused(false)
      }
    >
      <AnimatePresence mode="wait">
        <motion.a
          key={advertKey(
            advert,
            safeIndex
          )}
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 7,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={
            reduceMotion
              ? undefined
              : {
                  opacity: 0,
                  y: -7,
                }
          }
          transition={{
            duration: 0.24,
            ease: "easeOut",
          }}
          className="group relative block overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
        >
          {imageUrl ? (
            <div className="relative overflow-hidden bg-slate-100 dark:bg-slate-950">
              <img
                src={imageUrl}
                alt={advert.title}
                loading="lazy"
                decoding="async"
                className="h-auto max-h-[260px] w-full object-contain transition-transform duration-500 group-hover:scale-[1.012]"
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-400">
                  {advert.disclosure ||
                    (advert.provider ===
                    "internal"
                      ? "Promotion"
                      : "Sponsored")}
                </span>

                {advert.provider !==
                "internal" ? (
                  <span className="text-[9px] font-black uppercase tracking-[0.15em] text-[#00BA88]">
                    {advert.provider}
                  </span>
                ) : null}
              </div>

              <h3 className="truncate text-sm font-black tracking-tight text-slate-950 dark:text-white">
                {advert.title}
              </h3>

              {advert.subtitle ? (
                <p className="mt-0.5 truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {advert.subtitle}
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-[9px] font-black uppercase tracking-wider text-slate-400 sm:block">
                {ctaLabel}
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors group-hover:border-[#00BA88] group-hover:bg-[#00BA88] group-hover:text-white dark:border-slate-700 dark:text-slate-300">
                <ArrowUpRight
                  size={15}
                />
              </span>
            </div>
          </div>
        </motion.a>
      </AnimatePresence>

      {validAdverts.length > 1 ? (
        <div className="mt-2 flex justify-center gap-1.5">
          {validAdverts.map(
            (item, itemIndex) => (
              <button
                key={advertKey(
                  item,
                  itemIndex
                )}
                type="button"
                onClick={() =>
                  setIndex(itemIndex)
                }
                aria-label={`Show advert ${itemIndex + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  itemIndex ===
                  safeIndex
                    ? "w-5 bg-[#00BA88]"
                    : "w-1.5 bg-slate-300 dark:bg-slate-700"
                }`}
              />
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
