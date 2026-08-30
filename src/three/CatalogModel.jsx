import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { modelUrl } from './catalog';
import { changeObjectColour, changeObjectWarmth } from './materials';
import { sceneStore, useScene } from './sceneStore';

function fitModelToFloor(root) {
  const box = new THREE.Box3().setFromObject(root);
  const size = new THREE.Vector3();
  box.getSize(size);

  const targetHeight = 2.5;
  const scaleFactor = targetHeight / Math.max(size.x, size.y, size.z);

  const offset = new THREE.Vector3();
  box.getCenter(offset);
  offset.sub(new THREE.Vector3(0, size.y / 2, 0));
  offset.multiplyScalar(scaleFactor);

  root.scale.multiplyScalar(scaleFactor);
  root.position.sub(offset);

  root.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
}

function loadModelObject(url, path) {
  const extension = path.toLowerCase().split('.').pop();
  const loader =
    extension === 'glb' || extension === 'gltf'
      ? new GLTFLoader()
      : extension === 'obj'
        ? new OBJLoader()
        : extension === 'fbx'
          ? new FBXLoader()
          : null;

  if (!loader) {
    return Promise.reject(new Error(`Unsupported model format: ${path}`));
  }

  return new Promise((resolve, reject) => {
    loader.load(url, (result) => resolve(result.scene ?? result), undefined, reject);
  });
}

export default function CatalogModel({ instance }) {
  const groupRef = useRef(null);
  const [object, setObject] = useState(null);
  const { entry } = instance;
  useScene();

  useEffect(() => {
    let cancelled = false;
    setObject(null);
    loadModelObject(modelUrl(entry.model), entry.model)
      .then((loaded) => {
        if (cancelled) return;
        fitModelToFloor(loaded);
        setObject(loaded);
      })
      .catch((error) => console.error(`Failed to load model "${entry.name}":`, error));
    return () => {
      cancelled = true;
    };
  }, [entry.model, entry.name]);

  useEffect(() => {
    if (!object) return undefined;
    const root = groupRef.current;

    root.userData.movable = true;
    root.userData.displayName = entry.name;
    root.userData.colour = instance.colour ?? null;
    root.userData.isLight = false;
    root.userData.lightIntensity = 50;
    root.userData.warmth = 50;

    root.traverse((child) => {
      if (child.isLight) {
        root.userData.isLight = true;
        child.intensity = 50;
      }
    });
    if (root.userData.isLight) changeObjectWarmth(root, 50);

    sceneStore.registerRef(instance.id, root);
    return () => sceneStore.unregisterRef(instance.id);
  }, [object, instance.id, entry.name]);

  useEffect(() => {
    const root = groupRef.current;
    if (root && object) root.scale.setScalar(instance.scale);
  }, [object, instance.scale]);

  useEffect(() => {
    const root = groupRef.current;
    if (root && object && instance.colour) changeObjectColour(root, instance.colour);
  }, [object, instance.colour]);

  return (
    <group
      ref={groupRef}
      position={instance.position}
      rotation={instance.rotation}
      onClick={(event) => {
        event.stopPropagation();
        sceneStore.actions.select(instance.id);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {object ? <primitive object={object} /> : null}
    </group>
  );
}