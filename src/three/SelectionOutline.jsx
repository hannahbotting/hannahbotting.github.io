import { useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { EffectComposer, Outline } from '@react-three/postprocessing';
import { sceneStore } from './sceneStore';

const signature = (meshes) => meshes.map((mesh) => mesh.uuid).sort().join(',');

function getMeshes(object) {
  const meshes = [];
  object.traverse((child) => {
    if (child.isMesh) meshes.push(child);
  });
  return meshes;
}

export default function SelectionOutline({ selectedId }) {
  const [meshes, setMeshes] = useState([]);

  useFrame(() => {
    const root = selectedId ? sceneStore.getRef(selectedId) : null;
    const next = root ? getMeshes(root) : [];
    const nextSignature = signature(next);
    setMeshes((prev) => (signature(prev) === nextSignature ? prev : next));
  });

  const selection = useMemo(() => meshes, [meshes]);

  return (
    <EffectComposer autoClear={false}>
      <Outline
        selection={selection}
        visibleEdgeColor="#ffffff"
        hiddenEdgeColor="#ffffff"
        edgeStrength={1}
        edgeGlow={1}
      />
    </EffectComposer>
  );
}