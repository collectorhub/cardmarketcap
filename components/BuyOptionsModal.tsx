"use client";

import React, {
  useEffect,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import {
  ArrowUpRight,
  X,
} from "lucide-react";

import {
  getCardPurchaseLinks,
  PurchaseLink,
} from "@/lib/affiliate-links";

const PLACEHOLDER_IMAGE =
  "https://pokecollectorhub.com/assets/placeholder.png";

const marketplaceMeta: Record<
  PurchaseLink["marketplace"],
  {
    name: string;
    supportingText: string;
  }
> = {
  ebay: {
    name: "eBay",
    supportingText:
      "Live listings and auctions",
  },
  tcgplayer: {
    name: "TCGplayer",
    supportingText:
      "Singles and marketplace offers",
  },
};

const EbayWordmark = () => (
  <span
    aria-label="eBay"
    className="inline-flex items-baseline text-[22px] font-black leading-none tracking-[-0.09em]"
  >
    <span className="text-[#E53238]">e</span>
    <span className="text-[#0064D2]">b</span>
    <span className="text-[#F5AF02]">a</span>
    <span className="text-[#86B817]">y</span>
  </span>
);

const TcgplayerWordmark = () => (
  <span className="inline-flex items-center gap-2">
    <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#1476D4] text-[9px] font-black tracking-tight text-white">
      TCG
    </span>

    <span className="text-[15px] font-black tracking-[-0.02em] text-slate-950 dark:text-white">
      TCGplayer
    </span>
  </span>
);

const MarketplaceWordmark = ({
  marketplace,
}: {
  marketplace: PurchaseLink["marketplace"];
}) =>
  marketplace === "ebay" ? (
    <EbayWordmark />
  ) : (
    <TcgplayerWordmark />
  );

export default function BuyOptionsModal({
  card,
  open,
  onClose,
  placement = "market_table",
}: {
  card: any | null;
  open: boolean;
  onClose: () => void;
  placement?: string;
}) {
  const links = useMemo(
    () =>
      card
        ? getCardPurchaseLinks(card, {
            placement,
            component: "buy_modal",
          })
        : [],
    [card, placement]
  );

  useEffect(() => {
    if (!open) return;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open, onClose]);

  if (
    typeof document === "undefined"
  ) {
    return null;
  }

  const cardName =
    card?.name || "Trading card";

  const cardSet =
    card?.set ||
    card?.set_name ||
    card?.expansion_name ||
    "";

  const cardNumber =
    card?.number ||
    card?.card_number ||
    card?.cardNumber ||
    "";

  const cardImage =
    card?.imageUrl ||
    card?.image ||
    PLACEHOLDER_IMAGE;

  return createPortal(
    <AnimatePresence>
      {open && card && (
        <motion.div
          className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center sm:p-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.button
            type="button"
            aria-label="Close purchase options"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.section
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-modal-title"
            onClick={(event) =>
              event.stopPropagation()
            }
            initial={{
              opacity: 0,
              y: 22,
              scale: 0.985,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 18,
              scale: 0.985,
            }}
            transition={{
              type: "spring",
              stiffness: 440,
              damping: 36,
            }}
            className="relative z-10 w-full overflow-hidden rounded-t-[28px] border border-slate-200/80 bg-white shadow-[0_28px_80px_rgba(15,23,42,0.24)] dark:border-slate-800 dark:bg-slate-950 sm:max-w-[520px] sm:rounded-[28px]"
          >
            <div className="flex items-start justify-between gap-4 px-5 pb-4 pt-5 sm:px-6 sm:pt-6">
              <div className="flex min-w-0 items-center gap-3.5">
                <div className="h-[62px] w-[45px] shrink-0 overflow-hidden rounded-[9px] border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <img
                    src={cardImage}
                    alt={cardName}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src =
                        PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <p className="mb-1 text-[10px] font-black uppercase tracking-[0.16em] text-[#00BA88]">
                    Choose marketplace
                  </p>

                  <h2
                    id="purchase-modal-title"
                    className="truncate text-[18px] font-black leading-tight tracking-[-0.025em] text-slate-950 dark:text-white sm:text-[20px]"
                  >
                    {cardName}
                  </h2>

                  {(cardSet ||
                    cardNumber) && (
                    <p className="mt-1 truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {cardSet}
                      {cardSet &&
                      cardNumber
                        ? " · "
                        : ""}
                      {cardNumber
                        ? `#${cardNumber}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:border-slate-800 dark:hover:bg-slate-900 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-2.5 px-5 pb-5 sm:px-6 sm:pb-6">
              {links.length > 0 ? (
                links.map((link) => {
                  const meta =
                    marketplaceMeta[
                      link.marketplace
                    ];

                  return (
                    <a
                      key={
                        link.marketplace
                      }
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={onClose}
                      className="group flex w-full items-center justify-between gap-4 rounded-[18px] border border-slate-200 bg-white px-4 py-3.5 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-900/80"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-11 min-w-[58px] shrink-0 items-center justify-center rounded-[13px] bg-slate-50 px-2.5 dark:bg-slate-950">
                          <MarketplaceWordmark
                            marketplace={
                              link.marketplace
                            }
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-[13px] font-black text-slate-950 dark:text-white">
                            {meta.name}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] font-semibold text-slate-400">
                            {
                              meta.supportingText
                            }
                          </p>
                        </div>
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all group-hover:border-[#00BA88] group-hover:bg-[#00BA88] group-hover:text-white dark:border-slate-700 dark:text-slate-300">
                        <ArrowUpRight
                          size={15}
                          strokeWidth={2.3}
                        />
                      </span>
                    </a>
                  );
                })
              ) : (
                <div className="rounded-[18px] border border-dashed border-slate-200 px-4 py-9 text-center dark:border-slate-800">
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200">
                    Purchase options unavailable
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-slate-400">
                    Please try again shortly.
                  </p>
                </div>
              )}

              <p className="px-1 pt-1 text-center text-[9px] font-medium leading-relaxed text-slate-400">
                External marketplace pricing and availability may change. CardMarketCap may earn a commission from qualifying purchases.
              </p>
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
