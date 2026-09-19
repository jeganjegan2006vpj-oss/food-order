import React, { useState } from 'react';
import {
  ShoppingCart,
  Heart,
  Search,
  User,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { PageView } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch
}) => {
  const { cartCount, setIsCartOpen, isCartShaking } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin, logout, setIsAuthModalOpen } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageView; badge?: string }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Shop', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'Deals', page: 'deals', badge: '50% OFF' },
    { label: '3D Store', page: 'store3d', badge: '3D' },
    { label: 'Track Order', page: 'tracking' },
    { label: 'About', page: 'about' }
  ];

  return (
    <>
      {/* Top Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium border-b border-emerald-800/80 flex items-center justify-center gap-3">
        <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          FreshCart 3D
        </span>
        <span className="hidden sm:inline text-emerald-300/50">|</span>
        <span className="hidden sm:inline">Use code <span className="font-bold text-amber-300 underline decoration-amber-400">FRESH20</span> for 20% off your first order!</span>
        <span className="text-emerald-300/50">|</span>
        <span className="text-emerald-200">Free delivery on orders over $35</span>
      </div>

      {/* Main Sticky Header */}
      <header id="main-navbar" className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            
            {/* Logo */}
            <div
              id="brand-logo"
              onClick={() => onNavigate('home')}
              className="flex items-center gap-3 cursor-pointer group select-none"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-display">
                    Fresh<span className="text-emerald-600">Cart</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
                    3D
                  </span>
                </div>
                <div className="text-[10px] tracking-wider uppercase text-slate-400 font-semibold -mt-1 hidden sm:block">
                  Next-Gen Grocery
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map(link => {
                const isActive = currentPage === link.page;
                return (
                  <button
                    key={link.page}
                    onClick={() => onNavigate(link.page)}
                    className={`relative px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'text-emerald-700 bg-emerald-50/90'
                        : 'text-slate-600 hover:text-emerald-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        link.badge === '3D'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-rose-100 text-rose-700 border border-rose-200'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Search Trigger */}
              <button
                id="navbar-search-btn"
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 text-xs sm:text-sm font-medium transition cursor-pointer"
                title="Search groceries (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-emerald-600" />
                <span className="hidden md:inline text-slate-400">Search groceries...</span>
                <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-400 shadow-xs border border-slate-200">
                  /
                </kbd>
              </button>

              {/* Wishlist Button */}
              <button
                id="navbar-wishlist-btn"
                onClick={() => onNavigate('wishlist')}
                className="relative p-2.5 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-rose-600 transition cursor-pointer"
                title="Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart Button with Shake Animation */}
              <button
                id="navbar-cart-btn"
                onClick={() => setIsCartOpen(true)}
                className={`relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer ${
                  isCartShaking ? 'animate-bounce scale-110' : ''
                }`}
                title="View Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="hidden sm:inline">Cart</span>
                <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-[11px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              </button>

              {/* User Account / Auth Dropdown */}
              <div className="relative">
                {user ? (
                  <button
                    id="navbar-user-btn"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer border border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs font-semibold text-slate-700 hidden md:inline max-w-[90px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:inline" />
                  </button>
                ) : (
                  <button
                    id="navbar-login-btn"
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-600 text-slate-700 text-xs sm:text-sm font-semibold transition cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                )}

                {/* Dropdown Menu */}
                {isUserMenuOpen && user && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <span className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {user.role}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>My Profile & Addresses</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('tracking');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 font-medium transition"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      <span>My Orders & Tracking</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 font-semibold transition"
                      >
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2">
            {navLinks.map(link => (
              <button
                key={link.page}
                onClick={() => {
                  onNavigate(link.page);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-base font-semibold text-left transition ${
                  currentPage === link.page
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-purple-700 bg-purple-50 font-bold"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Admin Dashboard</span>
              </button>
            )}
          </div>
        )}
      </header>
    </>
  );
};
