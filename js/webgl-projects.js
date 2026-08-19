import * as THREE from './vendor/three/three.module.min.js';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform sampler2D uDepth;
  uniform vec2 uDirection;
  uniform vec2 uSize;
  uniform float uImageAspect;
  uniform float uHover;
  uniform float uZoom;
  uniform float uBlur;
  uniform vec2 uJump;
  uniform float uRadius;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float planeAspect = uSize.x / max(uSize.y, 1.0);
    vec2 ratio = vec2(1.0);
    if (planeAspect > uImageAspect) {
      ratio.y = uImageAspect / planeAspect;
    } else {
      ratio.x = planeAspect / uImageAspect;
    }
    return (uv - 0.5) * ratio + 0.5;
  }

  float roundedMask(vec2 uv) {
    vec2 point = (uv - 0.5) * uSize;
    float radius = min(uRadius, min(uSize.x, uSize.y) * 0.5);
    vec2 bounds = uSize * 0.5 - vec2(radius);
    vec2 q = abs(point) - bounds;
    float distanceToEdge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    return 1.0 - smoothstep(-1.0, 1.0, distanceToEdge);
  }

  void main() {
    vec2 baseUv = coverUv(vUv);

    // Lusion's maps encode nearby surfaces darker and distant surfaces lighter.
    float inverseDepth = 1.0 - texture2D(uDepth, baseUv).r;
    inverseDepth = smoothstep(0.02, 0.98, inverseDepth);

    // Apply one directional offset to the whole depth field. This creates
    // layered parallax rather than a circular lens around the pointer.
    vec2 zoomedUv = (baseUv - 0.5) * mix(1.0, 0.975, uZoom) + 0.5;
    vec2 displacedUv = zoomedUv
      - uDirection * inverseDepth * uHover * 0.017
      + uJump * inverseDepth * 0.012;

    displacedUv = clamp(displacedUv, vec2(0.001), vec2(0.999));

    // A brief, depth-selective focus burst creates Lusion's soft hover jump.
    float focusDistance = abs(inverseDepth - 0.5);
    float blurAmount = uBlur * smoothstep(0.08, 0.48, focusDistance) * 0.009;
    vec2 blurAxis = normalize(uDirection + vec2(0.001, 0.0));
    vec2 blurNormal = vec2(-blurAxis.y, blurAxis.x);
    vec4 color = texture2D(uTexture, displacedUv) * 0.28;
    color += texture2D(uTexture, clamp(displacedUv + blurAxis * blurAmount, 0.001, 0.999)) * 0.18;
    color += texture2D(uTexture, clamp(displacedUv - blurAxis * blurAmount, 0.001, 0.999)) * 0.18;
    color += texture2D(uTexture, clamp(displacedUv + blurNormal * blurAmount * 0.72, 0.001, 0.999)) * 0.18;
    color += texture2D(uTexture, clamp(displacedUv - blurNormal * blurAmount * 0.72, 0.001, 0.999)) * 0.18;
    color.a *= roundedMask(vUv);
    gl_FragColor = color;
  }
