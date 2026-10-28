import React, { useState } from 'react';
import { Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { captureLeadAndOpenWhatsApp } from '../../services/dataService';

export const PricingSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'packs' | 'depannage'>('packs');
  const [lastCapturedCode, setLastCapturedCode] = useState<string | null>(null);

  const handleOrderPack = async (e: React.MouseEvent, p: typeof plans[0]) => {
    e.preventDefault();
    const numericPrice = parseInt(p.price.replace(/[^0-9]/g, '')) || 1490;
    const res = await captureLeadAndOpenWhatsApp({
      source: 'pricing',
      title: p.name,
      estimatedPrice: numericPrice,
      notes: `${p.target} · ${p.priceDetail}`
    });
    setLastCapturedCode(res.trackingCode);
    setTimeout(() => setLastCapturedCode(null), 6000);
  };

  const handleOrderDepannage = async (e: React.MouseEvent, d: typeof depannageServices[0]) => {
    e.preventDefault();
    const numericPrice = parseInt(d.price.replace(/[^0-9]/g, '')) || 250;
    const res = await captureLeadAndOpenWhatsApp({
      source: 'pricing',
      title: `Dépannage: ${d.title}`,
      estimatedPrice: numericPrice,
      notes: `${d.desc} (Délai: ${d.duration})`
    });
    setLastCapturedCode(res.trackingCode);
    setTimeout(() => setLastCapturedCode(null), 6000);
  };

  const plans = [
    {
      num: "01",
      name: "Pack Particulier (1 ou 2 Caméras)",
      target: "Appartements, porte d'entrée, petit riad ou garage",
      price: "Dès 1 490 DH",
      priceDetail: "1 caméra : 1 490 DH · 2 caméras : 2 200 DH",
      popular: false,
      whatsappMsg: "Bonjour VigiCam Maroc, je souhaite faire installer 1 ou 2 caméras chez moi (Pack Particulier dès 1 490 DH).",
      features: [
        "1 ou 2 Caméras HD / 2K (Wi-Fi ou Câblées PoE étanches)",
        "Vision nocturne nette & micro audio intégré",
        "Enregistrement local carte SD haute endurance (sans abonnement)",
        "Application smartphone gratuite (accès au Maroc et à l'étranger)",
        "Pose soignée et discrète sans fils apparents",
        "Garantie 2 ans pièces & main-d'œuvre au Maroc"
      ]
    },
    {
      num: "02",
      name: "Pack Villa & Résidence",
      target: "Villa avec jardin, piscine, portail & garage extérieur",
      price: "4 900 DH",
      priceDetail: "4 caméras 4K UHD + Enregistreur NVR local",
      popular: true,
      whatsappMsg: "Bonjour VigiCam Maroc, je souhaite des renseignements sur le Pack Villa 4 caméras à 4 900 DH.",
      features: [
        "4 Caméras dômes ou tubes 4K Ultra HD étanches IP67",
        "Enregistreur NVR local avec disque dur 2 To (1 mois d'historique)",
        "Câblage étanche et gainé haute résistance",
        "Vision nocturne infrarouge longue portée 30 mètres",
        "Application smartphone avec alertes détection humaine",
        "Garantie 2 ans pièces & main-d'œuvre au Maroc"
      ]
    },
    {
      num: "03",
      name: "Pack Commerce & Boutique",
      target: "Boutiques, cafés, restaurants, salons & bureaux",
      price: "7 500 DH",
      priceDetail: "6 caméras dômes anti-vandale + écran",
      popular: false,
      whatsappMsg: "Bonjour VigiCam Maroc, je souhaite un devis pour le Pack Commerce à 7 500 DH.",
      features: [
        "6 Caméras dômes anti-vandale IK10 avec zoom caisse",
        "Microphone audio haute sensibilité intégré",
        "Écran de contrôle direct au comptoir inclus",
        "Enregistreur NVR haute capacité avec disque 4 To",
        "Application multi-utilisateurs pour les gérants",
        "Facture avec TVA & déclaration conforme CNDP"
      ]
    },
    {
      num: "04",
      name: "Pack Entreprise & Dépôt",
      target: "Usines, hangars, parkings, chantiers & dépôts logistiques",
      price: "14 900 DH",
      priceDetail: "12 caméras 4K + NVR industriel 8 To",
      popular: false,
      whatsappMsg: "Bonjour VigiCam Maroc, je souhaite un devis d'installation industrielle (Pack Entreprise 14 900 DH).",
      features: [
        "12 Caméras 4K Ultra HD avec zoom optique motorisé",
        "Vision nocturne longue distance jusqu'à 80 mètres",
        "Armoire baie de brassage + Switch PoE professionnel",
        "Système d'alimentation secourue sur onduleur",
        "Formation de vos agents de sécurité sur site",
        "Contrat de maintenance préventive inclus la 1ère année"
      ]
    }
  ];

  const depannageServices = [
    {
      title: "Diagnostic & Devis sur Place",
      price: "250 DH",
      duration: "Sous 2h",
      desc: "Déplacement du technicien, test des liaisons RJ45/PoE, analyse du NVR et identification précise de la panne."
    },
    {
      title: "Reconfiguration & Accès Smartphone",
      price: "350 DH",
      duration: "Sous 1h",
      desc: "Remise en service de vos caméras sur vos téléphones après changement de box Fibre (Maroc Telecom, Inwi, Orange)."
    },
    {
      title: "Remplacement Caméra Grillée",
      price: "Dès 450 DH",
      duration: "Immédiat",
      desc: "Remplacement d'une caméra défectueuse par un modèle neuf garanti 2 ans compatible avec votre installation existante."
    },
    {
      title: "Nettoyage Optique & Rénovation Câblage",
      price: "Dès 600 DH",
      duration: "Demi-journée",
      desc: "Dépoussiérage des dômes, réfection des connecteurs RJ45 étanches et vérification des disques durs."
    }
  ];

  return (
    <section id="tarifs" className="py-24 scroll-mt-20 bg-[#FAFAF9] border-t border-black/8 text-left text-[#0A0A0B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-black/8">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                Grille Tarifaire · Dirhams Marocains (DH)
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#0A0A0B] leading-tight">
                Tarifs transparents, <br />
                <span className="font-semibold">pose clé en main incluse.</span>
              </h2>
              <p className="text-sm text-neutral-600 font-normal leading-relaxed">
                Tout est compris : matériel haute définition garanti 2 ans, câblage professionnel, configuration sur vos téléphones et formation.
              </p>
            </div>

            {/* Minimal Switcher Tabs (Monochrome) */}
            <div className="flex items-center gap-1 bg-[#F5F5F4] p-1 border border-black/8 rounded-sm text-xs font-mono self-start md:self-end">
              <button
                onClick={() => setActiveTab('packs')}
                className={`px-4 py-2 transition-colors cursor-pointer rounded-xs ${
                  activeTab === 'packs'
                    ? 'bg-[#0A0A0B] text-white font-semibold'
                    : 'text-neutral-600 hover:text-[#0A0A0B]'
                }`}
              >
                Packs Installation Clé en Main
              </button>
              <button
                onClick={() => setActiveTab('depannage')}
                className={`px-4 py-2 transition-colors cursor-pointer rounded-xs ${
                  activeTab === 'depannage'
                    ? 'bg-[#0A0A0B] text-white font-semibold'
                    : 'text-neutral-600 hover:text-[#0A0A0B]'
                }`}
              >
                Dépannage & Réparations
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Tab 1: Installation Packs */}
        {activeTab === 'packs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((p, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 100}>
                <div
                  className={`h-full p-6 border transition-all duration-300 flex flex-col justify-between rounded-sm ${
                    p.popular
                      ? 'bg-[#0A0A0B] text-white border-white/10 shadow-xl shadow-black/10'
                      : 'bg-white text-[#0A0A0B] border-black/8 hover:border-black/20 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-mono ${p.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        PACK / {p.num}
                      </span>
                      {p.popular && (
                        <span className="text-[10px] font-mono tracking-widest uppercase bg-white text-[#0A0A0B] px-2 py-0.5 font-bold rounded-xs">
                          RECOMMANDÉ
                        </span>
                      )}
                    </div>

                    <h3 className={`text-base font-semibold mb-2 ${p.popular ? 'text-white' : 'text-[#0A0A0B]'}`}>
                      {p.name}
                    </h3>

                    <p className={`text-xs leading-relaxed mb-6 ${p.popular ? 'text-neutral-300' : 'text-neutral-600'}`}>
                      {p.target}
                    </p>

                    <div className={`pb-6 mb-6 border-b ${p.popular ? 'border-neutral-800' : 'border-neutral-200'}`}>
                      <div className="text-2xl font-light tracking-tight">
                        <span className="font-semibold">{p.price}</span>
                      </div>
                      <div className={`text-[11px] font-mono mt-1 ${p.popular ? 'text-neutral-400' : 'text-neutral-500'}`}>
                        {p.priceDetail}
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {p.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-2 text-xs leading-snug">
                          <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${p.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                          <span className={p.popular ? 'text-neutral-300' : 'text-neutral-700'}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8">
                    <button
                      onClick={(e) => handleOrderPack(e, p)}
                      type="button"
                      className={`w-full py-3 text-xs font-semibold tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-all rounded-sm ${
                        p.popular
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/25 border border-emerald-500/30'
                          : 'bg-transparent hover:bg-[#0A0A0B] text-[#0A0A0B] hover:text-white border border-black/15 hover:border-[#0A0A0B]'
                      }`}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Commander via WhatsApp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Tab 2: Dépannage */}
        {activeTab === 'depannage' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {depannageServices.map((d, i) => (
              <ScrollReveal key={i} direction="up" delay={i * 100}>
                <div 
                  className="h-full p-6 bg-white border border-black/8 hover:border-black/20 transition-colors flex flex-col justify-between rounded-sm shadow-sm"
                >
                  <div>
                    <div className="text-xs font-mono text-neutral-500 mb-2">
                      DÉLAI : {d.duration}
                    </div>
                    <h3 className="text-sm font-semibold text-[#0A0A0B] mb-2">
                      {d.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                      {d.desc}
                    </p>
                    <div className="text-xl font-light text-[#0A0A0B] pb-4 border-b border-black/8">
                      <span className="font-semibold">{d.price}</span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={(e) => handleOrderDepannage(e, d)}
                      type="button"
                      className="w-full py-2.5 bg-transparent hover:bg-[#0A0A0B] text-[#0A0A0B] hover:text-white border border-black/15 hover:border-[#0A0A0B] text-xs font-semibold flex items-center justify-center gap-2 transition-all rounded-sm cursor-pointer"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      <span>Demander l'intervention WhatsApp</span>
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* Lead Capture Feedback Notification Toast */}
        {lastCapturedCode && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0A0A0B] text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono">Dossier créé en base : <strong className="text-white">{lastCapturedCode}</strong> · WhatsApp ouvert</span>
          </div>
        )}

      </div>
    </section>
  );
};
