import { CameraProduct, TestimonialItem, QuoteRequest, InterventionTicket } from '../types';

export const INITIAL_CAMERAS: CameraProduct[] = [
  {
    id: 'cam-1',
    name: 'Dôme VigiPro 4K AcuSense IK10',
    category: 'dome',
    resolution: '4K Ultra HD (8 MP)',
    nightVision: 'Infrarouge EXIR 40m + Filtre ICR',
    price: 349,
    installationIncluded: true,
    features: 'Anti-vandale IK10, Étanchéité IP67, Détection IA Humains/Véhicules, Micro intégré',
    inStock: true,
    badge: 'Plus Populaire',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cam-2',
    name: 'Bullet ColorVu Nuit Couleur 24/7',
    category: 'bullet',
    resolution: '4K Ultra HD (3840x2160)',
    nightVision: 'Couleur intégrale 24h/24 LED douce 40m',
    price: 389,
    installationIncluded: true,
    features: 'Ouverture F1.0 ultra-lumineuse, WDR 130dB, Alerte vocale personnalisable',
    inStock: true,
    badge: 'Vision Nocturne Couleur',
    imageUrl: 'https://images.unsplash.com/photo-1580983218765-f663bec07b37?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cam-3',
    name: 'PTZ Speed Dome 360° Motorisé Zoom 25x',
    category: 'ptz',
    resolution: '4MP QHD Haute Vitesse',
    nightVision: 'Laser IR longue portée 150m',
    price: 790,
    installationIncluded: true,
    features: 'Auto-tracking IA cible en mouvement, Rotation 360° infinie, Essuie-glace intégré',
    inStock: true,
    badge: 'Pro Surveillance Large',
    imageUrl: 'https://images.unsplash.com/photo-1517430816045-df4b7de81a17?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cam-4',
    name: 'Enregistreur NVR IA 16 Canaux 4K + 8To',
    category: 'nvr',
    resolution: 'Enregistrement 4K 30fps temps réel',
    nightVision: 'Disque dur pro surveillance WD Purple inclus',
    price: 649,
    installationIncluded: true,
    features: '16 ports PoE direct, Recherche intelligente intelligente par visage ou plaque, Sauvegarde Cloud',
    inStock: true,
    badge: 'Cœur de Système',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cam-5',
    name: 'Caméra Solaire 4G LTE Autonome',
    category: 'solar_4g',
    resolution: '2K QHD (2560x1440)',
    nightVision: 'Projecteur LED + IR 30m',
    price: 499,
    installationIncluded: true,
    features: 'Panneau solaire 40W + Batterie Lithium intégrée, 100% sans fil, Idéal chantier & ferme',
    inStock: true,
    badge: 'Sites Isolés & Chantiers',
    imageUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cam-6',
    name: 'Caméra Thermique Bi-Spectre Détection Incendie',
    category: 'thermal',
    resolution: 'Capteur thermique + Optique 4K',
    nightVision: 'Détection thermique jusqu’à 400m sans lumière',
    price: 1290,
    installationIncluded: true,
    features: 'Mesure de température en temps réel, Détection de départ de feu, Alarme sonore & visuelle',
    inStock: true,
    badge: 'Haute Sécurité Industrielle',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    author: 'Marc de Saint-Germain',
    companyOrRole: 'Gérant de Concession Automobile',
    location: 'Paris & Île-de-France',
    rating: 5,
    content: 'Installation exemplaire de 16 caméras 4K avec détection de plaques d’immatriculation. Suite à une tentative d’intrusion le mois dernier, les caméras ont déclenché l’alerte instantanément et la police est intervenue en 6 minutes. Équipe ultra-pro.',
    date: '18 Février 2026',
    serviceType: 'Installation Entreprise',
    verified: true
  },
  {
    id: 'test-2',
    author: 'Sophie Lemoine',
    companyOrRole: 'Propriétaire de Villa',
    location: 'Versailles',
    rating: 5,
    content: 'J’ai fait appel à VigiCam pour sécuriser ma résidence principale et le jardin. Les techniciens ont passé tous les câbles de manière totalement invisible. L’application mobile sur mon iPhone est fluide et très simple à utiliser, même la nuit en couleur !',
    date: '02 Mars 2026',
    serviceType: 'Installation Résidentielle',
    verified: true
  },
  {
    id: 'test-3',
    author: 'Karim Hadjadj',
    companyOrRole: 'Directeur Logistique',
    location: 'Lyon Saint-Exupéry',
    rating: 5,
    content: 'Notre NVR principal a planté un dimanche soir. Appel au service d’astreinte VigiCam : un technicien était sur place en 1h30 avec un disque de secours. Réparation terminée à minuit sans aucune perte de flux. Un contrat de maintenance indispensable.',
    date: '24 Janvier 2026',
    serviceType: 'Dépannage d’Urgence',
    verified: true
  }
];

