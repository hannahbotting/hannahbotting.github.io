import { forwardRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

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

export default SelectableMesh;
