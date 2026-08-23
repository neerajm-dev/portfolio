"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";
import { QrCode } from "@/components/ui/qr-code";
import { X, Copy, Check, Coffee, Heart, ExternalLink, Sparkles, Zap, Smartphone, Mail } from "lucide-react";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";
import { DEVELOPER_PROFILE } from "@/lib/constants";

interface CoffeeModalProps {
  onClose: () => void;
  theme?: WorkstationTheme;
  onInteracted?: () => void;
}

export function CoffeeModal({ onClose, theme = DEFAULT_THEME, onInteracted }: CoffeeModalProps) {
  const themeHex = theme.hex;
  const [copiedUpi, setCopiedUpi] = useState(false);
  const upiId = DEVELOPER_PROFILE.socials.upi || "neerajm2k7@okaxis";
  const upiUri = `upi://pay?pa=${upiId}&pn=Neeraj%20M&cu=INR`;
  const kofiUrl = DEVELOPER_PROFILE.socials.kofi || "https://ko-fi.com/neerajm";

  const handleCopyUpi = (e: React.MouseEvent) => {
    sound.playSuccess();
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    onInteracted?.();

    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { x, y },
        colors: [themeHex, "#00f0ff", "#10b981", "#ffffff"],
      });
    } catch {
      // ignore
    }

    setTimeout(() => setCopiedUpi(false), 2500);
  };

  const handleKofiClick = () => {
    sound.playSuccess();
    onInteracted?.();
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.6 },
        colors: [themeHex, "#ff5f5f", "#ffd700", "#ffffff"],
      });
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 10 }}
      transition={{ duration: 0.2 }}
      className="w-full max-w-[540px] max-h-[88vh] flex flex-col bg-[#05080d] border-2 rounded-[12px] p-4 sm:p-5 font-mono relative overflow-hidden select-none shadow-2xl"
      style={{
        borderColor: themeHex,
        color: themeHex,
        boxShadow: `0 0 45px ${themeHex}33, inset 0 0 25px ${themeHex}14`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Subtle CRT Scanline */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.55)_50%)] bg-[length:100%_3px] pointer-events-none opacity-30 z-10" />

      {/* Header */}
      <div
        className="relative z-20 flex items-center justify-between border-b pb-2.5 mb-3.5"
        style={{ borderColor: `${themeHex}4d` }}
      >
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
          <Coffee className="w-4 h-4 animate-bounce" style={{ color: themeHex }} />
          <span className="tracking-wide">// CAFFEINE_REFILL • SPONSORSHIP</span>
        </div>

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="flex items-center gap-1 border px-2.5 py-1 rounded-[4px] font-bold text-xs transition-all cursor-pointer hover:bg-white/10 active:scale-95 text-white"
          style={{
            borderColor: `${themeHex}80`,
            boxShadow: `0 0 8px ${themeHex}33`,
          }}
        >
          <X className="w-3.5 h-3.5" />
          <span>[ ESC ]</span>
        </button>
      </div>

      {/* Body Content - Scrollable */}
      <div className="relative z-20 overflow-y-auto pr-1 space-y-3.5 text-xs">
        {/* Witty Developer Punchline Banner */}
        <div
          className="p-3 rounded-[8px] border bg-black/80 text-xs leading-relaxed space-y-1.5 shadow-inner"
          style={{ borderColor: `${themeHex}4d` }}
        >
          <div className="text-white font-bold flex items-center justify-between gap-1.5 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 animate-pulse" style={{ color: themeHex }} />
              <span className="tracking-wide text-[#ff7878] font-bold">[ ALERT: UNAUTHORIZED SIP DETECTED ]</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#ff5f5f]/20 text-[#ff7878] shrink-0">
              0% FUEL
            </span>
          </div>
          <p className="text-gray-200 text-[11.5px] leading-relaxed font-mono border-l-2 pl-2.5 italic" style={{ borderColor: themeHex }}>
            &ldquo;THAT WAS MY COFFEE! You drank it all, you owe me one.&rdquo; ☕⚡
          </p>
        </div>

        {/* Dual Support Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: 🇮🇳 UPI Instant Transfer */}
          <div
            className="p-3 rounded-[8px] border bg-black/70 flex flex-col justify-between space-y-2.5"
            style={{ borderColor: `${themeHex}4d` }}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[11px] flex items-center gap-1">
                  <span>🇮🇳 UPI / QR CODE</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300">
                  GPay • PhonePe • Paytm
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Scan via camera or any UPI app to send a direct coffee tip.
              </p>
            </div>

            {/* UPI QR Display (Cyberpunk Neon Glow Frame) */}
            <div className="flex justify-center py-1">
              <div
                className="p-2 rounded-[10px] bg-black border transition-all duration-300 relative group shadow-lg"
                style={{
                  borderColor: `${themeHex}80`,
                  boxShadow: `0 0 20px ${themeHex}2e, inset 0 0 12px ${themeHex}14`,
                }}
              >
                <QrCode
                  value={upiUri}
                  size={140}
                  fgColor={themeHex}
                  bgColor="transparent"
                  margin={1}
                  centerLogo={true}
                />
              </div>
            </div>

            {/* UPI ID & Copy Action */}
            <div className="space-y-1.5">
              <div className="text-[10px] text-gray-400 text-center font-mono">
                UPI ID: <span className="text-white font-bold">{upiId}</span>
              </div>

              <div className="grid grid-cols-1 gap-1">
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="w-full py-1.5 px-2 rounded border font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow"
                  style={{
                    backgroundColor: copiedUpi ? "#10b98126" : `${themeHex}20`,
                    borderColor: copiedUpi ? "#10b981" : themeHex,
                    color: copiedUpi ? "#10b981" : "#ffffff",
                  }}
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? "UPI ID COPIED!" : "COPY UPI ID"}</span>
                </button>

                {/* Direct UPI Intent Link (Mobile users) */}
                <a
                  href={upiUri}
                  onClick={() => {
                    sound.playSuccess();
                    onInteracted?.();
                  }}
                  className="sm:hidden w-full py-1 px-2 rounded border border-white/20 hover:bg-white/10 text-gray-300 font-bold text-[10px] text-center flex items-center justify-center gap-1 transition-all"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>PAY VIA UPI APP</span>
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: 🌍 Global Support (Ko-fi) */}
          <div
            className="p-3 rounded-[8px] border bg-black/70 flex flex-col justify-between space-y-2.5"
            style={{ borderColor: `${themeHex}4d` }}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-[11px] flex items-center gap-1">
                  <span>🌍 GLOBAL SUPPORT</span>
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ff5f5f]/20 text-[#ff7878] font-bold">
                  Ko-fi
                </span>
              </div>
              <p className="text-[10px] text-gray-400">
                Support from anywhere in the world using Card / PayPal / Apple Pay.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#ff5f5f]/10 border border-[#ff5f5f]/30 flex flex-col items-center justify-center text-center space-y-1.5 my-auto">
              <div className="w-10 h-10 rounded-full bg-[#ff5f5f]/20 flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#ff7878]" />
              </div>
              <div className="text-white font-bold text-xs">ko-fi.com/neerajm</div>
              <div className="text-[10px] text-gray-300">
                100% of tips go directly toward software tools &amp; coffee beans.
              </div>
            </div>

            <a
              href={kofiUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleKofiClick}
              className="w-full py-2 px-3 rounded border font-bold text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer shadow-lg text-white"
              style={{
                backgroundColor: `${themeHex}26`,
                borderColor: themeHex,
              }}
            >
              <Heart className="w-3.5 h-3.5 text-[#ff5f5f] fill-[#ff5f5f]" />
              <span>BUY A COFFEE ON KO-FI</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>
          </div>
        </div>

        {/* Commercial Work / Freelance Section */}
        <div
          className="p-2.5 rounded-[6px] border bg-black/60 flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{ borderColor: `${themeHex}33` }}
        >
          <div className="space-y-0.5 max-w-[320px]">
            <div className="font-bold text-white text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>HAVE A HIGH-IMPACT BUILD IN MIND?</span>
            </div>
            <div className="text-[10px] text-gray-400">
              Need a full-stack platform, custom Android engine, or zero-cost cloud architecture?
            </div>
          </div>

          <a
            href="mailto:hi.neerajm@gmail.com"
            onClick={() => sound.playClick()}
            className="px-2.5 py-1.5 rounded border border-white/20 hover:bg-white/10 active:scale-95 transition-all text-white font-bold text-[10px] flex items-center gap-1 shrink-0"
          >
            <Mail className="w-3 h-3" />
            <span>HIRE ME</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
