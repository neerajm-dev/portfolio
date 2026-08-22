"use client";

import { useState, useEffect } from "react";
import { sound } from "@/lib/sound";
import { Plus, Minus, Compass, Volume2, VolumeX, Crosshair, MapPin } from "lucide-react";

interface SpatialHudProps {
  pan: { x: number; y: number };
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetCamera: () => void;
  onWarpTo: (target: string) => void;
}

const NODES_MAP = [
  { id: "core", label: "00 // CORE", x: 0, y: 0, color: "#00f0ff" },
  { id: "ktcc", label: "01 // KTCC", x: -480, y: -220, color: "#00f0ff" },
  { id: "cli", label: "02 // CLI", x: 480, y: -220, color: "#10b981" },
  { id: "lab", label: "03 // LAB", x: -480, y: 260, color: "#f59e0b" },
  { id: "infra", label: "04 // INFRA", x: 480, y: 260, color: "#818cf8" },
  { id: "comms", label: "05 // COMMS", x: 0, y: 480, color: "#ffffff" },
];

export function SpatialHud({
  pan,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetCamera,
  onWarpTo,
}: SpatialHudProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    setSoundEnabled(sound.getEnabled());
    const handleToggle = (e: CustomEvent<boolean>) => {
      setSoundEnabled(e.detail);
    };
    window.addEventListener("sound_toggle", handleToggle as EventListener);
    return () => window.removeEventListener("sound_toggle", handleToggle as EventListener);
  }, []);

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundEnabled(next);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-4 font-mono select-none">
      {/* Top Header Bar: Telemetry Readout & Audio Toggle */}
      <div className="flex items-center justify-between gap-4">
        {/* Live Coordinate Telemetry */}
        <div className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-[#080b10]/90 border border-white/15 backdrop-blur-xl text-[11px] text-gray-300 shadow-2xl flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span className="text-gray-500 font-bold">X:</span>
            <span className="text-white font-bold">{Math.round(-pan.x)}</span>
            <span className="text-gray-500 font-bold ml-1">Y:</span>
            <span className="text-white font-bold">{Math.round(-pan.y)}</span>
          </div>
          <div className="text-gray-500">|</div>
          <div>
            <span className="text-gray-500 font-bold">ZOOM:</span>{" "}
            <span className="text-[#10b981] font-bold">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Top Right: SFX Toggle */}
        <button
          onClick={toggleSound}
          onMouseEnter={() => sound.playHover()}
          className={`pointer-events-auto px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xl flex items-center gap-1.5 active:scale-95 cursor-pointer backdrop-blur-xl ${
            soundEnabled
              ? "bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] shadow-[#00f0ff]/10"
              : "bg-[#080b10]/90 border-white/15 text-gray-400"
          }`}
          title="Toggle Web Audio SFX"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span>{soundEnabled ? "SFX: ON" : "SFX: MUTED"}</span>
        </button>
      </div>

      {/* Center Floating Interaction Hint (Fades out after movement) */}
      {pan.x === 0 && pan.y === 0 && (
        <div className="self-center px-4 py-2 rounded-full bg-[#080b10]/80 border border-white/10 backdrop-blur-md text-[11px] text-gray-400 font-mono flex items-center gap-2 shadow-xl animate-pulse">
          <Compass className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>DRAG TO PAN • SCROLL WHEEL TO ZOOM • OR USE WARP BUTTONS</span>
        </div>
      )}

      {/* Bottom Dock: Quick-Warp Pills + Zoom Tools + Minimap */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        {/* Left: Quick-Warp Navigation Pills */}
        <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#080b10]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          {NODES_MAP.map((node) => (
            <button
              key={node.id}
              onClick={() => onWarpTo(node.id)}
              onMouseEnter={() => sound.playHover()}
              className="px-2.5 py-1 rounded-xl text-[11px] font-bold text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
            >
              {node.label}
            </button>
          ))}
        </div>

        {/* Right: Camera Zoom Tools + Minimap Radar */}
        <div className="pointer-events-auto flex items-center gap-3">
          {/* Zoom In / Out / Reset Controls */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#080b10]/90 border border-white/15 backdrop-blur-xl shadow-2xl">
            <button
              onClick={onZoomOut}
              onMouseEnter={() => sound.playHover()}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
              title="Zoom Out"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onResetCamera}
              onMouseEnter={() => sound.playHover()}
              className="px-2.5 py-1 text-[11px] font-bold text-[#00f0ff] hover:bg-[#00f0ff]/10 rounded-xl transition-all active:scale-95 cursor-pointer"
              title="Reset to Core Center"
            >
              RESET
            </button>

            <button
              onClick={onZoomIn}
              onMouseEnter={() => sound.playHover()}
              className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
              title="Zoom In"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Minimap Radar Box */}
          <div className="hidden sm:block w-28 h-24 rounded-2xl bg-[#05070a] border border-white/20 p-2 relative shadow-2xl backdrop-blur-xl overflow-hidden">
            {/* Center Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,#ffffff15_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute inset-0 border-t border-b border-white/5 top-1/2 -translate-y-1/2" />
            <div className="absolute inset-0 border-l border-r border-white/5 left-1/2 -translate-x-1/2" />

            {/* Radar Node Dots */}
            {NODES_MAP.map((node) => {
              // Scale map coordinates: 480px -> 38px
              const mapX = 56 + (node.x / 480) * 36;
              const mapY = 48 + (node.y / 480) * 32;

              return (
                <div
                  key={node.id}
                  className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform shadow-lg"
                  style={{
                    left: `${mapX}px`,
                    top: `${mapY}px`,
                    backgroundColor: node.color,
                  }}
                />
              );
            })}

            {/* Active Viewport Indicator Rect */}
            <div
              className="absolute border border-[#00f0ff] bg-[#00f0ff]/10 rounded pointer-events-none transition-all duration-150"
              style={{
                left: `${56 + (-pan.x / 480) * 36 - 16 / zoom}px`,
                top: `${48 + (-pan.y / 480) * 32 - 12 / zoom}px`,
                width: `${32 / zoom}px`,
                height: `${24 / zoom}px`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
