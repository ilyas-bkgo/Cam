import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { PropertyType } from '../../types';

interface PacksSectionProps {
  onSelectPack: (packConfig: {
    propertyType: PropertyType;
    cameraCount: number;
    resolution: '2K' | '4K' | '8K_Ultra' | 'Thermique';
    storagePreference: 'nvr_local' | 'cloud_securise' | 'hybride';
    estimatedBudget: number;
  }) => void;
}

export const PacksSection: React.FC<PacksSectionProps> = ({ onSelectPack }) => {
  const packs = [
    {
      id: 'residentiel',
      title: 'Résidentiel',
      subtitle: 'Pour villas et maisons individuelles',
      price: '1 490 €',
      taxNote: 'TTC • Matériel & pose inclus',
      popular: false,
      propertyType: 'maison' as PropertyType,
      cameraCount: 4,
      resolution: '4K' as const,
      storagePreference: 'nvr_local' as const,
      budget: 1490,
      features: [
        '4 Caméras dômes ou bullet 4K Ultra HD',
        'Enregistreur NVR 4K avec disque 2 To',
        'Vision nocturne nette jusqu\'à 30m',
        'Application mobile iOS & Android',
        'Garantie pièces et main-d\'œuvre 3 ans'
      ]
    },
    {
      id: 'commerce',
      title: 'Commerce & PME',
      subtitle: 'Boutiques, bureaux et points de vente',
      price: '2 290 €',
      taxNote: 'HT • Déductible fiscalement',
      popular: true,
      propertyType: 'commerce' as PropertyType,
      cameraCount: 6,
      resolution: '4K' as const,
      storagePreference: 'hybride' as const,
      budget: 2290,
      features: [
        '6 Caméras dômes anti-vandale IK10',
        'Focus caisse enregistreuse & entrées',
        'Microphone audio bidirectionnel',
        'Moniteur de contrôle local inclus',
        'Dossier préfecture & panneaux légaux',
        'Support technique prioritaire 6j/7'
      ]
    },
    {
      id: 'entreprise',
      title: 'Entreprise & Entrepôt',
      subtitle: 'Logistique, hangars et sites industriels',
      price: '4 450 €',
      taxNote: 'HT • Solution évolutive',
      popular: false,
      propertyType: 'entrepot' as PropertyType,
      cameraCount: 12,
      resolution: '4K' as const,
      storagePreference: 'hybride' as const,
      budget: 4450,
      features: [
        '12 Caméras 4K avec vision couleur 24/7',
        'IA Détection intrusion franchissement',
        'Reconnaissance de plaques d\'immatriculation',
        'NVR Pro 16 Canaux + Disques redondants 8 To',
        'Switch PoE industriel sur onduleur secouru',
        'Contrat d\'astreinte sous 2h inclus 1 an'
      ]
    }
  ];

  return (
    <section id="packs" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            Solutions Clés en Main
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            Des configurations éprouvées, prêtes à l'emploi.
          </h2>
          <p className="text-base text-zinc-400">
            Chaque pack comprend le matériel professionnel, l'installation certifiée, le paramétrage réseau et la formation.
          </p>
        </div>

        {/* 3 Clean Modern Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packs.map((pack) => (
            <div
              key={pack.id}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-200 ${
                pack.popular
                  ? 'bg-zinc-900/70 border border-blue-500/40 shadow-xl shadow-blue-950/20'
                  : 'bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700/80'
              }`}
            >
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-zinc-100">{pack.title}</h3>
                    {pack.popular && (
                      <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        Populaire
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{pack.subtitle}</p>
                </div>

                <div className="pt-2">
                  <div className="text-3xl font-semibold text-zinc-100 tracking-tight">
                    {pack.price}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                    {pack.taxNote}
                  </div>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-zinc-800/60 text-xs text-zinc-300">
                  {pack.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <button
                  onClick={() => onSelectPack({
                    propertyType: pack.propertyType,
                    cameraCount: pack.cameraCount,
                    resolution: pack.resolution,
                    storagePreference: pack.storagePreference,
                    estimatedBudget: pack.budget
                  })}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    pack.popular
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200'
                  }`}
                >
                  <span>Configurer ce pack</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
