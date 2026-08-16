# Lusion vs Local WebGL Audit

Date: 2026-08-11

## Audit scope
Desktop projects grid at 1280 x 720, normalized with the first project image at x=64, y=307, width=563, height=367. Compared default and pointer-hover states.

## User goal
Make the local project-card depth interaction feel like Lusion's original without reintroducing a spotlight.

## Accepted evidence
1. `01-original-default.png` - Lusion default state.
2. `02-original-hover.png` - Lusion pointer at 80% x / 45% y on Oryzo AI.
3. `05-local-aligned-default.png` - local default state aligned to the same card rectangle.
4. `06-local-aligned-hover.png` - local pointer at the same normalized position.
5. `07-side-by-side-default.png` - normalized full-view comparison.
6. `original-hover-diff.png` and `local-hover-diff.png` - amplified hover deltas.

## Strengths
- Card geometry matches closely: the normalized local media is 563 x 366.8 px, matching the source's approximately 563 x 367 px.
- Crops, corner radii, two-column grid, background, and header scale are close.
- The local WebGL canvas loads all 10 projects without console warnings or errors.
- The static fallback remains available.

## Findings

### P1 - Local hover produces no captured pixel change
Evidence: source default-to-hover mean absolute RGB delta is approximately (0.855, 0.825, 0.898). The aligned local default-to-hover delta is exactly (0, 0, 0), with an empty difference bounding box.
Impact: the central interaction is effectively absent in the verified state, which explains why the page feels static or wrong.
Likely cause: the card-local pointer state is not reaching the shader render path reliably. The current listeners are attached to each media element rather than using the global pointer plus canvas/card hit-testing architecture used by Lusion.
Fix: drive a global pointer target, determine the active card from its rectangle, and update the active mesh uniforms from that shared state.

### P1 - Distortion model does not match the source
Evidence: the source amplified difference shows sparse edge displacement across the whole image. The local fragment shader instead computes a radial vector from every UV to the pointer, applies a circular falloff, and uses signed `depth - 0.5`.
Impact: when active, the local shader behaves like localized lensing/warping rather than Lusion's subtle layered parallax.
Fix: use pointer movement/velocity as one global directional vector. Multiply that vector by normalized inverse depth and a small eased hover amount. Remove radial distance falloff.

### P2 - Depth polarity is likely inverted and centered incorrectly
Evidence: `home_depth.webp` stores near foreground surfaces as dark and distant background as white. The current shader treats values below and above 0.5 as opposite directions.
Impact: foreground and background can tear in opposing directions instead of separating naturally along one motion vector.
Fix: use `1.0 - depth` (or an artist-tuned remap) as a non-negative displacement magnitude.

### P2 - Scrolling behavior changes the perceived composition
Evidence: the same 300 px wheel delta placed Lusion's card at y=307 but the native local page at y=205. Lusion uses eased virtual scrolling.
Impact: even with matching static geometry, the page's motion and pacing feel different.
Fix: optional smooth-scroll interpolation can be added separately. This is secondary to fixing the hover shader.

### P3 - Static image rendering differs slightly
Evidence: normalized source/local first-card mean RGB values are close, but per-pixel mean absolute difference is around 15, indicating small sampling/crop/color differences.
Impact: visible mainly in direct comparison, not a functional blocker.
Fix: confirm source texture sampling, color conversion, and exact UV cover transform after the hover model is corrected.

## Accessibility risks
- Motion has a reduced-motion fallback, which is good.
- Pointer-only depth motion is decorative and does not block card activation.
- Keyboard focus styling is not visibly distinct in the screenshots and needs a separate keyboard test.

## Recommended implementation order
1. Replace per-card pointer listeners with a single global pointer/velocity tracker.
2. Select the active card by bounding rectangle.
3. Change the shader to directional inverse-depth displacement without radial falloff.
4. Tune to the source's subtle strength and easing.
5. Re-capture and measure default/hover delta.
6. Consider smooth scrolling only after the hover matches.

## Evidence limits
The audit verifies captured visual states and console output. It does not prove keyboard or assistive-technology behavior.

Final health
1. Original default: Healthy.
2. Original hover: Healthy and subtle.
3. Local default: Visually close.
4. Local hover: Unhealthy; no captured visual response.

