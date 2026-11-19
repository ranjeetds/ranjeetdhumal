# D3 figures

Placeholder — no D3 figures exist yet, and D3 is deliberately not installed.

When the first one is built:

1. Install only the modules it needs (`d3-scale`, `d3-shape`, …) rather than the `d3` bundle.
2. Write it as a React component in this folder. Let React own the DOM; use D3 for the
   maths (scales, layouts, path generators), not for `select().append()`.
3. Follow `../svg/GradientDescent.tsx`: complete server render, reduced-motion support,
   and a keyboard equivalent for any pointer interaction.
4. Add it to `../registry.ts` and register it in `../Viz.astro` with `client:visible`.
