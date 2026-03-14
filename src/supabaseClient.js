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

console.log('Supabase Connection:', { url: supabaseUrl, hasKey: !!supabaseKey });

export const supabase = createClient(supabaseUrl, supabaseKey)
