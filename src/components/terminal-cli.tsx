"use client";

import React, { useState, useRef, useEffect } from "react";
import { TERMINAL_COMMANDS } from "@/lib/constants";
import { TerminalHistoryItem } from "@/types";
import {
  Terminal as TerminalIcon,
  CornerDownLeft,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

const INITIAL_HISTORY: TerminalHistoryItem[] = [
  {
    id: "init-1",
    command: "system-boot --profile",
    timestamp: "17:30:00",
    output: `[SYSTEM] Neeraj M Portfolio OS v1.0.0 (x86_64-vercel-edge)
[STATUS] 100% $0.00/mo cloud infrastructure verified.
Type "help" to list available system commands or click the shortcut chips below.`,
  },
  {
    id: "init-2",
    command: "help",
    timestamp: "17:30:01",
    output: TERMINAL_COMMANDS.help,
  },
];

export function TerminalCli() {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<TerminalHistoryItem[]>(INITIAL_HISTORY);
  const [commandHistory, setCommandHistory] = useState<string[]>(["help"]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim().toLowerCase();
    if (!trimmed) return;

    // Add to command history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    if (trimmed === "clear") {
      setHistory([]);
      setInputVal("");
      return;
    }

    let output = "";

    if (trimmed === "help") {
      output = TERMINAL_COMMANDS.help;
    } else if (trimmed === "whoami") {
      output = TERMINAL_COMMANDS.whoami;
    } else if (trimmed === "ktcc") {
      output = TERMINAL_COMMANDS.ktcc;
    } else if (trimmed === "stack") {
      output = TERMINAL_COMMANDS.stack;
    } else if (trimmed === "stats") {
      output = TERMINAL_COMMANDS.stats;
    } else if (trimmed === "socials") {
      output = TERMINAL_COMMANDS.socials;
    } else if (trimmed === "challenge") {
      output = TERMINAL_COMMANDS.challenge;
    } else if (trimmed === "matrix") {
      output = `01001110 01100101 01100101 01110010 01100001 01101010 00100000 01001101
NEERAJ M MATRIX ACTIVATED // $0 CLOUD STACK RUNNING AT PEAK EFFICIENCY.`;
    } else if (trimmed === "exit" || trimmed === "quit") {
      output = `Session cannot be terminated. You are in read-only architectural telemetry mode.`;
    } else {
      output = `zsh: command not found: ${trimmed}. Type "help" for a list of available commands.`;
    }

    setHistory((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        command: rawCmd,
        timestamp,
        output,
        isError: !TERMINAL_COMMANDS[trimmed as keyof typeof TERMINAL_COMMANDS] && trimmed !== "matrix",
      },
    ]);

    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  const handleChipClick = (cmd: string) => {
    executeCommand(cmd);
    inputRef.current?.focus();
  };

  const handleCopyLogs = () => {
    const fullLog = history
      .map((item) => `neeraj@sys-arch:~$ ${item.command}\n${item.output}`)
      .join("\n\n");
    navigator.clipboard.writeText(fullLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="terminal" className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff]">
              <TerminalIcon className="h-4 w-4" />
              <span>INTERACTIVE TERMINAL CLI</span>
            </div>
            <h2 className="mt-1 font-outfit text-2xl font-bold tracking-tight text-[#f0f6fc] sm:text-3xl">
              Direct Systems Console
            </h2>
          </div>
          <p className="max-w-md font-sans text-xs text-[#8b949e]">
            Execute system commands directly or tap quick chips to query architecture specs, live stats, and project case studies.
          </p>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-[11px] text-[#8b949e]">Suggested commands:</span>
          {["whoami", "ktcc", "stack", "stats", "socials", "challenge", "clear"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleChipClick(cmd)}
              className="rounded-md border border-[#21262d] bg-[#0d1117] px-2.5 py-1 text-[#8b949e] transition-all hover:border-[#00f0ff]/50 hover:bg-[#161b22] hover:text-[#00f0ff] active:scale-95"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Window Container */}
        <div className="overflow-hidden rounded-2xl border border-[#21262d] bg-[#090d13] shadow-2xl shadow-[#00f0ff]/5 scanlines">
          
          {/* Terminal Window Header Bar */}
          <div className="flex items-center justify-between border-b border-[#21262d] bg-[#0d1117] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ef4444]/80 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-[#f59e0b]/80 inline-block"></span>
              <span className="h-3 w-3 rounded-full bg-[#10b981]/80 inline-block"></span>
              <span className="ml-2 font-mono text-xs text-[#8b949e] hidden sm:inline">
                neeraj@sys-arch: ~/portfolio (zsh)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLogs}
                className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#f0f6fc] active:scale-95"
                title="Copy Terminal Logs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#10b981]" /> : <Copy className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{copied ? "Copied" : "Copy Output"}</span>
              </button>

              <button
                onClick={() => setHistory([])}
                className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] text-[#8b949e] hover:bg-[#161b22] hover:text-[#ef4444] active:scale-95"
                title="Clear Terminal Buffer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Terminal Body Content */}
          <div
            onClick={() => inputRef.current?.focus()}
            className="h-[360px] overflow-y-auto p-4 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-[#f0f6fc] cursor-text"
          >
            {history.map((item) => (
              <div key={item.id} className="mb-4">
                <div className="flex items-center gap-2 text-[#8b949e]">
                  <span className="text-[#10b981]">neeraj@sys-arch</span>
                  <span className="text-[#8b949e]">:</span>
                  <span className="text-[#00f0ff]">~</span>
                  <span className="text-[#f0f6fc]">$</span>
                  <span className="text-[#f0f6fc] font-semibold">{item.command}</span>
                  <span className="ml-auto text-[10px] text-[#484f58]">{item.timestamp}</span>
                </div>
                <pre
                  className={`mt-1.5 whitespace-pre-wrap font-mono text-xs sm:text-xs leading-relaxed ${
                    item.isError ? "text-[#f87171]" : "text-[#8b949e]"
                  }`}
                >
                  {item.output}
                </pre>
              </div>
            ))}

            {/* Current Active Input Prompt */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[#10b981] font-semibold">neeraj@sys-arch</span>
              <span className="text-[#8b949e]">:</span>
              <span className="text-[#00f0ff]">~</span>
              <span className="text-[#f0f6fc]">$</span>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type a command (e.g. whoami, ktcc, stack)..."
                className="flex-1 bg-transparent text-[#f0f6fc] placeholder-[#484f58] outline-none font-mono text-xs sm:text-sm caret-[#00f0ff]"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                onClick={() => executeCommand(inputVal)}
                className="rounded p-1 text-[#8b949e] hover:text-[#00f0ff] sm:hidden"
              >
                <CornerDownLeft className="h-4 w-4" />
              </button>
            </div>

            <div ref={bottomRef} />
          </div>

        </div>

      </div>
    </section>
  );
}
