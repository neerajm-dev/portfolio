"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { sound } from "@/lib/sound";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";
import {
  PHONE_WALLPAPERS,
  getStoredWallpaperId,
  setStoredWallpaperId,
  getWallpaperById,
  createTintedWallpaperCanvas,
} from "@/lib/phone-wallpapers";

interface Phone3DProps {
  onClose: () => void;
  theme?: WorkstationTheme;
  onOpenTerminal?: () => void;
  onOpenIdCard?: () => void;
}

export function Phone3D({
  onClose,
  theme = DEFAULT_THEME,
  onOpenTerminal,
}: Phone3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const themeHex = theme.hex;
  const themeHexRef = useRef(theme.hex);
  const updateThemeRef = useRef<((hex: string) => void) | null>(null);

  // Dynamic Theme Synchronization without reloading GLB or tearing down WebGL
  useEffect(() => {
    themeHexRef.current = theme.hex;
    if (updateThemeRef.current) {
      updateThemeRef.current(theme.hex);
    }
  }, [theme.hex]);

  // Three.js References for Raycasting & Scene Management
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Dynamic Camera Zoom Limits
  const DEFAULT_ZOOM = 3.65;
  const MIN_ZOOM = 2.10; // High-detail close-up
  const MAX_ZOOM = 5.20; // Full overview
  const targetZoom = useRef(DEFAULT_ZOOM);
  const currentZoom = useRef(DEFAULT_ZOOM);

  // Pointer drag state for 360° model rotation & click distinction
  const isDragging = useRef(false);
  const pointerStart = useRef({ x: 0, y: 0 });
  const startRot = useRef({ x: 0, y: 0 });
  const dragDist = useRef(0);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const prevPinchDist = useRef(0);
  const lastTapTime = useRef(0);

  const rotX = useRef(0);
  const rotY = useRef(0);
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);

  // Phone Screen UI State: "home" | "wallpapers" | "ktcc-splash" | "ktcc-app"
  const screenModeRef = useRef<"home" | "wallpapers" | "ktcc-splash" | "ktcc-app">("home");
  const activeWallpaperIdRef = useRef<string>(getStoredWallpaperId());
  const rerenderScreenRef = useRef<() => void>(() => {});

  // Native KTCC App Iframe State & Dynamic 3D Screen Projection
  const [isKtccAppOpen, setIsKtccAppOpen] = useState(false);
  const [liveTime, setLiveTime] = useState("19:30");
  const [iframeStyle, setIframeStyle] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    if (!isKtccAppOpen) return;

    const calcBounds = () => {
      if (!cameraRef.current || !containerRef.current || !modelGroupRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      let foundMesh: THREE.Object3D | null = null;
      modelGroupRef.current.traverse((child) => {
        if (child.name === "Object_9" || child.name.toLowerCase().includes("screen")) {
          foundMesh = child;
        }
      });

      if (!foundMesh) return;
      const screenMesh: THREE.Object3D = foundMesh;
      screenMesh.updateWorldMatrix(true, false);
      const box = new THREE.Box3().setFromObject(screenMesh);

      const screenH = box.max.y - box.min.y;
      const screenW = box.max.x - box.min.x;

      // Fit edge-to-edge between status bar and bottom navbar
      const activeTopY = box.max.y - screenH * 0.052;
      const activeBottomY = box.min.y + screenH * 0.062;
      const activeLeftX = box.min.x - screenW * 0.003;
      const activeRightX = box.max.x + screenW * 0.003;

      const vTopLeft = new THREE.Vector3(activeLeftX, activeTopY, box.max.z + 0.005);
      const vBottomRight = new THREE.Vector3(activeRightX, activeBottomY, box.max.z + 0.005);

      vTopLeft.project(cameraRef.current);
      vBottomRight.project(cameraRef.current);

      const left = Math.round(((vTopLeft.x + 1) / 2) * w);
      const top = Math.round(((-vTopLeft.y + 1) / 2) * h);
      const right = Math.round(((vBottomRight.x + 1) / 2) * w);
      const bottom = Math.round(((-vBottomRight.y + 1) / 2) * h);

      setIframeStyle({
        left,
        top,
        width: Math.max(100, right - left),
        height: Math.max(100, bottom - top),
      });
    };

    // Calculate immediately, after model matrix sync, & on resize
    calcBounds();
    const t1 = setTimeout(calcBounds, 40);
    const t2 = setTimeout(calcBounds, 120);
    window.addEventListener("resize", calcBounds);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", calcBounds);
    };
  }, [isKtccAppOpen]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveTime(
        now.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0, currentZoom.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    // 2. Studio Lighting Rig (360° Studio Showcase with Camera-Attached Fill Light)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e2838, 1.8);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Camera-attached view fill light (guarantees perfect straight-on illumination at all angles)
    const cameraHeadlight = new THREE.DirectionalLight(0xffffff, 1.6);
    cameraHeadlight.position.set(0, 0.5, 1);
    camera.add(cameraHeadlight);
    scene.add(camera);

    // Front Key Light & Soft Fill
    const frontKeyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    frontKeyLight.position.set(3, 4, 4.5);
    scene.add(frontKeyLight);

    const frontFillLight = new THREE.DirectionalLight(0xffffff, 1.6);
    frontFillLight.position.set(-3, 2, 3.5);
    scene.add(frontFillLight);

    // Rear Studio Key Light (Directly illuminates rear Quad-Camera module & titanium backplate)
    const rearCameraLight = new THREE.DirectionalLight(0xffffff, 3.2);
    rearCameraLight.position.set(-1.5, 3.5, -4.5);
    scene.add(rearCameraLight);

    const rearFillLight = new THREE.DirectionalLight(0xffffff, 2.0);
    rearFillLight.position.set(2.5, -1, -4.0);
    scene.add(rearFillLight);

    // Dual Dynamic Theme Rim Lights
    const leftRimLight = new THREE.DirectionalLight(new THREE.Color(themeHexRef.current), 3.6);
    leftRimLight.position.set(-4, -1, 0);
    scene.add(leftRimLight);

    const rightRimLight = new THREE.DirectionalLight(new THREE.Color(themeHexRef.current), 2.8);
    rightRimLight.position.set(4, 2, -1);
    scene.add(rightRimLight);

    // 3. Dynamic High-Resolution OLED Screen Texture & Image Preloading
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 480;
    screenCanvas.height = 960;
    const sCtx = screenCanvas.getContext("2d");

    // Cache preloaded wallpaper images & thumbnails
    const loadedImages = new Map<string, HTMLImageElement>();
    const loadedThumbs = new Map<string, HTMLImageElement>();

    // Preload KTCC Logo & Wordmark
    const ktccLogoImg = new Image();
    ktccLogoImg.src = "/phone/icons/logo-rounded.png";
    ktccLogoImg.onload = () => {
      renderScreenTexture();
      screenTexture.needsUpdate = true;
    };

    const ktccWordmarkImg = new Image();
    ktccWordmarkImg.src = "/phone/icons/ktcc-wordmark.png";

    PHONE_WALLPAPERS.forEach((wp) => {
      const img = new Image();
      img.src = wp.src;
      img.onload = () => {
        loadedImages.set(wp.id, img);
        if (wp.id === activeWallpaperIdRef.current) {
          renderScreenTexture();
          screenTexture.needsUpdate = true;
        }
      };

      const thumb = new Image();
      thumb.src = wp.thumb;
      thumb.onload = () => {
        loadedThumbs.set(wp.id, thumb);
        if (screenModeRef.current === "wallpapers") {
          renderScreenTexture();
          screenTexture.needsUpdate = true;
        }
      };
    });

    const getLiveTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const renderScreenTexture = () => {
      if (!sCtx) return;
      const currentHex = themeHexRef.current;
      const nowTime = getLiveTime();
      const activeId = activeWallpaperIdRef.current;
      const activeWp = getWallpaperById(activeId);
      const mode = screenModeRef.current;

      sCtx.clearRect(0, 0, 480, 960);

      if (mode === "home") {
        // =========================================================================
        // 🟢 HOME SCREEN: ACTIVE WALLPAPER + TOP STATUS BAR + APP GRIDS
        // =========================================================================
        const bgImg = loadedImages.get(activeId);
        if (bgImg) {
          const tintedCanvas = createTintedWallpaperCanvas(bgImg, currentHex, 480, 960, activeWp);
          sCtx.drawImage(tintedCanvas, 0, 0, 480, 960);
        } else {
          sCtx.fillStyle = "#03060c";
          sCtx.fillRect(0, 0, 480, 960);
        }

        // Ambient cyber grid overlay on wallpaper
        sCtx.strokeStyle = `${currentHex}10`;
        sCtx.lineWidth = 1;
        for (let x = 0; x < 480; x += 32) {
          sCtx.beginPath();
          sCtx.moveTo(x, 0);
          sCtx.lineTo(x, 960);
          sCtx.stroke();
        }

        // 🟢 UPPER APP GRID (y: 200)
        // 1. KTCC Flagship App Icon (Real logo-rounded.png icon)
        drawKtccAppIcon(sCtx, 95, 200, ktccLogoImg, currentHex);

        // 🟢 BOTTOM QUICK ACCESS DOCK (y: 780)
        // Dock Item 1: Wallpaper App Icon (Left)
        drawAppIcon(sCtx, 165, 780, "Wallpapers", currentHex, "palette");
        // Dock Item 2: Terminal CLI Icon (Right)
        drawAppIcon(sCtx, 315, 780, "Terminal", currentHex, "terminal");
      } else if (mode === "wallpapers") {
        // =========================================================================
        // 🟢 WALLPAPER GALLERY SCREEN: 4x3 INSTAGRAM REELS GRID (12 WALLPAPERS)
        // =========================================================================
        sCtx.fillStyle = "#020408";
        sCtx.fillRect(0, 0, 480, 960);

        // 4x3 Grid Configuration: 3 Columns x 4 Rows = 12 Cells
        const cellW = 152;
        const cellH = 200;
        const colGap = 6;
        const rowGap = 6;
        const startX = 6;
        const startY = 68;

        PHONE_WALLPAPERS.forEach((wp, idx) => {
          if (idx >= 12) return;
          const col = idx % 3;
          const row = Math.floor(idx / 3);
          const cellX = startX + col * (cellW + colGap);
          const cellY = startY + row * (cellH + rowGap);
          const isSelected = wp.id === activeId;

          // Thumbnail image with subtle rounded corners (Instagram style)
          const thumbImg = loadedThumbs.get(wp.id) || loadedImages.get(wp.id);
          sCtx.save();
          sCtx.beginPath();
          sCtx.roundRect(cellX, cellY, cellW, cellH, 4);
          sCtx.clip();

          if (thumbImg) {
            const tintedThumb = createTintedWallpaperCanvas(thumbImg, currentHex, cellW, cellH, wp);
            sCtx.drawImage(tintedThumb, cellX, cellY, cellW, cellH);
          } else {
            sCtx.fillStyle = "#0f172a";
            sCtx.fillRect(cellX, cellY, cellW, cellH);
          }
          sCtx.restore();

          // Selection Border & Glow (Instagram / Cyber Aesthetic)
          if (isSelected) {
            sCtx.save();
            sCtx.strokeStyle = currentHex;
            sCtx.lineWidth = 3.5;
            sCtx.shadowColor = currentHex;
            sCtx.shadowBlur = 10;
            sCtx.beginPath();
            sCtx.roundRect(cellX, cellY, cellW, cellH, 4);
            sCtx.stroke();
            sCtx.restore();

            // Active Badge in Top-Right Corner
            sCtx.fillStyle = currentHex;
            sCtx.beginPath();
            sCtx.arc(cellX + cellW - 14, cellY + 14, 10, 0, Math.PI * 2);
            sCtx.fill();

            sCtx.fillStyle = "#000000";
            sCtx.font = "900 12px monospace";
            sCtx.textAlign = "center";
            sCtx.fillText("✓", cellX + cellW - 14, cellY + 18);
          } else {
            // Subtle cell divider border
            sCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
            sCtx.lineWidth = 1;
            sCtx.beginPath();
            sCtx.roundRect(cellX, cellY, cellW, cellH, 4);
            sCtx.stroke();
          }
        });
      } else if (mode === "ktcc-splash") {
        // =========================================================================
        // 🟢 NATIVE KTCC ANDROID APP SPLASH SCREEN (CLEAN MINIMALIST)
        // =========================================================================
        sCtx.fillStyle = "#020407";
        sCtx.fillRect(0, 0, 480, 960);

        // Center KTCC Logo Emblem (Clean, zero glow)
        if (ktccLogoImg.complete && ktccLogoImg.naturalWidth > 0) {
          sCtx.drawImage(ktccLogoImg, 240 - 85, 430 - 85, 170, 170);
        }

        // Bottom KTCC Wordmark Banner
        if (ktccWordmarkImg.complete && ktccWordmarkImg.naturalWidth > 0) {
          sCtx.drawImage(ktccWordmarkImg, 240 - 130, 780, 260, 42);
        }
      } else if (mode === "ktcc-app") {
        // =========================================================================
        // 🟢 NATIVE KTCC APP ACTIVE: PURE DEEP OLED BLACK SCREEN (REPLACES WALLPAPER)
        // =========================================================================
        sCtx.fillStyle = "#020407";
        sCtx.fillRect(0, 0, 480, 960);
      }

      // =========================================================================
      // 🟢 TOP STATUS BAR (TIME, WI-FI, BATTERY & NOTCH) - ALWAYS VISIBLE
      // =========================================================================
      // Teardrop camera notch
      sCtx.fillStyle = "#000000";
      sCtx.beginPath();
      sCtx.arc(240, 24, 18, 0, Math.PI);
      sCtx.fill();

      sCtx.fillStyle = "#050d18";
      sCtx.beginPath();
      sCtx.arc(240, 18, 7, 0, Math.PI * 2);
      sCtx.fill();

      // Status Time
      sCtx.textAlign = "left";
      sCtx.font = "700 20px Orbitron, monospace";
      sCtx.fillStyle = "#e4e4e7";
      sCtx.fillText(nowTime, 36, 46);

      // Status Bar Right: Wi-Fi Icon + 100% Battery
      const wx = 345;
      const wy = 46;
      sCtx.fillStyle = currentHex;
      sCtx.strokeStyle = currentHex;
      sCtx.lineWidth = 2.2;
      sCtx.lineCap = "round";

      sCtx.beginPath();
      sCtx.arc(wx, wy - 3, 2.5, 0, Math.PI * 2);
      sCtx.fill();

      sCtx.beginPath();
      sCtx.arc(wx, wy - 3, 8, -Math.PI * 0.75, -Math.PI * 0.25);
      sCtx.stroke();

      sCtx.beginPath();
      sCtx.arc(wx, wy - 3, 14, -Math.PI * 0.75, -Math.PI * 0.25);
      sCtx.stroke();

      sCtx.textAlign = "left";
      sCtx.font = "700 17px Orbitron, monospace";
      sCtx.fillStyle = currentHex;
      sCtx.fillText("100%", 372, 46);

      // =========================================================================
      // 🟢 BOTTOM 3-BUTTON MOBILE NAVIGATION BAR (BACK ◀, HOME ○, RECENTS □)
      // =========================================================================
      const navY = 900;
      const navH = 60;

      sCtx.fillStyle = "rgba(4, 7, 13, 0.95)";
      sCtx.fillRect(0, navY, 480, navH);

      sCtx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      sCtx.lineWidth = 1;
      sCtx.beginPath();
      sCtx.moveTo(0, navY);
      sCtx.lineTo(480, navY);
      sCtx.stroke();

      // 1. Back Button (Left: Triangle ◀)
      sCtx.fillStyle = "#a1a1aa";
      sCtx.beginPath();
      sCtx.moveTo(92, 930 - 9);
      sCtx.lineTo(80, 930);
      sCtx.lineTo(92, 930 + 9);
      sCtx.closePath();
      sCtx.fill();

      // 2. Home Button (Center: Circle ○)
      sCtx.strokeStyle = "#a1a1aa";
      sCtx.lineWidth = 2.2;
      sCtx.beginPath();
      sCtx.arc(240, 930, 9, 0, Math.PI * 2);
      sCtx.stroke();

      // 3. Recents Button (Right: Square □)
      sCtx.strokeStyle = "#a1a1aa";
      sCtx.lineWidth = 2.2;
      sCtx.beginPath();
      sCtx.roundRect(388 - 7, 930 - 7, 15, 15, 2);
      sCtx.stroke();
    };

    rerenderScreenRef.current = () => {
      renderScreenTexture();
      screenTexture.needsUpdate = true;
    };

    updateThemeRef.current = (newHex: string) => {
      leftRimLight.color.set(new THREE.Color(newHex));
      rightRimLight.color.set(new THREE.Color(newHex));
      renderScreenTexture();
      screenTexture.needsUpdate = true;
    };

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    renderScreenTexture();

    // Trigger update once Orbitron font finishes downloading
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load("700 20px Orbitron").then(() => {
        renderScreenTexture();
        screenTexture.needsUpdate = true;
      });
    }

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      toneMapped: false,
    });

    // 4. Load Alain Sorazu 3D Smartphone GLB Model
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    const loader = new GLTFLoader();
    loader.load(
      "/models/phone.glb",
      (gltf) => {
        const phoneScene = gltf.scene;

        const PHONE_SCALE = 10.0;
        phoneScene.scale.set(PHONE_SCALE, PHONE_SCALE, PHONE_SCALE);
        phoneScene.position.set(0, -0.952, 0); // Centers model at origin

        phoneScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            const matName = (mesh.material as THREE.Material)?.name || "";

            // Map OLED screen texture to Screen Mesh with RIGHT-SIDE-UP UVs
            if (matName.toLowerCase().includes("screen") || mesh.name === "Object_9") {
              const pos = mesh.geometry.getAttribute("position");
              if (pos) {
                const minX = -1.2117, maxX = 1.2132;
                const minZ = -5.1522, maxZ = -0.0973;
                const uvs: number[] = [];
                for (let i = 0; i < pos.count; i++) {
                  const x = pos.getX(i);
                  const z = pos.getZ(i);
                  const u = (x - minX) / (maxX - minX);
                  const v = (maxZ - z) / (maxZ - minZ); // V=1 at top, V=0 at bottom
                  uvs.push(u, v);
                }
                mesh.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
              }
              mesh.material = screenMat;
            } else if (matName.toLowerCase().includes("case") || mesh.name === "Object_8") {
              // Sleek dark space-gray / titanium chassis with satin sheen
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x1a2432,
                roughness: 0.28,
                metalness: 0.70,
              });
            } else if (matName.toLowerCase().includes("white") || mesh.name === "Object_4") {
              // Precision CNC diamond-cut gunmetal titanium camera bezel rings
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x2e3c50,
                roughness: 0.22,
                metalness: 0.88,
              });
            } else if (mesh.name === "Object_5" || matName === "Camera.001") {
              // Deep dark optical lens core and aperture
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x060b14,
                roughness: 0.12,
                metalness: 0.90,
              });
            } else if (mesh.name === "Object_6" || matName === "Camera.002") {
              // High-spec optical sapphire camera glass with clearcoat reflections & transparency
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0x121e30,
                roughness: 0.04,
                metalness: 0.10,
                transmission: 0.78,
                transparent: true,
                opacity: 0.92,
                ior: 1.54,
                reflectivity: 0.95,
                clearcoat: 1.0,
                clearcoatRoughness: 0.02,
              });
            } else if (matName.toLowerCase().includes("black") || mesh.name === "Object_10") {
              // Dark glossy camera island bump backing plate
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x0d1420,
                roughness: 0.18,
                metalness: 0.75,
              });
            } else if (matName.toLowerCase().includes("flash") || mesh.name === "Object_7") {
              // Dual-tone LED flash
              mesh.material = new THREE.MeshBasicMaterial({
                color: 0xfffaed,
              });
            } else if (matName.toLowerCase().includes("button") || mesh.name === "Object_11") {
              // Metallic buttons
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x162030,
                roughness: 0.4,
                metalness: 0.8,
              });
            }
          }
        });

        modelGroup.add(phoneScene);
      },
      undefined,
      (err) => console.warn("Failed to load /models/phone.glb:", err)
    );

    // Live clock updater for screen texture
    const timeInterval = setInterval(() => {
      renderScreenTexture();
      screenTexture.needsUpdate = true;
    }, 1000);

    // Desktop Mouse Wheel Zoom Handler
    const handleWheel = (e: WheelEvent) => {
      if (isKtccAppOpen) return;
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.0035;
      targetZoom.current = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, targetZoom.current + zoomDelta));
    };
    container.addEventListener("wheel", handleWheel, { passive: false });

    // Animation Loop with smooth inertial lerp (Rotation & Zoom)
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      rotX.current += (targetRotX.current - rotX.current) * 0.15;
      rotY.current += (targetRotY.current - rotY.current) * 0.15;
      currentZoom.current += (targetZoom.current - currentZoom.current) * 0.15;

      modelGroup.rotation.x = (rotX.current * Math.PI) / 180;
      modelGroup.rotation.y = (rotY.current * Math.PI) / 180;
      camera.position.z = currentZoom.current;

      renderer.render(scene, camera);
    };
    animate();

    // Handle container resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(timeInterval);
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", handleResize);
      updateThemeRef.current = null;
      renderer.dispose();
    };
  }, []);

  // Pointer drag listeners for 360° 3D inspection, multi-touch pinch-zoom, and touchscreen app clicks
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    // Multi-touch Pinch-to-Zoom on Mobile
    if (activePointers.current.size === 2) {
      const pts = Array.from(activePointers.current.values());
      prevPinchDist.current = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      return;
    }

    if (activePointers.current.size === 1) {
      isDragging.current = true;
      pointerStart.current = { x: e.clientX, y: e.clientY };
      startRot.current = { x: rotX.current, y: rotY.current };
      dragDist.current = 0;
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointers.current.has(e.pointerId)) {
      activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    }

    // Handle 2-Finger Pinch-to-Zoom on Mobile
    if (activePointers.current.size === 2) {
      const pts = Array.from(activePointers.current.values());
      const currPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      if (prevPinchDist.current > 0) {
        const deltaDist = currPinchDist - prevPinchDist.current;
        targetZoom.current = Math.max(
          MIN_ZOOM,
          Math.min(MAX_ZOOM, targetZoom.current - deltaDist * 0.008)
        );
      }
      prevPinchDist.current = currPinchDist;
      return;
    }

    if (!isDragging.current) return;
    if (isKtccAppOpen) return; // Lock rotation when KTCC app is active
    const dx = e.clientX - pointerStart.current.x;
    const dy = e.clientY - pointerStart.current.y;
    dragDist.current = Math.hypot(dx, dy);

    targetRotY.current = startRot.current.y + dx * 0.65;
    targetRotX.current = Math.max(-60, Math.min(60, startRot.current.x + dy * 0.65));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    activePointers.current.delete(e.pointerId);
    if (activePointers.current.size < 2) {
      prevPinchDist.current = 0;
    }

    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const now = performance.now();
    const isDoubleTap = now - lastTapTime.current < 280 && dragDist.current < 8;
    lastTapTime.current = now;

    // Double-Click / Double-Tap to Reset Zoom & Rotation
    if (isDoubleTap) {
      targetZoom.current = DEFAULT_ZOOM;
      targetRotX.current = 0;
      targetRotY.current = 0;
      sound.playNodePulse();
      return;
    }

    // Single Click/Tap (dragDist < 6px): Detect Screen Touch Interactivity vs Outside Dismiss
    if (dragDist.current < 6 && canvasRef.current && cameraRef.current && modelGroupRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(modelGroupRef.current.children, true);

      // If clicked completely outside the 3D phone model mesh
      if (intersects.length === 0) {
        sound.playClick();
        if (isKtccAppOpen) {
          handleCloseKtccApp();
        } else {
          onClose();
        }
        return;
      }

      // Check if clicked the interactive phone screen mesh (Object_9)
      const screenIntersect = intersects.find(
        (hit) => hit.object.name === "Object_9" || hit.object.name.toLowerCase().includes("screen")
      );

      if (screenIntersect && screenIntersect.uv) {
        const uv = screenIntersect.uv;
        const cx = uv.x * 480;
        const cy = (1 - uv.y) * 960;

        // =====================================================================
        // 🟢 BOTTOM 3-BUTTON NAVIGATION BAR CLICKS (cy: 885..960)
        // =====================================================================
        if (cy >= 885 && cy <= 960) {
          // 1. Back Button (Left: cx: 30..150)
          if (cx >= 30 && cx <= 150) {
            sound.playClick();
            handleCloseKtccApp();
            return;
          }

          // 2. Home Button (Center: cx: 170..310)
          if (cx >= 170 && cx <= 310) {
            sound.playClick();
            handleCloseKtccApp();
            return;
          }

          // 3. Recents Button (Right: cx: 320..450)
          if (cx >= 320 && cx <= 450) {
            sound.playNodePulse();
            return;
          }
        }

        if (screenModeRef.current === "home") {
          // 1. Tap KTCC Flagship Icon (Upper Grid Left: cx: 55..135, cy: 155..245)
          if (cx >= 50 && cx <= 140 && cy >= 150 && cy <= 245) {
            sound.playSuccess();
            targetRotX.current = 0;
            targetRotY.current = 0;
            targetZoom.current = DEFAULT_ZOOM;
            screenModeRef.current = "ktcc-splash";
            rerenderScreenRef.current();

            // Smoothly open native iframe after 1.8s splash sequence
            setTimeout(() => {
              if (screenModeRef.current === "ktcc-splash") {
                setIsKtccAppOpen(true);
                screenModeRef.current = "ktcc-app";
                rerenderScreenRef.current();
              }
            }, 1800);
            return;
          }

          // 2. Tap Wallpaper Dock Icon (Bottom Dock Left: cx: 120..210, cy: 735..830)
          if (cx >= 120 && cx <= 210 && cy >= 735 && cy <= 830) {
            sound.playClick();
            screenModeRef.current = "wallpapers";
            rerenderScreenRef.current();
            return;
          }

          // 3. Tap Terminal Dock Icon (Bottom Dock Right: cx: 270..360, cy: 735..830)
          if (cx >= 270 && cx <= 360 && cy >= 735 && cy <= 830) {
            sound.playClick();
            onClose();
            onOpenTerminal?.();
            return;
          }
        } else if (screenModeRef.current === "wallpapers") {
          // =====================================================================
          // 🟢 In 4x3 Instagram Wallpaper Grid
          // =====================================================================
          const cellW = 152;
          const cellH = 200;
          const colGap = 6;
          const rowGap = 6;
          const startX = 6;
          const startY = 68;

          for (let i = 0; i < PHONE_WALLPAPERS.length && i < 12; i++) {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const x0 = startX + col * (cellW + colGap);
            const y0 = startY + row * (cellH + rowGap);
            const x1 = x0 + cellW;
            const y1 = y0 + cellH;

            if (cx >= x0 && cx <= x1 && cy >= y0 && cy <= y1) {
              const selectedWp = PHONE_WALLPAPERS[i];
              activeWallpaperIdRef.current = selectedWp.id;
              setStoredWallpaperId(selectedWp.id);
              sound.playNodePulse();
              rerenderScreenRef.current();
              return;
            }
          }
        }
      }
    }
  };

  const handleCloseKtccApp = () => {
    sound.playClick();
    document.documentElement.removeAttribute("data-cursor-hidden");
    setIsKtccAppOpen(false);
    screenModeRef.current = "home";
    rerenderScreenRef.current();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 select-none cursor-grab active:cursor-grabbing touch-none"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center relative touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* 🟢 NATIVE IN-PHONE KTCC APP EMBEDDED IFRAME VIEW (DYNAMIC 3D PROJECTION) */}
        <AnimatePresence>
          {isKtccAppOpen && iframeStyle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="absolute z-40 overflow-hidden pointer-events-auto bg-[#020509]"
              style={{
                left: `${iframeStyle.left}px`,
                top: `${iframeStyle.top}px`,
                width: `${iframeStyle.width}px`,
                height: `${iframeStyle.height}px`,
                boxShadow: `0 0 25px ${themeHex}18`,
              }}
              onMouseEnter={() => document.documentElement.setAttribute("data-cursor-hidden", "true")}
              onMouseLeave={() => document.documentElement.removeAttribute("data-cursor-hidden")}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Live Interactive KTCC Tournament Platform Iframe */}
              <iframe
                src="https://ktccofficial.vercel.app"
                title="KTCC Championship Platform"
                className="w-full h-full border-none bg-[#020509]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transparent Touch Targets over the 3D Phone Navigation Bar for 100% reliable instant click/touch exit */}
        {isKtccAppOpen && iframeStyle && (
          <div
            className="absolute z-50 flex items-center justify-between pointer-events-auto"
            style={{
              left: `${iframeStyle.left}px`,
              top: `${iframeStyle.top + iframeStyle.height}px`,
              width: `${iframeStyle.width}px`,
              height: `48px`,
            }}
          >
            {/* Back Button ◀ Area */}
            <button
              type="button"
              onClick={handleCloseKtccApp}
              aria-label="Back"
              className="w-1/3 h-full cursor-pointer opacity-0"
            />
            {/* Home Button ○ Area */}
            <button
              type="button"
              onClick={handleCloseKtccApp}
              aria-label="Home"
              className="w-1/3 h-full cursor-pointer opacity-0"
            />
            {/* Recents Button □ Area */}
            <button
              type="button"
              onClick={() => sound.playNodePulse()}
              aria-label="Recents"
              className="w-1/3 h-full cursor-pointer opacity-0"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * Draws the real KTCC App Icon on the 2D canvas using logo-rounded.png
 */
function drawKtccAppIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  img: HTMLImageElement,
  themeHex: string
) {
  const iconSize = 68;
  const ix = x - iconSize / 2;
  const iy = y - iconSize / 2;

  ctx.save();

  // Glassmorphic App Tile Background with Rounded Squircle
  ctx.fillStyle = "rgba(6, 10, 18, 0.92)";
  ctx.strokeStyle = `${themeHex}aa`;
  ctx.lineWidth = 2;
  ctx.shadowColor = `${themeHex}66`;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(ix, iy, iconSize, iconSize, 16);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Render Real KTCC Squircle Logo
  if (img.complete && img.naturalWidth > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(ix + 2, iy + 2, iconSize - 4, iconSize - 4, 14);
    ctx.clip();
    ctx.drawImage(img, ix + 2, iy + 2, iconSize - 4, iconSize - 4);
    ctx.restore();
  }

  ctx.restore();

  // App Label Below Tile
  ctx.textAlign = "center";
  ctx.font = "700 12px Orbitron, monospace";
  ctx.fillStyle = "#e4e4e7";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4;
  ctx.fillText("KTCC", x, y + iconSize / 2 + 16);
  ctx.shadowBlur = 0;
}

/**
 * Draws a futuristic placeholder app icon on the home screen
 */
function drawPlaceholderAppIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  themeHex: string
) {
  const iconSize = 68;
  const ix = x - iconSize / 2;
  const iy = y - iconSize / 2;

  ctx.save();
  ctx.fillStyle = "rgba(8, 12, 20, 0.75)";
  ctx.strokeStyle = `${themeHex}44`;
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.roundRect(ix, iy, iconSize, iconSize, 16);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);

  // Minimalist Plus / Project glyph in center
  ctx.strokeStyle = `${themeHex}88`;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 8);
  ctx.stroke();

  ctx.restore();

  // App Label Below Tile
  ctx.textAlign = "center";
  ctx.font = "700 9.5px Orbitron, monospace";
  ctx.fillStyle = "#9ca3af";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4;
  ctx.fillText(label, x, y + iconSize / 2 + 16);
  ctx.shadowBlur = 0;
}

