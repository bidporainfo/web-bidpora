# BIDPORA Web Application

Sistem Informasi Manajemen Pembinaan Olahraga Kabupaten Jepara

## Deskripsi

Aplikasi web BIDPORA adalah sistem informasi untuk mengelola data olahraga, berita, prestasi, galeri, dan jadwal pertandingan di Kabupaten Jepara. Aplikasi ini terdiri dari dua bagian utama:

1. **Public Website** - Tampilan untuk pengunjung umum
2. **Admin Dashboard** - Panel administrasi untuk mengelola konten

## Fitur

### Public Website
- **Beranda** - Slider dengan gambar dan informasi BIDPORA
- **Berita** - Daftar berita terkini
- **Prestasi** - Daftar prestasi atlet
- **Galeri** - Galeri foto kegiatan olahraga
- **Kontak** - Informasi kontak BIDPORA

### Admin Dashboard
- **Dashboard** - Statistik dan overview data
- **Kelola Berita** - Tambah, edit, hapus berita
- **Kelola Prestasi** - Kelola data prestasi atlet
- **Kelola Galeri** - Upload dan kelola foto
- **Kelola Acara** - Kelola event dan jadwal
- **Kelola Medali** - Kelola data medali kompetisi
- **Kelola Jadwal** - Kelola jadwal pertandingan

## Teknologi

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+
- **Database**: MySQL 5.7+
- **Server**: Apache (XAMPP)
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Google Fonts (Poppins)

## Instalasi

### Persyaratan
- XAMPP atau server web dengan PHP dan MySQL
- PHP 7.4 atau lebih baru
- MySQL 5.7 atau lebih baru
- Web browser modern

### Langkah Instalasi

1. **Clone atau download project**
   ```bash
   git clone [repository-url]
   # atau download dan extract ke folder web server
   ```

2. **Setup Database**
   - Buka phpMyAdmin atau MySQL client
   - Import file `database/schema.sql`
   - Database akan dibuat dengan nama `bidpora_web`

3. **Konfigurasi Database**
   - Edit file `config/database.php` jika diperlukan
   - Sesuaikan host, username, password database

4. **Setup Upload Directory**
   - Buat folder `assets/uploads/` dengan permission 755
   - Folder ini untuk menyimpan gambar yang diupload

5. **Akses Aplikasi**
   - Public website: `http://localhost/web-bidpora/public.html`
   - Admin login: `http://localhost/web-bidpora/login.html`
   - Admin dashboard: `http://localhost/web-bidpora/admin/dashboard.html`

## Default Login

- **Username**: admin
- **Password**: admin123

## Struktur File

```
web-bidpora/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── images/
│   │   ├── pon.jpg
│   │   ├── pon1.jpg
│   │   └── ...
│   ├── js/
│   │   └── main.js
│   └── uploads/          # Folder upload gambar
├── admin/
│   ├── dashboard.html
│   └── add-content.html
├── api/
│   ├── auth.php
│   ├── logout.php
│   ├── news.php
│   ├── achievements.php
│   ├── gallery.php
│   ├── events.php
│   ├── medal_tallies.php
│   └── match_schedules.php
├── config/
│   └── database.php
├── database/
│   └── schema.sql
├── public.html
├── login.html
├── dashboard.html
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth.php` - Login
- `GET /api/auth.php` - Check login status
- `POST /api/logout.php` - Logout

### Content Management
- `GET /api/news.php` - Get all news
- `POST /api/news.php` - Create news (Admin only)
- `PUT /api/news.php` - Update news (Admin only)
- `DELETE /api/news.php?id={id}` - Delete news (Admin only)

- `GET /api/achievements.php` - Get all achievements
- `POST /api/achievements.php` - Create achievement (Admin only)
- `PUT /api/achievements.php` - Update achievement (Admin only)
- `DELETE /api/achievements.php?id={id}` - Delete achievement (Admin only)

- `GET /api/gallery.php` - Get all gallery items
- `POST /api/gallery.php` - Create gallery item (Admin only)
- `PUT /api/gallery.php` - Update gallery item (Admin only)
- `DELETE /api/gallery.php?id={id}` - Delete gallery item (Admin only)

- `GET /api/events.php` - Get all events
- `POST /api/events.php` - Create event (Admin only)
- `PUT /api/events.php` - Update event (Admin only)
- `DELETE /api/events.php?id={id}` - Delete event (Admin only)

- `GET /api/medal_tallies.php` - Get all medal tallies
- `POST /api/medal_tallies.php` - Create medal tally (Admin only)
- `PUT /api/medal_tallies.php` - Update medal tally (Admin only)
- `DELETE /api/medal_tallies.php?id={id}` - Delete medal tally (Admin only)

- `GET /api/match_schedules.php` - Get all match schedules
- `POST /api/match_schedules.php` - Create match schedule (Admin only)
- `PUT /api/match_schedules.php` - Update match schedule (Admin only)
- `DELETE /api/match_schedules.php?id={id}` - Delete match schedule (Admin only)

## Database Schema

### Tables
- `users` - Data admin dan user
- `news` - Data berita
- `achievements` - Data prestasi
- `gallery` - Data galeri foto
- `events` - Data acara/event
- `medal_tallies` - Data medali kompetisi
- `match_schedules` - Data jadwal pertandingan
- `contact_info` - Data informasi kontak

## Upload Gambar

- Format yang didukung: JPG, JPEG, PNG, GIF, WEBP
- Ukuran maksimal: 5MB
- Gambar disimpan di folder `assets/uploads/`
- Nama file otomatis dengan prefix dan timestamp

## Keamanan

- Password di-hash menggunakan PHP password_hash()
- Session management untuk admin
- Validasi input pada semua form
- CORS headers untuk API
- File upload validation

## Pengembangan

### Menambah Fitur Baru
1. Buat table database baru di `database/schema.sql`
2. Buat API endpoint di folder `api/`
3. Update admin dashboard untuk fitur baru
4. Update public website jika diperlukan

### Customization
- Edit `assets/css/styles.css` untuk styling
- Edit `config/database.php` untuk konfigurasi database
- Edit file HTML untuk layout dan konten

## Troubleshooting

### Database Connection Error
- Pastikan MySQL service berjalan
- Cek konfigurasi di `config/database.php`
- Pastikan database `bidpora_web` sudah dibuat

### Upload Error
- Pastikan folder `assets/uploads/` ada dan writable
- Cek permission folder (755)
- Pastikan ukuran file tidak melebihi 5MB

### Login Error
- Pastikan username dan password benar
- Cek apakah user ada di database
- Cek session configuration

## Kontribusi

1. Fork repository
2. Buat feature branch
3. Commit perubahan
4. Push ke branch
5. Buat Pull Request

## Lisensi

Project ini dibuat untuk BIDPORA Kabupaten Jepara. Silakan hubungi admin untuk informasi lebih lanjut.

## Kontak

- **Email**: info@bidpora.jepara.go.id
- **Website**: www.bidpora.jepara.go.id
- **Alamat**: Jl. Pemuda No. 1, Jepara
