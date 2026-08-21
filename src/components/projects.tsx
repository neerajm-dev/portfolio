"use client";

import React from "react";
import { FLAGSHIP_PROJECT } from "@/lib/constants";
import {
  Shield,
  CheckCircle2,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

export function Projects() {
  return (
    <section id="projects" className="py-12 md:py-20 border-t border-[#21262d]/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff]">
              <Shield className="h-4 w-4" />
              <span>FLAGSHIP ARCHITECTURE CASE STUDY</span>
            </div>
            <h2 className="mt-1 font-outfit text-2xl font-bold tracking-tight text-[#f0f6fc] sm:text-3xl md:text-4xl">
              KTCC Tournament Platform
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs sm:text-sm text-[#8b949e]">
            Full-stack esports tournament automation ecosystem built from scratch with zero recurring cloud expenses.
          </p>
        </div>

        {/* Flagship Feature Card */}
        <div className="overflow-hidden rounded-3xl border border-[#21262d] bg-[#0d1117] shadow-2xl transition-all hover:border-[#00f0ff]/40">
          
          {/* Card Top Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#21262d] bg-[#161b22]/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-[#10b981]/40 bg-[#10b981]/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#10b981]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#10b981] animate-pulse"></span>
                {FLAGSHIP_PROJECT.status}
              </span>
              <span className="font-mono text-xs text-[#8b949e]">
                Car Parking Multiplayer (CPM)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={FLAGSHIP_PROJECT.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg border border-[#21262d] bg-[#0d1117] px-3 py-1.5 font-mono text-xs text-[#8b949e] transition-colors hover:border-[#f0f6fc]/30 hover:text-white"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                <span>Repository</span>
              </a>

              <a
                href={FLAGSHIP_PROJECT.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg bg-[#00f0ff] px-3.5 py-1.5 font-outfit text-xs font-bold text-[#05070a] shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-transform hover:scale-105 active:scale-95"
              >
                <span>Live Launch</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Description & Overview */}
            <div className="space-y-3">
              <h3 className="font-outfit text-xl font-bold text-[#f0f6fc] sm:text-2xl">
                {FLAGSHIP_PROJECT.tagline}
              </h3>
              <p className="font-sans text-sm sm:text-base leading-relaxed text-[#8b949e]">
                {FLAGSHIP_PROJECT.description}
              </p>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {FLAGSHIP_PROJECT.metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-4 ${
                    metric.highlight
                      ? "border-[#10b981]/40 bg-[#10b981]/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                      : "border-[#21262d] bg-[#161b22]/40"
                  }`}
                >
                  <span className="block font-mono text-[11px] uppercase tracking-wider text-[#8b949e]">
                    {metric.label}
                  </span>
                  <span
                    className={`mt-1.5 block font-outfit text-xl sm:text-2xl font-bold tracking-tight ${
                      metric.highlight ? "text-[#10b981]" : "text-[#f0f6fc]"
                    }`}
                  >
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Architecture Highlights */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#00f0ff]">
                <Layers className="h-3.5 w-3.5" />
                <span>Engineering Highlights & Key Architectural Wins</span>
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {FLAGSHIP_PROJECT.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-[#21262d] bg-[#161b22]/30 p-3.5"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#00f0ff] mt-0.5" />
                    <p className="font-sans text-xs sm:text-sm leading-relaxed text-[#8b949e]">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Pills */}
            <div className="pt-2">
              <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8b949e]">
                Technologies & Platform Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {FLAGSHIP_PROJECT.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-[#21262d] bg-[#161b22] px-3 py-1 font-mono text-xs text-[#f0f6fc]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
