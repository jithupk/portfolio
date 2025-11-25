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
