import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ICrowProps } from "./crow.interface";

const CROW_GLB_PATH = "/models/crow.glb";

useGLTF.preload(CROW_GLB_PATH);

// How far back along the path (in progress units) to look for orientation.
const LOOKBEHIND = 0.01;

// Seconds before a crow's very first flight, randomized so crows don't all
// enter together.
const INITIAL_ENTRY_DELAY_MAX = 10;
// Seconds a crow waits off-screen between one exit and the next entry.
const REENTRY_DELAY_MIN = 10;
const REENTRY_DELAY_MAX = 30;

// Chance a given flight sheds a feather at all — kept rare so a feather
// reads as an event tied to a specific crow, not ambient weather.
const SHED_CHANCE = 0.5;
// Progress window (0-1 along the flight path) in which a shedding flight
// drops its feather — mid-pass, well clear of the off-screen entry/exit.
const SHED_PROGRESS_MIN = 0.25;
const SHED_PROGRESS_MAX = 0.6;
// Local-space distance from the crow's center to a wingtip, used as the
// shed origin so the feather appears to come off the wing.
const WING_OFFSET = 0.5;

// crow.glb's baked textures are genuinely dark (average ~30/255) and its
// materials don't declare metallicFactor/roughnessFactor, which per the
// glTF spec default to fully metallic. Fully metallic surfaces only show
// environment reflections — this scene has no environment map — so the
// diffuse texture was being suppressed almost entirely, crushing an
// already-dark bird down to literal flat black. Correcting metalness alone
// still isn't enough to lift that dark a texture into a visible range under
// this scene's lighting, hence the color boost.
const CROW_METALNESS = 0;
const CROW_ROUGHNESS = 0.7;
const CROW_COLOR_BOOST = 1;

// Each of CrowBody/WingL/WingR has two glTF primitives (one per material —
// see M_CrowBody/M_CrowWings), and GLTFLoader represents a multi-primitive
// mesh as a Group with one child Mesh per primitive, not a single Mesh. So
// this has to walk the whole subtree rather than assume `root` itself has
// a `.material`. Each child's material is cloned (not the one useGLTF()
// returns, which is shared across every crow instance) so the fix can be
// applied without mutating a hook's return value in place.
function fixCrowMaterial(root: THREE.Object3D) {
  root.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      const material = child.material.clone();
      material.metalness = CROW_METALNESS;
      material.roughness = CROW_ROUGHNESS;
      material.color.multiplyScalar(CROW_COLOR_BOOST);
      child.material = material;
    }
  });
  return root;
}

export default function useCrow({ config, onShed }: ICrowProps) {
  const { nodes } = useGLTF(CROW_GLB_PATH);

  // useGLTF caches and returns the same node objects for every instance;
  // since a three.js object can only have one parent at a time, rendering
  // those shared nodes directly would make all but the last crow invisible.
  // Clone once per instance — a plain clone is fine, there's no skeleton.
  const crowBody = useMemo(
    () => fixCrowMaterial(nodes.CrowBody.clone()),
    [nodes],
  );
  const wingLMesh = useMemo(
    () => fixCrowMaterial(nodes.WingL.clone()),
    [nodes],
  );
  const wingRMesh = useMemo(
    () => fixCrowMaterial(nodes.WingR.clone()),
    [nodes],
  );

  const group = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Object3D>(null);
  const wingR = useRef<THREE.Object3D>(null);
  const progress = useRef(0);
  const behind = useMemo(() => new THREE.Vector3(), []);
  const prevPosition = useMemo(() => new THREE.Vector3(), []);
  const shedVelocity = useMemo(() => new THREE.Vector3(), []);
  const shedPosition = useMemo(() => new THREE.Vector3(), []);

  const [visible, setVisible] = useState(false);
  const phase = useRef<"waiting" | "flying">("waiting");
  // Seeded lazily on the first useFrame call rather than here, since
  // Math.random() during render is impure and the compiler flags it.
  const timer = useRef<number | null>(null);
  // Null when this flight won't shed at all; otherwise the progress value
  // at which it does. Rolled fresh each time a flight starts.
  const shedProgress = useRef<number | null>(null);
  const hasShed = useRef(false);

  function positionAt(p: number, out: THREE.Vector3) {
    out.set(
      THREE.MathUtils.lerp(config.start[0], config.end[0], p),
      THREE.MathUtils.lerp(config.start[1], config.end[1], p) +
        Math.sin(p * Math.PI * config.undulationCycles) *
          config.undulationAmplitude,
      THREE.MathUtils.lerp(config.start[2], config.end[2], p),
    );
    return out;
  }

  useFrame((state, delta) => {
    if (timer.current === null) {
      timer.current = Math.random() * INITIAL_ENTRY_DELAY_MAX;
    }

    if (phase.current === "waiting") {
      timer.current -= delta;
      if (timer.current > 0) return;
      phase.current = "flying";
      progress.current = 0;
      hasShed.current = false;
      shedProgress.current =
        Math.random() < SHED_CHANCE
          ? SHED_PROGRESS_MIN +
            Math.random() * (SHED_PROGRESS_MAX - SHED_PROGRESS_MIN)
          : null;
      setVisible(true);
    }

    progress.current += delta / config.duration;
    if (progress.current >= 1) {
      phase.current = "waiting";
      timer.current =
        REENTRY_DELAY_MIN +
        Math.random() * (REENTRY_DELAY_MAX - REENTRY_DELAY_MIN);
      setVisible(false);
      return;
    }

    if (group.current) {
      prevPosition.copy(group.current.position);
      positionAt(progress.current, group.current.position);
      // crow.glb's face points toward local +Z, the opposite of three.js's
      // -Z lookAt convention, so aim at a point just behind on the path
      // instead of ahead — that leaves the face pointing forward.
      positionAt(progress.current - LOOKBEHIND, behind);
      group.current.lookAt(behind);

      if (
        onShed &&
        shedProgress.current !== null &&
        !hasShed.current &&
        progress.current >= shedProgress.current
      ) {
        hasShed.current = true;
        // Velocity from this frame's displacement, becomes the feather's
        // initial momentum (see falling-feathers' impulse decay).
        if (delta > 0) {
          shedVelocity
            .copy(group.current.position)
            .sub(prevPosition)
            .divideScalar(delta);
        }
        const side = Math.random() < 0.5 ? -1 : 1;
        shedPosition.set(side * WING_OFFSET, 0, 0);
        group.current.localToWorld(shedPosition);
        onShed({
          position: shedPosition.clone(),
          velocity: shedVelocity.clone(),
        });
      }
    }

    const flap =
      Math.sin(state.clock.elapsedTime * config.flapSpeed) *
      config.flapAmplitude;
    if (wingL.current) wingL.current.rotation.z = flap;
    if (wingR.current) wingR.current.rotation.z = -flap;
  });

  return { group, wingL, wingR, crowBody, wingLMesh, wingRMesh, visible };
}
