"use client";

import { useEffect, useState, useRef } from "react";
import { sound } from "@/lib/sound";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`";

interface DecodeTextProps {
  text: string;
  className?: string;
  triggerOnHover?: boolean;
  delay?: number;
  speed?: number;
}

export function DecodeText({
  text,
  className = "",
  triggerOnHover = true,
  delay = 0,
  speed = 28,
}: DecodeTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const isDecoding = useRef(false);

  const startDecode = () => {
    if (isDecoding.current) return;
    isDecoding.current = true;
    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isDecoding.current = false;
      }

      iteration += 1 / 2;
    }, speed);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      startDecode();
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span
      className={`font-mono transition-colors ${className}`}
      onMouseEnter={() => {
        if (triggerOnHover) {
          sound.playHover();
          startDecode();
        }
      }}
    >
      {displayText}
    </span>
  );
}
