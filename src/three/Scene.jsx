import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import SceneContent from './SceneContent';
import ObjectLibrary from './ObjectLibrary';
import ObjectDetails from './ObjectDetails';
import ModelCounter from './ModelCounter';
import { sceneStore } from './sceneStore';
import './Scene.css';

export default function Scene() {
  return (
    <div className="scene relative h-[min(72vh,680px)] min-h-[420px] w-full overflow-hidden rounded-[28px] border border-white/[0.08] bg-surface shadow-[0_24px_80px_rgba(0,0,0,0.35)] max-md:min-h-[360px]">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [10, 8, 10], fov: 75, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
        onPointerMissed={() => sceneStore.actions.deselect()}
        onCreated={({ gl }) => {
          gl.shadowMap.enabled = true;
          gl.shadowMap.type = THREE.PCFShadowMap;
        }}
      >
        <SceneContent />
      </Canvas>

      <ModelCounter />
      <ObjectLibrary />
      <ObjectDetails />
    </div>
  );
}