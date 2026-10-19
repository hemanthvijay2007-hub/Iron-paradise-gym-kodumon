import React from 'react';
import { useGym } from '../context/GymContext';
import {
  Dumbbell,
  Flame,
  Trophy,
  Users,
  ShieldCheck,
  Check,
  ArrowRight,
  MessageCircle,
  MapPin,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const Home = ({ setActivePage, onOpenJoinModal }) => {
  const { siteInfo, plans, trainers, gallery } = useGym();

  const openWhatsApp = () => {
    window.open(
      `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(
        'Hello IRON PARADISE, I would like to inquire about membership and training facilities.'
      )}`,
      '_blank'
    );
  };

  const featuredPlans = plans.slice(0, 3);
  const featuredTrainers = trainers.slice(0, 2);
  const featuredGallery = gallery.slice(0, 4);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div
          className="hero-bg-layer"
          style={{ backgroundImage: `url('${siteInfo.heroImage || '/images/hero_gym.jpg'}')` }}
        />
        <div className="hero-overlay" />
        <div className="hero-grid-pattern" />

        <div className="container hero-content">
          <div className="hero-badge">
            <Flame size={15} /> Premium Strength & Conditioning
          </div>

          <h1 className="hero-title">{siteInfo.heroHeadline}</h1>

          <p className="hero-tagline">{siteInfo.heroTagline}</p>

          <div className="hero-cta-group">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => onOpenJoinModal()}
            >
              Join Now
            </button>
            <button className="btn btn-whatsapp btn-lg" onClick={openWhatsApp}>
              <MessageCircle size={20} /> Enquire on WhatsApp
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={() => {
                setActivePage('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Learn More
            </button>
          </div>

          {/* Hero Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">
                100<span>%</span>
              </div>
              <div className="stat-label">Raw Heavy Iron</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                PRO<span>+</span>
              </div>
              <div className="stat-label">Power Racks & Platforms</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                1:1<span></span>
              </div>
              <div className="stat-label">Coach Attention</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                ZERO<span></span>
              </div>
              <div className="stat-label">Gimmicks & Excuses</div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE IRON PARADISE */}
      <section className="section-padding" style={{ background: 'var(--bg-black)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={14} /> The Iron Standard
            </span>
            <h2 className="section-title">WHY TRAIN AT IRON PARADISE</h2>
            <p className="section-subtitle">
              We cut through the noise of casual fitness clubs. Here, the focus is pure: progressive overload, uncompromising discipline, and real athletic growth.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Dumbbell size={26} />
              </div>
              <h3 className="feature-title">ELITE IRON & HEAVY RACKS</h3>
              <p className="feature-text">
                Equipped with Olympic barbells, calibrated plates, precision dumbbells, and dedicated power cages built for serious compound movements.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Flame size={26} />
              </div>
              <h3 className="feature-title">UNSTOPPABLE ATMOSPHERE</h3>
              <p className="feature-text">
                An energetic, distraction-free environment where every lifter around you is striving for personal records and mutual respect.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Trophy size={26} />
              </div>
              <h3 className="feature-title">SCIENTIFIC COACHING</h3>
              <p className="feature-text">
                Biomechanically sound cues, form corrections, and progressive overload structures designed to prevent injuries and optimize performance.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <ShieldCheck size={26} />
              </div>
              <h3 className="feature-title">HYGIENIC & MAINTAINED</h3>
              <p className="feature-text">
                Spotless training platforms, sanitized equipment, premium rubber matting, and chalk-friendly lifting areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SNAPSHOT / INTERIOR SHOWCASE */}
      <section className="section-padding" style={{ background: 'var(--bg-charcoal)', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3.5rem', alignItems: 'center' }}>
            <div>
              <span className="section-tag">
                <Flame size={14} /> Athletic Sanctuary
              </span>
              <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '1.25rem' }}>
                {siteInfo.aboutHeading}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                {siteInfo.aboutText}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontSize: '0.95rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--red-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)' }}>
                    <Check size={14} />
                  </div>
                  Dedicated squat stations & deadlift platforms
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontSize: '0.95rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--red-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)' }}>
                    <Check size={14} />
                  </div>
                  Tailored conditioning and hypertrophy zone
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fff', fontSize: '0.95rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', background: 'var(--red-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red-primary)' }}>
                    <Check size={14} />
                  </div>
                  Clean, high-standard facility with focused music & energy
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setActivePage('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  Read Our Story <ArrowRight size={16} />
                </button>
                <button className="btn btn-secondary" onClick={openWhatsApp}>
                  <MessageCircle size={16} /> Contact Gym Floor
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  border: '1px solid var(--border-card)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <img
                  src={siteInfo.interiorImage || '/images/gym_interior.jpg'}
                  alt="IRON PARADISE Gym Floor"
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/images/gym_interior.jpg';
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-card)',
                  padding: '1rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="IRON PARADISE Logo"
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    border: '2px solid var(--red-primary)',
                    objectFit: 'cover',
                  }}
                />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: '#fff' }}>
                    IRON PARADISE
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--red-primary)', fontWeight: 600 }}>
                    WHERE HEROES TRAIN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MEMBERSHIP PLANS */}
      <section className="section-padding" style={{ background: 'var(--bg-black)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Trophy size={14} /> Investment in Yourself
            </span>
            <h2 className="section-title">MEMBERSHIP PLANS</h2>
            <p className="section-subtitle">
              Select the tier that fits your commitment. Transparent options with zero hidden fees.
            </p>
          </div>

          <div className="plans-grid">
            {featuredPlans.map((plan) => (
              <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
                {plan.isPopular && (
                  <div className="plan-badge">{plan.badge || 'Most Popular'}</div>
                )}
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-description">{plan.description}</p>

                <div className="plan-price-box">
                  <div className="plan-price">{plan.price}</div>
                  <div className="plan-billing">{plan.billing}</div>
                </div>

                <ul className="plan-features-list">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="plan-feature-item">
                      <Check size={16} className="plan-feature-check" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                  <button
                    className={`btn ${plan.isPopular ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onOpenJoinModal(plan.name)}
                  >
                    Select Plan
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Hi IRON PARADISE, I am inquiring about the rate and details of the ${plan.name} plan.`
                      );
                      window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank');
                    }}
                  >
                    <MessageCircle size={14} /> WhatsApp Inquiry
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                setActivePage('plans');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View All Membership Plans & Options <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* MEET OUR TRAINERS PREVIEW */}
      <section className="section-padding" style={{ background: 'var(--bg-charcoal)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Users size={14} /> Leadership & Coaching
            </span>
            <h2 className="section-title">ELITE COACHES</h2>
            <p className="section-subtitle">
              Learn from dedicated fitness mentors committed to your personal athletic progress and safety.
            </p>
          </div>

          <div className="trainers-grid" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {featuredTrainers.map((tr) => (
              <div key={tr.id} className="trainer-card">
                <div className="trainer-img-wrap">
                  <img src={tr.image} alt={tr.name} className="trainer-img" />
                  <div className="trainer-overlay" />
                </div>
                <div className="trainer-info">
                  <div className="trainer-role">{tr.role}</div>
                  <h3 className="trainer-name">{tr.name}</h3>
                  <p className="trainer-bio">{tr.bio}</p>

                  <div className="trainer-specialties">
                    {tr.specialties.map((s, idx) => (
                      <span key={idx} className="spec-badge">
                        {s}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      const text = encodeURIComponent(
                        `Hello IRON PARADISE, I want to book a training consultation with ${tr.name}.`
                      );
                      window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank');
                    }}
                  >
                    <MessageCircle size={14} /> Book Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => {
                setActivePage('trainers');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Explore Full Trainer Roster <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* GALLERY TEASER */}
      <section className="section-padding" style={{ background: 'var(--bg-black)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={14} /> Visual Tour
            </span>
            <h2 className="section-title">INSIDE THE PARADISE</h2>
            <p className="section-subtitle">
              A look inside our training zones, heavy iron platforms, and athlete community.
            </p>
          </div>

          <div className="gallery-grid">
            {featuredGallery.map((item) => (
              <div
                key={item.id}
                className="gallery-item"
                onClick={() => {
                  setActivePage('gallery');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <img src={item.image} alt={item.title} />
                <div className="gallery-item-overlay">
                  <span className="gallery-item-cat">{item.category}</span>
                  <div className="gallery-item-title">{item.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button
              className="btn btn-primary"
              onClick={() => {
                setActivePage('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View Full Gallery & Training Snaps <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* GOOGLE MAPS LOCATION & WHATSAPP BANNER */}
      <section
        style={{
          background: 'linear-gradient(135deg, #181214 0%, #2a1114 50%, #141419 100%)',
          borderTop: '1px solid rgba(229, 9, 20, 0.25)',
          borderBottom: '1px solid rgba(229, 9, 20, 0.25)',
          padding: '4.5rem 0',
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '780px' }}>
          <span className="section-tag">
            <MapPin size={14} /> Visit IRON PARADISE
          </span>
          <h2 className="section-title" style={{ marginBottom: '1.25rem' }}>
            READY TO TRANSFORM YOUR PHYSIQUE?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
            Come experience the intensity and heavy iron firsthand. Get directions directly to our gym via Google Maps or connect with us on WhatsApp for walkthrough timings.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <a
              href={siteInfo.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-lg"
            >
              <MapPin size={20} color="var(--red-primary)" /> Open Google Maps Pin <ExternalLink size={16} />
            </a>
            <button className="btn btn-whatsapp btn-lg" onClick={openWhatsApp}>
              <MessageCircle size={20} /> Chat on WhatsApp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
