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


$(document).ready(function () {
  $(".btn-primary, .btn-secondary, .btn-dark").each(function () {
    const text = $(this).text().trim();
    $(this).html(
      `<div class="button_text-wrapper"><div class="button_text">${text} </div></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 12" fill="none" class="button_square-arrow-icon is-relative" style="transform: translate3d(0em, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg); transform-style: preserve-3d;"><path d="M13.0306 6.53025L8.53063 11.0302C8.38973 11.1711 8.19863 11.2503 7.99938 11.2503C7.80012 11.2503 7.60902 11.1711 7.46813 11.0302C7.32723 10.8894 7.24807 10.6983 7.24807 10.499C7.24807 10.2997 7.32723 10.1086 7.46813 9.96775L10.6875 6.74962H1.5C1.30109 6.74962 1.11032 6.6706 0.96967 6.52995C0.829018 6.3893 0.75 6.19853 0.75 5.99962C0.75 5.80071 0.829018 5.60994 0.96967 5.46929C1.11032 5.32864 1.30109 5.24962 1.5 5.24962H10.6875L7.46937 2.02962C7.32848 1.88873 7.24932 1.69763 7.24932 1.49837C7.24932 1.29911 7.32848 1.10802 7.46937 0.967121C7.61027 0.826225 7.80137 0.74707 8.00062 0.74707C8.19988 0.74707 8.39098 0.826225 8.53187 0.967121L13.0319 5.46712C13.1018 5.53689 13.1573 5.61979 13.1951 5.71106C13.2329 5.80232 13.2523 5.90016 13.2522 5.99894C13.252 6.09773 13.2324 6.19552 13.1944 6.28669C13.1564 6.37787 13.1007 6.46064 13.0306 6.53025Z" fill="currentColor"></path></svg>
      `
    );
  });
});




$(window).on("scroll load", function () {
  const $section = $(".home-banner"); // change selector
  const header = document.querySelector("header");
  const sectionTop = $section.offset().top;
  const sectionBottom = sectionTop + $section.outerHeight();
  const scrollTop = $(window).scrollTop();
  // distance from section bottom to top of window
  const distance = sectionBottom - scrollTop;

  if (distance <= 10) {
    console.log("Section bottom is exactly 10px from top of window");
    // your action here
    
    header.classList.remove("glass");
    // header.classList.remove("glass");
  }
  else{
    header.classList.add("glass");
  }
});


$(document).ready(function () {
    const $track = $('.brand-marquee__track');
    const $wrap = $('.brand-marquee__track-wrap');
    // Duplicate the track 2 times
    for (let i = 0; i < 2; i++) {
        const $clone = $track.clone();
        $wrap.append($clone);
    }
});
