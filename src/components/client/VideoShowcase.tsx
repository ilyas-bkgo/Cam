import React, { useState, useRef, useEffect } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  ArrowUpRight,
  Shield,
  Eye,
  Crosshair,
  Sliders
} from 'lucide-react';

interface CinematicCase {
  id: string;
  number: string;
  title: string;
  clientType: string;
  location: string;
  videoUrl: string;
  posterUrl: string;
  resolution: string;
  framerate: string;
  optics: string;
  latency: string;
  fieldOfView: string;
  summary: string;
}

const CASES: CinematicCase[] = [
  {
    id: 'case-01',
    number: '01',
    title: 'Surveillance Périmétrique & Détection Véhicules',
    clientType: 'Résidentiel Haut Standing',
    location: 'Californie · Casablanca',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-at-night-in-the-city-4322-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80',
    resolution: '4K Ultra-HD',
    framerate: '60 FPS',
    optics: '2.8-12mm Motorisé F1.2',
    latency: '14 ms',
    fieldOfView: '112° Grand Angle',
    summary: 'Classification de véhicules en temps réel et lecture de plaques sous faible éclairage public sans projecteur éblouissant.'
  },
  {
    id: 'case-02',
    number: '02',
    title: 'Protection Riad & Périmètre Intérieur',
    clientType: 'Patrimoine & Villa Privée',
    location: 'Palmeraie · Marrakech',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-security-camera-recording-a-warehouse-42861-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f0?auto=format&fit=crop&w=1600&q=80',
    resolution: '4K HDR',
    framerate: '60 FPS',
    optics: '4mm Fixe Haute Définition',
    latency: '11 ms',
    fieldOfView: '98° Couverture Totale',
    summary: 'Lignes de franchissement virtuelles millimétrées avec discrimination intelligente des animaux et végétaux pour zéro fausse alerte.'
  },
  {
    id: 'case-03',
    number: '03',
    title: 'Contrôle Flux Entrepôt & Accès Quai',
    clientType: 'Logistique & Industrie',
    location: 'Zone Franche · Tanger Med',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cctv-camera-on-a-modern-street-42860-large.mp4',
    posterUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de81a17?auto=format&fit=crop&w=1600&q=80',
    resolution: '4K Panoramique',
    framerate: '30 FPS',
    optics: 'Double Capteur Synchronisé',
    latency: '18 ms',
    fieldOfView: '180° Immersion',
    summary: 'Enregistrement continu sous atmosphère maritime saline et vent violent. Châssis aluminium anodisé étanche certifié IP67.'
  }
];

