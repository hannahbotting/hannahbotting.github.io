# Copilot Memory Bank

This repository is a GitHub Pages static site built with Vite, React, and Three.js.

## Project Facts

- Use `npm run build` to generate the production site.
- Use `npm run preview` to test the built output locally.
- Deployments run through GitHub Actions on push to `main`.
- GitHub Pages serves the static `dist/` output.
- Routing uses `BrowserRouter` with a `public/404.html` fallback for direct links and refreshes.
- Keep Vite `base` configured for GitHub Pages compatibility.
- The 3D scene uses React Three Fiber and Drei.

## Working Rules

- Prefer minimal, targeted changes.
- Preserve the existing Pages deployment flow.
- If changing routing, keep the 404 fallback in sync.
- If changing the 3D scene, verify the app still builds.