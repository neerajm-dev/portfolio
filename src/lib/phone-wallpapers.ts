/**
 * Phone Wallpaper Registry & Dynamic Theme Color Tinting Engine
 */

export interface PhoneWallpaper {
  id: string;
  index: number;
  name: string;
  src: string;
  thumb: string;
  themeBlend: "overlay" | "color" | "soft-light" | "multiply";
  tintOpacity: number;
}

export const PHONE_WALLPAPERS: PhoneWallpaper[] = [
  {
    id: "1",
    index: 1,
    name: "Fluid Topography",
    src: "/phone/wallpapers/processed/1.jpg",
    thumb: "/phone/wallpapers/thumbs/1.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "2",
    index: 2,
    name: "Oceanic Waves",
    src: "/phone/wallpapers/processed/2.jpg",
    thumb: "/phone/wallpapers/thumbs/2.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "3",
    index: 3,
    name: "Eclipse Core",
    src: "/phone/wallpapers/processed/3.jpg",
    thumb: "/phone/wallpapers/thumbs/3.jpg",
    themeBlend: "color",
    tintOpacity: 0.80,
  },
  {
    id: "4",
    index: 4,
    name: "Prism Mosaic",
    src: "/phone/wallpapers/processed/4.jpg",
    thumb: "/phone/wallpapers/thumbs/4.jpg",
    themeBlend: "color",
    tintOpacity: 0.75,
  },
  {
    id: "5",
    index: 5,
    name: "Hex Honeycomb",
    src: "/phone/wallpapers/processed/5.jpg",
    thumb: "/phone/wallpapers/thumbs/5.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "6",
    index: 6,
    name: "Fractured Shards",
    src: "/phone/wallpapers/processed/6.jpg",
    thumb: "/phone/wallpapers/thumbs/6.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "7",
    index: 7,
    name: "Stealth Chevron",
    src: "/phone/wallpapers/processed/7.jpg",
    thumb: "/phone/wallpapers/thumbs/7.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "8",
    index: 8,
    name: "Matte Lattice",
    src: "/phone/wallpapers/processed/8.jpg",
    thumb: "/phone/wallpapers/thumbs/8.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "9",
    index: 9,
    name: "Cyber Circuit",
    src: "/phone/wallpapers/processed/9.jpg",
    thumb: "/phone/wallpapers/thumbs/9.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "10",
    index: 10,
    name: "Armored Vanguard",
    src: "/phone/wallpapers/processed/10.jpg",
    thumb: "/phone/wallpapers/thumbs/10.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
  {
    id: "11",
    index: 11,
    name: "Prism Rays",
    src: "/phone/wallpapers/processed/11.jpg",
    thumb: "/phone/wallpapers/thumbs/11.jpg",
    themeBlend: "color",
    tintOpacity: 0.90,
  },
  {
    id: "12",
    index: 12,
    name: "Synth Matrix",
    src: "/phone/wallpapers/processed/12.jpg",
    thumb: "/phone/wallpapers/thumbs/12.jpg",
    themeBlend: "color",
    tintOpacity: 0.85,
  },
];

export const DEFAULT_WALLPAPER_ID = "1";

const STORAGE_KEY = "neeraj_phone_wallpaper_id";
const EVENT_NAME = "neeraj:phone-wallpaper-change";

export function getStoredWallpaperId(): string {
  if (typeof window === "undefined") return DEFAULT_WALLPAPER_ID;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && PHONE_WALLPAPERS.some((w) => w.id === stored)) {
      return stored;
    }
  } catch {
    // LocalStorage fallback
  }
  return DEFAULT_WALLPAPER_ID;
}

export function setStoredWallpaperId(id: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, id);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { id } }));
  } catch {
    // LocalStorage fallback
  }
}

export function getWallpaperById(id: string): PhoneWallpaper {
  return PHONE_WALLPAPERS.find((w) => w.id === id) || PHONE_WALLPAPERS[0];
}

export function onWallpaperChange(callback: (id: string) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<{ id: string }>;
    if (customEvent.detail?.id) {
      callback(customEvent.detail.id);
    }
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// Memoized cache to eliminate repeated canvas creation and GC churn
const tintedCanvasCache = new Map<string, HTMLCanvasElement>();

/**
 * Creates a dynamically theme-tinted wallpaper canvas texture with status bar protection gradients (cached)
 */
export function createTintedWallpaperCanvas(
  img: HTMLImageElement,
  themeHex: string,
  targetWidth: number = 480,
  targetHeight: number = 960,
  wallpaper?: PhoneWallpaper
): HTMLCanvasElement {
  const cacheKey = `${wallpaper?.id || img.src}_${themeHex}_${targetWidth}x${targetHeight}`;
  const existing = tintedCanvasCache.get(cacheKey);
  if (existing) return existing;

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Draw base image scaled to target (9:16 aspect ratio)
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const blendMode = wallpaper?.themeBlend || "color";
  const tintAlpha = wallpaper?.tintOpacity ?? 0.85;

  // 2. Dynamic theme color wash layer
  ctx.save();
  ctx.globalCompositeOperation = blendMode;
  ctx.globalAlpha = tintAlpha;
  ctx.fillStyle = themeHex;
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.restore();

  // 3. Subtle Cyber Ambient Radial Glow
  ctx.save();
  ctx.globalCompositeOperation = "soft-light";
  const radial = ctx.createRadialGradient(
    targetWidth / 2,
    targetHeight / 2,
    targetWidth * 0.15,
    targetWidth / 2,
    targetHeight / 2,
    targetWidth * 0.95
  );
  radial.addColorStop(0, `${themeHex}66`);
  radial.addColorStop(0.8, "rgba(0,0,0,0.4)");
  radial.addColorStop(1, "rgba(0,0,0,0.85)");
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.restore();

  // 4. Status Bar & Bottom Navigation readability scrims
  const topScrim = ctx.createLinearGradient(0, 0, 0, 90);
  topScrim.addColorStop(0, "rgba(0, 0, 0, 0.75)");
  topScrim.addColorStop(0.65, "rgba(0, 0, 0, 0.35)");
  topScrim.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = topScrim;
  ctx.fillRect(0, 0, targetWidth, 90);

  const bottomScrim = ctx.createLinearGradient(0, targetHeight - 160, 0, targetHeight);
  bottomScrim.addColorStop(0, "rgba(0, 0, 0, 0)");
  bottomScrim.addColorStop(0.4, "rgba(0, 0, 0, 0.45)");
  bottomScrim.addColorStop(1, "rgba(0, 0, 0, 0.85)");
  ctx.fillStyle = bottomScrim;
  ctx.fillRect(0, targetHeight - 160, targetWidth, 160);

  tintedCanvasCache.set(cacheKey, canvas);
  return canvas;
}
