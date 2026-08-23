"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";

import { DeskMat } from "./props/desk-mat";
import { LaptopProp } from "./props/laptop-prop";
import { IdCardProp } from "./props/id-card-prop";
import { PhoneProp } from "./props/phone-prop";
import { StickyNoteProp } from "./props/sticky-note-prop";
import { AudioDeckProp } from "./props/audio-deck-prop";
import { CoffeeMugProp } from "./props/coffee-mug-prop";

import { AsciiIdCard } from "@/components/ascii/ascii-id-card";
import { KtccModal } from "./modals/ktcc-modal";
import { NotesModal } from "./modals/notes-modal";
import { CoffeeModal } from "./modals/coffee-modal";
import { FullscreenTerminalModal } from "./modals/fullscreen-terminal-modal";
import { Volume2, VolumeX, X, HelpCircle } from "lucide-react";
import { DEVELOPER_PROFILE } from "@/lib/constants";

type ModalType = "none" | "id-card" | "phone" | "laptop-modal" | "sticky-note" | "coffee";

export function DeveloperDesk() {
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [time, setTime] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSoundEnabled(sound.getEnabled());

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        if (e.key === "Escape") {
          setActiveModal("none");
        }
        return;
      }

      if (e.key === "Escape") {
        setActiveModal("none");
        setShowHelp(false);
      } else if (e.key === "1") {
        sound.playNodePulse();
        setActiveModal("id-card");
      } else if (e.key === "2") {
        sound.playClick();
        setActiveModal("laptop-modal");
      } else if (e.key === "3") {
        sound.playNodePulse();
        setActiveModal("phone");
      } else if (e.key === "4") {
        sound.playClick();
        setActiveModal("sticky-note");
      } else if (e.key.toLowerCase() === "m") {
        const next = sound.toggle();
        setSoundEnabled(next);
      } else if (e.key === "?") {
        setShowHelp((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const closeModal = () => {
    sound.playClick();
    setActiveModal("none");
  };

  const isBlurred = activeModal !== "none";

  return (
    <div className="min-h-screen w-full bg-black text-[#00ff66] font-mono selection:bg-[#00ff66] selection:text-black flex flex-col justify-between relative overflow-x-hidden p-2 sm:p-4">
      {/* 🟢 TOP GLOBAL HUD BAR */}
      <header className="relative z-30 w-full max-w-6xl mx-auto flex items-center justify-between border-b border-[#00ff66]/30 pb-2 mb-2 sm:mb-4 text-[10px] sm:text-xs">
        <div className="flex items-center gap-2 font-bold tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
          <span className="drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">
            NEERAJ M // DEVELOPER WORKSTATION
          </span>
          <span className="hidden sm:inline text-[#00ff66]/40">|</span>
          <span className="hidden sm:inline text-[#00ff66]/60 text-[9px] sm:text-[10px]">
            SOLO SYSTEMS ARCHITECT ({DEVELOPER_PROFILE.age}YO)
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[#00ff66] font-bold text-[10px] sm:text-xs">
            {time || "19:00:00"} IST
          </span>

          <button
            onClick={() => {
              const next = sound.toggle();
              setSoundEnabled(next);
            }}
            className="flex items-center gap-1 border border-[#00ff66]/40 hover:border-[#00ff66] px-2 py-0.5 rounded-[3px] text-[9px] sm:text-[10px] font-bold hover:bg-[#00ff66]/10 transition-colors cursor-pointer"
            title="Toggle Synthesized SFX (Press M)"
          >
            {soundEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3 opacity-50" />}
            <span className="hidden sm:inline">{soundEnabled ? "SFX: ON" : "SFX: MUTED"}</span>
          </button>

          <button
            onClick={() => setShowHelp((prev) => !prev)}
            className="flex items-center gap-1 border border-[#00ff66]/40 hover:border-[#00ff66] px-1.5 py-0.5 rounded-[3px] text-[9px] sm:text-[10px] font-bold hover:bg-[#00ff66]/10 transition-colors cursor-pointer"
            title="Keyboard Shortcuts Guide (Press ?)"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden md:inline">GUIDE</span>
          </button>
        </div>
      </header>

      {/* 🟢 THE DESK WORKSPACE STAGE (With smooth blur on focus) */}
      <div
        className={`w-full max-w-6xl mx-auto flex-1 flex flex-col justify-center relative transition-all duration-300 ${
          isBlurred ? "filter blur-md brightness-[0.35] scale-[0.98] pointer-events-none" : ""
        }`}
      >
        {/* Desk Pad Mat Background */}
        <DeskMat timeStr={time} />

        {/* The Desk Props Arena */}
        <div className="relative z-20 py-4 sm:py-8 px-2 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center justify-items-center">
            {/* 🟢 LEFT SIDE OF DESK: ID Card + Sticky Note */}
            <div className="lg:col-span-3 w-full flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-6 order-2 lg:order-1">
              <IdCardProp onSelect={() => setActiveModal("id-card")} />
              <StickyNoteProp onSelect={() => setActiveModal("sticky-note")} />
            </div>

            {/* 🟢 CENTER OF DESK: Laptop with Active Embedded Terminal */}
            <div className="lg:col-span-6 w-full flex justify-center order-1 lg:order-2">
              <LaptopProp onExpand={() => setActiveModal("laptop-modal")} />
            </div>

            {/* 🟢 RIGHT SIDE OF DESK: Android Phone + Audio Deck + Coffee Mug */}
            <div className="lg:col-span-3 w-full flex flex-row lg:flex-col items-center justify-center gap-4 lg:gap-5 order-3">
              <PhoneProp onSelect={() => setActiveModal("phone")} />
              <div className="flex items-center gap-3">
                <AudioDeckProp />
                <CoffeeMugProp onSelect={() => setActiveModal("coffee")} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 BOTTOM QUICK LAUNCHER & TELEMETRY */}
      <footer className="relative z-30 w-full max-w-6xl mx-auto border-t border-[#00ff66]/30 pt-2 mt-2 sm:mt-4 flex flex-wrap items-center justify-between gap-2 text-[9px] sm:text-[10.5px]">
        <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-[#00ff66]/60 font-bold">DESK ITEMS:</span>
          <button
            onClick={() => {
              sound.playNodePulse();
              setActiveModal("id-card");
            }}
            className="px-2 py-0.5 border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/15 rounded-[3px] font-bold transition-all cursor-pointer"
          >
            [1] 🪪 ID CARD
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal("laptop-modal");
            }}
            className="px-2 py-0.5 border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/15 rounded-[3px] font-bold transition-all cursor-pointer"
          >
            [2] 💻 LAPTOP CLI
          </button>
          <button
            onClick={() => {
              sound.playNodePulse();
              setActiveModal("phone");
            }}
            className="px-2 py-0.5 border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/15 rounded-[3px] font-bold transition-all cursor-pointer"
          >
            [3] 📱 KTCC APP
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveModal("sticky-note");
            }}
            className="px-2 py-0.5 border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/15 rounded-[3px] font-bold transition-all cursor-pointer"
          >
            [4] 📝 NOTES
          </button>
          <button
            onClick={() => {
              sound.playSuccess();
              setActiveModal("coffee");
            }}
            className="px-2 py-0.5 border border-[#00ff66]/40 hover:border-[#00ff66] hover:bg-[#00ff66]/15 rounded-[3px] font-bold transition-all cursor-pointer text-[#00ff66]"
          >
            [5] ☕ SPONSOR
          </button>
        </div>

        <div className="text-[#00ff66]/70 flex items-center gap-2">
          <span>PORTFOLIO_v2 // $0 INFRA</span>
          <span className="text-[#00ff66] font-bold">[● OPERATIONAL]</span>
        </div>
      </footer>

      {/* 🟢 FOCUSED MODAL OVERLAY (With backdrop blur & ESC handler) */}
      <AnimatePresence>
        {activeModal !== "none" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6"
          >
            {/* Top Close Banner */}
            <div className="w-full max-w-[620px] flex justify-end mb-2">
              <button
                onClick={closeModal}
                className="flex items-center gap-1.5 border-2 border-[#00ff66] bg-black/90 hover:bg-[#00ff66]/20 px-3 py-1 rounded-[4px] font-bold text-xs text-[#00ff66] transition-all shadow-[0_0_15px_rgba(0,255,102,0.3)] cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>[ ✕ ESC / BACK TO DESK ]</span>
              </button>
            </div>

            {/* Render Selected Focused Prop Modal */}
            <div onClick={(e) => e.stopPropagation()}>
              {activeModal === "id-card" && <AsciiIdCard />}
              {activeModal === "phone" && <KtccModal onClose={closeModal} />}
              {activeModal === "sticky-note" && <NotesModal onClose={closeModal} />}
              {activeModal === "coffee" && <CoffeeModal onClose={closeModal} />}
              {activeModal === "laptop-modal" && (
                <FullscreenTerminalModal onClose={closeModal} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 SHORTCUTS / HELP MODAL */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHelp(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] bg-[#000803] border-2 border-[#00ff66] rounded-[8px] p-4 font-mono text-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.4)] space-y-3"
            >
              <div className="flex items-center justify-between border-b border-[#00ff66]/40 pb-1.5 font-bold text-xs">
                <span>DESK KEYBOARD CONTROLS</span>
                <button onClick={() => setShowHelp(false)} className="hover:underline cursor-pointer">
                  [ ✕ CLOSE ]
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between border-b border-[#00ff66]/20 pb-1">
                  <span>[1]</span>
                  <span>Inspect Hacker ID Card</span>
                </div>
                <div className="flex justify-between border-b border-[#00ff66]/20 pb-1">
                  <span>[2]</span>
                  <span>Open Fullscreen Laptop CLI</span>
                </div>
                <div className="flex justify-between border-b border-[#00ff66]/20 pb-1">
                  <span>[3]</span>
                  <span>Inspect KTCC Mobile Platform</span>
                </div>
                <div className="flex justify-between border-b border-[#00ff66]/20 pb-1">
                  <span>[4]</span>
                  <span>Open Onam Challenge Notes</span>
                </div>
                <div className="flex justify-between border-b border-[#00ff66]/20 pb-1">
                  <span>[M]</span>
                  <span>Toggle Synthesized Audio SFX</span>
                </div>
                <div className="flex justify-between">
                  <span>[ESC]</span>
                  <span>Return to Workstation Desk</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
