import React from 'react';
import { useGym } from '../context/GymContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useGym();

  if (!toasts.length) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 size={18} color="#10b981" />,
          error: <AlertCircle size={18} color="#e50914" />,
          info: <Info size={18} color="#3b82f6" />,
        };

        return (
          <div key={toast.id} className={`toast ${toast.type}`}>
            {icons[toast.type] || icons.info}
            <span style={{ flex: 1 }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#999',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
              }}
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
