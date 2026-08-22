"use client";

import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import Image from "next/image";

interface IdCardPropProps {
  onSelect: () => void;
}

export function IdCardProp({ onSelect }: IdCardPropProps) {
  return (
    <div className="relative group cursor-pointer select-none font-mono">
      {/* Wireframe Lanyard Strap */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-4 h-12 flex flex-col items-center pointer-events-none">
        {/* Lanyard Cord */}
        <div className="w-[3px] h-9 bg-gradient-to-b from-[#00ff66]/10 to-[#00ff66]/70 border-x border-[#00ff66]/50" />
        {/* Lanyard Clip */}
        <div className="w-5 h-3 border border-[#00ff66] bg-black rounded-[2px] shadow-[0_0_6px_rgba(0,255,102,0.4)]" />
      </div>

      {/* The Physical Card Body Resting on Desk */}
      <motion.div
        whileHover={{ scale: 1.04, rotate: -4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          sound.playNodePulse();
          onSelect();
        }}
        className="w-[190px] sm:w-[210px] h-[125px] sm:h-[135px] bg-[#000803] border-2 border-[#00ff66] rounded-[6px] p-2 sm:p-2.5 shadow-[0_0_20px_rgba(0,255,102,0.25),inset_0_0_12px_rgba(0,255,102,0.08)] relative overflow-hidden flex flex-col justify-between transition-shadow group-hover:shadow-[0_0_35px_rgba(0,255,102,0.5)] rotate-[-6deg]"
      >
        {/* Scanlines & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none opacity-50 z-10" />

        {/* Card Header */}
        <div className="relative z-20 flex items-center justify-between border-b border-[#00ff66]/40 pb-1 text-[8px] sm:text-[8.5px] font-bold text-[#00ff66]">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span>0xNEERAJ // ID_CARD</span>
          </div>
          <span className="text-[#00ff66]/60">DEV_2026</span>
        </div>

        {/* Card Middle: Avatar + Quick Bio */}
        <div className="relative z-20 flex items-center gap-2 text-[8px] sm:text-[9px] text-[#00ff66]">
          <div className="w-10 h-10 border border-[#00ff66] bg-black rounded-[3px] p-0.5 shrink-0 flex items-center justify-center shadow-[0_0_8px_rgba(0,255,102,0.3)]">
            <Image
              src="/assets/pfp.jpg"
              alt="Neeraj Avatar"
              width={36}
              height={36}
              className="w-full h-full object-cover grayscale contrast-150 brightness-90 rounded-[2px]"
            />
          </div>
          <div className="space-y-0.5 font-bold leading-tight">
            <div className="text-[#00ff66]">NEERAJ M</div>
            <div className="text-[#00ff66]/80 text-[7.5px] sm:text-[8px]">SOLO ARCHITECT</div>
            <div className="text-[#00ff66]/60 text-[7px] sm:text-[7.5px]">SNCT KOLLAM</div>
          </div>
        </div>

        {/* Card Action Hint */}
        <div className="relative z-20 border-t border-[#00ff66]/30 pt-1 flex items-center justify-between text-[7.5px] sm:text-[8.5px] text-[#00ff66]">
          <span className="font-bold tracking-wider group-hover:underline">[ 🪪 CLICK TO INSPECT ]</span>
          <span className="text-[#00ff66]/50">3D // FLIP</span>
        </div>
      </motion.div>
    </div>
  );
}
