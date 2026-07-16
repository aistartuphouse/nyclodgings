"use client";

// The heavy half of the hero: three.js orbit scene. Loaded only on desktop
// widths with working WebGL, so phones never pay for the three.js bundle.

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { CONCEPTS, type Concept, type GlyphKind } from "@/lib/concepts";

const ACCENT = "#19b5ff";
const ACCENT_DIM = "#6f9fce";
const ACTIVE = "#eef4ff";
// Must match the hero section's bg-sand: the canvas is opaque and paints
// its own background.
const BG = "#0e1e3a";

function Glyph({ kind, active }: { kind: GlyphKind; active: boolean }) {
  const color = active ? ACTIVE : ACCENT;
  const mat = (
    <meshBasicMaterial color={color} wireframe transparent opacity={active ? 1 : 0.9} />
  );
  switch (kind) {
    case "torus":
      return <mesh rotation={[Math.PI / 3, 0, 0]}><torusGeometry args={[0.42, 0.13, 8, 24]} />{mat}</mesh>;
    case "layers":
      return (
        <group rotation={[0.4, 0.5, 0]}>
          {[-0.28, 0, 0.28].map((y) => (
            <mesh key={y} position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[0.8, 0.8, 2, 2]} />
              <meshBasicMaterial color={color} wireframe transparent opacity={active ? 0.95 : 0.85} side={THREE.DoubleSide} />
            </mesh>
          ))}
        </group>
      );
    case "terminal":
      return (
        <group>
          <mesh><boxGeometry args={[0.9, 0.62, 0.08, 2, 2, 1]} />{mat}</mesh>
          <mesh position={[-0.18, 0.02, 0.06]} rotation={[0, 0, -Math.PI / 4]}><boxGeometry args={[0.22, 0.05, 0.02]} />{mat}</mesh>
          <mesh position={[-0.18, -0.15, 0.06]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.22, 0.05, 0.02]} />{mat}</mesh>
          <mesh position={[0.16, -0.19, 0.06]}><boxGeometry args={[0.3, 0.05, 0.02]} />{mat}</mesh>
        </group>
      );
    case "graph":
      return (
        <group>
          {[[0, 0.32, 0], [-0.34, -0.18, 0.1], [0.34, -0.18, -0.1], [0, -0.05, 0.28]].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]}>
              <sphereGeometry args={[0.11, 8, 8]} />{mat}
            </mesh>
          ))}
          <Lines
            color={color}
            points={[
              [0, 0.32, 0], [-0.34, -0.18, 0.1],
              [0, 0.32, 0], [0.34, -0.18, -0.1],
              [0, 0.32, 0], [0, -0.05, 0.28],
              [-0.34, -0.18, 0.1], [0.34, -0.18, -0.1],
            ]}
          />
        </group>
      );
    case "cube":
      return <mesh rotation={[0.5, 0.6, 0]}><boxGeometry args={[0.62, 0.62, 0.62, 2, 2, 2]} />{mat}</mesh>;
    case "knot":
      return <mesh><torusKnotGeometry args={[0.3, 0.09, 48, 8]} />{mat}</mesh>;
    case "cluster":
      return (
        <group>
          {[[0, 0.26, 0], [-0.28, -0.16, 0], [0.28, -0.16, 0]].map((p, i) => (
            <mesh key={i} position={p as [number, number, number]} rotation={[0.3 * i, 0.5 * i, 0]}>
              <tetrahedronGeometry args={[0.22]} />{mat}
            </mesh>
          ))}
        </group>
      );
    case "gauge":
      return (
        <group rotation={[0.35, 0, 0]}>
          <mesh><torusGeometry args={[0.42, 0.045, 6, 20, Math.PI]} />{mat}</mesh>
          <mesh position={[0.14, 0.14, 0]} rotation={[0, 0, -0.8]}><boxGeometry args={[0.34, 0.045, 0.045]} />{mat}</mesh>
        </group>
      );
    case "cylinder":
      return <mesh rotation={[0.35, 0, 0.1]}><cylinderGeometry args={[0.34, 0.34, 0.62, 12, 3]} />{mat}</mesh>;
    case "ring":
      return (
        <group rotation={[0.4, 0, 0]}>
          <mesh><torusGeometry args={[0.36, 0.07, 6, 20]} />{mat}</mesh>
          <mesh position={[0.52, 0, 0]}><boxGeometry args={[0.26, 0.14, 0.14]} />{mat}</mesh>
        </group>
      );
  }
}

