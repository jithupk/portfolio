import { initProjectWebGL } from "./webgl-projects.js?v=render-lifecycle-1";

const projects = [
  {
    slug: "oryzo_ai",
  },
  {
    slug: "of_the_oak",
  },
  {
    slug: "devin_ai",
  },
  {
    slug: "porsche_dream_machine",
  },
  {
    slug: "synthetic_human",
  },
  {
    slug: "ddd_2024",
  },
  {
    slug: "spaace",
  },
  {
    slug: "choo_choo_world",
  },
  {
    slug: "spatial_fusion",
  },
  {
    slug: "soda_experience",
  },
];


initProjectWebGL(projects).catch((error) => {
  console.error(
    "WebGL project renderer could not start; using image fallback.",
    error,
  );
  document.documentElement.classList.remove("webgl-ready");
});


// Initialize a new Lenis instance for smooth scrolling
const lenis = new Lenis();

// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
lenis.on('scroll', ScrollTrigger.update);

// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
// This ensures Lenis's smooth scroll animation updates on each GSAP tick
gsap.ticker.add((time) => {
  lenis.raf(time * 1000); // Convert time from seconds to milliseconds
});

// Disable lag smoothing in GSAP to prevent any delay in scroll animations
gsap.ticker.lagSmoothing(0);
const processSection = document.querySelector('.process');
const waitlistSection = document.querySelector('.waitlist');

const siteIsland = document.querySelector('[data-site-island]');

