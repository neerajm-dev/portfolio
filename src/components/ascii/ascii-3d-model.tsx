"use client";

import { useEffect, useRef, useState } from "react";

export function Ascii3DModel() {
  const [asciiFrame, setAsciiFrame] = useState<string>("");
  const mousePos = useRef({ x: 0, y: 0 });
  const angles = useRef({ A: 0, B: 0 });

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mousePos.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const renderTorus = () => {
      // 3D ASCII Torus projection algorithm
      const A = (angles.current.A += 0.04 + mousePos.current.y * 0.03);
      const B = (angles.current.B += 0.02 + mousePos.current.x * 0.03);

      const screenWidth = 52;
      const screenHeight = 22;
      const b: string[] = [];
      const z: number[] = [];

      for (let k = 0; k < screenWidth * screenHeight; k++) {
        b[k] = " ";
        z[k] = 0;
      }

      const cosA = Math.cos(A), sinA = Math.sin(A);
      const cosB = Math.cos(B), sinB = Math.sin(B);

      for (let theta = 0; theta < 6.28; theta += 0.08) {
        const costheta = Math.cos(theta), sintheta = Math.sin(theta);

        for (let phi = 0; phi < 6.28; phi += 0.03) {
          const cosphi = Math.cos(phi), sinphi = Math.sin(phi);

          const circlex = 2 + costheta;
          const circley = sintheta;

          const x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
          const y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
          const z_depth = 5 + cosA * circlex * sinphi + circley * sinA;
          const ooz = 1 / z_depth;

          const xp = Math.floor(screenWidth / 2 + 24 * ooz * x);
          const yp = Math.floor(screenHeight / 2 + 11 * ooz * y);

          // Luminance index calculation
          const L =
            cosphi * costheta * sinB -
            cosA * costheta * sinphi -
            sinA * sintheta +
            cosB * (cosA * sintheta - costheta * sinA * sinphi);

          if (L > 0) {
            const index = xp + screenWidth * yp;
            if (yp >= 0 && yp < screenHeight && xp >= 0 && xp < screenWidth && ooz > z[index]) {
              z[index] = ooz;
              const luminanceChars = ".,-~:;=!*#$@";
              const charIdx = Math.floor(L * 8);
              b[index] = luminanceChars[Math.max(0, Math.min(charIdx, luminanceChars.length - 1))];
            }
          }
        }
      }

      let output = "";
      for (let i = 0; i < screenHeight; i++) {
        output += b.slice(i * screenWidth, (i + 1) * screenWidth).join("") + "\n";
      }

      setAsciiFrame(output);
      animId = requestAnimationFrame(renderTorus);
    };

    renderTorus();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="border border-[#00ff66]/30 bg-black p-4 rounded-none shadow-[0_0_20px_rgba(0,255,102,0.1)] text-[#00ff66] font-mono text-center select-none overflow-hidden">
      <div className="text-[10px] text-[#00ff66]/60 border-b border-[#00ff66]/20 pb-1 mb-2 flex justify-between font-mono">
        <span>// 3D ASCII ROTATION ENGINE (60 FPS)</span>
        <span>INTERACTIVE: MOVE MOUSE</span>
      </div>
      <pre className="text-[9px] sm:text-[11px] leading-[1.05] tracking-tighter text-[#00ff66] font-mono whitespace-pre flex justify-center drop-shadow-[0_0_6px_rgba(0,255,102,0.6)]">
        {asciiFrame}
      </pre>
    </div>
  );
}
