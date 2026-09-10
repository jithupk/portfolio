gsap.registerPlugin(SplitText, ScrollTrigger);

const preloader = document.querySelector('[data-preloader]');

if (preloader) {
  const preloaderBrand = preloader.querySelector('[data-preloader-brand]');
  const targetIsland = document.querySelector('[data-site-island]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brandText = preloaderBrand.textContent.trim();
  let assetsReady = false;
  let introComplete = reduceMotion;
  let finished = false;

  preloaderBrand.setAttribute('aria-label', brandText);
  preloaderBrand.textContent = '';

  const preloaderCharacters = [...brandText].map((character) => {
    const span = document.createElement('span');
    span.className = 'preloader__character';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = character === ' ' ? '\u00a0' : character;
    preloaderBrand.appendChild(span);
    return span;
  });

  const announcePreloaderComplete = () => {
    window.dispatchEvent(new CustomEvent('preloader:complete'));
  };

  const finishPreloader = () => {
    if (finished || !introComplete || !assetsReady) return;
    finished = true;

    const removePreloader = () => {
      document.documentElement.classList.remove('has-preloader');
      if (targetIsland) gsap.set(targetIsland, { clearProps: 'opacity' });
      preloader.remove();
      announcePreloaderComplete();
    };

    if (reduceMotion) {
      removePreloader();
      return;
    }

    gsap.timeline({ onComplete: removePreloader })
      .to(preloaderBrand, { autoAlpha: 0, duration: .18, ease: 'power1.out' })
      .to(preloader, {
        yPercent: -100,
        duration: 1.05,
        ease: 'power4.inOut',
      }, '<.08');
  };

  if (reduceMotion) {
    gsap.set(preloaderCharacters, { autoAlpha: 1, y: 0, rotation: 0, filter: 'blur(0px)' });
  } else {
    gsap.set(preloaderCharacters, {
      autoAlpha: 0,
      yPercent: 140,
      rotation: 0,
      transformOrigin: '50% 100%',
    });

    gsap.timeline({
      onComplete: () => {
        introComplete = true;
        finishPreloader();
      },
    })
      .to({}, { duration: .62 })
      .to(preloaderCharacters, {
        autoAlpha: 1,
        yPercent: 0,
        rotation: 0,
        duration: .68,
        stagger: .07,
        ease: 'power4.out',
      })
      .to(preloaderBrand, { duration: .34 });
  }

  const criticalImages = [...document.querySelectorAll('.hero img')];

  Promise.allSettled([
    document.fonts.ready,
    ...criticalImages.map((image) => image.complete
      ? Promise.resolve()
      : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
      }))
  ]).then(() => {
    assetsReady = true;
    finishPreloader();
  });

  window.setTimeout(() => {
    assetsReady = true;
    finishPreloader();
  }, 5000);
}

const hero = document.querySelector('.hero');

if (hero) {
  const heroBackground = hero.querySelector('.hero__background');
  const heroBio = hero.querySelector('.hero__bio');
  const heroTitle = hero.querySelector('.hero__title-art');
  const heroPortrait = hero.querySelector('.hero__portrait');
  const heroRole = hero.querySelector('.hero__role');
  const heroSocials = hero.querySelectorAll('.hero__socials li');
  const reduceHeroMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let heroEntrancePlayed = false;
  let heroParallaxInitialized = false;

  const heroEntranceTargets = [
    heroBackground,
    heroBio,
    heroTitle,
    heroPortrait,
    heroRole,
    ...heroSocials,
  ].filter(Boolean);

  const revealHeroImmediately = () => {
    gsap.set(heroEntranceTargets, { clearProps: 'all' });
    if (heroTitle) gsap.set(heroTitle, { clipPath: 'inset(0 0% 0 0)' });
  };

  const initHeroParallax = () => {
    if (
      heroParallaxInitialized
      || reduceHeroMotion
      || typeof ScrollTrigger === 'undefined'
      || !heroBackground
      || !heroPortrait
    ) return;

    heroParallaxInitialized = true;
    gsap.registerPlugin(ScrollTrigger);

    const heroParallaxMedia = gsap.matchMedia();

    heroParallaxMedia.add('(min-width: 768px)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: .8,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(heroPortrait, {
          scale: 1.08,
          yPercent: 2,
          transformOrigin: '50% 100%',
          ease: 'none',
          duration: 1,
        }, 0)
        .to(heroBackground, {
          yPercent: -5,
          scale: 1.025,
          transformOrigin: '50% 50%',
          ease: 'none',
          duration: 1,
        }, 0)
        .to(heroTitle, {
          yPercent: -8,
          ease: 'none',
          duration: 1,
        }, 0)
        .to(heroRole, {
          xPercent: -10,
          yPercent: -12,
          ease: 'none',
          duration: 1,
        }, 0)
        .to([heroBio, ...heroSocials], {
          autoAlpha: 0,
          yPercent: -12,
          ease: 'none',
          duration: .3,
        }, 0);

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
        gsap.set(
          [heroPortrait, heroBackground, heroTitle, heroRole, heroBio, ...heroSocials],
          { clearProps: 'transform,opacity,visibility' }
        );
      };
    });
  };

  const playHeroEntrance = () => {
    if (heroEntrancePlayed) return;
    heroEntrancePlayed = true;

    if (reduceHeroMotion) {
      revealHeroImmediately();
      return;
    }

    const timeline = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        revealHeroImmediately();
        initHeroParallax();
      },
    });

    timeline
      .to(heroBackground, {
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
      }, 0)
      .to(heroBio, {
        autoAlpha: 1,
        y: 0,
        duration: .7,
      }, .12)
      .to(heroTitle, {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.05,
        ease: 'power4.inOut',
      }, .25)
      .to(heroPortrait, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 1.15,
        ease: 'power4.out',
      }, .48)
      .to(heroRole, {
        autoAlpha: 1,
        y: 0,
        duration: .72,
      }, .72)
      .to(heroSocials, {
        autoAlpha: 1,
        y: 0,
        duration: .5,
        stagger: .09,
      }, .88);
  };

  if (reduceHeroMotion) {
    revealHeroImmediately();
  } else {
    gsap.set(heroBackground, { scale: 1.08, transformOrigin: '50% 50%' });
    gsap.set(heroBio, { autoAlpha: 0, y: -20 });
    gsap.set(heroTitle, { clipPath: 'inset(0 100% 0 0)' });
    gsap.set(heroPortrait, { autoAlpha: 0, y: 90, scale: .97, transformOrigin: '50% 100%' });
    gsap.set(heroRole, { autoAlpha: 0, y: 55 });
    gsap.set(heroSocials, { autoAlpha: 0, y: 18 });

    window.addEventListener('preloader:complete', playHeroEntrance, { once: true });

    if (!preloader) playHeroEntrance();
  }
}

