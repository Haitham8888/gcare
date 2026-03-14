import { createClient } from '@supabase/supabase-js'

const FALLBACK_URL = 'https://jszubagkmmrjafseooft.supabase.co'
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzenViYWdrbW1yamFmc2Vvb2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODgxNTksImV4cCI6MjA4OTA2NDE1OX0.nACXUTHiizApwFZt1rarTFKj05rOm1TCwZGz0f6LUiE'

const getSetting = (key, fallback) => {
    const v = import.meta.env[key];
    if (!v || v === "" || v.includes("VITE_") || v.includes("${{")) return fallback;
    return v;
}

const supabaseUrl = getSetting('VITE_SUPABASE_URL', FALLBACK_URL)
const supabaseKey = getSetting('VITE_SUPABASE_ANON_KEY', FALLBACK_KEY)

export const supabase = createClient(supabaseUrl, supabaseKey)

// Global Asset Helper for ImageKit
const IK_BASE = 'https://ik.imagekit.io/gcare/'

export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // Normalize path: remove leading / or ./ or BASE_URL
    let cleanPath = path.replace(/^\.?\//, '');
    const baseUrl = import.meta.env.BASE_URL;
    if (baseUrl && baseUrl !== '/' && cleanPath.startsWith(baseUrl.replace(/^\//,''))) {
        cleanPath = cleanPath.substring(baseUrl.length - 1);
    }
    
    // Handle specific ImageKit sanitization (spaces to underscores)
    // and decode URI components if they were already encoded in source
    let finalPath = decodeURIComponent(cleanPath).replace(/ /g, '_');
    
    return `${IK_BASE}${finalPath}`;
}
