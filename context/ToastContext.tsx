
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { ToastMessage, ToastType } from '../types';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (type: ToastType, title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Fix: Make children optional to avoid JSX type errors in some environments
export const ToastProvider = ({ children }: { children?: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: ToastType, title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Container Rendered here */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border min-w-[320px] max-w-[400px] animate-scale-up transition-all duration-300 ${
              toast.type === 'success' ? 'bg-white border-green-100' :
              toast.type === 'error' ? 'bg-white border-red-100' :
              'bg-white border-blue-100'
            }`}
          >
            <div className={`p-2 rounded-xl-flex-shrink-0 ${
              toast.type === 'success' ? 'bg-green-50 text-green-600' :
              toast.type === 'error' ? 'bg-red-50 text-red-600' :
              'bg-blue-50 text-blue-600'
            }`}>
              <span className="material-symbols-outlined">
                {toast.type === 'success' ? 'check_circle' :
                 toast.type === 'error' ? 'error' : 'info'}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-gray-900">{toast.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{toast.message}</p>
            </div>
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};