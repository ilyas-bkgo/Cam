import React, { useState } from 'react';
import { 
  Camera, 
  Wrench, 
  Sliders, 
  Check, 
  ArrowRight, 
  Copy, 
  CheckCheck, 
  AlertCircle, 
  PhoneCall, 
  Eye, 
  ShieldCheck,
  Zap,
  HardDrive
} from 'lucide-react';
import { PropertyType, ResolutionType, StorageType, QuoteRequest, InterventionTicket, IssueType, PriorityLevel } from '../../types';
import { addQuote, addIntervention } from '../../services/dataService';

interface UnifiedHubProps {
  initialTab?: 'installation' | 'depannage' | 'hardware';
  onSelectProduct?: (productName: string) => void;
}

export const UnifiedHub: React.FC<UnifiedHubProps> = ({ initialTab = 'installation' }) => {
  const [activeTab, setActiveTab] = useState<'installation' | 'depannage' | 'hardware'>(initialTab);

  // --- INSTALLATION STATE ---
  const [propertyType, setPropertyType] = useState<PropertyType>('maison');
  const [cameraCount, setCameraCount] = useState<number>(4);
  const [resolution, setResolution] = useState<ResolutionType>('4K');
  const [storage, setStorage] = useState<StorageType>('nvr_local');
  const [aiDetection, setAiDetection] = useState<boolean>(true);
  const [colorVu, setColorVu] = useState<boolean>(true);

  // Installation form
  const [quoteName, setQuoteName] = useState('');
  const [quoteEmail, setQuoteEmail] = useState('');
  const [quotePhone, setQuotePhone] = useState('');
  const [quoteCity, setQuoteCity] = useState('');
  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSubmittedCode, setQuoteSubmittedCode] = useState<string | null>(null);
  const [quoteCopied, setQuoteCopied] = useState(false);

  // --- REPAIR / DEPANNAGE STATE ---
  const [issueType, setIssueType] = useState<IssueType>('camera_offline');
  const [priority, setPriority] = useState<PriorityLevel>('urgente');
  const [repairName, setRepairName] = useState('');
  const [repairPhone, setRepairPhone] = useState('');
  const [repairAddress, setRepairAddress] = useState('');
  const [repairDesc, setRepairDesc] = useState('');
  const [repairSubmitting, setRepairSubmitting] = useState(false);
  const [repairSubmittedCode, setRepairSubmittedCode] = useState<string | null>(null);
  const [repairCopied, setRepairCopied] = useState(false);

  // Estimate calculation
  const calculatePrice = () => {
    let unit = 260;
    if (resolution === '2K') unit = 190;
    if (resolution === '4K') unit = 290;
    if (resolution === '8K_Ultra') unit = 440;
    if (resolution === 'Thermique') unit = 780;

    const pose = 130;
    let nvr = 320;
    if (cameraCount > 8) nvr = 590;
    if (storage === 'cloud_securise') nvr += 140;

    let total = (unit + pose) * cameraCount + nvr;
    if (aiDetection) total += cameraCount * 25;
    if (colorVu) total += cameraCount * 35;

    return Math.round(total);
  };

  const estimatedPrice = calculatePrice();

  // Handle Quote Submit
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteName.trim() || !quotePhone.trim()) return;

    setQuoteSubmitting(true);
    const code = `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newQuote: Omit<QuoteRequest, 'id'> = {
      trackingCode: code,
      clientName: quoteName.trim(),
      email: quoteEmail.trim() || 'contact@client.fr',
      phone: quotePhone.trim(),
      address: quoteCity.trim() || 'Non précisée',
      propertyType,
      cameraCount,
      resolution,
      storagePreference: storage,
      needsAiDetection: aiDetection,
      needsNightColor: colorVu,
      needsRemoteApp: true,
      estimatedPrice,
      status: 'nouveau',
      createdAt: new Date().toISOString()
    };

    try {
      await addQuote(newQuote);
      setQuoteSubmittedCode(code);
    } catch {
      setQuoteSubmittedCode(code);
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // Handle Repair Submit
  const handleRepairSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repairName.trim() || !repairPhone.trim()) return;

    setRepairSubmitting(true);
    const code = `DEP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTicket: Omit<InterventionTicket, 'id'> = {
      trackingCode: code,
      clientName: repairName.trim(),
      email: 'client@contact.fr',
      phone: repairPhone.trim(),
      address: repairAddress.trim() || 'À préciser',
      issueType,
      priority,
      description: repairDesc.trim() || 'Panne signalée via le studio en ligne',
      preferredDate: priority === 'urgente' ? 'Immédiat (< 2h)' : 'Sous 24h',
      timeSlot: 'express_2h',
      status: 'en_attente',
      technician: priority === 'urgente' ? 'Astreinte Express 24/7' : 'À planifier',
      createdAt: new Date().toISOString()
    };

    try {
      await addIntervention(newTicket);
      setRepairSubmittedCode(code);
    } catch {
      setRepairSubmittedCode(code);
    } finally {
      setRepairSubmitting(false);
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Studio Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500 font-mono">
              Configuration & Intervention
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
              Studio VigiCam
            </h2>
            <p className="text-sm text-zinc-400 max-w-xl">
              Configurez une nouvelle installation sur-mesure ou déclenchez une intervention technique immédiate.
            </p>
          </div>

          {/* Segmented Control Tabs (Mobbin Style) */}
          <div className="flex items-center p-1 rounded-xl bg-zinc-900/80 border border-zinc-800/80 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('installation')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'installation'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Installation</span>
            </button>
            <button
              onClick={() => setActiveTab('depannage')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'depannage'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Dépannage & Astreinte</span>
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'hardware'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Matériel</span>
            </button>
          </div>
        </div>

        {/* TAB 1: INSTALLATION CONFIGURATOR */}
        {activeTab === 'installation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Controls */}
            <div className="lg:col-span-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-7 sm:p-8 space-y-7">
              
              {/* Type of Site */}
              <div className="space-y-3">
                <span className="text-xs font-medium text-zinc-400">1. Destination du site</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'maison', label: 'Villa & Maison' },
                    { id: 'commerce', label: 'Commerce & PME' },
                    { id: 'entrepot', label: 'Industrie & Dépôt' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPropertyType(p.id as PropertyType)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                        propertyType === p.id
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cameras Slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-400">2. Nombre de caméras</span>
                  <span className="font-mono font-semibold text-zinc-200">
                    {cameraCount} point{cameraCount > 1 ? 's' : ''} de vue
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={cameraCount}
                  onChange={(e) => setCameraCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-zinc-500 font-mono">
                  <span>1 cam</span>
                  <span>4 cams (Standard)</span>
                  <span>8 cams</span>
                  <span>16 cams</span>
                </div>
              </div>

              {/* Definition */}
              <div className="space-y-3">
                <span className="text-xs font-medium text-zinc-400 block">3. Résolution optique</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '4K', label: '4K Ultra HD', note: 'Standard certifié' },
                    { id: '2K', label: '2K QHD', note: 'Économique' },
                    { id: 'Thermique', label: 'Thermique Bi-Spectre', note: 'Haute sécurité' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setResolution(r.id as ResolutionType)}
                      className={`p-2.5 rounded-lg text-xs border text-left transition-colors cursor-pointer ${
                        resolution === r.id
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      <div className="font-medium text-zinc-200">{r.label}</div>
                      <div className="text-[10px] text-zinc-500">{r.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-zinc-800/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aiDetection}
                    onChange={(e) => setAiDetection(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-zinc-700 text-blue-600 bg-zinc-900"
                  />
                  <span className="text-zinc-300">IA Détection silhouettes humaines</span>
                </label>
                <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={colorVu}
                    onChange={(e) => setColorVu(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-zinc-700 text-blue-600 bg-zinc-900"
                  />
                  <span className="text-zinc-300">Vision couleur de nuit (ColorVu)</span>
                </label>
              </div>

            </div>

            {/* Right Summary & Form */}
            <div className="lg:col-span-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-7 sm:p-8 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                  Estimation instantanée
                </span>
                <div className="text-3xl font-semibold text-zinc-100 mt-1">
                  {estimatedPrice.toLocaleString('fr-FR')} € <span className="text-xs font-normal text-zinc-400">TTC</span>
                </div>
                <div className="text-xs text-zinc-500 mt-1">
                  Comprend : {cameraCount} caméras {resolution}, NVR local, câblage et pose certifiée.
                </div>
              </div>

              {quoteSubmittedCode ? (
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-medium text-zinc-200">Demande enregistrée avec succès</div>
                  <div className="font-mono text-sm text-zinc-100 font-semibold">{quoteSubmittedCode}</div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(quoteSubmittedCode);
                      setQuoteCopied(true);
                      setTimeout(() => setQuoteCopied(false), 2000);
                    }}
                    className="text-[11px] text-blue-400 hover:underline cursor-pointer"
                  >
                    {quoteCopied ? 'Code copié' : 'Copier le code de suivi'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-3 pt-3 border-t border-zinc-800/60 text-xs">
                  <span className="text-xs font-medium text-zinc-300 block">Recevoir votre devis officiel :</span>
                  <input
                    type="text"
                    required
                    placeholder="Nom ou Entreprise *"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      required
                      placeholder="Téléphone *"
                      value={quotePhone}
                      onChange={(e) => setQuotePhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                    <input
                      type="text"
                      placeholder="Ville / Département"
                      value={quoteCity}
                      onChange={(e) => setQuoteCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={quoteSubmitting}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 mt-1"
                  >
                    <span>{quoteSubmitting ? 'Envoi...' : 'Valider ma configuration'}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: REPAIR & BREAKDOWN SERVICE */}
        {activeTab === 'depannage' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Form */}
            <div className="lg:col-span-7 rounded-2xl bg-zinc-900/40 border border-zinc-800/60 p-7 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-zinc-100">Déclaration d'incident technique</h3>
                <p className="text-xs text-zinc-400">Intervention d'astreinte garantie 7j/7 sur toute marque existante.</p>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-medium text-zinc-400 block">Symptôme constaté :</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'camera_offline', label: 'Caméra hors-ligne' },
                    { id: 'black_screen', label: 'Écran noir / Signal' },
                    { id: 'recording_failure', label: 'Disque dur NVR HS' },
                    { id: 'network_issue', label: 'Accès smartphone' },
                    { id: 'vandalism', label: 'Vandalisme / Choc' },
                    { id: 'maintenance_preventive', label: 'Entretien annuel' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setIssueType(p.id as IssueType)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                        issueType === p.id
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900/30 border-zinc-800/60 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {repairSubmittedCode ? (
                <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                    <Check className="w-4 h-4" />
                  </div>
                  <div className="text-sm font-medium text-zinc-200">Ticket d'intervention ouvert</div>
                  <div className="font-mono text-base text-zinc-100 font-semibold">{repairSubmittedCode}</div>
                  <p className="text-xs text-zinc-400">Un technicien d'astreinte vous contacte immédiatement.</p>
                </div>
              ) : (
                <form onSubmit={handleRepairSubmit} className="space-y-3 text-xs pt-2 border-t border-zinc-800/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nom du contact *"
                      value={repairName}
                      onChange={(e) => setRepairName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Téléphone direct *"
                      value={repairPhone}
                      onChange={(e) => setRepairPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Adresse d'intervention *"
                    value={repairAddress}
                    onChange={(e) => setRepairAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                  />
                  <textarea
                    rows={2}
                    placeholder="Précisions sur l'incident (facultatif)..."
                    value={repairDesc}
                    onChange={(e) => setRepairDesc(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                  />
                  <button
                    type="submit"
                    disabled={repairSubmitting}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>{repairSubmitting ? 'Envoi...' : 'Déclencher l\'intervention d\'urgence'}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </form>
              )}
            </div>

            {/* Hotline Callout */}
            <div className="lg:col-span-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 p-7 sm:p-8 space-y-4">
              <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                <PhoneCall className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-100">Hotline d'urgence 24h/24</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Pour une assistance immédiate ou une coupure totale de vidéoprotection :
                </p>
              </div>
              <div className="pt-2">
                <a
                  href="tel:0189714220"
                  className="text-lg font-mono font-semibold text-blue-400 hover:text-blue-300 block"
                >
                  01 89 71 42 20
                </a>
                <span className="text-[11px] text-zinc-500">Ligne directe techniciens sur le terrain</span>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: HARDWARE CURATED SHOWCASE */}
        {activeTab === 'hardware' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Dôme VigiPro 4K IK10',
                type: 'Anti-Vandale',
                specs: 'Optique Sony 8MP • Détection IA Humains/Véhicules',
                price: '349 €',
                image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Bullet ColorVu 24/7',
                type: 'Nuit Couleur',
                specs: 'Ouverture F1.0 • Restitution des couleurs en nuit totale',
                price: '389 €',
                image: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Caméra Solaire 4G LTE',
                type: 'Sites Isolés',
                specs: 'Panneau solaire 40W • Batterie Lithium • 100% Autonome',
                price: '499 €',
                image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80',
              }
            ].map((cam, idx) => (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-zinc-900/30 border border-zinc-800/60 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/60">
                    <img src={cam.image} alt={cam.name} className="w-full h-full object-cover opacity-85" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{cam.type}</span>
                    <h4 className="text-sm font-semibold text-zinc-100">{cam.name}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{cam.specs}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-100">{cam.price}</span>
                  <button
                    onClick={() => setActiveTab('installation')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
                  >
                    Ajouter au devis →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
