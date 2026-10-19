import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

interface BeatRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  color: string;
  alpha: number;
  decay: number;
}

const BRAND_PALETTE = [
  "#F28C00", // Beat Orange
  "#FFB347", // Honey Gold
  "#B8420B", // Rhythm Rust
  "#FF6B4A", // Coral Spark
  "#FFE0B2", // Warm Cream Spark
];

export const RhythmBeatParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];
    const beatRings: BeatRing[] = [];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Spawn a rhythmic beat ripple with tiny spark bursts
    const triggerBeat = (targetX?: number, targetY?: number) => {
      // Pick random location around central logo area or screen center
      const cx = targetX ?? width * 0.5 + (Math.random() - 0.5) * Math.min(width * 0.6, 320);
      const cy = targetY ?? height * 0.5 + (Math.random() - 0.5) * Math.min(height * 0.35, 220);

      const color = BRAND_PALETTE[Math.floor(Math.random() * BRAND_PALETTE.length)];

      // 1. Expanding soundwave / beat ripple ring
      beatRings.push({
        x: cx,
        y: cy,
        radius: 6,
        maxRadius: 40 + Math.random() * 30,
        color,
        alpha: 0.6,
        decay: 0.015 + Math.random() * 0.008,
      });

      // 2. Minimalist star/spark particles bursting along the beat
      const sparkCount = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.4;
        const speed = 1.2 + Math.random() * 2.2;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 0.85,
          color: BRAND_PALETTE[Math.floor(Math.random() * BRAND_PALETTE.length)],
          size: 1.5 + Math.random() * 1.8,
          decay: 0.02 + Math.random() * 0.015,
        });
      }
    };

    // Auto-beat intervals (simulating musical drum/tempo beat: 1.2s to 2s)
    let lastBeatTime = Date.now();
    let nextBeatInterval = 1400;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const now = Date.now();
      if (now - lastBeatTime > nextBeatInterval) {
        triggerBeat();
        lastBeatTime = now;
        nextBeatInterval = 1200 + Math.random() * 900;
      }

      // Draw and update beat ripple rings
      for (let i = beatRings.length - 1; i >= 0; i--) {
        const ring = beatRings[i];
        ring.radius += 1.2;
        ring.alpha -= ring.decay;

        if (ring.alpha <= 0 || ring.radius >= ring.maxRadius) {
          beatRings.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = Math.max(0, ring.alpha);
        ctx.stroke();
        ctx.restore();
      }

      // Draw and update sparkle particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // soft friction
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};