const initProjectWebGL = location.protocol === 'file:'
  ? async () => null
  : async (projectData) => {
    const webglModule = await import('./webgl-projects.js?v=fade-opacity-2');
    return webglModule.initProjectWebGL(projectData);
  };

if (typeof SplitText !== 'undefined') {
  gsap.registerPlugin(SplitText);

  document.fonts.ready.then(() => {
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!canHover || reduceMotion) return;

    document.querySelectorAll('h3').forEach((heading) => {
      const article = heading.closest('article');

      if (!article || heading.closest('.faq') || heading.classList.contains('services__title')) return;

      let splitText = null;
      let animation = null;

      article.addEventListener('mouseenter', () => {
        if (animation?.isActive()) return;

        splitText?.revert();
        splitText = SplitText.create(heading, {
          type: 'chars, words',
          charsClass: 'char',
        });

        animation = gsap.from(splitText.chars, {
          duration: 1,
          opacity: 0,
          scale: 0,
          y: 80,
          rotationX: 180,
          transformOrigin: '0% 50% -50',
          ease: 'back',
          stagger: .05,
          onComplete: () => {
            splitText.revert();
            splitText = null;
            animation = null;
          },
        });
      });
    });
  });
}

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


const projectWebGLQuery = matchMedia('(min-width: 992px)');
let projectWebGL = null;
let projectWebGLStarting = null;

const syncProjectWebGL = async () => {
  if (!projectWebGLQuery.matches) {
    projectWebGL?.deactivate();
    return;
  }

  if (projectWebGL) {
    projectWebGL.activate();
    return;
  }

  if (!projectWebGLStarting) {
    projectWebGLStarting = initProjectWebGL(projects);
  }

  try {
    projectWebGL = await projectWebGLStarting;
  } finally {
    projectWebGLStarting = null;
  }

  if (!projectWebGL) return;

  if (projectWebGLQuery.matches) projectWebGL.activate();
  else projectWebGL.deactivate();
};

const handleProjectWebGLChange = () => {
  syncProjectWebGL().catch((error) => {
    console.error(
      "WebGL project renderer could not start; using image fallback.",
      error,
    );
    document.documentElement.classList.remove("webgl-ready");
  });
};

projectWebGLQuery.addEventListener('change', handleProjectWebGLChange);
handleProjectWebGLChange();


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
const parallaxCircleRevealSection = document.querySelector('.parallax-circle-reveal');
const servicesList = document.querySelector('.services__list');
const servicesCursorPreview = document.querySelector('.services__cursor-preview');

