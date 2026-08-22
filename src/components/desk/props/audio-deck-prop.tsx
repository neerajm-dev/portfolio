"use client";

import { useState, useEffect } from "react";
import { sound } from "@/lib/sound";
import { Volume2, VolumeX } from "lucide-react";

export function AudioDeckProp() {
  const [enabled, setEnabled] = useState(true);
  const [eqBars, setEqBars] = useState([3, 5, 2, 6, 4, 7, 3, 5]);

  useEffect(() => {
    setEnabled(sound.getEnabled());
    const interval = setInterval(() => {
      if (sound.getEnabled()) {
        setEqBars(Array.from({ length: 8 }, () => Math.floor(Math.random() * 7) + 1));
      }
    }, 250);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = () => {
    const newState = sound.toggle();
    setEnabled(newState);
  };

  const getBarChar = (height: number) => {
    const chars = [" ", " ", "▂", "▃", "▄", "▅", "▆", "▇"];
    return chars[height] || "▃";
  };

  return (
    <div
      onClick={handleToggle}
      className="w-[115px] sm:w-[130px] bg-[#000803] border border-[#00ff66] p-2 rounded-[4px] shadow-[0_0_12px_rgba(0,255,102,0.2),inset_0_0_8px_rgba(0,255,102,0.06)] select-none font-mono cursor-pointer transition-all hover:shadow-[0_0_22px_rgba(0,255,102,0.4)]"
      title="Click to toggle Web Audio SFX"
    >
      {/* Header */}
      <div className="flex items-center justify-between text-[7px] text-[#00ff66] border-b border-[#00ff66]/30 pb-1 mb-1">
        <span className="font-bold flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full bg-[#00ff66] ${enabled ? "animate-ping" : "opacity-30"}`} />
          SYNTH_DECK
        </span>
        {enabled ? <Volume2 className="w-2.5 h-2.5" /> : <VolumeX className="w-2.5 h-2.5 opacity-50" />}
      </div>

      {/* Animated Equalizer */}
      <div className="h-6 flex items-end justify-center gap-1 text-[11px] text-[#00ff66] bg-black/60 border border-[#00ff66]/20 rounded-[2px] px-1">
        {enabled ? (
          eqBars.map((h, i) => (
            <span key={i} className="leading-none text-[#00ff66]">
              {getBarChar(h)}
            </span>
          ))
        ) : (
          <span className="text-[7px] text-[#00ff66]/40 leading-none self-center">AUDIO MUTED</span>
        )}
      </div>

      {/* Footer / Toggle Button */}
      <div className="mt-1 text-[7px] text-center text-[#00ff66] border border-[#00ff66]/30 bg-[#00ff66]/10 rounded-[2px] py-0.5 font-bold">
        {enabled ? "[ SFX: ACTIVE ]" : "[ SFX: MUTED ]"}
      </div>
    </div>
  );
}
