import { createClient } from '@supabase/supabase-js';

const RUNTIME_CONFIG_KEY = 'iron_paradise_cloud_config';

/**
 * Retrieves the active Supabase credentials from either Vite environment
 * variables (e.g. on Vercel deployment) or runtime configuration set via the Admin Panel.
 */
export const getActiveCredentials = () => {
  // 1. Check Vite environment variables (primary for production Vercel deployment)
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (envUrl && envKey) {
    return {
      url: envUrl,
      anonKey: envKey,
      source: 'env',
    };
  }

  // 2. Check runtime configuration stored by Admin in browser
  try {
    const saved = localStorage.getItem(RUNTIME_CONFIG_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.url && parsed.anonKey) {
        return {
          url: parsed.url.trim(),
          anonKey: parsed.anonKey.trim(),
          source: 'runtime',
        };
      }
    }
  } catch (e) {
    console.warn('Error reading runtime cloud config:', e);
  }

  return {
    url: '',
    anonKey: '',
    source: 'none',
  };
};

// Singleton client instance
let clientInstance = null;
let currentUrl = '';
let currentKey = '';

export const getSupabaseClient = () => {
  const { url, anonKey } = getActiveCredentials();

  if (!url || !anonKey) {
    return null;
  }

  if (!clientInstance || currentUrl !== url || currentKey !== anonKey) {
    clientInstance = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    currentUrl = url;
    currentKey = anonKey;
  }

  return clientInstance;
};

export const isCloudConfigured = () => {
  const { url, anonKey } = getActiveCredentials();
  return Boolean(url && anonKey);
};

export const saveRuntimeCloudConfig = (url, anonKey) => {
  if (!url || !anonKey) {
    throw new Error('Please provide both Supabase Project URL and Anon Key.');
  }
  localStorage.setItem(
    RUNTIME_CONFIG_KEY,
    JSON.stringify({
      url: url.trim(),
      anonKey: anonKey.trim(),
      updatedAt: new Date().toISOString(),
    })
  );
  // Re-instantiate client
  clientInstance = null;
  return getSupabaseClient();
};

export const clearRuntimeCloudConfig = () => {
  localStorage.removeItem(RUNTIME_CONFIG_KEY);
  clientInstance = null;
};