export const VideoShowcase: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'clean' | 'telemetry'>('telemetry');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = CASES[activeIdx];

  // Awwwards-style editorial curtain transition between video clips
  const handleSelectCase = (idx: number) => {
    if (idx === activeIdx || isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      setActiveIdx(idx);
      setProgress(0);
      setIsTransitioning(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 400);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const dur = videoRef.current.duration || 1;
    setProgress((videoRef.current.currentTime / dur) * 100);
  };

  return (
    <section 
      id="cinematic" 
      className="py-24 sm:py-32 scroll-mt-20 bg-white text-black border-t border-black/10 text-left"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header (No badges, No pills, Minimalist Awwwards typography) */}
        <ScrollReveal direction="up" delay={0}>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-black/10">
            <div className="max-w-2xl space-y-4">
              <span className="text-xs font-mono tracking-widest uppercase text-neutral-500">
                Démonstration Vidéo · Enregistrement Réel
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-black leading-tight">
                Clarté optique <span className="font-semibold">4K native</span>, sans artifice.
              </h2>
              <p className="text-neutral-600 text-sm sm:text-base leading-relaxed font-normal">
                Visualisez la restitution vidéo réelle de nos installations sur le terrain au Maroc. Basculez d'un flux à l'autre avec une transition optique instantanée.
              </p>
            </div>

            {/* Minimal View Toggle */}
            <div className="flex items-center gap-2 self-start lg:self-end">
              <span className="text-xs font-mono text-neutral-400 mr-2">Affichage :</span>
              <button
                onClick={() => setViewMode('telemetry')}
                className={`px-3.5 py-1.5 text-xs font-mono transition-colors cursor-pointer border ${
                  viewMode === 'telemetry' 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                Télémétrie
              </button>
              <button
                onClick={() => setViewMode('clean')}
                className={`px-3.5 py-1.5 text-xs font-mono transition-colors cursor-pointer border ${
                  viewMode === 'clean' 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-neutral-300 hover:border-black'
                }`}
              >
                Flux Brut
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Video Theatre Area */}
        <ScrollReveal direction="up" delay={150}>
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Video Box (8 Columns) */}
          <div className="lg:col-span-8">
            <div 
              ref={containerRef}
              className="relative aspect-video w-full bg-black overflow-hidden border border-black/15 shadow-sm group"
            >
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                src={current.videoUrl}
                poster={current.posterUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
              />

              {/* Curtain wipe / cross-dissolve transition overlay (Awwwards style) */}
              <div 
                className={`absolute inset-0 bg-black transition-opacity duration-400 pointer-events-none ${
                  isTransitioning ? 'opacity-100' : 'opacity-0'
                }`}
              />

              {/* Overlay HUD Telemetry (clean black/white monochrome) */}
              {viewMode === 'telemetry' && (
                <div className="absolute inset-0 pointer-events-none p-5 flex flex-col justify-between">
                  {/* Top Bar Status */}
                  <div className="flex items-center justify-between text-xs font-mono text-white/90">
                    <div className="flex items-center gap-3 bg-black/75 px-3 py-1 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                      <span>FLUX {current.number} · {current.location}</span>
                    </div>
                    <div className="bg-black/75 px-3 py-1 border border-white/20">
                      <span>{current.resolution} · {current.framerate}</span>
                    </div>
                  </div>

                  {/* Minimal Focus Brackets */}
                  <div className="self-center w-48 h-32 border border-white/30 relative">
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 border-white" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t-2 border-r-2 border-white" />
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b-2 border-l-2 border-white" />
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 border-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white/60 rounded-full" />
                    </div>
                    <div className="absolute bottom-1 right-2 text-[10px] font-mono text-white/70">
                      REC · AES-256
                    </div>
                  </div>

                  {/* Bottom Telemetry Bar */}
                  <div className="flex items-center justify-between text-[11px] font-mono text-white/80">
                    <div className="bg-black/75 px-2.5 py-0.5 border border-white/20">
                      LATENCE: {current.latency}
                    </div>
                    <div className="bg-black/75 px-2.5 py-0.5 border border-white/20">
                      CHAMP: {current.fieldOfView}
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Scrubber & Controls */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent z-10">
                {/* Minimal line scrubber */}
                <div className="w-full bg-white/20 h-0.5 mb-3 overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="w-8 h-8 rounded bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors cursor-pointer"
                      title={isPlaying ? 'Pause' : 'Lecture'}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black ml-0.5" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-8 h-8 rounded border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                      title={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    </button>
                    <span className="font-mono text-xs text-white/90">
                      {current.title}
                    </span>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="w-8 h-8 rounded border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                    title="Plein écran"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Video Meta Info Footer */}
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-neutral-500 pt-3 border-t border-neutral-200">
              <div>OPTIQUE: {current.optics}</div>
              <div>CONFORME CNDP MAROC (LOI 09-08)</div>
            </div>
          </div>

          {/* Interactive Editorial Playlist (4 Columns) */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 block mb-3">
              Sélectionnez une séquence :
            </span>

            {CASES.map((item, idx) => {
              const isCurrent = idx === activeIdx;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCase(idx)}
                  className={`p-5 transition-all duration-300 border cursor-pointer text-left ${
                    isCurrent
                      ? 'bg-black text-white border-black shadow-md'
                      : 'bg-white text-black border-neutral-200 hover:border-black'
                  }`}
                >
                  <div className="flex items-baseline justify-between mb-2">
                    <span className={`text-xs font-mono ${isCurrent ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      PROJET / {item.number}
                    </span>
                    <span className={`text-[11px] font-mono ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {item.resolution}
                    </span>
                  </div>

                  <h3 className={`text-sm font-semibold mb-1 ${isCurrent ? 'text-white' : 'text-black'}`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-3 ${isCurrent ? 'text-neutral-300' : 'text-neutral-600'}`}>
                    {item.summary}
                  </p>

                  <div className={`flex items-center justify-between text-[11px] font-mono pt-3 border-t ${
                    isCurrent ? 'border-neutral-800 text-neutral-300' : 'border-neutral-100 text-neutral-500'
                  }`}>
                    <span>{item.location}</span>
                    <span className="flex items-center gap-1 font-semibold">
                      {isCurrent ? 'En cours' : 'Charger'}
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
