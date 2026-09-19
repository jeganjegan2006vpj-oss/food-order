import React, { useState } from 'react';
import {
  ShoppingCart,
  Sparkles,
  Mail,
  Send,
  ShieldCheck,
  Truck,
  Phone,
  MapPin,
  Heart
} from 'lucide-react';
import { PageView } from '../types';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onSelectCategory: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    addToast({
      type: 'success',
      title: 'Subscribed! 🎉',
      message: 'Check your inbox for your 20% discount coupon code'
    });
    setNewsletterEmail('');
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-white border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-950 p-6 sm:p-10 mb-16 border border-emerald-700/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Join FreshCart Club</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Get $20 Off Your First Organic Haul
            </h3>
            <p className="text-xs sm:text-sm text-emerald-200/80 mt-1">
              Subscribe for weekly harvest drops, chef recipes, secret flash deals, and zero delivery fee perks.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="relative z-10 flex w-full max-w-md gap-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full text-xs sm:text-sm pl-10 pr-3 py-3.5 rounded-2xl bg-slate-900/90 text-white placeholder-slate-400 border border-emerald-600/40 focus:outline-hidden focus:border-emerald-400"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs sm:text-sm transition active:scale-95 flex items-center gap-1.5 shadow-lg shadow-emerald-400/20 cursor-pointer"
            >
              <span>Join</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="col-span-2">
            <div className="flex items-center gap-2.5 mb-4 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-slate-950 font-black shadow-md">
                <ShoppingCart className="w-5 h-5 text-emerald-950" />
              </div>
              <span className="text-2xl font-extrabold font-display">
                Fresh<span className="text-emerald-400">Cart</span> 3D
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              Next-generation interactive 3D online supermarket delivering hand-picked farm vegetables, ripe fruits, artisan bread, and pantry staples in 15 minutes.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>15-Min Delivery</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Organic</span>
              </div>
            </div>
          </div>

          {/* Grocery Departments */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Top Aisles
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Beverages', 'Snacks'].map(name => (
                <li key={name}>
                  <button
                    onClick={() => onSelectCategory(name.toLowerCase())}
                    className="hover:text-emerald-400 transition cursor-pointer"
                  >
                    {name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('shop')} className="hover:text-emerald-400 transition cursor-pointer">
                  Catalog Shop
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('deals')} className="hover:text-emerald-400 transition cursor-pointer">
                  Today&rsquo;s 50% Deals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('store3d')} className="hover:text-amber-400 transition cursor-pointer font-bold text-amber-300">
                  ✨ Enter 3D Store
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-emerald-400 transition cursor-pointer">
                  Live GPS Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wishlist')} className="hover:text-emerald-400 transition cursor-pointer">
                  My Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Download App & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Mobile Apps
            </h4>
            <div className="space-y-2 mb-4">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition">
                <span className="text-xl">🍏</span>
                <div>
                  <div className="text-[9px] text-slate-400 leading-none">Download on the</div>
                  <div className="text-xs font-bold text-white leading-tight">Apple App Store</div>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 cursor-pointer hover:border-emerald-500/50 transition">
                <span className="text-xl">🤖</span>
                <div>
                  <div className="text-[9px] text-slate-400 leading-none">Get it on</div>
                  <div className="text-xs font-bold text-white leading-tight">Google Play</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-800-FRESH-CART</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 FreshCart 3D Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Cold Chain Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
