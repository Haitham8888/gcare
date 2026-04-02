import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Global Asset Helper for ImageKit
const IK_BASE = 'https://ik.imagekit.io/gcare/'

export const getAssetUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Normalize path: remove leading / or ./ or BASE_URL
    let cleanPath = path.replace(/^\.?\//, '');
    const baseUrl = import.meta.env.BASE_URL;
    if (baseUrl && baseUrl !== '/' && cleanPath.startsWith(baseUrl.replace(/^\//, ''))) {
        cleanPath = cleanPath.substring(baseUrl.length - 1);
    }

    // Keep local video assets on the site origin (ImageKit does not host these paths)
    if (cleanPath.startsWith('static/vid/')) {
        const normalizedBase = baseUrl && baseUrl !== '/' ? baseUrl : '/';
        return `${normalizedBase}${cleanPath}`;
    }

    // Handle specific ImageKit sanitization (spaces to underscores)
    // and decode URI components if they were already encoded in source
    let finalPath = decodeURIComponent(cleanPath).replace(/ /g, '_');

    return `${IK_BASE}${finalPath}`;
}
