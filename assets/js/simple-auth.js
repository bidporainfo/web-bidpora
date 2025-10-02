// Simple Authentication System untuk GitHub Pages
class SimpleAuth {
    constructor() {
        this.currentUser = null;
        this.loadUser();
    }

    // Load user dari localStorage
    loadUser() {
        const user = localStorage.getItem('bidpora_user');
        if (user) {
            this.currentUser = JSON.parse(user);
        }
    }

    // Login dengan username/password
    async login(username, password) {
        try {
            // Coba load data dari JSON dulu
            try {
                const response = await fetch('data/database.json');
                if (response.ok) {
                    const data = await response.json();
                    
                    // Cari user
                    const user = data.users.find(u => 
                        (u.username === username || u.email === username) && 
                        u.password === password
                    );

                    if (user) {
                        this.currentUser = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                            loginTime: new Date().toISOString()
                        };
                        
                        // Simpan ke localStorage
                        localStorage.setItem('bidpora_user', JSON.stringify(this.currentUser));
                        return { success: true, user: this.currentUser };
                    }
                }
            } catch (jsonError) {
                console.log('JSON file not accessible, using hardcoded credentials');
            }
            
            // Fallback: hardcoded credentials untuk GitHub Pages
            if (username === 'admin' && password === 'admin123') {
                this.currentUser = {
                    id: 1,
                    username: 'admin',
                    email: 'admin@bidpora.jepara.go.id',
                    role: 'admin',
                    loginTime: new Date().toISOString()
                };
                
                // Simpan ke localStorage
                localStorage.setItem('bidpora_user', JSON.stringify(this.currentUser));
                return { success: true, user: this.currentUser };
            } else {
                return { success: false, message: 'Username atau password salah' };
            }
        } catch (error) {
            return { success: false, message: 'Terjadi kesalahan: ' + error.message };
        }
    }

    // Logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('bidpora_user');
    }

    // Cek apakah user sudah login
    isLoggedIn() {
        return this.currentUser !== null;
    }

    // Cek apakah user adalah admin
    isAdmin() {
        return this.currentUser && this.currentUser.role === 'admin';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Redirect jika belum login
    requireLogin(redirectUrl = 'login.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Redirect jika bukan admin
    requireAdmin(redirectUrl = 'login.html') {
        if (!this.isAdmin()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }
}

// Global instance
window.simpleAuth = new SimpleAuth();

// Helper functions untuk kompatibilitas
window.checkAuth = () => window.simpleAuth.requireLogin();
window.checkAdmin = () => window.simpleAuth.requireAdmin();
window.logout = () => {
    window.simpleAuth.logout();
    window.location.href = 'login.html';
};