if (servicesList && servicesCursorPreview) {
  const servicesItems = [...servicesList.querySelectorAll('.services__item')];
  const servicesCursorImages = [...servicesCursorPreview.querySelectorAll('[data-service-preview]')];
  let firstEnter = false;
  let activeServicePreview = servicesCursorImages.find((image) => image.classList.contains('is-active'));

  gsap.set(servicesCursorPreview, {
    xPercent: -50,
    yPercent: -50,
    scale: .9,
  });

  const previewX = gsap.quickTo(servicesCursorPreview, 'x', {
    duration: .4,
    ease: 'power3',
  });
  const previewY = gsap.quickTo(servicesCursorPreview, 'y', {
    duration: .4,
    ease: 'power3',
  });

  const alignServicesPreview = (event) => {
    if (firstEnter) {
      previewX(event.clientX, event.clientX);
      previewY(event.clientY, event.clientY);
      firstEnter = false;
    } else {
      previewX(event.clientX);
      previewY(event.clientY);
    }
  };

  const startServicesFollow = () => {
    document.addEventListener('mousemove', alignServicesPreview);
  };

  const stopServicesFollow = () => {
    document.removeEventListener('mousemove', alignServicesPreview);
  };

  const servicesPreviewFade = gsap.to(servicesCursorPreview, {
    autoAlpha: 1,
    ease: 'none',
    paused: true,
    duration: .1,
    onReverseComplete: stopServicesFollow,
  });

  servicesList.addEventListener('mouseenter', (event) => {
    if (innerWidth < 992) return;

    firstEnter = true;
    servicesPreviewFade.play();
    gsap.to(servicesCursorPreview, {
      scale: 1,
      duration: .45,
      ease: 'power3.out',
      overwrite: 'auto',
    });
    startServicesFollow();
    alignServicesPreview(event);
  });

  servicesList.addEventListener('mouseleave', () => {
    servicesPreviewFade.reverse();
    gsap.to(servicesCursorPreview, {
      scale: .9,
      duration: .25,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  servicesItems.forEach((item) => {
    item.addEventListener('mouseenter', () => {
      const nextPreview = servicesCursorImages.find(
        (image) => image.dataset.servicePreview === item.dataset.cursorPreview
      );

      if (!nextPreview || nextPreview === activeServicePreview) return;

      const previousPreview = activeServicePreview;

      gsap.killTweensOf([previousPreview, nextPreview]);
      nextPreview.classList.add('is-active');
      gsap.set(nextPreview, {
        opacity: 0,
        filter: 'blur(4px)',
        scale: 1.21,
      });

      gsap.to(previousPreview, {
        opacity: 0,
        duration: .2,
        ease: 'power1.out',
        onComplete: () => previousPreview?.classList.remove('is-active'),
      });
      gsap.to(nextPreview, {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1.02,
        duration: .7,
        ease: 'power3.out',
      });

      activeServicePreview = nextPreview;
    });
  });
}

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
  const primaryList = processSection.querySelector('.process__steps:not(.process__steps--industries)');
  const secondaryList = processSection.querySelector('.process__steps--industries');
  const processMarker = processSection.querySelector('.process__marker');
  const primarySteps = [...primaryList.querySelectorAll('.process__step')];
  const allSteps = [...stepsWindow.querySelectorAll('.process__step')];
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

  const updateProcessFromScroll = () => {
    const scrollStart = processSection.offsetTop;
    const processTrackDistance = window.innerHeight * (window.innerWidth <= 700 ? 2.4 : 2.8);
    const scrollDistance = Math.max(1, processTrackDistance);
    processProgress = gsap.utils.clamp(0, 1, (window.scrollY - scrollStart) / scrollDistance);
    positionProcessTrack();
  };

  const processMedia = gsap.matchMedia();

  processMedia.add('(min-width: 768px)', () => {
    gsap.set(secondaryDetails, { visibility: 'visible' });
    setDetailsMode(false, true);
    positionProcessTrack();

    window.addEventListener('scroll', updateProcessFromScroll, { passive: true });
    lenis.on('scroll', updateProcessFromScroll);
    window.addEventListener('resize', updateProcessFromScroll);
    window.addEventListener('load', updateProcessFromScroll);
    requestAnimationFrame(() => requestAnimationFrame(updateProcessFromScroll));

    return () => {
      window.removeEventListener('scroll', updateProcessFromScroll);
      window.removeEventListener('resize', updateProcessFromScroll);
      window.removeEventListener('load', updateProcessFromScroll);
      lenis.off?.('scroll', updateProcessFromScroll);
      processProgress = 0;
      gsap.killTweensOf([...primaryDetails, ...secondaryDetails]);
      gsap.set([stepsWindow, ...allSteps, ...primaryDetails, ...secondaryDetails], { clearProps: 'all' });
      gsap.set(allSteps.map((step) => step.querySelector('.process__number')).filter(Boolean), { clearProps: 'all' });
      allSteps.forEach((step, index) => step.classList.toggle('is-active', index === 0));
    };
  });

  if (parallaxCircleRevealSection && processMarker) {
    const parallaxCircleRevealStage = parallaxCircleRevealSection.querySelector('.parallax-circle-reveal__stage');
    const parallaxCircleRevealRed = parallaxCircleRevealSection.querySelector('.parallax-circle-reveal__circle--red');
    const parallaxCircleRevealBlack = parallaxCircleRevealSection.querySelector('.parallax-circle-reveal__circle--black');
    const parallaxCircleRevealWhite = parallaxCircleRevealSection.querySelector('.parallax-circle-reveal__circle--white');
    const parallaxCircleRevealMedia = gsap.matchMedia();

    parallaxCircleRevealMedia.add('(min-width: 768px)', () => {

    let markerOrigin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const setParallaxCircleRevealOrigin = () => {
      if (window.innerWidth < 768) {
        markerOrigin = {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        };

        parallaxCircleRevealStage.style.setProperty('--parallax-circle-reveal-origin-x', `${markerOrigin.x}px`);
        parallaxCircleRevealStage.style.setProperty('--parallax-circle-reveal-origin-y', `${markerOrigin.y}px`);
        return;
      }

      const markerRect = processMarker.getBoundingClientRect();

      if (markerRect.top >= 0 && markerRect.bottom <= window.innerHeight) {
        markerOrigin = {
          x: markerRect.left + (markerRect.width / 2),
          y: markerRect.top + (markerRect.height / 2),
        };
      }

      parallaxCircleRevealStage.style.setProperty('--parallax-circle-reveal-origin-x', `${markerOrigin.x}px`);
      parallaxCircleRevealStage.style.setProperty('--parallax-circle-reveal-origin-y', `${markerOrigin.y}px`);
    };

    setParallaxCircleRevealOrigin();

    const getMarkerRadius = () => processMarker.getBoundingClientRect().width / 2;
    const getRevealRadius = () => Math.hypot(window.innerWidth, window.innerHeight) * 1.1;

    const parallaxCircleRevealTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: parallaxCircleRevealSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
      },
    })
      .fromTo(parallaxCircleRevealRed,
        { clipPath: () => `circle(${getMarkerRadius()}px at var(--parallax-circle-reveal-origin-x) var(--parallax-circle-reveal-origin-y))` },
        { clipPath: () => `circle(${getRevealRadius()}px at var(--parallax-circle-reveal-origin-x) var(--parallax-circle-reveal-origin-y))`, duration: 1, ease: 'none' })
      .fromTo(parallaxCircleRevealBlack,
        { clipPath: 'circle(0px at var(--parallax-circle-reveal-origin-x) var(--parallax-circle-reveal-origin-y))' },
        { clipPath: () => `circle(${getRevealRadius()}px at var(--parallax-circle-reveal-origin-x) var(--parallax-circle-reveal-origin-y))`, duration: 1, ease: 'none' }, .28)
      .fromTo(parallaxCircleRevealWhite,
        { clipPath: 'circle(0px at var(--parallax-circle-reveal-origin-x) var(--parallax-circle-reveal-origin-y))' },
        { clipPath: () => `circle(${getRevealRadius()}px at var(--parallax-circle-reveal-origin-x) var(--parallax-circle-reveal-origin-y))`, duration: 1, ease: 'none' }, .56);

    window.addEventListener('scroll', setParallaxCircleRevealOrigin, { passive: true });
    lenis.on('scroll', setParallaxCircleRevealOrigin);
    window.addEventListener('resize', setParallaxCircleRevealOrigin);

    return () => {
      window.removeEventListener('scroll', setParallaxCircleRevealOrigin);
      window.removeEventListener('resize', setParallaxCircleRevealOrigin);
      lenis.off?.('scroll', setParallaxCircleRevealOrigin);
      parallaxCircleRevealTimeline.scrollTrigger?.kill();
      parallaxCircleRevealTimeline.kill();
      gsap.set([parallaxCircleRevealRed, parallaxCircleRevealBlack, parallaxCircleRevealWhite], { clearProps: 'clipPath' });
    };
    });
  }
}

