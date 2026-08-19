# Design QA — My Approach

- Source visual truth: `qa/approach-reference.png`
- Implementation screenshots: `qa/approach-mobile.png`, `qa/approach-desktop.png`
- Source pixels: 552 × 346
- Mobile implementation pixels / CSS viewport: 390 × 844 at device scale 1
- Desktop implementation pixels: 1261 × 1000; browser viewport override 1440 × 1000
- State: `parallax-circle-reveal` final white layer visible; mobile static layout
- Density normalization: visual proportions were compared at CSS scale; the reference is a cropped composition while the implementation screenshots include the surrounding section.

## Full-view comparison evidence

The implementation preserves the section's existing split portrait layout while integrating the reference hierarchy into the white content column. On mobile, the content flows as bio → approach statement → CTA → portrait without horizontal overflow (`scrollWidth: 390` at a `390px` viewport). Desktop retains the two-column reveal and the approach remains within the left column.

## Focused-region comparison evidence

The focused approach region matches the source's defining surfaces: vertical “My Approach” label with red rule, three condensed uppercase statements, red “Move.” emphasis, compact discipline tags with red separators, and pale contour artwork concentrated behind the right side. The existing Phudu display face is used consistently with the site rather than introducing a mismatched font.

## Required fidelity surfaces

- Fonts and typography: Passed. Condensed display hierarchy, uppercase treatment, line height, red emphasis, and compact tag typography match the reference direction.
- Spacing and layout rhythm: Passed. Bio-to-approach spacing, vertical label gutter, three-line rhythm, tag spacing, and CTA separation are balanced at mobile and desktop.
- Colors and visual tokens: Passed. Existing black, white, and site red are used consistently; contour lines stay intentionally subtle.
- Image quality and asset fidelity: Passed after replacing the first generated contour asset. The final project asset has a clean white background with delicate gray linework and no checker artifact.
- Copy and content: Passed. Bio copy matches the supplied reference, and the approach statement/tags reproduce the requested content structure.

## Comparison history

1. Initial pass — blocked: generated contour artwork contained a visible checker pattern and was too faint in-browser.
2. Fix: regenerated the contour artwork on a clean pure-white background, replaced the project asset, increased its size/visibility, and recaptured desktop and mobile.
3. Final pass: no actionable P0, P1, or P2 differences remain. Mobile has no horizontal overflow, the contour asset loads, glass rain is hidden on mobile, and the browser console reports no errors.

## Interaction checks

- Primary CTA remains a valid mail link.
- Mobile parallax remains disabled.
- Mobile glass-rain decoration remains hidden.
- No browser console errors were found.

Focused-region evidence was required because the source is a cropped design detail rather than a complete page viewport.

final result: passed

## Static hosting and direct-file compatibility — 2026-08-19

- Replaced browser-side Less compilation with the generated `css/style.css` bundle.
- Converted compiled absolute development asset URLs back to portable relative URLs.
- Converted `js/main.js` into a classic-script-compatible entry. Lenis, navigation, FAQ, GSAP, and the remaining site interactions now run under `file://`.
- HTTP/HTTPS dynamically imports the Three.js WebGL renderer; direct `file://` safely skips only that module graph, displays project card images, and suppresses the unavailable WebGL canvas.
- Static-host verification: full page height `9089.39px`, hero `1280 × 720px`, WebGL canvas initialized, no runtime Less links, and no browser console errors.
- Direct `file://` browser capture was unavailable because the controlled browser blocks local-file navigation. Source inspection confirms it no longer initiates either failing request shown in the supplied console screenshot.

final result: passed

## Telescope button interaction test — 2026-08-19

- Source visual truth: live `https://telescope.fyi/` Sign Up button, captured at desktop and `390 × 844` mobile.
- Local implementation: `test.html`, verified at `http://127.0.0.1:4173/test.html`.
- Source interaction evidence: lime-to-black fill transition uses `.4s cubic-bezier(.55, 0, .1, 1)`; the background path vertically overshoots, compresses, rebounds, and settles over approximately `520ms`; characters rise about `7px` in a staggered wave.
- Local comparison: reproduced the measured path states, timing curve, fill/text color inversion, and per-character wave using only inline HTML, CSS, and JavaScript.
- Responsive verification: `190 × 90px` button remains centered at `390 × 844` with `0px` horizontal overflow.
- Browser console errors: none.

final result: passed

## CTA reference refinement — 2026-08-19

- Source visual truth: `codex-clipboard-32bc2482-5fcd-427b-96a7-7e71f90880a1.png`
- Implemented the reference composition as a red rounded-rectangle mail CTA with a paper-plane lead icon, uppercase label, trailing arrow, dashed connector, and supporting message.
- Desktop verification: CTA composition is `536 × 75px`; button is `330 × 62px`; supporting copy is `13px`; horizontal overflow is `0px` at `1440 × 1000`.
- Mobile verification: CTA stacks cleanly; button is `366 × 58px`; horizontal overflow is `0px` at `390 × 844`.
- Existing approach content and surrounding section layout were preserved.

final result: passed
