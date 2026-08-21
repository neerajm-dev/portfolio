"use client";

import React, { useState, useEffect } from "react";
import { Activity, Radio, Shield, Clock } from "lucide-react";

export function Telemetry() {
  const [latency, setLatency] = useState(14);
  const [timeStr, setTimeStr] = useState("");

  useEffect(() => {
    // Dynamic simulated latency fluctuation between 12ms and 18ms
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 6) + 13);
      setTimeStr(
        new Date().toLocaleTimeString("en-US", {
          hour12: false,
          timeZone: "Asia/Kolkata",
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 border-t border-[#21262d]/60 bg-[#05070a]/60">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-2xl border border-[#21262d] bg-[#090d13] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            
            {/* System Node Info */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#161b22] text-[#00f0ff]">
                <Activity className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#f0f6fc]">APAC-IN // EDGE-NODE</span>
                  <span className="rounded bg-[#00f0ff]/15 px-1.5 py-0.5 text-[10px] text-[#00f0ff]">
                    ONLINE
                  </span>
                </div>
                <div className="text-[11px] text-[#8b949e]">
                  Vercel Hobby Edge • Turbopack Engine
                </div>
              </div>
            </div>

            {/* Live Telemetry Tickers */}
            <div className="flex flex-wrap items-center gap-6 text-[#8b949e]">
              <div className="flex items-center gap-2">
                <Radio className="h-3.5 w-3.5 text-[#10b981]" />
                <span>P99 Edge Latency:</span>
                <span className="font-bold text-[#10b981]">{latency}ms</span>
              </div>

              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-[#00f0ff]" />
                <span>Ledger Integrity:</span>
                <span className="font-bold text-[#00f0ff]">100% ACID</span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-[#f59e0b]" />
                <span>IST Telemetry:</span>
                <span className="font-bold text-[#f59e0b]">
                  {timeStr || "17:35:00"} IST
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
