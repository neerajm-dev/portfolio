import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

/**
 * 3D Modern Smartphone Prop (Realme / Android Quad-Camera Form Factor)
 * Custom OLED Standby Lockscreen with Live Clock & Telemetry
 * Model Attribution: "Mobile phone" (https://skfb.ly/ouyRM) by Alain Sorazu licensed under CC BY-SA 4.0
 */
export function createPhoneMesh(): {
  group: THREE.Group;
  phoneHitbox: THREE.Mesh;
  setTheme: (theme: WorkstationTheme) => void;
} {
  const group = new THREE.Group();
  group.name = "phone-prop-system";

  const phoneAnchor = new THREE.Group();
  group.add(phoneAnchor);

  // 1. INVISIBLE HITBOX FOR FAST RAYCASTING & INTERACTION
  const hitboxGeo = new THREE.BoxGeometry(1.10, 0.40, 1.95);
  const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
  const phoneHitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
  phoneHitbox.position.set(0, 0.10, 0);
  phoneHitbox.userData = { id: "phone", interactive: true };
  phoneAnchor.add(phoneHitbox);

  // 2. SLEEK DARK STANDBY OLED SCREEN CANVAS TEXTURE
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 960;
  const ctx = canvas.getContext("2d");

  let currentThemeHex = DEFAULT_THEME.hex;

  const getLiveTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderPhoneScreen = (themeHex: string = currentThemeHex, timeStr: string = getLiveTime()) => {
    if (!ctx) return;
    currentThemeHex = themeHex;

    // Deep OLED True Black background
    ctx.fillStyle = "#020509";
    ctx.fillRect(0, 0, 480, 960);

    // Radial Neon Wallpaper Glow
    const bgGlow = ctx.createRadialGradient(240, 480, 20, 240, 480, 340);
    bgGlow.addColorStop(0, `${themeHex}26`);
    bgGlow.addColorStop(0.55, `${themeHex}08`);
    bgGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, 480, 960);

    // Subtle Cyber Grid Matrix
    ctx.strokeStyle = `${themeHex}10`;
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

    // Teardrop Camera Notch Housing (Top Center)
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(240, 24, 18, 0, Math.PI);
    ctx.fill();

    // Camera Lens Dot & Sensor
    ctx.fillStyle = "#050d18";
    ctx.beginPath();
    ctx.arc(240, 18, 7, 0, Math.PI * 2);
    ctx.fill();

    // Status Bar Telemetry - Left Time (Orbitron 700)
    ctx.textAlign = "left";
    ctx.font = "700 20px Orbitron, monospace";
    ctx.fillStyle = "#a1a1aa";
    ctx.fillText(timeStr, 36, 48);

    // Status Bar - Right: Wi-Fi Icon (Full Signal Strength) + 100% Battery (Orbitron 700)
    const wx = 345;
    const wy = 48;
    ctx.fillStyle = themeHex;
    ctx.strokeStyle = themeHex;
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";

    // Wi-Fi Base Dot
    ctx.beginPath();
    ctx.arc(wx, wy - 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Wi-Fi Middle Arc
    ctx.beginPath();
    ctx.arc(wx, wy - 3, 8, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();

    // Wi-Fi Top Arc (Full Strength)
    ctx.beginPath();
    ctx.arc(wx, wy - 3, 14, -Math.PI * 0.75, -Math.PI * 0.25);
    ctx.stroke();

    // Battery 100%
    ctx.textAlign = "left";
    ctx.font = "700 17px Orbitron, monospace";
    ctx.fillStyle = themeHex;
    ctx.fillText("100%", 372, 48);

    // Centered Large Clock Widget (Orbitron 900 Ultra-Bold)
    ctx.textAlign = "center";
    ctx.font = "900 84px Orbitron, monospace";
    ctx.fillStyle = themeHex;
    ctx.shadowColor = themeHex;
    ctx.shadowBlur = 20;
    ctx.fillText(timeStr, 240, 430);
    ctx.shadowBlur = 0;

    ctx.font = "700 15px Orbitron, monospace";
    ctx.fillStyle = "#71717a";
    ctx.fillText("KERALA, IN • 28°C CLEAR", 240, 480);

    // Bottom Navigation Bar Pill
    ctx.fillStyle = "#52525b";
    ctx.beginPath();
    ctx.roundRect(160, 925, 160, 8, 4);
    ctx.fill();
    ctx.textAlign = "left";
  };

  const screenTexture = new THREE.CanvasTexture(canvas);
  screenTexture.minFilter = THREE.LinearFilter;
  screenTexture.magFilter = THREE.LinearFilter;
  screenTexture.colorSpace = THREE.SRGBColorSpace;

  renderPhoneScreen();

  // Ensure Orbitron font is loaded and triggers texture re-render
  if (typeof document !== "undefined" && document.fonts) {
    document.fonts.ready.then(() => {
      renderPhoneScreen();
      screenTexture.needsUpdate = true;
    });
    document.fonts.load("900 84px Orbitron").then(() => {
      renderPhoneScreen();
      screenTexture.needsUpdate = true;
    });
  }

  // Live time updater on table desk phone screen
  const timeInterval = setInterval(() => {
    renderPhoneScreen();
    screenTexture.needsUpdate = true;
  }, 1000);

  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
  });

  // 3. PROCEDURAL FALLBACK MESH (Displayed while GLB is loading)
  const modelContainer = new THREE.Group();
  phoneAnchor.add(modelContainer);

  const fallbackGeo = new THREE.BoxGeometry(0.95, 0.08, 1.86);
  const fallbackMat = new THREE.MeshStandardMaterial({
    color: 0x080c14,
    roughness: 0.35,
    metalness: 0.85,
  });
  const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
  fallbackMesh.position.set(0, 0.04, 0);
  modelContainer.add(fallbackMesh);

  // 4. LOAD REALISTIC 3D SMARTPHONE GLB MODEL
  const loader = new GLTFLoader();
  loader.load(
    "/models/phone.glb",
    (gltf) => {
      modelContainer.remove(fallbackMesh);
      fallbackGeo.dispose();
      fallbackMat.dispose();

      const phoneScene = gltf.scene;

      // Scale model to match realistic scale relative to ASUS TUF 15.6" chassis
      const PHONE_SCALE = 9.8;
      phoneScene.scale.set(PHONE_SCALE, PHONE_SCALE, PHONE_SCALE);
      phoneScene.rotation.x = -Math.PI / 2; // Lay flat on desk surface
      phoneScene.position.set(0, 0.052, 0.93); // Center origin along Z

      phoneScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const matName = (mesh.material as THREE.Material)?.name || "";

          // Screen Mesh Surface: Remap UVs & assign OLED screen texture
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
                const v = (maxZ - z) / (maxZ - minZ);
                uvs.push(u, v);
              }
              mesh.geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
            }
            mesh.material = screenMat;
            screenTexture.needsUpdate = true;
          } else if (matName.toLowerCase().includes("case") || mesh.name === "Object_8") {
            // Sleek obsidian titanium chassis
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0x080c14,
              roughness: 0.35,
              metalness: 0.85,
            });
          } else if (matName.toLowerCase().includes("white") || mesh.name === "Object_4") {
            // Precision CNC dark gunmetal / titanium camera bezel rings (eliminates raw white rings)
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
            // Dual-tone camera LED flash
            mesh.material = new THREE.MeshBasicMaterial({
              color: 0xfffaed,
            });
          } else if (matName.toLowerCase().includes("button") || mesh.name === "Object_11") {
            // Metallic power/volume buttons
            mesh.material = new THREE.MeshStandardMaterial({
              color: 0x1a2332,
              roughness: 0.4,
              metalness: 0.8,
            });
          }
        }
      });

      modelContainer.add(phoneScene);
    },
    undefined,
    (error) => {
      console.warn("Failed to load /models/phone.glb, using procedural fallback:", error);
    }
  );

  return {
    group,
    phoneHitbox,
    setTheme: (theme: WorkstationTheme) => {
      renderPhoneScreen(theme.hex);
      screenTexture.needsUpdate = true;
    },
  };
}
