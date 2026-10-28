import React, { useState, useEffect } from 'react';
import { Star, CheckCircle2 } from 'lucide-react';
import { TestimonialItem } from '../../types';
import { getTestimonials } from '../../services/dataService';

export const TestimonialsSection: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getTestimonials();
        setReviews(data);
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    };
    load();
  }, []);

  return (
    <section className="py-24 sm:py-32 bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Section Header */}
        <div className="max-w-2xl space-y-3 mb-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-500">
            Retours d'Expérience
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-100">
            La confiance de nos clients sur le terrain.
          </h2>
          <p className="text-base text-zinc-400">
            Particuliers, gestionnaires de commerces et directeurs de sites industriels partagent leur avis.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id || rev.author}
              className="p-7 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  "{rev.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/60">
                <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1.5">
                  <span>{rev.author}</span>
                  {rev.verified && (
                    <span title="Client vérifié" className="inline-flex">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  {rev.companyOrRole} • {rev.location}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
