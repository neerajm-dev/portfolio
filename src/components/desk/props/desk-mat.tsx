"use client";

interface DeskMatProps {
  timeStr: string;
}

export function DeskMat({ timeStr }: DeskMatProps) {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      {/* Background Matrix/Grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 255, 102, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 255, 102, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Radial Vignette & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,102,0.06)_0%,rgba(0,0,0,0.92)_80%)]" />

      {/* CRT Scanline Bars */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px] opacity-40" />

      {/* Desk Surface Boundary / Cyber Desk Pad */}
      <div className="absolute inset-2 sm:inset-6 md:inset-8 border border-[#00ff66]/25 rounded-[12px] shadow-[inset_0_0_40px_rgba(0,255,102,0.04)] flex flex-col justify-between p-3 sm:p-4">
        {/* Top Desk Telemetry Bar */}
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] font-mono text-[#00ff66]/70 border-b border-[#00ff66]/20 pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
            <span className="font-bold text-[#00ff66]">NEERAJ_DEV // WORKSTATION STAGE</span>
            <span className="hidden md:inline text-[#00ff66]/40">|</span>
            <span className="hidden md:inline text-[#00ff66]/60">LOC: KOLLAM, KERALA [9.00° N, 76.62° E]</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[#00ff66] font-bold">{timeStr || "19:00:00"} IST</span>
            <span className="hidden sm:inline px-1.5 py-0.5 border border-[#00ff66]/40 rounded text-[8px] sm:text-[9px] text-[#00ff66] bg-[#00ff66]/10">
              INFRA: $0.00/MO
            </span>
          </div>
        </div>

        {/* Decorative Desk Cable Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Lanyard cable left */}
          <path
            d="M 120 80 Q 160 220 220 320"
            fill="none"
            stroke="#00ff66"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          {/* Power cable center */}
          <path
            d="M 50% 0 L 50% 120"
            fill="none"
            stroke="#00ff66"
            strokeWidth="1.5"
          />
          {/* Audio deck wire right */}
          <path
            d="M calc(100% - 140px) 160 Q calc(100% - 220px) 260 calc(100% - 320px) 340"
            fill="none"
            stroke="#00ff66"
            strokeWidth="1"
            strokeDasharray="2 2"
          />
        </svg>

        {/* Bottom Desk Telemetry Bar */}
        <div className="flex items-center justify-between text-[8px] sm:text-[10px] font-mono text-[#00ff66]/50 border-t border-[#00ff66]/20 pt-2">
          <div>DESK_COORDS: X:1024 Y:768 • SECTOR: 0xNEERAJ</div>
          <div className="hidden sm:block">HOTKEYS: [1] ID CARD • [2] LAPTOP CLI • [3] KTCC • [ESC] DESK</div>
          <div>STATUS: [● READY FOR BUILDS]</div>
        </div>
      </div>
    </div>
  );
}
