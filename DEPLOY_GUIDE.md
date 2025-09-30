# Panduan Deploy ke GitHub Pages

## 🎯 **SIMPLE STORAGE SUDAH SIAP!**

Web Anda sudah siap dengan **Simple Storage** yang:
- ✅ **100% GRATIS**
- ✅ **SIMPLE** - Tidak ribet setup
- ✅ **CRUD LENGKAP** - Create, Read, Update, Delete
- ✅ **DATA TERSIMPAN** - Tidak hilang saat refresh

## 🚀 **CARA DEPLOY KE GITHUB PAGES**

### **Step 1: Install Git (Jika Belum Ada)**
1. Download Git dari: https://git-scm.com/download/win
2. Install dengan default settings
3. Restart command prompt/PowerShell

### **Step 2: Buat Repository di GitHub**
1. Buka https://github.com
2. Login ke akun GitHub Anda
3. Klik **"New repository"**
4. Nama repository: `web-simpora`
5. Pilih **"Public"**
6. **JANGAN** centang "Add a README file"
7. Klik **"Create repository"**

### **Step 3: Upload File ke GitHub**
```bash
# Buka command prompt di folder web-simpora
cd C:\xampp\htdocs\web-simpora

# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit - DISPORA Web App with Simple Storage"

# Hubungkan dengan repository GitHub
git remote add origin https://github.com/USERNAME/web-simpora.git

# Push ke GitHub
git push -u origin main
```

**Ganti `USERNAME` dengan username GitHub Anda!**

### **Step 4: Enable GitHub Pages**
1. Buka repository di GitHub
2. Klik tab **"Settings"**
3. Scroll ke **"Pages"** di sidebar kiri
4. **Source**: Deploy from a branch
5. **Branch**: main
6. **Folder**: / (root)
7. Klik **"Save"**

### **Step 5: Akses Website**
Website Anda akan tersedia di:
`https://USERNAME.github.io/web-simpora`

**Ganti `USERNAME` dengan username GitHub Anda!**

## 🎯 **FITUR YANG SUDAH TERSEDIA**

### **1. Dashboard dengan CRUD**
- ✅ **Edit Data Dashboard** - Ubah angka dashboard
- ✅ **Data Tersimpan** - Tidak hilang saat refresh
- ✅ **Export Data** - Download backup ke file JSON
- ✅ **Import Data** - Upload data dari file JSON

### **2. Manajemen Konten**
- ✅ **CRUD Berita** - Create, Read, Update, Delete
- ✅ **CRUD Prestasi** - Kelola data prestasi
- ✅ **CRUD Galeri** - Kelola foto galeri
- ✅ **CRUD Event** - Kelola jadwal event

### **3. Authentication**
- ✅ **Login Admin** - Sistem login sederhana
- ✅ **Session Management** - Session tersimpan
- ✅ **Role-based Access** - Akses berdasarkan role

## 📱 **CARA MENGGUNAKAN**

### **1. Akses Dashboard**
1. Buka website: `https://USERNAME.github.io/web-simpora`
2. Login dengan admin credentials
3. Akses dashboard admin

### **2. Edit Data Dashboard**
1. Klik **"Edit Data Dashboard"**
2. Ubah angka sesuai kebutuhan
3. Klik **"Simpan Perubahan"**

### **3. Backup Data**
1. Klik tombol **"Export"**
2. File JSON akan terdownload
3. Simpan file untuk backup

### **4. Restore Data**
1. Klik tombol **"Import"**
2. Pilih file JSON backup
3. Data akan ter-restore

## 🔧 **TROUBLESHOOTING**

### **Error: "git is not recognized"**
- Install Git dari https://git-scm.com/download/win
- Restart command prompt

### **Error: "Repository not found"**
- Pastikan repository sudah dibuat di GitHub
- Pastikan username benar

### **Error: "Permission denied"**
- Pastikan sudah login ke GitHub
- Cek username dan password

### **Website tidak muncul**
- Tunggu 5-10 menit setelah enable GitHub Pages
- Cek di Settings > Pages apakah sudah aktif

## 🎉 **HASIL AKHIR**

Setelah deploy, Anda akan punya:
- 🌐 **Website gratis** di GitHub Pages
- 📝 **CRUD lengkap** untuk semua data
- 💾 **Data tersimpan** di localStorage
- 📤 **Backup/restore** data
- 🔐 **Sistem login** admin
- 📱 **Responsive design** untuk semua device

## 🚀 **NEXT STEPS**

1. **Deploy ke GitHub Pages** (ikuti panduan di atas)
2. **Test semua fitur** di website live
3. **Backup data** secara berkala
4. **Update konten** sesuai kebutuhan

**Web Anda siap digunakan!** 🎯
