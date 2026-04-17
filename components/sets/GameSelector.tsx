"use client";

import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const GAMES = [
  { name: "Pokémon", logo: "https://tcg.pokemon.com/assets/img/global/logos/pokemon-tcg-logo.png", bgImage: "https://images.scrydex.com/pokemon/base1-4/large", active: true, count: "42,810 Assets" },
  { name: "Yu-Gi-Oh!", logo: "https://upload.wikimedia.org/wikipedia/commons/2/22/Yu-Gi-Oh%21_TCG_logo.png", bgImage: "https://images.scrydex.com/pokemon/base1-2/large", active: false, count: "12,402 Assets" },
  { name: "One Piece", logo: "https://en.onepiece-cardgame.com/images/common/logo.png", bgImage: "https://images.scrydex.com/pokemon/base1-15/large", active: false, count: "3,120 Assets" },
  { name: "Lorcana", logo: "https://www.disneylorcana.com/static/media/logo.8e5a7e93.png", bgImage: "https://images.scrydex.com/pokemon/sm12-241/large", active: false, count: "1,845 Assets" },
  { name: "Magic: The Gathering", logo: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Magicthegathering-logo.svg", bgImage: "https://images.scrydex.com/pokemon/swsh4-185/large", active: false, count: "55,201 Assets" },
  { name: "Digimon", logo: "https://world.digimoncard.com/images/common/logo.png", bgImage: "https://images.scrydex.com/pokemon/base1-1/large", active: false, count: "2,105 Assets" },
  { name: "Dragon Ball Super", logo: "https://www.dbs-cardgame.com/images/common/logo.png", bgImage: "https://images.scrydex.com/pokemon/xy12-106/large", active: false, count: "4,320 Assets" },
];

export function GameSelector() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      // Using a threshold of 10px to account for slight sub-pixel rendering
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.7;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // The Mask logic: ensures the "cut-off" feels soft and professional
  const getMaskImage = () => {
    const fadeStart = canScrollLeft ? "rgba(0,0,0,0) 0%, rgba(0,0,0,1) 5%" : "rgba(0,0,0,1) 0%";
    const fadeEnd = canScrollRight ? "rgba(0,0,0,1) 95%, rgba(0,0,0,0) 100%" : "rgba(0,0,0,1) 100%";
    return `linear-gradient(to right, ${fadeStart}, ${fadeEnd})`;
  };

  return (
    <section className="relative mb-16 group/selector">
      {/* Navigation Arrows - Fixed for Desktop Hover */}
      <button
        onClick={() => scroll("left")}
        className={`absolute -left-5 top-1/2 -translate-y-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 hover:text-[#00BA88] transition-all hidden lg:flex ${
          !canScrollLeft ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/selector:opacity-100"
        }`}
      >
        <ChevronLeft size={20} strokeWidth={3} />
      </button>

      <button
        onClick={() => scroll("right")}
        className={`absolute -right-5 top-1/2 -translate-y-1/2 z-30 h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-slate-600 hover:text-[#00BA88] transition-all hidden lg:flex ${
          !canScrollRight ? "opacity-0 pointer-events-none" : "opacity-0 group-hover/selector:opacity-100"
        }`}
      >
        <ChevronRight size={20} strokeWidth={3} />
      </button>

      {/* Container with restored mobile width & Gradient Mask */}
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        style={{ WebkitMaskImage: getMaskImage(), maskImage: getMaskImage() }}
        className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {GAMES.map((game) => (
          <button
            key={game.name}
            className={`
              group relative flex-shrink-0 rounded-xl md:rounded-3xl overflow-hidden border transition-all snap-start
              /* Mobile Fix: 30% width means 3 full cards (30x3 = 90%) 
                 plus a 10% peek of the 4th card.
              */
              w-[30%] md:w-[22%] lg:w-[18.5%] 
              h-32 md:h-40
              ${game.active ? "border-[#00BA88] ring-4 ring-[#00BA88]/10" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"}
            `}
          >
            <div className="absolute inset-0 z-0">
              <img
                src={game.bgImage}
                alt=""
                className="w-full h-full object-cover opacity-10 grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 dark:from-slate-950 dark:via-slate-950/90" />
            </div>
            
            <div className="relative z-10 p-3 md:p-6 h-full flex flex-col justify-between items-start">
              <img
                src={game.logo}
                alt={game.name}
                className={`h-6 md:h-10 object-contain ${!game.active && "grayscale opacity-50 group-hover:opacity-100 group-hover:grayscale-0"} transition-all`}
              />
              <div className="text-left">
                <p className="text-[7px] md:text-[10px] font-black text-[#00BA88] uppercase tracking-widest whitespace-nowrap">
                  {game.count}
                </p>
              </div>
            </div>
          </button>
        ))}
        {/* Buffer to ensure the last card doesn't get hidden by the mask end */}
        <div className="flex-shrink-0 w-4 h-1" />
      </div>
    </section>
  );
}