const glassRain = document.querySelector('.glass-rain');

if (glassRain && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const glassRainSurface = glassRain.closest('.bg-white');
  const glassPills = [];
  const pointer = { x: 0, y: 0, active: false };
  let rainWidth = 0;
  let rainHeight = 0;
  let rainFrame = 0;
  let rainVisible = false;
  let rainStartedAt = 0;
  let lastRainTime = performance.now();

  const measureGlassRain = () => {
    const bounds = glassRain.getBoundingClientRect();
    rainWidth = bounds.width;
    rainHeight = bounds.height;
  };

  const placeGlassPill = (pill, index) => {
    pill.x = Math.random() * Math.max(0, rainWidth - pill.width);
    pill.y = -pill.height - 30 - (Math.random() * 140);
    pill.vx = (Math.random() - .5) * 24;
    pill.vy = 0;
    pill.rotation = (Math.random() - .5) * 34;
    pill.rotationSpeed = (Math.random() - .5) * 28;
    pill.floorOffset = 12;
    pill.releaseDelay = index * 135 + (Math.random() * 180);
    pill.element.style.transform = `translate3d(${pill.x}px, ${pill.y}px, 0) rotate(${pill.rotation}deg)`;
  };

  const explodeGlassPills = (originPill) => {
    const originX = originPill.x + originPill.width / 2;
    const originY = originPill.y + originPill.height / 2;
    pointer.active = false;

    glassPills.forEach((pill) => {
      let offsetX = pill.x + pill.width / 2 - originX;
      let offsetY = pill.y + pill.height / 2 - originY;
      let distance = Math.hypot(offsetX, offsetY);

      if (distance < 1) {
        const angle = Math.random() * Math.PI * 2;
        offsetX = Math.cos(angle);
        offsetY = Math.sin(angle);
        distance = 1;
      }

      const falloff = Math.max(.28, 1 - distance / Math.max(rainWidth, rainHeight));
      const force = 620 * falloff;
      pill.released = true;
      pill.releaseDelay = 0;
      pill.vx += offsetX / distance * force;
      pill.vy += offsetY / distance * force - 190;
      pill.rotationSpeed += (Math.random() - .5) * 420;
    });
  };

  const createGlassPills = () => {
    const labels = [
      'Motion',
      'Strategy',
      'Design',
      'Branding',
      'WebGL',
      'Interaction',
      'Development',
      'Creative',
      'Direction',
      'Prototyping',
      'Systems',
      'Experience',
    ];
    const visibleLabels = window.innerWidth < 768 ? labels.slice(0, 8) : labels;

    visibleLabels.forEach((label, index) => {
      const element = document.createElement('span');
      const width = Math.min(150, 48 + (label.length * 8));
      const height = 38;
      const pill = { element, width, height, released: false };

      element.className = 'glass-rain__pill';
      element.textContent = label;
      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.addEventListener('click', () => explodeGlassPills(pill));
      glassRain.appendChild(element);
      placeGlassPill(pill, index);
      glassPills.push(pill);
    });
  };

  const resolveGlassPillCollisions = () => {
    const getAxes = (pill) => {
      const angle = pill.rotation * Math.PI / 180;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      return [{ x: cosine, y: sine }, { x: -sine, y: cosine }];
    };

    for (let firstIndex = 0; firstIndex < glassPills.length; firstIndex += 1) {
      const first = glassPills[firstIndex];
      if (!first.released) continue;

      for (let secondIndex = firstIndex + 1; secondIndex < glassPills.length; secondIndex += 1) {
        const second = glassPills[secondIndex];
        if (!second.released) continue;

        const firstAxes = getAxes(first);
        const secondAxes = getAxes(second);
        const centerOffset = {
          x: second.x + second.width / 2 - first.x - first.width / 2,
          y: second.y + second.height / 2 - first.y - first.height / 2,
        };
        let smallestOverlap = Infinity;
        let collisionAxis = null;

        [...firstAxes, ...secondAxes].forEach((axis) => {
          const firstRadius = first.width / 2 * Math.abs(axis.x * firstAxes[0].x + axis.y * firstAxes[0].y)
            + first.height / 2 * Math.abs(axis.x * firstAxes[1].x + axis.y * firstAxes[1].y);
          const secondRadius = second.width / 2 * Math.abs(axis.x * secondAxes[0].x + axis.y * secondAxes[0].y)
            + second.height / 2 * Math.abs(axis.x * secondAxes[1].x + axis.y * secondAxes[1].y);
          const distance = Math.abs(centerOffset.x * axis.x + centerOffset.y * axis.y);
          const overlap = firstRadius + secondRadius + 2 - distance;

          if (overlap < smallestOverlap) {
            smallestOverlap = overlap;
            collisionAxis = axis;
          }
        });

        if (smallestOverlap <= 0 || !collisionAxis) continue;

        if (centerOffset.x * collisionAxis.x + centerOffset.y * collisionAxis.y < 0) {
          collisionAxis = { x: -collisionAxis.x, y: -collisionAxis.y };
        }

        if (Math.abs(collisionAxis.y) > .82) {
          const firstIsAbove = centerOffset.y > 0;
          const upperPill = firstIsAbove ? first : second;
          const lowerPill = firstIsAbove ? second : first;
          const lowerFlatAngle = ((lowerPill.rotation + 90) % 180 + 180) % 180 - 90;

          if (lowerPill.grounded || Math.abs(lowerFlatAngle) < 10) {
            upperPill.flatSupported = true;
          }
        }

        const correction = smallestOverlap / 2;
        first.x -= collisionAxis.x * correction;
        first.y -= collisionAxis.y * correction;
        second.x += collisionAxis.x * correction;
        second.y += collisionAxis.y * correction;

        const relativeVelocity = (second.vx - first.vx) * collisionAxis.x
          + (second.vy - first.vy) * collisionAxis.y;

        if (relativeVelocity < 0) {
          const impulse = -(1.18 * relativeVelocity) / 2;
          first.vx -= impulse * collisionAxis.x;
          first.vy -= impulse * collisionAxis.y;
          second.vx += impulse * collisionAxis.x;
          second.vy += impulse * collisionAxis.y;
        }
      }
    }
  };

  const constrainGlassPill = (pill) => {
    const angle = pill.rotation * Math.PI / 180;
    const horizontalExtent = Math.abs(Math.cos(angle)) * pill.width / 2 + Math.abs(Math.sin(angle)) * pill.height / 2;
    const verticalExtent = Math.abs(Math.sin(angle)) * pill.width / 2 + Math.abs(Math.cos(angle)) * pill.height / 2;
    let centerX = pill.x + pill.width / 2;
    let centerY = pill.y + pill.height / 2;

    if (centerX - horizontalExtent < 0) {
      centerX = horizontalExtent;
      pill.vx = Math.abs(pill.vx) * .35;
    } else if (centerX + horizontalExtent > rainWidth) {
      centerX = rainWidth - horizontalExtent;
      pill.vx = -Math.abs(pill.vx) * .35;
    }

    const floor = rainHeight - pill.floorOffset;
    if (centerY + verticalExtent > floor) {
      centerY = floor - verticalExtent;
      pill.grounded = true;
      pill.vy = Math.abs(pill.vy) > 18 ? -Math.abs(pill.vy) * .18 : 0;
      pill.vx *= .88;
      pill.rotationSpeed *= .84;
    }

    pill.x = centerX - pill.width / 2;
    pill.y = centerY - pill.height / 2;
  };

  const renderGlassRain = (time) => {
    if (!rainVisible || document.hidden) {
      rainFrame = 0;
      return;
    }

    const delta = Math.min((time - lastRainTime) / 1000, .034);
    lastRainTime = time;

    glassPills.forEach((pill) => {
      pill.grounded = false;
      pill.flatSupported = false;
    });

    glassPills.forEach((pill) => {
      if (time < rainStartedAt + pill.releaseDelay) return;
      pill.released = true;

      pill.vy += 520 * delta;

      if (pointer.active) {
        const centerX = pill.x + (pill.width / 2);
        const centerY = pill.y + (pill.height / 2);
        const offsetX = centerX - pointer.x;
        const offsetY = centerY - pointer.y;
        const distance = Math.hypot(offsetX, offsetY) || 1;
        const repelRadius = 150;

        if (distance < repelRadius) {
          const force = (1 - (distance / repelRadius)) * 1050 * delta;
          pill.vx += (offsetX / distance) * force;
          pill.vy += (offsetY / distance) * force;
        }
      }

      pill.vx *= Math.pow(.982, delta * 60);
      pill.vy = Math.min(pill.vy, 620);
      pill.x += pill.vx * delta;
      pill.y += pill.vy * delta;
      pill.rotation += pill.rotationSpeed * delta;
    });

    for (let pass = 0; pass < 8; pass += 1) {
      glassPills.forEach((pill) => {
        if (pill.released) constrainGlassPill(pill);
      });
      resolveGlassPillCollisions();
    }

    glassPills.forEach((pill) => {
      if (!pill.released) return;

      if (pill.grounded || pill.flatSupported) {
        const flatRotation = Math.round(pill.rotation / 180) * 180;
        const settleAmount = Math.min(1, delta * 9);
        pill.rotation += (flatRotation - pill.rotation) * settleAmount;
        pill.rotationSpeed *= Math.pow(.72, delta * 60);

        if (Math.abs(flatRotation - pill.rotation) < .15) {
          pill.rotation = flatRotation;
          pill.rotationSpeed = 0;
        }
      }

      constrainGlassPill(pill);
      pill.element.style.transform = `translate3d(${pill.x}px, ${pill.y}px, 0) rotate(${pill.rotation}deg)`;
    });

    rainFrame = requestAnimationFrame(renderGlassRain);
  };

  const startGlassRain = () => {
    if (rainFrame || !rainVisible || document.hidden) return;
    if (!rainStartedAt) rainStartedAt = performance.now();
    lastRainTime = performance.now();
    rainFrame = requestAnimationFrame(renderGlassRain);
  };

  measureGlassRain();
  createGlassPills();

  glassRainSurface.addEventListener('pointermove', (event) => {
    const bounds = glassRain.getBoundingClientRect();
    pointer.x = event.clientX - bounds.left;
    pointer.y = event.clientY - bounds.top;
    pointer.active = true;
  }, { passive: true });

  glassRainSurface.addEventListener('pointerleave', () => {
    pointer.active = false;
  });

  new ResizeObserver(measureGlassRain).observe(glassRain);

  new IntersectionObserver(([entry]) => {
    rainVisible = entry.isIntersecting;

    if (rainVisible) {
      if (parallaxCircleRevealSection?.dataset.aboutRevealReady !== 'true') {
        parallaxCircleRevealSection.dataset.aboutRevealReady = 'true';
        parallaxCircleRevealSection.dispatchEvent(new CustomEvent('about-reveal:ready'));
      }
      startGlassRain();
    }
    else if (rainFrame) {
      cancelAnimationFrame(rainFrame);
      rainFrame = 0;
    }
  }, { threshold: .01 }).observe(glassRain);

  document.addEventListener('visibilitychange', startGlassRain);
}

