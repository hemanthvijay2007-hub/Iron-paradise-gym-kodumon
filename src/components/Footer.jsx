import React from 'react';
import { useGym } from '../context/GymContext';
import { Phone, MapPin, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = ({ setActivePage }) => {
  const { siteInfo, isCloudActive } = useGym();

  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div>
            <div
              className="brand-logo"
              style={{ marginBottom: '1.25rem', cursor: 'pointer' }}
              onClick={() => handleNav('home')}
            >
              <img
                src="/logo.jpg"
                alt="IRON PARADISE Logo"
                className="brand-logo-img"
                style={{ width: '3.25rem', height: '3.25rem' }}
              />
              <div className="brand-text">
                IRON <span>PARADISE</span>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', maxWidth: '340px' }}>
              A high-performance training ground engineered for raw strength, iron discipline, and relentless fitness transformation.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a
                href={siteInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.5rem 0.85rem' }}
                title="Follow Iron Paradise on Instagram"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
              <a
                href={`https://wa.me/${siteInfo.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm"
                style={{ padding: '0.5rem 0.85rem' }}
                title="Chat on WhatsApp"
              >
                <Phone size={16} /> WhatsApp
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="footer-col-title">QUICK LINKS</h4>
            <ul className="footer-links">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('plans')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Membership Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('trainers')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Elite Trainers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Gym Gallery
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="footer-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                >
                  Contact & Location
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours Placeholder */}
          <div>
            <h4 className="footer-col-title">TRAINING HOURS</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Clock size={18} color="var(--red-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>Standard Schedule</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {siteInfo.hoursPlaceholder}
                  </div>
                </div>
              </div>
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.65rem 0.75rem',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)'
              }}>
                💪 Dedicated morning and evening training batches available for all members.
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="footer-col-title">LOCATION & CONTACT</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <Phone size={18} color="var(--red-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone / WhatsApp</div>
                  <a
                    href={`https://wa.me/${siteInfo.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.95rem' }}
                  >
                    {siteInfo.phone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} color="var(--red-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Location Reference</div>
                  <a
                    href={siteInfo.locationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      color: 'var(--red-accent)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      marginTop: '0.2rem'
                    }}
                  >
                    Open Google Maps Pin <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>

              <div>
                <button
                  onClick={() => handleNav('admin')}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                  }}
                >
                  <ShieldCheck size={14} color="var(--red-primary)" /> Admin Portal Login
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            &copy; {CURRENT_YEAR} <strong>{siteInfo.gymName}</strong>. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: isCloudActive ? '#34d399' : 'var(--text-dim)' }}>
              {isCloudActive ? '☁️ Cloud Sync Active • Multi-Device Enabled' : 'Iron Paradise Multi-Gym • Kodumon'}
            </span>
            <a
              href={siteInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              title="Instagram"
            >
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
