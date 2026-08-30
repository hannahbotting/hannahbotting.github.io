import * as THREE from 'three';
import { textureUrl } from './catalog';
import { textureCatalog } from './textureList';

export { textureCatalog };

const parallelSuffixes = {
  aoMap: 'AmbientOcclusion.jpg',
  normalMap: 'NormalGL.jpg',
  roughnessMap: 'Roughness.jpg',
};

const textureSetCache = new Map();

function loadTexture(url) {
  return new Promise((resolve, reject) => {
    new THREE.TextureLoader().load(url, resolve, undefined, () => reject(null));
  });
}

function deriveMaps(entry) {
  const base = entry.file.replace(/Color\.jpg$/i, '');
  return {
    map: entry.file,
    aoMap: entry.maps?.aoMap ?? `${base}${parallelSuffixes.aoMap}`,
    normalMap: entry.maps?.normalMap ?? `${base}${parallelSuffixes.normalMap}`,
    roughnessMap: entry.maps?.roughnessMap ?? `${base}${parallelSuffixes.roughnessMap}`,
  };
}

export function loadTextureSet(textureId) {
  if (!textureId) return Promise.resolve(null);
  if (textureSetCache.has(textureId)) return textureSetCache.get(textureId);

  const entry = textureCatalog.find((candidate) => candidate.id === textureId);
  if (!entry) return Promise.resolve(null);

  const paths = deriveMaps(entry);
  const promise = Promise.all(
    Object.entries(paths).map(async ([key, path]) => {
      try {
        const texture = await loadTexture(textureUrl(path));
        if (key === 'map') texture.colorSpace = THREE.SRGBColorSpace;
        return [key, texture];
      } catch {
        return [key, null];
      }
    }),
  ).then((entries) => Object.fromEntries(entries));

  textureSetCache.set(textureId, promise);
  return promise;
}