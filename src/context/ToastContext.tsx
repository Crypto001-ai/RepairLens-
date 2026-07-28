import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Global subscriber for non-React or helper callers
type ToastListener = (message: string, type: ToastType) => void;
let globalToastListener: ToastListener | null = null;

export const showToast = (message: string, type: ToastType = 'info') => {
  if (globalToastListener) {
    globalToastListener(message, type);
  } else {
    console.log(`[Toast ${type.toUpperCase()}]: ${message}`);
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => {
      // Limit to max 3 toasts visible at once
      const current = prev.length >= 3 ? prev.slice(1) : prev;
      return [...current, { id, message, type }];
    });

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    globalToastListener = addToast;
    return () => {
      globalToastListener = null;
    };
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}

      {/* Global Toast Container */}
      <div className="fixed z-[9999] pointer-events-none bottom-4 left-1/2 -translate-x-1/2 md:bottom-6 md:right-6 md:left-auto md:translate-x-0 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2rem)] md:w-auto">
        <AnimatePresence>
          {toasts.map((toast) => {
            const getIcon = () => {
              switch (toast.type) {
                case 'success':
                  return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
                case 'error':
                  return <XCircle className="w-5 h-5 text-rose-400 shrink-0" />;
                case 'warning':
                  return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
                case 'info':
                default:
                  return <Info className="w-5 h-5 text-indigo-400 shrink-0" />;
              }
            };

            const getBorderClass = () => {
              switch (toast.type) {
                case 'success':
                  return 'border-l-4 border-l-emerald-500';
                case 'error':
                  return 'border-l-4 border-l-rose-500';
                case 'warning':
                  return 'border-l-4 border-l-amber-500';
                case 'info':
                default:
                  return 'border-l-4 border-l-indigo-500';
              }
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 24, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.92 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className={`pointer-events-auto flex items-center gap-3 bg-[#1E293B] border border-[#6366F1]/30 ${getBorderClass()} rounded-xl px-5 py-3.5 shadow-2xl backdrop-blur-md text-[#F9FAFB] text-sm font-medium`}
              >
                {getIcon()}
                <span className="flex-1 text-xs md:text-sm font-semibold leading-snug">{toast.message}</span>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label="Close Toast"
                >
                  <X className="w-3.5 h-3.5" />
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
  if (!context) {
    return { showToast };
  }
  return context;
};
