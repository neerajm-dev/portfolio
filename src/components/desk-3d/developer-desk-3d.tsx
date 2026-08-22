"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";

import { SceneCanvas, InteractivePropId } from "./scene-canvas";
import { AsciiIdCard } from "@/components/ascii/ascii-id-card";
import { KtccModal } from "@/components/desk/modals/ktcc-modal";
import { NotesModal } from "@/components/desk/modals/notes-modal";

import { Volume2, VolumeX, X, HelpCircle, Terminal, CornerDownLeft, Sparkles, RotateCcw, Palette } from "lucide-react";
import { WORKSTATION_THEMES, WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

type ModalType = "none" | "id-card" | "phone" | "sticky-note";

const QUICK_COMMANDS = ["help", "whoami", "ktcc", "brotoraise", "stack", "socials", "color", "reset", "clear"];

const buildColorPickerLines = (selectedIndex: number, currentActiveId: string): string[] => {
  const lines = [
    "┌── [ WORKSTATION RGB PROFILE SELECTOR ] ─────────────────────────┐",
    "│  Use [↑ / ↓] to live-preview, [ENTER] to save, [ESC] to cancel  │",
    "├─────────────────────────────────────────────────────────────────┤",
  ];

  WORKSTATION_THEMES.forEach((thm, idx) => {
    const isSelected = idx === selectedIndex;
    const isActive = thm.id === currentActiveId;
    const marker = isSelected ? "  ●" : "   ";
    const activeTag = isActive ? " [ACTIVE]" : "";
    const num = idx + 1;
    lines.push(`${marker} ${num}. ${thm.name.padEnd(18)} [${thm.hex}]${activeTag}`);
  });

  lines.push("└─────────────────────────────────────────────────────────────────┘");
  return lines;
};

export function DeveloperDesk3D() {
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [caffeine, setCaffeine] = useState(99);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [idCardFacing, setIdCardFacing] = useState<"front" | "back">("front");
  const [cameraResetCount, setCameraResetCount] = useState(0);

  const [activeTheme, setActiveTheme] = useState<WorkstationTheme>(DEFAULT_THEME);
  const [pickerMode, setPickerMode] = useState<"none" | "color">("none");
  const [pickerIndex, setPickerIndex] = useState(0);
  const previousThemeRef = useRef<WorkstationTheme>(DEFAULT_THEME);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Kolkata",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const ms = String(now.getMilliseconds()).padStart(3, "0");
      setTime(`${timeStr}.${ms}`);

      setDate(
        now.toLocaleDateString("en-GB", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).toUpperCase()
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 33);
    return () => clearInterval(interval);
  }, []);

  const handleResetCamera = useCallback(() => {
    setCameraResetCount((c) => c + 1);
    sound.playClick(1.2);
  }, []);

  const handleCommand = useCallback((cmdStr: string) => {
    const clean = cmdStr.trim().toLowerCase();
    if (!clean) return;

    sound.playClick(1.2);

    const tokens = clean.split(/\s+/);
    const primary = tokens[0];
    const arg = tokens.slice(1).join(" ").trim();

    let responseLine = "";

    if (primary === "color" || primary === "theme") {
      if (!arg) {
        // Enter interactive picker mode with live preview
        previousThemeRef.current = activeTheme;
        const currIdx = Math.max(0, WORKSTATION_THEMES.findIndex((t) => t.id === activeTheme.id));
        setPickerIndex(currIdx);
        setPickerMode("color");
        const menuLines = buildColorPickerLines(currIdx, activeTheme.id);
        setTerminalLines((prev) => [
          ...prev.slice(-6),
          `[neeraj@sys ~]$ ${cmdStr}`,
          ...menuLines,
        ]);
        setInput("");
        return;
      } else {
        // Direct command: color <name> or color <hex>
        const matched = WORKSTATION_THEMES.find(
          (t) => t.id === arg || t.name.toLowerCase().includes(arg) || t.hex.toLowerCase() === arg
        );
        if (matched) {
          setActiveTheme(matched);
          responseLine = `[OK] Theme accent changed to ${matched.name.toUpperCase()} (${matched.hex})`;
        } else {
          responseLine = `[ERR] Unknown color: "${arg}". Available: green, cyan, amber, purple, red, ice. Or type 'color' for interactive menu.`;
        }
      }
    } else {
      switch (clean) {
        case "help":
          responseLine = "[HELP] Commands: whoami, avatar, ktcc, brotoraise, stack, socials, color, reset, clear";
          break;
        case "whoami":
          responseLine = "[WHOAMI] Neeraj M (19yo) // BCA @ SNCT Kollam, Kerala";
          break;
        case "avatar":
        case "neeraj":
          responseLine = "[IMG:avatar]";
          break;
        case "ktcc":
          responseLine = "[KTCC] Tournament platform // Double-entry SQL ledger // $0.00/mo";
          setActiveModal("phone");
          break;
        case "brotoraise":
          responseLine = "[BROTORAISE] Complaint Management System // Next.js + Postgres";
          break;
        case "stack":
          responseLine = "[STACK] Vercel Hobby + Supabase ACID + Cloudflare R2 + GitHub Actions";
          break;
        case "socials":
          responseLine = "[LINKS] GitHub: neerajm-dev | IG: @neerajm_dev | Mail: neerajm2k7@gmail.com";
          break;
        case "reset":
        case "home":
          responseLine = "[OK] Camera view restored to origin";
          handleResetCamera();
          break;
        case "clear":
          setTerminalLines([]);
          setInput("");
          setHistoryIndex(-1);
          return;
        default:
          responseLine = `[ERR] Unknown command: "${clean}". Type 'help'.`;
          break;
      }
    }

    setTerminalLines((prev) => [
      ...prev.slice(-12),
      `[neeraj@sys ~]$ ${cmdStr}`,
      responseLine,
    ]);
    setCommandHistory((prev) => [...prev, cmdStr]);
    setHistoryIndex(-1);
    setInput("");
  }, [activeTheme, handleResetCamera]);

  // Global Keyboard Listener — Streams every keypress directly into the 3D laptop screen
  useEffect(() => {
    setSoundEnabled(sound.getEnabled());

    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal is open, only handle Escape
      if (activeModal !== "none") {
        if (e.key === "Escape") {
          setActiveModal("none");
          sound.playClick();
        }
        return;
      }

      // If help dialog is open
      if (showHelp) {
        if (e.key === "Escape" || e.key === "?") {
          setShowHelp(false);
          sound.playClick();
        }
        return;
      }

      // 0. Interactive CLI Color Picker Mode
      if (pickerMode === "color") {
        if (e.key === "ArrowUp") {
          e.preventDefault();
          const nextIdx = (pickerIndex - 1 + WORKSTATION_THEMES.length) % WORKSTATION_THEMES.length;
          setPickerIndex(nextIdx);
          const nextTheme = WORKSTATION_THEMES[nextIdx];
          setActiveTheme(nextTheme); // Live preview instantaneously!
          sound.playClick(1.3);
          const menuLines = buildColorPickerLines(nextIdx, previousThemeRef.current.id);
          setTerminalLines((prev) => [
            ...prev.slice(0, -menuLines.length),
            ...menuLines,
          ]);
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          const nextIdx = (pickerIndex + 1) % WORKSTATION_THEMES.length;
          setPickerIndex(nextIdx);
          const nextTheme = WORKSTATION_THEMES[nextIdx];
          setActiveTheme(nextTheme); // Live preview instantaneously!
          sound.playClick(1.3);
          const menuLines = buildColorPickerLines(nextIdx, previousThemeRef.current.id);
          setTerminalLines((prev) => [
            ...prev.slice(0, -menuLines.length),
            ...menuLines,
          ]);
          return;
        }

        if (/^[1-6]$/.test(e.key)) {
          e.preventDefault();
          const nextIdx = parseInt(e.key, 10) - 1;
          setPickerIndex(nextIdx);
          const nextTheme = WORKSTATION_THEMES[nextIdx];
          setActiveTheme(nextTheme);
          sound.playClick(1.3);
          const menuLines = buildColorPickerLines(nextIdx, previousThemeRef.current.id);
          setTerminalLines((prev) => [
            ...prev.slice(0, -menuLines.length),
            ...menuLines,
          ]);
          return;
        }

        if (e.key === "Enter") {
          e.preventDefault();
          const chosen = WORKSTATION_THEMES[pickerIndex];
          setActiveTheme(chosen);
          setPickerMode("none");
          sound.playNodePulse();
          setTerminalLines((prev) => [
            ...prev,
            `[OK] Profile saved: ${chosen.name.toUpperCase()} (${chosen.hex})`,
          ]);
          return;
        }

        if (e.key === "Escape") {
          e.preventDefault();
          const reverted = previousThemeRef.current;
          setActiveTheme(reverted);
          setPickerMode("none");
          sound.playClick();
          setTerminalLines((prev) => [
            ...prev,
            `[CANCEL] Restored previous profile: ${reverted.name.toUpperCase()}`,
          ]);
          return;
        }

        return;
      }

      // Don't intercept browser system shortcuts (Ctrl+R, Ctrl+Shift+R, Cmd+R, Ctrl+C, F5, F12, etc.)
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      // 0. Pure Shift+R or Alt+R -> Reset 3D Camera View
      if ((e.shiftKey && e.key.toLowerCase() === "r") || (e.altKey && e.key.toLowerCase() === "r")) {
        e.preventDefault();
        handleResetCamera();
        return;
      }

      // 1. Enter key -> Execute Command on Laptop Screen
      if (e.key === "Enter") {
        e.preventDefault();
        handleCommand(input);
        return;
      }

      // 2. Backspace key -> Delete character
      if (e.key === "Backspace") {
        e.preventDefault();
        sound.playClick(1.8);
        setInput((prev) => prev.slice(0, -1));
        return;
      }

      // 3. Tab key -> Auto-complete
      if (e.key === "Tab") {
        e.preventDefault();
        const matching = QUICK_COMMANDS.find((cmd) => cmd.startsWith(input.toLowerCase()));
        if (matching) {
          sound.playNodePulse();
          setInput(matching);
        }
        return;
      }

      // 4. ArrowUp -> Previous command in history
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length > 0) {
          const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
          setHistoryIndex(nextIdx);
          setInput(commandHistory[nextIdx]);
          sound.playHover();
        }
        return;
      }

      // 5. ArrowDown -> Next command in history
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex !== -1) {
          const nextIdx = historyIndex + 1;
          if (nextIdx >= commandHistory.length) {
            setHistoryIndex(-1);
            setInput("");
          } else {
            setHistoryIndex(nextIdx);
            setInput(commandHistory[nextIdx]);
          }
          sound.playHover();
        }
        return;
      }

      // 6. Escape -> Clear current typing input
      if (e.key === "Escape") {
        e.preventDefault();
        setInput("");
        setHistoryIndex(-1);
        sound.playClick();
        return;
      }

      // 7. Regular printable characters -> Append directly to input
      if (e.key.length === 1) {
        e.preventDefault();
        sound.playClick(1.3 + Math.random() * 0.4);
        setInput((prev) => prev + e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, showHelp, input, commandHistory, historyIndex, pickerMode, pickerIndex, handleCommand]);

  const handleSelectObject = useCallback((id: InteractivePropId) => {
    switch (id) {
      case "id-card":
        setActiveModal("id-card");
        break;
      case "laptop":
        sound.playClick(1.5);
        if (inputRef.current) inputRef.current.focus();
        break;
      case "phone":
        setActiveModal("phone");
        break;
      case "notes":
        setActiveModal("sticky-note");
        break;
      case "cassette":
        const next = sound.toggle();
        setSoundEnabled(next);
        break;
      case "coffee":
        sound.playHover();
        setCaffeine((prev) => (prev <= 15 ? 99 : prev - 20));
        setTerminalLines((prev) => [
          ...prev.slice(-5),
          `[SYS] Caffeine consumed. Remaining: ${caffeine > 15 ? caffeine - 20 : 99}%`,
        ]);
        break;
    }
  }, [caffeine]);

  const closeModal = () => {
    sound.playClick();
    setActiveModal("none");
  };

  const isBlurred = activeModal !== "none";

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black font-mono overflow-hidden select-none"
      style={{ color: activeTheme.hex }}
    >
      {/* 🟢 FULL VIEWPORT 3D WEBGL WORKSTATION SCENE */}
      <div
        className={`w-full h-full relative transition-all duration-300 ${
          isBlurred ? "brightness-[0.75] scale-[0.995] pointer-events-none" : ""
        }`}
      >
        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-25 z-10" />

        {/* 3D WebGL Canvas */}
        <SceneCanvas
          onSelectObject={handleSelectObject}
          terminalLines={terminalLines}
          currentInput={input}
          isPaused={isBlurred || showHelp}
          idCardFacing={idCardFacing}
          cameraResetCount={cameraResetCount}
          theme={activeTheme}
        />
      </div>

      {/* 🟢 TOP-RIGHT FLOATING TELEMETRY HUD (TIME, DATE & CONTROLS) */}
      <div className="fixed top-3 right-3 z-30 flex items-center gap-2 pointer-events-auto">
        {/* Developer IST Time & Date Telemetry Pill */}
        <div
          className="bg-black/75 backdrop-blur-md border px-3 py-1.5 rounded-[4px] flex items-center gap-2.5 text-[10px] sm:text-xs"
          style={{
            borderColor: `${activeTheme.hex}4d`,
            boxShadow: `0 0 15px ${activeTheme.hex}26`,
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: activeTheme.hex }}
            />
            <span className="font-bold hidden sm:inline" style={{ color: `${activeTheme.hex}99` }}>
              KERALA, IN
            </span>
            <span className="font-bold tracking-wider font-mono tabular-nums" style={{ color: activeTheme.hex }}>
              {time || "19:00:00.000"} IST
            </span>
          </div>
          <span style={{ color: `${activeTheme.hex}4d` }}>|</span>
          <span className="font-bold text-[9px] sm:text-[10px]" style={{ color: `${activeTheme.hex}cc` }}>
            {date || "22 AUG 2026"}
          </span>
        </div>

        {/* Reset Camera View Button */}
        <button
          onClick={handleResetCamera}
          className="bg-black/75 backdrop-blur-md border px-2.5 py-1.5 rounded-[4px] text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          style={{
            borderColor: `${activeTheme.hex}4d`,
            color: activeTheme.hex,
            boxShadow: `0 0 10px ${activeTheme.hex}1a`,
          }}
          title="Reset 3D Camera View (Shift+R / 'reset')"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">RESET</span>
        </button>

        {/* SFX Audio Toggle */}
        <button
          onClick={() => {
            const next = sound.toggle();
            setSoundEnabled(next);
          }}
          className="bg-black/75 backdrop-blur-md border px-2.5 py-1.5 rounded-[4px] text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5"
          style={{
            borderColor: `${activeTheme.hex}4d`,
            color: activeTheme.hex,
            boxShadow: `0 0 10px ${activeTheme.hex}1a`,
          }}
          title="Toggle Web Audio SFX"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
          <span className="hidden sm:inline">{soundEnabled ? "SFX" : "MUTED"}</span>
        </button>

        {/* Guide / Help Button */}
        <button
          onClick={() => setShowHelp((prev) => !prev)}
          className="bg-black/75 backdrop-blur-md border px-2 py-1.5 rounded-[4px] text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1"
          style={{
            borderColor: `${activeTheme.hex}4d`,
            color: activeTheme.hex,
            boxShadow: `0 0 10px ${activeTheme.hex}1a`,
          }}
          title="Controls Guide"
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 🟢 FOCUSED MODAL OVERLAYS */}
      <AnimatePresence>
        {activeModal !== "none" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex flex-col items-center justify-center p-3 sm:p-6"
          >
            {/* Selected Modal */}
            <div onClick={(e) => e.stopPropagation()} className="w-full flex items-center justify-center">
              {activeModal === "id-card" && (
                <AsciiIdCard
                  initialFacing={idCardFacing}
                  onFacingChange={setIdCardFacing}
                  theme={activeTheme}
                />
              )}
              {activeModal === "phone" && <KtccModal onClose={closeModal} />}
              {activeModal === "sticky-note" && (
                <NotesModal onClose={closeModal} theme={activeTheme} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 GUIDE / SHORTCUTS MODAL */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[440px] bg-[#000803] border-2 rounded-[8px] p-4 font-mono shadow-2xl space-y-3"
              style={{
                borderColor: activeTheme.hex,
                color: activeTheme.hex,
                boxShadow: `0 0 30px ${activeTheme.hex}40`,
              }}
            >
              <div
                className="flex items-center justify-between border-b pb-1.5 font-bold text-xs"
                style={{ borderColor: `${activeTheme.hex}4d` }}
              >
                <span>3D WORKSTATION CONTROLS</span>
                <button onClick={() => setShowHelp(false)} className="hover:underline cursor-pointer">
                  [ ✕ CLOSE ]
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>Mouse Drag</span>
                  <span>Orbit 3D Desk</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>Any Keyboard Key</span>
                  <span>Type on Laptop Screen</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>[ENTER]</span>
                  <span>Execute Command</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>[TAB]</span>
                  <span>Auto-Complete Command</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>[↑ / ↓]</span>
                  <span>History / Live Theme Preview</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>[color / theme]</span>
                  <span>Interactive RGB Theme Picker</span>
                </div>
                <div className="flex justify-between border-b pb-1" style={{ borderColor: `${activeTheme.hex}26` }}>
                  <span>[Shift + R]</span>
                  <span>Reset Camera View</span>
                </div>
                <div className="flex justify-between">
                  <span>[ESC]</span>
                  <span>Back to Desk / Cancel Menu</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
