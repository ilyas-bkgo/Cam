import React from 'react';
import { Camera, Wrench, Shield, Check } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';

export const ServicesList: React.FC = () => {
  const services = [
    {
      num: "01",
      title: "Installation de Caméras Haute Définition",
      desc: "Étude d'angles morts sur plan ou in situ. Fourniture et pose soignée sans goulottes disgracieuses adaptées à vos revêtements intérieurs et extérieurs.",
      icon: Camera,
      points: [
        "1 ou 2 caméras pour appartement ou 4 à 32 caméras pour villa/société",
        "Vision 4K nette de jour comme de nuit sans projecteur aveuglant",
        "Visionnage direct sur smartphone au Maroc et lors de vos voyages",
        "Enregistreur local NVR sécurisé (sans abonnement mensuel)"
      ]
    },
    {
      num: "02",
      title: "Maintenance Préventive & Nettoyage Optique",
      desc: "Contrôle régulier pour garantir un enregistrement continu et protéger les modules contre les chaleurs extrêmes et la poussière marocaine.",
      icon: Shield,
      points: [
        "Dépoussiérage et décontamination des lentilles optiques",
        "Test d'intégrité des disques durs d'enregistrement (S.M.A.R.T)",
        "Mise à jour firmware et durcissement réseau anti-intrusion",
        "Vérification des blocs d'alimentation et des switchs PoE"
      ]
    },
    {
      num: "03",
      title: "Dépannage d'Urgence & Remplacement Express",
      desc: "Écran noir, perte de connexion Wi-Fi Fibre, mot de passe égaré ou câble sectionné ? Nos techniciens interviennent sous 2h ouvrées.",
      icon: Wrench,
      points: [
        "Diagnostic complet avant toute intervention",
        "Remplacement immédiat des optiques endommagées",
        "Reconnexion des applications mobiles (Inwi, Maroc Telecom, Orange)",
        "Assistance technique 7j/7 pour les urgences professionnelles"
      ]
    }
  ];

  return (
    <section id="services" className="py-24 scroll-mt-20 bg-[#FAFAF9] text-[#0A0A0B] text-left border-t border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="max-w-2xl mb-16 space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
              Expertise & Prestations · Maroc
            </span>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#0A0A0B] leading-tight">
              Installation, maintenance et <br />
              <span className="font-semibold">dépannage sous 2h.</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
              Interventions certifiées pour particuliers dès une caméra d'entrée et parcs complets d'entreprises.
            </p>
          </div>
        </ScrollReveal>

        {/* 3 Grid Columns (Pure Monochrome & White Card with Thin Borders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((item, i) => {
            const Icon = item.icon;
            return (
              <ScrollReveal key={i} direction="up" delay={i * 120}>
                <div 
                  className="h-full p-8 bg-white border border-black/8 hover:border-black/20 transition-all duration-300 flex flex-col justify-between rounded-sm shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-mono text-neutral-400">
                        SERVICE / {item.num}
                      </span>
                      <div className="w-9 h-9 rounded-sm bg-[#0A0A0B] text-white flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-[#0A0A0B] mb-3 leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-normal">
                      {item.desc}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-black/8">
                      {item.points.map((pt, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2.5 text-xs text-neutral-700">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-black/8 text-xs font-mono text-neutral-400">
                    INTERVENTION SUR SITE 7J/7
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

