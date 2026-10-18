import React from 'react';
import { X } from 'lucide-react';

export const ImageLightbox = ({ image, onClose }) => {
  if (!image) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1200, padding: '1rem' }}>
      <div
        style={{
          position: 'relative',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          animation: 'fadeIn 0.25s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-2.75rem',
            right: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            color: '#fff',
            width: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          aria-label="Close image lightbox"
        >
          <X size={20} />
        </button>

        <img
          src={image.image}
          alt={image.title || 'Gym Gallery Image'}
          style={{
            maxWidth: '100%',
            maxHeight: '75vh',
            objectFit: 'contain',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-card)',
          }}
        />

        {(image.title || image.caption) && (
          <div
            style={{
              marginTop: '1rem',
              textAlign: 'center',
              background: 'var(--bg-charcoal)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-card)',
              maxWidth: '600px',
            }}
          >
            {image.title && (
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: '#fff' }}>
                {image.title}
              </h4>
            )}
            {image.caption && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {image.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
