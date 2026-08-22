"use client";

import { motion } from "framer-motion";
import { sound } from "@/lib/sound";

interface StickyNotePropProps {
  onSelect: () => void;
}

export function StickyNoteProp({ onSelect }: StickyNotePropProps) {
  return (
    <div className="relative group cursor-pointer select-none font-mono">
      {/* Glow Pin at top */}
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#00ff66] shadow-[0_0_8px_rgba(0,255,102,0.8)] z-30 pointer-events-none" />

      {/* Sticky Note Body */}
      <motion.div
        whileHover={{ scale: 1.06, rotate: 2 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => {
          sound.playNodePulse();
          onSelect();
        }}
        className="w-[110px] sm:w-[125px] h-[105px] sm:h-[115px] bg-[#000803] border border-[#00ff66] p-2 rounded-[2px] shadow-[0_0_12px_rgba(0,255,102,0.2),inset_0_0_10px_rgba(0,255,102,0.06)] relative overflow-hidden flex flex-col justify-between rotate-[-3deg] transition-shadow group-hover:shadow-[0_0_25px_rgba(0,255,102,0.45)]"
      >
        {/* CRT Scanline */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40 z-10" />

        {/* Content */}
        <div className="relative z-20 space-y-0.5 text-[7.5px] sm:text-[8px] text-[#00ff66] leading-tight">
          <div className="font-bold border-b border-[#00ff66]/40 pb-0.5">// GOALS_2026</div>
          <div className="text-[#00ff66]/90">• 100% $0 Infra</div>
          <div className="text-[#00ff66]/90">• KTCC Live Prod</div>
          <div className="text-[#00ff66]/90">• Strict TS (0 any)</div>
          <div className="text-[#00ff66]/90">• Brotoraise Live</div>
        </div>

        <div className="relative z-20 text-[6.5px] text-[#00ff66]/60 text-right group-hover:underline">
          [ 📝 EXPAND ]
        </div>
      </motion.div>
    </div>
  );
}
