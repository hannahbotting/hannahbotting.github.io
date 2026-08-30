# Textures

Each folder here is one texture set from which
`scripts/generate-catalog.mjs` generates `src/three/textureList.js`
(regenerated automatically on `predev`/`prebuild`).

## PBR texture sets

```
textures/pbr-textures/<Texture Name>/
├── <base>_Color.jpg               (required, defines the set)
├── <base>_AmbientOcclusion.jpg    (optional)
├── <base>_Displacement.jpg        (optional)
├── <base>_NormalGL.jpg            (optional)
└── <base>_Roughness.jpg           (optional)
```

The physical maps are derived from the colour map's base name automatically
(see `src/three/textureCatalog.js`); extra files such as `_NormalDX` are ignored.

## Flat textures

```
textures/flat-textures/<name>.jpg  (or .png / .jpeg)
```

The generated list is in `src/three/textureList.js`.