import React from 'react';
import { Shield, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const whatsappUrl = "https://wa.me/212661234567?text=Bonjour%20VigiCam%20Maroc%2C%20je%20souhaite%20un%20renseignement.";

  return (
    <footer className="bg-[#FAFAF9] border-t border-black/8 text-neutral-500 text-xs py-16 text-left font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-black/8">
          
          {/* Col 1 */}
          <div className="space-y-3 font-sans">
            <div className="flex items-center gap-2 text-[#0A0A0B] font-semibold text-base">
              <div className="w-6 h-6 rounded-sm bg-[#0A0A0B] text-white flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span>VigiCam Maroc.</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-normal">
              Installation et maintenance de caméras de vidéosurveillance 4K pour particuliers et entreprises au Maroc.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <span className="font-semibold text-[#0A0A0B] block text-xs tracking-wider uppercase">
              Prestations
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-600 font-sans">
              <li>
                <button onClick={() => onNavigate('tarifs')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Pack Particulier (Dès 1 490 DH)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tarifs')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Pack Villa & Riad 4K (4 900 DH)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Dépannage d'urgence sous 2h
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Maintenance préventive anti-poussière
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <span className="font-semibold text-[#0A0A0B] block text-xs tracking-wider uppercase">
              Navigation
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-600 font-sans">
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Nos Services
                </button>
              </li>
              {/* Temporairement désactivé : Aperçu Application
              <li>
                <button onClick={() => onNavigate('demo')} className="hover:text-black cursor-pointer">
                  Aperçu Application
                </button>
              </li>
              */}
              {/* Temporairement désactivé : Démo Vidéo 4K
              <li>
                <button onClick={() => onNavigate('cinematic')} className="hover:text-black cursor-pointer text-black font-semibold">
                  Démo Vidéo 4K
                </button>
              </li>
              */}
              <li>
                <button onClick={() => onNavigate('tarifs')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Tarifs en Dirhams (DH)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#0A0A0B] cursor-pointer">
                  Contact WhatsApp
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <span className="font-semibold text-[#0A0A0B] block text-xs tracking-wider uppercase">
              Assistance Directe
            </span>
            <p className="text-xs text-neutral-600 font-sans">
              Joignable 7j/7 pour devis gratuit ou dépannage partout au Maroc.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-[#0A0A0B] hover:underline pt-1"
            >
              WhatsApp : +212 6 61 23 45 67
            </a>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} VigiCam Maroc · Matériel certifié · Conforme CNDP Maroc (Loi 09-08).
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#0A0A0B] shrink-0" />
            <span>Casablanca · Rabat · Marrakech · Tanger · Agadir · Fès</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
