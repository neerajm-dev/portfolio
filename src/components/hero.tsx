"use client";

import React, { useState } from "react";
import { DEVELOPER_PROFILE } from "@/lib/constants";
import {
  ShieldCheck,
  Terminal,
  ExternalLink,
  Copy,
  Check,
  Zap,
  Cpu,
  Database,
} from "lucide-react";
import confetti from "canvas-confetti";

export function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
    setCopied(true);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#00f0ff", "#10b981", "#f59e0b"],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
      {/* Background Cyber Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[450px] w-full max-w-4xl -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00f0ff]/15 via-[#10b981]/5 to-transparent blur-3xl" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pb-6 font-mono text-xs">
          <div className="flex items-center gap-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3.5 py-1 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00f0ff] animate-pulse"></span>
            <span className="font-semibold tracking-wider">DAY 1 // ONAM PORTFOLIO CHALLENGE</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-[#21262d] bg-[#0d1117] px-3 py-1 text-[#8b949e]">
            <span>SNCT Kerala 🇮🇳</span>
            <span className="text-[#30363d]">•</span>
            <span>BCA &apos;27</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="max-w-4xl space-y-4">
          <h1 className="font-outfit text-4xl font-extrabold tracking-tight text-[#f0f6fc] sm:text-5xl md:text-6xl lg:text-7xl">
            Architecting{" "}
            <span className="bg-gradient-to-r from-[#00f0ff] via-[#38bdf8] to-[#10b981] bg-clip-text text-transparent">
              Zero-Dollar Systems
            </span>{" "}
            & High-Velocity Platforms.
          </h1>

          <p className="max-w-2xl font-sans text-base leading-relaxed text-[#8b949e] sm:text-lg">
            Hi, I&apos;m <span className="font-semibold text-[#f0f6fc]">Neeraj M</span> — a 19yo solo systems engineer specializing in full-stack Android engines, high-concurrency tournament platforms, and resilient cloud architectures running at <span className="font-mono font-semibold text-[#10b981]">$0.00/mo</span> ongoing bills.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a
            href={DEVELOPER_PROFILE.flagshipUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] px-5 py-3 font-outfit text-sm font-bold text-[#05070a] shadow-[0_0_25px_rgba(0,240,255,0.3)] transition-all hover:scale-[1.02] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] active:scale-95"
          >
            <Zap className="h-4 w-4 fill-current" />
            <span>Launch Flagship Platform</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <a
            href="#terminal"
            className="flex items-center gap-2 rounded-xl border border-[#21262d] bg-[#0d1117] px-5 py-3 font-mono text-xs font-semibold text-[#f0f6fc] transition-all hover:border-[#00f0ff]/50 hover:bg-[#161b22] hover:text-[#00f0ff] active:scale-95"
          >
            <Terminal className="h-4 w-4 text-[#00f0ff]" />
            <span>Run Interactive CLI &gt;_</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-2 rounded-xl border border-[#21262d] bg-[#0d1117] px-4 py-3 font-mono text-xs text-[#8b949e] transition-all hover:border-[#10b981]/50 hover:text-[#10b981] active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-[#10b981]" />
                <span className="text-[#10b981]">Email Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>{DEVELOPER_PROFILE.email}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Telemetry KPI Metrics Bar */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4">
          {DEVELOPER_PROFILE.stats.map((stat, idx) => (
            <div
              key={idx}
              className="glass-card glass-card-hover rounded-2xl p-4 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#8b949e]">
                  {stat.label}
                </span>
                {idx === 0 && <Cpu className="h-3.5 w-3.5 text-[#10b981]" />}
                {idx === 1 && <Zap className="h-3.5 w-3.5 text-[#00f0ff]" />}
                {idx === 2 && <Database className="h-3.5 w-3.5 text-[#f59e0b]" />}
                {idx === 3 && <ShieldCheck className="h-3.5 w-3.5 text-[#818cf8]" />}
              </div>
              <div className="mt-2 font-outfit text-2xl font-bold tracking-tight text-[#f0f6fc] sm:text-3xl">
                {stat.value}
              </div>
              <div className="mt-1 font-mono text-[10px] text-[#8b949e]">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
