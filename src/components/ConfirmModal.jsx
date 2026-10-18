import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, confirmText = 'Confirm', onConfirm, onCancel, isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.25rem',
              height: '2.25rem',
              borderRadius: '50%',
              background: isDanger ? 'rgba(229, 9, 20, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDanger ? 'var(--red-primary)' : '#3b82f6',
            }}>
              <AlertTriangle size={18} />
            </div>
            <h3 className="modal-title" style={{ fontSize: '1.25rem' }}>{title}</h3>
          </div>
          <button className="modal-close-btn" onClick={onCancel} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onCancel}>
            Cancel
          </button>
          <button
            className={`btn ${isDanger ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
