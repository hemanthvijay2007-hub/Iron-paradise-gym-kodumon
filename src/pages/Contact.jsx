import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import {
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ExternalLink,
  Calculator,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { InstagramIcon } from '../components/InstagramIcon';

export const Contact = () => {
  const { siteInfo, addEnquiry } = useGym();

  // Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    goal: 'General Strength & Conditioning',
    message: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Strength 1RM Calculator State
  const [calcWeight, setCalcWeight] = useState(100);
  const [calcReps, setCalcReps] = useState(5);
  const [calcUnit, setCalcUnit] = useState('kg');

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    addEnquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      planInterest: formData.goal,
      message: formData.message || `Contact inquiry regarding ${formData.goal}`,
    });

    setFormSubmitted(true);
  };

  const openWhatsAppDirect = (customMsg) => {
    const msg = customMsg || `Hello ${siteInfo.gymName}, I would like to inquire about gym membership and tour timings.`;
    window.open(`https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // 1RM Calculation using Epley & Brzycki formulas
  const numericWeight = parseFloat(calcWeight) || 0;
  const numericReps = Math.min(15, Math.max(1, parseInt(calcReps, 10) || 1));
  const estimated1RM = numericReps === 1 ? numericWeight : Math.round(numericWeight * (1 + numericReps / 30));

  const percentages = [
    { label: '95%', value: Math.round(estimated1RM * 0.95), reps: '1-2 Reps (Max Effort)' },
    { label: '90%', value: Math.round(estimated1RM * 0.90), reps: '3-4 Reps (Heavy Strength)' },
    { label: '85%', value: Math.round(estimated1RM * 0.85), reps: '5-6 Reps (Power Hypertrophy)' },
    { label: '80%', value: Math.round(estimated1RM * 0.80), reps: '7-8 Reps (Hypertrophy Zone)' },
    { label: '70%', value: Math.round(estimated1RM * 0.70), reps: '10-12 Reps (Endurance & Volume)' },
  ];

  const contactFaqs = [
    {
      q: 'Do I need an appointment for a first-time gym tour?',
      a: 'Walk-ins during regular floor hours are always welcome! However, sending a quick ping on WhatsApp beforehand ensures a head coach is available to walk you through our equipment and facilities.',
    },
    {
      q: 'Where exactly is the gym located?',
      a: 'We are conveniently accessible in the region. Tap the Google Maps pin button to launch instant turn-by-turn navigation on your mobile device or car GPS.',
    },
    {
      q: 'Is there vehicle parking available?',
      a: 'Yes, designated parking spaces for two-wheelers and cars are available for members and visitors right outside the facility.',
    },
    {
      q: 'Can beginner lifters get form guidance?',
      a: 'Absolutely. Our training floor is built on barbell safety, proper technique, and zero ego. Our floor trainers are always ready to guide you on proper lifting mechanics.',
    },
  ];

  return (
    <div className="section-padding" style={{ paddingTop: '8rem' }}>
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag">
            <Sparkles size={14} /> Reach Out & Visit
          </span>
          <h1 className="section-title">CONTACT & LOCATION</h1>
          <p className="section-subtitle">
            Get directions to the training floor, request a walkthrough tour, or speak directly with our team on WhatsApp.
          </p>
        </div>

        {/* 4 Contact Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '4.5rem',
          }}
        >
          {/* Card 1: WhatsApp */}
          <div className="gym-card" style={{ borderTop: '3px solid #25d366' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(37, 211, 102, 0.12)',
                color: '#25d366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <MessageCircle size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.4rem', color: '#fff' }}>
              WHATSAPP CHAT
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Instant response for membership inquiries, tour scheduling, and pricing.
            </p>
            <button
              className="btn btn-whatsapp btn-sm"
              style={{ marginTop: 'auto', width: '100%' }}
              onClick={() => openWhatsAppDirect()}
            >
              <MessageCircle size={15} /> Message Now
            </button>
          </div>

          {/* Card 2: Phone */}
          <div className="gym-card" style={{ borderTop: '3px solid var(--red-primary)' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--red-subtle)',
                color: 'var(--red-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Phone size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.4rem', color: '#fff' }}>
              CALL DIRECT
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Speak directly with front desk staff during regular operational hours.
            </p>
            <a
              href={`tel:${siteInfo.phone.replace(/\s+/g, '')}`}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 'auto', width: '100%' }}
            >
              <Phone size={15} /> {siteInfo.phone}
            </a>
          </div>

          {/* Card 3: Location */}
          <div className="gym-card" style={{ borderTop: '3px solid #3b82f6' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <MapPin size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.4rem', color: '#fff' }}>
              FIND ON MAPS
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Tap for verified Google Maps navigation directly to the facility entrance.
            </p>
            <a
              href={siteInfo.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 'auto', width: '100%', color: '#93c5fd' }}
            >
              <ExternalLink size={15} /> Open Navigation
            </a>
          </div>

          {/* Card 4: Hours */}
          <div className="gym-card" style={{ borderTop: '3px solid #eab308' }}>
            <div
              style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(234, 179, 8, 0.12)',
                color: '#facc15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
              }}
            >
              <Clock size={24} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '0.4rem', color: '#fff' }}>
              TRAINING SCHEDULE
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
              {siteInfo.hoursPlaceholder}
            </p>
            <span
              style={{
                marginTop: 'auto',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '0.4rem 0.6rem',
                borderRadius: '4px',
                display: 'block',
                textAlign: 'center',
              }}
            >
              Early & evening slots available
            </span>
          </div>
        </div>

        {/* 2-Column Section: Inquiry Form & 1RM Strength Calculator */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2.5rem',
            marginBottom: '5rem',
          }}
        >
          {/* Column 1: Send Message Form */}
          <div className="gym-card" style={{ padding: '2.5rem' }}>
            <span className="section-tag" style={{ width: 'fit-content', marginBottom: '0.75rem' }}>
              Fast Response
            </span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem', color: '#fff' }}>
              SCHEDULE A VISIT OR ASK QUESTIONS
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
              Fill in your details below. Our management logs your inquiry in real-time and will reach out via WhatsApp or phone.
            </p>

            {formSubmitted ? (
              <div
                style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '2.5rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <CheckCircle2 size={30} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: '#fff', marginBottom: '0.5rem' }}>
                  MESSAGE RECORDED!
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                  Thank you, <strong>{formData.name}</strong>. We have logged your request. Want faster confirmation?
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    className="btn btn-whatsapp btn-sm"
                    onClick={() =>
                      openWhatsAppDirect(
                        `Hi ${siteInfo.gymName}, I just submitted a message on your website under name: ${formData.name}.`
                      )
                    }
                  >
                    <MessageCircle size={16} /> Open Chat on WhatsApp
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        goal: 'General Strength & Conditioning',
                        message: '',
                      });
                    }}
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleFormChange}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-phone">
                      WhatsApp / Phone *
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 XXXXX XXXXX"
                      className="form-input"
                      value={formData.phone}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-email">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      className="form-input"
                      value={formData.email}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-goal">
                    Primary Fitness Interest
                  </label>
                  <select
                    id="contact-goal"
                    name="goal"
                    className="form-select"
                    value={formData.goal}
                    onChange={handleFormChange}
                  >
                    <option value="Heavy Strength & Powerlifting">Heavy Strength & Powerlifting</option>
                    <option value="Muscle Building / Hypertrophy">Muscle Building / Hypertrophy</option>
                    <option value="Fat Loss & Conditioning">Fat Loss & Conditioning</option>
                    <option value="1-on-1 Personal Coaching">1-on-1 Personal Coaching</option>
                    <option value="Gym Walkthrough & Tour">Gym Walkthrough & Tour</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">
                    Message or Timings Preference
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={3}
                    placeholder="E.g. What time can I come for a floor tour? Or any questions..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleFormChange}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap', marginTop: '1.25rem' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: '1 1 auto' }}>
                    <Send size={16} /> Send Direct Inquiry
                  </button>
                  <button
                    type="button"
                    className="btn btn-whatsapp"
                    onClick={() => openWhatsAppDirect()}
                    title="Direct WhatsApp chat"
                  >
                    <MessageCircle size={18} /> WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Column 2: Interactive 1-Rep Max (1RM) Calculator */}
          <div
            className="gym-card"
            style={{
              padding: '2.5rem',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-charcoal) 100%)',
              border: '1px solid var(--border-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="section-tag" style={{ margin: 0 }}>
                <Calculator size={14} /> Athletic Tool
              </span>
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  className={`btn btn-sm ${calcUnit === 'kg' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => setCalcUnit('kg')}
                >
                  KG
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${calcUnit === 'lbs' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}
                  onClick={() => setCalcUnit('lbs')}
                >
                  LBS
                </button>
              </div>
            </div>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.4rem', color: '#fff' }}>
              1-REP MAX (1RM) ESTIMATOR
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Calculate your maximal single-rep strength and working set percentages based on recent heavy compound sets.
            </p>

            {/* Inputs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="calc-weight">
                  Weight Lifted ({calcUnit})
                </label>
                <input
                  id="calc-weight"
                  type="number"
                  min="1"
                  max="1000"
                  className="form-input"
                  value={calcWeight}
                  onChange={(e) => setCalcWeight(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="calc-reps">
                  Reps Performed
                </label>
                <input
                  id="calc-reps"
                  type="number"
                  min="1"
                  max="15"
                  className="form-input"
                  value={calcReps}
                  onChange={(e) => setCalcReps(e.target.value)}
                />
              </div>
            </div>

            {/* 1RM Result Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(229, 9, 20, 0.15) 0%, rgba(20, 20, 25, 0.9) 100%)',
                border: '1px solid rgba(229, 9, 20, 0.35)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem 1.5rem',
                textAlign: 'center',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Estimated 1-Rep Max
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '3.2rem', color: '#fff', lineHeight: '1.1' }}>
                {estimated1RM} <span style={{ fontSize: '1.4rem', color: 'var(--red-primary)' }}>{calcUnit}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Based on {numericWeight} {calcUnit} × {numericReps} reps using standard barbell mechanics
              </div>
            </div>

            {/* Percentage Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {percentages.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span
                      style={{
                        fontWeight: 800,
                        color: 'var(--red-primary)',
                        fontFamily: 'var(--font-mono)',
                        minWidth: '2.5rem',
                      }}
                    >
                      {p.label}
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{p.reps}</span>
                  </div>
                  <strong style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>
                    {p.value} {calcUnit}
                  </strong>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ width: '100%' }}
                onClick={() =>
                  openWhatsAppDirect(
                    `Hello ${siteInfo.gymName}, I estimated my 1RM at ${estimated1RM} ${calcUnit}. I would like to discuss strength training plans with a coach.`
                  )
                }
              >
                <MessageCircle size={15} /> Discuss Training With Coach
              </button>
            </div>
          </div>
        </div>

        {/* Location & Navigation Banner */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            marginBottom: '5rem',
          }}
        >
          <div style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            <div>
              <span className="section-tag" style={{ marginBottom: '0.5rem' }}>
                <MapPin size={14} /> Location Details
              </span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', color: '#fff', marginBottom: '0.5rem' }}>
                VISIT THE MULTI-GYM FACILITY
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '620px', lineHeight: '1.6' }}>
                {siteInfo.addressPlaceholder}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <a
                href={siteInfo.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <MapPin size={18} /> Open Google Maps Pin <ExternalLink size={16} />
              </a>
              <a
                href={siteInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <InstagramIcon size={18} /> Follow on Instagram
              </a>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">
              <HelpCircle size={14} /> Helpful Info
            </span>
            <h2 className="section-title" style={{ fontSize: '2.2rem' }}>
              VISITOR FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contactFaqs.map((faq, idx) => (
              <div key={idx} className="gym-card" style={{ padding: '1.5rem' }}>
                <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  {faq.q}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
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
