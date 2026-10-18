import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Menu, X, MessageCircle, ShieldCheck, Flame } from 'lucide-react';

export const Navbar = ({ activePage, setActivePage, onOpenJoinModal }) => {
  const { siteInfo } = useGym();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Us' },
    { id: 'plans', label: 'Plans' },
    { id: 'trainers', label: 'Trainers' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(
        'Hello IRON PARADISE, I would like to inquire about membership.'
      )}`,
      '_blank'
    );
  };

  return (
    <>
      {siteInfo.showNoticeBanner && siteInfo.noticeBanner && (
        <div className="notice-banner">
          <Flame size={15} color="var(--red-primary)" />
          <span>{siteInfo.noticeBanner}</span>
        </div>
      )}

      <header className="navbar-wrapper">
        <div className="container navbar-container">
          {/* Logo */}
          <div
            className="brand-logo"
            onClick={() => handleNavClick('home')}
            style={{ cursor: 'pointer' }}
          >
            <img src="/logo.jpg" alt="IRON PARADISE Logo" className="brand-logo-img" />
            <div className="brand-text">
              IRON <span>PARADISE</span>
            </div>
          </div>

          {/* Desktop Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-link ${activePage === item.id ? 'active' : ''}`}
                    onClick={() => handleNavClick(item.id)}
                    style={{ background: 'none', border: 'none' }}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  className={`nav-link ${activePage === 'admin' ? 'active' : ''}`}
                  onClick={() => handleNavClick('admin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: activePage === 'admin' ? 'var(--red-primary)' : 'var(--text-muted)',
                  }}
                  title="Admin Portal"
                >
                  <ShieldCheck size={16} /> Admin
                </button>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <button
              className="btn btn-whatsapp btn-sm"
              onClick={openWhatsApp}
              style={{ display: 'none', md: 'inline-flex' }}
              title="Chat on WhatsApp"
            >
              <MessageCircle size={16} /> WhatsApp
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onOpenJoinModal()}
            >
              Join Now
            </button>
            <button
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open mobile navigation"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="brand-logo" onClick={() => handleNavClick('home')}>
                <img src="/logo.jpg" alt="IRON PARADISE Logo" className="brand-logo-img" />
                <div className="brand-text" style={{ fontSize: '1.35rem' }}>
                  IRON <span>PARADISE</span>
                </div>
              </div>
              <button
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <hr style={{ borderColor: 'var(--border-subtle)' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: activePage === item.id ? 'var(--red-primary)' : 'transparent',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    cursor: 'pointer',
                  }}
                >
                  {item.label}
                </button>
              ))}

              <button
                onClick={() => handleNavClick('admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: activePage === 'admin' ? 'var(--red-primary)' : 'rgba(255, 255, 255, 0.05)',
                  color: activePage === 'admin' ? '#fff' : '#f87171',
                  border: '1px solid rgba(229, 9, 20, 0.2)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                <ShieldCheck size={18} /> Admin Portal
              </button>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button className="btn btn-whatsapp" onClick={openWhatsApp} style={{ width: '100%' }}>
                <MessageCircle size={18} /> Enquire on WhatsApp
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenJoinModal();
                }}
                style={{ width: '100%' }}
              >
                Join Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
