import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

// ── Verlet Cloth Simulation Config ──
const COLS = 18; // width segments
const ROWS = 36; // height segments (receipt is tall)
const CLOTH_W = 2.4; // world width
const CLOTH_H = 5.0; // world height
const REST_X = CLOTH_W / COLS;
const REST_Y = CLOTH_H / ROWS;
const GRAVITY = new THREE.Vector3(0, -9.8, 0);
const DAMPING = 0.97;
const CONSTRAINT_ITERS = 12;
const SUB_STEPS = 3;

// ── Particle ──
class Particle {
  pos: THREE.Vector3;
  prev: THREE.Vector3;
  acc: THREE.Vector3;
  pinned: boolean;
  mass: number;

  constructor(x: number, y: number, z: number) {
    this.pos = new THREE.Vector3(x, y, z);
    this.prev = new THREE.Vector3(x, y, z);
    this.acc = new THREE.Vector3();
    this.pinned = false;
    this.mass = 1;
  }

  applyForce(f: THREE.Vector3) {
    this.acc.addScaledVector(f, 1 / this.mass);
  }

  integrate(dt: number) {
    if (this.pinned) return;
    const vel = new THREE.Vector3().subVectors(this.pos, this.prev);
    vel.multiplyScalar(DAMPING);
    this.prev.copy(this.pos);
    this.pos.add(vel);
    this.pos.addScaledVector(this.acc, dt * dt);
    this.acc.set(0, 0, 0);
  }
}

// ── Constraint ──
class Constraint {
  p1: Particle;
  p2: Particle;
  restLen: number;
  stiffness: number;

  constructor(p1: Particle, p2: Particle, stiffness = 1.0) {
    this.p1 = p1;
    this.p2 = p2;
    this.restLen = p1.pos.distanceTo(p2.pos);
    this.stiffness = stiffness;
  }

  solve() {
    const diff = new THREE.Vector3().subVectors(this.p2.pos, this.p1.pos);
    const dist = diff.length();
    if (dist === 0) return;
    const correction = ((dist - this.restLen) / dist) * 0.5 * this.stiffness;
    diff.multiplyScalar(correction);

    if (!this.p1.pinned) this.p1.pos.add(diff);
    if (!this.p2.pinned) this.p2.pos.sub(diff);
  }
}

