import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Check, MessageCircle, HelpCircle, Sparkles } from 'lucide-react';

export const Plans = ({ onOpenJoinModal }) => {
  const { plans, siteInfo } = useGym();
  const [filter, setFilter] = useState('all');

  const filteredPlans = plans.filter((plan) => {
    if (filter === 'popular') return plan.isPopular;
    return true;
  });

  const handleWhatsApp = (planName) => {
    const text = encodeURIComponent(
      `Hello ${siteInfo.gymName}, I would like to inquire about the pricing and availability for the *${planName}* plan.`
    );
    window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank');
  };

  const faqs = [
    {
      q: "Are prices fixed or negotiable?",
      a: "Membership rates and seasonal promotional packages can be confirmed directly with our front desk staff or via WhatsApp.",
    },
    {
      q: "Can I take a trial session before committing?",
      a: "Yes! Walk-in facility tours and baseline consultations are welcome. Reach out on WhatsApp to coordinate your visit.",
    },
    {
      q: "What equipment access is included in the plans?",
      a: "All active members enjoy access to Olympic barbells, power racks, dumbbell section, and functional conditioning zones.",
    },
    {
      q: "Are personal coaching sessions included?",
      a: "Standard floor guidance is available to all members. Dedicated 1-on-1 coaching packages are offered through the Personal Coaching tier.",
    },
  ];

  return (
    <div className="section-padding" style={{ paddingTop: '8rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} /> Tiered Memberships
          </span>
          <h1 className="section-title">MEMBERSHIP PLANS</h1>
          <p className="section-subtitle">
            Commit to your physical transformation with flexible, transparent memberships engineered for consistent gains.
          </p>
        </div>

        {/* Filter buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '3.5rem' }}>
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All Plans ({plans.length})
          </button>
          <button
            className={`btn btn-sm ${filter === 'popular' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter('popular')}
          >
            Featured / Recommended
          </button>
        </div>

        {/* Plans Grid */}
        <div className="plans-grid">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className={`plan-card ${plan.isPopular ? 'popular' : ''}`}>
              {plan.isPopular && (
                <div className="plan-badge">{plan.badge || 'Most Popular'}</div>
              )}
              {plan.badge && !plan.isPopular && (
                <div className="plan-badge" style={{ background: 'var(--bg-charcoal)', border: '1px solid var(--border-hover)', color: '#fff' }}>
                  {plan.badge}
                </div>
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
                  Join With This Plan
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => handleWhatsApp(plan.name)}
                >
                  <MessageCircle size={15} /> Enquire on WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div style={{ marginTop: '7rem', maxWidth: '800px', margin: '7rem auto 0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">
              <HelpCircle size={14} /> Questions Answered
            </span>
            <h2 className="section-title" style={{ fontSize: '2.25rem' }}>FREQUENTLY ASKED QUESTIONS</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} className="gym-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>
                  {faq.q}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
