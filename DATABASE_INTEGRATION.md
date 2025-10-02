# Integrasi Database dengan Website SIMPORA

## Tentang Data Dummy vs Database Real

### Data Saat Ini (Dummy)
Website saat ini menggunakan data dummy yang sudah di-hardcode dalam HTML. Data ini meliputi:
- Berita terbaru (3 artikel)
- Kalender kegiatan
- Perolehan medali
- Jadwal pertandingan
- Hasil pertandingan

### Integrasi dengan Supabase

Ketika Anda mengintegrasikan dengan Supabase, desain website akan **tetap sama** karena:

1. **Struktur HTML sudah fixed** - Layout dan styling tidak akan berubah
2. **Hanya data yang berubah** - Dari hardcoded menjadi dynamic dari database
3. **JavaScript akan mengambil data** dari Supabase API

## Struktur Database yang Disarankan

### 1. Tabel `berita`
```sql
CREATE TABLE berita (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255),
  konten TEXT,
  gambar_url VARCHAR(255),
  tanggal DATE,
  lokasi VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. Tabel `kegiatan`
```sql
CREATE TABLE kegiatan (
  id SERIAL PRIMARY KEY,
  nama_kegiatan VARCHAR(255),
  tanggal DATE,
  waktu TIME,
  lokasi VARCHAR(255),
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Tabel `medali`
```sql
CREATE TABLE medali (
  id SERIAL PRIMARY KEY,
  jenis_medali VARCHAR(20), -- 'emas', 'perak', 'perunggu'
  jumlah INTEGER,
  cabang_olahraga VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Tabel `jadwal_pertandingan`
```sql
CREATE TABLE jadwal_pertandingan (
  id SERIAL PRIMARY KEY,
  cabang_olahraga VARCHAR(100),
  tim_1 VARCHAR(100),
  tim_2 VARCHAR(100),
  tanggal DATE,
  waktu TIME,
  venue VARCHAR(255),
  status VARCHAR(20) DEFAULT 'belum_dimulai'
);
```

### 5. Tabel `hasil_pertandingan`
```sql
CREATE TABLE hasil_pertandingan (
  id SERIAL PRIMARY KEY,
  cabang_olahraga VARCHAR(100),
  tim_1 VARCHAR(100),
  tim_2 VARCHAR(100),
  skor_1 INTEGER,
  skor_2 INTEGER,
  pemenang VARCHAR(100),
  tanggal DATE,
  status VARCHAR(20) -- 'menang', 'kalah', 'seri'
);
```

## Cara Mengintegrasikan

### 1. Setup Supabase
```javascript
// assets/js/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'
export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 2. Fetch Data Berita
```javascript
// assets/js/news.js
async function loadBerita() {
  const { data, error } = await supabase
    .from('berita')
    .select('*')
    .order('tanggal', { ascending: false })
    .limit(3)
  
  if (data) {
    renderBerita(data)
  }
}

function renderBerita(beritaList) {
  const container = document.querySelector('.news-cards-container')
  container.innerHTML = beritaList.map(berita => `
    <div class="news-card-latest">
      <div class="news-image">
        <img src="${berita.gambar_url}" alt="${berita.judul}">
      </div>
      <div class="news-content">
        <h4>${berita.judul}</h4>
        <div class="news-meta">${formatDate(berita.tanggal)} | ${berita.lokasi}</div>
        <p>${berita.konten}</p>
      </div>
    </div>
  `).join('')
}
```

### 3. Fetch Data Medali
```javascript
async function loadMedali() {
  const { data, error } = await supabase
    .from('medali')
    .select('*')
  
  if (data) {
    renderMedali(data)
  }
}

function renderMedali(medaliList) {
  const emas = medaliList.find(m => m.jenis_medali === 'emas')?.jumlah || 0
  const perak = medaliList.find(m => m.jenis_medali === 'perak')?.jumlah || 0
  const perunggu = medaliList.find(m => m.jenis_medali === 'perunggu')?.jumlah || 0
  
  document.querySelector('.medal-card.gold .medal-count').textContent = emas
  document.querySelector('.medal-card.silver .medal-count').textContent = perak
  document.querySelector('.medal-card.bronze .medal-count').textContent = perunggu
}
```

## Keuntungan Integrasi Database

1. **Data Real-time** - Update otomatis tanpa edit kode
2. **Admin Panel** - Bisa buat dashboard admin untuk CRUD data
3. **Scalable** - Mudah tambah fitur baru
4. **SEO Friendly** - Data bisa di-crawl search engine
5. **Performance** - Caching dan optimization

## Langkah Selanjutnya

1. **Setup Supabase project**
2. **Buat tabel sesuai struktur di atas**
3. **Generate API keys**
4. **Update JavaScript untuk fetch data**
5. **Test dengan data real**
6. **Deploy ke GitHub Pages**

Desain website akan tetap sama, hanya datanya yang menjadi dynamic! 🚀
