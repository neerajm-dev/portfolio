"use client";

import { motion } from "framer-motion";

interface LaserWiresProps {
  targets: { id: string; x: number; y: number; color: string }[];
}

export function LaserWires({ targets }: LaserWiresProps) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
      <defs>
        <linearGradient id="wireGradCyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="wireGradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="wireGradAmber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="wireGradIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {targets.map((t) => {
        // Compute path from (0,0) center to target (x,y)
        const d = `M 0 0 Q ${t.x * 0.5} ${t.y * 0.2}, ${t.x} ${t.y}`;

        return (
          <g key={t.id}>
            {/* Background Circuit Line */}
            <path
              d={d}
              fill="none"
              stroke={t.color}
              strokeWidth="1.5"
              strokeDasharray="4 6"
              strokeOpacity="0.3"
            />

            {/* Glowing Traveling Data Photon */}
            <motion.circle
              r="3.5"
              fill={t.color}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: 2.4 + Math.random() * 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                offsetPath: `path("${d}")`,
                boxShadow: `0 0 12px ${t.color}`,
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
