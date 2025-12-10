gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 0.8,
  effects: true,
  smoothTouch: 0.5,
  normalizeScroll: false,
});
