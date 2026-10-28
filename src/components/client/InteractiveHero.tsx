import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Shield, 
  ArrowRight, 
  Eye, 
  Crosshair,
  Volume2,
  VolumeX,
  RotateCcw
} from 'lucide-react';
import { captureLeadAndOpenWhatsApp } from '../../services/dataService';

interface InteractiveHeroProps {
  onGoToPricing?: () => void;
  onGoToDemo?: () => void;
}

export const InteractiveHero: React.FC<InteractiveHeroProps> = ({
  onGoToPricing,
  onGoToDemo
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction & Tracking States
  const [isHovering, setIsHovering] = useState(false);
  const [targetStats, setTargetStats] = useState({
    x: 0,
    y: 0,
    distance: '3.4m',
    status: 'SURVEILLANCE ACTIVE'
  });

  // Cursor & Physics Interpolation Refs
  const physicsRef = useRef({
    targetNormX: 0.1,
    targetNormY: 0.05,
    currentNormX: 0.1,
    currentNormY: 0.05,
    mouseScreenX: 0,
    mouseScreenY: 0,
    rafId: 0
  });

  const whatsappUrl = "https://wa.me/212661234567?text=Bonjour%20VigiCam%2C%20je%20souhaite%20un%20devis%20de%20vid%C3%A9osurveillance.";

  // Handle Mouse Movement across Window or Hero
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      
      const relX = e.clientX - rect.left;
      const relY = e.clientY - rect.top;

      physicsRef.current.mouseScreenX = relX;
      physicsRef.current.mouseScreenY = relY;

      const isDesktop = rect.width >= 1024;
      const cameraCenterX = isDesktop ? rect.width * 0.72 : rect.width * 0.5;
      const cameraCenterY = isDesktop ? rect.height * 0.45 : rect.height * 0.35;

      const dx = (relX - cameraCenterX) / (rect.width * 0.5);
      const dy = (relY - cameraCenterY) / (rect.height * 0.5);

      physicsRef.current.targetNormX = Math.max(-1, Math.min(1, dx));
      physicsRef.current.targetNormY = Math.max(-1, Math.min(1, dy));

      setTargetStats(prev => ({
        ...prev,
        x: Math.round(relX),
        y: Math.round(relY),
        distance: `${(2.2 + Math.abs(dx) * 2.8).toFixed(1)}m`
      }));
    };

    const handleWindowScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const rect = containerRef.current.getBoundingClientRect();
      // When user scrolls down past hero, rotate camera slightly down towards reading position
      if (rect.bottom < window.innerHeight) {
        const scrollFactor = Math.min(1, scrollY / (window.innerHeight * 1.5));
        physicsRef.current.targetNormY = Math.min(1, physicsRef.current.targetNormY + scrollFactor * 0.4);
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true });
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, []);

  // Main Render Loop for Canvas: Pure Black & White / Architectural Industrial Finish
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      // Smooth Physics Interpolation (lerp)
      const p = physicsRef.current;
      p.currentNormX += (p.targetNormX - p.currentNormX) * 0.08;
      p.currentNormY += (p.targetNormY - p.currentNormY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.48;
      const baseRadius = Math.min(width, height) * 0.38;

      // 1. Subtle Cone of Vision (Monochrome Neutral White/Gray)
      ctx.save();
      const beamTargetX = cx + p.currentNormX * width * 0.8;
      const beamTargetY = cy + p.currentNormY * height * 0.8 + 50;
      
      const coneGrad = ctx.createRadialGradient(cx, cy, 10, beamTargetX, beamTargetY, width * 0.6);
      coneGrad.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      coneGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
      coneGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const beamSpread = 140;
      ctx.lineTo(beamTargetX - beamSpread, beamTargetY);
      ctx.lineTo(beamTargetX + beamSpread, beamTargetY);
      ctx.closePath();
      ctx.fillStyle = coneGrad;
      ctx.fill();

      // Guidance Line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(beamTargetX, beamTargetY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 2. Ceiling Flange Mount (Pure Charcoal / White strokes)
      ctx.save();
      const flangeGrad = ctx.createLinearGradient(cx - baseRadius * 0.9, 0, cx + baseRadius * 0.9, 0);
      flangeGrad.addColorStop(0, '#09090b');
      flangeGrad.addColorStop(0.5, '#18181b');
      flangeGrad.addColorStop(1, '#09090b');
      
      ctx.beginPath();
      ctx.roundRect(cx - baseRadius * 0.85, cy - baseRadius * 1.05, baseRadius * 1.7, 24, [4, 4, 2, 2]);
      ctx.fillStyle = flangeGrad;
      ctx.fill();
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Fasteners
      const screwXs = [-0.65, -0.3, 0.3, 0.65];
      screwXs.forEach(sx => {
        ctx.beginPath();
        ctx.arc(cx + baseRadius * sx, cy - baseRadius * 1.05 + 12, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#000000';
        ctx.fill();
        ctx.strokeStyle = '#3f3f46';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Upper Gimbal Arm
      ctx.beginPath();
      ctx.moveTo(cx - baseRadius * 0.65, cy - baseRadius * 0.95);
      ctx.lineTo(cx - baseRadius * 0.5, cy - baseRadius * 0.35);
      ctx.lineTo(cx + baseRadius * 0.5, cy - baseRadius * 0.35);
      ctx.lineTo(cx + baseRadius * 0.65, cy - baseRadius * 0.95);
      ctx.closePath();
      ctx.fillStyle = '#18181b';
      ctx.fill();
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 3. Spherical Camera Body Dome
      ctx.save();
      const sphereGrad = ctx.createRadialGradient(
        cx - baseRadius * 0.25, 
        cy - baseRadius * 0.25, 
        baseRadius * 0.1, 
        cx, 
        cy, 
        baseRadius * 0.85
      );
      sphereGrad.addColorStop(0, '#27272a');
      sphereGrad.addColorStop(0.5, '#18181b');
      sphereGrad.addColorStop(1, '#09090b');

      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Horizontal gimbal groove line
      ctx.beginPath();
      ctx.ellipse(cx, cy + baseRadius * 0.15, baseRadius * 0.78, baseRadius * 0.18, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // 4. Moving Eye / Lens Turret that tracks mouse
      ctx.save();
      const maxLensOffset = baseRadius * 0.38;
      const lensCenterX = cx + p.currentNormX * maxLensOffset;
      const lensCenterY = cy + p.currentNormY * maxLensOffset * 0.7;
      const lensRadius = baseRadius * 0.42;

      // Outer bezel of moving eye
      const turretGrad = ctx.createRadialGradient(
        lensCenterX - lensRadius * 0.3,
        lensCenterY - lensRadius * 0.3,
        lensRadius * 0.1,
        lensCenterX,
        lensCenterY,
        lensRadius
      );
      turretGrad.addColorStop(0, '#18181b');
      turretGrad.addColorStop(0.7, '#09090b');
      turretGrad.addColorStop(1, '#000000');

      ctx.beginPath();
      ctx.arc(lensCenterX, lensCenterY, lensRadius, 0, Math.PI * 2);
      ctx.fillStyle = turretGrad;
      ctx.fill();
      ctx.strokeStyle = '#3f3f46';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Front Glass Element (Pure Deep Black + Neutral White Glare)
      const glassGrad = ctx.createRadialGradient(
        lensCenterX - lensRadius * 0.25,
        lensCenterY - lensRadius * 0.25,
        lensRadius * 0.05,
        lensCenterX,
        lensCenterY,
        lensRadius * 0.72
      );
      glassGrad.addColorStop(0, '#18181b');
      glassGrad.addColorStop(0.6, '#09090b');
      glassGrad.addColorStop(1, '#000000');

      ctx.beginPath();
      ctx.arc(lensCenterX, lensCenterY, lensRadius * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = glassGrad;
      ctx.fill();
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Core Pupil Aperture
      ctx.beginPath();
      ctx.arc(lensCenterX, lensCenterY, lensRadius * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();

      // Minimal White Specular Highlight
      ctx.beginPath();
      ctx.arc(lensCenterX - lensRadius * 0.22, lensCenterY - lensRadius * 0.22, lensRadius * 0.12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();

      // Status Indicator Dot (Monochrome White)
      ctx.beginPath();
      ctx.arc(lensCenterX, lensCenterY + lensRadius * 0.52, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();

      p.rafId = requestAnimationFrame(render);
    };

    // Canvas Resizing handler
    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    const physics = physicsRef.current;
    handleResize();
    window.addEventListener('resize', handleResize);
    physics.rafId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(physics.rafId);
    };
  }, []);

  return (
    <section 
      id="hero"
      ref={containerRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="relative min-h-[90vh] flex items-center bg-[#0A0A0B] text-white overflow-hidden py-16 sm:py-24 border-b border-white/8 text-left selection:bg-white selection:text-[#0A0A0B]"
    >
      {/* Background Architectural Grid Lines (Subtle Minimalist Neutral) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Typography & Conversion Action (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Minimal Editorial Kicker (No Pill Badges) */}
            <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Systèmes de Vidéosurveillance Certifiés · Maroc</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.08]">
              Sécurisez vos espaces avec une <br />
              <span className="font-semibold text-white">
                précision absolue.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-xl">
              Installation professionnelle de caméras 4K et systèmes de protection pour villas, résidences et commerces à Casablanca, Rabat, Marrakech et Tanger.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  captureLeadAndOpenWhatsApp({
                    source: 'hero',
                    title: 'Demande de devis express (Hero)',
                    notes: 'Initiation depuis le bouton d\'appel à l\'action principal'
                  });
                }}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2.5 cursor-pointer rounded-sm shadow-lg shadow-emerald-950/30 border border-emerald-500/30"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Demander un devis WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Temporairement désactivé : Bouton Aperçu Demo
              <button
                onClick={onGoToDemo}
                className="px-6 py-3.5 bg-black text-white font-medium text-sm hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/20 rounded"
              >
                <span>Aperçu de l'application</span>
              </button>
              */}
              <button
                onClick={onGoToPricing}
                className="px-6 py-3.5 bg-transparent hover:bg-white/5 text-neutral-200 hover:text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer border border-white/10 hover:border-white/30 rounded-sm"
              >
                <span>Consulter les tarifs (DH)</span>
              </button>
            </div>

            {/* Editorial Metadata Row */}
            <div className="pt-6 border-t border-neutral-800 grid grid-cols-3 gap-6 text-neutral-400 text-xs font-mono">
              <div>
                <span className="text-white font-semibold text-sm block">4K UHD</span>
                <span>Résolution optique</span>
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">&lt; 2h</span>
                <span>Intervention d'urgence</span>
              </div>
              <div>
                <span className="text-white font-semibold text-sm block">CNDP</span>
                <span>Conforme Loi 09-08</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Surveillance Camera (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            
            <div className="relative w-full max-w-[420px] aspect-square rounded-2xl bg-neutral-950 border border-neutral-800 p-4 shadow-2xl overflow-hidden group">
              
              {/* HTML5 Interactive Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-crosshair relative z-10"
              />

              {/* Corner Reticle Marks */}
              <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-white/30 pointer-events-none" />
              <div className="absolute top-3 right-3 w-3 h-3 border-t border-r border-white/30 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-white/30 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-white/30 pointer-events-none" />

              {/* Real-time Tracking Label Overlay (Monochrome) */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 bg-neutral-900/90 px-3 py-1.5 border border-neutral-800 z-20 pointer-events-none">
                <span className="flex items-center gap-1.5 text-white">
                  <Crosshair className="w-3 h-3" />
                  <span>SUIVI OPTIQUE ACTIF</span>
                </span>
                <span>DIST: {targetStats.distance}</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
