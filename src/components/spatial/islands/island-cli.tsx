"use client";

import { useState, useRef, useEffect } from "react";
import { sound } from "@/lib/sound";
import { Terminal, CornerDownLeft, Trash2 } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/constants";

interface LogEntry {
  id: string;
  type: "command" | "output" | "error";
  content: string | React.ReactNode;
}

const QUICK_COMMANDS = ["whoami", "architecture", "stack", "lab", "matrix", "clear"];

export function IslandCli() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "init",
      type: "output",
      content: (
        <div className="text-gray-300 text-xs font-mono space-y-1">
          <div className="text-[#10b981] font-bold">CYBERDECK WORKSTATION [ONLINE]</div>
          <div className="text-gray-500">Type &apos;whoami&apos;, &apos;stack&apos;, &apos;matrix&apos; or tap chips below.</div>
        </div>
      ),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const executeCommand = (cmdStr: string) => {
    const cleanCmd = cmdStr.trim().toLowerCase();
    if (!cleanCmd) return;

    sound.playClick(1.2);

    const cmdEntry: LogEntry = {
      id: Math.random().toString(),
      type: "command",
      content: cmdStr,
    };

    let outputEntry: LogEntry;

    switch (cleanCmd) {
      case "whoami":
        outputEntry = {
          id: Math.random().toString(),
          type: "output",
          content: (
            <div className="text-xs space-y-1 text-gray-300">
              <div className="text-[#00f0ff] font-bold">Neeraj M ({DEVELOPER_PROFILE.age}yo Systems Architect)</div>
              <div>BCA @ Sree Narayana College of Technology, Kollam</div>
              <div className="text-[#10b981]">&quot;The Extended Mind: Architecture is born when human taste meets autonomous AI execution.&quot;</div>
            </div>
          ),
        };
        break;

      case "architecture":
      case "stack":
        outputEntry = {
          id: Math.random().toString(),
          type: "output",
          content: (
            <div className="text-xs space-y-1 text-gray-300">
              <div className="text-[#f59e0b] font-bold">ZERO-COST CLOUD TOOLCHAIN:</div>
              <div>• Next.js 15 App Router & Turbopack SSR</div>
              <div>• Supabase PostgreSQL & Row-Level Security</div>
              <div>• Capacitor 7 Android Release Keystores</div>
              <div>• Cloudflare R2 APAC Zero-Egress CDN</div>
            </div>
          ),
        };
        break;

      case "matrix":
        sound.playSuccess();
        outputEntry = {
          id: Math.random().toString(),
          type: "output",
          content: (
            <div className="text-[#10b981] text-[10px] leading-none break-all animate-pulse">
              01001110 01000101 01000101 01010010 01000001 01001010 λ§#░█*+~ 0xNEERAJ
            </div>
          ),
        };
        break;

      case "clear":
        setLogs([]);
        return;

      default:
        sound.playError();
        outputEntry = {
          id: Math.random().toString(),
          type: "error",
          content: <div className="text-red-400 text-xs">Unknown: &quot;{cmdStr}&quot;. Try &apos;whoami&apos;, &apos;stack&apos;, &apos;matrix&apos;.</div>,
        };
        break;
    }

    setLogs((prev) => [...prev, cmdEntry, outputEntry]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playClick(0.9 + Math.random() * 0.3);
    if (e.key === "Enter") {
      executeCommand(input);
      setInput("");
    }
  };

  return (
    <div className="w-[420px] sm:w-[480px] rounded-3xl border border-[#10b981]/30 bg-[#080b10]/95 p-6 shadow-2xl backdrop-blur-2xl font-mono relative overflow-hidden">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold">// 02</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-bold">
            WEB TERMINAL CLI
          </span>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setLogs([]);
          }}
          className="text-gray-500 hover:text-white transition-colors"
          title="Clear Logs"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Terminal Viewport */}
      <div
        className="rounded-xl border border-white/10 bg-[#05070a] p-4 h-64 overflow-y-auto space-y-2 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {logs.map((log) => (
          <div key={log.id}>
            {log.type === "command" ? (
              <div className="text-xs text-[#00f0ff] font-bold">
                <span className="text-[#10b981]">neeraj@deck:~$ </span>
                {log.content}
              </div>
            ) : (
              <div className="pl-3 border-l border-white/10">{log.content}</div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-2 text-xs pt-1">
          <span className="text-[#10b981] font-bold">neeraj@deck:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs caret-[#00f0ff]"
            placeholder="type command..."
          />
        </div>
        <div ref={terminalEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-white/10">
        <span className="text-[10px] text-gray-500 font-bold mr-1">RUN:</span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            onMouseEnter={() => sound.playHover()}
            className="px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-[#10b981]/15 border border-white/8 text-gray-300 hover:text-[#10b981] text-[10px] transition-all active:scale-95 cursor-pointer"
          >
            ${cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
