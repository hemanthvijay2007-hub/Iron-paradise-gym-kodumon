import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DATA } from '../data/initialData';

const STORAGE_KEY = 'iron_paradise_storage_v1';
const ADMIN_AUTH_KEY = 'iron_paradise_admin_session';

const GymContext = createContext(null);

export const GymProvider = ({ children }) => {
  // Load data from localStorage or fallback to INITIAL_DATA
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure deep merging in case fields are missing
        return {
          siteInfo: { ...INITIAL_DATA.siteInfo, ...(parsed.siteInfo || {}) },
          plans: Array.isArray(parsed.plans) ? parsed.plans : INITIAL_DATA.plans,
          trainers: Array.isArray(parsed.trainers) ? parsed.trainers : INITIAL_DATA.trainers,
          gallery: Array.isArray(parsed.gallery) ? parsed.gallery : INITIAL_DATA.gallery,
          enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : INITIAL_DATA.enquiries,
          settings: { ...INITIAL_DATA.settings, ...(parsed.settings || {}) },
        };
      }
    } catch (e) {
      console.error('Error reading localStorage, using defaults:', e);
    }
    return INITIAL_DATA;
  });

  // Admin session state (demo frontend-only)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
      setTimeout(() => {
        showToast('Storage limit reached! Please use smaller images or export your data.', 'error');
      }, 0);
    }
  }, [data]);

  // Admin login / logout
  const adminLogin = (username, password) => {
    // Frontend demo authentication credentials
    if (username.trim() === 'admin' && password === 'ironparadise') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      showToast('Admin logged in successfully! (Demo Mode)', 'success');
      return true;
    } else {
      showToast('Invalid credentials! Use demo login: admin / ironparadise', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    showToast('Admin logged out.', 'info');
  };

  // Site info
  const updateSiteInfo = (newInfo) => {
    setData((prev) => ({
      ...prev,
      siteInfo: { ...prev.siteInfo, ...newInfo },
    }));
    showToast('Website content saved successfully!', 'success');
  };

  // Plans CRUD
  const addPlan = (plan) => {
    const newPlan = {
      ...plan,
      id: 'plan-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      plans: [newPlan, ...prev.plans],
    }));
    showToast('New membership plan created!', 'success');
  };

  const updatePlan = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    }));
    showToast('Membership plan updated!', 'success');
  };

  const deletePlan = (id) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.filter((p) => p.id !== id),
    }));
    showToast('Membership plan deleted!', 'info');
  };

  // Trainers CRUD
  const addTrainer = (trainer) => {
    const newTrainer = {
      ...trainer,
      id: 'tr-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      trainers: [newTrainer, ...prev.trainers],
    }));
    showToast('New trainer profile added!', 'success');
  };

  const updateTrainer = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      trainers: prev.trainers.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
    }));
    showToast('Trainer profile updated!', 'success');
  };

  const deleteTrainer = (id) => {
    setData((prev) => ({
      ...prev,
      trainers: prev.trainers.filter((t) => t.id !== id),
    }));
    showToast('Trainer profile removed!', 'info');
  };

  // Gallery CRUD
  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery],
    }));
    showToast('Image added to gallery!', 'success');
  };

  const updateGalleryItem = (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
    }));
    showToast('Gallery item updated!', 'success');
  };

  const deleteGalleryItem = (id) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));
    showToast('Gallery item deleted!', 'info');
  };

  // Enquiries CRUD
  const addEnquiry = (enquiry) => {
    const newEnquiry = {
      ...enquiry,
      id: 'enq-' + Date.now(),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'New',
    };
    setData((prev) => ({
      ...prev,
      enquiries: [newEnquiry, ...prev.enquiries],
    }));
    showToast('Enquiry submitted successfully! We will connect soon.', 'success');
    return newEnquiry;
  };

  const updateEnquiryStatus = (id, status) => {
    setData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
    }));
    showToast(`Enquiry marked as ${status}!`, 'info');
  };

  const deleteEnquiry = (id) => {
    setData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.filter((e) => e.id !== id),
    }));
    showToast('Enquiry record deleted!', 'info');
  };

  // Settings
  const updateSettings = (newSettings) => {
    setData((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
    showToast('Settings saved successfully!', 'success');
  };

  // Restore defaults
  const resetToDefault = () => {
    setData(INITIAL_DATA);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    } catch (e) {
      console.error(e);
    }
    showToast('All website content restored to default demo templates!', 'info');
  };

  // Export JSON backup
  const exportDataJSON = () => {
    const exportString = JSON.stringify(data, null, 2);
    const blob = new Blob([exportString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iron_paradise_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup JSON exported successfully!', 'success');
  };

  // Import JSON backup
  const importDataJSON = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid JSON format');
      }
      if (!parsed.siteInfo || !parsed.plans || !parsed.trainers) {
        throw new Error('Missing core website keys in imported file');
      }
      setData({
        siteInfo: { ...INITIAL_DATA.siteInfo, ...(parsed.siteInfo || {}) },
        plans: Array.isArray(parsed.plans) ? parsed.plans : INITIAL_DATA.plans,
        trainers: Array.isArray(parsed.trainers) ? parsed.trainers : INITIAL_DATA.trainers,
        gallery: Array.isArray(parsed.gallery) ? parsed.gallery : INITIAL_DATA.gallery,
        enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : INITIAL_DATA.enquiries,
        settings: { ...INITIAL_DATA.settings, ...(parsed.settings || {}) },
      });
      showToast('Website content restored from backup file successfully!', 'success');
      return { success: true };
    } catch (err) {
      showToast(`Import failed: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Storage usage calculation
  const getStorageUsage = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || '';
      const bytes = new Blob([saved]).size;
      const kb = (bytes / 1024).toFixed(1);
      const maxKb = 5120; // 5MB standard limit
      const percentage = Math.min(100, ((bytes / (maxKb * 1024)) * 100).toFixed(1));
      return { bytes, kb, percentage };
    } catch {
      return { bytes: 0, kb: 0, percentage: 0 };
    }
  };

  return (
    <GymContext.Provider
      value={{
        data,
        siteInfo: data.siteInfo,
        plans: data.plans,
        trainers: data.trainers,
        gallery: data.gallery,
        enquiries: data.enquiries,
        settings: data.settings,
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
        updateGalleryItem,
        deleteGalleryItem,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        updateSettings,
        resetToDefault,
        exportDataJSON,
        importDataJSON,
        getStorageUsage,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
