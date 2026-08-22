"use client";

import { useState, useRef, useEffect } from "react";
import { sound } from "@/lib/sound";
import { SpatialHud } from "./spatial-hud";
import { LaserWires } from "./laser-wires";
import { IslandCore } from "./islands/island-core";
import { IslandKtcc } from "./islands/island-ktcc";
import { IslandCli } from "./islands/island-cli";
import { IslandLab } from "./islands/island-lab";
import { IslandInfra } from "./islands/island-infra";
import { IslandComms } from "./islands/island-comms";

const ISLAND_COORDINATES: Record<string, { x: number; y: number }> = {
  core: { x: 0, y: 0 },
  ktcc: { x: -600, y: -280 },
  cli: { x: 600, y: -280 },
  lab: { x: -600, y: 300 },
  infra: { x: 600, y: 300 },
  comms: { x: 0, y: 600 },
};

const WIRE_TARGETS = [
  { id: "ktcc", x: -600, y: -280, color: "#00f0ff" },
  { id: "cli", x: 600, y: -280, color: "#10b981" },
  { id: "lab", x: -600, y: 300, color: "#f59e0b" },
  { id: "infra", x: 600, y: 300, color: "#818cf8" },
  { id: "comms", x: 0, y: 600, color: "#ffffff" },
];

export function SpatialCanvas() {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(0.9);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  // Mouse Drag to Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag if clicking on canvas background or non-interactive elements
    if ((e.target as HTMLElement).closest("button, input, a, pre, code")) return;

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({
      x: dragStart.current.panX + dx,
      y: dragStart.current.panY + dy,
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Wheel to Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    setZoom((prevZoom) => {
      const nextZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.45), 1.6);
      return nextZoom;
    });
  };

  // Quick Warp to Island
  const handleWarpTo = (targetId: string) => {
    sound.playNodePulse();
    const target = ISLAND_COORDINATES[targetId];
    if (target) {
      // Offset pan so island is centered
      setPan({ x: -target.x, y: -target.y });
    }
  };

  const handleZoomIn = () => {
    sound.playClick();
    setZoom((z) => Math.min(z + 0.15, 1.6));
  };

  const handleZoomOut = () => {
    sound.playClick();
    setZoom((z) => Math.max(z - 0.15, 0.45));
  };

  const handleResetCamera = () => {
    sound.playClick();
    setPan({ x: 0, y: 0 });
    setZoom(0.9);
  };

  return (
    <div
      className="fixed inset-0 bg-[#05070a] overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Infinite Grid Background (Moves & Zooms with Camera) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle, #00f0ff40 1px, transparent 1px)`,
          backgroundSize: `${32 * zoom}px ${32 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* Spatial World Container */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
        }}
      >
        {/* Dynamic Laser Connection Wires */}
        <LaserWires targets={WIRE_TARGETS} />

        {/* 1. Island Core Monolith (Center [0, 0]) */}
        <div className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-20">
          <IslandCore onWarpTo={handleWarpTo} />
        </div>

        {/* 2. Island KTCC Architecture ([-600, -280]) */}
        <div
          className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: `translate(-600px, -280px)` }}
        >
          <IslandKtcc />
        </div>

        {/* 3. Island Cyberdeck CLI ([+600, -280]) */}
        <div
          className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: `translate(600px, -280px)` }}
        >
          <IslandCli />
        </div>

        {/* 4. Island ACID SQL Lab ([-600, +300]) */}
        <div
          className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: `translate(-600px, 300px)` }}
        >
          <IslandLab />
        </div>

        {/* 5. Island Zero-Cost Infra ([+600, +300]) */}
        <div
          className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: `translate(600px, 300px)` }}
        >
          <IslandInfra />
        </div>

        {/* 6. Island Transmission Comms ([0, +600]) */}
        <div
          className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ transform: `translate(0px, 600px)` }}
        >
          <IslandComms />
        </div>
      </div>

      {/* Fixed Tactical HUD & Radar Controls Overlay */}
      <SpatialHud
        pan={pan}
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetCamera={handleResetCamera}
        onWarpTo={handleWarpTo}
      />
    </div>
  );
}
