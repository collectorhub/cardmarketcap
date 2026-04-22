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
      name: "Lorcana", 
      slug: "lorcana", 
      logo: "https://wiki.mushureport.com/images/thumb/5/57/Disney_Lorcana_TCG_Logo_transparent.png/640px-Disney_Lorcana_TCG_Logo_transparent.png", 
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
      name: "One Piece", 
      slug: "onepiece", 
      logo: "https://www.toei-animation.com/wp-content/uploads/2025/01/OP-card.webp", 
      bgImage: "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-001.png",
      count: `${formatNum(realCounts?.onepiece)} Sets` 
    },
    
    { 
      name: "Yu-Gi-Oh!", 
      slug: "yugioh", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Yu-Gi-Oh%21_TCG_logo.png", 
      bgImage: "https://ms.yugipedia.com//thumb/5/5a/DarkMagician-LOB-EN.png/300px-DarkMagician-LOB-EN.png",
      count: "12,402 Sets" 
    },
    { 
      name: "Dragon Ball", 
      slug: "dragonball", 
      logo: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Dragon_Ball_Super_Card_Game_logo.png", 
      bgImage: "https://en.dragon-ball-official.com/assets/img/cardgame/cardlist/card/BT1-001.png",
      count: "2,300 Sets" 
    }
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

  return (
    <section className="relative mb-8 md:mb-16 group/selector">
      {/* Desktop Navigation */}
      <button 
        onClick={() => scroll("left")} 
        className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 hover:text-[#00BA88] transition-all hidden lg:flex ${!canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/selector:opacity-100"}`}
      >
        <ChevronLeft size={22} strokeWidth={3} />
      </button>

      <button 
        onClick={() => scroll("right")} 
        className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 h-11 w-11 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 hover:text-[#00BA88] transition-all hidden lg:flex ${!canScrollRight ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/selector:opacity-100"}`}
      >
        <ChevronRight size={22} strokeWidth={3} />
      </button>

      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth p-2 -mx-2"
      >
        {GAMES.map((game) => {
          const isActive = currentGame === game.slug;
          return (
            <Link
              key={game.slug}
              href={`?game=${game.slug}&lang=${currentLang}`}
              className={`
                group relative flex-shrink-0 rounded-2xl md:rounded-[2.5rem] overflow-hidden border transition-all duration-300 snap-start
                w-[33%] md:w-[24%] lg:w-[19%] h-32 md:h-52
                ${isActive 
                  ? "border-[#00BA88] ring-[6px] ring-[#00BA88]/10 bg-white shadow-2xl shadow-[#00BA88]/10" 
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#00BA88]/50 hover:shadow-lg hover:-translate-y-1"
                }
              `}
            >
              {/* Subtle Background Art */}
              <div className="absolute inset-0 z-0">
                <img
                  src={game.bgImage}
                  alt=""
                  className="w-full h-full object-cover opacity-[0.03] grayscale group-hover:grayscale-0 group-hover:opacity-10 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/80 dark:to-slate-950/80" />
              </div>
              
              <div className="relative z-10 p-4 md:p-8 h-full flex flex-col items-center justify-center gap-3">
                {/* Logo - Centered and Scaled */}
                <div className="flex-1 flex items-center justify-center w-full">
                  <img
                    src={game.logo}
                    alt={game.name}
                    className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
                  />
                </div>
                
                {/* Count Badge */}
                <div className="text-center">
                  <span className={`
                    text-[7px] md:text-[12px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-full
                    ${isActive ? "bg-[#00BA88] text-white" : "bg-slate-100 dark:bg-slate-800 text-[#00BA88]"}
                  `}>
                    {game.count}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}