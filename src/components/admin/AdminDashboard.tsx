import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  FileText, 
  Wrench, 
  Camera, 
  Star, 
  ArrowLeft, 
  TrendingUp, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  Check, 
  X,
  Sliders,
  DollarSign,
  AlertCircle,
  LogOut,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { 
  QuoteRequest, 
  InterventionTicket, 
  CameraProduct, 
  TestimonialItem,
  QuoteStatus,
  InterventionStatus
} from '../../types';
import { 
  getQuotes, 
  updateQuote, 
  deleteQuote, 
  getInterventions, 
  updateIntervention, 
  deleteIntervention, 
  getCameras, 
  addCamera, 
  updateCamera, 
  deleteCamera,
  getTestimonials,
  seedInitialDataIfNeeded
} from '../../services/dataService';

interface AdminDashboardProps {
  onBackToClientSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToClientSite }) => {
  // Authentication via Firebase Auth
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!auth.currentUser);
  const [emailInput, setEmailInput] = useState('admin@vigicam.ma');
  const [passwordInput, setPasswordInput] = useState('VigiCam2026!');
  const [authLoading, setAuthLoading] = useState(false);
  const [authErrorMsg, setAuthErrorMsg] = useState<string | null>(null);

  // Sync with Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'interventions' | 'cameras' | 'reviews'>('overview');

  // Data states
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [interventions, setInterventions] = useState<InterventionTicket[]>([]);
  const [cameras, setCameras] = useState<CameraProduct[]>([]);
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Edit modals
  const [editingQuote, setEditingQuote] = useState<QuoteRequest | null>(null);
  const [editingIntervention, setEditingIntervention] = useState<InterventionTicket | null>(null);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);

  // New Camera Form
  const [newCamName, setNewCamName] = useState('');
  const [newCamCat, setNewCamCat] = useState<'dome' | 'bullet' | 'ptz' | 'nvr' | 'solar_4g' | 'thermal'>('dome');
  const [newCamRes, setNewCamRes] = useState('4K Ultra HD');
  const [newCamPrice, setNewCamPrice] = useState(320);
  const [newCamFeatures, setNewCamFeatures] = useState('IK10 Anti-Vandale, IP67, IA Détection silhouette');

  const loadData = async () => {
    setLoading(true);
    try {
      await seedInitialDataIfNeeded();
      const [qData, iData, cData, rData] = await Promise.all([
        getQuotes(),
        getInterventions(),
        getCameras(),
        getTestimonials()
      ]);
      setQuotes(qData);
      setInterventions(iData);
      setCameras(cData);
      setReviews(rData);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleFirebaseLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthErrorMsg(null);

    const email = emailInput.trim();
    const password = passwordInput;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      // If user does not exist yet in Firebase Auth, attempt auto-creation for quick bootstrap
      const errorCode = err?.code || '';
      if (
        errorCode === 'auth/user-not-found' || 
        errorCode === 'auth/invalid-credential' || 
        errorCode === 'auth/invalid-login-credentials'
      ) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          return;
        } catch (createErr: any) {
          setAuthErrorMsg(err?.message || 'Identifiants administrateur incorrects.');
        }
      } else {
        setAuthErrorMsg(err?.message || 'Erreur d\'authentification Firebase.');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
    } catch (err) {
      console.error(err);
    }
  };

  // KPIs
  const totalQuotesValue = quotes.reduce((acc, q) => acc + (q.estimatedPrice || 0), 0);
  const urgentInterventionsCount = interventions.filter(i => i.priority === 'urgente' && i.status !== 'resolu').length;
  const pendingQuotesCount = quotes.filter(q => q.status === 'nouveau' || q.status === 'en_etude').length;
  const activeInterventionsCount = interventions.filter(i => i.status !== 'resolu' && i.status !== 'annule').length;

  // Quick toggle status for quotes
  const handleQuickQuoteStatus = async (quote: QuoteRequest, nextStatus: QuoteStatus) => {
    if (!quote.id) return;
    try {
      await updateQuote(quote.id, { status: nextStatus });
      setQuotes(quotes.map(q => q.id === quote.id ? { ...q, status: nextStatus } : q));
    } catch (err) {
      console.error(err);
    }
  };

  // Quick toggle status for interventions
  const handleQuickInterventionStatus = async (it: InterventionTicket, nextStatus: InterventionStatus) => {
    if (!it.id) return;
    try {
      await updateIntervention(it.id, { status: nextStatus });
      setInterventions(interventions.map(i => i.id === it.id ? { ...i, status: nextStatus } : i));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Quote
  const handleDeleteQuote = async (id: string) => {
    if (!confirm('Supprimer cette demande de devis ?')) return;
    try {
      await deleteQuote(id);
      setQuotes(quotes.filter(q => q.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Intervention
  const handleDeleteIntervention = async (id: string) => {
    if (!confirm('Supprimer ce ticket d\'intervention ?')) return;
    try {
      await deleteIntervention(id);
      setInterventions(interventions.filter(i => i.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Add camera
  const handleAddCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCamName.trim()) return;

    const newProd: Omit<CameraProduct, 'id'> = {
      name: newCamName.trim(),
      category: newCamCat,
      resolution: newCamRes,
      nightVision: 'Vision nocturne 30m',
      price: Number(newCamPrice),
      installationIncluded: true,
      features: newCamFeatures,
      inStock: true,
      imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'
    };

    try {
      const id = await addCamera(newProd);
      setCameras([...cameras, { id, ...newProd }]);
      setShowAddCameraModal(false);
      setNewCamName('');
    } catch (err) {
      console.error(err);
    }
  };

  // Login view with real Firebase Authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-xl font-semibold text-zinc-100">Espace Administration VigiCam</h2>
            <p className="text-xs text-zinc-400">Authentification sécurisée par Firebase Auth & RBAC</p>
          </div>

          <form onSubmit={handleFirebaseLogin} className="space-y-4 text-left">
            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Email Administrateur</label>
              <input
                type="email"
                required
                autoFocus
                placeholder="admin@vigicam.ma"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-400 block mb-1">Mot de passe</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {authErrorMsg && (
              <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authErrorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {authLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Connexion Firebase en cours...</span>
                </>
              ) : (
                <span>Se connecter au Dashboard</span>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-zinc-800/60 space-y-3">
            <button
              type="button"
              onClick={() => {
                setEmailInput('admin@vigicam.ma');
                setPasswordInput('VigiCam2026!');
              }}
              className="w-full py-2 px-3 bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 rounded text-xs text-blue-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Charger identifiants démo (admin@vigicam.ma)</span>
            </button>

            <div>
              <button
                onClick={onBackToClientSite}
                className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour au site public</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Modern Sidebar-based Dashboard Layout
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row text-left">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-zinc-900/50 border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                <Lock className="w-3 h-3" />
              </div>
              <span className="text-xs font-semibold text-zinc-200">VigiCam Console</span>
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="text-zinc-500 hover:text-zinc-300 p-1"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Vue d'ensemble</span>
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'quotes'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Demandes de Devis</span>
              </div>
              {pendingQuotesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-500/20 text-blue-400 font-semibold font-mono">
                  {pendingQuotesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('interventions')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'interventions'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>Interventions & Pannes</span>
              </div>
              {urgentInterventionsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-500/20 text-red-400 font-semibold font-mono">
                  {urgentInterventionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cameras')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'cameras'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Catalogue Caméras</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Avis clients</span>
            </button>
          </nav>
        </div>

        {/* Bottom User Info & Exit */}
        <div className="pt-6 border-t border-zinc-800/60 space-y-3">
          {/* User Badge */}
          <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold">Firebase Auth</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-xs font-mono text-zinc-200 truncate">
              {currentUser?.email || 'admin@vigicam.ma'}
            </div>
          </div>

          <button
            onClick={onBackToClientSite}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Site public</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto space-y-8">
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h1 className="text-xl font-semibold text-zinc-100">Vue d'ensemble de l'activité</h1>
              <p className="text-xs text-zinc-400 mt-1">Indicateurs clés et demandes récentes en temps réel.</p>
            </div>

            {/* Minimal Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Devis en attente</span>
                <div className="text-2xl font-semibold text-zinc-100">{pendingQuotesCount}</div>
                <span className="text-[11px] text-zinc-500 font-mono">Sur {quotes.length} total</span>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Urgences critiques</span>
                <div className="text-2xl font-semibold text-red-400">{urgentInterventionsCount}</div>
                <span className="text-[11px] text-zinc-500">Délai contractuel &lt; 2h</span>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Interventions actives</span>
                <div className="text-2xl font-semibold text-zinc-100">{activeInterventionsCount}</div>
                <span className="text-[11px] text-zinc-500">En cours de traitement</span>
              </div>

              <div className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 space-y-1">
                <span className="text-xs text-zinc-400 font-medium">Estimation pipeline</span>
                <div className="text-2xl font-semibold text-zinc-100">
                  {totalQuotesValue.toLocaleString('fr-FR')} €
                </div>
                <span className="text-[11px] text-zinc-500">Valeur totale des devis</span>
              </div>
            </div>

            {/* Recent Quotes & Tickets */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Quotes preview */}
              <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-100">Derniers devis reçus</h3>
                  <button 
                    onClick={() => setActiveTab('quotes')}
                    className="text-xs text-blue-400 hover:underline cursor-pointer"
                  >
                    Voir tout
                  </button>
                </div>
                <div className="space-y-2">
                  {quotes.slice(0, 4).map((q) => (
                    <div
                      key={q.id || q.trackingCode}
                      className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-zinc-200">{q.clientName}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{q.trackingCode} • {q.cameraCount} cams</div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-zinc-200">{q.estimatedPrice} €</span>
                        <div className="text-[10px] text-zinc-500 uppercase">{q.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interventions preview */}
              <div className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/60 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-zinc-100">Dépannages récents</h3>
                  <button 
                    onClick={() => setActiveTab('interventions')}
                    className="text-xs text-blue-400 hover:underline cursor-pointer"
                  >
                    Voir tout
                  </button>
                </div>
                <div className="space-y-2">
                  {interventions.slice(0, 4).map((it) => (
                    <div
                      key={it.id || it.trackingCode}
                      className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-800/60 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-medium text-zinc-200">{it.clientName}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">{it.trackingCode} • {it.issueType.replace('_', ' ')}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-semibold uppercase ${
                          it.priority === 'urgente' ? 'text-red-400' : 'text-zinc-400'
                        }`}>
                          {it.priority}
                        </span>
                        <div className="text-[10px] text-zinc-500 uppercase">{it.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: QUOTES */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-zinc-100">Demandes de Devis ({quotes.length})</h1>
                <p className="text-xs text-zinc-400 mt-1">Consultez et changez le statut des devis en un clic.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrer..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300"
                >
                  <option value="all">Tous</option>
                  <option value="nouveau">Nouveau</option>
                  <option value="en_etude">En étude</option>
                  <option value="devis_transmis">Transmis</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                </select>
              </div>
            </div>

            {/* Clean Quotes Table */}
            <div className="rounded-xl bg-zinc-900/30 border border-zinc-800/80 overflow-hidden overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900/60 text-zinc-400 font-medium border-b border-zinc-800/60">
                  <tr>
                    <th className="p-3">Code</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Configuration</th>
                    <th className="p-3">Budget</th>
                    <th className="p-3">Statut (Bascule rapide)</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {quotes
                    .filter(q => {
                      const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
                      const matchesSearch = searchQuery === '' || 
                        q.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        q.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());
                      return matchesStatus && matchesSearch;
                    })
                    .map((q) => (
                      <tr key={q.id || q.trackingCode} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-3 font-mono text-blue-400 font-medium">{q.trackingCode}</td>
                        <td className="p-3">
                          <div className="font-medium text-zinc-200">{q.clientName}</div>
                          <div className="text-zinc-500 text-[11px]">{q.phone} • {q.email}</div>
                        </td>
                        <td className="p-3 text-zinc-400">
                          {q.cameraCount} cams ({q.resolution}) • <span className="capitalize">{q.propertyType}</span>
                        </td>
                        <td className="p-3 font-medium text-zinc-200">{q.estimatedPrice} €</td>
                        <td className="p-3">
                          <select
                            value={q.status}
                            onChange={(e) => handleQuickQuoteStatus(q, e.target.value as QuoteStatus)}
                            className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-200 focus:outline-none"
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="en_etude">En étude</option>
                            <option value="devis_transmis">Transmis</option>
                            <option value="accepte">Accepté</option>
                            <option value="refuse">Refusé</option>
                          </select>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setEditingQuote(q)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            title="Détails"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => q.id && handleDeleteQuote(q.id)}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INTERVENTIONS */}
        {activeTab === 'interventions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold text-zinc-100">Tickets d'Intervention ({interventions.length})</h1>
                <p className="text-xs text-zinc-400 mt-1">Assignez un technicien et suivez l'avancement sur site.</p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrer panne ou client..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                  />
                </div>
              </div>
            </div>

            {/* Clean Interventions Table */}
            <div className="rounded-xl bg-zinc-900/30 border border-zinc-800/80 overflow-hidden overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-900/60 text-zinc-400 font-medium border-b border-zinc-800/60">
                  <tr>
                    <th className="p-3">Ticket</th>
                    <th className="p-3">Client & Adresse</th>
                    <th className="p-3">Panne</th>
                    <th className="p-3">Priorité</th>
                    <th className="p-3">Statut (Bascule rapide)</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {interventions
                    .filter(it => {
                      return searchQuery === '' || 
                        it.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        it.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());
                    })
                    .map((it) => (
                      <tr key={it.id || it.trackingCode} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="p-3 font-mono text-zinc-300 font-medium">{it.trackingCode}</td>
                        <td className="p-3">
                          <div className="font-medium text-zinc-200">{it.clientName}</div>
                          <div className="text-zinc-500 text-[11px] truncate max-w-xs">{it.address}</div>
                        </td>
                        <td className="p-3 text-zinc-300 capitalize">
                          {it.issueType.replace('_', ' ')}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-semibold uppercase ${
                            it.priority === 'urgente' ? 'text-red-400' : 'text-zinc-400'
                          }`}>
                            {it.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <select
                            value={it.status}
                            onChange={(e) => handleQuickInterventionStatus(it, e.target.value as InterventionStatus)}
                            className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-200 focus:outline-none"
                          >
                            <option value="en_attente">En attente</option>
                            <option value="planifie">Planifié</option>
                            <option value="en_route">En route</option>
                            <option value="en_cours">En cours</option>
                            <option value="resolu">Résolu</option>
                            <option value="annule">Annulé</option>
                          </select>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => setEditingIntervention(it)}
                            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                            title="Gérer ticket"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => it.id && handleDeleteIntervention(it.id)}
                            className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: CAMERAS CATALOG */}
        {activeTab === 'cameras' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-zinc-100">Catalogue de Caméras</h1>
                <p className="text-xs text-zinc-400 mt-1">Gérez les prix unitaires et disponibilités du matériel.</p>
              </div>

              <button
                onClick={() => setShowAddCameraModal(true)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un équipement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cameras.map((cam) => (
                <div key={cam.id || cam.name} className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{cam.category}</span>
                    <span className={`text-[10px] font-medium ${cam.inStock ? 'text-emerald-400' : 'text-zinc-500'}`}>
                      {cam.inStock ? 'En stock' : 'Rupture'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-100 text-sm">{cam.name}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{cam.resolution}</p>
                  </div>
                  <div className="pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="font-semibold text-zinc-100">{cam.price} €</span>
                    <button
                      onClick={() => cam.id && deleteCamera(cam.id).then(() => setCameras(cameras.filter(c => c.id !== cam.id)))}
                      className="text-xs text-zinc-500 hover:text-red-400"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-semibold text-zinc-100">Avis & Témoignages</h1>
              <p className="text-xs text-zinc-400 mt-1">Retours clients vérifiés enregistrés.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <div key={r.id || r.author} className="p-5 rounded-xl bg-zinc-900/30 border border-zinc-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-zinc-200 text-xs">{r.author} ({r.location})</span>
                    <div className="flex text-amber-400">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 italic">"{r.content}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* EDIT QUOTE MODAL */}
      {editingQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-100">Détails devis {editingQuote.trackingCode}</h3>
              <button onClick={() => setEditingQuote(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Statut</label>
                <select
                  value={editingQuote.status}
                  onChange={(e) => setEditingQuote({ ...editingQuote, status: e.target.value as QuoteStatus })}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="en_etude">En étude</option>
                  <option value="devis_transmis">Transmis</option>
                  <option value="accepte">Accepté</option>
                  <option value="refuse">Refusé</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Montant estimé (€ TTC)</label>
                <input
                  type="number"
                  value={editingQuote.estimatedPrice}
                  onChange={(e) => setEditingQuote({ ...editingQuote, estimatedPrice: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Notes internes technicien</label>
                <textarea
                  rows={3}
                  value={editingQuote.adminNotes || ''}
                  onChange={(e) => setEditingQuote({ ...editingQuote, adminNotes: e.target.value })}
                  placeholder="Notes sur la faisabilité..."
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingQuote(null)}
                className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (editingQuote.id) {
                    await updateQuote(editingQuote.id, {
                      status: editingQuote.status,
                      estimatedPrice: editingQuote.estimatedPrice,
                      adminNotes: editingQuote.adminNotes
                    });
                    setQuotes(quotes.map(q => q.id === editingQuote.id ? editingQuote : q));
                  }
                  setEditingQuote(null);
                }}
                className="px-3 py-1.5 rounded bg-blue-600 text-white font-medium"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT INTERVENTION MODAL */}
      {editingIntervention && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-100">Ticket {editingIntervention.trackingCode}</h3>
              <button onClick={() => setEditingIntervention(null)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Statut</label>
                <select
                  value={editingIntervention.status}
                  onChange={(e) => setEditingIntervention({ ...editingIntervention, status: e.target.value as InterventionStatus })}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                >
                  <option value="en_attente">En attente</option>
                  <option value="planifie">Planifié</option>
                  <option value="en_route">En route</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolu">Résolu</option>
                  <option value="annule">Annulé</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Technicien assigné</label>
                <input
                  type="text"
                  value={editingIntervention.technician || ''}
                  onChange={(e) => setEditingIntervention({ ...editingIntervention, technician: e.target.value })}
                  placeholder="Ex: Thomas M."
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Compte-rendu intervention</label>
                <textarea
                  rows={3}
                  value={editingIntervention.adminNotes || ''}
                  onChange={(e) => setEditingIntervention({ ...editingIntervention, adminNotes: e.target.value })}
                  placeholder="Diagnostic et pièces remplacées..."
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setEditingIntervention(null)}
                className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (editingIntervention.id) {
                    await updateIntervention(editingIntervention.id, {
                      status: editingIntervention.status,
                      technician: editingIntervention.technician,
                      adminNotes: editingIntervention.adminNotes
                    });
                    setInterventions(interventions.map(i => i.id === editingIntervention.id ? editingIntervention : i));
                  }
                  setEditingIntervention(null);
                }}
                className="px-3 py-1.5 rounded bg-blue-600 text-white font-medium"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CAMERA MODAL */}
      {showAddCameraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
              <h3 className="text-sm font-semibold text-zinc-100">Ajouter une référence caméra</h3>
              <button onClick={() => setShowAddCameraModal(false)} className="text-zinc-500 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCamera} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Nom du produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Dôme 4K ColorVu IK10"
                  value={newCamName}
                  onChange={(e) => setNewCamName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-zinc-400 block mb-1">Catégorie</label>
                  <select
                    value={newCamCat}
                    onChange={(e) => setNewCamCat(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                  >
                    <option value="dome">Dôme</option>
                    <option value="bullet">Tube</option>
                    <option value="ptz">PTZ</option>
                    <option value="nvr">NVR</option>
                    <option value="solar_4g">Solaire 4G</option>
                    <option value="thermal">Thermique</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Prix TTC posé (€)</label>
                  <input
                    type="number"
                    required
                    value={newCamPrice}
                    onChange={(e) => setNewCamPrice(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Caractéristiques</label>
                <textarea
                  rows={2}
                  value={newCamFeatures}
                  onChange={(e) => setNewCamFeatures(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-200 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCameraModal(false)}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-blue-600 text-white font-medium"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
