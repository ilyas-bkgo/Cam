import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Ai-je le droit de filmer la voie publique ou chez mon voisin ?",
      a: "Non. Selon la réglementation française et les directives de la CNIL, un particulier ou une entreprise n'a pas le droit de filmer la rue ou les espaces privatifs voisins. Lors de la mise en service, nous configurons des masques de confidentialité numériques directement sur les capteurs pour occulter la voie publique et respecter la loi."
    },
    {
      q: "Combien de temps les enregistrements sont-ils conservés ?",
      a: "La durée maximale de conservation des images fixée par la loi française est de 30 jours (sauf enquête judiciaire). Nos enregistreurs NVR sont configurés pour écraser automatiquement et de manière chiffrée les séquences les plus anciennes au terme de ce délai."
    },
    {
      q: "Comment fonctionne l'application mobile de visionnage ?",
      a: "Nous installons et configurons une application mobile dédiée et hautement sécurisée (iOS et Android). Les flux sont chiffrés de bout en bout en P2P. Vous pouvez visionner le direct, relire les enregistrements et recevoir des notifications d'intrusion en temps réel."
    },
    {
      q: "Que se passe-t-il en cas de coupure de courant ou de box internet ?",
      a: "Si vous disposez de notre option onduleur secouru, le système d'enregistrement et les caméras continuent de tourner localement pendant plusieurs heures. Si internet est coupé, l'enregistrement local sur le NVR ne s'arrête jamais."
    },
    {
      q: "Quels sont les délais d'intervention ?",
      a: "Pour une installation neuve, nous intervenons sous 3 à 5 jours ouvrés après validation du devis. Pour une urgence critique (panne NVR, vandalisme), notre service d'astreinte 24/7 se déplace sur site sous 2 heures."
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        <div className="space-y-3 mb-14 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            Foire Aux Questions
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100">
            Questions fréquentes & réglementation.
          </h2>
        </div>

        <div className="divide-y divide-zinc-800/60 border-y border-zinc-800/60">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="py-5">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-medium text-zinc-100 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-zinc-400 shrink-0 ml-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 ml-4" />
                  )}
                </button>

                {isOpen && (
                  <div className="pt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
