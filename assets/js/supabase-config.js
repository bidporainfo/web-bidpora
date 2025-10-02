// Konfigurasi Supabase untuk BIDPORA Web App
// Ganti dengan URL dan Key Supabase Anda

const SUPABASE_CONFIG = {
    // Ganti dengan URL project Supabase Anda
    url: 'https://your-project.supabase.co',
    
    // Ganti dengan Anon Key Supabase Anda
    anonKey: 'your-anon-key-here'
};

// Cara mendapatkan URL dan Key:
// 1. Buka https://supabase.com
// 2. Login dan buat project baru
// 3. Go to Settings > API
// 4. Copy Project URL dan anon public key
// 5. Ganti nilai di atas

// Contoh:
// url: 'https://abcdefghijklmnop.supabase.co',
// anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxOTUwMTQzODkwfQ.example'

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
} else {
    window.SUPABASE_CONFIG = SUPABASE_CONFIG;
}
