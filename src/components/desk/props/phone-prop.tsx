"use client";

import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import { Smartphone, Wifi, BatteryMedium, Cpu } from "lucide-react";

interface PhonePropProps {
  onSelect: () => void;
}

export function PhoneProp({ onSelect }: PhonePropProps) {
  return (
    <div className="relative group cursor-pointer select-none font-mono">
      {/* Wireframe Phone Stand Base */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-20 h-4 border-b-2 border-x border-[#00ff66]/40 rounded-b-[4px] bg-[#00ff66]/5 pointer-events-none" />

      {/* Phone Body */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: 3 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          sound.playNodePulse();
          onSelect();
        }}
        className="w-[125px] sm:w-[135px] h-[210px] sm:h-[225px] bg-[#000803] border-2 border-[#00ff66] rounded-[16px] p-2 shadow-[0_0_20px_rgba(0,255,102,0.25),inset_0_0_12px_rgba(0,255,102,0.08)] relative overflow-hidden flex flex-col justify-between transition-shadow group-hover:shadow-[0_0_35px_rgba(0,255,102,0.5)] rotate-[4deg]"
      >
        {/* CRT Scanline Bars */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40 z-10" />

        {/* Dynamic Island / Speaker Notch */}
        <div className="w-8 h-1.5 mx-auto bg-black border border-[#00ff66]/40 rounded-full relative z-20" />

        {/* Phone Top Status Bar */}
        <div className="relative z-20 flex items-center justify-between text-[7px] text-[#00ff66] px-0.5 border-b border-[#00ff66]/20 pb-1">
          <span className="font-bold">19:00</span>
          <div className="flex items-center gap-1">
            <Wifi className="w-2.5 h-2.5" />
            <BatteryMedium className="w-2.5 h-2.5" />
          </div>
        </div>

        {/* App Content Preview */}
        <div className="relative z-20 space-y-1.5 text-[8px] text-[#00ff66]">
          {/* App Header */}
          <div className="text-center font-bold border border-[#00ff66]/30 bg-[#00ff66]/10 rounded-[3px] py-0.5 text-[7.5px]">
            KTCC TOURNAMENT APP
          </div>

          {/* Mini Match Ticker */}
          <div className="space-y-1 text-[7px]">
            <div className="flex justify-between border-b border-[#00ff66]/15 pb-0.5">
              <span>#1 APEX TOURING</span>
              <span className="font-bold">1,420 PTS</span>
            </div>
            <div className="flex justify-between border-b border-[#00ff66]/15 pb-0.5">
              <span>#2 MALABAR DRIFT</span>
              <span className="font-bold">1,280 PTS</span>
            </div>
            <div className="flex justify-between border-b border-[#00ff66]/15 pb-0.5">
              <span>#3 KOLLAM RIDERS</span>
              <span className="font-bold">1,110 PTS</span>
            </div>
          </div>

          {/* Telemetry Status */}
          <div className="text-[6.5px] text-[#00ff66]/70 text-center">
            [ ACID LEDGER: SYNCED ]
          </div>
        </div>

        {/* Phone Footer */}
        <div className="relative z-20 border-t border-[#00ff66]/30 pt-1 text-center text-[7.5px] font-bold text-[#00ff66] group-hover:underline">
          [ 📱 TAP TO INSPECT ]
        </div>
      </motion.div>
    </div>
  );
}