function Lines({ points, color }: { points: number[][]; color: string }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(points.flat(), 3));
    return g;
  }, [points]);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color={color} transparent opacity={0.5} />
    </lineSegments>
  );
}

interface NodeProps {
  concept: Concept;
  index: number;
  ring: 0 | 1;
  countInRing: number;
  activeTerm: string | null;
  onActivate: (concept: Concept | null, pinned: boolean) => void;
}

// Shallow elliptical rings: wide in x, compressed in z so nodes never swing
// close enough to the camera to balloon, tilted for depth.
const RING_CONF = [
  { radiusX: 2.9, radiusZ: 1.3, tilt: 0.55, speed: 0.07, y: 1.15 },
  { radiusX: 4.3, radiusZ: 1.9, tilt: -0.4, speed: -0.05, y: -1.25 },
] as const;

function ConceptNode({ concept, index, ring, countInRing, activeTerm, onActivate }: NodeProps) {
  const group = useRef<THREE.Group>(null);
  const conf = RING_CONF[ring];
  const angle = useRef((index / countInRing) * Math.PI * 2);
  const speedFactor = useRef(1);
  const active = activeTerm === concept.term;

  useFrame(({ camera }, delta) => {
    const g = group.current;
    if (!g) return;
    // Integrate the angle incrementally and ease the speed toward 0 while
    // anything is hovered: rings glide to a stop and resume smoothly, and
    // nodes never jump (a hover must not teleport the thing being hovered).
    speedFactor.current = THREE.MathUtils.lerp(
      speedFactor.current,
      activeTerm ? 0 : 1,
      Math.min(1, delta * 5),
    );
    angle.current += conf.speed * speedFactor.current * Math.min(delta, 0.05);
    const t = angle.current;
    const x = Math.cos(t) * conf.radiusX;
    const z = Math.sin(t) * conf.radiusZ;
    const y = conf.y + Math.sin(t * 2) * 0.14 + x * Math.tan(conf.tilt) * 0.5;
    g.position.set(x, y, z);
    const target = active ? 1.35 : 1;
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, 0.12));
    g.quaternion.copy(camera.quaternion); // billboard toward camera
  });

  const stop = (e: ThreeEvent<PointerEvent | MouseEvent>) => e.stopPropagation();

  return (
    <group
      ref={group}
      onPointerOver={(e) => {
        stop(e);
        document.body.style.cursor = "pointer";
        onActivate(concept, false);
      }}
      onPointerOut={(e) => {
        stop(e);
        document.body.style.cursor = "auto";
        onActivate(null, false);
      }}
      onClick={(e) => {
        stop(e);
        onActivate(concept, true);
      }}
    >
      {/* invisible hit target, close to the glyph's visual size */}
      <mesh visible={false}>
        <sphereGeometry args={[0.85, 8, 8]} />
      </mesh>
      <Glyph kind={concept.glyph} active={active} />
      {/* Suspense keeps a slow font load from suspending the whole scene.
          Upper-ring labels sit above their glyph, lower-ring below, so the
          two rings' text never collides mid-screen. */}
      <Suspense fallback={null}>
        <Text
          position={[0, ring === 0 ? 0.95 : -0.95, 0]}
          font="/fonts/JetBrainsMono-Medium.ttf"
          fontSize={0.25}
          letterSpacing={0.12}
          color={active ? ACTIVE : ACCENT_DIM}
          anchorX="center"
          anchorY={ring === 0 ? "bottom" : "top"}
          fillOpacity={active ? 1 : 0.95}
        >
          {concept.term.toUpperCase()}
        </Text>
      </Suspense>
    </group>
  );
}

