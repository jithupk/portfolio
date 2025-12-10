$(document).ready(function () {
  const testimonialSwiper = new Swiper('.testimonial-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 600,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },

    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true,
    // },

    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },

    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      992: {
        slidesPerView: 2,
        spaceBetween: 0,
      },
    //   1200: {
    //     slidesPerView: 3,
    //     spaceBetween: 30,
    //   }
    }
  });
});
