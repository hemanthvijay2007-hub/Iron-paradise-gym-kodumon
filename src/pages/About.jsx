import React from 'react';
import { useGym } from '../context/GymContext';
import { Dumbbell, Target, Shield, HeartHandshake, MessageCircle, ArrowRight } from 'lucide-react';

export const About = ({ setActivePage, onOpenJoinModal }) => {
  const { siteInfo } = useGym();

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(
        'Hello IRON PARADISE, I would like to learn more about your gym and philosophy.'
      )}`,
      '_blank'
    );
  };

  const values = [
    {
      icon: <Target size={24} />,
      title: "PURPOSEFUL TRAINING",
      desc: "Every workout should have intention. We focus on structured progressive overload, proper biomechanics, and sustainable athletic strength.",
    },
    {
      icon: <Dumbbell size={24} />,
      title: "UNCOMPROMISING STANDARDS",
      desc: "Top-tier Olympic barbells, heavy dumbbells, stable platforms, and precision racks maintained with obsessive care.",
    },
    {
      icon: <HeartHandshake size={24} />,
      title: "RESPECT & BROTHERHOOD",
      desc: "An ego-free training environment where veterans and newcomers share chalk, spot each other, and celebrate every new personal record.",
    },
    {
      icon: <Shield size={24} />,
      title: "SAFETY & LONGEVITY",
      desc: "Lifting heavy requires respecting the body. We emphasize joint mobility, warm-up protocols, and injury prevention.",
    },
  ];

  return (
    <div className="section-padding" style={{ paddingTop: '8rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">Our Identity</span>
          <h1 className="section-title">THE IRON PARADISE CODE</h1>
          <p className="section-subtitle">
            Born out of a raw passion for heavy iron, discipline, and authentic strength culture.
          </p>
        </div>

        {/* Story Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '3.5rem', alignItems: 'center', marginBottom: '6rem' }}>
          <div>
            <span className="section-tag" style={{ marginBottom: '0.75rem' }}>Our Story</span>
            <h2 className="section-title" style={{ textAlign: 'left', fontSize: '2.5rem', marginBottom: '1.25rem' }}>
              {siteInfo.aboutHeading}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              {siteInfo.aboutText}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '2rem' }}>
              We rejected the sterile, generic fitness chain formula. At IRON PARADISE, there are no screens distracting you from hard work. You enter, step up to the barbell, put in the reps, and walk out stronger than you arrived.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => onOpenJoinModal()}>
                Join The Movement <ArrowRight size={16} />
              </button>
              <button className="btn btn-whatsapp" onClick={openWhatsApp}>
                <MessageCircle size={16} /> WhatsApp Inquiry
              </button>
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-lg)' }}>
              <img
                src="/images/gym_interior.jpg"
                alt="IRON PARADISE Gym Floor"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '6rem' }}>
          <div className="gym-card" style={{ borderLeft: '4px solid var(--red-primary)' }}>
            <span className="section-tag" style={{ width: 'fit-content', marginBottom: '1rem' }}>Mission</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              OUR MISSION
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {siteInfo.aboutMission}
            </p>
          </div>

          <div className="gym-card" style={{ borderLeft: '4px solid #fff' }}>
            <span className="section-tag" style={{ width: 'fit-content', marginBottom: '1rem' }}>Vision</span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
              OUR VISION
            </h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              {siteInfo.aboutVision}
            </p>
          </div>
        </div>

        {/* Core Values Grid */}
        <div style={{ marginBottom: '6rem' }}>
          <div className="section-header">
            <span className="section-tag">Core Principles</span>
            <h2 className="section-title">WHAT DEFINES US</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {values.map((v, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">{v.icon}</div>
                <h3 className="feature-title" style={{ fontSize: '1.35rem' }}>{v.title}</h3>
                <p className="feature-text">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Facility Specs Placeholder Notice */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px dashed var(--border-card)',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto'
        }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>
            FACILITIES & EQUIPMENT SPECIFICATIONS
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            {siteInfo.facilitiesNote}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => {
                setActivePage('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Contact Front Desk
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => {
                setActivePage('plans');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View Membership Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
