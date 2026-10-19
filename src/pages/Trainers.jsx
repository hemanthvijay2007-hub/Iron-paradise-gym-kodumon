import React from 'react';
import { useGym } from '../context/GymContext';
import { Users, Award, MessageCircle } from 'lucide-react';

export const Trainers = () => {
  const { trainers, siteInfo } = useGym();

  const handleBookTrainer = (trainerName) => {
    const text = encodeURIComponent(
      `Hello ${siteInfo.gymName}, I would like to book a coaching assessment session with ${trainerName}.`
    );
    window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="section-padding" style={{ paddingTop: '8rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <Users size={14} /> Master Coaches
          </span>
          <h1 className="section-title">MEET THE COACHING STAFF</h1>
          <p className="section-subtitle">
            Our certified strength professionals bring technical expertise, intense discipline, and practical lifting know-how to the gym floor.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="trainers-grid" style={{ maxWidth: '960px', margin: '0 auto 5rem auto' }}>
          {trainers.map((tr) => (
            <div key={tr.id} className="trainer-card">
              <div className="trainer-img-wrap">
                <img
                  src={tr.image}
                  alt={tr.name}
                  className="trainer-img"
                  onError={(e) => {
                    e.target.src = '/images/trainer_male.jpg';
                  }}
                />
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
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => handleBookTrainer(tr.name)}
                >
                  <MessageCircle size={16} /> Book Session on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Coaching Philosophy Banner */}
        <div style={{
          background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-charcoal) 100%)',
          border: '1px solid var(--border-card)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          maxWidth: '820px',
          margin: '0 auto'
        }}>
          <div className="brand-icon-box" style={{ margin: '0 auto 1.25rem auto' }}>
            <Award size={22} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.75rem', color: '#fff' }}>
            WANT CUSTOMIZED 1-ON-1 PROGRAMMING?
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7', marginBottom: '1.75rem' }}>
            Whether your goal is competing on the powerlifting platform, shedding fat, or mastering the barbell safely, our coaching staff provides dedicated technique cues, accountability, and periodized programming.
          </p>
          <button
            className="btn btn-whatsapp"
            onClick={() => {
              const text = encodeURIComponent(
                `Hello ${siteInfo.gymName}, I want to speak with a coach about a customized fitness program.`
              );
              window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank');
            }}
          >
            <MessageCircle size={18} /> Schedule Coach Assessment on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
};
