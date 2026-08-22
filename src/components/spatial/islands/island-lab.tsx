"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";
import { Database, ShieldAlert, CheckCircle2, Play, AlertTriangle, RefreshCw } from "lucide-react";

export function IslandLab() {
  const [totalPoints, setTotalPoints] = useState(6);
  const [status, setStatus] = useState<"idle" | "success" | "blocked">("idle");
  const [message, setMessage] = useState("");

  const handleValid = () => {
    sound.playSuccess();
    setTotalPoints((prev) => prev + 3);
    setStatus("success");
    setMessage("TX COMMITTED: +3 PTS. Ledger derived sum updated.");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleTamper = () => {
    sound.playError();
    setStatus("blocked");
    setMessage("SECURITY LOCK: (team, event, task) unique constraint rejected duplicate claim.");
  };

  const handleReset = () => {
    sound.playClick();
    setTotalPoints(6);
    setStatus("idle");
    setMessage("");
  };

  return (
    <div className="w-[420px] sm:w-[480px] rounded-3xl border border-[#f59e0b]/30 bg-[#080b10]/95 p-6 shadow-2xl backdrop-blur-2xl font-mono relative overflow-hidden">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold">// 03</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/30 font-bold">
            ACID SQL SANDBOX
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-gray-500 hover:text-white transition-colors"
          title="Reset"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Title */}
      <h2 className="text-xl font-black text-white font-sans uppercase">
        Zero-Trust Ledger Lab
      </h2>
      <p className="text-xs text-gray-400 mt-1">
        Test real-time double-entry database constraint enforcement.
      </p>

      {/* Score Counter */}
      <div className="my-4 p-4 rounded-xl bg-[#05070a] border border-white/10 flex items-center justify-between">
        <div>
          <div className="text-[10px] text-gray-500 font-bold">DERIVED TOTAL (ACID)</div>
          <div className="text-3xl font-black text-white">{totalPoints} PTS</div>
        </div>
        <div className="text-right text-[10px] text-gray-400">
          <div>CONSTRAINTS: <span className="text-[#10b981] font-bold">ACTIVE</span></div>
          <div>MUTABLE COL: <span className="text-red-400 font-bold">LOCKED</span></div>
        </div>
      </div>

      {/* Status Feedback */}
      {status === "blocked" && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 text-xs flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-red-200 uppercase">ATTACK MITIGATED</div>
            <div className="text-[10px] text-red-300/90 mt-0.5">{message}</div>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-[#10b981]/50 text-[#10b981] text-xs flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-emerald-200 uppercase">TRANSACTION VERIFIED</div>
            <div className="text-[10px] text-emerald-300/90 mt-0.5">{message}</div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={handleValid}
          onMouseEnter={() => sound.playHover()}
          className="p-2.5 rounded-xl bg-[#10b981]/15 hover:bg-[#10b981]/25 border border-[#10b981]/40 text-[#10b981] text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5" />
          <span>[ + SUBMIT TX ]</span>
        </button>

        <button
          onClick={handleTamper}
          onMouseEnter={() => sound.playHover()}
          className="p-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>[ ⚠ DOUBLE-CLAIM ]</span>
        </button>
      </div>
    </div>
  );
}
