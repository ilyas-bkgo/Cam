/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/client/HeroSection';
import { ServicesList } from './components/client/ServicesList';
// import { CameraLiveApp } from './components/client/CameraLiveApp'; // Temporarily removed
import { PricingSection } from './components/client/PricingSection';
// import { QuoteConfigurator } from './components/client/QuoteConfigurator'; // Temporarily removed
// import { VideoShowcase } from './components/client/VideoShowcase'; // Temporarily removed
import { WhatsAppContact } from './components/client/WhatsAppContact';
import { FloatingCameraWatcher } from './components/client/FloatingCameraWatcher';
import { Footer } from './components/layout/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { seedInitialDataIfNeeded } from './services/dataService';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  // Check URL path, hash, or query for /admine
  const checkAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    
    const isAdmin = 
      path.includes('/admine') || 
      path.includes('/admin') || 
      hash.includes('#admine') || 
      hash.includes('#admin') ||
      search.includes('admine') ||
      search.includes('admin');

    setIsAdminRoute(isAdmin);
  };

  useEffect(() => {
    checkAdminRoute();
    seedInitialDataIfNeeded();

    const handleLocationChange = () => {
      checkAdminRoute();
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const scrollToTarget = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 76;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (isAdminRoute) {
      window.history.pushState(null, '', '/');
      setIsAdminRoute(false);
      setTimeout(() => {
        scrollToTarget(sectionId);
      }, 150);
      return;
    }

    scrollToTarget(sectionId);
  };

  // If URL contains /admine, render the Admin Dashboard
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <AdminDashboard
          onBackToClientSite={() => {
            window.history.pushState(null, '', '/');
            setIsAdminRoute(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>
    );
  }

  // Public Clean Light Website for Morocco
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0A0A0B] flex flex-col font-sans selection:bg-[#0A0A0B] selection:text-white">
      {/* 1. Clean Navbar with fixed scroll links (NO admin button in navbar) */}
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1">
        {/* 2. Hero Section with Moroccan headline, WhatsApp CTA & Camera Scanner Animation */}
        <HeroSection
          onGoToPricing={() => handleNavigate('tarifs')}
          onGoToDemo={() => handleNavigate('tarifs')}
        />

        {/* Smooth transitional gradient eliminating harsh black-to-offwhite jump */}
        <div className="h-16 sm:h-24 bg-gradient-to-b from-[#0A0A0B] via-[#121214]/60 to-[#FAFAF9] pointer-events-none -mt-1" />

        {/* 3. 3 Core Services Highlight (Installation, Maintenance, Dépannage) */}
        <ServicesList />

        {/* 4. Live Camera & Event Software Interface (Temporairement désactivé)
        <CameraLiveApp />
        */}

        {/* 5. Awwwards-Style Ultra-HD 4K Video Showcase with Clean Transitions (Temporairement désactivé)
        <VideoShowcase />
        */}

        {/* 5. Interactive 3-Step Quote Configurator (Temporarily disabled)
        <QuoteConfigurator />
        */}

        {/* 6. Simple, Transparent Pricing Section in Moroccan Dirhams (DH) including 1-2 cameras */}
        <PricingSection />

        {/* 7. Direct WhatsApp Contact Section (+212 Moroccan number) */}
        <WhatsAppContact />
      </main>

      {/* 8. Clean Monochrome Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Sentinel Camera Watcher Tracking Scroll & Mouse */}
      <FloatingCameraWatcher onBackToTop={() => scrollToTarget('hero')} />

      {/* Floating Quick WhatsApp Button - Official Brand Green */}
      <div className="fixed bottom-6 right-6 z-40">
        <a
          href="https://wa.me/212661234567?text=Bonjour%20VigiCam%20Maroc%2C%20je%20souhaite%20un%20devis%20de%20vid%C3%A9osurveillance."
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white font-medium text-xs flex items-center gap-2.5 shadow-xl shadow-[#25D366]/25 transition-all rounded-full hover:scale-105 border border-[#20ba5a]"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="font-semibold tracking-wide">WhatsApp 7j/7</span>
        </a>
      </div>
    </div>
  );
}
