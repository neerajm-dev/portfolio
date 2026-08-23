"use client";

import { MatrixAvatar } from "@/components/ui/matrix-avatar";
import { DecodeText } from "@/components/ui/decode-text";
import { sound } from "@/lib/sound";
import { Terminal, Layers, Database, Cloud, Mail, Zap, ShieldCheck } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/constants";

interface IslandCoreProps {
  onWarpTo: (target: string) => void;
}

export function IslandCore({ onWarpTo }: IslandCoreProps) {
  return (
    <div className="w-[360px] sm:w-[420px] rounded-3xl border border-[#00f0ff]/40 bg-[#080b10]/95 p-6 shadow-2xl backdrop-blur-2xl text-center relative overflow-hidden group">
      {/* Top Status Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-5 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-gray-400">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-[#10b981] font-bold">CORE MONOLITH</span>
        </div>
        <div className="text-gray-500 font-mono">[SECTOR: 0x00]</div>
      </div>

      {/* Center Avatar with Live Glitch FX */}
      <div className="mb-5 flex justify-center">
        <MatrixAvatar size={110} />
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-black text-white font-sans uppercase tracking-tight">
        <span>NEERAJ M</span>
      </h1>
      <div className="text-[#00f0ff] font-mono text-xs font-bold tracking-wider mt-0.5">
        // SOLO SYSTEMS ARCHITECT & FULL-STACK ENGINEER
      </div>

      {/* Description */}
      <p className="text-gray-300 text-xs mt-3 leading-relaxed font-mono">
        <DecodeText text={`${DEVELOPER_PROFILE.age}yo Systems Builder • BCA @ SNCT • Full-Stack Android & Cloud Platforms • $0 Infrastructure Architect.`} speed={18} />
      </p>

      {/* Quick Navigation Warps */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="text-[10px] font-mono text-gray-500 font-bold uppercase mb-2.5">
          WARP TO ACTIVE NODES:
        </div>
        <div className="grid grid-cols-2 gap-2 font-mono text-xs">
          <button
            onClick={() => onWarpTo("ktcc")}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#00f0ff]/15 border border-white/10 hover:border-[#00f0ff]/40 text-gray-300 hover:text-[#00f0ff] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>[ 01 // KTCC ]</span>
          </button>

          <button
            onClick={() => onWarpTo("cli")}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#10b981]/15 border border-white/10 hover:border-[#10b981]/40 text-gray-300 hover:text-[#10b981] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
            <span>[ 02 // CLI ]</span>
          </button>

          <button
            onClick={() => onWarpTo("lab")}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#f59e0b]/15 border border-white/10 hover:border-[#f59e0b]/40 text-gray-300 hover:text-[#f59e0b] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Database className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>[ 03 // LAB ]</span>
          </button>

          <button
            onClick={() => onWarpTo("infra")}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-xl bg-white/[0.03] hover:bg-[#818cf8]/15 border border-white/10 hover:border-[#818cf8]/40 text-gray-300 hover:text-[#818cf8] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <Cloud className="w-3.5 h-3.5 text-[#818cf8]" />
            <span>[ 04 // INFRA ]</span>
          </button>
        </div>
      </div>
    </div>
  );
}