if (siteIsland) {
  const islandToggle = siteIsland.querySelector('.site-island__toggle');
  const islandLinks = siteIsland.querySelectorAll('.site-island__nav a');

  const setIslandOpen = (isOpen) => {
    siteIsland.classList.toggle('is-open', isOpen);
    islandToggle.setAttribute('aria-expanded', String(isOpen));
    islandToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  };

  islandToggle.addEventListener('click', () => {
    setIslandOpen(!siteIsland.classList.contains('is-open'));
  });

  islandLinks.forEach((link) => link.addEventListener('click', () => setIslandOpen(false)));
  document.addEventListener('pointerdown', (event) => {
    if (siteIsland.classList.contains('is-open') && !siteIsland.contains(event.target)) {
      setIslandOpen(false);
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setIslandOpen(false);
  });
}

if (processSection) {
  const copyGroups = [...processSection.querySelector('.process__copy').children];
  const primaryDetails = copyGroups.map((group) => group.children[0]);
  const secondaryDetails = copyGroups.map((group) => group.children[1]);
  const stepsWindow = processSection.querySelector('.process__steps-window');
  const primaryList = processSection.querySelector('.process__steps:not(.industries)');
  const secondaryList = processSection.querySelector('.process__steps.industries');
  const processMarker = processSection.querySelector('.process__marker');
  const primarySteps = [...primaryList.querySelectorAll('li')];
  const allSteps = [...stepsWindow.querySelectorAll('li')];
  const secondListStart = primarySteps.length;
  let activeStep = 0;
  let processProgress = 0;
  let secondDetailsVisible = false;

  const setDetailsMode = (showSecondDetails, immediate = false) => {
    if (!immediate && showSecondDetails === secondDetailsVisible) return;
    secondDetailsVisible = showSecondDetails;
    const duration = immediate ? 0 : .9;

    gsap.to(primaryDetails, {
      y: (_, detail) => showSecondDetails ? -detail.parentElement.offsetHeight : 0,
      duration,
      stagger: showSecondDetails ? .055 : -.055,
      ease: 'power3.inOut',
      overwrite: true,
    });
    gsap.to(secondaryDetails, {
      y: (_, detail) => showSecondDetails ? 0 : detail.parentElement.offsetHeight,
      duration,
      stagger: showSecondDetails ? .055 : -.055,
      ease: 'power3.inOut',
      overwrite: true,
    });

    primaryDetails.forEach((detail) => detail?.setAttribute('aria-hidden', showSecondDetails));
    secondaryDetails.forEach((detail) => detail?.setAttribute('aria-hidden', !showSecondDetails));
  };

  const positionProcessTrack = () => {
    const stepHeight = allSteps[0]?.getBoundingClientRect().height || 0;
    const continuousStep = processProgress * (allSteps.length - 1);

    const currentTrackY = Number(gsap.getProperty(stepsWindow, 'y')) || 0;
    const firstStepRect = allSteps[0].getBoundingClientRect();
    const markerRect = processMarker.getBoundingClientRect();
    const firstStepBaseCenter = firstStepRect.top + (firstStepRect.height / 2) - currentTrackY;
    const markerCenter = markerRect.top + (markerRect.height / 2);

    gsap.set(stepsWindow, {
      y: markerCenter - firstStepBaseCenter - (continuousStep * stepHeight),
    });

    const secondListFade = gsap.utils.clamp(0, 1, continuousStep - (secondListStart - 1));

    allSteps.forEach((step, index) => {
      const distanceFromCenter = Math.abs(continuousStep - index);
      const focus = Math.max(0, 1 - distanceFromCenter);
      const itemOpacity = Math.max(.12, 1 - (distanceFromCenter * .32));
      const red = Math.round(9 + (239 - 9) * focus);
      const green = Math.round(9 + (32 - 9) * focus);
      const blue = Math.round(9 + (41 - 9) * focus);

      gsap.set(step, {
        color: `rgb(${red}, ${green}, ${blue})`,
        opacity: index >= secondListStart ? itemOpacity * secondListFade : itemOpacity * (1 - secondListFade),
        x: focus * 24,
      });

      const number = step.querySelector('.process__number');
      if (number) {
        gsap.set(number, {
          opacity: focus,
          x: -10 + (focus * 10),
        });
      }
    });

    const nextStep = Math.min(
      allSteps.length - 1,
      Math.round(continuousStep),
    );

    if (nextStep !== activeStep) {
      allSteps[activeStep]?.classList.remove('is-active');
      allSteps[nextStep]?.classList.add('is-active');
      activeStep = nextStep;
    }

    setDetailsMode(continuousStep >= secondListStart - 1 - .02);
  };

  gsap.set(secondaryDetails, { visibility: 'visible' });
  setDetailsMode(false, true);
  positionProcessTrack();

  const updateProcessFromScroll = () => {
    const scrollStart = processSection.offsetTop;
    const processTrackDistance = window.innerHeight * (window.innerWidth <= 700 ? 2.4 : 2.8);
    const scrollDistance = Math.max(1, processTrackDistance);
    processProgress = gsap.utils.clamp(0, 1, (window.scrollY - scrollStart) / scrollDistance);
    positionProcessTrack();
  };

  window.addEventListener('scroll', updateProcessFromScroll, { passive: true });
  lenis.on('scroll', updateProcessFromScroll);
  window.addEventListener('resize', updateProcessFromScroll);
  window.addEventListener('load', updateProcessFromScroll);
  requestAnimationFrame(() => requestAnimationFrame(updateProcessFromScroll));

  if (waitlistSection && processMarker) {
    const waitlistStage = waitlistSection.querySelector('.waitlist__stage');
    const waitlistRed = waitlistSection.querySelector('.waitlist__circle--red');
    const waitlistBlack = waitlistSection.querySelector('.waitlist__circle--black');
    const waitlistWhite = waitlistSection.querySelector('.waitlist__circle--white');

    let markerOrigin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const setWaitlistOrigin = () => {
      const markerRect = processMarker.getBoundingClientRect();

      if (markerRect.top >= 0 && markerRect.bottom <= window.innerHeight) {
        markerOrigin = {
          x: markerRect.left + (markerRect.width / 2),
          y: markerRect.top + (markerRect.height / 2),
        };
      }

      waitlistStage.style.setProperty('--waitlist-origin-x', `${markerOrigin.x}px`);
      waitlistStage.style.setProperty('--waitlist-origin-y', `${markerOrigin.y}px`);
    };

    setWaitlistOrigin();

    const getMarkerRadius = () => processMarker.getBoundingClientRect().width / 2;
    const getRevealRadius = () => Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

    gsap.timeline({
      scrollTrigger: {
        trigger: waitlistSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(waitlistRed,
        { clipPath: () => `circle(${getMarkerRadius()}px at var(--waitlist-origin-x) var(--waitlist-origin-y))` },
        { clipPath: () => `circle(${getRevealRadius()}px at var(--waitlist-origin-x) var(--waitlist-origin-y))`, duration: 1, ease: 'none' })
      .fromTo(waitlistBlack,
        { clipPath: 'circle(0px at var(--waitlist-origin-x) var(--waitlist-origin-y))' },
        { clipPath: () => `circle(${getRevealRadius()}px at var(--waitlist-origin-x) var(--waitlist-origin-y))`, duration: 1, ease: 'none' }, .28)
      .fromTo(waitlistWhite,
        { clipPath: 'circle(0px at var(--waitlist-origin-x) var(--waitlist-origin-y))' },
        { clipPath: () => `circle(${getRevealRadius()}px at var(--waitlist-origin-x) var(--waitlist-origin-y))`, duration: 1, ease: 'none' }, .56);

    window.addEventListener('scroll', setWaitlistOrigin, { passive: true });
    lenis.on('scroll', setWaitlistOrigin);
    window.addEventListener('resize', setWaitlistOrigin);
  }
}

const waitlistButton = document.querySelector('.waitlist__button');

if (waitlistButton) {
  const waitlistButtonLabel = waitlistButton.querySelector('.waitlist__button-label');
  const waitlistButtonPath = waitlistButton.querySelector('.waitlist__button-shape path');
  const waitlistButtonText = 'Join Waitlist';

  waitlistButtonLabel.innerHTML = [...waitlistButtonText].map((character) => {
    const safeCharacter = character === ' ' ? '&nbsp;' : character;
    return `<span class="waitlist__button-char" data-char="${safeCharacter}">${safeCharacter}</span>`;
  }).join('');

  const waitlistButtonCharacters = [...waitlistButtonLabel.children];
  const buttonShapeRest = 'M142.5 29C180 29 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 136 142.5 136C105 136 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 29 142.5 29Z';
  const buttonShapeSwell = 'M142.5 6C180 6 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 159 142.5 159C105 159 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 6 142.5 6Z';
  const buttonShapePinch = 'M142.5 45C180 45 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 120 142.5 120C105 120 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 45 142.5 45Z';
  const buttonShapeRebound = 'M142.5 23C180 23 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 142 142.5 142C105 142 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 23 142.5 23Z';

  waitlistButton.addEventListener('mouseenter', () => {
    gsap.killTweensOf(waitlistButtonCharacters);
    gsap.to(waitlistButtonPath, { fill: '#ef160f', duration: .28, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(waitlistButtonCharacters, {
      yPercent: -100,
      duration: .48,
      stagger: .025,
      ease: 'power3.inOut',
    });
    gsap.timeline({ overwrite: true })
      .set(waitlistButtonPath, { attr: { d: buttonShapeRest }, scaleX: 1, scaleY: 1 })
      .to(waitlistButtonPath, { attr: { d: buttonShapeSwell }, duration: .15, ease: 'power2.inOut' })
      .to(waitlistButtonPath, { attr: { d: buttonShapePinch }, duration: .45, ease: 'power2.inOut' })
      .to(waitlistButtonPath, { attr: { d: buttonShapeRebound }, duration: .5, ease: 'power2.inOut' })
      .to(waitlistButtonPath, { attr: { d: buttonShapeRest }, duration: .18, ease: 'power2.out' });
  });

  waitlistButton.addEventListener('mouseleave', () => {
    gsap.to(waitlistButtonPath, { fill: '#050505', duration: .3, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(waitlistButtonCharacters, {
      yPercent: 0,
      duration: .4,
      stagger: -.018,
      ease: 'power3.inOut',
      overwrite: true,
    });
  });
}
const waitlistTrails = document.querySelectorAll('.waitlist__trail');

if (waitlistTrails.length && window.matchMedia('(pointer: fine)').matches) {
 waitlistTrails.forEach((waitlistTrail) => {
  const trailContext = waitlistTrail.getContext('2d');
  const trailButton = waitlistTrail.closest('section')?.querySelector('.waitlist__button');
  const trailSources = [
    'images/projects/oryzo_ai/home.webp',
    'images/projects/choo_choo_world/home.webp',
    'images/projects/ddd_2024/image1.webp',
    'images/projects/ddd_2024/image2.webp',
    'images/projects/ddd_2024/image3.webp',
    'images/projects/devin_ai/home.webp',
    'images/projects/porsche_dream_machine/home.webp',
    'images/projects/of_the_oak/home.webp',
    'images/projects/soda_experience/home.webp',
    'images/projects/spaace/home.webp',
    'images/projects/spatial_fusion/home.webp',
    'images/projects/synthetic_human/home.webp',
  ];
  const trailImages = trailSources.map((source) => {
    const image = new Image();
    image.decoding = 'async';
    image.src = source;
    return image;
  });
  const trailPointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    targetX: window.innerWidth / 2,
    targetY: window.innerHeight / 2,
    active: false,
    strength: 0,
  };
  const trailGrid = {};
  let trailWidth = 0;
  let trailHeight = 0;
  let trailDpr = 1;
  let trailPreviousTime = 0;
  let trailTravel = 0;
  let trailFrame = 0;
  let trailRunning = false;

  const wrapTrailPosition = (value, minimum, maximum) => {
    const range = maximum - minimum;
    return ((((value - minimum) % range) + range) % range) + minimum;
  };

  const resizeTrailCanvas = () => {
    const bounds = waitlistTrail.getBoundingClientRect();
    trailDpr = Math.min(window.devicePixelRatio || 1, 2);
    trailWidth = bounds.width;
    trailHeight = bounds.height;
    waitlistTrail.width = Math.round(trailWidth * trailDpr);
    waitlistTrail.height = Math.round(trailHeight * trailDpr);
    trailContext.setTransform(trailDpr, 0, 0, trailDpr, 0, 0);

    trailGrid.imageSize = trailHeight * (window.innerWidth >= 1024 ? .075 : .05);
    trailGrid.gap = trailHeight * .06;
    trailGrid.step = trailGrid.imageSize + trailGrid.gap;
    trailGrid.radius = trailHeight * (window.innerWidth >= 1024 ? .3 : .2);
    trailGrid.columns = Math.ceil(trailWidth / trailGrid.step);
    trailGrid.rows = Math.ceil(trailHeight / trailGrid.step);
  };

  const updateTrailPointer = (event) => {
    const bounds = waitlistTrail.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const inside = x >= 0 && y >= 0 && x <= bounds.width && y <= bounds.height;
    const buttonBounds = trailButton?.getBoundingClientRect();
    const buttonPadding = 70;
    const nearButton = buttonBounds
      && event.clientX >= buttonBounds.left - buttonPadding
      && event.clientX <= buttonBounds.right + buttonPadding
      && event.clientY >= buttonBounds.top - buttonPadding
      && event.clientY <= buttonBounds.bottom + buttonPadding;

    trailPointer.active = inside && !nearButton;
    if (inside) {
      trailPointer.targetX = x;
      trailPointer.targetY = y;
    }
  };

  const renderTrailGrid = (time) => {
    if (!trailRunning) return;
    const delta = trailPreviousTime ? Math.min(32, time - trailPreviousTime) : 16;
    trailPreviousTime = time;
    trailTravel += delta * .1;
    trailPointer.strength += ((trailPointer.active ? 1 : 0) - trailPointer.strength) * .08;
    trailPointer.x += (trailPointer.targetX - trailPointer.x) * Math.min(1, delta * .005);
    trailPointer.y += (trailPointer.targetY - trailPointer.y) * Math.min(1, delta * .005);

    trailContext.clearRect(0, 0, trailWidth, trailHeight);

    for (let row = -1; row < trailGrid.rows + 1; row += 1) {
      for (let column = -1; column < trailGrid.columns + 1; column += 1) {
        const image = trailImages[((column * trailGrid.columns) + row + trailImages.length * 10) % trailImages.length];
        if (!image?.complete || !image.naturalWidth) continue;

        const ratio = image.naturalWidth / image.naturalHeight;
        let baseWidth;
        let baseHeight;
        if (ratio > 1) {
          baseWidth = trailGrid.imageSize;
          baseHeight = baseWidth / ratio;
        } else {
          baseHeight = trailGrid.imageSize;
          baseWidth = baseHeight * ratio;
        }

        const gridX = wrapTrailPosition(
          column * trailGrid.step + trailTravel,
          -trailGrid.step - trailGrid.gap,
          trailWidth + trailGrid.step,
        );
        const gridY = wrapTrailPosition(
          row * trailGrid.step - trailTravel,
          -trailGrid.step - trailGrid.gap,
          trailHeight + trailGrid.step,
        );
        const centerX = gridX + trailGrid.imageSize / 2;
        const centerY = gridY + trailGrid.imageSize / 2;
        const distance = Math.hypot(centerX - trailPointer.x, centerY - trailPointer.y);

        if (distance >= trailGrid.radius) continue;

        const proximity = 1 - (distance / trailGrid.radius);
        const scale = Math.pow(proximity, 1.65) * 4 * trailPointer.strength;
        if (scale <= .01) continue;

        const width = baseWidth * scale;
        const height = baseHeight * scale;
        trailContext.drawImage(
          image,
          gridX + (trailGrid.imageSize - width) / 2,
          gridY + (trailGrid.imageSize - height) / 2,
          width,
          height,
        );
      }
    }

    trailFrame = requestAnimationFrame(renderTrailGrid);
  };

  const startTrail = () => {
    if (trailRunning || document.hidden) return;
    trailRunning = true;
    trailPreviousTime = 0;
    trailFrame = requestAnimationFrame(renderTrailGrid);
  };

  const stopTrail = () => {
    trailRunning = false;
    trailPointer.active = false;
    if (trailFrame) cancelAnimationFrame(trailFrame);
    trailFrame = 0;
  };

  resizeTrailCanvas();
  window.addEventListener('resize', resizeTrailCanvas);
  window.addEventListener('pointermove', updateTrailPointer, { passive: true });
  window.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget) trailPointer.active = false;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTrail();
    else if (waitlistTrail.getBoundingClientRect().bottom > -100 && waitlistTrail.getBoundingClientRect().top < innerHeight + 100) startTrail();
  });
  const trailObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) startTrail();
    else stopTrail();
  }, { rootMargin: '100px 0px', threshold: 0 });
  trailObserver.observe(waitlistTrail);
 });
}
const faqQuestions = [...document.querySelectorAll('.faq__question')];

faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq__item');
    const answer = document.getElementById(question.getAttribute('aria-controls'));
    const icon = question.querySelector('i');
    const willOpen = question.getAttribute('aria-expanded') !== 'true';

    faqQuestions.forEach((otherQuestion) => {
      if (otherQuestion === question || otherQuestion.getAttribute('aria-expanded') !== 'true') return;
      const otherItem = otherQuestion.closest('.faq__item');
      const otherAnswer = document.getElementById(otherQuestion.getAttribute('aria-controls'));
      const otherIcon = otherQuestion.querySelector('i');
      otherQuestion.setAttribute('aria-expanded', 'false');
      otherItem.classList.remove('is-open');
      otherIcon.classList.replace('fa-minus', 'fa-plus');
      gsap.to(otherAnswer, {
        height: 0,
        paddingBottom: 0,
        duration: .35,
        ease: 'power2.inOut',
        onComplete: () => {
          otherAnswer.hidden = true;
          gsap.set(otherAnswer, { clearProps: 'height,paddingBottom' });
        },
      });
    });

    question.setAttribute('aria-expanded', String(willOpen));
    item.classList.toggle('is-open', willOpen);
    icon.classList.replace(willOpen ? 'fa-plus' : 'fa-minus', willOpen ? 'fa-minus' : 'fa-plus');

    if (willOpen) {
      answer.hidden = false;
      gsap.fromTo(answer,
        { height: 0, paddingBottom: 0 },
        { height: 'auto', paddingBottom: 24, duration: .45, ease: 'power3.inOut', clearProps: 'height,paddingBottom' });
    } else {
      gsap.to(answer, {
        height: 0,
        paddingBottom: 0,
        duration: .35,
        ease: 'power2.inOut',
        onComplete: () => {
          answer.hidden = true;
          gsap.set(answer, { clearProps: 'height,paddingBottom' });
        },
      });
    }
  });
});

