"use client";

import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import { X, CheckSquare, Terminal, Zap } from "lucide-react";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

interface NotesModalProps {
  onClose: () => void;
  theme?: WorkstationTheme;
}

export function NotesModal({ onClose, theme = DEFAULT_THEME }: NotesModalProps) {
  const themeHex = theme.hex;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[500px] bg-[#06090e] border-2 rounded-[10px] p-4 sm:p-5 font-mono relative overflow-hidden select-none"
      style={{
        borderColor: themeHex,
        color: themeHex,
        boxShadow: `0 0 40px ${themeHex}40, inset 0 0 25px ${themeHex}1a`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* CRT Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none opacity-40 z-10" />

      {/* Header */}
      <div
        className="relative z-20 flex items-center justify-between border-b pb-2 mb-3"
        style={{ borderColor: `${themeHex}66` }}
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themeHex }} />
          <span>ONAM_VACATION_MANIFESTO // 2026</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="flex items-center gap-1 border px-2 py-0.5 rounded-[4px] font-bold text-xs transition-all cursor-pointer"
          style={{
            borderColor: themeHex,
            boxShadow: `0 0 8px ${themeHex}33`,
          }}
        >
          <X className="w-3.5 h-3.5" />
          <span>[ ESC ]</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-20 space-y-2.5 text-xs sm:text-sm leading-relaxed">
        <div
          className="border-l-2 pl-2 py-0.5 text-xs"
          style={{
            borderColor: themeHex,
            color: `${themeHex}cc`,
          }}
        >
          Built in public during the Onam Vacation Portfolio Challenge. Documenting full-stack systems engineering &amp; paired AI execution live across Instagram &amp; GitHub.
        </div>

        {/* Engineering Pillars Checklist */}
        <div
          className="space-y-1.5 border bg-black/50 p-2.5 rounded-[6px] text-xs"
          style={{ borderColor: `${themeHex}4d` }}
        >
          <div className="font-bold mb-1" style={{ color: themeHex }}>CORE ENGINEERING PRINCIPLES:</div>
          <div className="flex items-center gap-2">
            <span>[✓]</span>
            <span>$0.00 Permanent Recurring Cloud Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <span>[✓]</span>
            <span>Zero-TypeScript-Any Strict Verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span>[✓]</span>
            <span>Double-Entry ACID Relational Ledgers</span>
          </div>
          <div className="flex items-center gap-2">
            <span>[✓]</span>
            <span>Headless Android CI/CD APK Pipeline</span>
          </div>
          <div className="flex items-center gap-2">
            <span>[✓]</span>
            <span>Brotoraise: Complaint Management System</span>
          </div>
        </div>

        {/* Philosophy Quote */}
        <div
          className="p-2 border rounded-[4px] text-[11px] text-center italic"
          style={{
            borderColor: `${themeHex}33`,
            backgroundColor: `${themeHex}0d`,
            color: `${themeHex}e6`,
          }}
        >
          &quot;Architecture is born when human taste meets autonomous AI execution.&quot;
        </div>
      </div>
    </motion.div>
  );
}
