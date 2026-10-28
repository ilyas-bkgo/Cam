import React, { useState } from 'react';
import { 
  Building2, 
  Home, 
  Store, 
  Warehouse, 
  ShieldCheck, 
  Cpu, 
  Eye, 
  HardDrive, 
  Smartphone, 
  Zap, 
  Check, 
  ArrowRight, 
  CheckCircle2, 
  Copy,
  Sliders,
  Sparkles
} from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { PropertyType, ResolutionType, StorageType } from '../../types';
import { captureLeadAndOpenWhatsApp } from '../../services/dataService';

export const QuoteConfigurator: React.FC = () => {
  // Step 1: Property
  const [propertyType, setPropertyType] = useState<PropertyType>('maison');
  const [city, setCity] = useState('Casablanca');

  // Step 2: Cameras & Tech
  const [cameraCount, setCameraCount] = useState<number>(4);
  const [resolution, setResolution] = useState<ResolutionType>('4K');
  const [storage, setStorage] = useState<StorageType>('nvr_local');
  const [needsNightColor, setNeedsNightColor] = useState(true);
  const [needsAiDetection, setNeedsAiDetection] = useState(true);
  const [includeUps, setIncludeUps] = useState(false);

  // Client Optional Meta
  const [clientName, setClientName] = useState('');
  const [notes, setNotes] = useState('');

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Calculate live estimate in Moroccan Dirhams (DH)
  const calculateEstimate = () => {
    let unitCamPrice = 380; // 4K default
    if (resolution === '2K') unitCamPrice = 290;
    if (resolution === '4K') unitCamPrice = 420;
    if (resolution === '8K_Ultra') unitCamPrice = 750;
    if (resolution === 'Thermique') unitCamPrice = 1800;

    const laborPerCam = 180; // Cable run & setup

    // NVR & Storage cost in DH
    let storageCost = 900;
    if (cameraCount > 4) storageCost = 1450;
    if (cameraCount > 8) storageCost = 2200;
    if (cameraCount > 16) storageCost = 3800;

    if (storage === 'cloud_securise') storageCost += 350;
    if (storage === 'hybride') storageCost += 500;

    let total = (unitCamPrice + laborPerCam) * cameraCount + storageCost;

    if (needsNightColor) total += cameraCount * 45;
    if (needsAiDetection) total += cameraCount * 60;
    if (includeUps) total += 650; // Inverter

    return Math.round(total);
  };

  const estimatedTotal = calculateEstimate();

  const handleLaunchWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const propLabel = 
      propertyType === 'maison' ? 'Villa / Maison' :
      propertyType === 'appartement' ? 'Appartement' :
      propertyType === 'commerce' ? 'Commerce / Magasin' :
      propertyType === 'entrepot' ? 'Entrepôt / Dépôt' : 'Autre bien';

    const techSummary = [
      `${cameraCount} caméras ${resolution}`,
      needsNightColor ? 'Vision nocturne couleur' : null,
      needsAiDetection ? 'IA détection silhouettes/véhicules' : null,
      storage === 'nvr_local' ? 'NVR local sécurisé' : storage,
      includeUps ? 'Onduleur anti-coupure' : null,
      notes ? `Note: ${notes}` : null
    ].filter(Boolean).join(' · ');

    try {
      const res = await captureLeadAndOpenWhatsApp({
        source: 'configurator',
        title: `Devis Configuré (${propLabel})`,
        propertyType,
        cameraCount,
        estimatedPrice: estimatedTotal,
        city,
        clientName: clientName.trim() || undefined,
        notes: techSummary
      });

      setGeneratedCode(res.trackingCode);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const propertyOptions: { id: PropertyType; label: string; sub: string; icon: any }[] = [
    { id: 'maison', label: 'Villa & Maison', sub: 'Jardin, portail, piscine & périmètre', icon: Home },
    { id: 'appartement', label: 'Appartement', sub: 'Porte d\'entrée & balcon privé', icon: Building2 },
    { id: 'commerce', label: 'Commerce & Boutique', sub: 'Caisse, rayon, salon & accès clients', icon: Store },
    { id: 'entrepot', label: 'Entrepôt & Dépôt', sub: 'Quai de déchargement & grande surface', icon: Warehouse },
  ];

  const cameraCounts = [2, 4, 8, 16];

  const cities = ['Casablanca', 'Rabat & Salé', 'Marrakech', 'Tanger', 'Agadir', 'Autre ville au Maroc'];

  return (
    <section id="configurateur" className="py-24 scroll-mt-20 bg-white text-black border-t border-black/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={0}>
          <div className="max-w-3xl mb-16 text-left space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[11px] font-mono tracking-wider uppercase rounded-full">
              <Sliders className="w-3 h-3 text-[#25D366]" />
              <span>Simulateur Interactif en 3 Étapes</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-black">
              Configurez votre installation sur-mesure.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
              Obtenez une estimation claire et transparente en Dirhams Marocains (DH), matériel certifié et pose professionnelle comprise.
            </p>
          </div>
        </ScrollReveal>

        {/* 3-Step Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Column: Interactive Inputs (Steps 1 & 2) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* STEP 1: Type de Bien */}
            <ScrollReveal direction="up" delay={50}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-mono flex items-center justify-center font-bold">1</span>
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-900">
                      Type de bien à protéger
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">Étape 1/3</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {propertyOptions.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = propertyType === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPropertyType(opt.id)}
                        className={`p-4 border text-left transition-all cursor-pointer rounded-sm flex flex-col justify-between ${
                          isSelected
                            ? 'border-black bg-neutral-950 text-white shadow-sm ring-1 ring-black'
                            : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-3">
                          <IconComp className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-neutral-700'}`} />
                          {isSelected && <Check className="w-4 h-4 text-[#25D366]" />}
                        </div>
                        <div>
                          <span className="text-sm font-semibold block">{opt.label}</span>
                          <span className={`text-xs block mt-1 leading-snug ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            {opt.sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* City selector */}
                <div className="pt-2">
                  <label className="text-xs font-mono text-neutral-600 block mb-1.5">
                    Localisation de votre projet :
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {cities.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCity(c)}
                        className={`px-3 py-1.5 text-xs font-mono rounded-sm border transition-colors cursor-pointer ${
                          city === c
                            ? 'bg-neutral-100 border-black text-black font-semibold'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* STEP 2: Cameras Count & Technology */}
            <ScrollReveal direction="up" delay={100}>
              <div className="space-y-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs font-mono flex items-center justify-center font-bold">2</span>
                    <h3 className="text-sm font-semibold tracking-wide uppercase text-neutral-900">
                      Équipements & Technologie
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-neutral-400">Étape 2/3</span>
                </div>

                {/* Camera Count Selector */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-600 mb-2">
                    <span>Nombre de caméras souhaitées :</span>
                    <strong className="text-black text-sm">{cameraCount} Caméras</strong>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {cameraCounts.map((count) => (
                      <button
                        key={count}
                        type="button"
                        onClick={() => setCameraCount(count)}
                        className={`py-3 border text-center transition-all cursor-pointer rounded-sm ${
                          cameraCount === count
                            ? 'bg-black text-white border-black font-bold ring-1 ring-black'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-black'
                        }`}
                      >
                        <span className="text-base block">{count}</span>
                        <span className="text-[10px] font-mono opacity-70 block">
                          {count === 2 ? 'Essentiel' : count === 4 ? 'Optimal' : count === 8 ? 'Complet' : 'Grand site'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Optics Resolution */}
                <div>
                  <span className="text-xs font-mono text-neutral-600 block mb-2">Résolution des capteurs :</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '2K', name: '2K QHD', detail: 'Netteté standard' },
                      { id: '4K', name: '4K Ultra HD', detail: 'Zoom & Plaques' },
                      { id: '8K_Ultra', name: '8K Ultra Pro', detail: 'Haute précision' },
                      { id: 'Thermique', name: 'Thermique', detail: 'Vision brouillard/nuit' },
                    ].map((res) => (
                      <button
                        key={res.id}
                        type="button"
                        onClick={() => setResolution(res.id as ResolutionType)}
                        className={`p-2.5 border text-left transition-colors cursor-pointer rounded-sm ${
                          resolution === res.id
                            ? 'border-black bg-neutral-900 text-white'
                            : 'border-neutral-200 bg-white text-black hover:border-neutral-400'
                        }`}
                      >
                        <span className="text-xs font-semibold block">{res.name}</span>
                        <span className={`text-[10px] font-mono block ${resolution === res.id ? 'text-neutral-400' : 'text-neutral-500'}`}>
                          {res.detail}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Toggles */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-mono text-neutral-600 block mb-1">Options de sécurité avancée :</span>
                  
                  <label className="flex items-center justify-between p-3 border border-neutral-200 bg-neutral-50 rounded-sm cursor-pointer hover:border-neutral-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <Eye className="w-4 h-4 text-black shrink-0" />
                      <div>
                        <span className="text-xs font-semibold block">Vision Nocturne Pleine Couleur (Starlight 24/7)</span>
                        <span className="text-[11px] text-neutral-500 block">Capteur à ouverture F1.0 permettant la couleur même dans l'obscurité totale.</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={needsNightColor}
                      onChange={(e) => setNeedsNightColor(e.target.checked)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-neutral-200 bg-neutral-50 rounded-sm cursor-pointer hover:border-neutral-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <Cpu className="w-4 h-4 text-black shrink-0" />
                      <div>
                        <span className="text-xs font-semibold block">Analyse IA Véhicules & Silhouettes Humaines</span>
                        <span className="text-[11px] text-neutral-500 block">Filtre 98% des fausses alertes (animaux, feuilles, vent).</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={needsAiDetection}
                      onChange={(e) => setNeedsAiDetection(e.target.checked)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 border border-neutral-200 bg-neutral-50 rounded-sm cursor-pointer hover:border-neutral-400 transition-colors">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-black shrink-0" />
                      <div>
                        <span className="text-xs font-semibold block">Onduleur Haute Sécurité (Protection coupure 220V)</span>
                        <span className="text-[11px] text-neutral-500 block">Maintient la vidéosurveillance active même si l'alimentation est coupée.</span>
                      </div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={includeUps}
                      onChange={(e) => setIncludeUps(e.target.checked)}
                      className="w-4 h-4 accent-black cursor-pointer"
                    />
                  </label>
                </div>

              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: STEP 3 Summary Card & Immediate WhatsApp Action */}
          <div className="lg:col-span-5 sticky top-24">
            <ScrollReveal direction="up" delay={150}>
              <div className="p-6 sm:p-8 bg-neutral-950 text-white border border-neutral-800 shadow-2xl rounded-sm space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">
                      Étape 3/3 · Récapitulatif
                    </span>
                    <h3 className="text-lg font-medium text-white">
                      Estimation Immédiate
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 bg-[#25D366]/10 text-[#25D366] text-xs font-mono border border-[#25D366]/30 rounded">
                    Sans engagement
                  </span>
                </div>

                {/* Pricing display */}
                <div className="space-y-1">
                  <span className="text-xs font-mono text-neutral-400">Total estimé tout compris :</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-light tracking-tight text-white font-mono">
                      {estimatedTotal.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-lg font-mono text-[#25D366] font-semibold">DH</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 pt-1">
                    Comprend : caméras, câblage blindé étanche, NVR avec disque dur, pose par technicien certifié & paramétrage smartphone.
                  </p>
                </div>

                {/* Line Items Breakdown */}
                <div className="space-y-2 py-3 border-y border-neutral-800 text-xs font-mono text-neutral-300">
                  <div className="flex justify-between">
                    <span>Bien :</span>
                    <strong className="text-white capitalize">{propertyType} ({city})</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pack optique :</span>
                    <strong className="text-white">{cameraCount} caméras · {resolution}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Détection IA :</span>
                    <strong className="text-white">{needsAiDetection ? 'Active (Humains/Auto)' : 'Non'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Vision couleur nuit :</span>
                    <strong className="text-white">{needsNightColor ? 'Starlight F1.0' : 'Infrarouge standard'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Garantie :</span>
                    <strong className="text-[#25D366]">2 ans pièces & main-d'œuvre</strong>
                  </div>
                </div>

                {/* Optional inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                      Votre nom ou nom de société (facultatif) :
                    </label>
                    <input 
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex : M. Amrani / SARL Tech..."
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 rounded-sm focus:outline-none focus:border-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-neutral-400 block mb-1">
                      Remarque ou contrainte spécifique (facultatif) :
                    </label>
                    <input 
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex : Hauteur 4m, passage sous gaine existante..."
                      className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 rounded-sm focus:outline-none focus:border-white"
                    />
                  </div>
                </div>

                {/* Primary WhatsApp Action with Silent Lead Capture */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleLaunchWhatsApp}
                    className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2.5 transition-all rounded-sm shadow-lg shadow-[#25D366]/25 border border-[#20ba5a] cursor-pointer"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    <span>Transmettre mon devis sur WhatsApp</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center font-mono text-neutral-400 mt-2">
                    Enregistre votre dossier en base de données et pré-remplit votre message WhatsApp.
                  </p>
                </div>

                {/* Generated Code Box */}
                {generatedCode && (
                  <div className="p-3 bg-neutral-900 border border-neutral-700 rounded text-center space-y-1.5 animate-in fade-in duration-300">
                    <span className="text-[10px] font-mono text-[#25D366] block">
                      ✓ Dossier enregistré en base
                    </span>
                    <div className="flex items-center justify-center gap-2">
                      <strong className="text-white font-mono text-sm">{generatedCode}</strong>
                      <button
                        type="button"
                        onClick={copyCode}
                        className="text-neutral-400 hover:text-white p-1"
                        title="Copier le code de référence"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-[#25D366]" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
};
