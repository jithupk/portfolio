gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

ScrollSmoother.create({
  smooth: 0.8,
  effects: true,
  smoothTouch: 0.5,
  normalizeScroll: false,
});


// gsap.set(".is-hsc", {
//   scale: 0,
// });

// gsap.to(".is-hsc", {
//   scale: 10,
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".gtn",
//     start: "top 50%",
//     end: "+=200%",
//     scrub: 0.8,
//   },
// });

// gsap.to(".hsc-rotate", {
//   rotate: 90,
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".gtn",
//     start: "top 50%",
//     end: "+=200%",
//     scrub: 0.8,
//   },
// });

// gsap.to(".hsc-img-w", {
//   width: 300,
//   height: 300,
//   ease: "none",
//   scrollTrigger: {
//     trigger: ".gtn",
//     start: "top 50%",
//     end: "+=200%",
//     scrub: 0.8,
//   },
// });

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
