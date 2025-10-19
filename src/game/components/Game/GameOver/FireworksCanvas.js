import React, { useCallback, useEffect, useRef } from 'react';

const ROCKET_SPEED = 4.6;
const PARTICLE_COUNT = 240;
const CORE_JITTER = 8.1;
const BURST_SPEED_MIN = 1.9;
const BURST_SPEED_MAX = 4.4;
const UPWARD_BIAS_MIN = -3.6;
const UPWARD_BIAS_MAX = -2.2;
const BASE_RADIUS_MIN = 4.8;
const BASE_RADIUS_MAX = 6.4;
const CORE_DELAY_MIN = 2;
const CORE_DELAY_MAX = 6;
const EMBER_DELAY_MIN = 10;
const EMBER_DELAY_MAX = 20;
const BURST_DRAG = 0.975;
const EMBER_DRAG = 0.955;
const GRAVITY_BURST = 0.11;
const GRAVITY_EMBER = 0.34;
const MAX_FALL_SPEED = 5.9;
const MAX_CANVAS_OVERFLOW = 34;
const CORE_RANDOM_ACCEL = 0.07;
const GROUND_OFFSET = 28;
const EMBER_SHRINK_FAR = 0.05;
const EMBER_SHRINK_NEAR = 0.12;
const OUTLINE_LIFE_MIN = 16;
const OUTLINE_LIFE_MAX = 28;
const OUTLINE_DECAY_MIN = 0.4;
const OUTLINE_DECAY_MAX = 0.6;
const OUTLINE_BURST_MULTIPLIER = 1.18;
const OUTLINE_EMBER_MULTIPLIER = 1.55;

const ROCKET_PATHS = [
  { startXFactor: 0.18, targetXFactor: 0.42, targetYFactor: 0.44 },
  { startXFactor: 0.82, targetXFactor: 0.58, targetYFactor: 0.47 },
];

const NEON_PROFILES = [
  { base: 0, range: 14, satMin: 86, satMax: 100, lightMin: 62, lightMax: 74 },
  { base: 38, range: 12, satMin: 90, satMax: 100, lightMin: 68, lightMax: 80 },
  { base: 116, range: 16, satMin: 82, satMax: 96, lightMin: 62, lightMax: 76 },
  { base: 188, range: 18, satMin: 86, satMax: 98, lightMin: 64, lightMax: 78 },
  { base: 252, range: 18, satMin: 84, satMax: 96, lightMin: 62, lightMax: 74 },
  { base: 306, range: 16, satMin: 88, satMax: 100, lightMin: 64, lightMax: 78 },
];

