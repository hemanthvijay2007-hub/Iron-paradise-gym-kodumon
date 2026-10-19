import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_DATA } from '../data/initialData';
import { isCloudConfigured, saveRuntimeCloudConfig, clearRuntimeCloudConfig } from '../services/supabaseClient';
import {
  fetchGymDataFromCloud,
  subscribeToGymChanges,
  saveSiteInfoToCloud,
  addTrainerToCloud,
  updateTrainerInCloud,
  deleteTrainerFromCloud,
  addGalleryItemToCloud,
  updateGalleryItemInCloud,
  deleteGalleryItemFromCloud,
  addPlanToCloud,
  updatePlanInCloud,
  deletePlanFromCloud,
  addEnquiryToCloud,
  updateEnquiryStatusInCloud,
  deleteEnquiryFromCloud,
  seedInitialDataToCloud,
} from '../services/gymService';

const STORAGE_KEY = 'iron_paradise_storage_v1';
const ADMIN_AUTH_KEY = 'iron_paradise_admin_session';

const GymContext = createContext(null);

export const GymProvider = ({ children }) => {
  // Load initial data from localStorage or fallback to INITIAL_DATA
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
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

  // Admin session state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  });

  // Cloud status state
  const [isCloudActive, setIsCloudActive] = useState(() => isCloudConfigured());
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSync, setLastCloudSync] = useState(null);
  const [cloudError, setCloudError] = useState(null);

  // Toast notification state
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync data to localStorage cache whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }, [data]);

  // Pull latest data from Supabase Cloud
  const refreshFromCloud = useCallback(async (isInitial = false) => {
    if (!isCloudConfigured()) {
      setIsCloudActive(false);
      return;
    }

    setIsCloudSyncing(true);
    setCloudError(null);

    try {
      const res = await fetchGymDataFromCloud();
      if (res && res.data) {
        setData(res.data);
        setIsCloudActive(true);
        setLastCloudSync(new Date().toLocaleTimeString());
        if (!isInitial) {
          showToast('Synced latest content from shared cloud database!', 'success');
        }
      } else if (res && res.isEmpty) {
        // Connected to Supabase, but tables are not yet seeded
        setIsCloudActive(true);
        setLastCloudSync(new Date().toLocaleTimeString());
        console.info('Cloud database is connected but empty. Ready to seed initial data.');
      }
    } catch (err) {
      console.error('Failed to sync from cloud:', err);
      setCloudError(err.message);
    } finally {
      setIsCloudSyncing(false);
    }
  }, [showToast]);

  // Initialize Cloud Sync & Realtime Subscription on Mount
  useEffect(() => {
    let isMounted = true;

    const initCloud = async () => {
      if (isMounted) {
        await refreshFromCloud(true);
      }
    };

    initCloud();

    // Subscribe to multi-device real-time updates
    const unsubscribe = subscribeToGymChanges((tableName) => {
      console.log(`[Realtime Sync] Detected change in ${tableName}, updating state...`);
      if (isMounted) {
        refreshFromCloud(false);
      }
    });

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [refreshFromCloud]);

  // Push local state to cloud (Seed / Initial Sync)
  const syncAllToCloud = async () => {
    if (!isCloudConfigured()) {
      showToast('Please configure your Supabase Project URL and Anon Key first.', 'error');
      return false;
    }
    setIsCloudSyncing(true);
    try {
      await seedInitialDataToCloud(data);
      showToast('All gym data successfully seeded and synced to Supabase Cloud!', 'success');
      setIsCloudActive(true);
      setLastCloudSync(new Date().toLocaleTimeString());
      return true;
    } catch (err) {
      console.error('Error seeding data to cloud:', err);
      showToast(`Cloud sync failed: ${err.message}`, 'error');
      return false;
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Configure runtime cloud credentials
  const configureCloudCredentials = async (url, anonKey) => {
    try {
      saveRuntimeCloudConfig(url, anonKey);
      setIsCloudActive(true);
      showToast('Cloud credentials saved! Testing connection...', 'info');
      await refreshFromCloud(false);
      showToast('Connected to Supabase shared cloud database & storage!', 'success');
      return true;
    } catch (err) {
      showToast(`Connection failed: ${err.message}`, 'error');
      return false;
    }
  };

  const clearCloudCredentials = () => {
    clearRuntimeCloudConfig();
    setIsCloudActive(false);
    showToast('Cloud credentials cleared. Operating in local mode.', 'info');
  };

  // Admin login / logout
  const adminLogin = (username, password) => {
    if (username.trim() === 'admin' && password === 'ironparadise') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      showToast('Admin logged in successfully!', 'success');
      return true;
    } else {
      showToast('Invalid credentials! Default: admin / ironparadise', 'error');
      return false;
    }
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    showToast('Admin logged out.', 'info');
  };

  // Site info
  const updateSiteInfo = async (newInfo) => {
    const updated = { ...data.siteInfo, ...newInfo };
    setData((prev) => ({
      ...prev,
      siteInfo: updated,
    }));

    if (isCloudConfigured()) {
      try {
        await saveSiteInfoToCloud(updated);
        showToast('Website content saved to Cloud Database & visible to all visitors!', 'success');
        setLastCloudSync(new Date().toLocaleTimeString());
        return;
      } catch (err) {
        console.error('Cloud save failed:', err);
        showToast(`Saved locally. Cloud sync warning: ${err.message}`, 'error');
        return;
      }
    }
    showToast('Website content saved locally! (Connect Supabase for multi-device sync)', 'success');
  };

  // Plans CRUD
  const addPlan = async (plan) => {
    const newPlan = {
      ...plan,
      id: 'plan-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      plans: [newPlan, ...prev.plans],
    }));

    if (isCloudConfigured()) {
      try {
        await addPlanToCloud(newPlan);
        showToast('New membership plan saved to Cloud Database!', 'success');
        return;
      } catch (err) {
        console.error('Cloud plan save error:', err);
      }
    }
    showToast('New membership plan created!', 'success');
  };

  const updatePlan = async (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)),
    }));

    if (isCloudConfigured()) {
      try {
        await updatePlanInCloud(id, updatedFields);
        showToast('Membership plan updated in Cloud Database!', 'success');
        return;
      } catch (err) {
        console.error('Cloud plan update error:', err);
      }
    }
    showToast('Membership plan updated!', 'success');
  };

  const deletePlan = async (id) => {
    setData((prev) => ({
      ...prev,
      plans: prev.plans.filter((p) => p.id !== id),
    }));

    if (isCloudConfigured()) {
      try {
        await deletePlanFromCloud(id);
        showToast('Membership plan deleted from Cloud Database!', 'info');
        return;
      } catch (err) {
        console.error('Cloud plan delete error:', err);
      }
    }
    showToast('Membership plan deleted!', 'info');
  };

  // Trainers CRUD
  const addTrainer = async (trainer) => {
    const newTrainer = {
      ...trainer,
      id: 'tr-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      trainers: [newTrainer, ...prev.trainers],
    }));

    if (isCloudConfigured()) {
      try {
        await addTrainerToCloud(newTrainer);
        showToast('Trainer profile & image saved to Cloud! Visible on all devices.', 'success');
        setLastCloudSync(new Date().toLocaleTimeString());
        return;
      } catch (err) {
        console.error('Cloud trainer save error:', err);
        showToast(`Saved locally. Cloud sync warning: ${err.message}`, 'error');
        return;
      }
    }
    showToast('New trainer profile added!', 'success');
  };

  const updateTrainer = async (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      trainers: prev.trainers.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
    }));

    if (isCloudConfigured()) {
      try {
        await updateTrainerInCloud(id, updatedFields);
        showToast('Trainer profile updated in Cloud! Visible across all devices.', 'success');
        setLastCloudSync(new Date().toLocaleTimeString());
        return;
      } catch (err) {
        console.error('Cloud trainer update error:', err);
        showToast(`Saved locally. Cloud sync warning: ${err.message}`, 'error');
        return;
      }
    }
    showToast('Trainer profile updated!', 'success');
  };

  const deleteTrainer = async (id) => {
    setData((prev) => ({
      ...prev,
      trainers: prev.trainers.filter((t) => t.id !== id),
    }));

    if (isCloudConfigured()) {
      try {
        await deleteTrainerFromCloud(id);
        showToast('Trainer profile removed from Cloud Database!', 'info');
        return;
      } catch (err) {
        console.error('Cloud trainer delete error:', err);
      }
    }
    showToast('Trainer profile removed!', 'info');
  };

  // Gallery CRUD
  const addGalleryItem = async (item) => {
    const newItem = {
      ...item,
      id: 'gal-' + Date.now(),
    };
    setData((prev) => ({
      ...prev,
      gallery: [newItem, ...prev.gallery],
    }));

    if (isCloudConfigured()) {
      try {
        await addGalleryItemToCloud(newItem);
        showToast('Gallery image saved to Cloud Storage & Database! Live on all devices.', 'success');
        setLastCloudSync(new Date().toLocaleTimeString());
        return;
      } catch (err) {
        console.error('Cloud gallery save error:', err);
        showToast(`Saved locally. Cloud sync warning: ${err.message}`, 'error');
        return;
      }
    }
    showToast('Image added to gallery!', 'success');
  };

  const updateGalleryItem = async (id, updatedFields) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((g) => (g.id === id ? { ...g, ...updatedFields } : g)),
    }));

    if (isCloudConfigured()) {
      try {
        await updateGalleryItemInCloud(id, updatedFields);
        showToast('Gallery item updated in Cloud Database!', 'success');
        setLastCloudSync(new Date().toLocaleTimeString());
        return;
      } catch (err) {
        console.error('Cloud gallery update error:', err);
      }
    }
    showToast('Gallery item updated!', 'success');
  };

  const deleteGalleryItem = async (id) => {
    setData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((g) => g.id !== id),
    }));

    if (isCloudConfigured()) {
      try {
        await deleteGalleryItemFromCloud(id);
        showToast('Gallery item removed from Cloud Database!', 'info');
        return;
      } catch (err) {
        console.error('Cloud gallery delete error:', err);
      }
    }
    showToast('Gallery item deleted!', 'info');
  };

  // Enquiries CRUD
  const addEnquiry = async (enquiry) => {
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

    if (isCloudConfigured()) {
      try {
        await addEnquiryToCloud(newEnquiry);
      } catch (err) {
        console.error('Cloud enquiry save error:', err);
      }
    }
    showToast('Enquiry submitted successfully! We will connect soon.', 'success');
    return newEnquiry;
  };

  const updateEnquiryStatus = async (id, status) => {
    setData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.map((e) => (e.id === id ? { ...e, status } : e)),
    }));

    if (isCloudConfigured()) {
      try {
        await updateEnquiryStatusInCloud(id, status);
      } catch (err) {
        console.error('Cloud enquiry update error:', err);
      }
    }
    showToast(`Enquiry marked as ${status}!`, 'info');
  };

  const deleteEnquiry = async (id) => {
    setData((prev) => ({
      ...prev,
      enquiries: prev.enquiries.filter((e) => e.id !== id),
    }));

    if (isCloudConfigured()) {
      try {
        await deleteEnquiryFromCloud(id);
      } catch (err) {
        console.error('Cloud enquiry delete error:', err);
      }
    }
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
      showToast('Backup restored successfully!', 'success');
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
        // Cloud Sync Features
        isCloudActive,
        isCloudSyncing,
        lastCloudSync,
        cloudError,
        refreshFromCloud,
        syncAllToCloud,
        configureCloudCredentials,
        clearCloudCredentials,
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
