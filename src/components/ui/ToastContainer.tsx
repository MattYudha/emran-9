// src/components/ui/ToastContainer.tsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    // Menambahkan notifikasi baru ke awal array agar yang terbaru muncul di atas
    setToasts(prev => [newToast, ...prev]); 

    // Auto-hide after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      hideToast(id);
    }, duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onHide: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onHide }) => {
  return (
    // Mengubah posisi container dari top-4 menjadi bottom-4 (atau sesuaikan sesuai preferensi)
    // atau tetap di top-4 tapi pastikan z-index nya tinggi
    <div className="fixed top-4 right-4 z-50 space-y-2 flex flex-col items-end"> {/* Menambahkan flex-col items-end */}
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onHide={onHide} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onHide: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.9 }} 
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }} 
      transition={{ duration: 0.3 }}
      className={`max-w-sm w-auto ${getBgColor()} border rounded-lg shadow-lg p-4 relative overflow-hidden`} 
      role="alert"
    >
      <div className="flex items-start space-x-3"> 
        <div className="flex-shrink-0 pt-0.5"> 
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0 pr-6"> 
          <p className="text-sm font-medium text-gray-900 dark:text-white leading-tight"> 
            {toast.title}
          </p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 leading-snug"> 
              {toast.message}
            </p>
          )}
        </div>
        <div className="absolute top-2 right-2 flex-shrink-0"> 
          <button
            onClick={() => onHide(toast.id)}
            className="p-1 rounded-md inline-flex text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <X className="h-4 w-4" /> 
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ToastContainer;