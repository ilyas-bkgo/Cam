import React, { useState, useEffect } from 'react';
import { Camera, Search } from 'lucide-react';
import { CameraProduct } from '../../types';
import { getCameras } from '../../services/dataService';

interface EquipmentCatalogProps {
  onSelectProductForQuote: (product: CameraProduct) => void;
}

export const EquipmentCatalog: React.FC<EquipmentCatalogProps> = ({
  onSelectProductForQuote
}) => {
  const [products, setProducts] = useState<CameraProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCameras();
        setProducts(data);
      } catch (err) {
        console.error('Failed to load cameras:', err);
      }
    };
    load();
  }, []);

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'dome', label: 'Dômes' },
    { id: 'bullet', label: 'Tubes' },
    { id: 'ptz', label: 'PTZ 360°' },
    { id: 'nvr', label: 'Enregistreurs NVR' },
    { id: 'solar_4g', label: 'Solaire 4G' },
    { id: 'thermal', label: 'Thermique' },
  ];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.features.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
              Matériel Certifié
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
              Équipements de référence.
            </h2>
            <p className="text-sm text-zinc-400">
              Caméras professionnelles certifiées (Hikvision, Dahua, Axis) sélectionnées pour leur fiabilité.
            </p>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un modèle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id || product.name}
              className="rounded-2xl p-6 bg-zinc-900/30 border border-zinc-800/60 hover:border-zinc-700/80 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800/60 relative">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover opacity-85 group-hover:opacity-95 transition-opacity"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-md text-[10px] font-mono text-zinc-300 border border-zinc-800">
                    {product.resolution}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-zinc-100 text-sm">{product.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{product.features}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                <div>
                  <div className="text-base font-semibold text-zinc-100">{product.price} €</div>
                  <div className="text-[10px] text-zinc-500">Pose & câblage compris</div>
                </div>
                <button
                  onClick={() => onSelectProductForQuote(product)}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer transition-colors"
                >
                  Ajouter au devis
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
