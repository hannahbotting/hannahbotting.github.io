import { useMemo } from 'react';
import { OrbitControls, TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import SelectableMesh from './SelectableMesh';

export default function SceneContent({ selectedId, setSelectedId, objectRefs }) {
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
