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
    // Deep OLED Black Standby
    ctx.fillStyle = "#020408";
    ctx.fillRect(0, 0, 480, 960);

    // Subtle dark glass reflection gradient
    const grad = ctx.createLinearGradient(0, 0, 480, 960);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.03)");
    grad.addColorStop(0.5, "rgba(255, 255, 255, 0.005)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0.2)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 480, 960);

    // Dynamic Island Silhouette (Top Center)
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.roundRect(175, 24, 130, 36, 18);
    ctx.fill();

    // Front Camera Lens Dot
    ctx.fillStyle = "#0a0e16";
    ctx.beginPath();
    ctx.arc(205, 42, 7, 0, Math.PI * 2);
    ctx.fill();

    // Ambient Sensor Dot
    ctx.fillStyle = "#04070c";
    ctx.beginPath();
    ctx.arc(275, 42, 4.5, 0, Math.PI * 2);
    ctx.fill();
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
    color: 0x06090e,
    roughness: 0.35,
    metalness: 0.85,
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
    polygonOffset: true,
    polygonOffsetFactor: -3,
    polygonOffsetUnits: -3,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, pDepth + 0.016);
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
