"use client";

import { useState, useEffect } from "react";
import { Clock, Activity, Wifi, Shield, Cpu } from "lucide-react";

export function Telemetry() {
  const [time, setTime] = useState<string>("");
  const [latency, setLatency] = useState<number>(16);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Simulate minor live edge latency jitter between 14-18ms
    const pingInterval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 4) + 15);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInterval);
    };
  }, []);

  return (
    <div className="w-full bg-[#05070a] border-y border-white/10 py-3 px-4 z-10 relative font-mono text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Left: Location & IST Clock */}
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>KERALA (IST):</span>
          <span className="text-white font-bold">{time || "18:00:00"}</span>
        </div>

        {/* Center: System Gauges */}
        <div className="hidden md:flex items-center gap-6 text-[11px]">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#10b981]" />
            <span>CLOUD BILLS:</span>
            <span className="text-[#10b981] font-bold">$0.00 / MO PERMANENT</span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-[#f59e0b]" />
            <span>DB LEDGER:</span>
            <span className="text-white font-bold">100% ACID INTEGRITY</span>
          </div>
        </div>

        {/* Right: Edge Latency & Network Status */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <Wifi className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>APAC EDGE:</span>
          <span className="text-[#00f0ff] font-bold">{latency}ms</span>
          <span className="text-gray-500 font-bold hidden sm:inline">[ONLINE]</span>
        </div>
      </div>
    </div>
  );
}
