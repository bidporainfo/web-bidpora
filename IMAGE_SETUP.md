# Setup Gambar untuk Website BIDPORA

## Gambar yang Dibutuhkan

### 1. Gambar Berita (300x200px)
Simpan di folder `assets/images/`:

- `pomnas-ceremony.jpg` - Upacara penutupan POMNAS
- `basketball-championship.jpg` - Kejuaraan basket
- `karate-competition.jpg` - Kompetisi karate
- `swimming-competition.jpg` - Kompetisi renang
- `football-match.jpg` - Pertandingan sepak bola
- `athletics-competition.jpg` - Kompetisi atletik

### 2. Sumber Gambar Gratis

#### Unsplash (Recommended)
- https://unsplash.com/s/photos/sports-ceremony
- https://unsplash.com/s/photos/basketball-game
- https://unsplash.com/s/photos/karate-competition
- https://unsplash.com/s/photos/swimming-competition
- https://unsplash.com/s/photos/football-match
- https://unsplash.com/s/photos/athletics-competition

#### Pexels
- https://www.pexels.com/search/sports%20competition/
- https://www.pexels.com/search/basketball/
- https://www.pexels.com/search/martial%20arts/

#### Pixabay
- https://pixabay.com/images/search/sports%20competition/

## Cara Download dan Setup

### 1. Download Gambar
```bash
# Contoh menggunakan wget (jika ada)
wget -O assets/images/pomnas-ceremony.jpg "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop"
wget -O assets/images/basketball-championship.jpg "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=300&h=200&fit=crop"
wget -O assets/images/karate-competition.jpg "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop"
```

### 2. Manual Download
1. Buka link Unsplash di atas
2. Pilih gambar yang sesuai
3. Download dengan ukuran 300x200px
4. Simpan dengan nama yang sesuai di `assets/images/`

### 3. Optimasi Gambar
```bash
# Install ImageMagick untuk optimasi
# Windows: choco install imagemagick
# Mac: brew install imagemagick
# Ubuntu: sudo apt install imagemagick

# Resize dan optimize
magick input.jpg -resize 300x200^ -gravity center -extent 300x200 -quality 85 assets/images/output.jpg
```

## Struktur Folder
```
assets/
├── images/
│   ├── pomnas-ceremony.jpg
│   ├── basketball-championship.jpg
│   ├── karate-competition.jpg
│   ├── swimming-competition.jpg
│   ├── football-match.jpg
│   └── athletics-competition.jpg
├── css/
│   └── styles.css
└── js/
    ├── main.js
    └── image-handler.js
```

## Fallback System

Website sudah dilengkapi dengan fallback system:

1. **Primary**: Gambar dari `assets/images/`
2. **Fallback**: Placeholder dari placeholder.com
3. **Error Handling**: Otomatis ganti ke placeholder jika gambar gagal load

## Tips Optimasi

### 1. Format Gambar
- **JPEG**: Untuk foto dengan banyak warna
- **PNG**: Untuk gambar dengan transparansi
- **WebP**: Format modern, ukuran lebih kecil

### 2. Ukuran File
- Target: < 100KB per gambar
- Resolusi: 300x200px (2x untuk retina: 600x400px)

### 3. Lazy Loading
```html
<!-- Contoh lazy loading -->
<img data-src="assets/images/example.jpg" 
     src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3C/svg%3E"
     class="lazy"
     alt="Example">
```

## Testing

Setelah menambahkan gambar:

1. **Local Test**: Buka `localhost/web-bidpora/public.html`
2. **Check Console**: Pastikan tidak ada error 404
3. **Fallback Test**: Hapus salah satu gambar, pastikan fallback muncul
4. **Performance**: Check loading time di Network tab

## Database Integration

Ketika menggunakan Supabase, gambar bisa disimpan sebagai:

1. **URL External**: Simpan URL gambar di database
2. **Supabase Storage**: Upload ke Supabase Storage
3. **CDN**: Gunakan CDN untuk performa lebih baik

```sql
-- Contoh tabel dengan gambar
CREATE TABLE berita (
  id SERIAL PRIMARY KEY,
  judul VARCHAR(255),
  konten TEXT,
  gambar_url VARCHAR(255), -- URL ke gambar
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Troubleshooting

### Gambar Tidak Muncul
1. Check path file
2. Check permission folder
3. Check console error
4. Test dengan URL langsung

### Gambar Terlalu Besar
1. Resize dengan ImageMagick
2. Compress dengan TinyPNG
3. Convert ke WebP

### Loading Lambat
1. Enable lazy loading
2. Optimize ukuran file
3. Gunakan CDN
4. Implement caching
