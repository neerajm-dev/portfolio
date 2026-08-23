"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";
import { DEVELOPER_PROFILE } from "@/lib/constants";

export function AsciiBanner() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
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
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border border-[#00ff66]/40 bg-black p-4 sm:p-6 font-mono text-[#00ff66] relative overflow-hidden shadow-[0_0_25px_rgba(0,255,102,0.15)]">
      {/* Top Telemetry Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#00ff66]/30 pb-3 mb-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
          <span className="font-bold tracking-wider">STATUS: AVAILABLE FOR BUILDS</span>
        </div>
        <div className="flex items-center gap-4 text-[#00ff66]/70 text-[11px]">
          <span>LOCATION: KOLLAM, KERALA (IST: {time || "18:30:00"})</span>
          <span className="hidden sm:inline">KERNEL: 0xNEERAJ_v2.5</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Giant FIGlet Banner */}
        <div className="lg:col-span-8 overflow-x-auto">
          <pre className="text-[9px] sm:text-[12px] md:text-[14px] leading-[1.1] text-[#00ff66] font-mono font-bold tracking-tighter drop-shadow-[0_0_8px_rgba(0,255,102,0.7)] select-none">
{` _   _ _____ _____ ____     _        _   __  __ 
| \\ | | ____| ____|  _ \\   / \\      | | |  \\/  |
|  \\| |  _| |  _| | |_) | / _ \\  _  | | | |\\/| |
| |\\  | |___| |___|  _ < / ___ \\| |_| | | |  | |
|_| \\_|_____|_____|_| \\_/_/   \\_\\___/  |_|_|  |_|`}
          </pre>
          <div className="mt-3 text-xs sm:text-sm font-bold tracking-widest text-[#00ff66]">
            &gt; SOLO SYSTEMS ARCHITECT // FULL-STACK &amp; $0 INFRASTRUCTURE
          </div>
          <div className="mt-1 text-xs text-[#00ff66]/70 max-w-xl font-mono leading-relaxed">
            {DEVELOPER_PROFILE.age}yo Developer • BCA @ SNCT • Creator of KTCC Platform • Multi-Platform Android &amp; Next.js 15
          </div>
        </div>

        {/* Right: ASCII Matrix Avatar */}
        <div className="lg:col-span-4 flex justify-center lg:justify-end">
          <div className="border border-[#00ff66]/40 p-1.5 bg-black relative group shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <div className="w-28 h-28 sm:w-32 sm:h-32 relative bg-black overflow-hidden">
              <Image
                src="/avatar-neeraj.png"
                alt="Neeraj M - ASCII Avatar"
                width={128}
                height={128}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                priority
              />
              {/* Scanline overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_3px] pointer-events-none opacity-50" />
            </div>
            <div className="text-center text-[9px] text-[#00ff66] font-bold mt-1 tracking-wider border-t border-[#00ff66]/20 pt-1">
              [ 0xNEERAJ_AVATAR ]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
