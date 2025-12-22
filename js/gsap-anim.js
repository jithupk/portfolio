gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 0.8,
  effects: true,
  smoothTouch: 0.5,
  normalizeScroll: false,
});

// function increaseSizePerScroll({
//   section,
//   element,
//   startSize = 300
// }) {
//   gsap.set(element, {
//     width: startSize,
//     height: startSize
//   });

//   ScrollTrigger.create({
//     trigger: section,
//     start: "top top",
//     end: "bottom 50%",
//     onUpdate: self => {
//       const scrollPx = self.scroll() - self.start;

//       const size = startSize + Math.max(0, Math.round(scrollPx));

//       gsap.set(element, {
//         width: size,
//         height: size
//       });
//     }
//   });
// }

// increaseSizePerScroll({
//   section: ".gtn",
//   element: ".hsc-img-w",
//   startSize: 300
// });
//  const gsapWithCSS = gsap;

// function logoRevealScroll() {
//   const triggers2 = [];
//   const scaleTrigger = gsapWithCSS.to("[hsc-scale]", {
//     scale: 29,
//     scrollTrigger: {
//       trigger: "[hsc-track]",
//       scrub: true,
//       start: "top top",
//       end: "bottom top",
//     },
//   });
//   triggers2.push(scaleTrigger);
//   const fixImgTrigger = gsapWithCSS.to("[hsc-img]", {
//     width: "20.5em",
//     height: "20.5em",
//     scrollTrigger: {
//       trigger: "[hsc-track]",
//       scrub: true,
//       start: "top top",
//       end: "bottom top",
//     },
//   });
//   triggers2.push(fixImgTrigger);
//   const rotateTrigger = gsapWithCSS.to("[hsc-rotate]", {
//     rotation: 180,
//     scrollTrigger: {
//       trigger: "[hsc-track]",
//       scrub: true,
//       start: "top top",
//       end: "bottom top",
//     },
//   });
//   triggers2.push(rotateTrigger);
//   const textAnim = gsapWithCSS.fromTo(
//     "[hsc-text]",
//     { x: "50vw" },
//     {
//       x: "0vw",
//       scrollTrigger: {
//         trigger: "[hsc-track]",
//         scrub: true,
//         start: "top top",
//         end: "bottom-=100 bottom",
//       },
//     }
//   );
//   triggers2.push(textAnim);
//   const sectionScale = ScrollTrigger2.create({
//     trigger: "[hsc-track]",
//     scrub: true,
//     start: "bottom center",
//     end: "bottom top",
//     onUpdate: (self) => {
//       gsapWithCSS.to(".s.is-hsc", {
//         scale: 1 - 0.1 * self.progress,
//         boxShadow: `0 0 0 ${1.5 * self.progress}px var(--light-grey)`,
//       });
//     },
//   });
//   triggers2.push(sectionScale);
//   const imgScaleAnim = gsapWithCSS.fromTo(
//     "[hsc-img]",
//     {
//       scale: 0,
//       rotation: 0,
//     },
//     {
//       scale: 1,
//       rotation: 45,
//       scrollTrigger: {
//         trigger: "[hsc-track]",
//         scrub: true,
//         start: "top center",
//         end: "top top",
//       },
//     }
//   );
//   triggers2.push(imgScaleAnim);
//   const wordElements = gsapWithCSS.utils.toArray("[hsc-track] .word");
//   wordElements.forEach((el, index) => {
//     const isEven = index % 2 === 0;
//     const yPercentValue = isEven ? -101 : 101;
//     gsapWithCSS.fromTo(
//       el,
//       {
//         yPercent: 0,
//       },
//       {
//         yPercent: yPercentValue,
//         scrollTrigger: {
//           trigger: "[hsc-track]",
//           scrub: true,
//           start: "bottom bottom-=100",
//           end: "bottom center-=100",
//         },
//       }
//     );
//   });
//   const textAnimDown = gsapWithCSS.fromTo(
//     "[hsc-text]",
//     {
//       y: "0vh",
//     },
//     {
//       y: "20vh",
//       scrollTrigger: {
//         trigger: "[hsc-track]",
//         scrub: true,
//         start: "bottom bottom",
//         end: "bottom+=100 center",
//       },
//     }
//   );
//   triggers2.push(textAnimDown);
//   return {
//     destroy: () => {
//       triggers2.forEach((trigger) => {
//         if (trigger && trigger.scrollTrigger) {
//           trigger.scrollTrigger.kill();
//         }
//         trigger.kill();
//       });
//     },
//   };
// }
// function initializeLogoReveal() {
//   logoReveal = logoRevealScroll();
// }

//  logoRevealScroll();

