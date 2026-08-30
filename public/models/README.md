# Models

Each folder here is one catalog entry from which
`scripts/generate-catalog.mjs` generates `src/three/catalog.js`
(regenerated automatically on `predev`/`prebuild`).

Each folder is one catalog entry:

```
models/<Model Name>/
├── <anything>.glb     (first .glb found is used)
└── <anything>.png/.jpg (optional preview image)
```

Supported formats: **.glb**, **.gltf**, **.obj**, **.fbx**. Folder names
containing `floor lamp`, `pendant`, `tomon` or `candle` are flagged as emissive
light sources. The generated list is in `src/three/catalog.js`.

Note: `.nojekyll` is already present so GitHub Pages serves binary assets like
`.glb` files correctly.