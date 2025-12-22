$(document).ready(function () {
  const testimonialSwiper = new Swiper(".testimonial-slider", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 600,
    // autoplay: {
    //   delay: 2000,
    //   disableOnInteraction: false,
    // },

    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true,
    // },

    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },

    breakpoints: {
      768: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      992: {
        slidesPerView: 1,
        spaceBetween: 0,
      },
      //   1200: {
      //     slidesPerView: 3,
      //     spaceBetween: 30,
      //   }
    },
  });
});

// $(document).ready(function () {
//   var slide = document.querySelector(".new-testimonial-slider .swiper-slide-next");
//   const authorText = slide?.querySelector(".auther-info p")?.textContent;
//   console.log(authorText);
// });

// const newTestimonialSlider = new Swiper(".new-testimonial-slider", {
//   slidesPerView: 3,
//   spaceBetween: 24,
//   loop: true,
//   grabCursor: true,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//     renderBullet: function (index, className) {
//       return `<div class="${className}"><img src="images/thumb-${
//         index + 1
//       }.jpg" /><span>${authorText}</span></div>`;
//     },
//   },
// });

$(document).ready(function () {
  const newTestimonialSlider = new Swiper(".new-testimonial-slider", {
    slidesPerView: 3,
    spaceBetween: 24,
    loop: true,
    grabCursor: true,
    centeredSlides: true,
    slideToClickedSlide: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        const slide = document.querySelector(
          `.new-testimonial-slider .swiper-slide[data-swiper-slide-index="${index}"]`
        );
        const author =
          slide?.querySelector(".auther-info p")?.textContent ?? "";

        return `
        <div class="${className}">
          <img src="images/thumb-${index + 1}.png" />
          <span>${author}</span>
        </div>`;
      },
    },
  });
});

// const newTestimonialSlider = new Swiper(".new-testimonial-slider", {
//   slidesPerView: 3,
//   spaceBetween: 24,
//   loop: true,
//   grabCursor: true,
//   pagination: {
//     el: ".swiper-pagination",
//     clickable: true,
//     renderBullet: function (index, className) {
//       return `<div class="${className}">
//         <img src="images/thumb-${index + 1}.jpg" />
//         <span class="bullet-author"></span>
//       </div>`;
//     },
//   },
//   on: {
//     init: updateBulletAuthors,
//     slideChange: updateBulletAuthors,
//     breakpoint: updateBulletAuthors,
//   }
// });

// function updateBulletAuthors() {
//   const bullets = document.querySelectorAll(".swiper-pagination .swiper-pagination-bullet");
//   bullets.forEach((bullet, i) => {
//     const slide = document.querySelector(
//       `.new-testimonial-slider .swiper-slide[data-swiper-slide-index="${i}"]`
//     );
//     const author = slide?.querySelector(".auther-info p")?.textContent ?? "";
//     const span = bullet.querySelector(".bullet-author");
//     if (span) span.textContent = author;
//   });
// }
