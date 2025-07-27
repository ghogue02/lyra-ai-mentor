import React from 'react';
import { BrandedToast } from '@/components/ui/BrandedToast';

interface ToastOptions {
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement';
  title: string;
  description?: string;
  duration?: number;
  showAnimation?: boolean;
}

interface ToastState {
  toasts: Array<ToastOptions & { id: string }>;
}

let toastId = 0;
const toastListeners: Array<(state: ToastState) => void> = [];
let currentState: ToastState = { toasts: [] };

const notifyListeners = () => {
  toastListeners.forEach(listener => listener(currentState));
};

const addToast = (options: ToastOptions) => {
  const id = `toast-${++toastId}`;
  const toast = { ...options, id };
  
  currentState.toasts.push(toast);
  notifyListeners();
  
  // Auto-remove after duration
  setTimeout(() => {
    removeToast(id);
  }, options.duration || 4000);
  
  return id;
};

const removeToast = (id: string) => {
  currentState.toasts = currentState.toasts.filter(toast => toast.id !== id);
  notifyListeners();
};

export const useBrandedToast = () => {
  const [state, setState] = React.useState<ToastState>(currentState);
  
  React.useEffect(() => {
    const listener = (newState: ToastState) => {
      setState(newState);
    };
    
    toastListeners.push(listener);
    
    return () => {
      const index = toastListeners.indexOf(listener);
      if (index > -1) {
        toastListeners.splice(index, 1);
      }
    };
  }, []);
  
  const showToast = React.useCallback((options: ToastOptions) => {
    return addToast(options);
  }, []);
  
  return {
    toasts: state.toasts,
    showToast,
    removeToast
  };
};

// Toast Container Component
export const BrandedToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBrandedToast();
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <BrandedToast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          onClose={() => removeToast(toast.id)}
          showAnimation={toast.showAnimation}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};