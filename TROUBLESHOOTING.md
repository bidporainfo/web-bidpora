# Troubleshooting GitHub Pages

## 🚨 **MASALAH: login.html TIDAK TERBACA**

### **Penyebab Umum:**
1. **File tidak ter-commit** ke GitHub
2. **Path file salah** di GitHub Pages
3. **JavaScript tidak ter-load** dengan benar
4. **CORS issues** dengan file JSON

### **SOLUSI YANG SUDAH DITERAPKAN:**

#### **1. Fallback Authentication**
- ✅ **Hardcoded credentials** untuk GitHub Pages
- ✅ **localStorage backup** jika JSON tidak bisa diakses
- ✅ **Error handling** yang robust

#### **2. Default Login Credentials**
```
Username: admin
Password: admin123
```

#### **3. File Structure yang Benar**
```
web-bidpora/
├── index.html          # Landing page
├── login.html          # Login page
├── dashboard.html      # Admin dashboard
├── public.html         # Public website
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── simple-auth.js
│       └── simple-storage.js
└── data/
    └── database.json
```

## 🔧 **CARA TESTING**

### **1. Test Local (XAMPP)**
```
http://localhost/web-bidpora/login.html
```

### **2. Test GitHub Pages**
```
https://bidporainfo.github.io/web.bidpora.info/login.html
```

### **3. Test dengan Credentials**
- Username: `admin`
- Password: `admin123`

## 🚀 **CARA DEPLOY ULANG**

### **1. Commit Perubahan**
```bash
git add .
git commit -m "Fix login.html for GitHub Pages"
git push origin main
```

### **2. Tunggu Deploy**
- GitHub Pages biasanya deploy dalam 1-2 menit
- Cek di repository Settings > Pages

### **3. Test Website**
- Buka: `https://bidporainfo.github.io/web.bidpora.info/`
- Klik link login atau akses langsung: `login.html`

## 🔍 **DEBUGGING**

### **1. Cek Browser Console**
- Buka Developer Tools (F12)
- Lihat tab Console untuk error
- Cek tab Network untuk file yang gagal load

### **2. Cek File di GitHub**
- Pastikan semua file sudah ter-commit
- Cek path file di repository
- Pastikan tidak ada file yang ter-ignore

### **3. Cek GitHub Pages Status**
- Go to repository Settings > Pages
- Pastikan status "Your site is published"
- Cek URL yang benar

## 📱 **ALTERNATIF AKSES**

### **1. Direct URL**
```
https://bidporainfo.github.io/web.bidpora.info/login.html
```

### **2. Via Index**
```
https://bidporainfo.github.io/web.bidpora.info/
```
Kemudian klik link login

### **3. Via Public Page**
```
https://bidporainfo.github.io/web.bidpora.info/public.html
```
Kemudian klik tombol admin

## 🎯 **HASIL YANG DIHARAPKAN**

Setelah perbaikan:
- ✅ **login.html bisa diakses** di GitHub Pages
- ✅ **Login berfungsi** dengan credentials admin/admin123
- ✅ **Redirect ke dashboard** setelah login berhasil
- ✅ **Session tersimpan** di localStorage
- ✅ **Logout berfungsi** dengan benar

## 🆘 **JIKA MASIH ERROR**

### **1. Clear Browser Cache**
- Ctrl + F5 untuk hard refresh
- Clear browser cache dan cookies

### **2. Cek File di Repository**
- Pastikan semua file sudah ter-commit
- Cek apakah ada file yang ter-ignore

### **3. Test di Browser Lain**
- Coba di Chrome, Firefox, atau Edge
- Cek apakah masalah browser-specific

### **4. Cek GitHub Pages Logs**
- Go to repository Actions tab
- Lihat deployment logs untuk error

## 📞 **SUPPORT**

Jika masih ada masalah:
1. Cek browser console untuk error
2. Screenshot error yang muncul
3. Cek apakah file sudah ter-commit ke GitHub
4. Test di browser lain

**Login seharusnya sudah berfungsi dengan perbaikan ini!** 🚀
