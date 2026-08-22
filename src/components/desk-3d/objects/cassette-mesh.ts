import * as THREE from "three";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

export function createCassetteMesh(): {
  group: THREE.Group;
  deckMesh: THREE.Mesh;
  updateDeck: (delta: number, isAudioOn: boolean) => void;
  setTheme: (theme: WorkstationTheme) => void;
} {
  const group = new THREE.Group();
  group.name = "cassette-prop";
  group.position.set(-4.2, 0, 1.4);
  group.rotation.y = Math.PI / 14;

  let currentThemeHex = DEFAULT_THEME.hex;

  // 1. DECK CHASSIS
  const chassisGeo = new THREE.BoxGeometry(1.6, 0.35, 1.05);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x06090e,
    roughness: 0.6,
    metalness: 0.3,
  });

  // 2. EQUALIZER CANVAS TEXTURE
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  const eqTexture = new THREE.CanvasTexture(canvas);
  eqTexture.minFilter = THREE.LinearFilter;
  eqTexture.magFilter = THREE.LinearFilter;
  eqTexture.colorSpace = THREE.SRGBColorSpace;

  const drawEqualizer = (isAudioOn: boolean, timeVal: number, themeHex: string = currentThemeHex) => {
    if (!ctx) return;
    // Deep neutral dark carbon background
    ctx.fillStyle = "#06090e";
    ctx.fillRect(0, 0, 256, 128);

    ctx.strokeStyle = themeHex;
    ctx.lineWidth = 2;
    ctx.strokeRect(4, 4, 248, 120);

    // Title
    ctx.fillStyle = themeHex;
    ctx.font = "bold 14px monospace";
    ctx.fillText("SYNTH_DECK // SFX", 16, 26);

    ctx.font = "11px monospace";
    ctx.fillText(isAudioOn ? "[ ACTIVE ]" : "[ MUTED ]", 170, 26);

    // Equalizer bars
    const barCount = 10;
    const barWidth = 18;
    const spacing = 4;
    const startX = 18;

    for (let i = 0; i < barCount; i++) {
      const height = isAudioOn
        ? 15 + Math.abs(Math.sin(timeVal * 4 + i * 0.8)) * 50
        : 6;
      const x = startX + i * (barWidth + spacing);
      const y = 110 - height;

      // Inactive background bar
      ctx.fillStyle = `${themeHex}26`;
      ctx.fillRect(x, 40, barWidth, 70);

      // Active bar level
      ctx.fillStyle = themeHex;
      ctx.fillRect(x, y, barWidth, height);
    }

    eqTexture.needsUpdate = true;
  };

  drawEqualizer(true, 0, DEFAULT_THEME.hex);

  const topFaceMat = new THREE.MeshBasicMaterial({
    map: eqTexture,
    toneMapped: false,
  });
  const materials = [
    chassisMat, // right
    chassisMat, // left
    topFaceMat, // top
    chassisMat, // bottom
    chassisMat, // front
    chassisMat, // back
  ];

  const deckMesh = new THREE.Mesh(chassisGeo, materials);
  deckMesh.position.y = 0.175;
  deckMesh.castShadow = true;
  deckMesh.receiveShadow = true;
  deckMesh.userData = { id: "cassette", interactive: true };
  group.add(deckMesh);

  // Chassis Wireframe Edges
  const edges = new THREE.EdgesGeometry(chassisGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.6,
  });
  const wire = new THREE.LineSegments(edges, edgeMat);
  wire.position.y = 0.175;
  group.add(wire);

  // 3. DUAL CASSETTE REELS
  const reelGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.02, 12);
  const reelMat = new THREE.MeshStandardMaterial({
    color: 0x0d121c,
    emissive: DEFAULT_THEME.threeColor,
    emissiveIntensity: 0.3,
  });

  const reel1 = new THREE.Mesh(reelGeo, reelMat);
  reel1.position.set(-0.4, 0.36, 0.2);
  group.add(reel1);

  const reel2 = new THREE.Mesh(reelGeo, reelMat);
  reel2.position.set(0.4, 0.36, 0.2);
  group.add(reel2);

  let timer = 0;
  let lastDrawTime = 0;
  const updateDeck = (delta: number, isAudioOn: boolean) => {
    timer += delta;
    if (isAudioOn) {
      reel1.rotation.y += delta * 2;
      reel2.rotation.y += delta * 2;
    }
    // Throttle GPU texture uploads to every 120ms (8 FPS for equalizer)
    if (timer - lastDrawTime > 0.12) {
      lastDrawTime = timer;
      drawEqualizer(isAudioOn, timer, currentThemeHex);
    }
  };

  const setTheme = (theme: WorkstationTheme) => {
    currentThemeHex = theme.hex;
    edgeMat.color.setHex(theme.threeColor);
    reelMat.emissive.setHex(theme.threeColor);
    drawEqualizer(true, timer, theme.hex);
  };

  return { group, deckMesh, updateDeck, setTheme };
}
