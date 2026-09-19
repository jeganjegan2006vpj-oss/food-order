import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, register } = useAuth();
  const { addToast } = useToast();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) {
        addToast({
          type: 'success',
          title: 'Welcome Back!',
          message: 'Signed in successfully'
        });
      } else {
        addToast({
          type: 'error',
          title: 'Authentication Failed',
          message: 'Please check your credentials'
        });
      }
    } else if (mode === 'register') {
      const ok = await register(name, email, password);
      if (ok) {
        addToast({
          type: 'success',
          title: 'Account Created',
          message: 'Welcome to FreshCart 3D!'
        });
      } else {
        addToast({
          type: 'error',
          title: 'Registration Error',
          message: 'Could not create account'
        });
      }
    } else {
      addToast({
        type: 'info',
        title: 'Reset Link Sent',
        message: `Password reset instructions sent to ${email}`
      });
      setMode('login');
    }

    setIsLoading(false);
  };

  const handleQuickLogin = (demoRole: 'shopper' | 'admin') => {
    if (demoRole === 'admin') {
      setEmail('admin@freshcart.com');
      setPassword('admin123');
      login('admin@freshcart.com', 'admin123');
    } else {
      setEmail('alex@example.com');
      setPassword('password123');
      login('alex@example.com', 'password123');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-slate-100"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 font-display">
            {mode === 'login' ? 'Sign In to FreshCart' : mode === 'register' ? 'Join FreshCart 3D' : 'Reset Password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? 'Access 15-minute delivery, orders & saved carts'
              : mode === 'register'
              ? 'Get 20% off your first 3 fresh grocery orders'
              : 'Enter your email to receive recovery instructions'}
          </p>
        </div>

        {/* Quick Demo Accounts Banner */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 mb-5 text-xs">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Instant Demo Sign-in
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('shopper')}
              className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold border border-slate-200 text-center transition"
            >
              Shopper Alex
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin')}
              className="py-1.5 px-2.5 rounded-xl bg-white hover:bg-purple-50 text-purple-700 font-bold border border-purple-200 text-center transition"
            >
              Admin Superuser
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-emerald-600 hover:underline font-semibold"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition active:scale-95 disabled:opacity-50 mt-2"
          >
            {isLoading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : mode === 'register'
              ? 'Create My Account'
              : 'Send Reset Instructions'}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          {mode === 'login' ? (
            <p>
              Don&rsquo;t have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
