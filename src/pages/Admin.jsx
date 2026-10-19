import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { ImageUploader } from '../components/ImageUploader';
import { getActiveCredentials } from '../services/supabaseClient';
import {
  ShieldCheck,
  LayoutDashboard,
  Inbox,
  FileText,
  CreditCard,
  Users,
  Image as ImageIcon,
  Database,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  Edit,
  Save,
  MessageCircle,
  ExternalLink,
  Lock,
  Download,
  Upload,
  RefreshCw,
  Cloud,
  CloudOff,
  Copy,
  Check,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const Admin = ({ setActivePage }) => {
  const {
    siteInfo,
    plans,
    trainers,
    gallery,
    enquiries,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    updateSiteInfo,
    addPlan,
    updatePlan,
    deletePlan,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    addGalleryItem,
    deleteGalleryItem,
    updateEnquiryStatus,
    deleteEnquiry,
    resetToDefault,
    exportDataJSON,
    importDataJSON,
    getStorageUsage,
    isCloudActive,
    isCloudSyncing,
    lastCloudSync,
    refreshFromCloud,
    syncAllToCloud,
    configureCloudCredentials,
    clearCloudCredentials,
  } = useGym();

  // Navigation tab
  const [activeTab, setActiveTab] = useState('dashboard');

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: 'ironparadise' });

  // Confirmation Modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDanger: true,
  });

  // Site Info form state
  const [siteForm, setSiteForm] = useState({ ...siteInfo });

  // Plan editing/adding state
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    name: '',
    price: '',
    billing: 'Monthly',
    badge: '',
    isPopular: false,
    description: '',
    featuresText: '',
  });
  const [showAddPlan, setShowAddPlan] = useState(false);

  // Trainer editing/adding state
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [newTrainer, setNewTrainer] = useState({
    name: '',
    role: '',
    specialtiesText: '',
    bio: '',
    image: '/images/trainer_male.jpg',
  });
  const [showAddTrainer, setShowAddTrainer] = useState(false);

  // Gallery adding state
  const [newGalleryItem, setNewGalleryItem] = useState({
    title: '',
    category: 'Gym Floor',
    image: '/images/gym_interior.jpg',
    caption: '',
  });
  const [showAddGallery, setShowAddGallery] = useState(false);

  // Enquiries filter
  const [enquiryFilter, setEnquiryFilter] = useState('All');

  // Cloud configuration state
  const [cloudConfigForm, setCloudConfigForm] = useState(() => {
    const creds = getActiveCredentials();
    return {
      url: creds.url || '',
      anonKey: creds.anonKey || '',
    };
  });
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [isSeedingCloud, setIsSeedingCloud] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    adminLogin(loginForm.username, loginForm.password);
  };

  // If not logged in, render login screen
  if (!isAdminLoggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          background: 'radial-gradient(circle at 50% 30%, #1e1114 0%, #08080a 75%)',
        }}
      >
        <div
          className="admin-card"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '2.5rem',
            border: '1px solid var(--border-card)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'var(--red-subtle)',
                color: 'var(--red-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                border: '1px solid rgba(229, 9, 20, 0.3)',
              }}
            >
              <Lock size={26} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: '#fff', letterSpacing: '0.04em' }}>
              ADMINISTRATOR LOGIN
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Access the IRON PARADISE demo content management system.
            </p>
          </div>

          <div
            style={{
              background: 'rgba(234, 179, 8, 0.08)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: '#facc15',
            }}
          >
            🔑 <strong>Demo Credentials:</strong>
            <div style={{ marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
              Username: <code>admin</code> | Password: <code>ironparadise</code>
            </div>
          </div>

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-user">
                Username
              </label>
              <input
                id="admin-user"
                type="text"
                className="form-input"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '1.75rem' }}>
              <label className="form-label" htmlFor="admin-pass">
                Password
              </label>
              <input
                id="admin-pass"
                type="password"
                className="form-input"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                <ShieldCheck size={18} /> Sign In To Admin Portal
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => {
                  setActivePage('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <ArrowLeft size={16} /> Return to Public Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Calculate storage stats
  const storage = getStorageUsage();
  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;

  // Filtered enquiries
  const filteredEnquiries =
    enquiryFilter === 'All' ? enquiries : enquiries.filter((e) => e.status === enquiryFilter);

  // Save Site Info
  const handleSaveSiteInfo = (e) => {
    e.preventDefault();
    updateSiteInfo(siteForm);
  };

  // Plan creation
  const handleCreatePlan = (e) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) return;
    const features = newPlan.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    addPlan({
      name: newPlan.name,
      price: newPlan.price,
      billing: newPlan.billing,
      badge: newPlan.badge,
      isPopular: newPlan.isPopular,
      description: newPlan.description,
      features: features.length ? features : ['Full access to gym equipment'],
    });

    setNewPlan({
      name: '',
      price: '',
      billing: 'Monthly',
      badge: '',
      isPopular: false,
      description: '',
      featuresText: '',
    });
    setShowAddPlan(false);
  };

  // Plan update
  const handleUpdatePlan = (e) => {
    e.preventDefault();
    if (!editingPlan) return;
    const features = editingPlan.featuresText
      ? editingPlan.featuresText
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean)
      : editingPlan.features;

    updatePlan(editingPlan.id, {
      name: editingPlan.name,
      price: editingPlan.price,
      billing: editingPlan.billing,
      badge: editingPlan.badge,
      isPopular: editingPlan.isPopular,
      description: editingPlan.description,
      features,
    });
    setEditingPlan(null);
  };

  // Trainer creation
  const handleCreateTrainer = (e) => {
    e.preventDefault();
    if (!newTrainer.name || !newTrainer.role) return;
    const specialties = newTrainer.specialtiesText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addTrainer({
      name: newTrainer.name,
      role: newTrainer.role,
      specialties: specialties.length ? specialties : ['Strength Training', 'Conditioning'],
      bio: newTrainer.bio,
      image: newTrainer.image,
    });

    setNewTrainer({
      name: '',
      role: '',
      specialtiesText: '',
      bio: '',
      image: '/images/trainer_male.jpg',
    });
    setShowAddTrainer(false);
  };

  // Trainer update
  const handleUpdateTrainer = (e) => {
    e.preventDefault();
    if (!editingTrainer) return;
    const specialties = editingTrainer.specialtiesText
      ? editingTrainer.specialtiesText
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : editingTrainer.specialties;

    updateTrainer(editingTrainer.id, {
      name: editingTrainer.name,
      role: editingTrainer.role,
      specialties,
      bio: editingTrainer.bio,
      image: editingTrainer.image,
    });
    setEditingTrainer(null);
  };

  // Gallery item creation
  const handleCreateGalleryItem = (e) => {
    e.preventDefault();
    if (!newGalleryItem.title) return;
    addGalleryItem(newGalleryItem);
    setNewGalleryItem({
      title: '',
      category: 'Gym Floor',
      image: '/images/gym_interior.jpg',
      caption: '',
    });
    setShowAddGallery(false);
  };

  // Import JSON handler
  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        importDataJSON(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="admin-shell">
      {/* Top Admin Header */}
      <header className="admin-header">
        <div className="admin-brand">
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
          <span>
            IRON <strong>PARADISE</strong>
          </span>
          <span className="admin-badge-tag">ADMIN PORTAL</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Storage Meter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              background: 'var(--bg-card)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              border: '1px solid var(--border-subtle)',
            }}
            title="Local browser storage usage for editable gym data"
          >
            <Database size={14} color="var(--red-primary)" />
            <span>
              Storage: <strong>{storage.kb} KB</strong> ({storage.percentage}%)
            </span>
          </div>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <ExternalLink size={14} /> View Live Website
          </button>

          <button className="btn btn-outline btn-sm" onClick={adminLogout}>
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </header>

      {/* Admin Body: Sidebar + Main Content */}
      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <button
            className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('enquiries')}
          >
            <Inbox size={18} /> Inquiries
            {newEnquiriesCount > 0 && (
              <span
                style={{
                  marginLeft: 'auto',
                  background: 'var(--red-primary)',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '0.1rem 0.5rem',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {newEnquiriesCount}
              </span>
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            <FileText size={18} /> Website & Hours
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            <CreditCard size={18} /> Membership Plans ({plans.length})
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'trainers' ? 'active' : ''}`}
            onClick={() => setActiveTab('trainers')}
          >
            <Users size={18} /> Coaches ({trainers.length})
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={18} /> Gallery Photos ({gallery.length})
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'cloud' ? 'active' : ''}`}
            onClick={() => setActiveTab('cloud')}
          >
            <Cloud size={18} /> Cloud & Multi-Device
            {isCloudActive ? (
              <span
                style={{
                  marginLeft: 'auto',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981',
                }}
                title="Cloud Connected"
              />
            ) : (
              <span
                style={{
                  marginLeft: 'auto',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                }}
                title="Local Mode"
              />
            )}
          </button>

          <button
            className={`admin-nav-item ${activeTab === 'backup' ? 'active' : ''}`}
            onClick={() => setActiveTab('backup')}
          >
            <Database size={18} /> Backup & Reset
          </button>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', color: '#fff', marginBottom: '0.25rem' }}>
                  MANAGEMENT DASHBOARD
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Real-time control center for IRON PARADISE website content, membership leads, and media assets.
                </p>
              </div>

              {/* Cloud Sync Status Banner */}
              <div
                style={{
                  background: isCloudActive
                    ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.12) 0%, rgba(56, 189, 248, 0.08) 100%)'
                    : 'linear-gradient(90deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.08) 100%)',
                  border: isCloudActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.1rem 1.25rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div
                    style={{
                      width: '2.6rem',
                      height: '2.6rem',
                      borderRadius: '50%',
                      background: isCloudActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      color: isCloudActive ? '#10b981' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isCloudActive ? <Cloud size={20} /> : <CloudOff size={20} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <strong style={{ color: '#fff', fontSize: '0.95rem' }}>
                        {isCloudActive ? 'Multi-Device Cloud Sync: ACTIVE' : 'Multi-Device Cloud Sync: LOCAL MODE'}
                      </strong>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '0.12rem 0.5rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                          background: isCloudActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                          color: isCloudActive ? '#34d399' : '#fbbf24',
                        }}
                      >
                        {isCloudActive ? 'Supabase Database & Storage' : 'Device-Only Cache'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                      {isCloudActive
                        ? `Photos & content saved here are immediately visible to all visitors on any device.${lastCloudSync ? ` (Last sync: ${lastCloudSync})` : ''}`
                        : 'Changes and photo uploads are currently stored on this browser only. Connect Supabase to share across all devices.'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {isCloudActive ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => refreshFromCloud(false)}
                        disabled={isCloudSyncing}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      >
                        <RefreshCw size={14} className={isCloudSyncing ? 'animate-spin' : ''} />
                        {isCloudSyncing ? 'Syncing...' : 'Refresh from Cloud'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveTab('cloud')}
                        style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                      >
                        Cloud Status
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => setActiveTab('cloud')}
                      style={{ fontSize: '0.8rem', padding: '0.45rem 1rem' }}
                    >
                      <Cloud size={14} /> Connect Cloud (Free Setup)
                    </button>
                  )}
                </div>
              </div>

              {/* KPI Cards */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1.25rem',
                  marginBottom: '2.5rem',
                }}
              >
                <div
                  className="admin-card"
                  style={{
                    margin: 0,
                    borderLeft: '4px solid #3b82f6',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('enquiries')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Total Inquiries
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', color: '#fff' }}>
                        {enquiries.length}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#60a5fa' }}>
                        {newEnquiriesCount} Pending Review
                      </div>
                    </div>
                    <Inbox size={32} color="#3b82f6" style={{ opacity: 0.8 }} />
                  </div>
                </div>

                <div
                  className="admin-card"
                  style={{
                    margin: 0,
                    borderLeft: '4px solid var(--red-primary)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('plans')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Active Plans
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', color: '#fff' }}>
                        {plans.length}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Tiered Memberships
                      </div>
                    </div>
                    <CreditCard size={32} color="var(--red-primary)" style={{ opacity: 0.8 }} />
                  </div>
                </div>

                <div
                  className="admin-card"
                  style={{
                    margin: 0,
                    borderLeft: '4px solid #10b981',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('trainers')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Strength Coaches
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', color: '#fff' }}>
                        {trainers.length}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#34d399' }}>
                        Active Profiles
                      </div>
                    </div>
                    <Users size={32} color="#10b981" style={{ opacity: 0.8 }} />
                  </div>
                </div>

                <div
                  className="admin-card"
                  style={{
                    margin: 0,
                    borderLeft: '4px solid #f59e0b',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('gallery')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Gallery Showcase
                      </div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', color: '#fff' }}>
                        {gallery.length}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#fbbf24' }}>
                        High-Res Photos
                      </div>
                    </div>
                    <ImageIcon size={32} color="#f59e0b" style={{ opacity: 0.8 }} />
                  </div>
                </div>
              </div>

              {/* Recent Inquiries Snapshot */}
              <div className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <h3 className="admin-card-title">RECENT MEMBERSHIP LEADS</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      Latest visitor inquiries submitted through the website forms.
                    </p>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => setActiveTab('enquiries')}>
                    View All Inquiries ({enquiries.length})
                  </button>
                </div>

                {enquiries.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No inquiries recorded yet.
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.75rem 1rem' }}>Applicant</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Phone</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Interest</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                          <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                          <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enquiries.slice(0, 5).map((e) => (
                          <tr key={e.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            <td style={{ padding: '0.85rem 1rem', fontWeight: 600, color: '#fff' }}>{e.name}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{e.phone}</td>
                            <td style={{ padding: '0.85rem 1rem', color: '#f87171' }}>{e.planInterest}</td>
                            <td style={{ padding: '0.85rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{e.date}</td>
                            <td style={{ padding: '0.85rem 1rem' }}>
                              <span
                                style={{
                                  padding: '0.2rem 0.6rem',
                                  borderRadius: '4px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  background:
                                    e.status === 'New'
                                      ? 'rgba(59, 130, 246, 0.15)'
                                      : e.status === 'Contacted'
                                      ? 'rgba(234, 179, 8, 0.15)'
                                      : 'rgba(16, 185, 129, 0.15)',
                                  color:
                                    e.status === 'New'
                                      ? '#60a5fa'
                                      : e.status === 'Contacted'
                                      ? '#facc15'
                                      : '#34d399',
                                }}
                              >
                                {e.status}
                              </span>
                            </td>
                            <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                              <button
                                className="btn btn-whatsapp btn-sm"
                                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                                onClick={() => {
                                  const text = encodeURIComponent(`Hi ${e.name}, this is IRON PARADISE Gym regarding your inquiry.`);
                                  window.open(`https://wa.me/${e.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                }}
                              >
                                <MessageCircle size={13} /> Chat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div>
              <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                    MEMBERSHIP LEADS & INQUIRIES
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Manage member inquiries, follow up on WhatsApp, and update contact status.
                  </p>
                </div>

                {/* Filter buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['All', 'New', 'Contacted', 'Resolved'].map((st) => (
                    <button
                      key={st}
                      className={`btn btn-sm ${enquiryFilter === st ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setEnquiryFilter(st)}
                    >
                      {st} {st === 'All' ? `(${enquiries.length})` : ''}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEnquiries.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
                  <Inbox size={40} color="var(--text-dim)" style={{ margin: '0 auto 1rem auto' }} />
                  <h3 style={{ color: '#fff', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    No {enquiryFilter !== 'All' ? enquiryFilter : ''} inquiries found
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    New submissions from the Join Modal or Contact page will appear here.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredEnquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="admin-card"
                      style={{
                        margin: 0,
                        borderLeft:
                          enq.status === 'New'
                            ? '4px solid #3b82f6'
                            : enq.status === 'Contacted'
                            ? '4px solid #facc15'
                            : '4px solid #10b981',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                            <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>{enq.name}</h3>
                            <span
                              style={{
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                background:
                                  enq.status === 'New'
                                    ? 'rgba(59, 130, 246, 0.15)'
                                    : enq.status === 'Contacted'
                                    ? 'rgba(234, 179, 8, 0.15)'
                                    : 'rgba(16, 185, 129, 0.15)',
                                color:
                                  enq.status === 'New'
                                    ? '#60a5fa'
                                    : enq.status === 'Contacted'
                                    ? '#facc15'
                                    : '#34d399',
                              }}
                            >
                              {enq.status}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                            <span>📞 <strong>{enq.phone}</strong></span>
                            {enq.email && <span>✉️ {enq.email}</span>}
                            <span>🎯 Tier: <strong style={{ color: '#f87171' }}>{enq.planInterest}</strong></span>
                            <span>🕒 {enq.date}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <select
                            className="form-select"
                            style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem', width: 'auto' }}
                            value={enq.status}
                            onChange={(e) => updateEnquiryStatus(enq.id, e.target.value)}
                          >
                            <option value="New">Status: New</option>
                            <option value="Contacted">Status: Contacted</option>
                            <option value="Resolved">Status: Resolved</option>
                          </select>

                          <button
                            className="btn btn-whatsapp btn-sm"
                            onClick={() => {
                              const text = encodeURIComponent(
                                `Hello ${enq.name}, this is IRON PARADISE Gym responding to your inquiry regarding ${enq.planInterest}. How can we assist you today?`
                              );
                              window.open(`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                            }}
                            title="Reply on WhatsApp"
                          >
                            <MessageCircle size={15} /> WhatsApp
                          </button>

                          <button
                            className="btn btn-outline btn-sm"
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                            onClick={() => {
                              setConfirmModal({
                                isOpen: true,
                                title: 'Delete Inquiry Record?',
                                message: `Are you sure you want to remove the inquiry record for ${enq.name}?`,
                                onConfirm: () => {
                                  deleteEnquiry(enq.id);
                                  setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                                },
                                isDanger: true,
                              });
                            }}
                            title="Delete inquiry"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {enq.message && (
                        <div
                          style={{
                            background: 'var(--bg-charcoal)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem 1rem',
                            fontSize: '0.875rem',
                            color: 'var(--text-primary)',
                            lineHeight: '1.5',
                          }}
                        >
                          <strong>Applicant Message:</strong> {enq.message}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WEBSITE CONTENT & HOURS */}
          {activeTab === 'content' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                  WEBSITE CONTENT & SETTINGS
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Update gym contact numbers, Google Maps navigation pin, operating hours, and promotional headlines.
                </p>
              </div>

              <form onSubmit={handleSaveSiteInfo}>
                {/* Contact & Location Settings */}
                <div className="admin-card">
                  <h3 className="admin-card-title" style={{ marginBottom: '1.25rem' }}>
                    CONTACT & LOCATION SETTINGS
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="site-name">Gym Display Name</label>
                      <input
                        id="site-name"
                        type="text"
                        className="form-input"
                        value={siteForm.gymName}
                        onChange={(e) => setSiteForm({ ...siteForm, gymName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="site-phone">Phone Number (Display)</label>
                      <input
                        id="site-phone"
                        type="text"
                        className="form-input"
                        value={siteForm.phone}
                        onChange={(e) => setSiteForm({ ...siteForm, phone: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="site-wa">WhatsApp Number (Digits with country code)</label>
                      <input
                        id="site-wa"
                        type="text"
                        className="form-input"
                        value={siteForm.whatsappNumber}
                        onChange={(e) => setSiteForm({ ...siteForm, whatsappNumber: e.target.value.replace(/[^0-9]/g, '') })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="site-ig">Instagram URL</label>
                      <input
                        id="site-ig"
                        type="url"
                        className="form-input"
                        value={siteForm.instagramUrl}
                        onChange={(e) => setSiteForm({ ...siteForm, instagramUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label" htmlFor="site-map">Google Maps Pin URL</label>
                      <input
                        id="site-map"
                        type="url"
                        className="form-input"
                        value={siteForm.locationUrl}
                        onChange={(e) => setSiteForm({ ...siteForm, locationUrl: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label" htmlFor="site-addr">Address / Location Description</label>
                      <input
                        id="site-addr"
                        type="text"
                        className="form-input"
                        value={siteForm.addressPlaceholder}
                        onChange={(e) => setSiteForm({ ...siteForm, addressPlaceholder: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label" htmlFor="site-hours">Training Schedule & Hours</label>
                      <input
                        id="site-hours"
                        type="text"
                        className="form-input"
                        value={siteForm.hoursPlaceholder}
                        onChange={(e) => setSiteForm({ ...siteForm, hoursPlaceholder: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Hero & Headlines */}
                <div className="admin-card">
                  <h3 className="admin-card-title" style={{ marginBottom: '1.25rem' }}>
                    HOMEPAGE HEADLINES & STORY
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="site-hero-h">Hero Headline</label>
                    <input
                      id="site-hero-h"
                      type="text"
                      className="form-input"
                      value={siteForm.heroHeadline}
                      onChange={(e) => setSiteForm({ ...siteForm, heroHeadline: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="site-hero-t">Hero Tagline</label>
                    <textarea
                      id="site-hero-t"
                      className="form-textarea"
                      rows={2}
                      value={siteForm.heroTagline}
                      onChange={(e) => setSiteForm({ ...siteForm, heroTagline: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="site-about-h">About Us Section Title</label>
                    <input
                      id="site-about-h"
                      type="text"
                      className="form-input"
                      value={siteForm.aboutHeading}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutHeading: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="site-about-t">About Story Narrative</label>
                    <textarea
                      id="site-about-t"
                      className="form-textarea"
                      rows={3}
                      value={siteForm.aboutText}
                      onChange={(e) => setSiteForm({ ...siteForm, aboutText: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="site-mission">Mission Statement</label>
                      <textarea
                        id="site-mission"
                        className="form-textarea"
                        rows={2}
                        value={siteForm.aboutMission}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutMission: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="site-vision">Vision Statement</label>
                      <textarea
                        id="site-vision"
                        className="form-textarea"
                        rows={2}
                        value={siteForm.aboutVision}
                        onChange={(e) => setSiteForm({ ...siteForm, aboutVision: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Notice Banner */}
                <div className="admin-card">
                  <h3 className="admin-card-title" style={{ marginBottom: '1.25rem' }}>
                    HEADER NOTICE BANNER
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                      <input
                        type="checkbox"
                        checked={siteForm.showNoticeBanner}
                        onChange={(e) => setSiteForm({ ...siteForm, showNoticeBanner: e.target.checked })}
                        style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--red-primary)' }}
                      />
                      <span>Enable Top Announcement Banner</span>
                    </label>
                  </div>

                  {siteForm.showNoticeBanner && (
                    <div className="form-group">
                      <label className="form-label" htmlFor="site-notice">Banner Announcement Text</label>
                      <input
                        id="site-notice"
                        type="text"
                        className="form-input"
                        value={siteForm.noticeBanner}
                        onChange={(e) => setSiteForm({ ...siteForm, noticeBanner: e.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button type="submit" className="btn btn-primary btn-lg">
                    <Save size={18} /> Save Website Settings
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: MEMBERSHIP PLANS */}
          {activeTab === 'plans' && (
            <div>
              <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                    MEMBERSHIP TIERS & PRICING
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Configure tier names, pricing placeholders, billing frequency, and feature perks.
                  </p>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setShowAddPlan(true)}>
                  <Plus size={16} /> Create New Plan
                </button>
              </div>

              {/* Add Plan Form Modal */}
              {showAddPlan && (
                <div className="modal-backdrop" onClick={() => setShowAddPlan(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 className="modal-title">CREATE MEMBERSHIP PLAN</h3>
                    </div>
                    <form onSubmit={handleCreatePlan}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label className="form-label">Plan Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 6-Month Heavy Strength"
                            className="form-input"
                            value={newPlan.name}
                            onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Price / Rate *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. ₹1,500 or [Inquire]"
                              className="form-input"
                              value={newPlan.price}
                              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Billing Cycle</label>
                            <input
                              type="text"
                              placeholder="e.g. Monthly / Quarterly"
                              className="form-input"
                              value={newPlan.billing}
                              onChange={(e) => setNewPlan({ ...newPlan, billing: e.target.value })}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Badge Label (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. Best Value / Most Popular"
                              className="form-input"
                              value={newPlan.badge}
                              onChange={(e) => setNewPlan({ ...newPlan, badge: e.target.value })}
                            />
                          </div>
                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                              <input
                                type="checkbox"
                                checked={newPlan.isPopular}
                                onChange={(e) => setNewPlan({ ...newPlan, isPopular: e.target.checked })}
                                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--red-primary)' }}
                              />
                              <span>Highlight as Most Popular</span>
                            </label>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <input
                            type="text"
                            placeholder="Short target audience summary"
                            className="form-input"
                            value={newPlan.description}
                            onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Included Features (One per line)</label>
                          <textarea
                            className="form-textarea"
                            rows={3}
                            placeholder="Full free weight floor access&#10;Locker access&#10;Consultation session"
                            value={newPlan.featuresText}
                            onChange={(e) => setNewPlan({ ...newPlan, featuresText: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddPlan(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Create Plan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Plan Modal */}
              {editingPlan && (
                <div className="modal-backdrop" onClick={() => setEditingPlan(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 className="modal-title">EDIT MEMBERSHIP PLAN</h3>
                    </div>
                    <form onSubmit={handleUpdatePlan}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label className="form-label">Plan Name *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={editingPlan.name}
                            onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Price / Rate *</label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={editingPlan.price}
                              onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Billing Cycle</label>
                            <input
                              type="text"
                              className="form-input"
                              value={editingPlan.billing}
                              onChange={(e) => setEditingPlan({ ...editingPlan, billing: e.target.value })}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">Badge Label</label>
                            <input
                              type="text"
                              className="form-input"
                              value={editingPlan.badge || ''}
                              onChange={(e) => setEditingPlan({ ...editingPlan, badge: e.target.value })}
                            />
                          </div>
                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', marginTop: '1.75rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#fff' }}>
                              <input
                                type="checkbox"
                                checked={editingPlan.isPopular}
                                onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                                style={{ width: '1.2rem', height: '1.2rem', accentColor: 'var(--red-primary)' }}
                              />
                              <span>Highlight as Most Popular</span>
                            </label>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Description</label>
                          <input
                            type="text"
                            className="form-input"
                            value={editingPlan.description}
                            onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Features (One per line)</label>
                          <textarea
                            className="form-textarea"
                            rows={3}
                            value={
                              editingPlan.featuresText !== undefined
                                ? editingPlan.featuresText
                                : editingPlan.features.join('\n')
                            }
                            onChange={(e) => setEditingPlan({ ...editingPlan, featuresText: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingPlan(null)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Plans Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className="admin-card"
                    style={{
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      borderTop: p.isPopular ? '3px solid var(--red-primary)' : '1px solid var(--border-card)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700 }}>{p.name}</h3>
                      {p.badge && (
                        <span
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            background: p.isPopular ? 'var(--red-primary)' : 'var(--bg-charcoal)',
                            color: '#fff',
                          }}
                        >
                          {p.badge}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '1.4rem', fontFamily: 'var(--font-display)', color: '#fff', marginBottom: '0.25rem' }}>
                      {p.price} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {p.billing}</span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                      {p.description}
                    </p>

                    <div style={{ marginBottom: '1.25rem', marginTop: 'auto' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                        Features ({p.features.length})
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        {p.features.slice(0, 3).map((f, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>
                            • {f}
                          </li>
                        ))}
                        {p.features.length > 3 && (
                          <li style={{ color: 'var(--text-muted)' }}>+{p.features.length - 3} more perks</li>
                        )}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                        onClick={() =>
                          setEditingPlan({
                            ...p,
                            featuresText: p.features.join('\n'),
                          })
                        }
                      >
                        <Edit size={14} /> Edit Plan
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Delete Membership Plan?',
                            message: `Are you sure you want to delete "${p.name}"? This action cannot be undone.`,
                            onConfirm: () => {
                              deletePlan(p.id);
                              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                            },
                            isDanger: true,
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRAINERS */}
          {activeTab === 'trainers' && (
            <div>
              <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                    COACHING STAFF & TRAINERS
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Manage coach bios, qualifications, lifting specialties, and photos.
                  </p>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setShowAddTrainer(true)}>
                  <Plus size={16} /> Add Coach Profile
                </button>
              </div>

              {/* Add Trainer Modal */}
              {showAddTrainer && (
                <div className="modal-backdrop" onClick={() => setShowAddTrainer(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 className="modal-title">ADD COACH PROFILE</h3>
                    </div>
                    <form onSubmit={handleCreateTrainer}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label className="form-label">Coach Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Coach Marcus Vance"
                            className="form-input"
                            value={newTrainer.name}
                            onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Role / Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Head Strength & Conditioning Coach"
                            className="form-input"
                            value={newTrainer.role}
                            onChange={(e) => setNewTrainer({ ...newTrainer, role: e.target.value })}
                          />
                        </div>

                        <ImageUploader
                          label="Coach Photo (Select from Device)"
                          value={newTrainer.image}
                          onChange={(val) => setNewTrainer({ ...newTrainer, image: val })}
                          folder="trainers"
                          recommendedText="Select coach photo from device folder (JPEG, PNG, WebP) - synced to cloud"
                        />

                        <div className="form-group">
                          <label className="form-label">Specialties (Comma-separated)</label>
                          <input
                            type="text"
                            placeholder="Powerlifting, Hypertrophy, Barbell Mechanics"
                            className="form-input"
                            value={newTrainer.specialtiesText}
                            onChange={(e) => setNewTrainer({ ...newTrainer, specialtiesText: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Bio & Philosophy</label>
                          <textarea
                            className="form-textarea"
                            rows={3}
                            placeholder="Brief coaching experience and lifting philosophy..."
                            value={newTrainer.bio}
                            onChange={(e) => setNewTrainer({ ...newTrainer, bio: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddTrainer(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Save Coach
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Trainer Modal */}
              {editingTrainer && (
                <div className="modal-backdrop" onClick={() => setEditingTrainer(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 className="modal-title">EDIT COACH PROFILE</h3>
                    </div>
                    <form onSubmit={handleUpdateTrainer}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label className="form-label">Coach Name *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={editingTrainer.name}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, name: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Role / Title *</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={editingTrainer.role}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, role: e.target.value })}
                          />
                        </div>

                        <ImageUploader
                          label="Coach Photo (Select from Device)"
                          value={editingTrainer.image}
                          onChange={(val) => setEditingTrainer({ ...editingTrainer, image: val })}
                          folder="trainers"
                          recommendedText="Select coach photo from device folder (JPEG, PNG, WebP) - synced to cloud"
                        />

                        <div className="form-group">
                          <label className="form-label">Specialties (Comma-separated)</label>
                          <input
                            type="text"
                            className="form-input"
                            value={
                              editingTrainer.specialtiesText !== undefined
                                ? editingTrainer.specialtiesText
                                : editingTrainer.specialties.join(', ')
                            }
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, specialtiesText: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Bio & Philosophy</label>
                          <textarea
                            className="form-textarea"
                            rows={3}
                            value={editingTrainer.bio}
                            onChange={(e) => setEditingTrainer({ ...editingTrainer, bio: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditingTrainer(null)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Trainers Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {trainers.map((tr) => (
                  <div key={tr.id} className="admin-card" style={{ margin: 0, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1rem', alignItems: 'center' }}>
                      <img
                        src={tr.image}
                        alt={tr.name}
                        style={{
                          width: '4.5rem',
                          height: '4.5rem',
                          borderRadius: 'var(--radius-sm)',
                          objectFit: 'cover',
                          border: '1px solid var(--border-card)',
                        }}
                      />
                      <div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--red-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                          {tr.role}
                        </div>
                        <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700 }}>{tr.name}</h3>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', marginBottom: '1rem' }}>
                      {tr.bio}
                    </p>

                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem', marginTop: 'auto' }}>
                      {tr.specialties.map((s, idx) => (
                        <span key={idx} className="spec-badge" style={{ fontSize: '0.75rem' }}>
                          {s}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                        onClick={() =>
                          setEditingTrainer({
                            ...tr,
                            specialtiesText: tr.specialties.join(', '),
                          })
                        }
                      >
                        <Edit size={14} /> Edit Profile
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Delete Coach Profile?',
                            message: `Are you sure you want to remove "${tr.name}"?`,
                            onConfirm: () => {
                              deleteTrainer(tr.id);
                              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                            },
                            isDanger: true,
                          });
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div>
              <div className="admin-card-header" style={{ marginBottom: '1.5rem' }}>
                <div>
                  <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                    GALLERY ASSET MANAGER
                  </h1>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    Add images, edit category tags, and manage the visual gallery.
                  </p>
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => setShowAddGallery(true)}>
                  <Plus size={16} /> Add Image to Gallery
                </button>
              </div>

              {/* Add Gallery Item Modal */}
              {showAddGallery && (
                <div className="modal-backdrop" onClick={() => setShowAddGallery(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3 className="modal-title">ADD PHOTO TO GALLERY</h3>
                    </div>
                    <form onSubmit={handleCreateGalleryItem}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label className="form-label">Photo Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Barbell Squat Platforms"
                            className="form-input"
                            value={newGalleryItem.title}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Category</label>
                          <select
                            className="form-select"
                            value={newGalleryItem.category}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                          >
                            <option value="Gym Floor">Gym Floor</option>
                            <option value="Equipment">Equipment</option>
                            <option value="Training">Training</option>
                            <option value="Coaching">Coaching</option>
                          </select>
                        </div>

                        <ImageUploader
                          label="Select Photo from Folder / Device"
                          value={newGalleryItem.image}
                          onChange={(val) => setNewGalleryItem({ ...newGalleryItem, image: val })}
                          folder="gallery"
                          recommendedText="Select any image from your device folder (JPEG, PNG, WebP) - automatically saved to Cloud Storage"
                        />

                        <div className="form-group">
                          <label className="form-label">Caption / Description</label>
                          <input
                            type="text"
                            placeholder="Brief caption visible in lightbox"
                            className="form-input"
                            value={newGalleryItem.caption}
                            onChange={(e) => setNewGalleryItem({ ...newGalleryItem, caption: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowAddGallery(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary btn-sm">
                          Add Photo
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Gallery Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                {gallery.map((item) => (
                  <div key={item.id} className="admin-card" style={{ margin: 0, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ height: '170px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '0.75rem', position: 'relative' }}>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: 'rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(4px)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#fff',
                        }}
                      >
                        {item.category}
                      </span>
                    </div>

                    <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                        {item.caption}
                      </p>
                    )}

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', paddingTop: '0.5rem' }}>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', width: '100%' }}
                        onClick={() => {
                          setConfirmModal({
                            isOpen: true,
                            title: 'Delete Gallery Image?',
                            message: `Are you sure you want to remove "${item.title}" from the gallery?`,
                            onConfirm: () => {
                              deleteGalleryItem(item.id);
                              setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                            },
                            isDanger: true,
                          });
                        }}
                      >
                        <Trash2 size={14} /> Remove Photo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: CLOUD STORAGE & SHARED DATABASE */}
          {activeTab === 'cloud' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                  CLOUD STORAGE & SHARED DATABASE
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Connect your free Supabase cloud backend to enable multi-device synchronization. Photos uploaded and edits made here will immediately appear on all phones, tablets, and computers.
                </p>
              </div>

              {/* Status Header Banner */}
              <div
                style={{
                  background: isCloudActive
                    ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(56, 189, 248, 0.1) 100%)'
                    : 'linear-gradient(90deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%)',
                  border: isCloudActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '1.25rem 1.5rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '3.2rem',
                      height: '3.2rem',
                      borderRadius: '50%',
                      background: isCloudActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                      color: isCloudActive ? '#10b981' : '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isCloudActive ? <Cloud size={24} /> : <CloudOff size={24} />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <h3 style={{ color: '#fff', fontSize: '1.15rem', margin: 0 }}>
                        {isCloudActive ? 'Multi-Device Synchronization: ACTIVE' : 'Status: LOCAL DEMO MODE (Device-Only)'}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.55rem',
                          borderRadius: '999px',
                          fontWeight: 700,
                          background: isCloudActive ? '#10b981' : '#f59e0b',
                          color: '#000',
                        }}
                      >
                        {isCloudActive ? 'CONNECTED' : 'ACTION REQUIRED'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0.35rem 0 0 0' }}>
                      {isCloudActive
                        ? `Shared PostgreSQL database and public 'gym-images' storage bucket active.${lastCloudSync ? ` Last synced: ${lastCloudSync}.` : ''}`
                        : 'Changes and uploaded photos exist only on this browser cache. To make them visible to other phones/visitors, connect Supabase below.'}
                    </p>
                  </div>
                </div>

                {isCloudActive && (
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => refreshFromCloud(false)}
                      disabled={isCloudSyncing}
                    >
                      <RefreshCw size={14} className={isCloudSyncing ? 'animate-spin' : ''} />
                      {isCloudSyncing ? 'Refreshing...' : 'Refresh from Cloud'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={async () => {
                        setIsSeedingCloud(true);
                        await syncAllToCloud();
                        setIsSeedingCloud(false);
                      }}
                      disabled={isSeedingCloud || isCloudSyncing}
                    >
                      {isSeedingCloud ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {isSeedingCloud ? 'Pushing Data...' : 'Sync All Data to Cloud'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Connection Settings Card */}
                <div className="admin-card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Database size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>SUPABASE CREDENTIALS</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Project URL & Public Anon Key</div>
                    </div>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSavingCloud(true);
                      await configureCloudCredentials(cloudConfigForm.url, cloudConfigForm.anonKey);
                      setIsSavingCloud(false);
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label" htmlFor="supabase-url">
                        Supabase Project URL *
                      </label>
                      <input
                        id="supabase-url"
                        type="url"
                        required
                        placeholder="https://yourprojectid.supabase.co"
                        className="form-input"
                        value={cloudConfigForm.url}
                        onChange={(e) => setCloudConfigForm({ ...cloudConfigForm, url: e.target.value })}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Found in Supabase: Project Settings → API → Project URL
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="supabase-key">
                        Supabase Anon / Public Key *
                      </label>
                      <textarea
                        id="supabase-key"
                        required
                        rows={3}
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                        className="form-textarea"
                        style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}
                        value={cloudConfigForm.anonKey}
                        onChange={(e) => setCloudConfigForm({ ...cloudConfigForm, anonKey: e.target.value })}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Found in Supabase: Project Settings → API → Project API Keys → `anon` `public`
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.25rem' }}>
                      <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isSavingCloud}>
                        {isSavingCloud ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSavingCloud ? 'Connecting...' : 'Save & Test Connection'}
                      </button>
                      {isCloudActive && (
                        <button
                          type="button"
                          className="btn btn-outline"
                          style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                          onClick={() => {
                            clearCloudCredentials();
                            setCloudConfigForm({ url: '', anonKey: '' });
                          }}
                        >
                          Disconnect
                        </button>
                      )}
                    </div>
                  </form>

                  <div
                    style={{
                      marginTop: '1.5rem',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                    }}
                  >
                    <strong>💡 Permanent Vercel Deployment Note:</strong>
                    <br />
                    You can also set these environment variables in your Vercel Dashboard under <em>Settings → Environment Variables</em>:
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.4rem 0' }}>
                      <li><code>VITE_SUPABASE_URL</code></li>
                      <li><code>VITE_SUPABASE_ANON_KEY</code></li>
                    </ul>
                  </div>
                </div>

                {/* Setup Guide & SQL Card */}
                <div className="admin-card" style={{ margin: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: 0 }}>3-STEP CLOUD SETUP</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>100% Free • Takes 2 Minutes</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ background: 'var(--bg-charcoal)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                        1. Create Free Supabase Project
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Go to <a href="https://supabase.com" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>supabase.com</a>, sign in with GitHub, and click <strong>"New Project"</strong>. Choose a name and database password.
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-charcoal)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                        2. Run the Database & Storage SQL Schema
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Open <strong>SQL Editor</strong> in Supabase, create a new query, paste the prepared schema script, and click <strong>RUN</strong>. This creates all tables and the public <code>gym-images</code> bucket.
                      </div>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%' }}
                        onClick={() => {
                          const schemaText = `-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.gym_site_info (
  id INT PRIMARY KEY DEFAULT 1,
  gym_name TEXT NOT NULL DEFAULT 'IRON PARADISE',
  phone TEXT NOT NULL DEFAULT '+91 99615 12136',
  whatsapp_number TEXT NOT NULL DEFAULT '919961512136',
  instagram_url TEXT DEFAULT 'https://www.instagram.com/iron_paradise_multi_gym/',
  location_url TEXT DEFAULT 'https://share.google/YxMJbJvSD5aDmA17K',
  address_placeholder TEXT DEFAULT 'IRON PARADISE Multi-Gym, Kodumon',
  hours_placeholder TEXT DEFAULT 'Mon - Sat: 5:30 AM - 10:00 PM | Sun: Inquire',
  hero_headline TEXT DEFAULT 'BUILD STRENGTH. BECOME UNSTOPPABLE.',
  hero_tagline TEXT DEFAULT 'Step into an elite fitness atmosphere engineered for high-performance training.',
  about_heading TEXT DEFAULT 'WHERE DEDICATION MEETS PURE IRON',
  about_text TEXT DEFAULT 'IRON PARADISE was forged for those who refuse to settle.',
  about_mission TEXT DEFAULT 'To deliver a distraction-free, high-standard fitness space.',
  about_vision TEXT DEFAULT 'To be the leading strength and bodybuilding destination.',
  facilities_note TEXT DEFAULT 'Facility features customizable in Admin.',
  notice_banner TEXT DEFAULT '⚡ Welcome to IRON PARADISE!',
  show_notice_banner BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gym_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  billing TEXT NOT NULL DEFAULT 'Monthly',
  badge TEXT DEFAULT '',
  is_popular BOOLEAN DEFAULT false,
  features JSONB DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gym_trainers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  specialties TEXT[] DEFAULT ARRAY[]::TEXT[],
  bio TEXT DEFAULT '',
  image TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gym_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Gym Floor',
  image TEXT NOT NULL,
  caption TEXT DEFAULT '',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.gym_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  plan_interest TEXT DEFAULT '',
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO storage.buckets (id, name, public) VALUES ('gym-images', 'gym-images', true) ON CONFLICT (id) DO UPDATE SET public = true;

ALTER TABLE public.gym_site_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gym_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read All" ON public.gym_site_info FOR SELECT USING (true);
CREATE POLICY "Public Read Plans" ON public.gym_plans FOR SELECT USING (true);
CREATE POLICY "Public Read Trainers" ON public.gym_trainers FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gym_gallery FOR SELECT USING (true);
CREATE POLICY "Public Submit Enq" ON public.gym_enquiries FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow Write Site" ON public.gym_site_info FOR ALL USING (true);
CREATE POLICY "Allow Write Plans" ON public.gym_plans FOR ALL USING (true);
CREATE POLICY "Allow Write Trainers" ON public.gym_trainers FOR ALL USING (true);
CREATE POLICY "Allow Write Gallery" ON public.gym_gallery FOR ALL USING (true);
CREATE POLICY "Allow Write Enquiries" ON public.gym_enquiries FOR ALL USING (true);

CREATE POLICY "Public Storage Read" ON storage.objects FOR SELECT USING (bucket_id = 'gym-images');
CREATE POLICY "Public Storage Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gym-images');
CREATE POLICY "Public Storage Update" ON storage.objects FOR UPDATE USING (bucket_id = 'gym-images');
CREATE POLICY "Public Storage Delete" ON storage.objects FOR DELETE USING (bucket_id = 'gym-images');
`;
                          navigator.clipboard.writeText(schemaText);
                          setCopiedSql(true);
                          setTimeout(() => setCopiedSql(false), 3000);
                        }}
                      >
                        {copiedSql ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                        {copiedSql ? 'SQL Copied to Clipboard!' : 'Copy SQL Schema Script (supabase/schema.sql)'}
                      </button>
                    </div>

                    <div style={{ background: 'var(--bg-charcoal)', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: '0.88rem', marginBottom: '0.2rem' }}>
                        3. Copy URL & Key, Then Sync
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Paste your Project URL & Anon Key into the form on the left, click <strong>Save & Test</strong>, then click <strong>Sync All Data to Cloud</strong>. All devices will now sync live!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: BACKUP & SYSTEM RESET */}
          {activeTab === 'backup' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: '#fff', marginBottom: '0.25rem' }}>
                  DATA BACKUP, EXPORT & RESTORE
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Manage site persistence, download offline backups, and restore demo presets.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {/* Export Card */}
                <div className="admin-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Download size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>EXPORT DATA BACKUP</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>JSON Export</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Download a full snapshot of your current plans, trainers, gallery images, inquiries, and custom site copy to a portable JSON file.
                  </p>
                  <button className="btn btn-secondary" onClick={exportDataJSON} style={{ width: '100%' }}>
                    <Download size={16} /> Download Backup (.json)
                  </button>
                </div>

                {/* Import Card */}
                <div className="admin-card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Upload size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>IMPORT DATA BACKUP</h3>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>JSON Restore</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Restore all website content and inquiries from a previously saved JSON backup file.
                  </p>
                  <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer' }}>
                    <Upload size={16} /> Choose File to Restore
                    <input type="file" accept=".json" onChange={handleFileImport} style={{ display: 'none' }} />
                  </label>
                </div>

                {/* Reset to Factory Defaults */}
                <div className="admin-card" style={{ border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--red-subtle)', color: 'var(--red-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <RefreshCw size={20} />
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '1.25rem' }}>FACTORY DEMO RESET</h3>
                      <div style={{ color: '#f87171', fontSize: '0.8rem' }}>Warning: Destructive</div>
                    </div>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    Discard all local modifications and restore the clean factory demo state with default plans, trainers, and copy.
                  </p>
                  <button
                    className="btn btn-outline"
                    style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444' }}
                    onClick={() => {
                      setConfirmModal({
                        isOpen: true,
                        title: 'Restore Default Demo Data?',
                        message:
                          'Are you sure you want to reset all content to defaults? Any custom plans or inquiries will be replaced by the default template.',
                        onConfirm: () => {
                          resetToDefault();
                          setSiteForm({ ...siteInfo });
                          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                        },
                        isDanger: true,
                      });
                    }}
                  >
                    <RefreshCw size={16} /> Reset Everything to Defaults
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isDanger={confirmModal.isDanger}
      />
    </div>
  );
};
