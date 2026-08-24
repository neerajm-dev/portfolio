import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

/**
 * 3D Tactical Gaming Mouse (Zeb-Transformer Edition)
 * Custom Bulky Faceted Mecha USB-A Connector & Thick Braided Nylon Cable
 * Model Attribution: "Gaming Mouse" (https://skfb.ly/p8Gty) by jerard27 licensed under CC BY 4.0
 */
export function createMouseMesh(): {
  group: THREE.Group;
  mouseHitbox: THREE.Mesh;
  setTheme: (theme: WorkstationTheme) => void;
  triggerClick: () => void;
  updateMouse: (delta: number) => void;
} {
  const group = new THREE.Group();
  group.name = "gaming-mouse-system";

  // Mouse Base World Coordinates (Brought further backwards near front table edge)
  const MOUSE_POS = new THREE.Vector3(3.58, 0.028, 3.42);
  const MOUSE_ROT_Y = -Math.PI / 16; // Natural ~11° ergonomic hand angle

  const mouseAnchor = new THREE.Group();
  mouseAnchor.position.copy(MOUSE_POS);
  mouseAnchor.rotation.y = MOUSE_ROT_Y;
  group.add(mouseAnchor);

  // 1. INVISIBLE HITBOX FOR FAST RAYCASTING & INTERACTION
  const hitboxGeo = new THREE.BoxGeometry(0.95, 0.60, 1.45);
  const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
  const mouseHitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
  mouseHitbox.position.set(0, 0.25, 0);
  mouseHitbox.userData = { id: "mouse", interactive: true };
  mouseAnchor.add(mouseHitbox);

  // 2. TACTICAL MOUSE CHASSIS (Loaded via GLTFLoader with procedural fallback)
  const modelContainer = new THREE.Group();
  mouseAnchor.add(modelContainer);

  const glowMaterials: (THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial)[] = [];
  const bodyMaterials: (THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial)[] = [];

  // Procedural Fallback Mesh while GLB loads asynchronously
  const fallbackGeo = new THREE.BoxGeometry(0.68, 0.40, 1.20);
  const fallbackMat = new THREE.MeshStandardMaterial({
    color: 0x090f18,
    roughness: 0.45,
    metalness: 0.35,
  });
  const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
  fallbackMesh.position.set(0, 0.20, 0);
  modelContainer.add(fallbackMesh);

  const loader = new GLTFLoader();
  loader.load(
    "/models/mouse.glb",
    (gltf) => {
      modelContainer.remove(fallbackMesh);
      fallbackGeo.dispose();
      fallbackMat.dispose();

      const mouseScene = gltf.scene;

      // Scale model to match realistic scale relative to ASUS TUF 15.6" chassis
      const MOUSE_SCALE = 5.0;
      mouseScene.scale.set(MOUSE_SCALE, MOUSE_SCALE, MOUSE_SCALE);
      mouseScene.position.set(0, 0, 0);
      mouseScene.rotation.y = Math.PI; // Face forward towards laptop screen

      mouseScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;
          if (mat) {
            // Glowing RGB LED strip channels
            if (
              mat.name.toLowerCase().includes("standardsurface2") ||
              mat.name.toLowerCase().includes("glow") ||
              mat.name.toLowerCase().includes("led")
            ) {
              mat.color = new THREE.Color(DEFAULT_THEME.threeColor);
              mat.emissive = new THREE.Color(DEFAULT_THEME.threeColor);
              mat.emissiveIntensity = 1.6;
              glowMaterials.push(mat);
            } else {
              mat.roughness = Math.max(0.35, mat.roughness);
              bodyMaterials.push(mat);
            }
          }
        }
      });

      modelContainer.add(mouseScene);
    },
    undefined,
    (error) => {
      console.warn("Could not load /models/mouse.glb, using procedural fallback.", error);
    }
  );

  // 3. BULKY ZEB-TRANSFORMER CUSTOM USB-A CONNECTOR & STRAIN RELIEF
  const LAPTOP_USB_PORT = new THREE.Vector3(2.235, 0.097, 1.97);

  const usbConnectorGroup = new THREE.Group();
  usbConnectorGroup.position.copy(LAPTOP_USB_PORT);
  // Rotated Math.PI / 2 so gold plug inserts into laptop and bulky body extends outward along +X
  usbConnectorGroup.rotation.y = Math.PI / 2;

  // 3a. Gold-Plated USB-A Metal Plug Connector Head
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xdeb841,
    metalness: 0.95,
    roughness: 0.18,
    emissive: 0x52400e,
    emissiveIntensity: 0.20,
  });

  const usbPlugGeo = new THREE.BoxGeometry(0.095, 0.042, 0.11);
  const usbPlugMesh = new THREE.Mesh(usbPlugGeo, goldMat);
  usbPlugMesh.position.set(0, 0, -0.045);
  usbConnectorGroup.add(usbPlugMesh);

  // USB Plug Contact Pins & Interior Insulator Tongue
  const pinMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
  const pin1 = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.008, 0.022), pinMat);
  pin1.position.set(-0.024, 0.0215, -0.055);
  usbConnectorGroup.add(pin1);
  const pin2 = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.008, 0.022), pinMat);
  pin2.position.set(0.024, 0.0215, -0.055);
  usbConnectorGroup.add(pin2);

  // 3b. Heavy-Duty Armored Mecha Housing (Matte Obsidian Cyber Polymer)
  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x0c1118,
    roughness: 0.50,
    metalness: 0.45,
  });

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x16202c,
    roughness: 0.40,
    metalness: 0.65,
  });

  // Front Collar Shell
  const frontCollarGeo = new THREE.BoxGeometry(0.125, 0.062, 0.12);
  const frontCollarMesh = new THREE.Mesh(frontCollarGeo, housingMat);
  frontCollarMesh.position.set(0, 0, 0.060);
  usbConnectorGroup.add(frontCollarMesh);

  // Main Wide Diamond Transformer Faceted Mecha Shell (Iconic Zeb-Transformer Shape)
  const midFacetedGeo = new THREE.BoxGeometry(0.160, 0.076, 0.16);
  const midFacetedMesh = new THREE.Mesh(midFacetedGeo, housingMat);
  midFacetedMesh.position.set(0, 0, 0.180);
  usbConnectorGroup.add(midFacetedMesh);

  // Side Angular Mecha Wing Chamfers
  const wingGeo = new THREE.CylinderGeometry(0.060, 0.045, 0.14, 6);
  wingGeo.rotateZ(Math.PI / 2);
  wingGeo.rotateY(Math.PI / 2);
  const leftWing = new THREE.Mesh(wingGeo, accentMat);
  leftWing.position.set(0, 0, 0.185);
  usbConnectorGroup.add(leftWing);

  // Top Sculpted Ridge & Raised Armor Crest
  const crestGeo = new THREE.BoxGeometry(0.070, 0.018, 0.13);
  const crestMesh = new THREE.Mesh(crestGeo, accentMat);
  crestMesh.position.set(0, 0.042, 0.180);
  usbConnectorGroup.add(crestMesh);

  // Embossed USB Trident Emblem on Top Face
  const tridentMat = new THREE.MeshStandardMaterial({
    color: DEFAULT_THEME.threeColor,
    emissive: DEFAULT_THEME.threeColor,
    emissiveIntensity: 0.4,
    roughness: 0.3,
  });
  const tridentGeo = new THREE.BoxGeometry(0.032, 0.005, 0.065);
  const tridentMesh = new THREE.Mesh(tridentGeo, tridentMat);
  tridentMesh.position.set(0, 0.052, 0.180);
  usbConnectorGroup.add(tridentMesh);

  // Back Taper Section (Transitioning smoothly into the strain-relief boot)
  const backTaperGeo = new THREE.CylinderGeometry(0.042, 0.068, 0.08, 8);
  backTaperGeo.rotateX(Math.PI / 2);
  const backTaperMesh = new THREE.Mesh(backTaperGeo, housingMat);
  backTaperMesh.position.set(0, 0, 0.290);
  usbConnectorGroup.add(backTaperMesh);

  // 3c. 4-Segment Ribbed Heavy-Duty Rubber Strain Relief Boot (From Reference Image)
  const bootMat = new THREE.MeshStandardMaterial({
    color: 0x090d13,
    roughness: 0.85,
    metalness: 0.20,
  });

  const ribGroup = new THREE.Group();
  for (let i = 0; i < 4; i++) {
    const w = 0.060 - i * 0.006;
    const h = 0.046 - i * 0.005;
    const ribMesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.018), bootMat);
    ribMesh.position.set(0, 0, 0.345 + i * 0.026);
    ribGroup.add(ribMesh);

    // Recessed connector slot between ribs
    if (i < 3) {
      const slotMesh = new THREE.Mesh(new THREE.BoxGeometry(w * 0.72, h * 0.72, 0.012), bootMat);
      slotMesh.position.set(0, 0, 0.358 + i * 0.026);
      ribGroup.add(slotMesh);
    }
  }
  usbConnectorGroup.add(ribGroup);

  // 3d. Glowing Cyber Edge Accents on USB Armor Shell
  const housingWireGeo = new THREE.EdgesGeometry(midFacetedGeo);
  const housingWireMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.65,
  });
  const housingWire = new THREE.LineSegments(housingWireGeo, housingWireMat);
  housingWire.position.set(0, 0, 0.180);
  usbConnectorGroup.add(housingWire);

  const frontWireGeo = new THREE.EdgesGeometry(frontCollarGeo);
  const frontWire = new THREE.LineSegments(frontWireGeo, housingWireMat);
  frontWire.position.set(0, 0, 0.060);
  usbConnectorGroup.add(frontWire);

  group.add(usbConnectorGroup);

  // 4. MOUSE NOSE CHUNKY STRAIN RELIEF BUSHING
  const mouseNoseLocal = new THREE.Vector3(0, 0.065, -0.62);
  const mouseNoseWorld = mouseNoseLocal.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), MOUSE_ROT_Y).add(MOUSE_POS);

  const noseBootGroup = new THREE.Group();
  noseBootGroup.position.copy(mouseNoseWorld);
  noseBootGroup.rotation.y = MOUSE_ROT_Y;

  const noseBootGeo = new THREE.CylinderGeometry(0.036, 0.052, 0.12, 8);
  noseBootGeo.rotateX(Math.PI / 2);
  const noseBootMesh = new THREE.Mesh(noseBootGeo, bootMat);
  noseBootMesh.position.set(0, 0, -0.060);
  noseBootGroup.add(noseBootMesh);
  group.add(noseBootGroup);

  // 5. BUNDLED CABLE MANAGEMENT SYSTEM & VELCRO STRAP
  const BUNDLE_POS = new THREE.Vector3(3.12, 0.032, 1.55);

  const strapGroup = new THREE.Group();
  strapGroup.position.copy(BUNDLE_POS);
  strapGroup.rotation.y = Math.PI / 12; // Slight tactical tilt on mat

  const strapMat = new THREE.MeshStandardMaterial({
    color: 0x121924,
    roughness: 0.90,
    metalness: 0.15,
  });

  const strapTagMat = new THREE.MeshStandardMaterial({
    color: DEFAULT_THEME.threeColor,
    emissive: DEFAULT_THEME.threeColor,
    emissiveIntensity: 0.35,
    roughness: 0.40,
  });

  // Main Silicone / Fabric Velcro Wrap
  const strapBandGeo = new THREE.BoxGeometry(0.120, 0.065, 0.075);
  const strapBandMesh = new THREE.Mesh(strapBandGeo, strapMat);
  strapBandMesh.position.set(0, 0.024, 0);
  strapGroup.add(strapBandMesh);

  // Fastening Hook-and-Loop Overlap Tab
  const strapTabGeo = new THREE.BoxGeometry(0.124, 0.015, 0.038);
  const strapTabMesh = new THREE.Mesh(strapTabGeo, strapMat);
  strapTabMesh.position.set(0, 0.058, 0.012);
  strapGroup.add(strapTabMesh);

  // Neon TokyoNight Stitched Brand Accent Tag on Strap
  const strapTagGeo = new THREE.BoxGeometry(0.045, 0.008, 0.020);
  const strapTagMesh = new THREE.Mesh(strapTagGeo, strapTagMat);
  strapTagMesh.position.set(0, 0.028, 0.066);
  strapGroup.add(strapTagMesh);

  // Glowing Edge Outline on Velcro Strap
  const strapWireGeo = new THREE.EdgesGeometry(strapBandGeo);
  const strapWireMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.45,
  });
  const strapWire = new THREE.LineSegments(strapWireGeo, strapWireMat);
  strapWire.position.set(0, 0.024, 0);
  strapGroup.add(strapWire);

  group.add(strapGroup);

  // 6. CONTINUOUS PROCEDURAL BRAIDED USB CABLE WITH BUNDLED LOOPS
  // Strain relief tip exit world coordinates
  const cableEntryWorld = new THREE.Vector3(2.235 + 0.445, 0.097, 1.97);

  const cablePoints = [
    // 6a. Mouse Nose Lead-out (Collinear with mouse angle before soft descent)
    mouseNoseWorld.clone().add(new THREE.Vector3(0.015, 0, -0.075)),
    mouseNoseWorld.clone().add(new THREE.Vector3(0.035, -0.038, -0.220)),
    new THREE.Vector3(3.50, 0.032, 2.45),
    new THREE.Vector3(3.38, 0.032, 2.05),
    new THREE.Vector3(3.24, 0.032, 1.75),

    // 6b. First Loop through Velcro Strap
    new THREE.Vector3(3.12, 0.032, 1.55),
    new THREE.Vector3(2.96, 0.034, 1.30),
    new THREE.Vector3(3.06, 0.038, 1.18),
    new THREE.Vector3(3.18, 0.042, 1.32),
    new THREE.Vector3(3.14, 0.045, 1.55), // Passes back through strap

    // 6c. Second Reverse Loop through Velcro Strap
    new THREE.Vector3(3.24, 0.045, 1.75),
    new THREE.Vector3(3.12, 0.048, 1.82),
    new THREE.Vector3(3.02, 0.050, 1.72),
    new THREE.Vector3(3.10, 0.052, 1.55), // Passes back through strap

    // 6d. Third Loop through Velcro Strap
    new THREE.Vector3(2.92, 0.044, 1.25),
    new THREE.Vector3(3.00, 0.038, 1.14),
    new THREE.Vector3(3.10, 0.036, 1.28),
    new THREE.Vector3(3.12, 0.038, 1.55), // Passes through strap

    // 6e. Sweeping Curved Exit Lead-in Perfectly Collinear to USB-A Connector Axis
    new THREE.Vector3(3.16, 0.038, 1.68),
    new THREE.Vector3(3.20, 0.065, 1.82), // Broad sweeping arc rising from desk mat
    new THREE.Vector3(3.08, 0.088, 1.94), // Smooth horizontal turn aligning with port axis
    new THREE.Vector3(2.88, 0.097, 1.97), // Fully collinear along +X at Y=0.097, Z=1.97
    cableEntryWorld.clone(), // Plugs straight and flush into the 4-segment rubber boot
  ];

  const cableCurve = new THREE.CatmullRomCurve3(cablePoints, false, "centripetal", 0.45);
  const cableGeo = new THREE.TubeGeometry(cableCurve, 112, 0.022, 10, false);

  const cableMat = new THREE.MeshStandardMaterial({
    color: 0x070a0f,
    roughness: 0.85,
    metalness: 0.25,
  });

  const cableMesh = new THREE.Mesh(cableGeo, cableMat);
  cableMesh.castShadow = true;
  group.add(cableMesh);

  // Cable TokyoNight Neon Wireframe Accent
  const cableWireMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.30,
  });
  const cableWire = new THREE.LineSegments(new THREE.EdgesGeometry(cableGeo, 28), cableWireMat);
  group.add(cableWire);

  // 6. TACTILE CLICK ANIMATION SYSTEM
  let clickTime = 0;
  let isClicking = false;

  const triggerClick = () => {
    isClicking = true;
    clickTime = 0;
  };

  const updateMouse = (delta: number) => {
    if (isClicking) {
      clickTime += delta * 24; // Fast tactile click rebound (~120ms)
      const dip = Math.sin(clickTime) * 0.012;
      mouseAnchor.position.y = MOUSE_POS.y - Math.max(0, dip);
      mouseAnchor.rotation.x = -Math.max(0, dip * 0.8);

      if (clickTime >= Math.PI) {
        isClicking = false;
        mouseAnchor.position.y = MOUSE_POS.y;
        mouseAnchor.rotation.x = 0;
      }
    }
  };

  const setTheme = (theme: WorkstationTheme) => {
    glowMaterials.forEach((mat) => {
      mat.color.setHex(theme.threeColor);
      mat.emissive.setHex(theme.threeColor);
    });
    tridentMat.color.setHex(theme.threeColor);
    tridentMat.emissive.setHex(theme.threeColor);
    strapTagMat.color.setHex(theme.threeColor);
    strapTagMat.emissive.setHex(theme.threeColor);
    strapWireMat.color.setHex(theme.threeColor);
    cableWireMat.color.setHex(theme.threeColor);
    housingWireMat.color.setHex(theme.threeColor);
  };

  return {
    group,
    mouseHitbox,
    setTheme,
    triggerClick,
    updateMouse,
  };
}
