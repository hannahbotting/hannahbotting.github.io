import { useEffect, useRef } from 'react';
import { sceneStore } from './sceneStore';

// The default room shape from default-scene-builder.ts: a grey floor, a white
// back wall and a white left wall. Like the original, each surface is a plain
// selectable (but non-movable) scene object named "Floor" / "Wall".
const FLOOR_THICKNESS = 0.1;
const WALL_THICKNESS = 0.1;
const ROOM_HEIGHT = 8;
const ROOM_WIDTH = 20;
const ROOM_DEPTH = ROOM_WIDTH;

const floorId = 'room-floor';
const backWallId = 'room-back-wall';
const leftWallId = 'room-left-wall';

export default function Room() {
  const floorRef = useRef(null);
  const backWallRef = useRef(null);
  const leftWallRef = useRef(null);

  useEffect(() => {
    sceneStore.registerStaticObject(floorId, floorRef.current, { name: 'Floor', colour: '#7e7e7e' });
    sceneStore.registerStaticObject(backWallId, backWallRef.current, { name: 'Wall', colour: '#ffffff' });
    sceneStore.registerStaticObject(leftWallId, leftWallRef.current, { name: 'Wall', colour: '#ffffff' });
  }, []);

  const selectSurface = (id) => (event) => {
    event.stopPropagation();
    sceneStore.actions.select(id);
  };

  const pointerOver = (event) => {
    event.stopPropagation();
    document.body.style.cursor = 'pointer';
  };

  const pointerOut = () => {
    document.body.style.cursor = 'auto';
  };

  return (
    <group>
      <mesh
        ref={floorRef}
        receiveShadow
        position={[0, -FLOOR_THICKNESS / 2, 0]}
        onClick={selectSurface(floorId)}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
      >
        <boxGeometry args={[ROOM_WIDTH, FLOOR_THICKNESS, ROOM_DEPTH]} />
        <meshStandardMaterial color={0x7e7e7e} />
      </mesh>

      <mesh
        ref={backWallRef}
        receiveShadow
        position={[0, ROOM_HEIGHT / 2 - FLOOR_THICKNESS / 2, -ROOM_DEPTH / 2]}
        onClick={selectSurface(backWallId)}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
      >
        <boxGeometry args={[ROOM_WIDTH, ROOM_HEIGHT, WALL_THICKNESS]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>

      <mesh
        ref={leftWallRef}
        receiveShadow
        position={[-ROOM_WIDTH / 2, ROOM_HEIGHT / 2 - FLOOR_THICKNESS / 2, 0]}
        onClick={selectSurface(leftWallId)}
        onPointerOver={pointerOver}
        onPointerOut={pointerOut}
      >
        <boxGeometry args={[WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH]} />
        <meshStandardMaterial color={0xffffff} />
      </mesh>
    </group>
  );
}