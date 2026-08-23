import * as THREE from "three";
import { WorkstationTheme, DEFAULT_THEME } from "@/lib/theme-colors";

export function createHologramSphere(): {
  group: THREE.Group;
  holoMesh: THREE.Mesh;
  setTheme: (theme: WorkstationTheme) => void;
  toggleExpand: () => boolean;
  getIsExpanded: () => boolean;
  addRotation: (deltaX: number, deltaY: number) => void;
  updateHolo: (delta: number) => void;
} {
  const group = new THREE.Group();
  group.name = "holographic-ascii-sphere-system";
  group.position.set(0, 0, 0);

  const emitterDeskPos = new THREE.Vector3(5.0, 0.028, 1.0);
  const compactOrbPos = new THREE.Vector3(5.0, 2.10, 1.0);
  const expandedOrbPos = new THREE.Vector3(5.0, 3.25, 1.0);

  const currentOrbPos = compactOrbPos.clone();

  // 1. FIXED DESKTOP PROJECTOR EMITTER (100% stationary on desk surface)
  const emitterAnchor = new THREE.Group();
  emitterAnchor.position.copy(emitterDeskPos);
  group.add(emitterAnchor);

  // Micro Hex Emitter Base Plate
  const emitterPlateGeo = new THREE.CylinderGeometry(0.20, 0.24, 0.020, 6);
  const emitterPlateMat = new THREE.MeshStandardMaterial({
    color: 0x090e16,
    roughness: 0.35,
    metalness: 0.85,
  });
  const emitterPlate = new THREE.Mesh(emitterPlateGeo, emitterPlateMat);
  emitterPlate.position.y = 0.010;
  emitterAnchor.add(emitterPlate);

  // Glowing LED Ring on Emitter Base
  const EMITTER_RING_RADIUS = 0.15;
  const emitterRingGeo = new THREE.TorusGeometry(EMITTER_RING_RADIUS, 0.010, 8, 24);
  const emitterRingMat = new THREE.MeshBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    toneMapped: false,
  });
  const emitterRing = new THREE.Mesh(emitterRingGeo, emitterRingMat);
  emitterRing.rotation.x = Math.PI / 2;
  emitterRing.position.y = 0.021;
  emitterAnchor.add(emitterRing);

  // Hex Edge Wireframe Highlight
  const emitterWire = new THREE.LineSegments(
    new THREE.EdgesGeometry(emitterPlateGeo),
    new THREE.LineBasicMaterial({ color: DEFAULT_THEME.threeColor, transparent: true, opacity: 0.45 })
  );
  emitterWire.position.y = 0.010;
  emitterAnchor.add(emitterWire);

  // 2. DYNAMIC CONICAL PROJECTION RAYS (Locked inside the emitter ring at bottom)
  const RAY_COUNT = 24;
  const rayPositions = new Float32Array(RAY_COUNT * 2 * 3);

  const beamGeo = new THREE.BufferGeometry();
  beamGeo.setAttribute("position", new THREE.BufferAttribute(rayPositions, 3));

  const beamMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.40,
  });
  const beamLines = new THREE.LineSegments(beamGeo, beamMat);
  group.add(beamLines);

  // 3. FLOATING HOLOGRAPHIC SPHERE ASSEMBLY (Freely levitating & expanding)
  const orbAssembly = new THREE.Group();
  orbAssembly.position.copy(compactOrbPos);
  group.add(orbAssembly);

  // User interactive rotation container (Allows free drag & spin like Tony Stark)
  const userRotationGroup = new THREE.Group();
  orbAssembly.add(userRotationGroup);

  // Materials
  const wireMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.75,
  });

  const dashedMat = new THREE.LineDashedMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.65,
    dashSize: 0.12,
    gapSize: 0.08,
  });

  const pointsMat = new THREE.PointsMaterial({
    color: DEFAULT_THEME.threeColor,
    size: 0.045,
    transparent: true,
    opacity: 0.90,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const ringMat = new THREE.LineBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    transparent: true,
    opacity: 0.55,
  });

  // 4. PROCEDURAL ASCII GLYPH PARTICLES (Fibonacci Sphere Distribution)
  const particleCount = 280;
  const sphereRadius = 0.48;
  const positions = new Float32Array(particleCount * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < particleCount; i++) {
    const theta = (2 * Math.PI * i) / goldenRatio;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);

    const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
    const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
    const z = sphereRadius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleCloud = new THREE.Points(particleGeo, pointsMat);
  userRotationGroup.add(particleCloud);

  // 5. GEODESIC WIREFRAME ICOSAHEDRON CORE
  const icoGeo = new THREE.IcosahedronGeometry(sphereRadius * 0.92, 1);
  const icoWireGeo = new THREE.WireframeGeometry(icoGeo);
  const icoWire = new THREE.LineSegments(icoWireGeo, wireMat);
  userRotationGroup.add(icoWire);

  // 6. LATITUDE & LONGITUDE SCAN RINGS
  const ringGroup = new THREE.Group();
  userRotationGroup.add(ringGroup);

  // Equator Ring
  const equatorGeo = new THREE.BufferGeometry();
  const eqPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    eqPoints.push(new THREE.Vector3(Math.cos(angle) * sphereRadius, 0, Math.sin(angle) * sphereRadius));
  }
  equatorGeo.setFromPoints(eqPoints);
  const equatorRing = new THREE.Line(equatorGeo, dashedMat);
  equatorRing.computeLineDistances();
  ringGroup.add(equatorRing);

  // Meridian Ring
  const meridianGeo = new THREE.BufferGeometry();
  const merPoints: THREE.Vector3[] = [];
  for (let i = 0; i <= 48; i++) {
    const angle = (i / 48) * Math.PI * 2;
    merPoints.push(new THREE.Vector3(0, Math.cos(angle) * sphereRadius, Math.sin(angle) * sphereRadius));
  }
  meridianGeo.setFromPoints(merPoints);
  const meridianRing = new THREE.Line(meridianGeo, dashedMat);
  meridianRing.computeLineDistances();
  ringGroup.add(meridianRing);

  // 7. DUAL COUNTER-ROTATING GIMBAL ORBIT RINGS
  const outerRingRadius = sphereRadius * 1.35;

  // Gimbal Ring 1 (Tilted 35° X)
  const gimbal1Geo = new THREE.BufferGeometry();
  const g1Points: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    g1Points.push(new THREE.Vector3(Math.cos(angle) * outerRingRadius, 0, Math.sin(angle) * outerRingRadius));
  }
  gimbal1Geo.setFromPoints(g1Points);
  const gimbal1 = new THREE.Line(gimbal1Geo, ringMat);
  gimbal1.rotation.x = 0.55;
  userRotationGroup.add(gimbal1);

  // Gimbal Ring 2 (Tilted -45° Z, 25° Y)
  const gimbal2Geo = new THREE.BufferGeometry();
  const g2Points: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const angle = (i / 64) * Math.PI * 2;
    g2Points.push(new THREE.Vector3(Math.cos(angle) * (outerRingRadius * 1.12), 0, Math.sin(angle) * (outerRingRadius * 1.12)));
  }
  gimbal2Geo.setFromPoints(g2Points);
  const gimbal2 = new THREE.Line(gimbal2Geo, dashedMat);
  gimbal2.computeLineDistances();
  gimbal2.rotation.z = -0.75;
  gimbal2.rotation.y = 0.40;
  userRotationGroup.add(gimbal2);

  // 8. INVISIBLE RAYCAST TARGET HITBOX (Encompasses entire sphere and outer gimbal rings)
  const hitGeo = new THREE.SphereGeometry(sphereRadius * 1.65, 16, 16);
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const holoMesh = new THREE.Mesh(hitGeo, hitMat);
  holoMesh.userData = { id: "hologram", interactive: true };
  orbAssembly.add(holoMesh);

  // 9. INTERACTIVE USER ROTATION & INERTIA PHYSICS
  let userVelY = 0;
  let userVelX = 0;

  const addRotation = (deltaX: number, deltaY: number) => {
    userRotationGroup.rotation.y += deltaX * 0.008;
    userRotationGroup.rotation.x += deltaY * 0.008;
    userVelY = deltaX * 0.005;
    userVelX = deltaY * 0.005;
  };

  // 10. ANIMATION & EXPANSION ENGINE
  let isExpandedState = false;
  let currentScale = 1.0;
  let targetScale = 1.0;
  const EXPANDED_SCALE = 2.6;

  const toggleExpand = () => {
    isExpandedState = !isExpandedState;
    targetScale = isExpandedState ? EXPANDED_SCALE : 1.0;
    return isExpandedState;
  };

  const getIsExpanded = () => isExpandedState;

  let totalTime = 0;
  const updateHolo = (delta: number) => {
    totalTime += delta;

    // Apply user rotation inertia momentum
    userRotationGroup.rotation.y += userVelY;
    userRotationGroup.rotation.x += userVelX;
    userVelY *= 0.92;
    userVelX *= 0.92;

    // Smooth Iron Man Scale & Position Interpolation
    currentScale += (targetScale - currentScale) * 0.075;
    orbAssembly.scale.setScalar(currentScale);

    const destPos = isExpandedState ? expandedOrbPos : compactOrbPos;
    currentOrbPos.lerp(destPos, 0.075);

    // Floating levitation bobbing applied ONLY to orbAssembly
    const bobAmp = isExpandedState ? 0.12 : 0.07;
    const bobFreq = isExpandedState ? 2.0 : 1.4;
    orbAssembly.position.set(
      currentOrbPos.x,
      currentOrbPos.y + Math.sin(totalTime * bobFreq) * bobAmp,
      currentOrbPos.z
    );

    // Speed multiplier when expanded
    const speedMult = isExpandedState ? 2.2 : 1.0;

    // Core rotations
    particleCloud.rotation.y += delta * 0.45 * speedMult;
    particleCloud.rotation.x += delta * 0.15 * speedMult;
    icoWire.rotation.y -= delta * 0.30 * speedMult;
    icoWire.rotation.z += delta * 0.20 * speedMult;
    ringGroup.rotation.y += delta * 0.55 * speedMult;

    // Gimbal ring counter-rotations
    gimbal1.rotation.y += delta * 0.70 * speedMult;
    gimbal2.rotation.y -= delta * 0.50 * speedMult;

    // Breathing shimmer
    const breath = 0.75 + Math.sin(totalTime * 3.5) * 0.25;
    pointsMat.opacity = breath;
    wireMat.opacity = breath * 0.85;

    // Update dynamic projection rays: Base is STRICTLY locked inside emitter ring
    const baseOriginY = emitterDeskPos.y + 0.021;
    const topRadius = (sphereRadius * 0.80) * currentScale;
    const topY = orbAssembly.position.y - (sphereRadius * 0.25) * currentScale;
    const positionsAttr = beamGeo.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < RAY_COUNT; i++) {
      const angle = (i / RAY_COUNT) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Bottom point (fixed strictly on glowing emitter ring)
      positionsAttr.setXYZ(
        i * 2,
        emitterDeskPos.x + EMITTER_RING_RADIUS * cosA,
        baseOriginY,
        emitterDeskPos.z + EMITTER_RING_RADIUS * sinA
      );

      // Top point (flares to match the bottom curve of the floating orb)
      positionsAttr.setXYZ(
        i * 2 + 1,
        orbAssembly.position.x + topRadius * cosA,
        topY,
        orbAssembly.position.z + topRadius * sinA
      );
    }
    positionsAttr.needsUpdate = true;

    beamMat.opacity = THREE.MathUtils.lerp(0.35, 0.18, (currentScale - 1) / (EXPANDED_SCALE - 1));
  };

  const setTheme = (theme: WorkstationTheme) => {
    wireMat.color.setHex(theme.threeColor);
    dashedMat.color.setHex(theme.threeColor);
    pointsMat.color.setHex(theme.threeColor);
    ringMat.color.setHex(theme.threeColor);
    emitterRingMat.color.setHex(theme.threeColor);
    beamMat.color.setHex(theme.threeColor);
    emitterWire.material = new THREE.LineBasicMaterial({
      color: theme.threeColor,
      transparent: true,
      opacity: 0.45,
    });
  };

  return { group, holoMesh, setTheme, toggleExpand, getIsExpanded, addRotation, updateHolo };
}