// ── Receipt content texture ──
function createReceiptTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  // Thermal paper background
  ctx.fillStyle = "#faf8f2";
  ctx.fillRect(0, 0, 512, 1024);

  // Subtle paper grain noise
  for (let i = 0; i < 8000; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 1024;
    const alpha = Math.random() * 0.04;
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }

  // Thermal paper faint pink/yellow tinge
  const grad = ctx.createLinearGradient(0, 0, 0, 1024);
  grad.addColorStop(0, "rgba(255,252,240,0.3)");
  grad.addColorStop(0.5, "rgba(255,245,238,0.2)");
  grad.addColorStop(1, "rgba(250,248,242,0.3)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 1024);

  ctx.fillStyle = "#1a1a1a";
  ctx.textAlign = "center";

  // Header
  ctx.font = "bold 28px monospace";
  ctx.fillText("★ PIXEL MART ★", 256, 60);
  ctx.font = "14px monospace";
  ctx.fillText("123 Binary Blvd, Stack City", 256, 85);
  ctx.fillText("Tel: 0x7F-CAFE-BABE", 256, 105);

  // Divider
  ctx.font = "14px monospace";
  ctx.fillText("━".repeat(32), 256, 130);

  // Date / Receipt #
  ctx.textAlign = "left";
  ctx.font = "13px monospace";
  ctx.fillText("Date: 2026-03-23 04:20", 30, 155);
  ctx.fillText("Receipt #: 0xDEADBEEF", 30, 175);
  ctx.fillText("Cashier: sudo rm -rf /*", 30, 195);

  ctx.textAlign = "center";
  ctx.fillText("━".repeat(32), 256, 215);

  // Items header
  ctx.textAlign = "left";
  ctx.font = "bold 13px monospace";
  ctx.fillText("ITEM", 30, 240);
  ctx.textAlign = "right";
  ctx.fillText("PRICE", 480, 240);

  // Funny items
  const items = [
    ["1x Dark Mode (Premium)", "$4.04"],
    ["3x Semicolons (bulk)", "$0.03"],
    ["1x Mass Stack Overflow", "$99.99"],
    ["2x Rubber Duck (Debug)", "$12.00"],
    ["1x Regex That Works", "$999.99"],
    ["1x node_modules (1TB)", "$0.00"],
    ["1x CSS Centering Help", "$49.99"],
    ["1x git push --force", "$∞.∞∞"],
    ["1x AI-Generated Tests", "$0.01"],
    ["1x Undefined Is Not a", "$NaN"],
    ["  Function (warranty)", ""],
    ["1x Prod Deploy on Fri", "$666.66"],
    ["1x Missing Semicolon", "-$500.00"],
  ];

  ctx.font = "13px monospace";
  let y = 265;
  for (const [item, price] of items) {
    ctx.textAlign = "left";
    ctx.fillText(item, 30, y);
    if (price) {
      ctx.textAlign = "right";
      ctx.fillText(price, 480, y);
    }
    y += 22;
  }

  // Divider
  y += 10;
  ctx.textAlign = "center";
  ctx.fillText("━".repeat(32), 256, y);

  // Totals
  y += 25;
  ctx.font = "bold 14px monospace";
  ctx.textAlign = "left";
  ctx.fillText("SUBTOTAL:", 30, y);
  ctx.textAlign = "right";
  ctx.fillText("$1,332.72", 480, y);

  y += 22;
  ctx.textAlign = "left";
  ctx.fillText("TAX (NaN%):", 30, y);
  ctx.textAlign = "right";
  ctx.fillText("$undefined", 480, y);

  y += 22;
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "left";
  ctx.fillText("TOTAL:", 30, y);
  ctx.textAlign = "right";
  ctx.fillText("$NaN", 480, y);

  // Divider
  y += 30;
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText("━".repeat(32), 256, y);

  // Payment
  y += 25;
  ctx.font = "13px monospace";
  ctx.fillText("PAID WITH: Bitcoin (pending...)", 256, y);
  y += 20;
  ctx.fillText("CHANGE: SegFault", 256, y);

  // Barcode-like pattern
  y += 35;
  ctx.fillStyle = "#1a1a1a";
  for (let i = 0; i < 60; i++) {
    const bx = 100 + i * 5;
    const bw = Math.random() > 0.5 ? 3 : 1;
    const bh = 40 + Math.random() * 10;
    ctx.fillRect(bx, y, bw, bh);
  }

  // Footer
  y += 65;
  ctx.fillStyle = "#1a1a1a";
  ctx.font = "12px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Thank you for shopping!", 256, y);
  y += 18;
  ctx.fillText("Returns: git revert HEAD", 256, y);
  y += 18;
  ctx.fillText("Complaints: /dev/null", 256, y);
  y += 25;
  ctx.font = "11px monospace";
  ctx.fillText("♥ Made with bugs & love ♥", 256, y);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export default function Receipt() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    particles: Particle[][];
    constraints: Constraint[];
    mesh: THREE.Mesh;
    geometry: THREE.PlaneGeometry;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    grabbed: Particle | null;
    grabDepth: number;
    animId: number;
  } | null>(null);

  const initScene = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -0.5, 6);
    camera.lookAt(0, -1, 0);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(1024, 1024);
    scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xeeeeff, 0.3);
    fillLight.position.set(-3, 2, 3);
    scene.add(fillLight);

    // ── Create Particles ──
    const particles: Particle[][] = [];
    const offsetX = -CLOTH_W / 2;
    const offsetY = CLOTH_H / 2;

    for (let j = 0; j <= ROWS; j++) {
      const row: Particle[] = [];
      for (let i = 0; i <= COLS; i++) {
        const x = offsetX + i * REST_X;
        const y = offsetY - j * REST_Y;
        const p = new Particle(x, y, 0);
        // Pin entire top row
        if (j === 0) {
          p.pinned = true;
        }
        row.push(p);
      }
      particles.push(row);
    }

    // ── Create Constraints ──
    const constraints: Constraint[] = [];

    for (let j = 0; j <= ROWS; j++) {
      for (let i = 0; i <= COLS; i++) {
        // Structural horizontal
        if (i < COLS) {
          constraints.push(new Constraint(particles[j][i], particles[j][i + 1], 1.0));
        }
        // Structural vertical
        if (j < ROWS) {
          constraints.push(new Constraint(particles[j][i], particles[j + 1][i], 1.0));
        }
        // Shear diagonals for paper stiffness
        if (i < COLS && j < ROWS) {
          constraints.push(new Constraint(particles[j][i], particles[j + 1][i + 1], 0.8));
          constraints.push(new Constraint(particles[j + 1][i], particles[j][i + 1], 0.8));
        }
        // Bending constraints (skip one) - makes paper stiffer
        if (i < COLS - 1) {
          constraints.push(new Constraint(particles[j][i], particles[j][i + 2], 0.4));
        }
        if (j < ROWS - 1) {
          constraints.push(new Constraint(particles[j][i], particles[j + 2][i], 0.4));
        }
      }
    }

    // ── Mesh ──
    const geometry = new THREE.PlaneGeometry(CLOTH_W, CLOTH_H, COLS, ROWS);
    const texture = createReceiptTexture();

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
      roughness: 0.85,
      metalness: 0.0,
      transparent: false,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Shadow-catching ground plane
    const groundGeo = new THREE.PlaneGeometry(20, 20);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.08 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.z = -0.5;
    ground.receiveShadow = true;
    scene.add(ground);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      particles,
      constraints,
      mesh,
      geometry,
      raycaster,
      mouse,
      grabbed: null,
      grabDepth: 0,
      animId: 0,
    };
  }, []);

  const updateMeshGeometry = useCallback(() => {
    const s = sceneRef.current;
    if (!s) return;
    const pos = s.geometry.attributes.position;
    for (let j = 0; j <= ROWS; j++) {
      for (let i = 0; i <= COLS; i++) {
        const idx = j * (COLS + 1) + i;
        const p = s.particles[j][i];
        pos.setXYZ(idx, p.pos.x, p.pos.y, p.pos.z);
      }
    }
    pos.needsUpdate = true;
    s.geometry.computeVertexNormals();
  }, []);

  const simulate = useCallback(
    (dt: number) => {
      const s = sceneRef.current;
      if (!s) return;

      const subDt = dt / SUB_STEPS;

      for (let step = 0; step < SUB_STEPS; step++) {
        // Apply forces
        for (let j = 0; j <= ROWS; j++) {
          for (let i = 0; i <= COLS; i++) {
            const p = s.particles[j][i];
            p.applyForce(GRAVITY);

            // Light air resistance / random wind
            const wind = new THREE.Vector3(
              Math.sin(Date.now() * 0.001 + j * 0.3) * 0.15,
              0,
              Math.cos(Date.now() * 0.0015 + i * 0.2) * 0.1,
            );
            p.applyForce(wind);
          }
        }

        // Integrate
        for (let j = 0; j <= ROWS; j++) {
          for (let i = 0; i <= COLS; i++) {
            s.particles[j][i].integrate(subDt);
          }
        }

        // Solve constraints
        for (let iter = 0; iter < CONSTRAINT_ITERS; iter++) {
          for (const c of s.constraints) {
            c.solve();
          }
        }
      }

      updateMeshGeometry();
    },
    [updateMeshGeometry],
  );

  const animate = useCallback(() => {
    const s = sceneRef.current;
    if (!s) return;

    simulate(1 / 60);
    s.renderer.render(s.scene, s.camera);
    s.animId = requestAnimationFrame(animate);
  }, [simulate]);

  // Mouse interaction
  const handleMouseDown = useCallback((e: MouseEvent | TouchEvent) => {
    const s = sceneRef.current;
    if (!s || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      if (e.button !== 0) return;
      clientX = e.clientX;
      clientY = e.clientY;
    }

    s.mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    s.mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    s.raycaster.setFromCamera(s.mouse, s.camera);
    const intersects = s.raycaster.intersectObject(s.mesh);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      let closest: Particle | null = null;
      let minDist = Infinity;

      for (let j = 0; j <= ROWS; j++) {
        for (let i = 0; i <= COLS; i++) {
          const p = s.particles[j][i];
          if (p.pinned) continue;
          const d = p.pos.distanceTo(point);
          if (d < minDist) {
            minDist = d;
            closest = p;
          }
        }
      }

      if (closest && minDist < 0.5) {
        s.grabbed = closest;
        // Store depth for consistent dragging
        const projected = closest.pos.clone().project(s.camera);
        s.grabDepth = projected.z;
      }
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    const s = sceneRef.current;
    if (!s || !s.grabbed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ("touches" in e) {
      e.preventDefault();
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;

    const target = new THREE.Vector3(ndcX, ndcY, s.grabDepth);
    target.unproject(s.camera);

    // Smoothly move grabbed particle
    s.grabbed.pos.lerp(target, 0.5);
    s.grabbed.prev.copy(s.grabbed.pos);
  }, []);

  const handleMouseUp = useCallback(() => {
    const s = sceneRef.current;
    if (!s) return;
    s.grabbed = null;
  }, []);

  // Handle resize
  const handleResize = useCallback(() => {
    const s = sceneRef.current;
    const container = containerRef.current;
    if (!s || !container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    s.camera.aspect = width / height;
    s.camera.updateProjectionMatrix();
    s.renderer.setSize(width, height);
  }, []);

  useEffect(() => {
    initScene();

    const s = sceneRef.current;
    if (!s) return;

    const container = containerRef.current;

    // Start animation
    s.animId = requestAnimationFrame(animate);

    // Events
    const canvas = s.renderer.domElement;
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("touchstart", handleMouseDown, { passive: false });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleMouseMove, { passive: false });
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(s.animId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("touchstart", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      s.renderer.dispose();
      s.geometry.dispose();
      if (container) {
        container.removeChild(s.renderer.domElement);
      }
    };
  }, [initScene, animate, handleMouseDown, handleMouseMove, handleMouseUp, handleResize]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#f5f5f5] dark:bg-[#1a1a1a]">
      {/* Subtle vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.06) 100%)",
        }}
      />
      {/* Hint */}
      <div className="pointer-events-none absolute top-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/5 px-4 py-2 text-sm text-gray-500 backdrop-blur-sm select-none dark:bg-white/5 dark:text-gray-400">
        Grab and drag the receipt
      </div>
      {/* Three.js canvas */}
      <div ref={containerRef} className="h-full w-full cursor-grab active:cursor-grabbing" />
    </div>
  );
}
