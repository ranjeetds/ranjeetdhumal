/**
 * Generates `public/og.png`, the default social sharing image (1200 × 630).
 *
 * It draws the homepage figure — the loss surface and two descents — from the same
 * modules the site uses. It contains no text, so it does not depend on installed fonts.
 * The result is committed; re-run only when the surface or the palette changes:
 *
 *   npm run og
 *
 * `sharp` is resolved from Astro's dependencies rather than declared by this project,
 * because nothing at build time or runtime needs it.
 */

import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import {
  type Point,
  contourLines,
  extent,
  sampleGrid,
  simplify,
  toPathData,
} from '../src/lib/viz/contours.ts';
import { DOMAIN, descend, loss } from '../src/lib/viz/loss-surface.ts';

const WIDTH = 1200;
const HEIGHT = 630;

// Dark-theme tokens from src/styles/global.css, as sRGB.
const CANVAS = '#0a0d13';
const INK = '#f3f0ea';
const ACCENT = '#f7bc57';

// Keep the horizontal extent of the figure and crop vertically to the image's aspect ratio.
const xRange = DOMAIN.x;
const halfHeight = ((xRange[1] - xRange[0]) * HEIGHT) / WIDTH / 2;
const yRange = [halfHeight, -halfHeight] as const;

const toImage = ([x, y]: Point): Point => [
  ((x - xRange[0]) / (xRange[1] - xRange[0])) * WIDTH,
  ((yRange[0] - y) / (yRange[0] - yRange[1])) * HEIGHT,
];

const cols = 201;
const rows = 106;
const grid = sampleGrid(loss, xRange, yRange, cols, rows);
const [min, max] = extent(grid);

const levels = 16;
const contours = Array.from({ length: levels }, (_, i) => {
  const height = (i + 1) / (levels + 1);
  const lines = contourLines(grid, min + (max - min) * height).map((line) =>
    simplify(
      line.map(([col, row]): Point => [(col * WIDTH) / (cols - 1), (row * HEIGHT) / (rows - 1)]),
      0.3,
    ),
  );
  const opacity = (0.1 + 0.42 * (1 - height) ** 1.6).toFixed(3);
  return `<path d="${toPathData(lines)}" stroke-opacity="${opacity}"/>`;
});

const starts: Point[] = [
  [-2.55, -1.4],
  [2.55, 1.45],
];

const runs = starts.map((start, i) => {
  const points = descend(start).points.map(toImage);
  const [startX, startY] = points[0] as Point;
  const [endX, endY] = points.at(-1) as Point;
  const opacity = i === 0 ? 0.45 : 1;
  return `
    <g opacity="${opacity}">
      <circle cx="${endX}" cy="${endY}" r="150" fill="url(#glow)"/>
      <path d="${toPathData([points])}" fill="none" stroke="${ACCENT}" stroke-width="3.5"
            stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${startX}" cy="${startY}" r="7" fill="${CANVAS}" stroke="${INK}" stroke-opacity="0.7" stroke-width="2"/>
      <circle cx="${endX}" cy="${endY}" r="20" fill="${ACCENT}" fill-opacity="0.2"/>
      <circle cx="${endX}" cy="${endY}" r="8" fill="${ACCENT}"/>
    </g>`;
});

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.2"/>
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${CANVAS}"/>
  <g fill="none" stroke="${INK}" stroke-width="1.5">${contours.join('')}</g>
  ${runs.join('')}
</svg>`;

const output = new URL('../public/og.png', import.meta.url);
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
await writeFile(output, png);
console.log(`Wrote public/og.png (${WIDTH}×${HEIGHT}, ${(png.length / 1024).toFixed(1)} kB)`);
