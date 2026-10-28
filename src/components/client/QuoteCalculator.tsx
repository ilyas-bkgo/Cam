import React, { useState } from 'react';
import { 
  Check, 
  Send, 
  Copy, 
  CheckCheck,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { PropertyType, ResolutionType, StorageType, QuoteRequest } from '../../types';
import { addQuote } from '../../services/dataService';

interface QuoteCalculatorProps {
  initialConfig?: {
    propertyType: PropertyType;
    cameraCount: number;
    resolution: ResolutionType;
    storagePreference: StorageType;
    estimatedBudget?: number;
  };
}

export const QuoteCalculator: React.FC<QuoteCalculatorProps> = ({ initialConfig }) => {
  const [propertyType, setPropertyType] = useState<PropertyType>(initialConfig?.propertyType || 'maison');
  const [cameraCount, setCameraCount] = useState<number>(initialConfig?.cameraCount || 4);
  const [resolution, setResolution] = useState<ResolutionType>(initialConfig?.resolution || '4K');
  const [storage, setStorage] = useState<StorageType>(initialConfig?.storagePreference || 'nvr_local');
  
  // Options
  const [needsAiDetection, setNeedsAiDetection] = useState<boolean>(true);
  const [needsNightColor, setNeedsNightColor] = useState<boolean>(true);
  const [includeUps, setIncludeUps] = useState<boolean>(false);

  // Client contact info
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate price estimate
  const calculateEstimate = () => {
    let camUnitPrice = 240;
    if (resolution === '2K') camUnitPrice = 180;
    if (resolution === '4K') camUnitPrice = 280;
    if (resolution === '8K_Ultra') camUnitPrice = 420;
    if (resolution === 'Thermique') camUnitPrice = 750;

    const laborPerCam = 140;

    let storageCost = 350;
    if (cameraCount > 8) storageCost = 650;
    if (cameraCount > 16) storageCost = 1100;
    if (storage === 'cloud_securise') storageCost += 150;
    if (storage === 'hybride') storageCost += 220;

    let total = (camUnitPrice + laborPerCam) * cameraCount + storageCost;

    if (needsAiDetection) total += cameraCount * 30;
    if (needsNightColor) total += cameraCount * 40;
    if (includeUps) total += 190;

    return Math.round(total);
  };

  const estimatedPrice = calculateEstimate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim() || !phone.trim()) {
      setErrorMessage('Veuillez renseigner votre nom, email et téléphone.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `DEV-2026-${randomSuffix}`;

    const quoteData: Omit<QuoteRequest, 'id'> = {
      trackingCode,
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Non renseignée',
      propertyType,
      cameraCount,
      resolution,
      storagePreference: storage,
      needsAiDetection,
      needsNightColor,
      needsRemoteApp: true,
      estimatedPrice,
      notes: notes.trim(),
      status: 'nouveau',
      createdAt: new Date().toISOString()
    };

    try {
      await addQuote(quoteData);
      setSubmittedCode(trackingCode);
    } catch (err) {
      console.error('Erreur devis:', err);
      setSubmittedCode(trackingCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = () => {
    if (submittedCode) {
      navigator.clipboard.writeText(submittedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900">
      <div id="quote-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            Simulateur en Ligne
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            Estimez le budget de votre installation.
          </h2>
          <p className="text-base text-zinc-400">
            Ajustez vos critères pour obtenir une estimation immédiate avec pose et matériel compris.
          </p>
        </div>

        {submittedCode ? (
          /* Confirmation card */
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-semibold text-zinc-100">Demande de devis enregistrée</h3>
              <p className="text-sm text-zinc-400">
                Merci <span className="text-zinc-200">{clientName}</span>. Un technicien examine votre configuration.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-left space-y-1.5">
              <span className="text-xs text-zinc-500">Numéro de suivi unique :</span>
              <div className="flex items-center justify-between">
                <span className="text-lg font-mono font-semibold text-zinc-100">{submittedCode}</span>
                <button
                  onClick={copyToClipboard}
                  className="px-2.5 py-1 text-xs rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setSubmittedCode(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200 underline cursor-pointer"
            >
              Faire une autre simulation
            </button>
          </div>
        ) : (
          /* Calculator 2-column layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: 3 Clean Configuration Steps */}
            <div className="lg:col-span-7 space-y-8 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/60">
              
              {/* Step 1: Type de bâtiment */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  1. Type de site
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'maison', label: 'Maison / Villa' },
                    { id: 'commerce', label: 'Commerce' },
                    { id: 'entrepot', label: 'Entrepôt' },
                    { id: 'appartement', label: 'Appartement' },
                    { id: 'immeuble', label: 'Immeuble / Copro' },
                    { id: 'chantier', label: 'Chantier / Isolé' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPropertyType(item.id as PropertyType)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                        propertyType === item.id
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Slider Caméras */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-300 uppercase tracking-wider">
                    2. Nombre de caméras
                  </span>
                  <span className="font-semibold text-blue-400 font-mono">
                    {cameraCount} caméra{cameraCount > 1 ? 's' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={cameraCount}
                  onChange={(e) => setCameraCount(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-zinc-500">
                  <span>1 cam</span>
                  <span>4 cams</span>
                  <span>8 cams</span>
                  <span>16+ cams</span>
                </div>
              </div>

              {/* Step 3: Résolution & Stockage */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                  3. Définition d'image
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: '2K', label: '2K (4 MP)' },
                    { id: '4K', label: '4K (8 MP)' },
                    { id: '8K_Ultra', label: '8K Ultra' },
                    { id: 'Thermique', label: 'Thermique' },
                  ].map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => setResolution(res.id as ResolutionType)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                        resolution === res.id
                          ? 'bg-zinc-800 border-zinc-600 text-white'
                          : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {res.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional options */}
              <div className="space-y-2 pt-2 border-t border-zinc-800/60">
                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={needsAiDetection}
                    onChange={(e) => setNeedsAiDetection(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-zinc-700 text-blue-600 bg-zinc-900"
                  />
                  <span className="text-zinc-300">Filtrage intelligent IA (détection ciblée personnes & véhicules)</span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={needsNightColor}
                    onChange={(e) => setNeedsNightColor(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-zinc-700 text-blue-600 bg-zinc-900"
                  />
                  <span className="text-zinc-300">Vision couleur de nuit 24/7 (ColorVu)</span>
                </label>

                <label className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={includeUps}
                    onChange={(e) => setIncludeUps(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-zinc-700 text-blue-600 bg-zinc-900"
                  />
                  <span className="text-zinc-300">Onduleur anti-coupure de courant secouru (+190 €)</span>
                </label>
              </div>

            </div>

            {/* Right Column: Pricing Summary & Form */}
            <div className="lg:col-span-5 sticky top-24 space-y-6">
              <div className="p-7 rounded-2xl bg-zinc-900/60 border border-zinc-800 shadow-xl space-y-6">
                
                {/* Price Display */}
                <div>
                  <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Budget estimé
                  </span>
                  <div className="text-3xl font-semibold text-zinc-100 mt-1">
                    {estimatedPrice.toLocaleString('fr-FR')} € <span className="text-xs font-normal text-zinc-400">TTC</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">
                    Matériel, passage de câbles, pose et paramétrage inclus.
                  </p>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-zinc-800/60">
                  <p className="text-xs font-medium text-zinc-300">Recevoir le devis officiel :</p>
                  
                  {errorMessage && (
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Nom ou Raison sociale *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Téléphone *"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Ville ou adresse d'intervention"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      placeholder="Notes ou détails particuliers..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Envoi...' : 'Transmettre ma demande'}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </form>

              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