`;

function loadTexture(loader, url) {
  return new Promise((resolve, reject) => {
    loader.load(url, texture => {
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      resolve(texture);
    }, undefined, reject);
  });
}

export async function initProjectWebGL(projects) {
  if (
    !window.WebGLRenderingContext ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) return null;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'webgl-projects-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  document.body.prepend(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera();
  const geometry = new THREE.PlaneGeometry(1, 1, 1, 1);
  const loader = new THREE.TextureLoader();
  const items = [];
  const projectsSection = document.querySelector('.projects');
  let frameId = 0;
  let running = false;
  let enabled = true;

  const pointer = {
    x: -1000,
    y: -1000,
    insideWindow: false
  };

  const updatePointer = event => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.insideWindow = true;
  };

  addEventListener('pointermove', updatePointer, { passive: true });
  addEventListener('mousemove', updatePointer, { passive: true });

  addEventListener('pointerout', event => {
    if (event.relatedTarget === null) pointer.insideWindow = false;
  }, { passive: true });

  await Promise.all(projects.map(async project => {
    const card = document.getElementById(project.slug);
    const media = card?.querySelector('.projects__card-image');
    if (!media) return;

    const [colorTexture, depthTexture] = await Promise.all([
      loadTexture(loader, `images/projects/${project.slug}/home.webp`),
      loadTexture(loader, `images/projects/${project.slug}/home_depth.webp`)
    ]);

    const uniforms = {
      uTexture: { value: colorTexture },
      uDepth: { value: depthTexture },
      uDirection: { value: new THREE.Vector2(0, 0) },
      uSize: { value: new THREE.Vector2(1, 1) },
      uImageAspect: { value: colorTexture.image.width / colorTexture.image.height },
      uHover: { value: 0 },
      uZoom: { value: 0 },
      uBlur: { value: 0 },
      uJump: { value: new THREE.Vector2() },
      uRadius: { value: 18 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    items.push({
      media,
      mesh,
      uniforms,
      directionTarget: new THREE.Vector2(0, 0),
      hoverTarget: 0,
      wasActive: false,
      hoverProgress: 0,
      leaveProgress: 1,
      jumpTarget: new THREE.Vector2(),
      jumpStage: 0,
      zoomVelocity: 0
    });
  }));

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.near = -1000;
    camera.far = 1000;
    camera.position.z = 1;
    camera.updateProjectionMatrix();
  }

  function render() {
    if (!running) return;
    const width = window.innerWidth;
    const height = window.innerHeight;

    items.forEach(item => {
      const rect = item.media.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < height && rect.right > 0 && rect.left < width;
      item.mesh.visible = visible;
      if (!visible) return;

      item.mesh.position.set(
        rect.left + rect.width * 0.5 - width * 0.5,
        height * 0.5 - rect.top - rect.height * 0.5,
        0
      );
      item.mesh.scale.set(rect.width, rect.height, 1);
      item.uniforms.uSize.value.set(rect.width, rect.height);
      item.uniforms.uRadius.value = width <= 700 ? 8 : 18;

      const active = pointer.insideWindow &&
        pointer.x >= rect.left && pointer.x <= rect.right &&
        pointer.y >= rect.top && pointer.y <= rect.bottom;

      item.hoverTarget = active ? 1 : 0;
      if (active && !item.wasActive) {
        item.hoverProgress = 0;
        item.jumpStage = 0;
        item.jumpTarget.set(0, 0);
      } else if (!active && item.wasActive) {
        item.leaveProgress = 0;
        // Keep a small amount of the last depth shift so it springs home.
        item.jumpTarget.copy(item.uniforms.uDirection.value).multiplyScalar(-0.28);
      }
      item.hoverProgress = THREE.MathUtils.clamp(
        item.hoverProgress + (active ? 1 / 60 : -1 / 45), 0, 1
      );
      item.leaveProgress = THREE.MathUtils.clamp(
        item.leaveProgress + (!active ? 1 / 60 : 1), 0, 1
      );
      const nextStage = item.hoverProgress < 0.2 ? 0 : item.hoverProgress < 0.3 ? 1 : 2;
      if (active && nextStage > item.jumpStage) {
        const angle = Math.random() * Math.PI * 2;
        const strength = nextStage === 1 ? 0.72 : 0.34;
        item.jumpTarget.set(Math.cos(angle), Math.sin(angle)).multiplyScalar(strength);
        item.jumpStage = nextStage;
      } else if (!active || item.hoverProgress > 0.3) {
        item.jumpTarget.multiplyScalar(0.92);
      }
      if (active) {
        item.directionTarget.set(
          THREE.MathUtils.clamp((pointer.x - rect.left) / rect.width - 0.5, -0.5, 0.5),
          THREE.MathUtils.clamp(0.5 - (pointer.y - rect.top) / rect.height, -0.5, 0.5)
        );
      } else {
        item.directionTarget.set(0, 0);
      }

      item.uniforms.uDirection.value.lerp(item.directionTarget, active ? 0.24 : 0.16);
      item.uniforms.uHover.value += (item.hoverTarget - item.uniforms.uHover.value) * (active ? 0.22 : 0.14);
      item.uniforms.uJump.value.lerp(item.jumpTarget, 0.2);

      const zoomTarget = active ? 1 : 0;
      item.zoomVelocity += (zoomTarget - item.uniforms.uZoom.value) * 0.16;
      item.zoomVelocity *= 0.76;
      item.uniforms.uZoom.value += item.zoomVelocity;
      const blurTarget = active
        ? Math.max(0, 1 - item.hoverProgress / 0.75)
        : Math.max(0, 1 - item.leaveProgress / 0.62);
      item.uniforms.uBlur.value += (blurTarget - item.uniforms.uBlur.value) * 0.2;
      item.wasActive = active;
    });

    renderer.render(scene, camera);
    frameId = requestAnimationFrame(render);
  }

  const start = () => {
    if (!enabled || running || document.hidden) return;
    running = true;
    frameId = requestAnimationFrame(render);
  };

  const stop = () => {
    running = false;
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const activate = () => {
    if (enabled && renderer.domElement.isConnected) return;

    enabled = true;
    if (!renderer.domElement.isConnected) {
      document.body.prepend(renderer.domElement);
    }
    resize();
    document.documentElement.classList.add('webgl-ready');

    const rect = projectsSection?.getBoundingClientRect();
    if (!projectsSection || (rect.bottom > -100 && rect.top < innerHeight + 100)) {
      start();
    }
  };

  const deactivate = () => {
    enabled = false;
    stop();
    document.documentElement.classList.remove('webgl-ready');
    renderer.domElement.remove();
  };

  renderer.domElement.addEventListener('webglcontextlost', () => {
    document.documentElement.classList.remove('webgl-ready');
  });

  resize();
  addEventListener('resize', resize, { passive: true });
  document.documentElement.classList.add('webgl-ready');

  if (projectsSection) {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    }, { rootMargin: '100px 0px', threshold: 0 });
    observer.observe(projectsSection);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else if (projectsSection?.getBoundingClientRect().bottom > -100 && projectsSection?.getBoundingClientRect().top < innerHeight + 100) start();
  });

  return { renderer, scene, items, start, stop, activate, deactivate };
}















