import { createClient } from '@supabase/supabase-js'

// Hardcoded for public access because GitHub Secrets might be missing in build environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://jszubagkmmrjafseooft.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpzenViYWdrbW1yamFmc2Vvb2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0ODgxNTksImV4cCI6MjA4OTA2NDE1OX0.nACXUTHiizApwFZt1rarTFKj05rOm1TCwZGz0f6LUiE'

export const supabase = createClient(supabaseUrl, supabaseKey)
