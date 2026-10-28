import React from 'react';
import { 
  Camera, 
  Wrench, 
  ShieldCheck, 
  Lock, 
  ArrowRight,
  Check
} from 'lucide-react';

interface ServicesSectionProps {
  onGoToQuote: () => void;
  onGoToMaintenance: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onGoToQuote,
  onGoToMaintenance
}) => {
  const services = [
    {
      title: "Installation Clé en Main",
      badge: "Étude & Pose",
      description: "Conception sur-mesure, passage de câbles discret et paramétrage de l'accès mobile sécurisé sur vos appareils.",
      icon: Camera,
      points: [
        "Câblage réseau PoE sans fil apparent",
        "Enregistreur local NVR 4K sans abonnement",
        "Application smartphone iOS & Android"
      ],
      actionLabel: "Configurer une installation",
      action: onGoToQuote,
    },
    {
      title: "Maintenance Préventive",
      badge: "Pérénnité",
      description: "Contrôles réguliers pour garantir un enregistrement continu et parer à toute défaillance avant un incident.",
      icon: ShieldCheck,
      points: [
        "Vérification d'intégrité des disques de stockage",
        "Nettoyage des optiques et recalibrage",
        "Mises à jour de sécurité contre le piratage"
      ],
      actionLabel: "Découvrir les contrats",
      action: onGoToMaintenance,
    },
    {
      title: "Dépannage d'Urgence 24/7",
      badge: "Astreinte < 2h",
      description: "Intervention rapide sur site pour toute panne critique : écran noir, coupure réseau ou caméra vandalisée.",
      icon: Wrench,
      points: [
        "Déplacement prioritaire jour et nuit",
        "Stock de pièces et caméras de rechange",
        "Intervention sur toutes marques existantes"
      ],
      actionLabel: "Signaler une panne",
      action: onGoToMaintenance,
    },
    {
      title: "Conformité Légale & RGPD",
      badge: "Sérénité",
      description: "Mise aux normes complète avec masquage de la voie publique et accompagnement déclaration en préfecture.",
      icon: Lock,
      points: [
        "Masques de confidentialité numériques",
        "Purge automatique des vidéos à 30 jours",
        "Panneaux d'affichage légaux fournis"
      ],
      actionLabel: "Audit de conformité",
      action: onGoToQuote,
    }
  ];

  return (
    <section id="services" className="py-24 sm:py-32 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            Nos Métiers
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            Une prise en charge complète de votre sécurité vidéo.
          </h2>
          <p className="text-base text-zinc-400">
            De l'analyse des risques à l'intervention technique sur site, nous veillons à la protection continue de vos installations.
          </p>
        </div>

        {/* 4 Clean Minimal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-8 bg-zinc-900/40 border border-zinc-800/60 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/40 flex items-center justify-center text-zinc-200 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400">
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-white transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
                      {srv.description}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-zinc-800/50 text-xs text-zinc-400">
                    {srv.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <button
                    onClick={srv.action}
                    className="text-xs font-semibold text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>{srv.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
