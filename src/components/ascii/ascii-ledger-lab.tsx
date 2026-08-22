"use client";

import { useState } from "react";
import { sound } from "@/lib/sound";

export function AsciiLedgerLab() {
  const [total, setTotal] = useState(6);
  const [status, setStatus] = useState<"idle" | "success" | "blocked">("idle");
  const [msg, setMsg] = useState("");

  const handleValid = () => {
    sound.playSuccess();
    setTotal((t) => t + 3);
    setStatus("success");
    setMsg("TX COMMITTED: +3 PTS. Ledger derived sum computed.");
    setTimeout(() => setStatus("idle"), 3000);
  };

  const handleTamper = () => {
    sound.playError();
    setStatus("blocked");
    setMsg("SQL CONSTRAINT VIOLATION: (team_id, event_id, task_id) already exists. Duplicate rejected.");
  };

  const handleReset = () => {
    sound.playClick();
    setTotal(6);
    setStatus("idle");
    setMsg("");
  };

  return (
    <div className="border border-[#00ff66]/40 bg-black p-4 sm:p-6 font-mono text-[#00ff66] shadow-[0_0_25px_rgba(0,255,102,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-2 mb-3 text-xs font-mono">
        <div className="font-bold tracking-wider">// 03: ZERO-TRUST ACID SQL LEDGER LAB</div>
        <button
          onClick={handleReset}
          className="text-[#00ff66]/60 hover:text-[#00ff66] text-[10px] border border-[#00ff66]/20 px-2 py-0.5"
        >
          [ RESET ]
        </button>
      </div>

      <p className="text-xs text-[#00ff66]/70 mb-3">
        Test real-time double-entry database constraint enforcement in the browser.
      </p>

      {/* Metrics ASCII Box */}
      <div className="border border-[#00ff66]/30 p-3 bg-black my-3 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] text-[#00ff66]/60 font-bold">DERIVED TOTAL (SUM OF POINT_TRANSACTIONS):</div>
          <div className="text-3xl font-black text-[#00ff66] mt-1">{total} PTS (100% ACID)</div>
        </div>
        <div className="text-right text-[10px] text-[#00ff66]/80 space-y-0.5">
          <div>CONSTRAINTS: <span className="font-bold">UNIQUE(TEAM,TASK)</span></div>
          <div>MUTABLE COLUMNS: <span className="font-bold">DISALLOWED</span></div>
        </div>
      </div>

      {/* Status Output */}
      {status === "blocked" && (
        <div className="border border-[#00ff66] bg-[#00ff66]/10 p-2.5 my-2 text-xs">
          <div className="font-bold">[ ! ] ATTACK MITIGATED // SQL CONSTRAINT ENFORCED</div>
          <div className="text-[10px] mt-0.5 text-[#00ff66]/90">{msg}</div>
        </div>
      )}

      {status === "success" && (
        <div className="border border-[#00ff66] bg-[#00ff66]/10 p-2.5 my-2 text-xs">
          <div className="font-bold">[ ✓ ] TRANSACTION COMMITTED // DOUBLE-ENTRY VERIFIED</div>
          <div className="text-[10px] mt-0.5 text-[#00ff66]/90">{msg}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
        <button
          onClick={handleValid}
          onMouseEnter={() => sound.playHover()}
          className="p-2.5 border border-[#00ff66] hover:bg-[#00ff66]/20 font-bold text-center transition-all cursor-pointer"
        >
          [ + SUBMIT LEGITIMATE TX (+3 PTS) ]
        </button>

        <button
          onClick={handleTamper}
          onMouseEnter={() => sound.playHover()}
          className="p-2.5 border border-[#00ff66] hover:bg-[#00ff66]/20 font-bold text-center transition-all cursor-pointer"
        >
          [ ⚠ ATTEMPT DOUBLE-SPEND ATTACK ]
        </button>
      </div>
    </div>
  );
}
