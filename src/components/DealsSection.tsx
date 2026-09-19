import React, { useState, useEffect } from 'react';
import { Sparkles, Timer, ArrowRight, Flame } from 'lucide-react';
import { IProduct } from '../types';
import { ProductCard } from './ProductCard';

interface DealsSectionProps {
  products: IProduct[];
  onQuickView: (product: IProduct) => void;
  onExploreDeals: () => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  products,
  onQuickView,
  onExploreDeals
}) => {
  // Live countdown timer to midnight
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 19 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter(p => p.isDeal || p.discount >= 25).slice(0, 4);

  return (
    <section id="deals-section" className="py-16 sm:py-20 bg-gradient-to-b from-amber-500/10 via-orange-500/5 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Animated Offer Banner Card */}
        <div className="relative rounded-4xl bg-gradient-to-r from-orange-600 via-amber-600 to-emerald-700 text-white p-6 sm:p-10 shadow-2xl overflow-hidden mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Decorative floating circular sparkles */}
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute left-1/3 -bottom-16 w-48 h-48 rounded-full bg-amber-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-amber-200 text-xs font-black uppercase tracking-wider mb-3 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-bounce" />
              <span>Flash Grocery Sale</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight font-display text-white leading-tight">
              TODAY&rsquo;S BEST DEALS <br />
              <span className="text-amber-300">UP TO 50% OFF</span>
            </h2>

            <p className="text-orange-100 text-sm sm:text-base mt-2 font-medium">
              Save big on organic Honeycrisp apples, cold-pressed juices, wild seafood, and farm fresh vegetables!
            </p>
          </div>

          {/* Countdown Clock Box */}
          <div className="relative z-10 flex flex-col items-center bg-black/30 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center min-w-[240px]">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold uppercase tracking-wider mb-2">
              <Timer className="w-4 h-4 animate-spin" />
              <span>Deals Expire In</span>
            </div>

            <div className="flex items-center gap-2 font-display">
              <div className="bg-white text-slate-900 rounded-2xl w-14 py-2 text-2xl font-black shadow-lg">
                {String(timeLeft.hours).padStart(2, '0')}
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">HRS</div>
              </div>
              <span className="text-2xl font-bold text-amber-300">:</span>
              <div className="bg-white text-slate-900 rounded-2xl w-14 py-2 text-2xl font-black shadow-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">MIN</div>
              </div>
              <span className="text-2xl font-bold text-amber-300">:</span>
              <div className="bg-white text-slate-900 rounded-2xl w-14 py-2 text-2xl font-black shadow-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
                <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">SEC</div>
              </div>
            </div>

            <button
              onClick={onExploreDeals}
              className="mt-4 w-full py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-1 transition shadow-md cursor-pointer"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Featured Discounted Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map(product => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
