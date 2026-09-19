import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Truck, Home, Zap, Leaf, ShieldCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface DeliveryAnimationSectionProps {
  onTrackOrder: () => void;
  onShopNow: () => void;
}

export const DeliveryAnimationSection: React.FC<DeliveryAnimationSectionProps> = ({
  onTrackOrder,
  onShopNow
}) => {
  return (
    <section id="delivery-animation-section" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_60%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Hyperlocal Cold-Chain Fulfillment</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            From Our Store to Your Door
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Watch our automated fulfillment line package your groceries into temperature-controlled pods and rush them to your doorstep.
          </p>
        </div>

        {/* Visual 3D Journey: Grocery Bag → Delivery Vehicle → House */}
        <div className="relative bg-slate-800/80 rounded-4xl p-6 sm:p-12 border border-slate-700/80 shadow-2xl mb-16 overflow-hidden">
          
          {/* Animated Connecting Track */}
          <div className="hidden md:block absolute top-1/2 left-16 right-16 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 -translate-y-1/2 z-0 opacity-40" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Stage 1: 3D Grocery Bag */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-800 border border-slate-700 shadow-xl"
            >
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-5 shadow-lg shadow-emerald-500/20">
                <ShoppingBag className="w-12 h-12 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-1">
                Step 01 • Micro-Hub
              </span>
              <h3 className="text-xl font-bold text-white font-display mb-2">
                Hand-Picked & Packed
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Picked with care from refrigerated aisles and sealed into thermal compostable grocery pods.
              </p>
            </motion.div>

            {/* Stage 2: Delivery Vehicle */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-800 border border-amber-500/40 shadow-xl relative"
            >
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Electric Fleet
              </div>
              <div className="w-24 h-24 rounded-3xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-amber-300 mb-5 shadow-lg shadow-amber-500/20">
                <Truck className="w-12 h-12 text-amber-400" />
              </div>
              <span className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-1">
                Step 02 • In Transit
              </span>
              <h3 className="text-xl font-bold text-white font-display mb-2">
                Express Cold-Chain EV
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero-emission refrigeration keeps crisp greens cold and dairy fresh throughout the entire drive.
              </p>
            </motion.div>

            {/* Stage 3: House */}
            <motion.div
              whileHover={{ y: -6, scale: 1.02 }}
              className="flex flex-col items-center text-center p-6 rounded-3xl bg-slate-800 border border-slate-700 shadow-xl"
            >
              <div className="w-24 h-24 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-5 shadow-lg shadow-emerald-500/20">
                <Home className="w-12 h-12 text-emerald-400" />
              </div>
              <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider mb-1">
                Step 03 • Doorstep
              </span>
              <h3 className="text-xl font-bold text-white font-display mb-2">
                Delivered in 15 Mins
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Placed safely at your front door with real-time photographic confirmation and SMS notification.
              </p>
            </motion.div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Have an active grocery delivery? Track real-time driver coordinates.
            </div>
            <button
              onClick={onTrackOrder}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 cursor-pointer"
            >
              <span>Track Live Delivery Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4 Pillars of FreshCart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Fast Delivery</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                15-minute express slots or scheduled same-day delivery at your preferred hour.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Fresh Products</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hand-harvested daily from certified organic farms, with rigorous inspection tests.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Secure Packaging</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Insulated, tamper-evident biodegradable boxes protect chilled dairy and eggs.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 flex-shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">Easy Returns</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Not satisfied with an apple or avocado? Instant 1-click refund, no return needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
