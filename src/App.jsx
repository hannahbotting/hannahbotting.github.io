import { forwardRef, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';

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
    <div className="scene">
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

function SiteShell({ children }) {
  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand">Hannah Botting</div>
        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink to="/test" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Test
          </NavLink>
        </nav>
      </header>
      {children}
    </main>
  );
}

function HomePage() {
  return (
    <section className="hero">
      <div className="copy">
        <h1>My Website!</h1>
        <p>
          WIP
        </p>
      </div>
      <Scene />
    </section>
  );
}

function TestPage() {
  return (
    <section className="page-card">
      <h1>Test</h1>
      <p>
        Test routing page
      </p>
    </section>
  );
}

export default function App() {
  return (
    <SiteShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SiteShell>
  );
}