const items = document.querySelectorAll(".service-marquee__item");
let pos = 0; // starting position in %
let direction = 1; // 1 = moving up, -1 = moving down
const speed = 0.8; // % per frame, adjust speed
function animate() {
  pos += speed * direction;
  // reverse direction at top and bottom
  if (pos >= 300) {
    // matches your original -300% in CSS
    pos = 300;
    direction = -1;
  } else if (pos <= 0) {
    pos = 0;
    direction = 1;
  }
  items.forEach((item) => {
    item.style.transform = `translateY(${-pos}%)`;
  });
  requestAnimationFrame(animate);
}
animate();


$(document).ready(function () {
  var logosSwiper = new Swiper(".partners-slider", {
    slidesPerView: 2,
    spaceBetween: 30,
    loop: true,
    speed: 7000,
    grabCursor: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    freeMode: true, // linear, smooth scrolling
    freeModeMomentum: false, // remove easing/momentum
    breakpoints: {
      480: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});

$(document).ready(function () {
  var techSwiper = new Swiper(".tech-slider", {
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    speed: 9000,
    grabCursor: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
    },
    freeMode: true, // linear, smooth scrolling
    freeModeMomentum: false, // remove easing/momentum
    breakpoints: {
      480: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
    },
  });
});



let lastScroll = 0;

function handleHeaderScroll() {
  const header = document.querySelector("header");
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    // At the very top
    header.classList.remove("hidden");
    header.classList.remove("visible");
    return;
  }

  if (currentScroll > lastScroll) {
    // Scrolling down
    header.classList.add("hidden");
    header.classList.remove("visible");
  } else {
    // Scrolling up
    header.classList.add("visible");
    header.classList.remove("hidden");
  }

  lastScroll = currentScroll;
}

window.addEventListener("scroll", handleHeaderScroll);




// let lastScroll = 0;
// let ticking = false;

// $(window).on('scroll', function () {
//   if (!ticking) {
//     window.requestAnimationFrame(function () {
//       const $header = $('header');
//       const $inner = $header.find('.header-wrapper');
//       const currentScroll = $(window).scrollTop();

//       if (currentScroll <= 0) {
//         $header.removeClass('hidden visible');
//          $inner.animate({ width: '100%' }, 300);
//       } else if (currentScroll > lastScroll) {
//         $header.addClass('hidden').removeClass('visible');
//         $inner.animate({ width: '200px' }, 300);
//       } else {
//         $header.addClass('visible').removeClass('hidden');
//          $inner.animate({ width: '200px' }, 300);
//       }

//       lastScroll = Math.max(0, currentScroll);
//       ticking = false;
//     });
//     ticking = true;
//   }
// });


// let lastScroll = 0;
// let ticking = false;

// const EXPANDED_WIDTH = "100%";
// const SHRINK_WIDTH = "200px"; 
// const ANIM_DURATION = 360;

// $(window).on('scroll', function () {
//   if (!ticking) {
//     window.requestAnimationFrame(function () {
//       const $header = $('header');
//       const $inner = $header.find('.container');
//       const currentScroll = $(window).scrollTop();

//       if (currentScroll <= 0) {
//         $header.removeClass('hidden visible shrink');
//         $inner.stop(true, false).animate({ width: EXPANDED_WIDTH }, ANIM_DURATION);
//       } else if (currentScroll > lastScroll) {
//         $header.addClass('hidden shrink').removeClass('visible');
//         $inner.stop(true, false).animate({ width: SHRINK_WIDTH }, ANIM_DURATION);
//       } else {
//         $header.addClass('visible').removeClass('hidden shrink');
//         $inner.stop(true, false).animate({ width: EXPANDED_WIDTH }, ANIM_DURATION);
//       }

//       lastScroll = Math.max(0, currentScroll);
//       ticking = false;
//     });
//     ticking = true;
//   }
// });
