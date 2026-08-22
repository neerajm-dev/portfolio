"use client";

import { useState, useEffect } from "react";
import { Cloud, Clock, Wifi, Zap, ArrowUpRight } from "lucide-react";
import { sound } from "@/lib/sound";

export function IslandInfra() {
  const [time, setTime] = useState<string>("");
  const [latency, setLatency] = useState<number>(16);

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    const pingInt = setInterval(() => {
      setLatency(Math.floor(Math.random() * 4) + 15);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearInterval(pingInt);
    };
  }, []);

  return (
    <div className="w-[420px] sm:w-[480px] rounded-3xl border border-[#818cf8]/30 bg-[#080b10]/95 p-6 shadow-2xl backdrop-blur-2xl font-mono relative overflow-hidden">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold">// 04</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#818cf8]/10 text-[#818cf8] border border-[#818cf8]/30 font-bold">
            ZERO-EGRESS INFRA
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-[#10b981] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
          <span>$0.00 / MO COST</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-black text-white font-sans uppercase">
        Zero-Cost Cloud Deck
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        High-scale architecture recipes running 100% on permanent free tiers.
      </p>

      {/* Live Gauges Grid */}
      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="p-3.5 rounded-xl bg-[#05070a] border border-white/10">
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
            <Clock className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>KERALA (IST)</span>
          </div>
          <div className="text-lg font-black text-white mt-1">{time || "18:00:00"}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#05070a] border border-white/10">
          <div className="flex items-center gap-1.5 text-gray-500 text-[10px] font-bold">
            <Wifi className="w-3.5 h-3.5 text-[#10b981]" />
            <span>APAC EDGE SPEED</span>
          </div>
          <div className="text-lg font-black text-[#10b981] mt-1">{latency}ms [ONLINE]</div>
        </div>
      </div>

      {/* Blueprint Link */}
      <a
        href="https://ktccofficial.vercel.app/blueprint"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sound.playClick()}
        className="w-full p-2.5 rounded-xl bg-[#818cf8]/15 hover:bg-[#818cf8]/25 border border-[#818cf8]/40 text-[#818cf8] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
      >
        <span>[ 📖 READ ZERO-COST BLUEPRINT ]</span>
        <ArrowUpRight className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
