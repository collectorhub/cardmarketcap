"use client";

import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

interface GameSelectorProps {
  currentGame: string;
  currentLang: string;
  realCounts: { 
    pokemon: number; 
    mtg: number; 
    lorcana: number; 
    onepiece: number 
  };
}

export function GameSelector({ currentGame, currentLang, realCounts }: GameSelectorProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const formatNum = (num: number) => new Intl.NumberFormat().format(num);

  const GAMES = useMemo(() => [
    { 
      name: "Pokémon", 
      slug: "pokemon", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/1/1a/Pokémon_Trading_Card_Game_logo.svg", 
      bgImage: "https://images.pokemontcg.io/base1/4_hires.png",
      count: `${formatNum(realCounts?.pokemon)} Sets` 
    },
    { 
      name: "One Piece", 
      slug: "onepiece", 
      logo: "https://images.ctfassets.net/60ty0vllzbe7/2wI8iF098YvI0EclW6DkCH/005e55e04e902b7008101476d080345d/one-piece-card-game-logo.png", 
      bgImage: "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-001.png",
      count: `${formatNum(realCounts?.onepiece)} Sets` 
    },
    { 
      name: "Lorcana", 
      slug: "lorcana", 
      logo: "https://api.lorcana-api.com/images/logo.png", 
      bgImage: "https://lorcana-api.com/images/cards/1/12-EN-1.png",
      count: `${formatNum(realCounts?.lorcana)} Sets` 
    },
    { 
      name: "Magic", 
      slug: "mtg", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Magicthegathering-logo.svg", 
      bgImage: "https://cards.scryfall.io/large/front/5/4/541f1c6d.jpg",
      count: `${formatNum(realCounts?.mtg)} Sets` 
    },
  { 
    name: "Yu-Gi-Oh!", 
    slug: "yugioh", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Yu-Gi-Oh%21_TCG_logo.png", 
    bgImage: "https://ms.yugipedia.com//thumb/5/5a/DarkMagician-LOB-EN.png/300px-DarkMagician-LOB-EN.png",
    count: "12,402 Sets" 
  },
  // ✅ NEW GAMES
  { 
    name: "Dragon Ball", 
    slug: "dragonball", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Dragon_Ball_Super_Card_Game_logo.png", 
    bgImage: "https://en.dragon-ball-official.com/assets/img/cardgame/cardlist/card/BT1-001.png",
    count: "2,300 Sets" 
  },
  { 
    name: "Flesh & Blood", 
    slug: "fleshblood", 
    logo: "https://upload.wikimedia.org/wikipedia/en/0/0f/Flesh_and_Blood_TCG_logo.png", 
    bgImage: "https://fabdb2.imgix.net/cards/printings/WTR001.png",
    count: "1,100 Sets" 
  },
  { 
    name: "Digimon", 
    slug: "digimon", 
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/0b/Digimon_card_game_logo.png", 
    bgImage: "https://digimoncard.io/images/cards/BT1-084.jpg",
    count: "900 Sets" 
  },
  { 
    name: "Star Wars Unlimited", 
    slug: "starwars", 
    logo: "https://lumiere-a.akamaihd.net/v1/images/sw-logo_7f26a0c2.png", 
    bgImage: "https://cdn.starwarsunlimited.com/cards/card_1_EN_1.png",
    count: "600 Sets" 
  },
], [realCounts]);

  const checkScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.7;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getMaskImage = () => {
    const fadeStart = canScrollLeft ? "rgba(0,0,0,0) 0%, rgba(0,0,0,1) 8%" : "rgba(0,0,0,1) 0%";
    const fadeEnd = canScrollRight ? "rgba(0,0,0,1) 92%, rgba(0,0,0,0) 100%" : "rgba(0,0,0,1) 100%";
    return `linear-gradient(to right, ${fadeStart}, ${fadeEnd})`;
  };

  return (
    <section className="relative mb-8 md:mb-16 group/selector">
      {/* Desktop Navigation Buttons */}
      <button 
        onClick={() => scroll("left")} 
        className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 hover:text-[#00BA88] transition-all hidden lg:flex ${!canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/selector:opacity-100"}`}
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      <button 
        onClick={() => scroll("right")} 
        className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 hover:text-[#00BA88] transition-all hidden lg:flex ${!canScrollRight ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/selector:opacity-100"}`}
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={{ WebkitMaskImage: getMaskImage(), maskImage: getMaskImage() }}
        className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth p-1 -mx-1"
      >
        {GAMES.map((game) => {
          const isActive = currentGame === game.slug;
          return (
            <Link
              key={game.slug}
              href={`?game=${game.slug}&lang=${currentLang}`}
              className={`
                group relative flex-shrink-0 rounded-[1rem] md:rounded-3xl overflow-hidden border transition-all snap-start
                /* Mobile: ~28% width leaves room for the 4th card to "peek" */
                w-[29%] md:w-[22%] lg:w-[18.5%] h-28 md:h-44
                ${isActive ? "border-[#00BA88] ring-4 ring-[#00BA88]/10 bg-white" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"}
              `}
            >
              {/* Background Art */}
              <div className="absolute inset-0 z-0">
                <img
                  src={game.bgImage}
                  alt=""
                  className="w-full h-full object-cover opacity-[0.05] grayscale group-hover:grayscale-0 group-hover:opacity-15 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white dark:to-slate-950" />
              </div>
              
              <div className="relative z-10 p-3 md:p-6 h-full flex flex-col justify-between items-start">
                <img
                  src={game.logo}
                  alt={game.name}
                  className="h-6 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="text-left">
                  <p className="text-[8px] md:text-[11px] font-black text-[#00BA88] uppercase tracking-widest leading-none">
                    {game.count}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}