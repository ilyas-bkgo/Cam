import React, { useEffect, useRef, useState } from 'react';

interface FloatingCameraWatcherProps {
  onBackToTop?: () => void;
}

export const FloatingCameraWatcher: React.FC<FloatingCameraWatcherProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOnHero, setIsOnHero] = useState(true);

  const physicsRef = useRef({
    currentX: typeof window !== 'undefined' ? window.innerWidth * 0.75 : 600,
    currentY: typeof window !== 'undefined' ? window.innerHeight * 0.35 : 250,
    targetX: typeof window !== 'undefined' ? window.innerWidth * 0.75 : 600,
    targetY: typeof window !== 'undefined' ? window.innerHeight * 0.35 : 250,
    currentAngle: 0,
    targetAngle: 0,
    mouseX: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 400,
    mouseY: typeof window !== 'undefined' ? window.innerHeight * 0.5 : 300,
    time: 0,
    hasMoved: false
  });

  // Track if we are currently on the hero section
  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // If bottom of hero section is still well within viewport, we are on hero
        setIsOnHero(rect.bottom > 180);
      } else {
        // Fallback: top 500px is considered hero section
        setIsOnHero(window.scrollY < 500);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const p = physicsRef.current;
      p.mouseX = e.clientX;
      p.mouseY = e.clientY;
      p.hasMoved = true;

      // Safe ergonomic offset: Camera stays comfortably ~55px away from cursor
      // Never overlaps or covers whatever the user is hovering, reading, or clicking
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      // Position to the left if cursor is on right half, else to the right
      const offX = e.clientX > winW - 130 ? -65 : (e.clientX < 130 ? 65 : -58);
      // Position above if cursor is on bottom half, else below
      const offY = e.clientY > winH - 130 ? -65 : (e.clientY < 130 ? 65 : -58);

      p.targetX = Math.max(20, Math.min(winW - 75, e.clientX + offX));
      p.targetY = Math.max(20, Math.min(winH - 75, e.clientY + offY));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        handleMouseMove({ clientX: t.clientX, clientY: t.clientY } as MouseEvent);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // 60 FPS Render Loop for smooth spring physics and directional tracking
  useEffect(() => {
    let animId = 0;
    let isRunning = true;
    const container = containerRef.current;
    if (!container) return;

    const render = () => {
      if (!isRunning) return;

      const p = physicsRef.current;
      p.time += 0.035;

      // Smooth lag / lerp towards target so camera floats behind cursor naturally
      const lerpSpeed = 0.085;
      p.currentX += (p.targetX - p.currentX) * lerpSpeed;
      p.currentY += (p.targetY - p.currentY) * lerpSpeed;

      // Subtle atmospheric hover oscillation (organic floating sentinel effect)
      const hoverY = Math.sin(p.time) * 3;
      const hoverX = Math.cos(p.time * 0.8) * 2;

      const finalX = p.currentX + hoverX;
      const finalY = p.currentY + hoverY;

      // Center of camera icon is at finalX + 26, finalY + 26
      const camCenterX = finalX + 26;
      const camCenterY = finalY + 26;

      // Angle from camera center directly towards cursor
      const dx = p.mouseX - camCenterX;
      const dy = p.mouseY - camCenterY;
      p.targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI;

      // Angular lerp avoiding full 360-wrap jumps
      let angleDiff = p.targetAngle - p.currentAngle;
      while (angleDiff < -180) angleDiff += 360;
      while (angleDiff > 180) angleDiff -= 360;
      p.currentAngle += angleDiff * 0.12;

      // Apply transformation (Smooth hardware-accelerated translate & rotate)
      container.style.transform = `translate3d(${finalX}px, ${finalY}px, 0) rotate(${p.currentAngle}deg)`;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 z-50 pointer-events-none select-none will-change-transform hidden sm:block transition-all duration-500 ease-out ${
        isOnHero
          ? 'opacity-0 scale-50 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        transform: 'translate3d(0, 0, 0)',
        width: '52px',
        height: '52px',
      }}
    >
      {/* 
        Ultra-clean Modern Security CCTV Camera SVG:
        - Sleek dark body with white contrast hairline borders
        - Oriented facing the right (0 deg) so rotate(angle) points the lens directly at cursor
        - Glare reflection and tiny blinking white recording LED
      */}
      <svg
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[52px] h-[52px] drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)]"
      >
        {/* Wall Mount Base / Arm Bracket (Left anchor) */}
        <path
          d="M 6 18 L 10 18 L 10 34 L 6 34 Z"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path
          d="M 10 24 L 16 24 L 16 28 L 10 28 Z"
          fill="#171717"
          stroke="#FFFFFF"
          strokeWidth="1"
        />

        {/* Pivot Joint Swivel */}
        <circle
          cx="16"
          cy="26"
          r="4.5"
          fill="#0A0A0A"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />

        {/* Articulated Extension Arm */}
        <path
          d="M 16 24 L 23 21 L 23 31 L 16 28 Z"
          fill="#1A1A1A"
          stroke="#FFFFFF"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />

        {/* Main Camera Housing (Sleek CCTV Beveled Bullet Body) */}
        <path
          d="M 23 17 L 39 15 L 39 37 L 23 35 Z"
          fill="#050505"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />

        {/* Protective Sunhood / Weather Visor (Top edge) */}
        <path
          d="M 21 16 L 43 13 L 43 17 L 23 18 Z"
          fill="#171717"
          stroke="#FFFFFF"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Front Lens Ring / Bezel */}
        <path
          d="M 39 18 L 42 19 L 42 33 L 39 34 Z"
          fill="#1F1F1F"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />

        {/* Front Lens Convex Glass Element */}
        <path
          d="M 42 20 C 44 23, 44 29, 42 32 Z"
          fill="#000000"
          stroke="#FFFFFF"
          strokeWidth="1.3"
        />

        {/* Inner Optical Pupil (Aperture) */}
        <ellipse
          cx="41.5"
          cy="26"
          rx="1.5"
          ry="3"
          fill="#FFFFFF"
          fillOpacity="0.85"
        />

        {/* Glass Specular Highlight (Crisp White Reflection Glint) */}
        <path
          d="M 40 22 C 41.2 23, 41.2 25, 40 25.5"
          stroke="#FFFFFF"
          strokeWidth="1"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />

        {/* Active Surveillance Status LED Indicator (Blinks pure white) */}
        <circle
          cx="36"
          cy="19"
          r="1.6"
          fill="#FFFFFF"
          className="animate-pulse"
        />
        <circle
          cx="36"
          cy="19"
          r="3"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeOpacity="0.4"
          className="animate-ping"
        />
      </svg>
    </div>
  );
};
