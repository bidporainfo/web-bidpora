// Supabase client bootstrap
// Isi env berikut sesuai project Anda
// Cara mendapatkan: Project Settings -> API
const SUPABASE_URL = window.SUPABASE_URL || 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_ANON_PUBLIC_KEY';

// Inisialisasi hanya sekali
if (!window.supabase) {
    // muat script supabase dari CDN jika belum ada
    // asumsi Chart.js sudah terpisah; kita fokus Supabase
}

// Helper async untuk memastikan supabase client tersedia
async function getSupabaseClient() {
    if (window.supabase) return window.supabase;
    await loadSupabaseCdn();
    window.supabase = window.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return window.supabase;
}

function loadSupabaseCdn() {
    return new Promise((resolve, reject) => {
        if (window.createClient) return resolve();
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Gagal memuat Supabase JS'));
        document.head.appendChild(script);
    });
}

// Auth helpers
async function getCurrentSession() {
    const sb = await getSupabaseClient();
    const { data } = await sb.auth.getSession();
    return data.session || null;
}

async function requireAdminOrRedirect(loginUrl) {
    const session = await getCurrentSession();
    if (!session) {
        window.location.href = loginUrl;
        return null;
    }
    const user = session.user;
    // opsional: periksa claim/role dari user metadata
    const role = user.user_metadata?.role || 'admin';
    if (role !== 'admin') {
        window.location.href = loginUrl;
        return null;
    }
    return { session, user, role };
}

async function signOutAndGo(url) {
    const sb = await getSupabaseClient();
    await sb.auth.signOut();
    window.location.href = url;
}

window.__supabase_helpers__ = {
    getSupabaseClient,
    getCurrentSession,
    requireAdminOrRedirect,
    signOutAndGo,
};


