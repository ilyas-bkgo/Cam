import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { captureLeadAndOpenWhatsApp } from '../../services/dataService';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLinkClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    captureLeadAndOpenWhatsApp({
      source: 'navbar',
      title: 'Contact Rapide Navbar',
      notes: 'Clic sur le bouton Devis WhatsApp en en-tête'
    });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-black/8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo - Pure Black and White */}
        <a 
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-sm bg-[#0A0A0B] flex items-center justify-center text-white">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-semibold tracking-tight text-[#0A0A0B] leading-tight">
              VigiCam<span className="text-neutral-400">.</span>ma
            </span>
            <span className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              Sécurité Maroc
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono tracking-wide text-neutral-600">
          <a 
            href="#services" 
            onClick={(e) => handleLinkClick(e, 'services')}
            className="hover:text-[#0A0A0B] transition-colors"
          >
            Services
          </a>
          {/* Temporairement désactivé : Aperçu App
          <a 
            href="#demo" 
            onClick={(e) => handleLinkClick(e, 'demo')}
            className="hover:text-black transition-colors"
          >
            Aperçu App
          </a>
          */}
          {/* Temporairement désactivé : Démo Vidéo 4K
          <a 
            href="#cinematic" 
            onClick={(e) => handleLinkClick(e, 'cinematic')}
            className="hover:text-black transition-colors"
          >
            Démo Vidéo 4K
          </a>
          */}
          {/* Temporairement désactivé : Simulateur
          <a 
            href="#configurateur" 
            onClick={(e) => handleLinkClick(e, 'configurateur')}
            className="text-black font-semibold hover:text-[#25D366] transition-colors"
          >
            Simulateur (Devis)
          </a>
          */}
          <a 
            href="#tarifs" 
            onClick={(e) => handleLinkClick(e, 'tarifs')}
            className="hover:text-[#0A0A0B] transition-colors"
          >
            Tarifs (DH)
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="hover:text-[#0A0A0B] transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* WhatsApp Direct Action Button - Refined Emerald Accent */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={handleQuickWhatsApp}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide flex items-center gap-2 transition-all rounded-sm shadow-sm cursor-pointer border border-emerald-500/20"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Devis WhatsApp</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            type="button"
            onClick={handleQuickWhatsApp}
            className="px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-sm flex items-center gap-1.5 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-800 hover:text-black"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAFAF9] border-b border-black/8 px-4 py-5 space-y-3 text-left">
          <a 
            href="#services" 
            onClick={(e) => handleLinkClick(e, 'services')}
            className="block py-2 text-xs font-mono text-neutral-700 hover:text-black"
          >
            Services
          </a>
          {/* Temporairement désactivé : Aperçu App
          <a 
            href="#demo" 
            onClick={(e) => handleLinkClick(e, 'demo')}
            className="block py-2 text-xs font-mono text-neutral-700 hover:text-black"
          >
            Aperçu App
          </a>
          */}
          {/* Temporairement désactivé : Démo Vidéo 4K
          <a 
            href="#cinematic" 
            onClick={(e) => handleLinkClick(e, 'cinematic')}
            className="block py-2 text-xs font-mono text-black font-semibold"
          >
            Démo Vidéo 4K
          </a>
          */}
          {/* Temporairement désactivé : Simulateur
          <a 
            href="#configurateur" 
            onClick={(e) => handleLinkClick(e, 'configurateur')}
            className="block py-2 text-xs font-mono font-semibold text-black hover:text-[#25D366]"
          >
            Simulateur (Devis)
          </a>
          */}
          <a 
            href="#tarifs" 
            onClick={(e) => handleLinkClick(e, 'tarifs')}
            className="block py-2 text-xs font-mono text-neutral-700 hover:text-black"
          >
            Tarifs (DH)
          </a>
          <a 
            href="#contact" 
            onClick={(e) => handleLinkClick(e, 'contact')}
            className="block py-2 text-xs font-mono text-neutral-700 hover:text-black"
          >
            Contact
          </a>
          
          <div className="pt-3 border-t border-black/8">
            <button
              type="button"
              onClick={handleQuickWhatsApp}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 rounded-sm transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 shrink-0">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              <span>Devis WhatsApp (+212)</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
