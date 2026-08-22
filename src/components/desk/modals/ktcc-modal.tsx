"use client";

import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import { X, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons";

interface KtccModalProps {
  onClose: () => void;
}

export function KtccModal({ onClose }: KtccModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[620px] bg-[#000803] border-2 border-[#00ff66] rounded-[10px] p-4 sm:p-6 font-mono text-[#00ff66] shadow-[0_0_50px_rgba(0,255,102,0.35),inset_0_0_30px_rgba(0,255,102,0.1)] relative overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CRT Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40 z-10" />

      {/* Header */}
      <div className="relative z-20 flex items-center justify-between border-b border-[#00ff66]/40 pb-2 mb-3">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
          <span>KTCC // FLAGSHIP TOURNAMENT PLATFORM</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="flex items-center gap-1 border border-[#00ff66] px-2 py-0.5 rounded-[4px] hover:bg-[#00ff66]/20 font-bold text-xs transition-all cursor-pointer shadow-[0_0_8px_rgba(0,255,102,0.2)]"
        >
          <X className="w-3.5 h-3.5" />
          <span>[ ESC ]</span>
        </button>
      </div>

      {/* Body Content */}
      <div className="relative z-20 space-y-3 text-xs sm:text-sm leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
        {/* Tagline */}
        <div className="text-[#00ff66]/80 border-l-2 border-[#00ff66] pl-2.5 py-0.5">
          Full-stack esports tournament automation platform for Car Parking Multiplayer. Engineered with immutable double-entry ledger accounting, automated CI/CD Android APK compilation via GitHub Actions, and zero-egress APAC CDN storage on Cloudflare R2.
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="border border-[#00ff66]/30 bg-black/60 p-2 rounded-[4px] text-center">
            <div className="text-[10px] text-[#00ff66]/60">INFRA COST</div>
            <div className="font-bold text-[#00ff66] text-xs sm:text-sm">$0.00/mo</div>
          </div>
          <div className="border border-[#00ff66]/30 bg-black/60 p-2 rounded-[4px] text-center">
            <div className="text-[10px] text-[#00ff66]/60">INTEGRITY</div>
            <div className="font-bold text-[#00ff66] text-xs sm:text-sm">Double-Entry</div>
          </div>
          <div className="border border-[#00ff66]/30 bg-black/60 p-2 rounded-[4px] text-center">
            <div className="text-[10px] text-[#00ff66]/60">APK BUILDS</div>
            <div className="font-bold text-[#00ff66] text-xs sm:text-sm">Headless CI/CD</div>
          </div>
          <div className="border border-[#00ff66]/30 bg-black/60 p-2 rounded-[4px] text-center">
            <div className="text-[10px] text-[#00ff66]/60">CDN EGRESS</div>
            <div className="font-bold text-[#00ff66] text-xs sm:text-sm">$0 Egress</div>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="border border-[#00ff66]/25 bg-black/40 rounded-[6px] p-3 space-y-1.5 text-xs text-[#00ff66]/90">
          <div className="font-bold text-[#00ff66] text-xs border-b border-[#00ff66]/20 pb-1">
            ARCHITECTURAL HIGHLIGHTS:
          </div>
          <div>• <span className="font-bold text-[#00ff66]">Immutable SQL Ledger:</span> Double-entry ledger prevents point balance race conditions during concurrent tournament submissions.</div>
          <div>• <span className="font-bold text-[#00ff66]">Automated Android CI/CD:</span> GitHub Actions matrix builds signed release APK artifacts directly on git push.</div>
          <div>• <span className="font-bold text-[#00ff66]">APAC Media Proxy:</span> High-speed image and proof verification CDN routed over Cloudflare R2 without egress fees.</div>
        </div>

        {/* Embedded Live Iframe View */}
        <div className="border-2 border-[#00ff66]/40 rounded-[6px] overflow-hidden bg-black shadow-[0_0_20px_rgba(0,255,102,0.15)] relative">
          <div className="bg-[#001006] border-b border-[#00ff66]/30 px-3 py-1 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
              <span>LIVE WEB PREVIEW // ktccofficial.vercel.app</span>
            </div>
            <a
              href="https://ktccofficial.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00ff66] hover:underline flex items-center gap-1 font-bold"
            >
              <span>NEW TAB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <iframe
            src="https://ktccofficial.vercel.app"
            title="KTCC Live Platform"
            className="w-full h-[320px] sm:h-[400px] border-none bg-black"
            loading="lazy"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#00ff66]/30">
          <a
            href="https://ktccofficial.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick(1.3)}
            className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 border-2 border-[#00ff66] bg-[#00ff66]/15 hover:bg-[#00ff66]/30 rounded-[4px] py-1.5 font-bold text-xs sm:text-sm transition-all shadow-[0_0_12px_rgba(0,255,102,0.25)] text-center cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>[ OPEN FULLSCREEN LIVE ]</span>
          </a>

          <a
            href="https://github.com/neerajm-dev"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="flex items-center justify-center gap-1.5 border border-[#00ff66]/50 hover:border-[#00ff66] bg-black/60 hover:bg-[#00ff66]/10 rounded-[4px] px-3 py-1.5 font-bold text-xs transition-all text-center cursor-pointer"
          >
            <GithubIcon className="w-4 h-4" />
            <span>GITHUB</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
