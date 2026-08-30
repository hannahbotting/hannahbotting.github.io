import { useLayoutEffect } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, TransformControls } from '@react-three/drei';
import { TextureLoader, EquirectangularReflectionMapping, LinearSRGBColorSpace } from 'three';
import { assetUrl } from './catalog';
import Room from './Room';
import Lights from './Lights';
import CatalogModel from './CatalogModel';
import SelectionOutline from './SelectionOutline';
import { sceneStore, useScene } from './sceneStore';

function SkyBackground({ files }) {
  const scene = useThree((state) => state.scene);
  const texture = useLoader(TextureLoader, files);
  texture.mapping = EquirectangularReflectionMapping;
  texture.colorSpace = LinearSRGBColorSpace;

  useLayoutEffect(() => {
    const previousBackground = scene.background;
    const previousEnvironment = scene.environment;
    scene.background = texture;
    scene.environment = texture;
    return () => {
      scene.background = previousBackground;
      scene.environment = previousEnvironment;
    };
  }, [scene, texture]);

  return null;
}

export default function SceneContent() {
  const { objects, selectedId, transformMode, tick } = useScene();
  const orbitControls = useThree((state) => state.controls);
  void tick;

  const selectedObject = selectedId ? sceneStore.getRef(selectedId) : null;
  const selectedRecord = selectedId ? sceneStore.getObject(selectedId) : null;
  const movable = selectedRecord?.movable ?? false;

  const updateCoordinates = (event) => {
    const target = event?.target?.object ?? event?.object ?? selectedObject;
    if (target) {
      sceneStore.actions.setCoordinates({
        x: target.position.x,
        y: target.position.y,
        z: target.position.z,
      });
    }
  };

  return (
    <>
      <SkyBackground
        files={assetUrl('sky-background/sky-background.jpg')}
      />

      <Lights />

      <gridHelper args={[30, 30, 0x888888, 0x888888]} position={[0, -0.01, 0]} />

      <Room />

      {objects
        .filter((instance) => instance.movable)
        .map((instance) => (
          <CatalogModel key={instance.id} instance={instance} />
        ))}

      {selectedObject && movable ? (
        <TransformControls
          object={selectedObject}
          mode={transformMode}
          onMouseDown={() => {
            if (orbitControls) orbitControls.enabled = false;
          }}
          onMouseUp={() => {
            if (orbitControls) orbitControls.enabled = true;
          }}
          onObjectChange={updateCoordinates}
        />
      ) : null}

      <SelectionOutline selectedId={selectedId} />

      <OrbitControls makeDefault enableDamping target={[0, 2, 0]} />
    </>
  );
}