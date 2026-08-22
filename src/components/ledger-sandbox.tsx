"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";
import { DecodeText } from "./ui/decode-text";
import { ShieldCheck, ShieldAlert, Play, RefreshCw, Database, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Transaction {
  id: string;
  team: string;
  task: string;
  points: number;
  timestamp: string;
  hash: string;
}

export function LedgerSandbox() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx_01",
      team: "TEAM_KERALA_RIDERS",
      task: "WEEKLY_POST_COMPLETION",
      points: 2,
      timestamp: "14:02:11.204",
      hash: "0x8f2a...19e0",
    },
    {
      id: "tx_02",
      team: "TEAM_KOCHI_DRIFT",
      task: "REEL_BONUS_1ST_PLACE",
      points: 4,
      timestamp: "14:02:18.912",
      hash: "0x3c1b...902a",
    },
  ]);

  const [simState, setSimState] = useState<"idle" | "success" | "tamper_blocked">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalPoints = transactions.reduce((acc, tx) => acc + tx.points, 0);

  // 1. Submit Valid Transaction
  const handleValidSubmit = () => {
    sound.playSuccess();
    const newTx: Transaction = {
      id: `tx_0${transactions.length + 1}`,
      team: "TEAM_MALABAR_CRUISERS",
      task: "REEL_SUBMISSION_TASK",
      points: 3,
      timestamp: new Date().toISOString().substring(11, 23),
      hash: `0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
    setSimState("success");
    setTimeout(() => setSimState("idle"), 3000);
  };

  // 2. Attempt Duplicate / Tamper Submission
  const handleTamperAttempt = () => {
    sound.playError();
    setErrorMessage(
      'POSTGRESQL CONSTRAINT VIOLATION: (team_id, event_id, task_id) already exists. Key constraint "idx_unique_event_task_team_claim" rejected duplicate point allocation.'
    );
    setSimState("tamper_blocked");
  };

  // 3. Reset Sandbox
  const handleReset = () => {
    sound.playClick();
    setTransactions([
      {
        id: "tx_01",
        team: "TEAM_KERALA_RIDERS",
        task: "WEEKLY_POST_COMPLETION",
        points: 2,
        timestamp: "14:02:11.204",
        hash: "0x8f2a...19e0",
      },
      {
        id: "tx_02",
        team: "TEAM_KOCHI_DRIFT",
        task: "REEL_BONUS_1ST_PLACE",
        points: 4,
        timestamp: "14:02:18.912",
        hash: "0x3c1b...902a",
      },
    ]);
    setSimState("idle");
    setErrorMessage("");
  };

  return (
    <section id="lab" className="relative py-20 px-4 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d1117] border border-[#10b981]/30 text-[#10b981] font-mono text-xs mb-3 shadow-inner">
          <Database className="w-3.5 h-3.5" />
          <span>// THE INTERACTIVE LAB & BENCHMARK</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-sans uppercase">
          <DecodeText text="ACID SQL Ledger Sandbox" />
        </h2>
        <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-3 font-mono">
          Test my zero-trust ledger architecture in real-time. Try executing a legitimate transaction or simulate a double-claim attack to test database constraint security.
        </p>
      </div>

      {/* Sandbox Container */}
      <div className="rounded-2xl border border-white/15 bg-[#080b10] p-6 md:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Top Controls & State Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-gray-400">DATABASE INTEGRITY STATUS</div>
              <div className="text-lg font-bold text-white font-sans flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
                <span>100% IMMUTABLE LEDGER ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleValidSubmit}
              onMouseEnter={() => sound.playHover()}
              className="px-4 py-2 rounded-xl bg-[#10b981]/20 hover:bg-[#10b981]/30 border border-[#10b981]/50 text-[#10b981] font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>[ + SUBMIT VALID TASK TX ]</span>
            </button>

            <button
              onClick={handleTamperAttempt}
              onMouseEnter={() => sound.playHover()}
              className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 font-mono text-xs font-bold transition-all shadow-lg flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>[ ⚠ ATTEMPT DOUBLE-SPEND ]</span>
            </button>

            <button
              onClick={handleReset}
              onMouseEnter={() => sound.playHover()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all active:scale-95 cursor-pointer"
              title="Reset Sandbox"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Simulation Alert Banner */}
        <AnimatePresence>
          {simState === "tamper_blocked" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-300 font-mono text-xs flex items-start gap-3 shadow-2xl"
            >
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-red-200 uppercase tracking-wide">
                  ATTACK MITIGATED // SQL CONSTRAINT ENFORCED
                </div>
                <div className="mt-1 text-[11px] text-red-300/90 leading-relaxed font-mono">
                  {errorMessage}
                </div>
              </div>
            </motion.div>
          )}

          {simState === "success" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-[#10b981]/50 text-[#10b981] font-mono text-xs flex items-start gap-3 shadow-2xl"
            >
              <CheckCircle2 className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-emerald-200 uppercase tracking-wide">
                  TRANSACTION COMMITTED // DOUBLE-ENTRY VERIFIED
                </div>
                <div className="mt-1 text-[11px] text-emerald-300/90 leading-relaxed font-mono">
                  Ledger derived total updated automatically. 0 mutable column risks.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Sandbox Grid: Total Score Gauge + Immutable Ledger Stream */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left: Total Derived Points Counter */}
          <div className="md:col-span-4 p-5 rounded-xl border border-white/10 bg-[#05070a] flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                DERIVED SCORE (SUM OF POINT_TRANSACTIONS)
              </div>
              <div className="text-4xl md:text-5xl font-black text-white font-mono mt-2 flex items-baseline gap-2">
                <span>{totalPoints}</span>
                <span className="text-xs text-[#10b981] font-bold">PTS (ACID)</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-gray-400 space-y-1.5">
              <div className="flex justify-between">
                <span>CONSTRAINTS:</span>
                <span className="text-white font-bold">UNIQUE(TEAM,TASK)</span>
              </div>
              <div className="flex justify-between">
                <span>MUTABLE TOTAL:</span>
                <span className="text-red-400 font-bold">DISALLOWED</span>
              </div>
              <div className="flex justify-between">
                <span>AUDIT TRAIL:</span>
                <span className="text-[#00f0ff] font-bold">100% PERSISTENT</span>
              </div>
            </div>
          </div>

          {/* Right: Live Immutable Transaction Log */}
          <div className="md:col-span-8 p-5 rounded-xl border border-white/10 bg-[#05070a] overflow-hidden">
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 border-b border-white/10 pb-2 mb-3">
              <span>TX LOG (LATEST FIRST)</span>
              <span>HASH // TIMESTAMP</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2.5 rounded-lg border border-white/5 bg-white/[0.02] flex items-center justify-between gap-2 font-mono text-xs text-gray-300"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] font-bold text-[#10b981] bg-[#10b981]/10 px-1.5 py-0.5 rounded">
                        +{tx.points} PTS
                      </span>
                      <span className="font-bold text-white text-[11px]">{tx.team}</span>
                      <span className="text-[10px] text-gray-500 hidden sm:inline">
                        [{tx.task}]
                      </span>
                    </div>

                    <div className="text-right text-[10px] text-gray-400 flex items-center gap-2">
                      <span className="font-mono text-[#00f0ff]">{tx.hash}</span>
                      <span className="text-gray-500">{tx.timestamp}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
