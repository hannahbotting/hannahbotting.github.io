import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const WIDTH = 256;
const HEIGHT = 512;

const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true, antialias: true });
renderer.setSize(WIDTH, HEIGHT, false);
renderer.setPixelRatio(1);

const loader = new GLTFLoader();

const TARGET_HEIGHT = 2.5;

window.__renderModel = async (path) => {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xe3e3e3);

  const directionalLight = new THREE.DirectionalLight(0xfff8e7, 2);
  directionalLight.position.set(10, 10, 10);
  scene.add(directionalLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const { scene: root } = await loader.loadAsync(path);
  scene.add(root);

  const camera = new THREE.PerspectiveCamera(50, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.set(0, 6, 10);
  camera.lookAt(0, 1, 0);
  camera.updateProjectionMatrix();

  // Reproduce ModelLoader.processLoadedModel scaling: resize so the largest
  // dimension matches the target height, then center and ground the model.
  root.updateMatrixWorld(true);
  let box = new THREE.Box3().setFromObject(root);
  const size = box.getSize(new THREE.Vector3());
  const scaleFactor = TARGET_HEIGHT / Math.max(size.x, size.y, size.z);

  const offset = new THREE.Vector3();
  box.getCenter(offset);
  offset.sub(new THREE.Vector3(0, size.y / 2, 0));
  offset.multiply(new THREE.Vector3(scaleFactor, scaleFactor, scaleFactor));

  root.scale.setScalar(scaleFactor);
  root.position.sub(offset);
  root.rotation.y = -Math.PI / 4;
  root.updateMatrixWorld(true);

  // Re-center on screen after the 45 degrees rotation so thumbs stay centered
  box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  root.position.x -= center.x;
  root.position.z -= center.z;
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);

  renderer.render(scene, camera);
  const dataUrl = renderer.domElement.toDataURL('image/png');

  scene.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
  renderer.renderLists.dispose();
  return dataUrl;
};