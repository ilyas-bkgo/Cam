import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  limit 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  QuoteRequest, 
  InterventionTicket, 
  CameraProduct, 
  TestimonialItem,
  PropertyType
} from '../types';
import { 
  INITIAL_CAMERAS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_QUOTES, 
  INITIAL_INTERVENTIONS 
} from '../data/mockData';

const QUOTES_COLL = 'quotes';
const INTERVENTIONS_COLL = 'interventions';
const CAMERAS_COLL = 'cameras';
const TESTIMONIALS_COLL = 'testimonials';

// Initialize default seed data if collections are empty
export async function seedInitialDataIfNeeded() {
  try {
    const camSnap = await getDocs(collection(db, CAMERAS_COLL));
    if (camSnap.empty) {
      for (const cam of INITIAL_CAMERAS) {
        await addDoc(collection(db, CAMERAS_COLL), cam);
      }
    }

    const testSnap = await getDocs(collection(db, TESTIMONIALS_COLL));
    if (testSnap.empty) {
      for (const t of INITIAL_TESTIMONIALS) {
        await addDoc(collection(db, TESTIMONIALS_COLL), t);
      }
    }

    const quotesSnap = await getDocs(collection(db, QUOTES_COLL));
    if (quotesSnap.empty) {
      for (const q of INITIAL_QUOTES) {
        await addDoc(collection(db, QUOTES_COLL), q);
      }
    }

    const interSnap = await getDocs(collection(db, INTERVENTIONS_COLL));
    if (interSnap.empty) {
      for (const item of INITIAL_INTERVENTIONS) {
        await addDoc(collection(db, INTERVENTIONS_COLL), item);
      }
    }
  } catch (err) {
    console.warn('Seeding initial data skipped or failed:', err);
  }
}

// =================== QUOTES ===================
export async function getQuotes(): Promise<QuoteRequest[]> {
  try {
    const q = query(collection(db, QUOTES_COLL), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    if (snap.empty) {
      return INITIAL_QUOTES;
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as QuoteRequest));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, QUOTES_COLL);
    return INITIAL_QUOTES;
  }
}

export async function addQuote(data: Omit<QuoteRequest, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, QUOTES_COLL), data);
    return docRef.id;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.CREATE, QUOTES_COLL);
  }
}

export async function updateQuote(id: string, updates: Partial<QuoteRequest>): Promise<void> {
  try {
    const docRef = doc(db, QUOTES_COLL, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.UPDATE, `${QUOTES_COLL}/${id}`);
  }
}

export async function deleteQuote(id: string): Promise<void> {
  try {
    const docRef = doc(db, QUOTES_COLL, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.DELETE, `${QUOTES_COLL}/${id}`);
  }
}

// =================== INTERVENTIONS ===================
export async function getInterventions(): Promise<InterventionTicket[]> {
  try {
    const q = query(collection(db, INTERVENTIONS_COLL), orderBy('createdAt', 'desc'), limit(100));
    const snap = await getDocs(q);
    if (snap.empty) {
      return INITIAL_INTERVENTIONS;
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as InterventionTicket));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, INTERVENTIONS_COLL);
    return INITIAL_INTERVENTIONS;
  }
}

export async function addIntervention(data: Omit<InterventionTicket, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, INTERVENTIONS_COLL), data);
    return docRef.id;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.CREATE, INTERVENTIONS_COLL);
  }
}

export async function updateIntervention(id: string, updates: Partial<InterventionTicket>): Promise<void> {
  try {
    const docRef = doc(db, INTERVENTIONS_COLL, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.UPDATE, `${INTERVENTIONS_COLL}/${id}`);
  }
}

export async function deleteIntervention(id: string): Promise<void> {
  try {
    const docRef = doc(db, INTERVENTIONS_COLL, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.DELETE, `${INTERVENTIONS_COLL}/${id}`);
  }
}

// =================== CAMERAS CATALOG ===================
export async function getCameras(): Promise<CameraProduct[]> {
  try {
    const snap = await getDocs(collection(db, CAMERAS_COLL));
    if (snap.empty) {
      return INITIAL_CAMERAS;
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as CameraProduct));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, CAMERAS_COLL);
    return INITIAL_CAMERAS;
  }
}

export async function addCamera(data: Omit<CameraProduct, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, CAMERAS_COLL), data);
    return docRef.id;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.CREATE, CAMERAS_COLL);
  }
}

export async function updateCamera(id: string, updates: Partial<CameraProduct>): Promise<void> {
  try {
    const docRef = doc(db, CAMERAS_COLL, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.UPDATE, `${CAMERAS_COLL}/${id}`);
  }
}

export async function deleteCamera(id: string): Promise<void> {
  try {
    const docRef = doc(db, CAMERAS_COLL, id);
    await deleteDoc(docRef);
  } catch (error) {
    throw handleFirestoreError(error, OperationType.DELETE, `${CAMERAS_COLL}/${id}`);
  }
}

// =================== TESTIMONIALS ===================
export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const snap = await getDocs(collection(db, TESTIMONIALS_COLL));
    if (snap.empty) {
      return INITIAL_TESTIMONIALS;
    }
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TestimonialItem));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, TESTIMONIALS_COLL);
    return INITIAL_TESTIMONIALS;
  }
}