/**
 * Draws a futuristic, high-tech glowing iOS/Android app icon on the 2D phone canvas
 */
function drawAppIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  label: string,
  themeHex: string,
  iconType: "palette" | "game" | "terminal"
) {
  const iconSize = 68;
  const ix = x - iconSize / 2;
  const iy = y - iconSize / 2;

  // Glassmorphic App Icon Tile
  ctx.save();
  ctx.fillStyle = "rgba(6, 10, 18, 0.85)";
  ctx.strokeStyle = `${themeHex}99`;
  ctx.lineWidth = 2;
  ctx.shadowColor = `${themeHex}66`;
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.roundRect(ix, iy, iconSize, iconSize, 16);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Icon Center Graphics
  ctx.strokeStyle = themeHex;
  ctx.fillStyle = themeHex;
  ctx.lineWidth = 2.4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (iconType === "palette") {
    // Wallpaper / Gallery Palette Icon
    ctx.beginPath();
    ctx.arc(x, y - 2, 16, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x - 6, y - 8, 3, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 8, 3, 0, Math.PI * 2);
    ctx.arc(x - 8, y + 2, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (iconType === "game") {
    // Flagship Trophy / Gamepad Icon
    ctx.beginPath();
    ctx.roundRect(x - 14, y - 10, 28, 18, 5);
    ctx.stroke();

    // D-Pad + Buttons
    ctx.beginPath();
    ctx.moveTo(x - 8, y - 1);
    ctx.lineTo(x - 4, y - 1);
    ctx.moveTo(x - 6, y - 3);
    ctx.lineTo(x - 6, y + 1);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x + 6, y - 1, 2, 0, Math.PI * 2);
    ctx.fill();
  } else if (iconType === "terminal") {
    // Monospace Terminal Prompt Icon >_
    ctx.beginPath();
    ctx.roundRect(x - 15, y - 12, 30, 22, 4);
    ctx.stroke();

    ctx.font = "900 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText(">_", x, y + 3);
  }

  ctx.restore();

  // App Label Below Tile
  ctx.textAlign = "center";
  ctx.font = "700 11px Orbitron, monospace";
  ctx.fillStyle = "#e4e4e7";
  ctx.shadowColor = "rgba(0,0,0,0.9)";
  ctx.shadowBlur = 4;
  ctx.fillText(label, x, y + iconSize / 2 + 16);
  ctx.shadowBlur = 0;
}
