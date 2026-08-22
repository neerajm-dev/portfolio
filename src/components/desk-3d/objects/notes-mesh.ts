import * as THREE from "three";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

export function createNotesMesh(): {
  group: THREE.Group;
  notesMesh: THREE.Mesh;
  setTheme: (theme: WorkstationTheme) => void;
} {
  const group = new THREE.Group();
  group.name = "notes-prop";
  group.position.set(-4.5, 0.02, -1.5);
  group.rotation.y = -Math.PI / 12;

  // 1. CANVAS TEXTURE FOR STICKY NOTE
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.colorSpace = THREE.SRGBColorSpace;

  const renderNote = (themeHex: string = DEFAULT_THEME.hex) => {
    if (!ctx) return;
    // Deep neutral dark carbon background
    ctx.fillStyle = "#06090e";
    ctx.fillRect(0, 0, 256, 256);

    ctx.strokeStyle = themeHex;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 248);

    ctx.fillStyle = themeHex;
    ctx.font = "bold 16px monospace";
    ctx.fillText("// ONAM_GOALS", 18, 36);

    ctx.strokeStyle = `${themeHex}66`;
    ctx.beginPath();
    ctx.moveTo(18, 48);
    ctx.lineTo(238, 48);
    ctx.stroke();

    ctx.font = "14px monospace";
    ctx.fillStyle = `${themeHex}e6`;
    ctx.fillText("• $0 Cloud Infra", 20, 80);
    ctx.fillText("• KTCC Live Prod", 20, 110);
    ctx.fillText("• Strict TS (0 any)", 20, 140);
    ctx.fillText("• Brotoraise Engine", 20, 170);

    ctx.font = "bold 12px monospace";
    ctx.fillStyle = themeHex;
    ctx.fillText("[ 📝 CLICK TO EXPAND ]", 32, 225);

    texture.needsUpdate = true;
  };

  renderNote(DEFAULT_THEME.hex);

  // 2. STICKY NOTE MESH
  const noteGeo = new THREE.BoxGeometry(1.25, 0.015, 1.25);
  const noteMat = new THREE.MeshStandardMaterial({
    color: 0x06090e,
    roughness: 0.7,
  });
  const topMat = new THREE.MeshBasicMaterial({
    map: texture,
    toneMapped: false,
  });

  const materials = [
    noteMat,
    noteMat,
    topMat,
    noteMat,
    noteMat,
    noteMat,
  ];

  const notesMesh = new THREE.Mesh(noteGeo, materials);
  notesMesh.castShadow = true;
  notesMesh.receiveShadow = true;
  notesMesh.userData = { id: "notes", interactive: true };
  group.add(notesMesh);

  // Wireframe border
  const edges = new THREE.EdgesGeometry(noteGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.6,
  });
  const wire = new THREE.LineSegments(edges, edgeMat);
  group.add(wire);

  // 3. GLOWING PIN HEAD
  const pinGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const pinMat = new THREE.MeshBasicMaterial({ color: DEFAULT_THEME.threeColor });
  const pin = new THREE.Mesh(pinGeo, pinMat);
  pin.position.set(0, 0.05, -0.56);
  group.add(pin);

  const setTheme = (theme: WorkstationTheme) => {
    renderNote(theme.hex);
    edgeMat.color.setHex(theme.threeColor);
    pinMat.color.setHex(theme.threeColor);
  };

  return { group, notesMesh, setTheme };
}
