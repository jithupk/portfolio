gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
$(document).ready(function () {
  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    smoothTouch: false,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  $(window).on("resize", function () {
    lenis.resize();
    ScrollTrigger.refresh();
  });
  $(".open-modal").on("click", function () {
    lenis.stop();
  });

  $(".close-modal").on("click", function () {
    lenis.start();
  });
//   optional
//   if ($(window).width() < 768) {
//     lenis.destroy();
//   }
});
