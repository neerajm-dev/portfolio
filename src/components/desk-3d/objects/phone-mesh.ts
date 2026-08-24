import * as THREE from "three";

export function createPhoneMesh(): {
  group: THREE.Group;
  phoneMesh: THREE.Mesh;
} {
  const group = new THREE.Group();
  group.name = "phone-prop";
  group.position.set(3.4, 0.02, -0.4);
  group.rotation.y = -Math.PI / 14;

  const pw = 0.94; // width
  const ph = 1.98; // height
  const radius = 0.14; // corner radius
  const pDepth = 0.088; // smartphone thickness

  // 1. SLEEK DARK STANDBY OLED SCREEN (PHONE OFF)
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 960;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Cyber OLED Wallpaper
    ctx.fillStyle = "#03080e";
    ctx.fillRect(0, 0, 480, 960);

    // Radial Neon Glow
    const bgGlow = ctx.createRadialGradient(240, 480, 20, 240, 480, 320);
    bgGlow.addColorStop(0, "rgba(0, 255, 102, 0.14)");
    bgGlow.addColorStop(0.6, "rgba(0, 255, 102, 0.03)");
    bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, 480, 960);

    // Subtle Grid Matrix
    ctx.strokeStyle = "rgba(0, 255, 102, 0.06)";
    ctx.lineWidth = 1;
    for (let x = 0; x < 480; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 960);
      ctx.stroke();
    }
    for (let y = 0; y < 960; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(480, y);
      ctx.stroke();
    }

    // Dynamic Island Silhouette (Top Center)
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(175, 24, 130, 36, 18);
    ctx.fill();

    // Front Camera Lens Dot
    ctx.fillStyle = "#0a1520";
    ctx.beginPath();
    ctx.arc(205, 42, 7, 0, Math.PI * 2);
    ctx.fill();

    // Status Bar Telemetry
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText("19:00", 38, 52);
    ctx.fillStyle = "#00ff66";
    ctx.fillText("5G  100%", 350, 52);

    // Lockscreen Clock Widget
    ctx.textAlign = "center";
    ctx.font = "900 68px monospace";
    ctx.fillStyle = "#00ff66";
    ctx.shadowColor = "#00ff66";
    ctx.shadowBlur = 18;
    ctx.fillText("19:00", 240, 240);
    ctx.shadowBlur = 0;

    ctx.font = "bold 16px monospace";
    ctx.fillStyle = "#71717a";
    ctx.fillText("KERALA, IN • 28°C", 240, 280);

    // 🏎️ KTCC Flagship App Icon Box
    ctx.fillStyle = "#001a0a";
    ctx.strokeStyle = "#00ff66";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(175, 420, 130, 130, 32);
    ctx.fill();
    ctx.stroke();

    // KTCC Badge Text
    ctx.font = "900 34px monospace";
    ctx.fillStyle = "#00ff66";
    ctx.shadowColor = "#00ff66";
    ctx.shadowBlur = 14;
    ctx.fillText("KTCC", 240, 498);
    ctx.shadowBlur = 0;

    // Notification Badge Dot
    ctx.fillStyle = "#00ff66";
    ctx.beginPath();
    ctx.arc(295, 430, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000000";
    ctx.font = "900 16px monospace";
    ctx.fillText("1", 295, 436);

    // App Label
    ctx.font = "bold 20px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("KTCC Live", 240, 590);

    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#00ff66";
    ctx.fillText("[ TAP TO LAUNCH ]", 240, 620);

    // Bottom Navigation Bar Pill
    ctx.fillStyle = "#52525b";
    ctx.beginPath();
    ctx.roundRect(160, 920, 160, 10, 5);
    ctx.fill();
    ctx.textAlign = "left";
  }

  const screenTexture = new THREE.CanvasTexture(canvas);
  screenTexture.minFilter = THREE.LinearFilter;
  screenTexture.magFilter = THREE.LinearFilter;
  screenTexture.colorSpace = THREE.SRGBColorSpace;

  // 2. CHASSIS GEOMETRY (Rounded Extrusion)
  const phoneShape = new THREE.Shape();
  const halfW = pw / 2;
  const halfH = ph / 2;

  phoneShape.moveTo(-halfW + radius, -halfH);
  phoneShape.lineTo(halfW - radius, -halfH);
  phoneShape.absarc(halfW - radius, -halfH + radius, radius, -Math.PI / 2, 0, false);
  phoneShape.lineTo(halfW, halfH - radius);
  phoneShape.absarc(halfW - radius, halfH - radius, radius, 0, Math.PI / 2, false);
  phoneShape.lineTo(-halfW + radius, halfH);
  phoneShape.absarc(-halfW + radius, halfH - radius, radius, Math.PI / 2, Math.PI, false);
  phoneShape.lineTo(-halfW, -halfH + radius);
  phoneShape.absarc(-halfW + radius, -halfH + radius, radius, Math.PI, Math.PI * 1.5, false);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: pDepth,
    bevelEnabled: true,
    bevelSegments: 4,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  };

  const phoneGeo = new THREE.ExtrudeGeometry(phoneShape, extrudeSettings);
  const chassisMat = new THREE.MeshStandardMaterial({
    color: 0x0c131d,
    roughness: 0.28,
    metalness: 0.88,
  });

  const phoneMesh = new THREE.Mesh(phoneGeo, chassisMat);
  phoneMesh.position.set(0, 0.044, 0);
  phoneMesh.castShadow = true;
  phoneMesh.receiveShadow = true;
  phoneMesh.userData = { id: "phone", interactive: true };

  // Front OLED Screen Glass Surface
  const screenGeo = new THREE.ShapeGeometry(phoneShape);
  const posAttr = screenGeo.getAttribute("position");
  const uvs: number[] = [];
  for (let i = 0; i < posAttr.count; i++) {
    const px = posAttr.getX(i);
    const py = posAttr.getY(i);
    const u = (px + halfW) / (2 * halfW);
    const v = (py + halfH) / (2 * halfH);
    uvs.push(u, v);
  }
  screenGeo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, pDepth + 0.022);
  phoneMesh.add(screenMesh);

  // Wireframe Chassis Edge Highlights
  const edges = new THREE.EdgesGeometry(phoneGeo, 24);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x00ff66,
    transparent: true,
    opacity: 0.45,
  });
  const wire = new THREE.LineSegments(edges, wireMat);
  phoneMesh.add(wire);

  phoneMesh.rotation.x = -Math.PI / 2;
  group.add(phoneMesh);

  return { group, phoneMesh };
}
