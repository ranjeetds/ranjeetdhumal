# Three.js figures

Placeholder — no Three.js figures exist yet, and Three.js is deliberately not installed.

When the first one is built:

1. Install `three` (and `@types/three`). It is large, so it must never reach a page that
   does not show a 3D figure.
2. Write it as a React component in this folder that creates its renderer in an effect
   and disposes of geometries, materials and the renderer on unmount.
3. Register it in `../Viz.astro` with `client:visible` so the bundle is fetched only when
   the figure scrolls into view. WebGL cannot be server-rendered: give the component a
   static poster (an image or SVG) to show until it hydrates and when WebGL is unavailable.
4. Pause the render loop when the canvas is off-screen or the tab is hidden, and render a
   single still frame when the reader prefers reduced motion.
5. Add it to `../registry.ts`.
