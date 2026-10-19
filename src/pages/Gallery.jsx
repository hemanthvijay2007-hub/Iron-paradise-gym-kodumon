import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { ImageLightbox } from '../components/ImageLightbox';
import { Camera, Eye } from 'lucide-react';

export const Gallery = ({ setActivePage }) => {
  const { gallery } = useGym();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  // Extract unique categories
  const categories = ['All', ...new Set(gallery.map((item) => item.category))];

  const filteredItems = selectedCategory === 'All'
    ? gallery
    : gallery.filter((item) => item.category === selectedCategory);

  return (
    <div className="section-padding" style={{ paddingTop: '8rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <Camera size={14} /> Visual Showcase
          </span>
          <h1 className="section-title">THE IRON GALLERY</h1>
          <p className="section-subtitle">
            A glimpse into the heavy steel, gritty training atmosphere, and authentic lifting culture at IRON PARADISE.
          </p>
        </div>

        {/* Category Filters */}
        <div className="gallery-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`gallery-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="gallery-item"
              onClick={() => setLightboxImage(item)}
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src = '/images/gym_interior.jpg';
                }}
              />
              <div className="gallery-item-overlay">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span className="gallery-item-cat">{item.category}</span>
                  <Eye size={16} color="#fff" />
                </div>
                <div className="gallery-item-title">{item.title}</div>
                {item.caption && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {item.caption}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div style={{
          marginTop: '5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: '#fff', marginBottom: '0.25rem' }}>
              READY TO TRAIN AT IRON PARADISE?
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Experience the heavy iron, Olympic platforms, and unmatched atmosphere in person at Kodumon.
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              setActivePage('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Schedule a Gym Visit
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <ImageLightbox image={lightboxImage} onClose={() => setLightboxImage(null)} />
      )}
    </div>
  );
};
