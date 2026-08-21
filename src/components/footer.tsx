"use client";

import React, { useState } from "react";
import { DEVELOPER_PROFILE, SOCIAL_LINKS } from "@/lib/constants";
import {
  Copy,
  Check,
  ExternalLink,
  Mail,
} from "lucide-react";
import { GithubIcon, InstagramIcon } from "@/components/icons";
import confetti from "canvas-confetti";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(DEVELOPER_PROFILE.email);
    setCopied(true);

    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.9 },
        colors: ["#00f0ff", "#10b981", "#f59e0b"],
      });
    } catch {
      // Confetti fallback
    }

    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  const getSocialIcon = (name: string) => {
    switch (name) {
      case "Instagram":
        return <InstagramIcon className="h-4 w-4 text-[#f59e0b]" />;
      case "Github":
        return <GithubIcon className="h-4 w-4 text-[#f0f6fc]" />;
      case "Mail":
        return <Mail className="h-4 w-4 text-[#10b981]" />;
      default:
        return <ExternalLink className="h-4 w-4 text-[#00f0ff]" />;
    }
  };

  return (
    <footer className="mt-auto border-t border-[#21262d] bg-[#05070a] py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Main Footer Row */}
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          
          {/* Brand & Persona Col */}
          <div className="space-y-3 md:col-span-6">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#161b22] font-mono text-xs font-bold text-[#00f0ff] ring-1 ring-[#00f0ff]/30">
                NM
              </span>
              <span className="font-outfit text-base font-bold text-[#f0f6fc]">
                {DEVELOPER_PROFILE.name}
              </span>
              <span className="font-mono text-xs text-[#8b949e]">
                — {DEVELOPER_PROFILE.title}
              </span>
            </div>

            <p className="max-w-md font-sans text-xs sm:text-sm leading-relaxed text-[#8b949e]">
              Engineering high-scale Android platforms and zero-dollar cloud systems. Documenting the complete build journey during the Onam Vacation Portfolio Challenge.
            </p>

            <div className="pt-2">
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-2 rounded-xl border border-[#21262d] bg-[#0d1117] px-3.5 py-2 font-mono text-xs text-[#8b949e] transition-all hover:border-[#00f0ff]/40 hover:text-[#00f0ff] active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#10b981]" />
                    <span className="text-[#10b981]">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy: {DEVELOPER_PROFILE.email}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Social Links & Hub */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#00f0ff]">
              Connected Hubs
            </h4>
            <div className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-[#21262d]/60 bg-[#0d1117]/60 px-3 py-2 text-xs transition-colors hover:border-[#00f0ff]/30 hover:bg-[#161b22]"
                >
                  <div className="flex items-center gap-2 text-[#f0f6fc]">
                    {getSocialIcon(link.icon)}
                    <span>{link.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#8b949e]">
                    {link.badge}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Challenge Status */}
          <div className="space-y-3 md:col-span-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#10b981]">
              Challenge Log
            </h4>
            <div className="rounded-xl border border-[#21262d] bg-[#0d1117] p-3.5 space-y-2">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#8b949e]">Milestone:</span>
                <span className="font-bold text-[#10b981]">Day 1 Complete</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#8b949e]">Cloud Budget:</span>
                <span className="font-bold text-[#00f0ff]">$0.00 / month</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#8b949e]">Target Domain:</span>
                <span className="text-[#f0f6fc]">neerajm.vercel.app</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#21262d] pt-6 font-mono text-[11px] text-[#8b949e]">
          <div>
            © {new Date().getFullYear()} Neeraj M. Engineered with Next.js 15 App Router & TokyoNight tokens.
          </div>

          <div className="flex items-center gap-2 text-[#484f58]">
            <span>SNCT Kerala</span>
            <span>•</span>
            <span>Zero-Dollar Cloud Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
