# Temporary Hero Design QA

- Source visual truth: `https://ashfall.studio/`
- Source desktop capture: `E:\Jithu_portfolio\audit\ashfall-source-desktop.png`
- Implementation desktop capture: `E:\Jithu_portfolio\audit\hero-temp-local-1425x900.png`
- Combined comparison: `E:\Jithu_portfolio\audit\hero-temp-comparison.png`
- Implementation mobile capture: `E:\Jithu_portfolio\audit\hero-temp-local-mobile-390x844.png`
- Desktop viewport: source and implementation normalized to approximately 1425 x 900 CSS pixels at device scale factor 1.
- Mobile viewport: 390 x 844 CSS pixels at device scale factor 1.
- State: initial loaded hero; desktop pointer response and primary anchor navigation also tested.

## Full-view comparison evidence

The implementation preserves the reference hero's main design language: full-viewport monochrome media, compact three-zone utility navigation, restrained low-contrast UI, centered oversized sans-serif statement, bottom-center scroll cue, and lower-right media card. The portrait, copy, red accent, typography, and destination links intentionally use Jithu's local brand content rather than Ashfall assets.

## Focused comparison evidence

The navigation, centered headline, image crop, and lower-right media card were readable in the normalized full-view comparison. A separate focused crop was not required. Mobile was checked independently at 390 x 844: title, contact control, portrait crop, and media card remain visible with no horizontal overflow.

## Comparison history

1. Initial implementation: GSAP transforms replaced the CSS centering transform, pushing the title to the right and clipping it. Result blocked.
2. Fix: changed the content to inset-based automatic centering so GSAP can own runtime transforms without affecting layout. Post-fix captures show a centered, fully visible title on desktop and mobile. Result passed.

## Fidelity surfaces

- Fonts and typography: local Inter is used for the Ashfall-like neutral grotesk treatment; compact tracking and low-contrast hierarchy match the reference language. Copy is intentionally portfolio-specific.
- Spacing and layout rhythm: full-screen media, top utility grid, centered statement, bottom scroll cue, and lower-right media card follow the reference proportions.
- Colors and visual tokens: monochrome image treatment, charcoal shading, translucent white type, and a portfolio red accent are consistent and accessible over the media.
- Image quality and asset fidelity: only existing local portrait and thumbnail assets are used. No Ashfall imagery is copied or hotlinked.
- Copy and content: all visible text, links, email destination, and labels are customized for Jithu.

## Interaction checks

- Intro timeline loads without console errors.
- Fine-pointer parallax changes both image and title transforms.
- View Work navigates to `#projects-title`.
- Brand link returns to `#top`.
- Reduced-motion and touch fallbacks are present.

## Findings

No actionable P0, P1, or P2 issues remain. The visual differences in subject imagery, copy, accent color, and exact typeface are intentional adaptations rather than cloning drift.

final result: passed

## Kern hover reveal QA — 2026-08-14

- Interaction reference: `https://kern-template.framer.website/`
- Scope: hero pointer reveal only; the portfolio layout, content, and local imagery remain unchanged.
- Replaced the former 2D blurred-circle approximation with the reference's half-resolution WebGL fluid structure: velocity and density splats, velocity advection, curl, divergence, a 25-pass pressure solve, pressure-gradient subtraction, density decay, and simplex-noise edge thresholding.
- Matched the reference defaults used by its published component: `.08` splat radius, `.99` velocity dissipation, `2.4s` density return, `30` curl, `25` pressure iterations, `2.6` circle boost, and `.08` progress interpolation.
- Compared live hover states at the same desktop viewport. The reveal now grows continuously at rest, stretches along cursor motion, retains an irregular liquid edge, and retracts through the density field rather than fading a painted canvas blob.
- Local images and locally stored Three.js are used; no source asset is hotlinked.
- JavaScript syntax checks pass and the tested hover state produces no browser console warnings or errors.

final result: passed
# Waitlist Redesign QA — 2026-08-15

- Source: `C:\Users\jithu\Downloads\ChatGPT Image Aug 15, 2026, 07_33_46 PM.png`
- Verified state: final black waitlist reveal at desktop viewport
- Composition: passed — split portrait/content panel, rounded frame, stat cards, headline, CTAs, feature card, capability row
- Responsive behavior: passed — desktop height compaction and single-column mobile layout included
- Interaction: passed — original circular scroll reveal retained; waitlist cursor trail removed; CTA links remain functional
- Console: passed — no browser errors
- Final result: passed

# FAQ Section QA — 2026-08-15

- Source: `C:\Users\jithu\Downloads\ChatGPT Image Aug 15, 2026, 09_19_57 PM.png`
- Verified state: desktop initial state with first question expanded
- Composition: passed — editorial header, black and red title, asymmetric two-column cards, timing summary and centered support CTA
- Interaction: passed — one item opens at a time, icon state and ARIA state update together, answers animate without page errors
- Responsive behavior: passed — accordion collapses to one column and timing details stack on mobile
- Console: passed — no browser errors
- Final result: passed

# Hero Minimal QA — 2026-08-16

- Source: `C:\Users\jithu\Downloads\hero-sec.png`
- Assets: `images/hero-bg.png`, `images/hero-portrait.png`
- Verified state: initial desktop hero at a wide 16:9 viewport
- Composition: passed — upper-left brand, full-width background title, foreground portrait and lower-right role match the reference hierarchy
- Layering: passed — background, typography and transparent portrait are independent responsive layers
- Geometry: passed — portrait is bottom anchored, title remains inside the viewport and horizontal overflow is zero
- Responsive behavior: passed — portrait, type scale and crop adapt at tablet and mobile breakpoints
- Console: passed — no browser errors
- Final result: passed