function Core() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.set(t * 0.12, t * 0.17, 0);
    }
    if (inner.current) {
      inner.current.rotation.set(-t * 0.2, -t * 0.14, 0);
      const pulse = 1 + Math.sin(t * 1.4) * 0.05;
      inner.current.scale.setScalar(pulse);
    }
  });
  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={ACCENT_DIM} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 2.2 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 1.1 + 0.4 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

// Some GPU/driver stacks (seen on Windows ANGLE/D3D11) can leave the canvas
// visually empty without any error. After the scene has had time to draw,
// sample the framebuffer; the navy clear color carries a blue channel of 58,
// so any healthy render has blue-lit pixels everywhere, while the broken
// case reads back all zeros and we swap in the static fallback instead.
function RenderProbe({ onBroken }: { onBroken: () => void }) {
  const frames = useRef(0);
  const done = useRef(false);
  useFrame(({ gl }) => {
    if (done.current) return;
    frames.current++;
    if (frames.current !== 45) return;
    done.current = true;
    try {
      const ctx = gl.getContext() as WebGLRenderingContext;
      const w = ctx.drawingBufferWidth;
      const h = ctx.drawingBufferHeight;
      const px = new Uint8Array(4);
      let lit = false;
      outer: for (let sx = 0.35; sx <= 0.95; sx += 0.06) {
        for (let sy = 0.15; sy <= 0.85; sy += 0.1) {
          ctx.readPixels(Math.floor(w * sx), Math.floor(h * sy), 1, 1, ctx.RGBA, ctx.UNSIGNED_BYTE, px);
          if ((px[2] ?? 0) > 30 || (px[0] ?? 0) > 60 || (px[1] ?? 0) > 60) {
            lit = true;
            break outer;
          }
        }
      }
      if (!lit) onBroken();
    } catch {
      onBroken();
    }
  });
  return null;
}

function OrbitScene({
  activeTerm,
  onActivate,
}: {
  activeTerm: string | null;
  onActivate: (c: Concept | null, pinned: boolean) => void;
}) {
  const ringA = CONCEPTS.filter((_, i) => i % 2 === 0);
  const ringB = CONCEPTS.filter((_, i) => i % 2 === 1);
  return (
    <>
      <Rig />
      {/* The whole system sits right of center so the hero copy keeps a
          calm left column. */}
      <group position={[2.3, 0, 0]}>
        <Core />
        {ringA.map((c, i) => (
          <ConceptNode key={c.term} concept={c} index={i} ring={0} countInRing={ringA.length} activeTerm={activeTerm} onActivate={onActivate} />
        ))}
        {ringB.map((c, i) => (
          <ConceptNode key={c.term} concept={c} index={i} ring={1} countInRing={ringB.length} activeTerm={activeTerm} onActivate={onActivate} />
        ))}
      </group>
    </>
  );
}

export default function OrbitCanvas({
  activeTerm,
  onActivate,
  onBroken,
  onClearPin,
}: {
  activeTerm: string | null;
  onActivate: (c: Concept | null, pinned: boolean) => void;
  onBroken: () => void;
  onClearPin: () => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 12], fov: 42 }}
      dpr={[1, 1.5]}
      // Opaque canvas: transparent WebGL canvases composited over page
      // backgrounds are a known black-output bug class on some Windows
      // ANGLE/D3D11 drivers. We paint the paper background in-GL instead.
      gl={{ antialias: true, alpha: false, powerPreference: "low-power", preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.setClearColor(BG, 1);
      }}
      onPointerMissed={onClearPin}
    >
      <RenderProbe onBroken={onBroken} />
      <OrbitScene activeTerm={activeTerm} onActivate={onActivate} />
    </Canvas>
  );
}
