import React, { useState } from 'react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { 
  Home, 
  Search, 
  Wifi, 
  Battery, 
  Mic, 
  Video, 
  Camera as CameraIcon, 
  Play, 
  Pause, 
  Settings, 
  Maximize2, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const CameraLiveApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'doorbell' | 'ai'>('all');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeDate, setActiveDate] = useState('15');
  const [activeFeedId, setActiveFeedId] = useState(2);

  const feeds = [
    {
      id: 1,
      title: 'Entrée Principale (Villa Californie, Casa)',
      tag: 'Détection Humain',
      time: '12:19:49 PM',
      image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f0?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Portail & Allée Voitures (Rabat Souissi)',
      tag: 'Véhicule Identifié',
      time: '10:56:00 AM',
      image: 'https://images.unsplash.com/photo-1517430816045-df4b7de81a17?auto=format&fit=crop&w=1200&q=80',
    },
    {
      id: 3,
      title: 'Patio & Riad Intérieur (Marrakech)',
      tag: 'Capteur Mouvement',
      time: '11:34:50 AM',
      image: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      title: 'Jardin & Terrasse Arrière (Tanger)',
      tag: 'Vision Nocturne 4K',
      time: '11:28:15 AM',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      title: 'Quai de Dépôt (Ain Sebaa, Casablanca)',
      tag: 'Infrarouge 40m',
      time: '10:06:22 AM',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    }
  ];

  const currentFeed = feeds.find(f => f.id === activeFeedId) || feeds[0];

  return (
    <section id="demo" className="py-24 scroll-mt-20 bg-neutral-50 border-t border-black/10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="max-w-2xl mb-12 space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Interface Client · iOS & Android
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black leading-tight">
              Pilotez votre sécurité <span className="font-semibold">en direct.</span>
            </h2>
            <p className="text-sm text-neutral-600 font-normal leading-relaxed">
              Consultez vos caméras en temps réel depuis votre smartphone, sans abonnement mensuel et avec un chiffrement matériel sécurisé.
            </p>
          </div>
        </ScrollReveal>

        {/* Master Software UI Window (Monochrome Minimalist) */}
        <ScrollReveal direction="up" delay={150}>
          <div className="bg-white border border-black/15 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[580px]">
          
          {/* 1. Left Vertical Icon Sidebar */}
          <div className="w-14 bg-neutral-900 border-r border-neutral-800 flex flex-col items-center justify-between py-5 shrink-0 text-white">
            <div className="flex flex-col items-center gap-6">
              <button className="p-2 text-white bg-neutral-800 rounded">
                <Home className="w-4 h-4" />
              </button>
              <button className="p-2 text-neutral-400 hover:text-white">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="text-[10px] font-mono text-neutral-500">
              4K
            </div>
          </div>

          {/* 2. Main Live Player & Events Center Panel */}
          <div className="flex-1 flex flex-col p-6 bg-white overflow-hidden">
            
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-black/10 gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold tracking-tight text-black font-mono">
                  VigiCam / LIVE
                </span>
                
                {/* Event Category Filter Controls */}
                <div className="flex items-center gap-1 bg-neutral-100 p-1 border border-neutral-200 text-xs font-mono">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 transition-colors cursor-pointer ${
                      activeTab === 'all'
                        ? 'bg-black text-white'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setActiveTab('doorbell')}
                    className={`px-3 py-1 transition-colors cursor-pointer ${
                      activeTab === 'doorbell'
                        ? 'bg-black text-white'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    Portier
                  </button>
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`px-3 py-1 transition-colors cursor-pointer ${
                      activeTab === 'ai'
                        ? 'bg-black text-white'
                        : 'text-neutral-600 hover:text-black'
                    }`}
                  >
                    IA Détection
                  </button>
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3 text-xs font-mono text-neutral-600">
                <button 
                  onClick={() => setActiveFeedId(prev => (prev > 1 ? prev - 1 : feeds.length))}
                  className="hover:text-black flex items-center gap-1 cursor-pointer border border-neutral-300 px-2 py-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Précédente
                </button>
                <button 
                  onClick={() => setActiveFeedId(prev => (prev < feeds.length ? prev + 1 : 1))}
                  className="hover:text-black flex items-center gap-1 cursor-pointer border border-neutral-300 px-2 py-1"
                >
                  Suivante <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Video Player Display */}
            <div className="mt-4 relative bg-black aspect-video overflow-hidden border border-black/20 group">
              <img
                src={currentFeed.image}
                alt={currentFeed.title}
                className="w-full h-full object-cover"
              />

              {/* Top Controls Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-2 bg-black/80 px-2.5 py-1 font-mono text-[11px] border border-white/20">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-3.5 h-3.5" />
                  <span>100% · 4K UHD</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setIsMuted(!isMuted)} 
                    className="p-1.5 bg-black/80 hover:bg-black text-white cursor-pointer border border-white/20"
                    title="Micro"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    className="p-1.5 bg-black/80 hover:bg-black text-white cursor-pointer border border-white/20"
                    title="Enregistrer"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    className="p-1.5 bg-black/80 hover:bg-black text-white cursor-pointer border border-white/20"
                    title="Photo"
                  >
                    <CameraIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detection Box (Clean White) */}
              <div className="absolute top-1/4 left-1/4 w-44 h-28 border border-white bg-white/5 pointer-events-none p-2 flex flex-col justify-between">
                <span className="bg-white text-black text-[10px] font-mono font-bold px-1.5 py-0.5 w-fit">
                  {currentFeed.tag}
                </span>
                <span className="text-white text-[9px] font-mono self-end">
                  99.4% MATCH
                </span>
              </div>

              {/* Bottom Video Bar */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div className="bg-black/80 px-2.5 py-1 font-mono text-[11px] border border-white/20">
                  {currentFeed.time} · {currentFeed.title}
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 bg-white text-black hover:bg-neutral-200 cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-black" /> : <Play className="w-3.5 h-3.5 fill-black" />}
                  </button>
                  <button className="p-1.5 bg-black/80 text-white cursor-pointer border border-white/20">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Bar (Minimalist Monochrome) */}
            <div className="mt-4 pt-3 border-t border-black/10 flex items-center justify-between text-xs font-mono text-neutral-500">
              <span>TIMELINE : 08:00</span>
              <div className="flex-1 mx-4 h-1 bg-neutral-200 overflow-hidden">
                <div className="h-full bg-black w-2/3" />
              </div>
              <span>20:00 ENREGISTREMENT CONTINU</span>
            </div>

          </div>

          {/* 3. Right Camera Feed Selector List */}
          <div className="w-full md:w-80 bg-neutral-50 border-t md:border-t-0 md:border-l border-black/10 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-black/10 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-black font-semibold">
                  Flux Déployés ({feeds.length})
                </span>
                <span className="text-[11px] font-mono text-neutral-500">MAROC</span>
              </div>

              <div className="space-y-2">
                {feeds.map((feed) => {
                  const isSelected = feed.id === activeFeedId;
                  return (
                    <div
                      key={feed.id}
                      onClick={() => setActiveFeedId(feed.id)}
                      className={`p-2.5 border transition-all cursor-pointer flex items-center gap-3 ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-black border-neutral-200 hover:border-black'
                      }`}
                    >
                      <img 
                        src={feed.image} 
                        alt={feed.title} 
                        className="w-14 h-10 object-cover shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-medium truncate ${isSelected ? 'text-white' : 'text-black'}`}>
                          {feed.title}
                        </div>
                        <div className={`text-[10px] font-mono ${isSelected ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {feed.tag}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 text-[11px] font-mono text-neutral-500">
              CONFORME CNDP MAROC LOI 09-08
            </div>
          </div>

        </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
