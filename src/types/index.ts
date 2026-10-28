export type PropertyType = 'maison' | 'appartement' | 'commerce' | 'entrepot' | 'immeuble' | 'chantier';
export type ResolutionType = '2K' | '4K' | '8K_Ultra' | 'Thermique';
export type StorageType = 'nvr_local' | 'cloud_securise' | 'hybride';
export type QuoteStatus = 'nouveau' | 'en_etude' | 'devis_transmis' | 'accepte' | 'refuse';

export interface QuoteRequest {
  id?: string;
  trackingCode: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  propertyType: PropertyType;
  cameraCount: number;
  resolution: ResolutionType;
  storagePreference: StorageType;
  needsAiDetection: boolean;
  needsNightColor: boolean;
  needsRemoteApp: boolean;
  estimatedPrice: number;
  notes?: string;
  status: QuoteStatus;
  adminNotes?: string;
  createdAt: string;
}

export type IssueType = 
  | 'camera_offline' 
  | 'black_screen' 
  | 'recording_failure' 
  | 'network_issue' 
  | 'vandalism' 
  | 'maintenance_preventive' 
  | 'autre';

export type PriorityLevel = 'urgente' | 'haute' | 'normale' | 'basse';

export type InterventionStatus = 
  | 'en_attente' 
  | 'planifie' 
  | 'en_route' 
  | 'en_cours' 
  | 'resolu' 
  | 'annule';

export type TimeSlot = 'matin' | 'apres_midi' | 'express_2h' | 'nuit_astreinte';

export interface InterventionTicket {
  id?: string;
  trackingCode: string;
  clientName: string;
  email: string;
  phone: string;
  address: string;
  issueType: IssueType;
  priority: PriorityLevel;
  description: string;
  preferredDate: string;
  timeSlot: TimeSlot;
  status: InterventionStatus;
  technician?: string;
  adminNotes?: string;
  createdAt: string;
}

export type CameraCategory = 'dome' | 'bullet' | 'ptz' | 'nvr' | 'solar_4g' | 'thermal';

export interface CameraProduct {
  id?: string;
  name: string;
  category: CameraCategory;
  resolution: string;
  nightVision: string;
  price: number;
  installationIncluded: boolean;
  features: string;
  inStock: boolean;
  badge?: string;
  imageUrl?: string;
}

export interface TestimonialItem {
  id?: string;
  author: string;
  companyOrRole: string;
  location: string;
  rating: number;
  content: string;
  date: string;
  serviceType: string;
  verified: boolean;
}