gsap.to("[hsc-scale]", {
  scale: 29,
  scrollTrigger: {
    trigger: "[hsc-track]",
    scrub: true,
    start: "top top",
    end: "bottom top",
  },
});
gsap.to("[hsc-img]", {
  width: "20.5em",
  height: "20.5em",
  scrollTrigger: {
    trigger: "[hsc-track]",
    scrub: true,
    start: "top top",
    end: "bottom top",
  },
});
gsap.to("[hsc-rotate]", {
  rotation: 180,
  scrollTrigger: {
    trigger: "[hsc-track]",
    scrub: true,
    start: "top top",
    end: "bottom top",
  },
});
gsap.fromTo(
  "[hsc-img]",
  {
    scale: 0,
    rotation: 0,
  },
  {
    scale: 1.5,
    rotation: 45,
    scrollTrigger: {
      trigger: "[hsc-track]",
      scrub: true,
      start: "top center",
      end: "top top",
    },
  }
);

ScrollTrigger.create({
  trigger: ".sec",
  start: "top top",
  end: "bottom top",
  pin: ".hsc-overlay-w",
  pinSpacing: false,
});

gsap.fromTo(
  ".hsc-btn",
  {
    opacity: 0,
    y: 50,
  },
  {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: "[hsc-track]",
      scrub: true,
      start: "top -50%",
      end: "top top",
    },
  }
);



// =====================
// ScrollTrigger.create({
//   trigger: ".video-hl",
//   start: "top top",
//   end: "bottom top",
//   pin: ".sticky-elem",
//   pinSpacing: false,
// });

// gsap.fromTo(
//   ".zoom-img",
//   {
//     scale: 0,
//     x: "1.5rem",
//     xPercent: -50,
//     yPercent: -50,
//   },
//   {
//     scale: 1,
//     x: 0,
//     scrollTrigger: {
//       trigger: ".video-hl",
//       scrub: true,
//       start: "top top",
//       end: "bottom bottom",
//     },
//   }
// );

// gsap.timeline({
//   scrollTrigger: {
//     trigger: ".video-hl",
//     start: "top top",
//     end: "bottom bottom",
//     scrub: true,
//     pin: ".sticky-elem",
//     pinSpacing: false,
//   }
// })
// gsap.fromTo(
//   ".zoom-img",
//   {
//     scale: 0,
//     x: "1.5rem",
//     xPercent: -50,
//     yPercent: -50,
//   },
//   {
//     scale: 1,
//     x: 0,
//     scrollTrigger: {
//       trigger: ".video-hl",
//       scrub: true,
//       start: "top top",
//       end: "bottom bottom",
//     },
//   }
// );

gsap.timeline({
  scrollTrigger: {
    trigger: ".video-hl",
    start: "top 0%",
    end: "bottom 100%",
    scrub: true,
    pin: ".sticky-elem",
    pinSpacing: false,
  },
});


gsap.fromTo(
  ".zoom-img",
  {
    scale: 0,
    x: "1.5rem",
    xPercent: -50,
    yPercent: -50,
  },
  {
    scale: 1,
    x: 0,
    scrollTrigger: {
      trigger: ".video-hl",
      scrub: true,
      start: "top top",
      end: "bottom bottom",
    },
  }
);

gsap.to(".video-hl", {
  "--p2": 1,
  scrollTrigger: {
    trigger: ".video-hl",
    scrub: true,
    start: "top top",
    end: "bottom top",
  },
});

gsap.fromTo(
  ".t-h1",
  {
    // x: "100%",
    y: "-400px"
  },
  {
    scale: 1,
    x: 0,
    y: 0,
    scrollTrigger: {
      trigger: ".video-hl",
      scrub: true,
      start: "top 80%",
      end: "top top",
    },
  }
);


gsap.fromTo(
  ".home_photos_images-layout",
  {
    scale: 3.2,
    x: 0,
    y: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    skewX: 0,
    skewY: 0,
    force3D: true,
    willChange: "transform",
    transformStyle: "preserve-3d",
  },
  {
    scale: 1,
    x: 0,
    y: 0,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    skewX: 0,
    skewY: 0,
    scrollTrigger: {
      trigger: ".section_home-photos",
      scrub: true,
      start: "top top",
      end: "bottom bottom",
    },
  }
);

ScrollTrigger.create({
  trigger: ".section_home-photos",
  start: "top top",
  end: "bottom top",
  pin: ".home_photos_content-wrapper",
  pinSpacing: false,
});

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".home-banner",
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: true,
      pinSpacing: false,
    },
  })
  .to(".bg-img", {
    scale: 1.1,
  });

gsap.fromTo(
  ".image-overlay-layer",
  {
    opacity: 1,
  },
  {
    opacity: 0,
    scrollTrigger: {
      trigger: ".section_home-photos",
      scrub: true,
      start: "top top",
      end: "bottom bottom",
    },
  }
);
