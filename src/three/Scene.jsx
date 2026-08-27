import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';
import './Scene.css';

export default function Scene() {
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
