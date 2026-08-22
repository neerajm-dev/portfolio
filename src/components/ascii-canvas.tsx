"use client";

import { useEffect, useRef } from "react";

const GLYPHS = ["0", "1", "λ", "§", "#", "░", "█", "*", "+", "~", "/", "{", "}"];

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  char: string;
  size: number;
  opacity: number;
  baseOpacity: number;
  color: string;
  vx: number;
  vy: number;
}

export function AsciiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
      active: false,
    };

    const particles: Particle[] = [];
    const step = 38; // Grid density

    const initGrid = () => {
      particles.length = 0;
      for (let x = 15; x < width; x += step) {
        for (let y = 15; y < height; y += step) {
          const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          const isAccent = Math.random() > 0.85;
          const isEmerald = Math.random() > 0.9;
          const color = isEmerald
            ? "#10b981"
            : isAccent
            ? "#00f0ff"
            : "#3b82f6";
          const baseOpacity = isAccent ? 0.28 : 0.12;

          particles.push({
            x,
            y,
            originX: x,
            originY: y,
            char,
            size: Math.floor(Math.random() * 3) + 11,
            opacity: baseOpacity,
            baseOpacity,
            color,
            vx: 0,
            vy: 0,
          });
        }
      }
    };

    initGrid();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initGrid();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.02;

      ctx.font = "12px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Ambient sine wave floating
        const ambientX = Math.sin(time + p.originY * 0.05) * 2;
        const ambientY = Math.cos(time + p.originX * 0.05) * 2;

        // Mouse gravity calculations
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && mouse.active) {
          const force = (1 - dist / mouse.radius) * 22;
          const angle = Math.atan2(dy, dx);
          p.vx -= Math.cos(angle) * force * 0.2;
          p.vy -= Math.sin(angle) * force * 0.2;
          p.opacity = Math.min(0.9, p.baseOpacity + (1 - dist / mouse.radius) * 0.7);
        } else {
          p.opacity += (p.baseOpacity - p.opacity) * 0.05;
        }

        // Spring return to origin
        p.vx += (p.originX + ambientX - p.x) * 0.08;
        p.vy += (p.originY + ambientY - p.y) * 0.08;
        p.vx *= 0.75;
        p.vy *= 0.75;

        p.x += p.vx;
        p.y += p.vy;

        // Occasional character flicker
        if (Math.random() < 0.002) {
          p.char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillText(p.char, p.x, p.y);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      aria-hidden="true"
    />
  );
}
