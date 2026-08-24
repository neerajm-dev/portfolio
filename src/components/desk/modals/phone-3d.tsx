"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";
import {
  X,
  ExternalLink,
  RotateCcw,
  Wifi,
  Battery,
  Signal,
  Home,
  ChevronLeft,
  Terminal,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  RefreshCw,
  Layers,
} from "lucide-react";
import { GithubIcon } from "@/components/icons";

interface Phone3DProps {
  onClose: () => void;
  theme?: WorkstationTheme;
  onOpenTerminal?: () => void;
  onOpenIdCard?: () => void;
}

type PhoneScreenState = "home" | "splash" | "app";

export function Phone3D({
  onClose,
  theme = DEFAULT_THEME,
  onOpenTerminal,
  onOpenIdCard,
}: Phone3DProps) {
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [screenState, setScreenState] = useState<PhoneScreenState>("home");
  const [currentTime, setCurrentTime] = useState("12:00");
  const [iframeKey, setIframeKey] = useState(0);
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);
  const splashTimerRef = useRef<NodeJS.Timeout | null>(null);

  const themeHex = theme.hex;

  const normalizedY = ((rotY % 360) + 360) % 360;
  const isFrontFacing = normalizedY < 90 || normalizedY > 270;

  // Live status bar time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup splash timer
  useEffect(() => {
    return () => {
      if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicking an interactive button, link or iframe, do not capture pointer for drag rotation
    if ((e.target as HTMLElement).closest("button, a, input, [role='button'], iframe")) {
      return;
    }

    isDragging.current = true;
    pointerStart.current = { x: e.clientX, y: e.clientY };
    startRot.current = { x: rotX, y: rotY };
    dragDistance.current = 0;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    dragDistance.current = Math.hypot(dx, dy);

    // Smooth horizontal spin + constrained vertical tilt
    const newY = startRot.current.y + dx * 0.65;
    const newX = Math.max(-35, Math.min(35, startRot.current.x - dy * 0.65));
    setRotY(newY);
    setRotX(newX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleFlipPhone = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playNodePulse();
    const currentNormalized = Math.round(rotY / 180) * 180;
    const targetY = currentNormalized + 180;
    setRotY(targetY);
    setRotX(0);
  };

  const handleResetOrientation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    setRotX(0);
    setRotY(0);
  };

  const launchKtccApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playSuccess();
    setScreenState("splash");
    setIsIframeLoading(true);

    if (splashTimerRef.current) clearTimeout(splashTimerRef.current);
    splashTimerRef.current = setTimeout(() => {
      setScreenState("app");
    }, 1100);
  };

  const handleBackToHome = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    setScreenState("home");
  };

  const handleReloadIframe = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick(1.3);
    setIsIframeLoading(true);
    setIframeKey((k) => k + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.22 }}
      className="relative flex flex-col items-center justify-center p-2 sm:p-4 select-none max-h-[95vh]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 🟢 TOP CONTROLS & HUD BAR */}
      <div className="w-full max-w-[360px] flex items-center justify-between gap-2 mb-3 z-30 font-mono text-xs">
        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md border border-[#00ff66]/30 px-2.5 py-1 rounded-[6px]">
          <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: themeHex }} />
          <span className="font-bold text-[11px] tracking-wider" style={{ color: themeHex }}>
            SMARTPHONE // 3D SPATIAL
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFlipPhone}
            title="Flip Phone 180°"
            className="flex items-center gap-1 bg-black/80 hover:bg-[#00ff66]/20 border border-[#00ff66]/40 text-[#00ff66] px-2 py-1 rounded-[6px] transition-all cursor-pointer text-[10px] font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>FLIP</span>
          </button>

          <button
            onClick={handleResetOrientation}
            title="Reset 3D Tilt"
            className="bg-black/80 hover:bg-[#00ff66]/20 border border-[#00ff66]/40 text-[#00ff66] px-2 py-1 rounded-[6px] transition-all cursor-pointer text-[10px] font-bold"
          >
            RESET
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            title="Close Phone View [ESC]"
            className="flex items-center gap-1 bg-black/80 hover:bg-[#00ff66]/30 border border-[#00ff66] text-[#00ff66] px-2 py-1 rounded-[6px] transition-all cursor-pointer text-[11px] font-bold shadow-[0_0_10px_rgba(0,255,102,0.2)]"
          >
            <X className="w-3.5 h-3.5" />
            <span>ESC</span>
          </button>
        </div>
      </div>

      {/* 🟢 3D PHONE VIEWPORT & CHASSIS CONTAINER */}
      <div
        className="w-[330px] sm:w-[360px] h-[610px] sm:h-[660px] [perspective:1400px] shrink-0 touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            transition: isDragging.current ? "none" : "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className="w-full h-full relative [transform-style:preserve-3d]"
        >
          {/* ========================================================================= */}
          {/* 🟢 SIDE A: FRONT FACE (FLAGSHIP DISPLAY & MOBILE CYBER OS)                 */}
          {/* ========================================================================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(8px)",
              borderColor: `${themeHex}88`,
              boxShadow: `0 0 45px ${themeHex}2e, 0 20px 40px rgba(0,0,0,0.9)`,
              pointerEvents: isFrontFacing ? "auto" : "none",
              zIndex: isFrontFacing ? 20 : 5,
            }}
            className="absolute inset-0 w-full h-full bg-[#05080c] border-[3px] rounded-[38px] p-3 font-mono overflow-hidden flex flex-col justify-between"
          >
            {/* Phone Outer Bezel Ring Highlight */}
            <div className="absolute inset-0 rounded-[35px] border border-white/10 pointer-events-none z-40" />

            {/* Subtle Screen Reflection Gradient */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none z-30" />

            {/* Dynamic Island Camera Notch Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-black border border-neutral-800 rounded-full z-40 flex items-center justify-between px-2.5 shadow-md">
              <div className="w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-cyan-500/80" />
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40 animate-pulse" />
            </div>

            {/* Live Mobile Status Bar */}
            <div className="relative z-30 flex items-center justify-between px-4 pt-1 text-[10px] font-bold text-neutral-300">
              <span>{currentTime}</span>
              <div className="flex items-center gap-1.5 text-neutral-300">
                <Signal className="w-3 h-3 text-[#00ff66]" />
                <span className="text-[9px] font-mono text-[#00ff66]">5G</span>
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-[#00ff66]" />
              </div>
            </div>

            {/* 🟢 SCREEN VIEW CONTENT (HOME / SPLASH / APP) */}
            <div className="relative z-20 flex-1 w-full mt-2 mb-1.5 rounded-[26px] overflow-hidden bg-black flex flex-col">
              <AnimatePresence mode="wait">
                {/* 1. HOMESCREEN STATE */}
                {screenState === "home" && (
                  <motion.div
                    key="home"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 w-full h-full p-3.5 flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#091811] via-[#040808] to-black"
                  >
                    {/* Matrix Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.04)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                    {/* Clock & Telemetry Widget */}
                    <div className="relative z-10 pt-4 text-center">
                      <div className="text-3xl font-black tracking-tight" style={{ color: themeHex }}>
                        {currentTime}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-medium">
                        KERALA, IN • 28°C CLEAR
                      </div>

                      {/* Flagship Banner Pill */}
                      <div className="mt-3 inline-flex items-center gap-1.5 border border-[#00ff66]/40 bg-[#00ff66]/10 px-2.5 py-1 rounded-full text-[9px] font-bold text-[#00ff66]">
                        <Zap className="w-3 h-3 animate-pulse" />
                        <span>FLAGSHIP APP AVAILABLE</span>
                      </div>
                    </div>

                    {/* App Grid */}
                    <div className="relative z-10 my-auto py-2">
                      <div className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider mb-2 px-1">
                        INSTALLED APPS
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {/* 🏎️ KTCC FLAGSHIP APP ICON */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={launchKtccApp}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#003816] via-[#001f0c] to-black border-2 border-[#00ff66] flex items-center justify-center shadow-[0_0_18px_rgba(0,255,102,0.45)] group-hover:shadow-[0_0_26px_rgba(0,255,102,0.7)] transition-all">
                            {/* Notification Badge */}
                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00ff66] text-black font-extrabold text-[8px] flex items-center justify-center">
                              1
                            </span>
                            <div className="font-black text-sm tracking-tighter text-[#00ff66]">
                              KTCC
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-[#00ff66] group-hover:text-white transition-colors">
                            KTCC Live
                          </span>
                        </motion.button>

                        {/* Terminal CLI App */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => {
                            sound.playClick();
                            onClose();
                            onOpenTerminal?.();
                          }}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-neutral-900/90 border border-neutral-700 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all">
                            <Terminal className="w-6 h-6 text-cyan-400" />
                          </div>
                          <span className="text-[10px] font-medium text-neutral-400 group-hover:text-cyan-300">
                            Terminal
                          </span>
                        </motion.button>

                        {/* Identity Card App */}
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={() => {
                            sound.playClick();
                            onClose();
                            onOpenIdCard?.();
                          }}
                          className="flex flex-col items-center gap-1 group cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-neutral-900/90 border border-neutral-700 flex items-center justify-center group-hover:border-amber-400 group-hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all">
                            <ShieldCheck className="w-6 h-6 text-amber-400" />
                          </div>
                          <span className="text-[10px] font-medium text-neutral-400 group-hover:text-amber-300">
                            ID Badge
                          </span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Quick Platform Metrics Card */}
                    <div className="relative z-10 border border-[#00ff66]/30 bg-black/70 rounded-xl p-2.5 space-y-1 text-[10px]">
                      <div className="font-bold text-[#00ff66] flex items-center gap-1 border-b border-[#00ff66]/20 pb-1">
                        <Sparkles className="w-3 h-3" />
                        <span>FLAGSHIP PLATFORM // KTCC</span>
                      </div>
                      <div className="text-neutral-400 leading-tight">
                        • 100% $0/mo Free Tier Cloud Infra
                      </div>
                      <div className="text-neutral-400 leading-tight">
                        • Double-Entry Immutable Ledger
                      </div>
                      <div className="text-neutral-400 leading-tight">
                        • GitHub Actions Headless APK CI/CD
                      </div>
                    </div>

                    {/* Bottom Dock Bar */}
                    <div className="relative z-10 mt-2 bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl p-2 flex items-center justify-around">
                      <a
                        href="https://github.com/neerajm-dev"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => sound.playClick()}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                        title="GitHub Profile"
                      >
                        <GithubIcon className="w-5 h-5" />
                      </a>

                      <button
                        onClick={launchKtccApp}
                        className="p-1.5 text-[#00ff66] hover:scale-110 transition-transform"
                        title="Launch KTCC"
                      >
                        <Globe className="w-5 h-5" />
                      </button>

                      <a
                        href="mailto:hi.neerajm@gmail.com"
                        onClick={() => sound.playClick()}
                        className="p-1.5 text-neutral-400 hover:text-white transition-colors"
                        title="Send Email"
                      >
                        <Zap className="w-5 h-5" />
                      </a>
                    </div>
                  </motion.div>
                )}

                {/* 2. NATIVE SPLASH SCREEN TRANSITION STATE */}
                {screenState === "splash" && (
                  <motion.div
                    key="splash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="flex-1 w-full h-full p-4 flex flex-col items-center justify-between bg-black text-[#00ff66] relative overflow-hidden"
                  >
                    {/* Glowing Aura */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,102,0.18)_0%,transparent_70%)] pointer-events-none" />

                    <div className="pt-8 text-center space-y-1">
                      <div className="text-[10px] tracking-widest text-[#00ff66]/70 uppercase font-mono">
                        // INITIALIZING SESSION //
                      </div>
                    </div>

                    {/* Splash Center Logo & Car Badge */}
                    <div className="flex flex-col items-center gap-3 text-center">
                      <motion.div
                        animate={{ scale: [0.95, 1.05, 1], rotate: [0, -2, 0] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#003816] via-[#001509] to-black border-2 border-[#00ff66] flex items-center justify-center shadow-[0_0_35px_rgba(0,255,102,0.6)]"
                      >
                        <span className="font-black text-2xl tracking-tighter text-[#00ff66]">
                          KTCC
                        </span>
                      </motion.div>

                      <div>
                        <div className="font-black text-sm tracking-wider text-white">
                          KERALA TOURERS
                        </div>
                        <div className="text-[10px] text-[#00ff66] font-bold tracking-widest">
                          COMMUNITY CHAMPIONSHIP
                        </div>
                      </div>

                      {/* Loading Progress Bar */}
                      <div className="w-36 h-1 bg-[#00ff66]/20 rounded-full overflow-hidden mt-3">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 1.0, ease: "easeInOut" }}
                          className="h-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]"
                        />
                      </div>
                    </div>

                    <div className="pb-6 text-center text-[9px] text-[#00ff66]/60">
                      <div>v2.4.0-release • Supabase APAC</div>
                      <div>DOUBLE-ENTRY LEDGER SECURED</div>
                    </div>
                  </motion.div>
                )}

                {/* 3. LIVE EMBEDDED KTCC APP STATE */}
                {screenState === "app" && (
                  <motion.div
                    key="app"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 w-full h-full flex flex-col bg-black relative"
                  >
                    {/* In-App Browser Navigation Header */}
                    <div className="bg-[#001207] border-b border-[#00ff66]/30 px-2.5 py-1.5 flex items-center justify-between text-[10px] z-20">
                      <button
                        onClick={handleBackToHome}
                        className="flex items-center gap-0.5 text-[#00ff66] hover:bg-[#00ff66]/20 px-1.5 py-0.5 rounded font-bold transition-all cursor-pointer"
                        title="Back to Homescreen"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>HOME</span>
                      </button>

                      <div className="flex items-center gap-1 text-[9px] font-mono text-[#00ff66]/80 truncate max-w-[150px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                        <span className="truncate">ktccofficial.vercel.app</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={handleReloadIframe}
                          className="p-1 text-[#00ff66] hover:bg-[#00ff66]/20 rounded transition-all cursor-pointer"
                          title="Reload Platform"
                        >
                          <RefreshCw className={`w-3 h-3 ${isIframeLoading ? "animate-spin" : ""}`} />
                        </button>

                        <a
                          href="https://ktccofficial.vercel.app"
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => sound.playClick(1.2)}
                          className="p-1 text-[#00ff66] hover:bg-[#00ff66]/20 rounded transition-all"
                          title="Open Live Fullscreen"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Live Embedded Iframe */}
                    <div className="flex-1 w-full h-full relative bg-black">
                      {isIframeLoading && (
                        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center gap-2 z-10 text-[#00ff66] text-xs">
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          <span>CONNECTING TO APAC CDN...</span>
                        </div>
                      )}

                      <iframe
                        key={iframeKey}
                        src="https://ktccofficial.vercel.app"
                        title="KTCC Flagship Tournament Platform"
                        className="w-full h-full border-none bg-black"
                        onLoad={() => setIsIframeLoading(false)}
                      />
                    </div>

                    {/* Bottom Mobile Home Gesture Bar */}
                    <div
                      onClick={handleBackToHome}
                      className="bg-black/90 border-t border-neutral-800 py-1 flex items-center justify-center cursor-pointer hover:bg-neutral-900 transition-colors"
                      title="Tap to return to Homescreen"
                    >
                      <div className="w-24 h-1 rounded-full bg-neutral-500 hover:bg-[#00ff66] transition-colors" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Screen Indicator Bar */}
            <div className="relative z-30 flex items-center justify-center pb-0.5">
              <div className="w-28 h-1 rounded-full bg-neutral-700" />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🟢 SIDE B: BACK FACE (FLAGSHIP HARDWARE & TRIPLE CAMERA MODULE)            */}
          {/* ========================================================================= */}
          <div
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(8px)",
              borderColor: `${themeHex}77`,
              boxShadow: `0 0 45px ${themeHex}25, 0 20px 40px rgba(0,0,0,0.9)`,
              pointerEvents: !isFrontFacing ? "auto" : "none",
              zIndex: !isFrontFacing ? 20 : 5,
            }}
            className="absolute inset-0 w-full h-full bg-[#080d14] border-[3px] rounded-[38px] p-5 font-mono overflow-hidden flex flex-col justify-between text-[#00ff66]"
          >
            {/* Brushed Titanium Finish Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neutral-900/90 via-[#0a111a] to-[#04070a] pointer-events-none" />

            {/* Cyber Circuit Overlays */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Top Back Header: Triple Camera Bump Module */}
            <div className="relative z-20 flex items-start justify-between">
              {/* Flagship Camera Island */}
              <div className="w-32 h-32 rounded-3xl bg-[#030609] border border-neutral-700 p-2.5 grid grid-cols-2 gap-2 shadow-2xl relative">
                {/* Lens 1: 50MP Wide Sensor */}
                <div className="w-11 h-11 rounded-full bg-black border-2 border-neutral-600 flex items-center justify-center shadow-inner relative">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-cyan-500/60 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />
                  </div>
                  <span className="absolute -bottom-0.5 right-0.5 text-[6px] font-bold text-neutral-400">50M</span>
                </div>

                {/* Lens 2: 12MP Ultra-Wide Sensor */}
                <div className="w-11 h-11 rounded-full bg-black border-2 border-neutral-600 flex items-center justify-center shadow-inner relative">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-emerald-500/60 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/40" />
                  </div>
                  <span className="absolute -bottom-0.5 right-0.5 text-[6px] font-bold text-neutral-400">12M</span>
                </div>

                {/* Lens 3: Periscope Telephoto */}
                <div className="w-11 h-11 rounded-full bg-black border-2 border-neutral-600 flex items-center justify-center shadow-inner relative">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 border border-indigo-500/60 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-400/40" />
                  </div>
                  <span className="absolute -bottom-0.5 right-0.5 text-[6px] font-bold text-neutral-400">5X</span>
                </div>

                {/* Flash & LiDAR Sensor Ring */}
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-4 h-4 rounded-full bg-amber-200/90 border border-amber-300 shadow-[0_0_8px_#fde68a]" />
                  <div className="w-3 h-3 rounded-full bg-neutral-800 border border-neutral-600" />
                </div>
              </div>

              {/* Laser Engraved Spec Badge */}
              <div className="text-right space-y-0.5">
                <div className="text-[10px] font-black tracking-wider text-white">
                  0xNEERAJ
                </div>
                <div className="text-[8px] text-[#00ff66]/70">
                  FLAGSHIP DEV EDITION
                </div>
                <div className="text-[8px] text-neutral-500">
                  MODEL: N26-PRO
                </div>
              </div>
            </div>

            {/* Glowing Qi / MagSafe Wireless Charging Matrix */}
            <div className="relative z-20 my-auto flex flex-col items-center justify-center">
              <div className="w-28 h-28 rounded-full border border-dashed border-[#00ff66]/40 flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-20 h-20 rounded-full border border-[#00ff66]/25 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#00ff66]/10 border border-[#00ff66]/60 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-[#00ff66]" />
                  </div>
                </div>
              </div>
              <div className="text-[9px] font-bold tracking-widest text-[#00ff66]/70 mt-2">
                NFC // ZERO-COST CLOUD
              </div>
            </div>

            {/* Bottom Chassis Engravings */}
            <div className="relative z-20 border-t border-neutral-800 pt-3 space-y-1.5 text-[9px] text-neutral-400">
              <div className="flex items-center justify-between">
                <span className="text-[#00ff66]">ARCHITECT:</span>
                <span className="font-bold text-white">NEERAJ M (19yo)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#00ff66]">ORIGIN:</span>
                <span>KERALA, INDIA</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#00ff66]">SYSTEM:</span>
                <span>NEERAJ_OS v2.4.0</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[8px] text-neutral-500">
                <span>[ DRAG TO ROTATE ]</span>
                <button
                  onClick={handleFlipPhone}
                  className="text-[#00ff66] hover:underline font-bold"
                >
                  [ FLIP TO FRONT ]
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Helper Footer Hint */}
      <div className="mt-2 text-center text-[10px] font-mono text-neutral-500 flex items-center gap-2">
        <span>💡 Drag phone to rotate in 3D</span>
        <span>•</span>
        <span>Tap KTCC App to launch</span>
      </div>
    </motion.div>
  );
}
