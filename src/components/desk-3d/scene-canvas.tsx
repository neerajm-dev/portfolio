"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { sound } from "@/lib/sound";

import { createDeskSurface } from "./objects/desk-surface";
import { createLaptopMesh } from "./objects/laptop-mesh";
import { createIdCardMesh } from "./objects/id-card-mesh";
import { createPhoneMesh } from "./objects/phone-mesh";
import { createCoffeeMesh } from "./objects/coffee-mesh";
import { createCassetteMesh } from "./objects/cassette-mesh";
import { createNotesMesh } from "./objects/notes-mesh";
import { createChairMesh } from "./objects/chair-mesh";

import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

export type InteractivePropId =
  | "id-card"
  | "laptop"
  | "phone"
  | "coffee"
  | "cassette"
  | "notes";

interface SceneCanvasProps {
  onSelectObject: (id: InteractivePropId) => void;
  terminalLines?: string[];
  currentInput?: string;
  isPaused?: boolean;
  idCardFacing?: "front" | "back";
  cameraResetCount?: number;
  theme?: WorkstationTheme;
}

export function SceneCanvas({
  onSelectObject,
  terminalLines,
  currentInput = "",
  isPaused = false,
  idCardFacing = "front",
  cameraResetCount = 0,
  theme = DEFAULT_THEME,
}: SceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const updateScreenRef = useRef<
    ((lines?: string[], currentInput?: string, themeHex?: string) => void) | null
  >(null);
  const setCardFacingRef = useRef<((facing: "front" | "back") => void) | null>(null);
  const resetCameraRef = useRef<(() => void) | null>(null);
  const updateThemeRef = useRef<((theme: WorkstationTheme) => void) | null>(null);
  const isPausedRef = useRef(isPaused);
  const onSelectObjectRef = useRef(onSelectObject);
  const terminalLinesRef = useRef(terminalLines);
  const currentInputRef = useRef(currentInput);
  const idCardFacingRef = useRef(idCardFacing);
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
    if (updateThemeRef.current) {
      updateThemeRef.current(theme);
    }
    if (updateScreenRef.current) {
      updateScreenRef.current(terminalLinesRef.current, currentInputRef.current, theme.hex);
    }
  }, [theme]);

  useEffect(() => {
    if (cameraResetCount > 0 && resetCameraRef.current) {
      resetCameraRef.current();
    }
  }, [cameraResetCount]);

  useEffect(() => {
    idCardFacingRef.current = idCardFacing;
    if (setCardFacingRef.current) {
      setCardFacingRef.current(idCardFacing);
    }
  }, [idCardFacing]);

  useEffect(() => {
    terminalLinesRef.current = terminalLines;
    currentInputRef.current = currentInput;
    if (updateScreenRef.current) {
      updateScreenRef.current(terminalLines, currentInput, themeRef.current.hex);
    }
  }, [terminalLines, currentInput]);

  useEffect(() => {
    onSelectObjectRef.current = onSelectObject;
  }, [onSelectObject]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. OPTIMIZED SCENE & RENDERER SETUP (Gentle on GPU)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    // Atmospheric exponential distance fog
    scene.fog = new THREE.FogExp2(0x000000, 0.016);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      400
    );
    const initialCamPos = new THREE.Vector3(0, 5.6, 7.6);
    const initialTarget = new THREE.Vector3(0, 0.8, -0.4);
    camera.position.copy(initialCamPos);
    camera.lookAt(initialTarget);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "default",
        precision: "mediump",
      });
    } catch {
      // Fallback if WebGL context creation fails
      return;
    }

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.shadowMap.enabled = false;
    container.appendChild(renderer.domElement);

    // 2. LIGHTING (Direct, minimal overhead)
    const ambientLight = new THREE.AmbientLight(0x00ff66, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00ff66, 0.85);
    dirLight.position.set(5, 10, 6);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x00ff66, 1.4, 10);
    pointLight.position.set(0, 3.2, 0);
    scene.add(pointLight);

    // 3. MOUNT PROCEDURAL 3D OBJECTS & INFINITE GRID FLOOR
    // Infinite Dark Cyber Ground Plane
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x030508,
      roughness: 0.95,
      metalness: 0.1,
    });
    const floorGeo = new THREE.PlaneGeometry(420, 420);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.set(0, -5.42, 0);
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Infinite Cyberpunk Neon Floor Grid
    const floorGridDivisions = 190;
    const floorGrid = new THREE.GridHelper(380, floorGridDivisions, 0x00ff66, 0x00280f);
    floorGrid.position.set(0, -5.40, 0);
    if (Array.isArray(floorGrid.material)) {
      floorGrid.material.forEach((m) => {
        m.transparent = true;
        m.opacity = 0.38;
      });
    } else {
      floorGrid.material.transparent = true;
      floorGrid.material.opacity = 0.38;
    }
    scene.add(floorGrid);

    const updateGridColors = (grid: THREE.GridHelper, themeColorHex: number) => {
      const colorAttr = grid.geometry.attributes.color as THREE.BufferAttribute;
      if (!colorAttr) return;
      const primaryColor = new THREE.Color(themeColorHex);
      const secondaryColor = new THREE.Color(themeColorHex).multiplyScalar(0.22);
      const array = colorAttr.array as Float32Array;

      const center = floorGridDivisions / 2;
      let j = 0;

      for (let i = 0; i <= floorGridDivisions; i++) {
        const c = i === center ? primaryColor : secondaryColor;
        for (let v = 0; v < 4; v++) {
          if (j + 2 < array.length) {
            array[j] = c.r;
            array[j + 1] = c.g;
            array[j + 2] = c.b;
            j += 3;
          }
        }
      }

      colorAttr.needsUpdate = true;
    };

    const deskSurface = createDeskSurface();
    scene.add(deskSurface);

    const laptop = createLaptopMesh();
    scene.add(laptop.group);
    updateScreenRef.current = laptop.updateScreenTexture;
    laptop.updateScreenTexture(terminalLinesRef.current, currentInputRef.current);

    const idCard = createIdCardMesh();
    scene.add(idCard.group);
    setCardFacingRef.current = idCard.setFacing;
    idCard.setFacing(idCardFacingRef.current);

    const phone = createPhoneMesh();
    scene.add(phone.group);

    const coffee = createCoffeeMesh();
    scene.add(coffee.group);

    const cassette = createCassetteMesh();
    scene.add(cassette.group);

    const notes = createNotesMesh();
    scene.add(notes.group);

    const chair = createChairMesh();
    chair.position.set(0.25, 0, 6.6);
    chair.rotation.y = 0.32;
    scene.add(chair);

    // Live Dynamic Workstation Theme Updater
    const updateTheme = (newTheme: WorkstationTheme) => {
      ambientLight.color.setHex(newTheme.threeColor);
      dirLight.color.setHex(newTheme.threeColor);
      pointLight.color.setHex(newTheme.threeColor);

      updateGridColors(floorGrid, newTheme.threeColor);

      scene.traverse((obj) => {
        const anyObj = obj as unknown as {
          material?: THREE.Material | THREE.Material[];
        };
        if (!anyObj.material) return;
        const mats = Array.isArray(anyObj.material) ? anyObj.material : [anyObj.material];
        mats.forEach((m) => {
          if (m instanceof THREE.LineBasicMaterial || m instanceof THREE.LineDashedMaterial) {
            m.color.setHex(newTheme.threeColor);
          } else if ("emissive" in m && m.emissive && (m.emissive as THREE.Color).getHex() !== 0) {
            (m.emissive as THREE.Color).setHex(newTheme.threeColor);
          }
        });
      });

      // Synchronize all procedural canvas textures & shader props
      laptop.setTheme(newTheme);
      idCard.setTheme(newTheme);
      coffee.setTheme(newTheme);
      cassette.setTheme(newTheme);
      notes.setTheme(newTheme);
    };

    updateThemeRef.current = updateTheme;
    updateTheme(themeRef.current);

    // 4. INVISIBLE HITBOXES FOR RAYCASTING
    const hitboxMat = new THREE.MeshBasicMaterial({
      visible: false,
    });

    const createHitbox = (
      id: InteractivePropId,
      size: [number, number, number],
      pos: [number, number, number]
    ) => {
      const geo = new THREE.BoxGeometry(...size);
      const mesh = new THREE.Mesh(geo, hitboxMat);
      mesh.position.set(...pos);
      mesh.userData = { id };
      scene.add(mesh);
      return mesh;
    };

    const hitboxes: THREE.Mesh[] = [
      createHitbox("laptop", [4.6, 2.6, 3.0], [0, 1.2, -0.2]),
      createHitbox("id-card", [2.0, 0.4, 1.6], [4.2, 0.1, 1.6]),
      createHitbox("phone", [1.4, 0.3, 2.2], [3.4, 0.1, -0.4]),
      createHitbox("coffee", [1.2, 1.2, 1.2], [4.4, 0.5, 0.4]),
      createHitbox("cassette", [1.8, 0.8, 1.4], [-4.2, 0.3, 1.4]),
      createHitbox("notes", [1.6, 0.5, 1.6], [-4.5, 0.1, -1.5]),
    ];

    // 5. EVENT-DRIVEN SPHERICAL 3D ORBIT, PINCH-TO-ZOOM & INTERACTION
    const raycaster = new THREE.Raycaster();
    const MIN_CAM_DIST = 4.6;
    const MAX_CAM_DIST = 46.0;
    const lookTarget = new THREE.Vector3(0, 0.75, -0.2);

    let targetCamDist = 9.4;
    let currentCamDist = 9.4;

    let isDragging = false;
    let dragStartPointerX = 0;
    let dragStartPointerY = 0;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let hasMoved = false;

    // Multi-touch tracking for pinch-to-zoom
    const activePointers = new Map<number, { x: number; y: number }>();
    let prevPinchDist = 0;

    // Default angle: azimuth = 0 (front), elevation = ~0.58 rad (~33 deg)
    let targetAzimuth = 0;
    let targetElevation = 0.58;
    let currentAzimuth = 0;
    let currentElevation = 0.58;

    const resetCamera = () => {
      targetCamDist = 9.4;
      targetAzimuth = 0;
      targetElevation = 0.58;
    };
    resetCameraRef.current = resetCamera;

    const handlePointerDown = (e: PointerEvent) => {
      if (isPausedRef.current) return;
      activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (activePointers.size === 2) {
        // Initialize Pinch-to-Zoom
        const pts = Array.from(activePointers.values());
        prevPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        hasMoved = true;
        return;
      }

      if (activePointers.size === 1) {
        isDragging = true;
        hasMoved = false;
        dragStartPointerX = e.clientX;
        dragStartPointerY = e.clientY;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
        container.style.cursor = "grabbing";
        try {
          container.setPointerCapture(e.pointerId);
        } catch {
          // Pointer capture fallback
        }
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isPausedRef.current) return;
      if (activePointers.has(e.pointerId)) {
        activePointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Handle 2-Finger Pinch-to-Zoom on Mobile / Tablets
      if (activePointers.size === 2) {
        const pts = Array.from(activePointers.values());
        const currPinchDist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (prevPinchDist > 0) {
          const deltaDist = currPinchDist - prevPinchDist;
          targetCamDist = Math.max(
            MIN_CAM_DIST,
            Math.min(MAX_CAM_DIST, targetCamDist - deltaDist * 0.02)
          );
        }
        prevPinchDist = currPinchDist;
        hasMoved = true;
        return;
      }

      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging && activePointers.size === 1) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;

        if (
          Math.abs(e.clientX - dragStartPointerX) > 4 ||
          Math.abs(e.clientY - dragStartPointerY) > 4
        ) {
          hasMoved = true;
        }

        // True horizontal 360° orbital rotation (dragging right rotates camera clockwise)
        targetAzimuth -= deltaX * 0.006;
        // Vertical pitch angle clamped between 0.18 rad (low angle) and 1.22 rad (top-down)
        targetElevation = Math.max(
          0.18,
          Math.min(1.22, targetElevation + deltaY * 0.004)
        );

        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
      } else {
        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const hovered = raycaster.intersectObjects(hitboxes, false);
        container.style.cursor = hovered.length > 0 ? "pointer" : "grab";
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      activePointers.delete(e.pointerId);

      if (activePointers.size < 2) {
        prevPinchDist = 0;
      }

      if (activePointers.size === 0) {
        isDragging = false;
        container.style.cursor = "grab";
        try {
          container.releasePointerCapture(e.pointerId);
        } catch {
          // Pointer capture fallback
        }
      }

      // If user tapped / clicked without dragging or pinching, perform raycast selection
      if (!hasMoved && !isPausedRef.current && activePointers.size === 0) {
        const rect = container.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(new THREE.Vector2(clickX, clickY), camera);
        const intersects = raycaster.intersectObjects(hitboxes, false);

        if (intersects.length > 0) {
          const propId = intersects[0].object.userData.id as InteractivePropId;
          if (propId === "laptop") {
            sound.playClick();
          } else {
            sound.playNodePulse();
          }
          onSelectObjectRef.current(propId);
        }
      }
    };

    // Desktop Mouse Wheel Zoom Handler
    const handleWheel = (e: WheelEvent) => {
      if (isPausedRef.current) return;
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.007;
      targetCamDist = Math.max(
        MIN_CAM_DIST,
        Math.min(MAX_CAM_DIST, targetCamDist + zoomDelta)
      );
    };

    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerUp);
    container.addEventListener("wheel", handleWheel, { passive: false });

    // 6. RESIZE OBSERVER
    const handleResize = () => {
      if (!container || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // 7. VISIBILITY & INTERSECTION PAUSING (Zero GPU consumption when hidden)
    let isTabVisible = document.visibilityState === "visible";
    let isIntersecting = true;

    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 8. 60FPS CAPPED SMART ANIMATION LOOP
    let animationFrameId: number;
    let lastRenderTime = performance.now();
    let lastDeltaTime = performance.now();
    const TARGET_FPS_INTERVAL = 1000 / 60; // 60 FPS cap

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip frames if tab hidden, element offscreen, or modal overlay active
      if (!isTabVisible || !isIntersecting || isPausedRef.current) {
        lastDeltaTime = now;
        return;
      }

      const elapsed = now - lastRenderTime;
      if (elapsed < TARGET_FPS_INTERVAL) {
        return;
      }
      lastRenderTime = now - (elapsed % TARGET_FPS_INTERVAL);

      const delta = Math.min((now - lastDeltaTime) / 1000, 0.1);
      lastDeltaTime = now;

      // Update animated props (steam, cassette & ID card matrix cipher)
      coffee.updateSteam(delta);
      cassette.updateDeck(delta, sound.getEnabled());
      idCard.updateCard(delta);

      // Smooth horizontal, vertical & zoom distance interpolation (Spherical Coordinates)
      currentCamDist += (targetCamDist - currentCamDist) * 0.10;
      currentAzimuth += (targetAzimuth - currentAzimuth) * 0.09;
      currentElevation += (targetElevation - currentElevation) * 0.09;

      const camX =
        lookTarget.x +
        currentCamDist * Math.sin(currentAzimuth) * Math.cos(currentElevation);
      const camY = lookTarget.y + currentCamDist * Math.sin(currentElevation);
      const camZ =
        lookTarget.z +
        currentCamDist * Math.cos(currentAzimuth) * Math.cos(currentElevation);

      camera.position.set(camX, camY, camZ);
      camera.lookAt(lookTarget);

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate(performance.now());

    // 9. THOROUGH CLEANUP TO PREVENT FAST-REFRESH VRAM / CONTEXT LEAKS
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerUp);
      container.removeEventListener("wheel", handleWheel);

      // Deep recursive disposal of geometries, materials, and textures
      scene.traverse((obj) => {
        const anyObj = obj as unknown as {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };
        if (anyObj.geometry) {
          anyObj.geometry.dispose();
        }
        if (anyObj.material) {
          if (Array.isArray(anyObj.material)) {
            anyObj.material.forEach((mat) => {
              const withMap = mat as THREE.MeshBasicMaterial;
              if (withMap.map) withMap.map.dispose();
              mat.dispose();
            });
          } else {
            const withMap = anyObj.material as THREE.MeshBasicMaterial;
            if (withMap.map) withMap.map.dispose();
            anyObj.material.dispose();
          }
        }
      });

      hitboxMat.dispose();
      scene.clear();

      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full relative" />;
}
