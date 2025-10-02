# Fix Login.html untuk GitHub Pages

## 🚨 **MASALAH: login.html TIDAK BISA DIBUKA**

Repository: `web.bidpora.info`
URL: `https://bidporainfo.github.io/web.bidpora.info/`

## 🔧 **SOLUSI YANG SUDAH DIBUAT**

### **1. File Login Simple**
- ✅ **login-simple.html** - Versi login yang lebih simple
- ✅ **index-simple.html** - Landing page yang lebih simple
- ✅ **Tidak bergantung pada file eksternal** yang mungkin tidak bisa diakses

### **2. Default Credentials**
```
Username: admin
Password: admin123
```

## 🚀 **CARA DEPLOY**

### **Step 1: Commit File Baru**
```bash
git add .
git commit -m "Add simple login files for GitHub Pages"
git push origin main
```

### **Step 2: Test URL**
Setelah deploy, test URL berikut:

#### **A. Landing Page Simple**
```
https://bidporainfo.github.io/web.bidpora.info/index-simple.html
```

#### **B. Login Simple**
```
https://bidporainfo.github.io/web.bidpora.info/login-simple.html
```

#### **C. Dashboard (setelah login)**
```
https://bidporainfo.github.io/web.bidpora.info/dashboard.html
```

#### **D. Public Website**
```
https://bidporainfo.github.io/web.bidpora.info/public.html
```

## 🔍 **TROUBLESHOOTING**

### **1. Jika login-simple.html tidak bisa dibuka:**

#### **A. Cek File di Repository**
- Buka: `https://github.com/bidporainfo/web.bidpora.info`
- Pastikan file `login-simple.html` ada di root
- Pastikan file sudah ter-commit

#### **B. Cek GitHub Pages Status**
- Go to: `https://github.com/bidporainfo/web.bidpora.info/settings/pages`
- Pastikan status "Your site is published"
- Pastikan source: "Deploy from a branch" > "main"

#### **C. Clear Browser Cache**
- Ctrl + F5 untuk hard refresh
- Clear browser cache dan cookies

### **2. Jika login berhasil tapi dashboard error:**

#### **A. Cek File dashboard.html**
- Pastikan file ada di root repository
- Pastikan file sudah ter-commit

#### **B. Cek Browser Console**
- Buka Developer Tools (F12)
- Lihat tab Console untuk error
- Cek tab Network untuk file yang gagal load

## 📱 **ALTERNATIF AKSES**

### **1. Via Index Simple**
```
https://bidporainfo.github.io/web.bidpora.info/index-simple.html
```
Kemudian klik "Login Admin"

### **2. Direct Login**
```
https://bidporainfo.github.io/web.bidpora.info/login-simple.html
```

### **3. Via Public Website**
```
https://bidporainfo.github.io/web.bidpora.info/public.html
```
Kemudian cari link admin

## 🎯 **HASIL YANG DIHARAPKAN**

Setelah deploy:
- ✅ **index-simple.html** bisa diakses
- ✅ **login-simple.html** bisa diakses
- ✅ **Login berfungsi** dengan admin/admin123
- ✅ **Redirect ke dashboard** setelah login
- ✅ **Dashboard berfungsi** dengan CRUD

## 🆘 **JIKA MASIH ERROR**

### **1. Cek Repository Structure**
Pastikan struktur file seperti ini:
```
web.bidpora.info/
├── index-simple.html
├── login-simple.html
├── dashboard.html
├── public.html
├── BIDPORA_LOGO.png
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── simple-storage.js
└── data/
    └── database.json
```

### **2. Test di Browser Lain**
- Coba di Chrome, Firefox, atau Edge
- Cek apakah masalah browser-specific

### **3. Cek GitHub Pages Logs**
- Go to repository Actions tab
- Lihat deployment logs untuk error

## 📞 **SUPPORT**

Jika masih ada masalah:
1. Screenshot error yang muncul
2. Cek browser console untuk error
3. Pastikan semua file sudah ter-commit
4. Test di browser lain

**Login seharusnya sudah berfungsi dengan file simple ini!** 🚀
