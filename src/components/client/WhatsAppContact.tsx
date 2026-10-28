import React, { useState } from 'react';
import { ArrowRight, Phone, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { ScrollReveal } from '../ui/ScrollReveal';
import { captureLeadAndOpenWhatsApp } from '../../services/dataService';

export const WhatsAppContact: React.FC = () => {
  const [customMsg, setCustomMsg] = useState('');
  const [createdRef, setCreatedRef] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = customMsg.trim() || "Demande de devis installation caméras de surveillance";
    const res = await captureLeadAndOpenWhatsApp({
      source: 'whatsapp_direct',
      title: 'Message Direct WhatsApp',
      notes: text
    });
    setCreatedRef(res.trackingCode);
    setTimeout(() => setCreatedRef(null), 6000);
  };

  const handlePromptClick = async (prompt: string) => {
    setCustomMsg(prompt);
    const res = await captureLeadAndOpenWhatsApp({
      source: 'whatsapp_direct',
      title: prompt,
      notes: `Sélection directe depuis le formulaire de contact rapide`
    });
    setCreatedRef(res.trackingCode);
    setTimeout(() => setCreatedRef(null), 6000);
  };

  const quickPrompts = [
    "Installation 1 ou 2 caméras (Pack Particulier dès 1 490 DH)",
    "Devis Villa & Riad (Pack 4 caméras à 4 900 DH)",
    "Devis Commerce & Magasin (Pack 7 500 DH)",
    "Dépannage d'urgence sous 2h (Diagnostic panne 250 DH)",
  ];

  return (
    <section id="contact" className="py-24 scroll-mt-20 bg-[#FAFAF9] text-left border-t border-black/8 text-[#0A0A0B]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main WhatsApp Card (Minimalist Black & White with Emerald Accent) */}
        <ScrollReveal direction="up" delay={0}>
          <div className="p-8 sm:p-12 bg-white border border-black/8 shadow-sm rounded-sm">
            
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-mono tracking-widest uppercase text-neutral-500">
                  Assistance Directe · Maroc 7j/7
                </span>
                <h2 className="text-2xl sm:text-3xl font-light text-[#0A0A0B] leading-tight">
                  Contactez un technicien <span className="font-semibold text-emerald-600">sur WhatsApp</span>
                </h2>
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl font-normal">
                Besoin d'un devis immédiat ou d'un dépannage ? Envoyez-nous un message WhatsApp avec la localisation de votre maison ou commerce au Maroc. Nous répondons en moins de 5 minutes.
              </p>

              {/* Quick Prompts */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-mono text-neutral-500 block">Demandes fréquentes :</span>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePromptClick(prompt)}
                      className="px-3.5 py-2 bg-white border border-black/8 text-xs font-mono text-neutral-800 hover:border-black/30 hover:bg-[#F5F5F4] transition-colors cursor-pointer rounded-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Form */}
              <form onSubmit={handleSend} className="pt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Ex : Bonjour, devis pour 3 caméras extérieures à Marrakech..."
                  className="flex-1 px-4 py-3 bg-[#F5F5F4] border border-black/8 text-xs sm:text-sm text-[#0A0A0B] placeholder-neutral-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 font-sans rounded-sm"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2.5 cursor-pointer transition-all shadow-md shadow-emerald-950/25 border border-emerald-500/30 rounded-sm shrink-0"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                  <span>Envoyer sur WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Technical Commitments Footer */}
              <div className="pt-6 border-t border-black/8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-neutral-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#0A0A0B] shrink-0" />
                  <span>RÉPONSE MOINS DE 5 MIN</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#0A0A0B] shrink-0" />
                  <span>+212 6 61 23 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#0A0A0B] shrink-0" />
                  <span>PARTOUT AU MAROC</span>
                </div>
              </div>

            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
};