export const INITIAL_QUOTES: QuoteRequest[] = [
  {
    id: 'quote-sample-1',
    trackingCode: 'DEV-2026-9812',
    clientName: 'Cabinet Médical Santé Plus',
    email: 'contact@santeplus-cabinet.fr',
    phone: '01 42 68 90 12',
    address: '24 Avenue Montaigne, 75008 Paris',
    propertyType: 'commerce',
    cameraCount: 6,
    resolution: '4K',
    storagePreference: 'hybride',
    needsAiDetection: true,
    needsNightColor: true,
    needsRemoteApp: true,
    estimatedPrice: 2450,
    notes: 'Besoin d’un écran dans le bureau de direction + caméras dômes discrètes dans la salle d’attente et les accès extérieurs.',
    status: 'en_etude',
    adminNotes: 'Visite technique programmée jeudi à 14h avec Thomas.',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'quote-sample-2',
    trackingCode: 'DEV-2026-4431',
    clientName: 'Alexandre Fontaine',
    email: 'a.fontaine78@gmail.com',
    phone: '06 33 21 98 45',
    address: '14 Allée des Chênes, 78100 Saint-Germain-en-Laye',
    propertyType: 'maison',
    cameraCount: 4,
    resolution: '4K',
    storagePreference: 'nvr_local',
    needsAiDetection: true,
    needsNightColor: true,
    needsRemoteApp: true,
    estimatedPrice: 1680,
    notes: 'Maison avec jardin de 800m², besoin de surveiller le portail, l’entrée principale et la terrasse arrière.',
    status: 'devis_transmis',
    adminNotes: 'Devis envoyé par email à 1680 € TTC. En attente de signature du client.',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString()
  }
];

export const INITIAL_INTERVENTIONS: InterventionTicket[] = [
  {
    id: 'inter-sample-1',
    trackingCode: 'DEP-2026-1049',
    clientName: 'Entrepôt LogiTrans 93',
    email: 'maintenance@logitrans93.com',
    phone: '01 48 30 11 22',
    address: 'Zone Industrielle Nord, 93290 Tremblay-en-France',
    issueType: 'camera_offline',
    priority: 'urgente',
    description: 'Deux caméras PTZ extérieures du quai de déchargement n°4 ne répondent plus depuis un orage hier soir. Câblage ou injecteur PoE défaillant suspecté.',
    preferredDate: 'Aujourd’hui',
    timeSlot: 'express_2h',
    status: 'en_route',
    technician: 'Julien R. - Équipe Dépannage Express',
    adminNotes: 'Technicien parti avec injecteurs PoE 60W de rechange et testeur de ligne Fluke.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  },
  {
    id: 'inter-sample-2',
    trackingCode: 'DEP-2026-0883',
    clientName: 'Boutique Écrin Bijoux',
    email: 'contact@ecrinbijoux-paris.fr',
    phone: '06 89 54 12 30',
    address: '52 Rue de Passy, 75016 Paris',
    issueType: 'maintenance_preventive',
    priority: 'normale',
    description: 'Maintenance préventive semestrielle : dépoussiérage des 8 optiques, vérification de l’onduleur et contrôle du journal des disques NVR.',
    preferredDate: '12 Octobre 2026',
    timeSlot: 'matin',
    status: 'planifie',
    technician: 'Marc V. - Service Contrats Pro',
    adminNotes: 'Rendez-vous confirmé à 09h30 avant l’ouverture de la boutique.',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
  }
];
