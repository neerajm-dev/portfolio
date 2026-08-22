import * as THREE from "three";
import { WorkstationTheme, DEFAULT_THEME, createTintedAvatarCanvas } from "@/lib/theme-colors";

export function createCoffeeMesh(): {
  group: THREE.Group;
  mugMesh: THREE.Mesh;
  updateSteam: (delta: number) => void;
  setTheme: (theme: WorkstationTheme) => void;
} {
  const group = new THREE.Group();
  group.name = "coffee-prop";
  group.position.set(4.4, 0, 0.4);

  // 1. PROCEDURAL CANVAS TEXTURE FOR MUG WRAP (WITH AVATAR & DEV BRANDING)
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const avatarImg = new Image();
  avatarImg.src = "/avatar-neeraj.png";

  const mugTexture = new THREE.CanvasTexture(canvas);
  mugTexture.minFilter = THREE.LinearFilter;
  mugTexture.magFilter = THREE.LinearFilter;
  mugTexture.colorSpace = THREE.SRGBColorSpace;

  const renderMugTexture = (themeHex: string = DEFAULT_THEME.hex) => {
    if (!ctx) return;

    // Deep Neutral Ceramic Black Base
    ctx.fillStyle = "#06090e";
    ctx.fillRect(0, 0, 1024, 512);

    // Subtle Hexagonal / CRT Scanline Matrix
    ctx.fillStyle = `${themeHex}0a`;
    for (let y = 0; y < 512; y += 4) {
      ctx.fillRect(0, y, 1024, 2);
    }

    // Pure Avatar Print with seam edge wrapping and dynamic theme tint
    const drawPlainAvatar = (centerX: number) => {
      const avW = 340;
      const avH = 340;
      const avX = centerX - avW / 2;
      const avY = (512 - avH) / 2;

      if (avatarImg.complete && avatarImg.naturalWidth > 0) {
        const tinted = createTintedAvatarCanvas(avatarImg, themeHex, avW, avH);
        if (tinted) {
          ctx.drawImage(tinted, avX, avY, avW, avH);
          if (avX < 0) {
            ctx.drawImage(tinted, avX + 1024, avY, avW, avH);
          } else if (avX + avW > 1024) {
            ctx.drawImage(tinted, avX - 1024, avY, avW, avH);
          }
        } else {
          ctx.drawImage(avatarImg, avX, avY, avW, avH);
          if (avX < 0) {
            ctx.drawImage(avatarImg, avX + 1024, avY, avW, avH);
          } else if (avX + avW > 1024) {
            ctx.drawImage(avatarImg, avX - 1024, avY, avW, avH);
          }
        }
      }
    };

    // Print plain avatar centered on visible front face and opposite side
    drawPlainAvatar(590);
    drawPlainAvatar(78);
    mugTexture.needsUpdate = true;
  };

  renderMugTexture(DEFAULT_THEME.hex);

  avatarImg.onload = () => {
    renderMugTexture(DEFAULT_THEME.hex);
  };

  // 2. SMART CHARGING COASTER WITH ILLUMINATED LED RING
  const coasterGeo = new THREE.CylinderGeometry(0.50, 0.54, 0.024, 32);
  const coasterMat = new THREE.MeshStandardMaterial({
    color: 0x06090e,
    roughness: 0.6,
    metalness: 0.7,
  });
  const coaster = new THREE.Mesh(coasterGeo, coasterMat);
  coaster.position.y = 0.012;
  coaster.receiveShadow = true;
  group.add(coaster);

  // Glowing Base Ring
  const ringGeo = new THREE.RingGeometry(0.40, 0.47, 32);
  const ringMat = new THREE.MeshBasicMaterial({
    color: DEFAULT_THEME.threeColor,
    side: THREE.DoubleSide,
  });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.026;
  group.add(ring);

  // 3. SCULPTED CERAMIC MUG BODY
  const mugGeo = new THREE.CylinderGeometry(0.38, 0.33, 0.76, 32, 1, true);
  const mugMat = new THREE.MeshStandardMaterial({
    map: mugTexture,
    roughness: 0.35,
    metalness: 0.25,
    side: THREE.DoubleSide,
  });

  const mugMesh = new THREE.Mesh(mugGeo, mugMat);
  mugMesh.position.y = 0.40;
  mugMesh.rotation.y = -0.75;
  mugMesh.castShadow = true;
  mugMesh.receiveShadow = true;
  mugMesh.userData = { id: "coffee", interactive: true };
  group.add(mugMesh);

  // Ceramic Bottom Base Cap
  const bottomGeo = new THREE.CircleGeometry(0.33, 32);
  const ceramicPlainMat = new THREE.MeshStandardMaterial({
    color: 0x080c14,
    roughness: 0.5,
    metalness: 0.3,
  });
  const bottomMesh = new THREE.Mesh(bottomGeo, ceramicPlainMat);
  bottomMesh.position.y = 0.02;
  bottomMesh.rotation.x = Math.PI / 2;
  group.add(bottomMesh);

  // Ceramic Top Lip Rim
  const lipGeo = new THREE.RingGeometry(0.33, 0.38, 32);
  const lipMesh = new THREE.Mesh(lipGeo, ceramicPlainMat);
  lipMesh.position.y = 0.78;
  lipMesh.rotation.x = -Math.PI / 2;
  group.add(lipMesh);

  // 4. ERGONOMIC MUG D-HANDLE
  const handleGeo = new THREE.TorusGeometry(0.24, 0.042, 10, 24, Math.PI * 0.95);
  const handle = new THREE.Mesh(handleGeo, ceramicPlainMat);
  handle.position.set(0.36, 0, 0);
  handle.rotation.z = -Math.PI / 2;
  mugMesh.add(handle);

  // 5. RICH ESPRESSO CREMA LIQUID SURFACE (Recessed inside the mug)
  const liquidCanvas = document.createElement("canvas");
  liquidCanvas.width = 256;
  liquidCanvas.height = 256;
  const lctx = liquidCanvas.getContext("2d");

  const liquidTexture = new THREE.CanvasTexture(liquidCanvas);
  liquidTexture.minFilter = THREE.LinearFilter;
  liquidTexture.magFilter = THREE.LinearFilter;
  liquidTexture.colorSpace = THREE.SRGBColorSpace;

  const renderLiquid = (themeHex: string = DEFAULT_THEME.hex) => {
    if (!lctx) return;
    // 1. Deep obsidian black liquid base
    lctx.fillStyle = "#05070a";
    lctx.fillRect(0, 0, 256, 256);

    // 2. Soft ambient liquid reflection gradient in active theme accent
    const ambientGrad = lctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    ambientGrad.addColorStop(0, `${themeHex}22`); // Subtle center reflection
    ambientGrad.addColorStop(0.5, `${themeHex}10`);
    ambientGrad.addColorStop(0.85, `${themeHex}2e`); // Coaster reflection near rim
    ambientGrad.addColorStop(1, "rgba(0,0,0,0.8)"); // Ceramic edge rim
    lctx.fillStyle = ambientGrad;
    lctx.beginPath();
    lctx.arc(128, 128, 122, 0, Math.PI * 2);
    lctx.fill();

    // 3. Smooth organic liquid sheen swirl (reflecting workstation lighting)
    lctx.strokeStyle = `${themeHex}28`;
    lctx.lineWidth = 3.5;
    lctx.beginPath();
    lctx.ellipse(135, 120, 72, 42, Math.PI / 5, 0, Math.PI * 1.6);
    lctx.stroke();

    lctx.strokeStyle = `${themeHex}18`;
    lctx.lineWidth = 5;
    lctx.beginPath();
    lctx.ellipse(120, 134, 48, 28, -Math.PI / 4, 0, Math.PI * 2);
    lctx.stroke();

    // 4. Subtle glossy surface light specular arc
    const glossGrad = lctx.createLinearGradient(60, 50, 160, 150);
    glossGrad.addColorStop(0, "rgba(255, 255, 255, 0.09)");
    glossGrad.addColorStop(0.4, `${themeHex}15`);
    glossGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    lctx.fillStyle = glossGrad;
    lctx.beginPath();
    lctx.arc(128, 128, 115, 0, Math.PI * 2);
    lctx.fill();

    liquidTexture.needsUpdate = true;
  };

  renderLiquid(DEFAULT_THEME.hex);

  const liquidGeo = new THREE.CircleGeometry(0.33, 32);
  const liquidMat = new THREE.MeshBasicMaterial({
    map: liquidTexture,
    toneMapped: false,
  });
  const liquid = new THREE.Mesh(liquidGeo, liquidMat);
  liquid.position.set(0, 0.70, 0);
  liquid.rotation.x = -Math.PI / 2;
  group.add(liquid);

  // 6. STEAM SYSTEM
  const smokeCanvas = document.createElement("canvas");
  smokeCanvas.width = 128;
  smokeCanvas.height = 128;
  const sctx = smokeCanvas.getContext("2d");

  const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

  const renderSmoke = (themeHex: string = DEFAULT_THEME.hex) => {
    if (!sctx) return;
    sctx.clearRect(0, 0, 128, 128);
    const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, `${themeHex}47`);
    grad.addColorStop(0.25, `${themeHex}1f`);
    grad.addColorStop(0.55, `${themeHex}08`);
    grad.addColorStop(1, `${themeHex}00`);
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);
    smokeTexture.needsUpdate = true;
  };

  renderSmoke(DEFAULT_THEME.hex);

  const puffCount = 16;
  const puffs: {
    sprite: THREE.Sprite;
    speed: number;
    phase: number;
    swayRadius: number;
    baseScale: number;
  }[] = [];

  const steamGroup = new THREE.Group();
  group.add(steamGroup);

  const spriteMat = new THREE.SpriteMaterial({
    map: smokeTexture,
    transparent: true,
    opacity: 0.15,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  for (let i = 0; i < puffCount; i++) {
    const sprite = new THREE.Sprite(spriteMat.clone());
    const initialY = 0.72 + (i / puffCount) * 1.4;
    const phase = Math.random() * Math.PI * 2;
    const speed = 0.18 + Math.random() * 0.12;
    const swayRadius = 0.04 + Math.random() * 0.04;
    const baseScale = 0.11 + Math.random() * 0.06;

    sprite.position.set(
      Math.cos(phase) * swayRadius * 0.3,
      initialY,
      Math.sin(phase) * swayRadius * 0.3
    );
    sprite.scale.set(baseScale, baseScale, 1);
    steamGroup.add(sprite);

    puffs.push({ sprite, speed, phase, swayRadius, baseScale });
  }

  let steamTime = 0;
  const updateSteam = (delta: number) => {
    steamTime += delta;

    puffs.forEach((puff) => {
      puff.sprite.position.y += puff.speed * delta;

      const progress = Math.min(
        1,
        Math.max(0, (puff.sprite.position.y - 0.72) / (2.1 - 0.72))
      );

      const currentScale = puff.baseScale * (1 + progress * 1.3);
      puff.sprite.scale.set(currentScale, currentScale, 1);

      const alphaEnvelope = Math.sin(progress * Math.PI);
      (puff.sprite.material as THREE.SpriteMaterial).opacity =
        alphaEnvelope * 0.18;

      const swayX =
        Math.sin(steamTime * 1.4 + puff.phase) *
        puff.swayRadius *
        (1 + progress * 2.0);
      const swayZ =
        Math.cos(steamTime * 1.2 + puff.phase * 1.3) *
        puff.swayRadius *
        (1 + progress * 2.0);

      puff.sprite.position.x = swayX;
      puff.sprite.position.z = swayZ;

      if (puff.sprite.position.y > 2.1) {
        puff.sprite.position.y = 0.72 + Math.random() * 0.04;
        puff.phase = Math.random() * Math.PI * 2;
      }
    });
  };

  const setTheme = (theme: WorkstationTheme) => {
    ringMat.color.setHex(theme.threeColor);
    renderMugTexture(theme.hex);
    renderLiquid(theme.hex);
    renderSmoke(theme.hex);
  };

  return { group, mugMesh, updateSteam, setTheme };
}
