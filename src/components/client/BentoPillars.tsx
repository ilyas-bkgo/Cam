import React from 'react';
import { Camera, ShieldCheck, Lock, ArrowUpRight } from 'lucide-react';

interface BentoPillarsProps {
  onGoToHub: (tab: 'installation' | 'depannage') => void;
}

export const BentoPillars: React.FC<BentoPillarsProps> = ({ onGoToHub }) => {
  return (
    <section id="services" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 font-mono">
            Excellence Technique
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            Conçu pour durer, opéré avec rigueur.
          </h2>
          <p className="text-sm text-zinc-400">
            Trois piliers fondamentaux qui distinguent nos installations de sécurité en France.
          </p>
        </div>

        {/* 3 Modern Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Installation */}
          <div className="rounded-2xl p-8 bg-zinc-900/30 border border-zinc-800/60 flex flex-col justify-between space-y-6 group hover:border-zinc-700/80 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <Camera className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Installation Invisible
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Étude précise des angles morts et passage de câbles 100% invisible. Optiques Sony Starvis 4K et intelligence artificielle AcuSense intégrée.
              </p>
            </div>
            <button
              onClick={() => onGoToHub('installation')}
              className="text-xs text-zinc-300 group-hover:text-white font-medium flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Estimer une installation</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>

          {/* Card 2: Dépannage */}
          <div className="rounded-2xl p-8 bg-zinc-900/30 border border-zinc-800/60 flex flex-col justify-between space-y-6 group hover:border-zinc-700/80 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Astreinte & Maintenance &lt; 2h
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Véhicules d'intervention approvisionnés en caméras et disques de secours. Déplacement immédiat en cas de coupure ou de vandalisme.
              </p>
            </div>
            <button
              onClick={() => onGoToHub('depannage')}
              className="text-xs text-zinc-300 group-hover:text-white font-medium flex items-center gap-1 cursor-pointer pt-2"
            >
              <span>Déclencher un dépannage</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>

          {/* Card 3: Conformité */}
          <div className="rounded-2xl p-8 bg-zinc-900/30 border border-zinc-800/60 flex flex-col justify-between space-y-6 group hover:border-zinc-700/80 transition-all">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100">
                Conformité CNIL & RGPD
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Masquage numérique certifié de la voie publique et des voisins. Dossier de déclaration en préfecture et panneaux légaux normalisés inclus.
              </p>
            </div>
            <div className="text-xs text-zinc-500 pt-2 font-mono">
              Certifié APSAD R82 • Conforme
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
