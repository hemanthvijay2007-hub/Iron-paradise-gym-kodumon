import { getSupabaseClient, isCloudConfigured } from './supabaseClient';
import { INITIAL_DATA } from '../data/initialData';

const TABLE_SITE_INFO = 'gym_site_info';
const TABLE_PLANS = 'gym_plans';
const TABLE_TRAINERS = 'gym_trainers';
const TABLE_GALLERY = 'gym_gallery';
const TABLE_ENQUIRIES = 'gym_enquiries';
const TABLE_SETTINGS = 'gym_settings';

/**
 * Normalizes DB rows to application state structures
 */
const formatGalleryItem = (row) => ({
  id: row.id,
  title: row.title || '',
  category: row.category || 'Gym Floor',
  image: row.image || '',
  caption: row.caption || '',
  created_at: row.created_at,
});

const formatTrainer = (row) => ({
  id: row.id,
  name: row.name || '',
  role: row.role || '',
  specialties: Array.isArray(row.specialties)
    ? row.specialties
    : typeof row.specialties === 'string'
    ? row.specialties.split(',').map((s) => s.trim())
    : [],
  bio: row.bio || '',
  image: row.image || '',
});

const formatPlan = (row) => ({
  id: row.id,
  name: row.name || '',
  price: row.price || '',
  billing: row.billing || 'Monthly',
  badge: row.badge || '',
  isPopular: Boolean(row.is_popular),
  features: Array.isArray(row.features)
    ? row.features
    : typeof row.features === 'string'
    ? JSON.parse(row.features || '[]')
    : [],
  description: row.description || '',
});

const formatEnquiry = (row) => ({
  id: row.id,
  name: row.name || '',
  phone: row.phone || '',
  email: row.email || '',
  planInterest: row.plan_interest || '',
  message: row.message || '',
  date: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16) : row.date || '',
  status: row.status || 'New',
});

/**
 * Fetch all gym data from Supabase shared database
 */
export const fetchGymDataFromCloud = async () => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) {
    return null;
  }

  try {
    const [
      siteRes,
      plansRes,
      trainersRes,
      galleryRes,
      enquiriesRes,
      settingsRes,
    ] = await Promise.all([
      supabase.from(TABLE_SITE_INFO).select('*').limit(1).maybeSingle(),
      supabase.from(TABLE_PLANS).select('*').order('display_order', { ascending: true }),
      supabase.from(TABLE_TRAINERS).select('*').order('display_order', { ascending: true }),
      supabase.from(TABLE_GALLERY).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLE_ENQUIRIES).select('*').order('created_at', { ascending: false }),
      supabase.from(TABLE_SETTINGS).select('*').limit(1).maybeSingle(),
    ]);

    const hasData =
      Boolean(siteRes.data) ||
      (plansRes.data && plansRes.data.length > 0) ||
      (trainersRes.data && trainersRes.data.length > 0) ||
      (galleryRes.data && galleryRes.data.length > 0);

    if (!hasData) {
      // Cloud database connected but empty -> signal that seeding is available
      return {
        isEmpty: true,
        data: null,
      };
    }

    const cloudData = {
      siteInfo: siteRes.data ? { ...INITIAL_DATA.siteInfo, ...siteRes.data } : INITIAL_DATA.siteInfo,
      plans: plansRes.data && plansRes.data.length > 0 ? plansRes.data.map(formatPlan) : INITIAL_DATA.plans,
      trainers: trainersRes.data && trainersRes.data.length > 0 ? trainersRes.data.map(formatTrainer) : INITIAL_DATA.trainers,
      gallery: galleryRes.data && galleryRes.data.length > 0 ? galleryRes.data.map(formatGalleryItem) : INITIAL_DATA.gallery,
      enquiries: enquiriesRes.data && enquiriesRes.data.length > 0 ? enquiriesRes.data.map(formatEnquiry) : INITIAL_DATA.enquiries,
      settings: settingsRes.data ? { ...INITIAL_DATA.settings, ...settingsRes.data } : INITIAL_DATA.settings,
    };

    return {
      isEmpty: false,
      data: cloudData,
    };
  } catch (err) {
    console.error('Error fetching gym data from Supabase cloud:', err);
    return null;
  }
};

/**
 * Real-time changes subscription
 */
export const subscribeToGymChanges = (onUpdate) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return () => {};

  const channel = supabase
    .channel('gym-realtime-sync')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_GALLERY }, () => onUpdate('gallery'))
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_TRAINERS }, () => onUpdate('trainers'))
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_SITE_INFO }, () => onUpdate('siteInfo'))
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_PLANS }, () => onUpdate('plans'))
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE_ENQUIRIES }, () => onUpdate('enquiries'))
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};

/**
 * Site Info Cloud Operations
 */
export const saveSiteInfoToCloud = async (siteInfo) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const payload = {
    id: 1,
    gym_name: siteInfo.gymName,
    phone: siteInfo.phone,
    whatsapp_number: siteInfo.whatsappNumber,
    instagram_url: siteInfo.instagramUrl,
    location_url: siteInfo.locationUrl,
    address_placeholder: siteInfo.addressPlaceholder,
    hours_placeholder: siteInfo.hoursPlaceholder,
    hero_headline: siteInfo.heroHeadline,
    hero_tagline: siteInfo.heroTagline,
    about_heading: siteInfo.aboutHeading,
    about_text: siteInfo.aboutText,
    about_mission: siteInfo.aboutMission,
    about_vision: siteInfo.aboutVision,
    facilities_note: siteInfo.facilitiesNote,
    notice_banner: siteInfo.noticeBanner,
    show_notice_banner: siteInfo.showNoticeBanner,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_SITE_INFO).upsert(payload, { onConflict: 'id' });
  if (error) {
    console.error('Failed to save siteInfo to cloud:', error);
    throw error;
  }
  return true;
};

