import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Heart, ShoppingBag, AlertCircle, Info, X } from 'lucide-react';

export interface IToast {
  id: string;
  type: 'success' | 'cart' | 'wishlist' | 'error' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<IToast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<IToast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const newToast: IToast = { ...toast, id };
    setToasts(prev => [...prev.slice(-3), newToast]); // keep max 4

    const duration = toast.duration || 3500;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toast Render Area */}
      <div id="toast-container" className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map(toast => {
            const getIcon = () => {
              switch (toast.type) {
                case 'cart':
                  return <ShoppingBag className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
                case 'wishlist':
                  return <Heart className="w-5 h-5 text-rose-500 fill-rose-500 flex-shrink-0" />;
                case 'error':
                  return <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
                case 'info':
                  return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
                default:
                  return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
              }
            };

            const getBorder = () => {
              switch (toast.type) {
                case 'wishlist':
                  return 'border-rose-200 bg-rose-50/95 text-rose-900';
                case 'error':
                  return 'border-red-200 bg-red-50/95 text-red-900';
                case 'cart':
                  return 'border-emerald-200 bg-emerald-50/95 text-emerald-950';
                default:
                  return 'border-emerald-200 bg-white/95 text-slate-800';
              }
            };

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md border ${getBorder()}`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-xl bg-white shadow-sm border border-slate-100">
                    {getIcon()}
                  </div>
                  <div>
                    {toast.title && <div className="text-xs font-bold uppercase tracking-wider opacity-75">{toast.title}</div>}
                    <div className="text-sm font-semibold leading-tight">{toast.message}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg hover:bg-black/5 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};
