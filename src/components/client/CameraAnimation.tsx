import React, { useState, useEffect } from 'react';
import { Eye, Shield, Radio, Sparkles, ZoomIn, Moon, Sun, RotateCw } from 'lucide-react';

export const CameraAnimation: React.FC = () => {
  const [angle, setAngle] = useState(0);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentTime, setCurrentTime] = useState('');

  // Clock for Morocco GMT+1
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Africa/Casablanca',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Smooth automatic panning oscillation between -28deg and +28deg
  useEffect(() => {
    if (!isScanning) return;
    let step = 0;
    const interval = setInterval(() => {
      step += 0.04;
      const computedAngle = Math.sin(step) * 26;
      setAngle(computedAngle);
    }, 50);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden text-left transition-all hover:shadow-2xl">
      {/* Top Header Bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-bold text-slate-900 tracking-wider">REC • DIRECT 4K</span>
          <span className="text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {currentTime || '12:00:00'} (Casablanca)
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            IA Active
          </span>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div 
        className={`relative aspect-4/3 w-full overflow-hidden transition-colors duration-500 ${
          isNightMode 
            ? 'bg-slate-900' 
            : 'bg-linear-to-b from-slate-100 via-slate-50 to-slate-100'
        }`}
      >
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${isNightMode ? '#38bdf8' : '#64748b'} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Dynamic Scanning Cone projection */}
        <div 
          className="absolute top-12 left-1/2 w-64 h-72 pointer-events-none transition-transform duration-100 origin-top -translate-x-1/2"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        >
          <div 
            className={`w-full h-full opacity-25 ${
              isNightMode 
                ? 'bg-linear-to-b from-cyan-400/50 via-emerald-400/20 to-transparent' 
                : 'bg-linear-to-b from-blue-500/40 via-blue-400/15 to-transparent'
            }`}
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
          {/* Laser scan line at the bottom of the cone */}
          <div 
            className={`w-full h-0.5 mx-auto -mt-1 rounded-full animate-pulse ${
              isNightMode ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : 'bg-blue-500 shadow-[0_0_8px_#3b82f6]'
            }`}
          />
        </div>

        {/* Realistic SVG Dome/Turret Camera mounted at the top center */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          {/* Ceiling Mount Base */}
          <div className="w-28 h-3.5 bg-slate-300 rounded-t-lg border-t border-slate-400 shadow-sm flex items-center justify-around px-3">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          </div>
          
          {/* Camera Upper Collar */}
          <div className="w-20 h-4 bg-linear-to-b from-white to-slate-200 border-x border-slate-300 shadow-sm"></div>

          {/* Rotating Camera Ball / Lens Turret */}
          <div 
            className="w-24 h-24 rounded-full bg-white border-2 border-slate-300 shadow-xl flex items-center justify-center relative transition-transform duration-100"
            style={{
              transform: `rotate(${angle}deg) scale(${zoomLevel === 1.5 ? 1.05 : 1})`,
            }}
          >
            {/* Dark optical ring */}
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700 shadow-inner relative overflow-hidden">
              {/* Glass reflection gradient */}
              <div className="absolute inset-0 bg-linear-to-tr from-transparent via-blue-500/20 to-cyan-300/30"></div>
              
              {/* Main Optical Glass Lens */}
              <div className="w-8 h-8 rounded-full bg-radial from-slate-950 via-slate-900 to-black border-2 border-slate-800 flex items-center justify-center relative shadow-inner">
                {/* Aperture core reflection */}
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/80 blur-[1px] animate-pulse"></div>
                <div className="absolute top-1 left-1.5 w-1 h-1 rounded-full bg-white/90"></div>
              </div>

              {/* Infrared LEDs ring */}
              <div className="absolute inset-1 pointer-events-none">
                <span className={`absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isNightMode ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></span>
                <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${isNightMode ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></span>
                <span className={`absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isNightMode ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></span>
                <span className={`absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${isNightMode ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`}></span>
              </div>
            </div>

            {/* Micro status LED on the ball */}
            <div className="absolute bottom-1 right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-300 animate-pulse"></div>
          </div>
        </div>

        {/* AI Detection Targets floating in the field of view */}
        <div className="absolute inset-0 pointer-events-none pt-24 px-6 flex flex-col justify-between pb-6">
          {/* Target 1 (Left) */}
          <div 
            className={`transition-all duration-300 self-start mt-8 ${
              angle < -5 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
            }`}
          >
            <div className={`p-2 rounded-lg border text-[10px] font-mono backdrop-blur-xs flex items-center gap-1.5 shadow-sm ${
              isNightMode 
                ? 'bg-slate-800/80 border-cyan-400/80 text-cyan-300' 
                : 'bg-white/85 border-blue-500 text-blue-700'
            }`}>
              <Shield className="w-3 h-3 text-emerald-500 shrink-0" />
              <span>Zone Portail • Sécurisée</span>
            </div>
          </div>

          {/* Target 2 (Right) */}
          <div 
            className={`transition-all duration-300 self-end mb-4 ${
              angle > 5 ? 'opacity-100 scale-100' : 'opacity-40 scale-95'
            }`}
          >
            <div className={`p-2 rounded-lg border text-[10px] font-mono backdrop-blur-xs flex items-center gap-1.5 shadow-sm ${
              isNightMode 
                ? 'bg-slate-800/80 border-emerald-400/80 text-emerald-300' 
                : 'bg-white/85 border-emerald-500 text-emerald-700'
            }`}>
              <Eye className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Humain Détecté • Confiance 99%</span>
            </div>
          </div>
        </div>

        {/* Crosshair HUD in the center */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
          <div className="w-16 h-16 border border-dashed border-slate-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-0.5 bg-slate-600"></div>
            <div className="w-0.5 h-2 bg-slate-600"></div>
          </div>
        </div>

        {/* Lower Info Bar inside viewport */}
        <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[10px] font-mono bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-slate-200/60 text-slate-700 dark:text-slate-300">
          <div>CAM-01 • ENTREE PRINCIPALE</div>
          <div className="flex items-center gap-2">
            <span>ANGLE : {Math.round(angle)}°</span>
            <span>•</span>
            <span>ZOOM : {zoomLevel}x</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-2">
          {/* Toggle Scanning */}
          <button
            onClick={() => setIsScanning(!isScanning)}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isScanning 
                ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Balayage panoramique automatique"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Balayage Auto' : 'Pause'}</span>
          </button>

          {/* Toggle Night Mode */}
          <button
            onClick={() => setIsNightMode(!isNightMode)}
            className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              isNightMode 
                ? 'bg-slate-900 text-white' 
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
            title="Vision nocturne Infrarouge"
          >
            {isNightMode ? <Moon className="w-3.5 h-3.5 text-yellow-300" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{isNightMode ? 'Mode Nuit (IR)' : 'Mode Jour'}</span>
          </button>
        </div>

        {/* Zoom Button */}
        <button
          onClick={() => setZoomLevel(zoomLevel === 1 ? 1.5 : 1)}
          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
          title="Zoom optique haute définition"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          <span>Zoom {zoomLevel === 1 ? '1.5x' : '1x'}</span>
        </button>
      </div>

      {/* Guarantee Footer */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span>Matériel garanti 2 ans au Maroc</span>
        <span className="font-semibold text-emerald-700">Conforme CNDP Maroc</span>
      </div>
    </div>
  );
};
