import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { X, Send, MessageCircle, CheckCircle2 } from 'lucide-react';

const JoinModalDialog = ({ onClose, selectedPlanName }) => {
  const { plans, siteInfo, addEnquiry } = useGym();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    planInterest: selectedPlanName || (plans[0]?.name || 'Standard Access'),
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    addEnquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      planInterest: formData.planInterest,
      message: formData.notes || `Interested in membership: ${formData.planInterest}`,
    });

    setSubmitted(true);
  };

  const handleWhatsAppInstant = () => {
    const text = encodeURIComponent(
      `Hello ${siteInfo.gymName}, I would like to join / inquire about the *${formData.planInterest}* plan.${
        formData.name ? ` My name is ${formData.name}.` : ''
      }`
    );
    window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${text}`, '_blank');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div>
            <span className="section-tag" style={{ marginBottom: '0.4rem', fontSize: '0.72rem' }}>Membership Inquiry</span>
            <h3 className="modal-title">JOIN {siteInfo.gymName}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto'
              }}>
                <CheckCircle2 size={32} />
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                APPLICATION RECEIVED!
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Thank you, <strong>{formData.name}</strong>. Our team has received your inquiry for <strong>{formData.planInterest}</strong> and will contact you shortly.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button className="btn btn-whatsapp btn-sm" onClick={handleWhatsAppInstant}>
                  <MessageCircle size={16} /> Open on WhatsApp Now
                </button>
                <button className="btn btn-secondary btn-sm" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="join-name">Full Name *</label>
                <input
                  id="join-name"
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. John Doe"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="join-phone">Phone / WhatsApp *</label>
                  <input
                    id="join-phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 XXXXX XXXXX"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="join-email">Email Address</label>
                  <input
                    id="join-email"
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="join-plan">Select Plan</label>
                <select
                  id="join-plan"
                  name="planInterest"
                  className="form-select"
                  value={formData.planInterest}
                  onChange={handleChange}
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} - {p.price} ({p.billing})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="join-notes">Additional Questions or Goals</label>
                <textarea
                  id="join-notes"
                  name="notes"
                  rows={2}
                  placeholder="E.g. Morning timings, personal coaching inquiry..."
                  className="form-textarea"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.85rem',
                marginBottom: '1.5rem',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)'
              }}>
                💬 Prefer immediate assistance? You can also connect directly via official WhatsApp at <strong>{siteInfo.phone}</strong>.
              </div>

              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: '1 1 auto' }}>
                  <Send size={16} /> Submit Membership Request
                </button>
                <button
                  type="button"
                  className="btn btn-whatsapp"
                  onClick={handleWhatsAppInstant}
                  title="Direct WhatsApp chat"
                >
                  <MessageCircle size={18} /> WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const JoinModal = ({ isOpen, onClose, selectedPlanName = '' }) => {
  if (!isOpen) return null;
  return <JoinModalDialog onClose={onClose} selectedPlanName={selectedPlanName} />;
};
