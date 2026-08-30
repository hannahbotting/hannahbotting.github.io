// Default lighting from editor-scene.ts: a warm directional key light with a
// calibrated 40-unit shadow camera and a soft ambient fill.
export default function Lights() {
  return (
    <>
      <directionalLight
        position={[10, 10, 10]}
        intensity={2}
        color={0xfff8e7}
        castShadow
        shadow-bias={-0.001}
        shadow-normalBias={0.02}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      <ambientLight intensity={0.5} color={0xffffff} />
    </>
  );
}