"use client";

import React, { useState } from "react";
import { DEVELOPER_PROFILE } from "@/lib/constants";
import { Terminal, Shield, Sparkles, Menu, X, ArrowUpRight } from "lucide-react";
import { GithubIcon, InstagramIcon } from "@/components/icons";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#21262d]/80 bg-[#05070a]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        
        {/* Left: Brand Identity & Telemetry Status */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="group flex items-center gap-2.5 rounded-lg border border-[#21262d] bg-[#0d1117] px-2.5 py-1.5 transition-all hover:border-[#00f0ff]/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#161b22] font-mono text-xs font-bold text-[#00f0ff] ring-1 ring-[#00f0ff]/30 group-hover:ring-[#00f0ff]">
              NM
            </div>
            <div className="flex flex-col">
              <span className="font-outfit text-sm font-semibold tracking-tight text-[#f0f6fc] group-hover:text-[#00f0ff]">
                {DEVELOPER_PROFILE.name}
              </span>
              <span className="font-mono text-[10px] text-[#8b949e]">
                sys.arch // v1.0
              </span>
            </div>
          </a>

          {/* Availability Beacon */}
          <div className="hidden items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-1 font-mono text-xs font-medium text-[#10b981] sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]"></span>
            </span>
            <span className="tracking-wide">AVAILABLE FOR BUILDS</span>
          </div>
        </div>

        {/* Center / Right: Nav Anchor Links */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          <a
            href="#terminal"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#00f0ff]"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Terminal CLI</span>
          </a>
          <a
            href="#projects"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#00f0ff]"
          >
            <Shield className="h-3.5 w-3.5 text-[#00f0ff]" />
            <span>KTCC Flagship</span>
          </a>
          <a
            href="#stack"
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[#8b949e] transition-colors hover:bg-[#161b22] hover:text-[#10b981]"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#10b981]" />
            <span>$0 Cloud Stack</span>
          </a>
        </nav>

        {/* Right: Quick Action CTAs */}
        <div className="hidden sm:flex items-center gap-2">
          <a
            href={DEVELOPER_PROFILE.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#21262d] bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-[#8b949e] transition-all hover:border-[#f59e0b]/50 hover:text-[#f59e0b]"
          >
            <InstagramIcon className="h-3.5 w-3.5 text-[#f59e0b]" />
            <span>@neerajm_dev</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
          <a
            href={DEVELOPER_PROFILE.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[#00f0ff]/40 bg-[#00f0ff]/10 px-3 py-1.5 font-mono text-xs font-semibold text-[#00f0ff] transition-all hover:bg-[#00f0ff]/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] active:scale-95"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span>GitHub</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#21262d] bg-[#0d1117] text-[#8b949e] hover:text-white md:hidden active:scale-95"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-[#21262d] bg-[#0d1117] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 rounded-md border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-2 text-[#10b981]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]"></span>
              </span>
              <span>AVAILABLE FOR BUILDS</span>
            </div>
            <a
              href="#terminal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#8b949e] hover:bg-[#161b22] hover:text-[#00f0ff]"
            >
              <Terminal className="h-4 w-4" />
              <span>Interactive Terminal CLI</span>
            </a>
            <a
              href="#projects"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#8b949e] hover:bg-[#161b22] hover:text-[#00f0ff]"
            >
              <Shield className="h-4 w-4 text-[#00f0ff]" />
              <span>KTCC Flagship Case Study</span>
            </a>
            <a
              href="#stack"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-[#8b949e] hover:bg-[#161b22] hover:text-[#10b981]"
            >
              <Sparkles className="h-4 w-4 text-[#10b981]" />
              <span>$0 Cloud Infrastructure Stack</span>
            </a>
            <div className="pt-2 flex gap-2">
              <a
                href={DEVELOPER_PROFILE.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-lg border border-[#21262d] bg-[#161b22] py-2 text-[#f59e0b]"
              >
                Instagram
              </a>
              <a
                href={DEVELOPER_PROFILE.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/40 py-2 text-[#00f0ff]"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
