"use client";

import React from "react";
import { ZERO_DOLLAR_STACK } from "@/lib/constants";
import { Sparkles, Globe, Database, Cpu, Check } from "lucide-react";

export function Stack() {
  const getIcon = (name: string) => {
    switch (name) {
      case "Globe":
        return <Globe className="h-5 w-5 text-[#00f0ff]" />;
      case "Database":
        return <Database className="h-5 w-5 text-[#10b981]" />;
      case "Cpu":
        return <Cpu className="h-5 w-5 text-[#f59e0b]" />;
      default:
        return <Sparkles className="h-5 w-5 text-[#818cf8]" />;
    }
  };

  return (
    <section id="stack" className="py-12 md:py-20 border-t border-[#21262d]/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#10b981]">
              <Sparkles className="h-4 w-4" />
              <span>STRICT $0.00/MO BUDGET PHILOSOPHY</span>
            </div>
            <h2 className="mt-1 font-outfit text-2xl font-bold tracking-tight text-[#f0f6fc] sm:text-3xl md:text-4xl">
              Zero-Dollar Cloud Stack
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs sm:text-sm text-[#8b949e]">
            Architected to leverage high-performance permanent free tiers without compromising latency, security, or build pipelines.
          </p>
        </div>

        {/* Stack Categories Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {ZERO_DOLLAR_STACK.map((cat, idx) => (
            <div
              key={idx}
              className="glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#21262d] bg-[#161b22]">
                    {getIcon(cat.iconName)}
                  </div>
                  <div>
                    <h3 className="font-outfit text-base font-bold text-[#f0f6fc]">
                      {cat.title}
                    </h3>
                    <span className="font-mono text-[10px] text-[#10b981] font-semibold">
                      $0.00 / MONTH
                    </span>
                  </div>
                </div>

                <p className="font-sans text-xs text-[#8b949e] mb-5 leading-relaxed">
                  {cat.description}
                </p>

                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="rounded-xl border border-[#21262d] bg-[#161b22]/40 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-semibold text-[#f0f6fc]">
                          {item.name}
                        </span>
                        <span className="rounded bg-[#10b981]/15 px-1.5 py-0.5 font-mono text-[10px] font-bold text-[#10b981]">
                          {item.cost}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-[#8b949e]">
                        <span>{item.role}</span>
                        <span className="font-mono text-[10px] text-[#484f58]">{item.tier}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-[#21262d] pt-3 flex items-center justify-between font-mono text-[11px] text-[#8b949e]">
                <span>Status</span>
                <span className="flex items-center gap-1 text-[#10b981]">
                  <Check className="h-3.5 w-3.5" />
                  Verified Free Tier
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Engineering Principle Callout */}
        <div className="mt-8 rounded-2xl border border-[#10b981]/30 bg-[#10b981]/5 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-[#10b981] uppercase tracking-wider">
                System Engineering Guarantee
              </span>
              <p className="font-sans text-sm text-[#f0f6fc]">
                Zero credit card limits, zero surprise bills, permanent $0.00/mo operating expenditure across all personal & flagship platforms.
              </p>
            </div>
            <div className="shrink-0 rounded-xl border border-[#10b981]/40 bg-[#10b981]/20 px-4 py-2 font-mono text-sm font-bold text-[#10b981]">
              $0.00 / MONTH TOTAL
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
