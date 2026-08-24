"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { sound } from "@/lib/sound";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

interface Phone3DProps {
  onClose: () => void;
  theme?: WorkstationTheme;
  onOpenTerminal?: () => void;
  onOpenIdCard?: () => void;
}

export function Phone3D({
  onClose,
  theme = DEFAULT_THEME,
}: Phone3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const themeHex = theme.hex;

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera Setup (Balanced framing so phone never clips or overflows)
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

    // 2. Studio Lighting (PBR Highlights for Quad-Camera & Chassis)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(3, 4, 4);
    scene.add(keyLight);

    const themeRimLight = new THREE.DirectionalLight(new THREE.Color(themeHex), 3.8);
    themeRimLight.position.set(-3.5, -2, -3);
    scene.add(themeRimLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 2.0);
    backLight.position.set(0, 2, -4);
    scene.add(backLight);

    // 3. Dynamic High-Resolution OLED Screen Texture
    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 480;
    screenCanvas.height = 960;
    const sCtx = screenCanvas.getContext("2d");

    const getLiveTime = () => {
      const now = new Date();
      return now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const renderScreenTexture = (nowTime: string = getLiveTime()) => {
      if (!sCtx) return;

      // Deep OLED Black
      sCtx.fillStyle = "#020509";
      sCtx.fillRect(0, 0, 480, 960);

      // Radial Neon Glow
      const bgGlow = sCtx.createRadialGradient(240, 480, 20, 240, 480, 340);
      bgGlow.addColorStop(0, `${themeHex}33`);
      bgGlow.addColorStop(0.6, `${themeHex}0a`);
      bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      sCtx.fillStyle = bgGlow;
      sCtx.fillRect(0, 0, 480, 960);

      // Cyber Grid Matrix
      sCtx.strokeStyle = `${themeHex}14`;
      sCtx.lineWidth = 1;
      for (let x = 0; x < 480; x += 32) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, 960);
        sCtx.stroke();
      }
      for (let y = 0; y < 960; y += 32) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(480, y);
        sCtx.stroke();
      }

      // Teardrop camera notch
      sCtx.fillStyle = "#000000";
      sCtx.beginPath();
      sCtx.arc(240, 24, 18, 0, Math.PI);
      sCtx.fill();

      // Camera lens dot
      sCtx.fillStyle = "#050d18";
      sCtx.beginPath();
      sCtx.arc(240, 18, 7, 0, Math.PI * 2);
      sCtx.fill();

      // Status Bar - Left Time
      sCtx.textAlign = "left";
      sCtx.font = "700 20px Orbitron, monospace";
      sCtx.fillStyle = "#a1a1aa";
      sCtx.fillText(nowTime, 36, 48);

      // Status Bar - Right: Wi-Fi Icon (Full Signal Strength) + 100% Battery
      const wx = 345;
      const wy = 48;
      sCtx.fillStyle = themeHex;
      sCtx.strokeStyle = themeHex;
      sCtx.lineWidth = 2.2;
      sCtx.lineCap = "round";

      // Wi-Fi Base Dot
      sCtx.beginPath();
      sCtx.arc(wx, wy - 3, 2.5, 0, Math.PI * 2);
      sCtx.fill();

      // Wi-Fi Middle Arc
      sCtx.beginPath();
      sCtx.arc(wx, wy - 3, 8, -Math.PI * 0.75, -Math.PI * 0.25);
      sCtx.stroke();

      // Wi-Fi Top Arc (Full Strength)
      sCtx.beginPath();
      sCtx.arc(wx, wy - 3, 14, -Math.PI * 0.75, -Math.PI * 0.25);
      sCtx.stroke();

      // Battery 100%
      sCtx.textAlign = "left";
      sCtx.font = "700 17px Orbitron, monospace";
      sCtx.fillStyle = themeHex;
      sCtx.fillText("100%", 372, 48);

      // Centered Large Clock Widget (Orbitron 900 Ultra-Bold)
      sCtx.textAlign = "center";
      sCtx.font = "900 84px Orbitron, monospace";
      sCtx.fillStyle = themeHex;
      sCtx.shadowColor = themeHex;
      sCtx.shadowBlur = 20;
      sCtx.fillText(nowTime, 240, 430);
      sCtx.shadowBlur = 0;

      sCtx.font = "700 15px Orbitron, monospace";
      sCtx.fillStyle = "#71717a";
      sCtx.fillText("KERALA, IN • 28°C CLEAR", 240, 480);

      // Bottom Navigation Bar Pill
      sCtx.fillStyle = "#52525b";
      sCtx.beginPath();
      sCtx.roundRect(160, 925, 160, 8, 4);
      sCtx.fill();
    };

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    renderScreenTexture();

    // Trigger update once Orbitron font finishes downloading
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.load("900 84px Orbitron").then(() => {
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
              // Sleek obsidian titanium chassis
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x090d14,
                roughness: 0.32,
                metalness: 0.88,
              });
            } else if (matName.toLowerCase().includes("white") || mesh.name === "Object_4") {
              // Precision CNC dark gunmetal / titanium camera bezel rings (eliminates bright white rings)
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x121824,
                roughness: 0.35,
                metalness: 0.85,
              });
            } else if (mesh.name === "Object_5" || matName === "Camera.001") {
              // Deep dark optical lens core and aperture
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x020406,
                roughness: 0.15,
                metalness: 0.90,
              });
            } else if (mesh.name === "Object_6" || matName === "Camera.002") {
              // High-spec optical sapphire camera glass with clearcoat reflections & transparency
              mesh.material = new THREE.MeshPhysicalMaterial({
                color: 0x080e18,
                roughness: 0.04,
                metalness: 0.10,
                transmission: 0.82,
                transparent: true,
                opacity: 0.90,
                ior: 1.54,
                reflectivity: 0.95,
                clearcoat: 1.0,
                clearcoatRoughness: 0.02,
              });
            } else if (matName.toLowerCase().includes("black") || mesh.name === "Object_10") {
              // Dark glossy camera island bump backing plate
              mesh.material = new THREE.MeshStandardMaterial({
                color: 0x05080e,
                roughness: 0.22,
                metalness: 0.80,
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
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
      renderScreenTexture(timeStr);
      screenTexture.needsUpdate = true;
    }, 1000);

    // Desktop Mouse Wheel Zoom Handler
    const handleWheel = (e: WheelEvent) => {
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
      renderer.dispose();
    };
  }, [themeHex]);

  // Pointer drag listeners for 360° 3D inspection, multi-touch pinch-zoom, and safe click-outside
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

    // If user clicked/tapped without dragging (dragDist < 6px)
    if (dragDist.current < 6 && canvasRef.current && cameraRef.current && modelGroupRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(modelGroupRef.current.children, true);

      // If clicked outside the 3D phone model mesh (empty space on left, right, top, bottom)
      if (intersects.length === 0) {
        sound.playClick();
        onClose();
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-0 select-none cursor-grab active:cursor-grabbing touch-none"
      onClick={(e) => {
        // Prevent event bubbling to parent backdrop since handlePointerUp handles precise raycasted close
        e.stopPropagation();
      }}
    >
      {/* 🟢 FULL-VIEWPORT 3D SMARTPHONE VIEWPORT (WHEEL / PINCH TO ZOOM, DRAG TO ROTATE, DOUBLE-CLICK RESET) */}
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
      </div>
    </motion.div>
  );
}
