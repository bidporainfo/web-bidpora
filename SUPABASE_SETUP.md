# Setup Supabase untuk DISPORA Web App

## Mengapa Supabase?

- ✅ **Gratis** - 500MB database, 50MB file storage
- ✅ **Real-time** - Data update otomatis antar user
- ✅ **Easy setup** - Tinggal daftar dan dapat API key
- ✅ **PostgreSQL** - Database yang powerful
- ✅ **Compatible dengan GitHub Pages** - Frontend tetap di GitHub Pages

## Langkah Setup

### 1. Daftar Supabase
1. Buka https://supabase.com
2. Klik "Start your project"
3. Login dengan GitHub
4. Buat project baru

### 2. Setup Database
```sql
-- Jalankan di SQL Editor Supabase
CREATE TABLE dashboard_data (
  id SERIAL PRIMARY KEY,
  atlet INTEGER DEFAULT 180,
  tenaga INTEGER DEFAULT 54,
  cabor INTEGER DEFAULT 67,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert data default
INSERT INTO dashboard_data (id, atlet, tenaga, cabor) 
VALUES (1, 180, 54, 67);

-- Enable Row Level Security (RLS)
ALTER TABLE dashboard_data ENABLE ROW LEVEL SECURITY;

-- Create policy untuk allow all (untuk demo)
CREATE POLICY "Allow all operations" ON dashboard_data
FOR ALL USING (true);
```

### 3. Dapatkan API Keys
1. Go to Settings > API
2. Copy:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 4. Update Kode

#### A. Tambahkan Supabase ke HTML
```html
<!-- Tambahkan sebelum closing </body> -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://your-project.supabase.co'
  const SUPABASE_ANON_KEY = 'your-anon-key'
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
</script>
```

#### B. Update DashboardManager
```javascript
class DashboardManager {
  constructor() {
    this.dashboardData = {
      atlet: 180,
      tenaga: 54,
      cabor: 67
    };
    this.init();
  }

  async init() {
    await this.loadDashboardData();
    this.setupEventListeners();
    this.updateDashboardDisplay();
  }

  async loadDashboardData() {
    try {
      const { data, error } = await supabase
        .from('dashboard_data')
        .select('*')
        .eq('id', 1)
        .single();
      
      if (data) {
        this.dashboardData = {
          atlet: data.atlet,
          tenaga: data.tenaga,
          cabor: data.cabor
        };
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async saveDashboard() {
    try {
      const { error } = await supabase
        .from('dashboard_data')
        .upsert({
          id: 1,
          atlet: parseInt(document.getElementById('dashboard-atlet').value),
          tenaga: parseInt(document.getElementById('dashboard-tenaga').value),
          cabor: parseInt(document.getElementById('dashboard-cabor').value),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      this.updateDashboardDisplay();
      this.hideForm();
      this.showNotification('Data dashboard berhasil diperbarui!', 'success');
    } catch (error) {
      console.error('Error saving dashboard data:', error);
      this.showNotification('Gagal menyimpan data!', 'error');
    }
  }
}
```

## Deployment ke GitHub Pages

### 1. Push ke GitHub
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

### 2. Enable GitHub Pages
1. Go to repository Settings
2. Scroll to "Pages" section
3. Source: Deploy from a branch
4. Branch: main
5. Folder: / (root)

### 3. Update Supabase URL
Setelah deploy, update URL di Supabase:
1. Go to Settings > API
2. Add your GitHub Pages URL ke "Site URL"
3. Add `https://your-username.github.io/web-simpora` ke "Redirect URLs"

## Testing

1. **Local**: `http://localhost/web-simpora/dashboard.html`
2. **Production**: `https://your-username.github.io/web-simpora/dashboard.html`

Data akan tersinkron antara local dan production!

## Troubleshooting

### Error: "Invalid API key"
- Pastikan API key benar
- Pastikan project URL benar

### Error: "Row Level Security"
- Pastikan policy sudah dibuat
- Pastikan RLS policy allow operations

### Error: "Network error"
- Pastikan Supabase project aktif
- Check browser console untuk detail error

## Keuntungan Setup Ini

1. **Data Global** - Semua user melihat data yang sama
2. **Real-time** - Perubahan langsung terlihat di semua browser
3. **Persistent** - Data tidak hilang saat refresh
4. **Scalable** - Bisa handle banyak user
5. **Free** - Tidak ada biaya hosting

## Next Steps

1. Setup Supabase project
2. Update kode dengan Supabase
3. Test local
4. Deploy ke GitHub Pages
5. Test production

Data CRUD sekarang akan tersimpan di database Supabase dan tersinkron di semua device! 🚀