const parallaxCircleRevealButton = document.querySelector('.parallax-circle-reveal__button');

if (parallaxCircleRevealButton) {
  const parallaxCircleRevealButtonLabel = parallaxCircleRevealButton.querySelector('.parallax-circle-reveal__button-label');
  const parallaxCircleRevealButtonPath = parallaxCircleRevealButton.querySelector('.parallax-circle-reveal__button-shape path');
  const parallaxCircleRevealButtonText = 'About Jithu';

  parallaxCircleRevealButtonLabel.innerHTML = [...parallaxCircleRevealButtonText].map((character) => {
    const safeCharacter = character === ' ' ? '&nbsp;' : character;
    return `<span class="parallax-circle-reveal__button-char" data-char="${safeCharacter}">${safeCharacter}</span>`;
  }).join('');

  const parallaxCircleRevealButtonCharacters = [...parallaxCircleRevealButtonLabel.children];
  const buttonShapeRest = 'M142.5 29C180 29 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 136 142.5 136C105 136 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 29 142.5 29Z';
  const buttonShapeSwell = 'M142.5 6C180 6 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 159 142.5 159C105 159 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 6 142.5 6Z';
  const buttonShapePinch = 'M142.5 45C180 45 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 120 142.5 120C105 120 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 45 142.5 45Z';
  const buttonShapeRebound = 'M142.5 23C180 23 225 29 254 29C271 42 280.5 58 280.5 82.5C280.5 107 271 123 254 136C225 136 180 142 142.5 142C105 142 60 136 31 136C14 123 4.5 107 4.5 82.5C4.5 58 14 42 31 29C60 29 105 23 142.5 23Z';

  parallaxCircleRevealButton.addEventListener('mouseenter', () => {
    gsap.killTweensOf(parallaxCircleRevealButtonCharacters);
    gsap.to(parallaxCircleRevealButtonPath, { fill: 'var(--color-accent)', duration: .28, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(parallaxCircleRevealButtonCharacters, {
      yPercent: -100,
      duration: .48,
      stagger: .025,
      ease: 'power3.inOut',
    });
    gsap.timeline({ overwrite: true })
      .set(parallaxCircleRevealButtonPath, { attr: { d: buttonShapeRest }, scaleX: 1, scaleY: 1 })
      .to(parallaxCircleRevealButtonPath, { attr: { d: buttonShapeSwell }, duration: .15, ease: 'power2.inOut' })
      .to(parallaxCircleRevealButtonPath, { attr: { d: buttonShapePinch }, duration: .45, ease: 'power2.inOut' })
      .to(parallaxCircleRevealButtonPath, { attr: { d: buttonShapeRebound }, duration: .5, ease: 'power2.inOut' })
      .to(parallaxCircleRevealButtonPath, { attr: { d: buttonShapeRest }, duration: .18, ease: 'power2.out' });
  });

  parallaxCircleRevealButton.addEventListener('mouseleave', () => {
    gsap.to(parallaxCircleRevealButtonPath, { fill: 'var(--surface-dark)', duration: .3, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(parallaxCircleRevealButtonCharacters, {
      yPercent: 0,
      duration: .4,
      stagger: -.018,
      ease: 'power3.inOut',
      overwrite: true,
    });
  });
}
const parallaxCircleRevealTrails = document.querySelectorAll('.parallax-circle-reveal__trail');

if (parallaxCircleRevealTrails.length && window.matchMedia('(pointer: fine)').matches) {
 parallaxCircleRevealTrails.forEach((parallaxCircleRevealTrail) => {
  const trailContext = parallaxCircleRevealTrail.getContext('2d');
  const trailButton = parallaxCircleRevealTrail.closest('section')?.querySelector('.parallax-circle-reveal__button');
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
    const bounds = parallaxCircleRevealTrail.getBoundingClientRect();
    trailDpr = Math.min(window.devicePixelRatio || 1, 2);
    trailWidth = bounds.width;
    trailHeight = bounds.height;
    parallaxCircleRevealTrail.width = Math.round(trailWidth * trailDpr);
    parallaxCircleRevealTrail.height = Math.round(trailHeight * trailDpr);
    trailContext.setTransform(trailDpr, 0, 0, trailDpr, 0, 0);

    trailGrid.imageSize = trailHeight * (window.innerWidth >= 1024 ? .075 : .05);
    trailGrid.gap = trailHeight * .06;
    trailGrid.step = trailGrid.imageSize + trailGrid.gap;
    trailGrid.radius = trailHeight * (window.innerWidth >= 1024 ? .3 : .2);
    trailGrid.columns = Math.ceil(trailWidth / trailGrid.step);
    trailGrid.rows = Math.ceil(trailHeight / trailGrid.step);
  };

  const updateTrailPointer = (event) => {
    const bounds = parallaxCircleRevealTrail.getBoundingClientRect();
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
    else if (parallaxCircleRevealTrail.getBoundingClientRect().bottom > -100 && parallaxCircleRevealTrail.getBoundingClientRect().top < innerHeight + 100) startTrail();
  });
  const trailObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) startTrail();
    else stopTrail();
  }, { rootMargin: '100px 0px', threshold: 0 });
  trailObserver.observe(parallaxCircleRevealTrail);
 });
}
const faqQuestions = [...document.querySelectorAll('.faq__question')];

