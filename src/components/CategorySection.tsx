import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { ICategory, PageView } from '../types';

interface CategorySectionProps {
  categories: ICategory[];
  onSelectCategory: (categorySlug: string) => void;
  onNavigate: (page: PageView) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onSelectCategory,
  onNavigate
}) => {
  return (
    <section id="categories-section" className="py-16 sm:py-20 bg-slate-50/70 border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Aisles & Departments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
              Explore Fresh Categories
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1 max-w-xl">
              From organic farm-picked produce to pantry essentials, explore hand-selected goods across all 12 aisles.
            </p>
          </div>

          <button
            onClick={() => onNavigate('shop')}
            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 font-bold text-sm group"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 12 Categories Grid with 3D Tilt Hover Effects */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map(cat => (
            <div
              key={cat._id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative bg-white rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/15 border border-slate-100 hover:border-emerald-300 transition-all duration-300 transform hover:-translate-y-2 hover:-rotate-1 cursor-pointer flex flex-col items-center text-center overflow-hidden"
            >
              {/* Category 3D Image with Zoom */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-slate-50 mb-3 shadow-inner flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                {/* Floating Emoji Icon Badge */}
                <span className="absolute bottom-1.5 right-1.5 text-xl sm:text-2xl drop-shadow-md transform group-hover:scale-125 group-hover:rotate-12 transition-transform">
                  {cat.icon}
                </span>
              </div>

              {/* Title & Product Count */}
              <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors leading-snug">
                {cat.name}
              </h3>
              <span className="text-xs text-slate-400 font-medium mt-0.5">
                {cat.productCount}+ items
              </span>

              {/* Hover Pill */}
              <div className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-block w-full py-1 text-[11px] font-bold rounded-xl bg-emerald-50 text-emerald-700">
                  Shop Now →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
