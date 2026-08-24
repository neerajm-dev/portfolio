/**
 * Curated Monospace Developer Font Profiles for 3D Cyber Terminal
 */

export interface TerminalFont {
  id: string;
  name: string;
  family: string;
  personality: string;
  badge: string;
  canvasFontSize: string;
  commandAlias: string;
}

export const TERMINAL_FONTS: TerminalFont[] = [
  {
    id: "jetbrains",
    name: "JetBrains Mono",
    family: "'JetBrains Mono', monospace",
    personality: "Developer / Modern",
    badge: "🧑‍💻 Modern",
    canvasFontSize: "bold 19px",
    commandAlias: "font jetbrains",
  },
  {
    id: "ibm-plex",
    name: "IBM Plex Mono",
    family: "'IBM Plex Mono', monospace",
    personality: "Industrial / System",
    badge: "🏭 Industrial",
    canvasFontSize: "bold 19px",
    commandAlias: "font ibm",
  },
  {
    id: "geist",
    name: "Geist Mono",
    family: "'Geist Mono', monospace",
    personality: "Minimal / Contemporary",
    badge: "✨ Minimal",
    canvasFontSize: "bold 19px",
    commandAlias: "font geist",
  },
  {
    id: "vt323",
    name: "VT323",
    family: "'VT323', monospace",
    personality: "Retro CRT / Hacker",
    badge: "🟢 Retro CRT",
    canvasFontSize: "bold 24px",
    commandAlias: "font vt323",
  },
  {
    id: "space",
    name: "Space Mono",
    family: "'Space Mono', monospace",
    personality: "Futuristic / Technical",
    badge: "🚀 Sci-Fi",
    canvasFontSize: "bold 18px",
    commandAlias: "font space",
  },
  {
    id: "fira-code",
    name: "Fira Code",
    family: "'Fira Code', monospace",
    personality: "Classic Coding / IDE",
    badge: "💻 Classic IDE",
    canvasFontSize: "bold 19px",
    commandAlias: "font fira",
  },
  {
    id: "source-code",
    name: "Source Code Pro",
    family: "'Source Code Pro', monospace",
    personality: "Clean / Professional",
    badge: "🧱 Clean",
    canvasFontSize: "bold 19px",
    commandAlias: "font source",
  },
  {
    id: "share-tech",
    name: "Share Tech Mono",
    family: "'Share Tech Mono', monospace",
    personality: "Cyberpunk HUD / Tactical",
    badge: "📡 Cyber HUD",
    canvasFontSize: "bold 20px",
    commandAlias: "font share",
  },
  {
    id: "press-start",
    name: "Press Start 2P",
    family: "'Press Start 2P', monospace",
    personality: "8-Bit Retro Arcade",
    badge: "🕹️ 8-Bit Arcade",
    canvasFontSize: "bold 12px",
    commandAlias: "font arcade",
  },
  {
    id: "ubuntu-mono",
    name: "Ubuntu Mono",
    family: "'Ubuntu Mono', monospace",
    personality: "Linux Distro Classic",
    badge: "🐧 Linux Classic",
    canvasFontSize: "bold 21px",
    commandAlias: "font ubuntu",
  },
  {
    id: "inconsolata",
    name: "Inconsolata",
    family: "'Inconsolata', monospace",
    personality: "Clean Terminal Legend",
    badge: "📜 Terminal Legend",
    canvasFontSize: "bold 20px",
    commandAlias: "font inconsolata",
  },
];

export const DEFAULT_TERMINAL_FONT: TerminalFont = TERMINAL_FONTS[0];

/**
 * Builds high-signal interactive ASCII menu lines for the terminal font picker
 */
export function buildFontPickerLines(selectedIndex: number, currentActiveId: string): string[] {
  const lines = [
    "┌── [ TERMINAL MONOSPACE FONT SELECTOR ] ─────────────────────────┐",
    "│  Use [↑ / ↓] to live-preview, [ENTER] to save, [ESC] to cancel  │",
    "├─────────────────────────────────────────────────────────────────┤",
  ];

  TERMINAL_FONTS.forEach((font, idx) => {
    const isSelected = idx === selectedIndex;
    const isActive = font.id === currentActiveId;
    const marker = isSelected ? "  ●" : "   ";
    const activeTag = isActive ? " [ACTIVE]" : "";
    const num = String(idx + 1).padStart(2, " ");
    lines.push(
      `[FONT_ROW:${font.id}:${isSelected ? "1" : "0"}:${isActive ? "1" : "0"}]${marker} ${num}. ${font.name}  → ${font.commandAlias}${activeTag}`
    );
  });

  lines.push("└─────────────────────────────────────────────────────────────────┘");
  return lines;
}

/**
 * Fuzzy search to match fonts by ID, name, or aliases
 */
export function findTerminalFont(query: string): TerminalFont | undefined {
  const clean = query.trim().toLowerCase();
  if (!clean) return undefined;

  // Direct ID or exact name match
  const direct = TERMINAL_FONTS.find(
    (f) => f.id.toLowerCase() === clean || f.name.toLowerCase() === clean
  );
  if (direct) return direct;

  // Alias / keyword matches
  const aliases: Record<string, string> = {
    jb: "jetbrains",
    jetbrains: "jetbrains",
    ibm: "ibm-plex",
    plex: "ibm-plex",
    geist: "geist",
    vt: "vt323",
    crt: "vt323",
    retro: "vt323",
    hacker: "vt323",
    matrix: "vt323",
    space: "space",
    spacemono: "space",
    scifi: "space",
    fira: "fira-code",
    firacode: "fira-code",
    source: "source-code",
    sourcecode: "source-code",
    pro: "source-code",
    share: "share-tech",
    hud: "share-tech",
    cyber: "share-tech",
    arcade: "press-start",
    "press-start": "press-start",
    "8bit": "press-start",
    pixel: "press-start",
    ubuntu: "ubuntu-mono",
    linux: "ubuntu-mono",
    inconsolata: "inconsolata",
  };

  if (aliases[clean]) {
    return TERMINAL_FONTS.find((f) => f.id === aliases[clean]);
  }

  // Partial substring match
  return TERMINAL_FONTS.find(
    (f) =>
      f.name.toLowerCase().includes(clean) ||
      f.id.toLowerCase().includes(clean) ||
      f.personality.toLowerCase().includes(clean)
  );
}
