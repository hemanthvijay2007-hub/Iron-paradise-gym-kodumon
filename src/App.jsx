import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JoinModal } from './components/JoinModal';
import { ToastContainer } from './components/Toast';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Plans } from './pages/Plans';
import { Trainers } from './pages/Trainers';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

import { MessageCircle } from 'lucide-react';

function GymApp() {
  const { siteInfo } = useGym();
  const [activePage, setActivePage] = useState('home');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState('');

  const handleOpenJoinModal = (planName = '') => {
    setSelectedPlanForModal(planName);
    setIsJoinModalOpen(true);
  };

  const handleCloseJoinModal = () => {
    setIsJoinModalOpen(false);
  };

  const handlePageChange = (pageId) => {
    setActivePage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsAppFloating = () => {
    window.open(
      `https://wa.me/${siteInfo.whatsappNumber}?text=${encodeURIComponent(
        'Hello IRON PARADISE, I would like to inquire about membership and training facilities.'
      )}`,
      '_blank'
    );
  };

  // If viewing admin panel, show dedicated admin view
  if (activePage === 'admin') {
    return (
      <div className="app-root">
        <Admin setActivePage={handlePageChange} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="app-root">
      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={handlePageChange}
        onOpenJoinModal={handleOpenJoinModal}
      />

      {/* Main Page Content */}
      <main id="main-content">
        {activePage === 'home' && (
          <Home
            setActivePage={handlePageChange}
            onOpenJoinModal={handleOpenJoinModal}
          />
        )}
        {activePage === 'about' && (
          <About
            setActivePage={handlePageChange}
            onOpenJoinModal={handleOpenJoinModal}
          />
        )}
        {activePage === 'plans' && (
          <Plans onOpenJoinModal={handleOpenJoinModal} />
        )}
        {activePage === 'trainers' && <Trainers />}
        {activePage === 'gallery' && (
          <Gallery setActivePage={handlePageChange} />
        )}
        {activePage === 'contact' && <Contact />}
      </main>

      {/* Global Footer */}
      <Footer setActivePage={handlePageChange} />

      {/* Floating WhatsApp Quick Action Button */}
      <button
        className="floating-wa-btn"
        onClick={openWhatsAppFloating}
        aria-label="Chat on WhatsApp"
        title="Chat with us on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: '2rem',
          zIndex: 850,
          width: '3.75rem',
          height: '3.75rem',
          borderRadius: '50%',
          background: '#25d366',
          color: '#0b2210',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: 'none',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
        }}
      >
        <MessageCircle size={30} strokeWidth={2.2} />
      </button>

      {/* Membership Join / Inquiry Modal */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={handleCloseJoinModal}
        selectedPlanName={selectedPlanForModal}
      />

      {/* Global Notifications */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <GymApp />
    </GymProvider>
  );
}
