import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

/**
 * 3D Cyber Battlestation Gateway Router (Gigabit Dual-Band AC2600)
 * Features Dynamic LED Activity Packet Flicker, Antenna Shaders, and Theme Color Sync.
 */
export function createRouterMesh(): {
  group: THREE.Group;
  routerHitbox: THREE.Mesh;
  setTheme: (theme: WorkstationTheme) => void;
  updateRouter: (delta: number) => void;
} {
  const group = new THREE.Group();
  group.name = "gateway-router-system";

  // 1. POSITIONING ON MID-LEFT DESK AREA (Former Note Position)
  const ROUTER_POS = new THREE.Vector3(-4.4, 0.028, -0.6);
  const ROUTER_ROT_Y = -Math.PI / 8; // Angled facing inward towards the operator

  group.position.copy(ROUTER_POS);
  group.rotation.y = ROUTER_ROT_Y;

  // 2. HITBOX FOR RAYCASTING
  const hitboxGeo = new THREE.BoxGeometry(2.0, 1.8, 1.8);
  const hitboxMat = new THREE.MeshBasicMaterial({ visible: false });
  const routerHitbox = new THREE.Mesh(hitboxGeo, hitboxMat);
  routerHitbox.position.set(0, 0.85, 0);
  routerHitbox.userData = { id: "router", interactive: true };
  group.add(routerHitbox);

  // 3. MODEL LOADING WITH PROCEDURAL FALLBACK
  const modelContainer = new THREE.Group();
  group.add(modelContainer);

  const glowMaterials: THREE.MeshStandardMaterial[] = [];
  const wireMaterials: THREE.LineBasicMaterial[] = [];

  // Procedural Fallback while loading
  const fallbackGeo = new THREE.BoxGeometry(1.4, 0.25, 1.0);
  const fallbackMat = new THREE.MeshStandardMaterial({
    color: 0x070c14,
    roughness: 0.5,
    metalness: 0.4,
  });
  const fallbackMesh = new THREE.Mesh(fallbackGeo, fallbackMat);
  fallbackMesh.position.set(0, 0.12, 0);
  modelContainer.add(fallbackMesh);

  const ROUTER_SCALE = 8.5;
  const ROUTER_ELEVATION = 0.288; // Elevate to sit cleanly on tabletop

  const loader = new GLTFLoader();
  loader.load(
    "/models/router.glb",
    (gltf) => {
      modelContainer.remove(fallbackMesh);
      fallbackGeo.dispose();
      fallbackMat.dispose();

      const routerScene = gltf.scene;
      routerScene.scale.set(ROUTER_SCALE, ROUTER_SCALE, ROUTER_SCALE);
      routerScene.position.set(0, ROUTER_ELEVATION, 0);

      routerScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const mat = mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            if (mat.emissive && (mat.emissive as THREE.Color).getHex() !== 0) {
              mat.emissive = new THREE.Color(DEFAULT_THEME.threeColor);
              mat.emissiveIntensity = 1.8;
              glowMaterials.push(mat);
            }
          }

          // Cyber wireframe edges
          const edges = new THREE.EdgesGeometry(mesh.geometry, 26);
          const wireMat = new THREE.LineBasicMaterial({
            color: DEFAULT_THEME.threeColor,
            transparent: true,
            opacity: 0.35,
          });
          const wire = new THREE.LineSegments(edges, wireMat);
          mesh.add(wire);
          wireMaterials.push(wireMat);
        }
      });

      modelContainer.add(routerScene);
    },
    undefined,
    (err) => console.warn("Could not load /models/router.glb:", err)
  );

  // 4. PACKET FLICKER ANIMATION & THEME LOGIC
  let simTime = 0;
  const updateRouter = (delta: number) => {
    simTime += delta * 8;
    // Micro-pulse emissive intensity on status lights
    if (glowMaterials.length > 0) {
      const pulse = 1.4 + Math.sin(simTime * 2.5) * 0.4;
      glowMaterials.forEach((m) => {
        m.emissiveIntensity = pulse;
      });
    }
  };

  const setTheme = (theme: WorkstationTheme) => {
    glowMaterials.forEach((m) => {
      m.emissive.setHex(theme.threeColor);
    });
    wireMaterials.forEach((m) => {
      m.color.setHex(theme.threeColor);
    });
  };

  return {
    group,
    routerHitbox,
    setTheme,
    updateRouter,
  };
}
