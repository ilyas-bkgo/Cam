import React, { useState } from 'react';
import { 
  Wrench, 
  Copy, 
  CheckCheck, 
  Check,
  AlertCircle,
  PhoneCall,
  ArrowRight
} from 'lucide-react';
import { IssueType, PriorityLevel, TimeSlot, InterventionTicket } from '../../types';
import { addIntervention } from '../../services/dataService';

export const InterventionBooking: React.FC = () => {
  const [issueType, setIssueType] = useState<IssueType>('camera_offline');
  const [priority, setPriority] = useState<PriorityLevel>('urgente');
  const [timeSlot, setTimeSlot] = useState<TimeSlot>('express_2h');

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim() || !email.trim() || !description.trim()) {
      setError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `DEP-2026-${randomSuffix}`;

    const ticketData: Omit<InterventionTicket, 'id'> = {
      trackingCode,
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim() || 'Non spécifiée',
      issueType,
      priority,
      description: description.trim(),
      preferredDate: priority === 'urgente' ? 'Immédiat (< 2h)' : 'Sous 24-48h',
      timeSlot,
      status: 'en_attente',
      technician: priority === 'urgente' ? 'Astreinte Express 24/7' : 'À planifier',
      adminNotes: 'Nouveau ticket créé via le portail.',
      createdAt: new Date().toISOString()
    };

    try {
      await addIntervention(ticketData);
      setSubmittedCode(trackingCode);
    } catch (err) {
      console.error('Erreur ticket:', err);
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
    <section id="contact" className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            Dépannage & Maintenance
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            Une panne ? Déclenchez une intervention technique.
          </h2>
          <p className="text-base text-zinc-400">
            Pour les urgences critiques, notre équipe d'astreinte se déplace sous 2 heures avec pièces de rechange.
          </p>
        </div>

        {submittedCode ? (
          /* Confirmation card */
          <div className="max-w-xl mx-auto p-8 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center space-y-6">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-semibold text-zinc-100">Ticket d'intervention ouvert</h3>
              <p className="text-sm text-zinc-400">
                Votre demande a été assignée à la cellule technique. Un technicien vous contactera au <span className="text-zinc-200">{phone}</span>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 text-left space-y-1.5">
              <span className="text-xs text-zinc-500">Numéro de ticket :</span>
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
              Signaler un autre besoin
            </button>
          </div>
        ) : (
          /* Simplified 2-column ticket form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-7 bg-zinc-900/30 p-8 rounded-2xl border border-zinc-800/60 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Nature de la panne */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    1. Type de défaillance
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'camera_offline', label: 'Caméra hors-ligne' },
                      { id: 'black_screen', label: 'Écran noir / Signal' },
                      { id: 'recording_failure', label: 'NVR / Disque dur' },
                      { id: 'network_issue', label: 'Accès smartphone' },
                      { id: 'vandalism', label: 'Vandalisme / Câble' },
                      { id: 'maintenance_preventive', label: 'Entretien annuel' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setIssueType(item.id as IssueType)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-colors cursor-pointer ${
                          issueType === item.id
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Priorité */}
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-2">
                    2. Niveau d'urgence
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'urgente', label: 'Urgence (< 2h)' },
                      { id: 'haute', label: 'Sous 24h' },
                      { id: 'normale', label: 'Planifié' },
                    ].map((pri) => (
                      <button
                        key={pri.id}
                        type="button"
                        onClick={() => {
                          setPriority(pri.id as PriorityLevel);
                          if (pri.id === 'urgente') setTimeSlot('express_2h');
                        }}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${
                          priority === pri.id
                            ? 'bg-zinc-800 border-zinc-600 text-white'
                            : 'bg-zinc-900/40 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {pri.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Description & Coordonnées */}
                <div className="space-y-3 pt-2 border-t border-zinc-800/60">
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block">
                    3. Détails & Coordonnées
                  </label>

                  <div>
                    <textarea
                      required
                      rows={2}
                      placeholder="Décrivez les symptômes observés *"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Nom du contact *"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Adresse d'intervention *"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
                    />
                  </div>

                  {error && (
                    <div className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Envoi...' : 'Déclencher l\'intervention'}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                  </button>
                </div>

              </form>
            </div>

            {/* Right Column: Direct hotline info */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
                <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-zinc-100">Ligne directe d'urgence</h3>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Pour les incidents nécessitant une intervention immédiate de nuit ou le week-end, vous pouvez contacter directement le standard d'astreinte :
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href="tel:0189714220"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 font-mono"
                  >
                    <span>01 89 71 42 20</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                <div className="pt-4 border-t border-zinc-800/60 text-[11px] text-zinc-500">
                  Techniciens itinérants avec outillage de diagnostic et stock de caméras embarqué.
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
