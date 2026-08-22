"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { sound } from "@/lib/sound";
import { MatrixAvatar } from "./ui/matrix-avatar";
import { DecodeText } from "./ui/decode-text";
import { Terminal, Copy, Check, ArrowDown, Sparkles, Layers, ShieldCheck, Zap } from "lucide-react";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    sound.playSuccess();
    navigator.clipboard.writeText("neerajm2k7@gmail.com");
    setCopied(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x, y },
      colors: ["#00f0ff", "#10b981", "#818cf8", "#f59e0b"],
    });

    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="overview" className="relative min-h-[92vh] flex flex-col justify-center items-center text-center px-4 pt-24 pb-12 z-10 max-w-5xl mx-auto">
      {/* Top Identity Tag */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0d1117]/90 border border-[#00f0ff]/30 text-[#00f0ff] font-mono text-xs mb-8 shadow-2xl backdrop-blur-md"
      >
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
        <span>// SOLO SYSTEMS ARCHITECT & FULL-STACK ENGINEER</span>
      </motion.div>

      {/* Center Avatar with Live Glitch FX */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <MatrixAvatar size={130} />
      </motion.div>

      {/* Main Kinetic Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight uppercase font-sans leading-[1.08] max-w-4xl"
      >
        <span>Architecting </span>
        <span className="bg-gradient-to-r from-[#00f0ff] via-[#10b981] to-[#818cf8] bg-clip-text text-transparent">
          Production Platforms
        </span>
        <span> From Scratch.</span>
      </motion.h1>

      {/* Bio / Value Proposition */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl font-mono leading-relaxed"
      >
        <DecodeText text="19yo Systems Builder • BCA @ SNCT • Full-Stack Android & Cloud • $0 Cloud Infrastructure Specialist." speed={20} />
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-xs sm:text-sm font-bold"
      >
        <a
          href="#architecture"
          onClick={() => sound.playClick()}
          onMouseEnter={() => sound.playHover()}
          className="px-5 py-3 rounded-xl bg-[#00f0ff] text-black font-black hover:bg-[#00f0ff]/90 transition-all shadow-lg shadow-[#00f0ff]/20 flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>[ 🚀 EXPLORE BLUEPRINT ]</span>
        </a>

        <a
          href="#cli"
          onClick={() => sound.playClick()}
          onMouseEnter={() => sound.playHover()}
          className="px-5 py-3 rounded-xl bg-[#0d1117] hover:bg-white/10 border border-white/15 text-white transition-all shadow-xl flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          <Terminal className="w-4 h-4 text-[#10b981]" />
          <span>[ 💻 LAUNCH WEB CLI ]</span>
        </a>

        <button
          onClick={handleCopyEmail}
          onMouseEnter={() => sound.playHover()}
          className="px-5 py-3 rounded-xl bg-[#0d1117] hover:bg-white/10 border border-[#00f0ff]/30 text-[#00f0ff] transition-all shadow-xl flex items-center gap-2 active:scale-95 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#10b981]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "COPIED TO CLIPBOARD!" : "$ COPY_EMAIL"}</span>
        </button>
      </motion.div>

      {/* 3 Live Telemetry Stat Badges */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl font-mono"
      >
        <div className="p-3.5 rounded-xl bg-[#080b10]/90 border border-white/10 backdrop-blur-md flex items-center gap-3 text-left">
          <div className="p-2 rounded-lg bg-[#00f0ff]/10 text-[#00f0ff]">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">CLOUD BILLS</div>
            <div className="text-xs font-bold text-white">$0.00 / MO PERMANENT</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#080b10]/90 border border-white/10 backdrop-blur-md flex items-center gap-3 text-left">
          <div className="p-2 rounded-lg bg-[#10b981]/10 text-[#10b981]">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">DATA INTEGRITY</div>
            <div className="text-xs font-bold text-white">100% ACID SQL LEDGER</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#080b10]/90 border border-white/10 backdrop-blur-md flex items-center gap-3 text-left">
          <div className="p-2 rounded-lg bg-[#818cf8]/10 text-[#818cf8]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">EDGE LATENCY</div>
            <div className="text-xs font-bold text-white">&lt;18ms APAC CDN SPEED</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
