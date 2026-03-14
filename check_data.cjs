
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function check() {
    console.log("Checking RLS Policies...");
    try {
        const { data: p, error: pe } = await supabase.from('products').select('*');
        const { data: d, error: de } = await supabase.from('doctors').select('*');
        
        console.log('Products Count:', p ? p.length : 0);
        if (pe) console.log('Products Error:', pe.message);
        
        console.log('Doctors Count:', d ? d.length : 0);
        if (de) console.log('Doctors Error:', de.message);

        // Try to fetch something very basic
        const { data: profiles, error: prErr } = await supabase.from('profiles').select('*');
        console.log('Profiles Count:', profiles ? profiles.length : 0);
        if (prErr) console.log('Profiles Error:', prErr.message);

    } catch (err) {
        console.error("Critical Error:", err);
    }
}

check();
