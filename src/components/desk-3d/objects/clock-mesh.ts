import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

/**
 * 3D Digital Alarm Clock with Live IST (Indian Standard Time) Display
 * Features 7-Segment LED Canvas Screen, Pulsing Colon, Workstation RGB Theme Sync,
 * and Interactive 12H/24H Format Toggle.
 */
export function createClockMesh(): {
  group: THREE.Group;
  clockHitbox: THREE.Mesh;
  setTheme: (theme: WorkstationTheme) => void;
  updateClock: (delta: number) => void;
  toggleFormat: () => void;
} {
  const group = new THREE.Group();
  group.name = "digital-clock-system";

  // 1. POSITIONING & ORIENTATION ON DESK
  // Placed in mid-left desk area (former synthesizer position), angled towards operator
  const CLOCK_POS = new THREE.Vector3(-4.2, 0.028, 0.9);
  const CLOCK_ROT_Y = Math.PI / 8; // ~22.5° angle towards chair

  group.position.copy(CLOCK_POS);
  group.rotation.y = CLOCK_ROT_Y;
  group.scale.set(1.2, 1.2, 1.2);

  // 2. INVISIBLE HITBOX FOR FAST RAYCASTING & CLICK INTERACTION
  const hitboxGeo = new THREE.BoxGeometry(1.6, 0.75, 0.55);
  const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
  const clockHitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
  clockHitbox.position.set(0, 0.35, 0);
  clockHitbox.userData = { id: "clock", interactive: true };
  group.add(clockHitbox);

  // 3. LIVE 7-SEGMENT DYNAMIC CANVAS TEXTURE
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const displayTexture = new THREE.CanvasTexture(canvas);
  displayTexture.flipY = false;
  displayTexture.minFilter = THREE.LinearFilter;
  displayTexture.magFilter = THREE.LinearFilter;
  displayTexture.colorSpace = THREE.SRGBColorSpace;

  let currentThemeHex = DEFAULT_THEME.hex;
  let use24Hour = true;
  let pulseTime = 0;
  let lastSecond = -1;

  // Helper to draw clean 7-segment digit on 2D canvas
  const draw7Segment = (
    c: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    w: number,
    h: number,
    t: number,
    digit: number | string,
    colorHex: string,
    unlitHex: string,
    slant = 0.08
  ) => {
    const hw = w / 2;
    const hh = h / 2;

    const pt = (px: number, py: number): [number, number] => {
      const sx = px - (py - hh) * slant;
      return [x0 + sx, y0 + py];
    };

    const segmentsMap: Record<string, boolean[]> = {
      "0": [true, true, true, true, true, true, false],
      "1": [false, true, true, false, false, false, false],
      "2": [true, true, false, true, true, false, true],
      "3": [true, true, true, true, false, false, true],
      "4": [false, true, true, false, false, true, true],
      "5": [true, false, true, true, false, true, true],
      "6": [true, false, true, true, true, true, true],
      "7": [true, true, true, false, false, false, false],
      "8": [true, true, true, true, true, true, true],
      "9": [true, true, true, true, false, true, true],
      "-": [false, false, false, false, false, false, true],
      " ": [false, false, false, false, false, false, false],
    };

    const lit = segmentsMap[String(digit)] || segmentsMap[" "];
    const gap = t * 0.22;

    const drawPoly = (pts: [number, number][], isLit: boolean) => {
      c.fillStyle = isLit ? colorHex : unlitHex;
      c.beginPath();
      c.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) {
        c.lineTo(pts[i][0], pts[i][1]);
      }
      c.closePath();
      c.fill();
    };

    // a: top horizontal
    drawPoly(
      [
        pt(t + gap, 0),
        pt(w - t - gap, 0),
        pt(w - t * 1.5 - gap, t),
        pt(t * 1.5 + gap, t),
      ],
      lit[0]
    );

    // b: top-right vertical
    drawPoly(
      [
        pt(w, t + gap),
        pt(w, hh - t * 0.5 - gap),
        pt(w - t, hh - t * 0.1 - gap),
        pt(w - t, t * 1.5 + gap),
      ],
      lit[1]
    );

    // c: bottom-right vertical
    drawPoly(
      [
        pt(w, hh + t * 0.5 + gap),
        pt(w, h - t - gap),
        pt(w - t, h - t * 1.5 - gap),
        pt(w - t, hh + t * 0.1 + gap),
      ],
      lit[2]
    );

    // d: bottom horizontal
    drawPoly(
      [
        pt(t * 1.5 + gap, h - t),
        pt(w - t * 1.5 - gap, h - t),
        pt(w - t - gap, h),
        pt(t + gap, h),
      ],
      lit[3]
    );

    // e: bottom-left vertical
    drawPoly(
      [
        pt(0, hh + t * 0.5 + gap),
        pt(t, hh + t * 0.1 + gap),
        pt(t, h - t * 1.5 - gap),
        pt(0, h - t - gap),
      ],
      lit[4]
    );

    // f: top-left vertical
    drawPoly(
      [
        pt(0, t + gap),
        pt(t, t * 1.5 + gap),
        pt(t, hh - t * 0.1 - gap),
        pt(0, hh - t * 0.5 - gap),
      ],
      lit[5]
    );

    // g: middle horizontal
    drawPoly(
      [
        pt(t * 1.2 + gap, hh),
        pt(t * 1.8 + gap, hh - t * 0.5),
        pt(w - t * 1.8 - gap, hh - t * 0.5),
        pt(w - t * 1.2 - gap, hh),
        pt(w - t * 1.8 - gap, hh + t * 0.5),
        pt(t * 1.8 + gap, hh + t * 0.5),
      ],
      lit[6]
    );
  };

  const renderDisplay = (colonPulseAlpha = 1.0) => {
    if (!ctx) return;

    // Dark mirror glass face background
    ctx.fillStyle = "#06090e";
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle scanline texture
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 1024, 2);
    }

    // Read current live IST time
    const now = new Date();
    const istTimeStr = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kolkata",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const parts = istTimeStr.split(":");
    let hoursNum = parseInt(parts[0], 10);
    const minsStr = parts[1] || "00";
    const secsStr = parts[2] || "00";

    let ampm = "";
    if (!use24Hour) {
      ampm = hoursNum >= 12 ? "PM" : "AM";
      hoursNum = hoursNum % 12 || 12;
    }
    const hoursStr = String(hoursNum).padStart(2, "0");

    const litColor = currentThemeHex;
    const unlitColor = "rgba(20, 30, 42, 0.4)";

    // Top status telemetry bar: DATE & TIMEZONE
    const dateStr = now.toLocaleDateString("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      month: "short",
      day: "numeric",
    }).toUpperCase();

    ctx.font = "bold 28px monospace";
    ctx.fillStyle = `${currentThemeHex}cc`;
    ctx.fillText(`IST [UTC+5:30] • ${dateStr}`, 90, 68);

    if (ampm) {
      ctx.fillStyle = currentThemeHex;
      ctx.fillText(ampm, 860, 68);
    }

    // Main 7-Segment Digits: [H1] [H2] : [M1] [M2]
    const digitW = 120;
    const digitH = 240;
    const segT = 26;
    const yPos = 120;

    // Hours
    draw7Segment(ctx, 90, yPos, digitW, digitH, segT, hoursStr[0], litColor, unlitColor);
    draw7Segment(ctx, 235, yPos, digitW, digitH, segT, hoursStr[1], litColor, unlitColor);

    // Pulsing Colon Dots ':'
    const colonX = 395;
    const dotR = 14;
    const dotY1 = yPos + digitH * 0.33;
    const dotY2 = yPos + digitH * 0.67;

    ctx.fillStyle = currentThemeHex;
    ctx.globalAlpha = Math.max(0.2, colonPulseAlpha);
    ctx.beginPath();
    ctx.arc(colonX, dotY1, dotR, 0, Math.PI * 2);
    ctx.arc(colonX, dotY2, dotR, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Minutes
    draw7Segment(ctx, 440, yPos, digitW, digitH, segT, minsStr[0], litColor, unlitColor);
    draw7Segment(ctx, 585, yPos, digitW, digitH, segT, minsStr[1], litColor, unlitColor);

    // Seconds (smaller 7-segment digits on the right)
    const secW = 75;
    const secH = 150;
    const secT = 16;
    const secY = yPos + 85;

    ctx.font = "bold 20px monospace";
    ctx.fillStyle = `${currentThemeHex}99`;
    ctx.fillText("SEC", 745, secY - 14);

    draw7Segment(ctx, 745, secY, secW, secH, secT, secsStr[0], litColor, unlitColor);
    draw7Segment(ctx, 840, secY, secW, secH, secT, secsStr[1], litColor, unlitColor);

    // Bottom telemetry bar: "NEERAJ_M // SYSTEM_CLOCK"
    ctx.font = "bold 22px monospace";
    ctx.fillStyle = `${currentThemeHex}88`;
    ctx.fillText("NEERAJ_M // ATOMIC_SYNC • ASIA/KOLKATA", 90, 445);

    displayTexture.needsUpdate = true;
  };

  renderDisplay(1.0);

  // 4. LOAD 3D DIGITAL ALARM CLOCK GLB
  const modelContainer = new THREE.Group();
  group.add(modelContainer);

  let screenMaterial: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial | null = null;
  const wireMaterials: THREE.LineBasicMaterial[] = [];

  // Procedural fallback while loading
  const fallbackGeo = new THREE.BoxGeometry(1.4, 0.56, 0.36);
  const fallbackMat = new THREE.MeshStandardMaterial({
    color: 0x0a1018,
    roughness: 0.5,
  });
  const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
  fallbackMesh.position.set(0, 0.28, 0);
  modelContainer.add(fallbackMesh);

  const loader = new GLTFLoader();
  loader.load(
    "/models/digital_clock.glb",
    (gltf) => {
      modelContainer.remove(fallbackMesh);
      fallbackGeo.dispose();
      fallbackMat.dispose();

      const clockScene = gltf.scene;
      clockScene.position.set(0, 0.295, 0);
      clockScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.name.toLowerCase().includes("screen") || (mesh.material && (mesh.material as THREE.Material).name.toLowerCase().includes("screen"))) {
            // Apply live dynamic canvas texture to screen
            const mat = new THREE.MeshStandardMaterial({
              map: displayTexture,
              emissiveMap: displayTexture,
              emissive: new THREE.Color(currentThemeHex),
              emissiveIntensity: 1.4,
              roughness: 0.12,
              metalness: 0.85,
            });
            mesh.material = mat;
            screenMaterial = mat;
          } else if (mesh.name.toLowerCase().includes("body") || mesh.name.toLowerCase().includes("chassis")) {
            const bodyMat = new THREE.MeshStandardMaterial({
              color: 0x090e16,
              roughness: 0.45,
              metalness: 0.35,
            });
            mesh.material = bodyMat;

            // Wireframe contour
            const edges = new THREE.EdgesGeometry(mesh.geometry, 25);
            const wireMat = new THREE.LineBasicMaterial({
              color: DEFAULT_THEME.threeColor,
              transparent: true,
              opacity: 0.35,
            });
            const wire = new THREE.LineSegments(edges, wireMat);
            mesh.add(wire);
            wireMaterials.push(wireMat);
          }
        }
      });

      modelContainer.add(clockScene);
    },
    undefined,
    (err) => console.warn("Could not load /models/digital_clock.glb:", err)
  );

  // 5. UPDATE TICK & THEME LOGIC
  const updateClock = (delta: number) => {
    pulseTime += delta * 3.5;
    // Smooth sine wave pulse for colon ':'
    const colonAlpha = (Math.sin(pulseTime) + 1.0) / 2.0;

    const currentSec = new Date().getSeconds();
    if (currentSec !== lastSecond || Math.abs(colonAlpha - 0.5) > 0.45) {
      lastSecond = currentSec;
      renderDisplay(colonAlpha);
    }
  };

  const setTheme = (theme: WorkstationTheme) => {
    currentThemeHex = theme.hex;
    wireMaterials.forEach((m) => m.color.setHex(theme.threeColor));
    if (screenMaterial) {
      screenMaterial.emissive.setHex(theme.threeColor);
    }
    renderDisplay(1.0);
  };

  const toggleFormat = () => {
    use24Hour = !use24Hour;
    renderDisplay(1.0);
  };

  return {
    group,
    clockHitbox,
    setTheme,
    updateClock,
    toggleFormat,
  };
}