/**
 * Trainers Cloud Operations
 */
export const addTrainerToCloud = async (trainer) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    id: trainer.id,
    name: trainer.name,
    role: trainer.role,
    specialties: trainer.specialties || [],
    bio: trainer.bio || '',
    image: trainer.image,
    display_order: Date.now(),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_TRAINERS).insert(row);
  if (error) throw error;
  return true;
};

export const updateTrainerInCloud = async (id, updatedFields) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    ...(updatedFields.name !== undefined && { name: updatedFields.name }),
    ...(updatedFields.role !== undefined && { role: updatedFields.role }),
    ...(updatedFields.specialties !== undefined && { specialties: updatedFields.specialties }),
    ...(updatedFields.bio !== undefined && { bio: updatedFields.bio }),
    ...(updatedFields.image !== undefined && { image: updatedFields.image }),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_TRAINERS).update(row).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteTrainerFromCloud = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const { error } = await supabase.from(TABLE_TRAINERS).delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Gallery Cloud Operations
 */
export const addGalleryItemToCloud = async (item) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    id: item.id,
    title: item.title,
    category: item.category,
    image: item.image,
    caption: item.caption || '',
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_GALLERY).insert(row);
  if (error) throw error;
  return true;
};

export const updateGalleryItemInCloud = async (id, updatedFields) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    ...(updatedFields.title !== undefined && { title: updatedFields.title }),
    ...(updatedFields.category !== undefined && { category: updatedFields.category }),
    ...(updatedFields.image !== undefined && { image: updatedFields.image }),
    ...(updatedFields.caption !== undefined && { caption: updatedFields.caption }),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_GALLERY).update(row).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteGalleryItemFromCloud = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const { error } = await supabase.from(TABLE_GALLERY).delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Plans Cloud Operations
 */
export const addPlanToCloud = async (plan) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    id: plan.id,
    name: plan.name,
    price: plan.price,
    billing: plan.billing,
    badge: plan.badge || '',
    is_popular: plan.isPopular,
    features: plan.features || [],
    description: plan.description || '',
    display_order: Date.now(),
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_PLANS).insert(row);
  if (error) throw error;
  return true;
};

export const updatePlanInCloud = async (id, updatedFields) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    ...(updatedFields.name !== undefined && { name: updatedFields.name }),
    ...(updatedFields.price !== undefined && { price: updatedFields.price }),
    ...(updatedFields.billing !== undefined && { billing: updatedFields.billing }),
    ...(updatedFields.badge !== undefined && { badge: updatedFields.badge }),
    ...(updatedFields.isPopular !== undefined && { is_popular: updatedFields.isPopular }),
    ...(updatedFields.features !== undefined && { features: updatedFields.features }),
    ...(updatedFields.description !== undefined && { description: updatedFields.description }),
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_PLANS).update(row).eq('id', id);
  if (error) throw error;
  return true;
};

export const deletePlanFromCloud = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const { error } = await supabase.from(TABLE_PLANS).delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Enquiries Cloud Operations
 */
export const addEnquiryToCloud = async (enquiry) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const row = {
    id: enquiry.id,
    name: enquiry.name,
    phone: enquiry.phone,
    email: enquiry.email || '',
    plan_interest: enquiry.planInterest || '',
    message: enquiry.message || '',
    status: enquiry.status || 'New',
    created_at: new Date().toISOString(),
  };

  const { error } = await supabase.from(TABLE_ENQUIRIES).insert(row);
  if (error) throw error;
  return true;
};

export const updateEnquiryStatusInCloud = async (id, status) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const { error } = await supabase.from(TABLE_ENQUIRIES).update({ status }).eq('id', id);
  if (error) throw error;
  return true;
};

export const deleteEnquiryFromCloud = async (id) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) return false;

  const { error } = await supabase.from(TABLE_ENQUIRIES).delete().eq('id', id);
  if (error) throw error;
  return true;
};

/**
 * Seed initial gym data into Supabase Cloud
 */
export const seedInitialDataToCloud = async (data = INITIAL_DATA) => {
  const supabase = getSupabaseClient();
  if (!supabase || !isCloudConfigured()) {
    throw new Error('Supabase cloud is not configured.');
  }

  // 1. Seed Site Info
  await saveSiteInfoToCloud(data.siteInfo);

  // 2. Seed Plans
  if (data.plans && data.plans.length > 0) {
    const planRows = data.plans.map((p, idx) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      billing: p.billing,
      badge: p.badge || '',
      is_popular: p.isPopular,
      features: p.features || [],
      description: p.description || '',
      display_order: idx + 1,
    }));
    await supabase.from(TABLE_PLANS).upsert(planRows, { onConflict: 'id' });
  }

  // 3. Seed Trainers
  if (data.trainers && data.trainers.length > 0) {
    const trainerRows = data.trainers.map((t, idx) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      specialties: t.specialties || [],
      bio: t.bio || '',
      image: t.image,
      display_order: idx + 1,
    }));
    await supabase.from(TABLE_TRAINERS).upsert(trainerRows, { onConflict: 'id' });
  }

  // 4. Seed Gallery
  if (data.gallery && data.gallery.length > 0) {
    const galleryRows = data.gallery.map((g, idx) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      image: g.image,
      caption: g.caption || '',
      display_order: idx + 1,
    }));
    await supabase.from(TABLE_GALLERY).upsert(galleryRows, { onConflict: 'id' });
  }

  return true;
};