// Footer headline — scroll-triggered entrance
const footerHeadline = document.querySelector('.footer-headline');
const footerHeadlineArtwork = footerHeadline?.querySelector('.footer-headline-art');
const footerHeadlineRed = footerHeadline?.querySelector('.footer-headline-image--red');

if (footerHeadline && footerHeadlineArtwork) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(footerHeadlineArtwork, { clearProps: 'all' });
  } else {
    gsap.fromTo(
      footerHeadlineArtwork,
      {
        yPercent: 110,
        rotate: 2,
        transformOrigin: 'left bottom',
      },
      {
        yPercent: 0,
        rotate: 0,
        duration: 1.35,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: footerHeadline,
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
      },
    );

    if (window.matchMedia('(pointer: fine)').matches) {
      const magneticX = gsap.quickTo(footerHeadlineArtwork, 'x', {
        duration: 1.05,
        ease: 'power2.out',
      });
      const magneticY = gsap.quickTo(footerHeadlineArtwork, 'y', {
        duration: 1.05,
        ease: 'power2.out',
      });
      const elasticScaleX = gsap.quickTo(footerHeadlineArtwork, 'scaleX', {
        duration: .9,
        ease: 'elastic.out(1, .55)',
      });
      const elasticScaleY = gsap.quickTo(footerHeadlineArtwork, 'scaleY', {
        duration: .9,
        ease: 'elastic.out(1, .55)',
      });
      const elasticSkewX = gsap.quickTo(footerHeadlineArtwork, 'skewX', {
        duration: .8,
        ease: 'elastic.out(1, .6)',
      });

      footerHeadline.addEventListener('pointermove', (event) => {
        const bounds = footerHeadline.getBoundingClientRect();
        const artworkBounds = footerHeadlineArtwork.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;

        magneticX(x * 30);
        magneticY(y * 18);
        gsap.set(footerHeadlineArtwork, {
          transformOrigin: `${(x + .5) * 100}% ${(y + .5) * 100}%`,
        });
        elasticScaleX(1 + Math.abs(x) * .024);
        elasticScaleY(1 - Math.abs(y) * .014);
        elasticSkewX(x * 1.8);

        if (footerHeadlineRed) {
          const revealX = event.clientX - artworkBounds.left;
          const revealY = event.clientY - artworkBounds.top;
          footerHeadlineRed.style.clipPath = `circle(82px at ${revealX}px ${revealY}px)`;
        }
      });

      footerHeadline.addEventListener('pointerenter', () => {
        if (footerHeadlineRed) {
          gsap.to(footerHeadlineRed, { opacity: 1, duration: .25, ease: 'power2.out' });
        }
      });

      footerHeadline.addEventListener('pointerleave', () => {
        magneticX(0);
        magneticY(0);
        elasticScaleX(1);
        elasticScaleY(1);
        elasticSkewX(0);

        if (footerHeadlineRed) {
          gsap.to(footerHeadlineRed, {
            opacity: 0,
            duration: .35,
            ease: 'power2.out',
            onComplete: () => {
              footerHeadlineRed.style.clipPath = 'circle(0 at 50% 50%)';
            },
          });
        }
      });
    }
  }
}