faqQuestions.forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq__item');
    const willOpen = question.getAttribute('aria-expanded') !== 'true';

    faqQuestions.forEach((otherQuestion) => {
      if (otherQuestion === question || otherQuestion.getAttribute('aria-expanded') !== 'true') return;
      const otherItem = otherQuestion.closest('.faq__item');
      otherQuestion.setAttribute('aria-expanded', 'false');
      otherItem.classList.remove('is-open');
    });

    question.setAttribute('aria-expanded', String(willOpen));
    item.classList.toggle('is-open', willOpen);
  });
});

// Footer headline — pointer interaction
const footerHeadline = document.querySelector('.footer-headline');
const footerHeadlineArtwork = footerHeadline?.querySelector('.footer-headline-art');
const footerHeadlineRed = footerHeadline?.querySelector('.footer-headline-image--red');

if (footerHeadline && footerHeadlineArtwork) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(footerHeadlineArtwork, { clearProps: 'all' });
  } else {
    if (window.matchMedia('(pointer: fine)').matches) {
      const magneticX = gsap.quickTo(footerHeadlineArtwork, 'x', {
        duration: 1.05,
        ease: 'power2.out',
      });
      const magneticY = gsap.quickTo(footerHeadlineArtwork, 'y', {
        duration: 1.05,
        ease: 'power2.out',
      });

      footerHeadline.addEventListener('pointermove', (event) => {
        const bounds = footerHeadline.getBoundingClientRect();
        const artworkBounds = footerHeadlineArtwork.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - .5;
        const y = (event.clientY - bounds.top) / bounds.height - .5;

        magneticX(x * 30);
        magneticY(y * 18);

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

'use strict';

      document.querySelectorAll('[data-button-label]').forEach((label) => {
        const text = label.textContent;
        label.textContent = '';

        [...text].forEach((character, index) => {
          const span = document.createElement('span');
          span.className = 'btn-char';
          span.style.setProperty('--index', index);
          span.textContent = character === ' ' ? '\u00a0' : character;
          span.setAttribute('aria-hidden', 'true');
          label.appendChild(span);
        });
      });




// gsap.registerPlugin(SplitText, ScrollTrigger);
// console.clear();

document.fonts.ready.then(() => {
  const playIfTriggerIsVisible = (animation, trigger) => {
    const checkVisibility = (restart = false) => {
      requestAnimationFrame(() => {
        const bounds = trigger.getBoundingClientRect();
        const isVisible = bounds.top < window.innerHeight && bounds.bottom > 0;

        if (!isVisible) return;

        if (restart) {
          animation.restart(true);
        } else if (animation.progress() === 0) {
          animation.play();
        }
      });
    };

    if (preloader?.isConnected) {
      window.addEventListener('preloader:complete', () => checkVisibility(true), { once: true });
    } else {
      checkVisibility();
    }
  };

  document.querySelectorAll("[data-settings]").forEach((element) => {
    let settings;
    try {
      settings = JSON.parse(element.dataset.settings);
    } catch (error) {
      console.warn("Invalid data-settings:", element);
      return;
    }

    const setupAnimation = (activeMode = null) => {
      const triggerSelector = element.dataset.trigger;
      const customTrigger = triggerSelector
        ? element.closest(triggerSelector) ?? document.querySelector(triggerSelector)
        : null;
      const animationTrigger = customTrigger ?? element;
      const sharedStart = settings.start ?? "top bottom-=100px";
      const cleanupCallbacks = [];
      const splitInstances = [];
      const usesAboutReadyTrigger = activeMode === "md" && settings["trigger-mode"] === "about-ready";

      const connectAnimation = (animation, start = sharedStart) => {
        if (usesAboutReadyTrigger) {
          const section = element.closest(".parallax-circle-reveal");
          if (!section) return () => {};

          let hasPlayed = false;
          const playAnimation = () => {
            if (hasPlayed) return;
            hasPlayed = true;
            animation.play(0);
          };

          section.addEventListener("about-reveal:ready", playAnimation);
          if (section.dataset.aboutRevealReady === "true") playAnimation();

          return () => section.removeEventListener("about-reveal:ready", playAnimation);
        }

        const scrollTrigger = ScrollTrigger.create({
          trigger: animationTrigger,
          start,
          toggleActions: "play none none none",
          animation,
        });
        playIfTriggerIsVisible(animation, animationTrigger);

        return () => scrollTrigger.kill();
      };

      if (settings.animation === "lines") {
        gsap.set(element, { opacity: 1 });
        let disconnectAnimation = () => {};
        const split = SplitText.create(element, {
          type: "words,lines",
          linesClass: "line",
          autoSplit: true,
          mask: "lines",
          onSplit: (self) => {
            disconnectAnimation();
            const animation = gsap.from(self.words, {
              yPercent: settings.yPercent ?? 50,
              opacity: 0,
              duration: settings.duration ?? 1.4,
              delay: settings.delay ?? 0,
              ease: settings.ease ?? "power2.out",
              stagger: {
                each: settings.stagger ?? 0.22,
                from: "start"
              },
              paused: true
            });
            disconnectAnimation = connectAnimation(
              animation,
              customTrigger ? sharedStart : settings.start ?? "bottom bottom-=100px"
            );
            return animation;
          }
        });
        splitInstances.push(split);
        cleanupCallbacks.push(() => disconnectAnimation());
      }

      if (settings.animation === "fade") {
        const direction = settings["fade-from"];
        const duration = settings.duration ?? 1.2;
        const ease = settings.ease ?? "power3.out";
        const projectMedia = element.matches(".projects__card")
          ? element.querySelector(".projects__card-image")
          : null;
        let x = 0;
        let y = 0;
        if (direction === "left") x = -40;
        if (direction === "right") x = 40;
        if (direction === "bottom") y = 40;

        const animation = gsap.timeline({
          paused: true,
          delay: settings.delay ?? 0,
        });

        animation.fromTo(element, {
          x,
          y,
          autoAlpha: 0,
        }, {
          x: 0,
          y: 0,
          autoAlpha: 1,
          duration,
          ease,
          onComplete: () => gsap.set(element, { clearProps: "transform" }),
        }, 0);

        if (projectMedia) {
          animation.fromTo(projectMedia, {
            attr: { "data-reveal-opacity": 0 },
          }, {
            attr: { "data-reveal-opacity": 1 },
            duration,
            ease,
          }, 0);
        }

        cleanupCallbacks.push(connectAnimation(animation));
      }

      if (settings.animation === "chars") {
        let isInitialized = false;

        const initCharsAnimation = () => {
          if (isInitialized || !element.getClientRects().length) return false;
          isInitialized = true;
          const split = SplitText.create(element, {
            type: "chars",
            charsClass: "char"
          });
          splitInstances.push(split);
          const animation = gsap.from(split.chars, {
            x: settings.x ?? 150,
            opacity: 0,
            duration: settings.duration ?? 0.7,
            delay: settings.delay ?? 0,
            ease: settings.ease ?? "power4.out",
            stagger: settings.stagger ?? 0.04,
            paused: true
          });
          cleanupCallbacks.push(connectAnimation(animation));
          return true;
        };

        if (!initCharsAnimation()) {
          const visibilityObserver = new ResizeObserver(() => {
            if (!initCharsAnimation()) return;
            visibilityObserver.disconnect();
            ScrollTrigger.refresh();
          });
          visibilityObserver.observe(element);
          cleanupCallbacks.push(() => visibilityObserver.disconnect());
        }
      }

      return () => {
        cleanupCallbacks.forEach((cleanup) => cleanup());
        splitInstances.forEach((split) => split.revert());
        gsap.set(element, { clearProps: "transform,opacity,visibility" });
      };
    };

    const activeModes = Array.isArray(settings.active)
      ? settings.active
      : settings.active ? [settings.active] : [];

    if (activeModes.length) {
      const animationMedia = gsap.matchMedia();

      if (activeModes.includes("mob")) {
        animationMedia.add("(max-width: 767px)", () => setupAnimation("mob"));
      }

      if (activeModes.includes("md")) {
        animationMedia.add("(min-width: 768px)", () => setupAnimation("md"));
      }
    } else {
      setupAnimation();
    }
  });
});
