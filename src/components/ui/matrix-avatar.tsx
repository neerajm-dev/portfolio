"use client";

import { useState } from "react";
import Image from "next/image";
import { sound } from "@/lib/sound";

interface MatrixAvatarProps {
  size?: number;
  className?: string;
}

export function MatrixAvatar({ size = 120, className = "" }: MatrixAvatarProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchText, setGlitchText] = useState("");

  const triggerGlitch = () => {
    sound.playHover();
    setIsGlitching(true);
    const chars = "01#λ§░█*+~/{}<>";
    let count = 0;
    const interval = setInterval(() => {
      let str = "";
      for (let i = 0; i < 18; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
      }
      setGlitchText(str);
      count++;
      if (count > 6) {
        clearInterval(interval);
        setIsGlitching(false);
      }
    }, 40);
  };

  return (
    <div
      className={`relative group cursor-pointer inline-block ${className}`}
      onMouseEnter={triggerGlitch}
      onClick={() => {
        sound.playClick(1.4);
        triggerGlitch();
      }}
    >
      {/* Outer Rotating Cyber Glow Ring */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00f0ff] via-[#10b981] to-[#818cf8] opacity-40 group-hover:opacity-100 blur-sm transition-all duration-500 animate-pulse" />

      {/* Avatar Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-[#0d1117] p-1.5 shadow-2xl backdrop-blur-md">
        <div
          className="relative rounded-xl overflow-hidden bg-black"
          style={{ width: size, height: size }}
        >
          <Image
            src="/avatar-neeraj.png"
            alt="Neeraj M - ASCII Matrix Avatar"
            width={size}
            height={size}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isGlitching ? "scale-105 filter hue-rotate-90 contrast-125" : "group-hover:scale-105"
            }`}
            priority
          />

          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

          {/* Matrix Glitch Text Overlay */}
          {isGlitching && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px] text-[#00f0ff] font-mono text-[10px] tracking-widest text-center px-1 break-all select-none animate-pulse">
              {glitchText}
            </div>
          )}
        </div>
      </div>

      {/* Active System Pill Tag */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#05070a] border border-[#00f0ff]/40 text-[#00f0ff] text-[9px] font-mono font-bold tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
        <span>ARCHITECT // 0xNEERAJ</span>
      </div>
    </div>
  );
}