const randBetween = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function FireworksCanvas({ isActive }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rocketsRef = useRef([]);
  const animationFrameIdRef = useRef(null);
  const relaunchTimeoutRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const isRelaunchingRef = useRef(false);

  const createExplosion = useCallback((x, y, colorProfile) => {
    const particles = particlesRef.current;
    const baseHue = colorProfile.base;

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + randBetween(-0.35, 0.35);
      const burstSpeed = randBetween(BURST_SPEED_MIN, BURST_SPEED_MAX);
      const baseRadius = randBetween(BASE_RADIUS_MIN, BASE_RADIUS_MAX);
      const jitter = randBetween(0, CORE_JITTER);
      const startX = x + Math.cos(angle) * jitter;
      const startY = y + Math.sin(angle) * jitter;
      const outlineInitialLife = randBetween(OUTLINE_LIFE_MIN, OUTLINE_LIFE_MAX);

      particles.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * 0.12,
        vy: Math.sin(angle) * 0.12,
        radius: baseRadius,
        baseRadius,
        h: baseHue + randBetween(-colorProfile.range * 0.5, colorProfile.range * 0.5),
        s: randBetween(colorProfile.satMin, colorProfile.satMax),
        l: randBetween(colorProfile.lightMin, colorProfile.lightMax),
        hueShift: baseHue,
        phase: 'core',
        life: 0,
        coreDelay: Math.floor(randBetween(CORE_DELAY_MIN, CORE_DELAY_MAX)),
        emberDelay: Math.floor(randBetween(EMBER_DELAY_MIN, EMBER_DELAY_MAX)),
        burstVx: Math.cos(angle) * burstSpeed,
        burstVy: Math.sin(angle) * burstSpeed + randBetween(UPWARD_BIAS_MIN, UPWARD_BIAS_MAX),
        rotation: randBetween(0, Math.PI * 2),
        spin: randBetween(-0.02, 0.02),
        pulseOffset: randBetween(0, Math.PI * 2),
        outlineLife: outlineInitialLife,
        outlineInitialLife,
        outlineDecay: randBetween(OUTLINE_DECAY_MIN, OUTLINE_DECAY_MAX),
      });
    }
  }, []);

  const launchRockets = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas;
    const palettes = shuffle(NEON_PROFILES).slice(0, ROCKET_PATHS.length);

    rocketsRef.current = ROCKET_PATHS.map((path, idx) => {
      const colorProfile = palettes[idx % palettes.length];
      const startX = width * path.startXFactor;
      const startY = height;
      const targetX = width * (path.targetXFactor + randBetween(-0.015, 0.015));
      const targetY = height * (path.targetYFactor + randBetween(-0.02, 0.02));
      const dx = targetX - startX;
      const dy = targetY - startY;
      const length = Math.hypot(dx, dy) || 1;
      return {
        x: startX,
        y: startY,
        vx: (dx / length) * ROCKET_SPEED,
        vy: (dy / length) * ROCKET_SPEED,
        radius: 2,
        color: '#101010',
        targetX,
        targetY,
        hue: randBetween(colorProfile.base - colorProfile.range * 0.45, colorProfile.base + colorProfile.range * 0.45),
        colorProfile,
      };
    });
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const groundY = canvas.height - GROUND_OFFSET;
    const rockets = rocketsRef.current;
    const particles = particlesRef.current;

    for (let i = rockets.length - 1; i >= 0; i -= 1) {
      const rocket = rockets[i];
      rocket.x += rocket.vx;
      rocket.y += rocket.vy;
      const dist = Math.hypot(rocket.targetX - rocket.x, rocket.targetY - rocket.y);

      if (dist < ROCKET_SPEED * 0.7) {
        rockets.splice(i, 1);
        createExplosion(rocket.targetX, rocket.targetY, rocket.colorProfile);
      } else {
        ctx.save();
        ctx.beginPath();
        const tailLength = 8;
        const tailX = rocket.x - rocket.vx * tailLength;
        const tailY = rocket.y - rocket.vy * tailLength;
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(rocket.x, rocket.y);
        ctx.strokeStyle = rocket.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      }
    }

    for (let i = particles.length - 1; i >= 0; i -= 1) {
      const p = particles[i];
      p.life += 1;

      if (p.phase === 'core') {
        p.outlineLife = Math.max(0.75, p.outlineLife - p.outlineDecay * 0.12);
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.vx += (Math.random() - 0.5) * CORE_RANDOM_ACCEL;
        p.vy += (Math.random() - 0.5) * CORE_RANDOM_ACCEL;
        p.x += p.vx;
        p.y += p.vy;
        const pulse = Math.sin(p.life * 0.18 + p.pulseOffset) * 0.8;
        p.radius = clamp(p.baseRadius + pulse, p.baseRadius * 0.65, p.baseRadius * 1.3);
        p.l = clamp(p.l + 0.15, 0, 96);

        if (p.life >= p.coreDelay) {
          p.phase = 'burst';
          p.life = 0;
          p.vx = p.burstVx;
          p.vy = p.burstVy;
          p.radius = p.baseRadius;
          p.outlineDecay *= OUTLINE_BURST_MULTIPLIER;
        }
      } else if (p.phase === 'burst') {
        p.outlineLife = Math.max(0.75, p.outlineLife - p.outlineDecay * 0.35);
        p.vx *= BURST_DRAG;
        p.vy *= BURST_DRAG;
        p.vy += GRAVITY_BURST;
        p.x += p.vx;
        p.y += p.vy;
        if (p.life > 6) {
          p.radius = Math.max(p.baseRadius * 0.34, p.radius - 0.08);
        }
        p.l = clamp(p.l - 0.7, 40, 92);

        if (p.life >= p.emberDelay) {
          p.phase = 'ember';
          p.life = 0;
          p.h = randBetween(24, 34);
          p.s = randBetween(30, 45);
          p.rotation = Math.PI / 4 + randBetween(-0.25, 0.25);
          p.spin = randBetween(-0.025, 0.025);
          p.outlineDecay *= OUTLINE_EMBER_MULTIPLIER;
        }
      } else if (p.phase === 'ember') {
        p.outlineLife = Math.max(0, p.outlineLife - p.outlineDecay * 1.05);
        p.vx *= EMBER_DRAG;
        p.vy *= EMBER_DRAG;
        p.vy = Math.min(p.vy + GRAVITY_EMBER, MAX_FALL_SPEED);
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.spin;

        const distToGround = groundY - p.y;
        const shrinkRate = distToGround < 110 ? EMBER_SHRINK_NEAR : EMBER_SHRINK_FAR;
        const minRadius = distToGround < 70 ? 0.05 : 0.12;
        p.radius = Math.max(minRadius, p.radius - shrinkRate);

        const darkenBoost = clamp((110 - distToGround) * 0.022, 0, 1.65);
        p.l = clamp(p.l - (0.84 + darkenBoost), 0, 48);
        p.s = clamp(p.s * 0.88, 0, 22);

        if (p.life > 16) {
          p.h = 0;
          p.s = 0;
        } else {
          p.h = clamp(p.h - 0.25, 18, 34);
        }
      }

      const reachedGround = p.y >= groundY;
      const shouldCull =
        p.l <= 1.2 ||
        reachedGround ||
        p.y - p.radius > canvas.height + MAX_CANVAS_OVERFLOW;

      if (shouldCull) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha =
        p.phase === 'ember'
          ? clamp(0.55 + (p.radius / p.baseRadius) * 0.25, 0.32, 0.88)
          : clamp(p.l / 90, 0.08, 1);
      const fillColor = `hsl(${Math.round(p.h)}, ${Math.round(p.s)}%, ${Math.round(p.l)}%)`;
      ctx.fillStyle = fillColor;

      if (p.phase === 'ember') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const size = p.radius * 1.6;
        ctx.fillRect(-size / 2, -size / 2, size, size);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, false);
        ctx.fill();
        if (p.phase !== 'ember' || p.outlineLife > 0) {
          const unclampedRatio = clamp(p.outlineLife / p.outlineInitialLife, 0, 1);
          const outlineRatio = p.phase !== 'ember' ? Math.max(unclampedRatio, 0.4) : unclampedRatio;
          const prevAlpha = ctx.globalAlpha;
          const strokeAlpha = clamp(prevAlpha * 0.9 + outlineRatio * 0.8, 0.35, 1);
          ctx.globalAlpha = strokeAlpha;
          ctx.strokeStyle = '#050505';
          ctx.lineWidth = Math.max(0.55, p.radius * (0.18 + outlineRatio * 0.12));
          ctx.stroke();
          ctx.globalAlpha = prevAlpha;
        }
      }

      ctx.restore();
    }

    if (
      isActive &&
      rockets.length === 0 &&
      particles.length === 0 &&
      !isRelaunchingRef.current
    ) {
      isRelaunchingRef.current = true;
      relaunchTimeoutRef.current = window.setTimeout(() => {
        launchRockets();
        isRelaunchingRef.current = false;
      }, 220);
    }

    animationFrameIdRef.current = window.requestAnimationFrame(animate);
  }, [isActive, createExplosion, launchRockets]);

  const setCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    if (!isActive) {
      particlesRef.current = [];
      rocketsRef.current = [];
    }

    const canvas = canvasRef.current;
    setCanvasSize();

    window.addEventListener('resize', setCanvasSize);

    if (isActive) {
      isRelaunchingRef.current = false;
      launchRockets();
      animationFrameIdRef.current = window.requestAnimationFrame(animate);
    }

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationFrameIdRef.current) {
        window.cancelAnimationFrame(animationFrameIdRef.current);
      }
      if (relaunchTimeoutRef.current) {
        window.clearTimeout(relaunchTimeoutRef.current);
      }
      particlesRef.current = [];
      rocketsRef.current = [];
    };
  }, [isActive, animate, launchRockets, setCanvasSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9998,
      }}
    />
  );
}

export default FireworksCanvas;
