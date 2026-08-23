"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";

interface CoffeeMugPropProps {
  onSelect?: () => void;
}

export function CoffeeMugProp({ onSelect }: CoffeeMugPropProps) {
  const [level, setLevel] = useState(100);

  const handleClick = () => {
    sound.playClick(1.4);
    setLevel((prev) => {
      if (prev > 65) return 65;
      if (prev > 35) return 35;
      if (prev > 12) return 12;

      // 0% Reached -> Trigger auto modal popup
      sound.playSuccess();
      setTimeout(() => {
        onSelect?.();
      }, 250);
      return 0;
    });
  };

  return (
    <div
      onClick={handleClick}
      className="flex flex-col items-center cursor-pointer select-none font-mono group"
      title={level === 0 ? "Cup empty! Click to open refill sponsor modal" : `Caffeine fuel: ${level}%. Click to sip`}
    >
      {/* Animated Rising Steam */}
      <div className="flex gap-1 text-[8px] text-[#00ff66]/70 leading-none h-4 items-end overflow-hidden mb-0.5">
        <span className="animate-pulse">~</span>
        <span className="animate-bounce">~</span>
        <span className="animate-pulse">~</span>
      </div>

      {/* Mug Body */}
      <div className="relative">
        <div className="w-9 sm:w-10 h-10 sm:h-11 bg-[#000803] border-2 border-[#00ff66] rounded-b-[6px] rounded-t-[1px] p-1 flex flex-col justify-between shadow-[0_0_12px_rgba(0,255,102,0.25)] transition-all group-hover:shadow-[0_0_20px_rgba(0,255,102,0.5)]">
          <div className="text-[6px] text-center font-bold text-[#00ff66]/80 border-b border-[#00ff66]/30 pb-0.5">
            COFFEE
          </div>
          <div className="text-[6.5px] text-center font-bold text-[#00ff66]">
            {level}%
          </div>
        </div>

        {/* Mug Handle */}
        <div className="absolute top-2 -right-2.5 w-3 h-5 border-2 border-[#00ff66] rounded-r-[5px] border-l-0" />
      </div>

      {/* Coaster */}
      <div className="w-14 h-1.5 border border-[#00ff66]/40 rounded-full bg-[#00ff66]/10 mt-0.5" />
    </div>
  );
}