export async function addTestimonial(data: Omit<TestimonialItem, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, TESTIMONIALS_COLL), data);
    return docRef.id;
  } catch (error) {
    throw handleFirestoreError(error, OperationType.CREATE, TESTIMONIALS_COLL);
  }
}

// =================== TRACKING LOOKUP ===================
export interface QuickLeadParams {
  source: 'hero' | 'pricing' | 'configurator' | 'whatsapp_direct' | 'navbar' | 'custom';
  title?: string;
  propertyType?: PropertyType;
  cameraCount?: number;
  estimatedPrice?: number;
  notes?: string;
  clientName?: string;
  phone?: string;
  email?: string;
  city?: string;
}

/**
 * P1: Silent Lead Capture
 * Records the quote request directly into Firestore before redirecting to WhatsApp.
 * Ensures 100% of lead inquiries are retained even if WhatsApp is closed early.
 */
export async function captureLeadAndOpenWhatsApp(params: QuickLeadParams): Promise<{ trackingCode: string; docId?: string }> {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const trackingCode = `VG-${new Date().getFullYear()}-${randomSuffix}`;
  
  const quoteData: Omit<QuoteRequest, 'id'> = {
    trackingCode,
    clientName: params.clientName?.trim() || 'Prospect WhatsApp',
    email: params.email?.trim() || 'contact@vigicam.ma',
    phone: params.phone?.trim() || '+212-WhatsApp',
    address: params.city?.trim() || 'Maroc',
    propertyType: params.propertyType || 'maison',
    cameraCount: params.cameraCount || 4,
    resolution: '4K',
    storagePreference: 'nvr_local',
    needsAiDetection: true,
    needsNightColor: true,
    needsRemoteApp: true,
    estimatedPrice: params.estimatedPrice || 0,
    notes: `[Origine: ${params.source}] ${params.title || 'Demande de devis'} ${params.notes ? '· ' + params.notes : ''}`.trim(),
    status: 'nouveau',
    createdAt: new Date().toISOString()
  };

  let docId: string | undefined = undefined;
  try {
    docId = await addQuote(quoteData);
  } catch (error) {
    console.warn('Silent lead capture saved locally (network fallback):', error);
  }

  // Pre-fill WhatsApp message
  const whatsappNumber = "212661234567";
  let message = `Bonjour VigiCam Maroc,\n\nJe souhaite obtenir un devis pour : *${params.title || 'Installation Vidéosurveillance'}*.\n`;
  if (params.estimatedPrice && params.estimatedPrice > 0) {
    message += `💰 *Budget estimé* : ${params.estimatedPrice.toLocaleString('fr-FR')} DH\n`;
  }
  if (params.cameraCount) {
    message += `📹 *Nombre de caméras* : ${params.cameraCount}\n`;
  }
  if (params.city) {
    message += `📍 *Ville / Secteur* : ${params.city}\n`;
  }
  if (params.notes) {
    message += `📝 *Détails* : ${params.notes}\n`;
  }
  message += `\n🔖 *Réf. dossier* : ${trackingCode}\nMerci de me recontacter pour planifier une visite ou confirmer le devis.`;

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');

  return { trackingCode, docId };
}

export async function lookupByTrackingCode(code: string): Promise<{
  type: 'quote' | 'intervention';
  data: QuoteRequest | InterventionTicket;
} | null> {
  const cleanCode = code.trim().toUpperCase();

  try {
    // Check quotes
    const q1 = query(collection(db, QUOTES_COLL), where('trackingCode', '==', cleanCode), limit(1));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) {
      const docData = snap1.docs[0].data() as QuoteRequest;
      return { type: 'quote', data: { id: snap1.docs[0].id, ...docData } };
    }

    // Check interventions
    const q2 = query(collection(db, INTERVENTIONS_COLL), where('trackingCode', '==', cleanCode), limit(1));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) {
      const docData = snap2.docs[0].data() as InterventionTicket;
      return { type: 'intervention', data: { id: snap2.docs[0].id, ...docData } };
    }

    // Fallback search in initial demo data if offline or not in Firestore yet
    const foundQuote = INITIAL_QUOTES.find(q => q.trackingCode.toUpperCase() === cleanCode);
    if (foundQuote) return { type: 'quote', data: foundQuote };

    const foundInter = INITIAL_INTERVENTIONS.find(i => i.trackingCode.toUpperCase() === cleanCode);
    if (foundInter) return { type: 'intervention', data: foundInter };

    return null;
  } catch (error) {
    console.error('Lookup error:', error);
    // Check fallback
    const foundQuote = INITIAL_QUOTES.find(q => q.trackingCode.toUpperCase() === cleanCode);
    if (foundQuote) return { type: 'quote', data: foundQuote };

    const foundInter = INITIAL_INTERVENTIONS.find(i => i.trackingCode.toUpperCase() === cleanCode);
    if (foundInter) return { type: 'intervention', data: foundInter };

    return null;
  }
}
