import React, { useState } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  MapPin, 
  Camera, 
  Wrench
} from 'lucide-react';
import { lookupByTrackingCode } from '../../services/dataService';
import { QuoteRequest, InterventionTicket } from '../../types';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({ isOpen, onClose }) => {
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    type: 'quote' | 'intervention';
    data: QuoteRequest | InterventionTicket;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const res = await lookupByTrackingCode(searchCode.trim());
      if (res) {
        setResult(res);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      console.error('Error tracking:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      nouveau: { label: 'Reçu', color: 'bg-zinc-800 text-zinc-300' },
      en_etude: { label: 'En étude technique', color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20' },
      devis_transmis: { label: 'Devis transmis', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
      accepte: { label: 'Chantier programmé', color: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' },
      refuse: { label: 'Clôturé', color: 'bg-zinc-800 text-zinc-400' },
      en_attente: { label: 'En attente', color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20' },
      planifie: { label: 'Planifié', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
      en_route: { label: 'Technicien en route', color: 'bg-blue-600/20 text-blue-300 border border-blue-500/30' },
      en_cours: { label: 'En cours sur site', color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20' },
      resolu: { label: 'Résolu', color: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' },
      annule: { label: 'Annulé', color: 'bg-zinc-800 text-zinc-400' },
    };
    return map[status] || { label: status, color: 'bg-zinc-800 text-zinc-300' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-7 max-w-lg w-full text-left relative shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/60">
          <h3 className="text-sm font-semibold text-zinc-100">Suivi d'un dossier en direct</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input */}
        <form onSubmit={handleSearch} className="space-y-2.5">
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Code (ex: DEV-2026-9812 ou DEP-2026-1049)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 uppercase"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Recherche...' : 'Consulter'}
            </button>
          </div>
          
          <div className="flex gap-2 text-[11px] text-zinc-500">
            <span>Exemples démo :</span>
            <button 
              type="button" 
              onClick={() => setSearchCode('DEV-2026-9812')} 
              className="text-zinc-400 underline hover:text-zinc-200 cursor-pointer"
            >
              DEV-2026-9812
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => setSearchCode('DEP-2026-1049')} 
              className="text-zinc-400 underline hover:text-zinc-200 cursor-pointer"
            >
              DEP-2026-1049
            </button>
          </div>
        </form>

        {/* Not Found Screen */}
        {notFound && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Aucun dossier correspondant à "{searchCode}".</span>
          </div>
        )}

        {/* Result details */}
        {result && (
          <div className="space-y-4 pt-1">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm font-semibold text-zinc-100">
                  {result.data.trackingCode}
                </span>
                {(() => {
                  const badge = getStatusBadge(result.data.status);
                  return (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${badge.color}`}>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>

              <div className="text-xs text-zinc-400 space-y-0.5">
                <div className="text-zinc-200 font-medium">{result.data.clientName}</div>
                <div>{result.data.address}</div>
              </div>
            </div>

            {/* Quote specific */}
            {result.type === 'quote' && (() => {
              const q = result.data as QuoteRequest;
              return (
                <div className="text-xs space-y-2 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <div className="flex justify-between text-zinc-300">
                    <span>Installation :</span>
                    <span className="text-zinc-100">{q.cameraCount} caméras • {q.propertyType}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Budget estimé :</span>
                    <span className="font-semibold text-zinc-100">{q.estimatedPrice} € TTC</span>
                  </div>
                  {q.adminNotes && (
                    <div className="pt-2 border-t border-zinc-800/60 text-zinc-400">
                      <span className="text-zinc-300 font-medium">Note technique : </span>
                      {q.adminNotes}
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Intervention specific */}
            {result.type === 'intervention' && (() => {
              const it = result.data as InterventionTicket;
              return (
                <div className="text-xs space-y-2 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/60">
                  <div className="flex justify-between text-zinc-300">
                    <span>Panne :</span>
                    <span className="text-zinc-100 capitalize">{it.issueType.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300">
                    <span>Technicien assigné :</span>
                    <span className="text-zinc-100">{it.technician || 'En cours d\'affectation'}</span>
                  </div>
                  {it.adminNotes && (
                    <div className="pt-2 border-t border-zinc-800/60 text-zinc-400">
                      <span className="text-zinc-300 font-medium">Rapport : </span>
                      {it.adminNotes}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

      </div>
    </div>
  );
};
