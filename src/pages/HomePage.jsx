import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';

const SelectableMesh = forwardRef(function SelectableMesh(
  { color, geometry, position, selected, onSelect, ...props },
  ref,
) {
  const meshRef = useRef(null);

  useFrame((state, delta) => {
    if (!meshRef.current || selected) return;

    meshRef.current.rotation.x += delta * 0.25;
    meshRef.current.rotation.y += delta * 0.35;
  });

  return (
    <mesh
      ref={(node) => {
        meshRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      geometry={geometry}
      position={position}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
      {...props}
    >
      <meshStandardMaterial
        color={color}
        roughness={0.24}
        metalness={0.18}
        emissive={selected ? '#0d2f38' : '#000000'}
        emissiveIntensity={selected ? 0.45 : 0}
      />
    </mesh>
  );
});

function SceneContent({ selectedId, setSelectedId, objectRefs }) {
  const selectedObject = objectRefs.current[selectedId] || null;
  const stars = useMemo(() => {
    const pointsCount = 900;
    const positions = new Float32Array(pointsCount * 3);

    for (let index = 0; index < pointsCount; index += 1) {
      const radius = 3.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));

      positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  return (
    <>
      <color attach="background" args={['#08111f']} />
      <fog attach="fog" args={['#08111f', 10, 22]} />
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 6]} intensity={1.6} />
      <pointLight position={[-3, -1, 3]} intensity={3} color="#72f0d4" />

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={stars}
            count={stars.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#c6d6ff" size={0.02} transparent opacity={0.9} />
      </points>

      <group>
        <SelectableMesh
          ref={(node) => {
            objectRefs.current.sphere = node;
          }}
          selected={selectedId === 'sphere'}
          onSelect={() => setSelectedId('sphere')}
          geometry={new THREE.IcosahedronGeometry(1.25, 1)}
          position={[-1.25, 0, 0]}
          color="#72f0d4"
        />
        <mesh
          ref={(node) => {
            objectRefs.current.ring = node;
          }}
          rotation={[Math.PI * 0.45, 0, 0]}
          position={[1.55, 0.25, 0]}
          onClick={(event) => {
            event.stopPropagation();
            setSelectedId('ring');
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <torusGeometry args={[1.25, 0.16, 18, 60]} />
          <meshStandardMaterial color="#f5b961" roughness={0.4} metalness={0.2} />
        </mesh>
        <mesh
          ref={(node) => {
            objectRefs.current.cube = node;
          }}
          position={[0, -1.75, -0.1]}
          onClick={(event) => {
            event.stopPropagation();
            setSelectedId('cube');
          }}
          onPointerOver={() => {
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshStandardMaterial
            color="#c6d6ff"
            roughness={0.35}
            metalness={0.1}
            emissive={selectedId === 'cube' ? '#1a2444' : '#000000'}
            emissiveIntensity={selectedId === 'cube' ? 0.35 : 0}
          />
        </mesh>
      </group>

      {selectedObject ? (
        <TransformControls
          object={selectedObject}
          mode="translate"
          onMouseDown={() => {
            document.body.style.cursor = 'grabbing';
          }}
          onMouseUp={() => {
            document.body.style.cursor = 'auto';
          }}
        />
      ) : null}

      <OrbitControls makeDefault enableDamping enabled={!selectedObject} />
    </>
  );
}

function Scene() {
  const objectRefs = useRef({ sphere: null, ring: null, cube: null });
  const [selectedId, setSelectedId] = useState('sphere');

  return (
    <div className="scene h-[min(72vh,680px)] min-h-[420px] w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.35)] max-md:min-h-[360px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 2]}>
        <SceneContent
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          objectRefs={objectRefs}
        />
      </Canvas>
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    document.title = 'Hannah Botting | Home';
  }, []);

  return (
    <section className="mx-auto grid max-w-[1120px] grid-cols-[1fr_minmax(320px,560px)] items-center gap-8 max-md:grid-cols-1">
      <div className="max-w-[34rem]">
        <h1 className="m-0 text-[clamp(3rem,7vw,5.6rem)] leading-[0.94]">My Website!</h1>
        <p className="mt-4 text-[1.05rem] leading-relaxed">
          WIP
        </p>
      </div>
      <Scene />
    </section>
  );
}
