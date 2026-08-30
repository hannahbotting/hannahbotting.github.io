import * as THREE from 'three';

export function traverseMeshes(root, callback) {
  root.traverse((child) => {
    if (!child.isMesh) return;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    callback(child, materials);
  });
}

export function changeObjectColour(root, colour) {
  root.userData.colour = colour;
  traverseMeshes(root, (_mesh, materials) => {
    materials.forEach((material) => {
      if (material && 'color' in material) material.color.set(colour);
    });
  });
}

export function setObjectTexture(root, textures) {
  traverseMeshes(root, (mesh, materials) => {
    const created = materials.map(() => new THREE.MeshStandardMaterial());
    for (const material of created) {
      material.map = textures?.map ?? null;
      material.aoMap = textures?.aoMap ?? null;
      material.normalMap = textures?.normalMap ?? null;
      material.roughnessMap = textures?.roughnessMap ?? null;
      material.metalnessMap = null;
      material.displacementMap = null;
      material.color = new THREE.Color(0xffffff);
      if (!textures?.map?.isTexture && root.userData.colour) {
        material.color.set(root.userData.colour);
      }
    }
    for (const material of created) material.needsUpdate = true;
    mesh.material = created.length === 1 ? created[0] : created;
  });
}

export function snapObjectToFloor(root) {
  const precise = !root.rotation.equals(new THREE.Euler(0, 0, 0));
  const box = new THREE.Box3().setFromObject(root, precise);
  const size = new THREE.Vector3();
  box.getSize(size);
  const offset = new THREE.Vector3();
  box.getCenter(offset);
  root.position.y = root.position.y - offset.y + size.y / 2;
}

export function warmthColour(value) {
  const orange = new THREE.Color(0xffbc00);
  const yellow = new THREE.Color(0xfffc99);
  const white = new THREE.Color(0xffffff);
  const blue = new THREE.Color(0xe5fffd);

  let c1;
  let c2;
  let t;
  if (value < 30) {
    t = value / 30;
    c1 = blue;
    c2 = white;
  } else if (value < 70) {
    t = (value - 30) / 40;
    c1 = white;
    c2 = yellow;
  } else {
    t = (value - 70) / 30;
    c1 = yellow;
    c2 = orange;
  }
  return c1.clone().lerp(c2, t);
}

export function changeObjectLightIntensity(root, intensity) {
  root.traverse((child) => {
    if (child.isLight) child.intensity = intensity;
  });
  root.userData.lightIntensity = intensity;
}

export function changeObjectWarmth(root, value) {
  root.traverse((child) => {
    if (child.isLight) child.color.copy(warmthColour(value));
  });
  root.userData.warmth = value;
}