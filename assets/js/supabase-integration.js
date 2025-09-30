// Supabase Integration untuk DISPORA Web App
// Menggunakan konfigurasi dari supabase-config.js

// Inisialisasi Supabase Client
let supabase = null;

async function initSupabase() {
    // Cek apakah config sudah di-set
    if (window.SUPABASE_CONFIG && 
        window.SUPABASE_CONFIG.url !== 'https://your-project.supabase.co' &&
        window.SUPABASE_CONFIG.anonKey !== 'your-anon-key-here') {
        
        if (window.supabase) {
            supabase = window.supabase.createClient(window.SUPABASE_CONFIG.url, window.SUPABASE_CONFIG.anonKey);
            console.log('Supabase initialized successfully');
            return true;
        } else {
            console.error('Supabase library not loaded');
            return false;
        }
    } else {
        console.warn('Supabase not configured. Using localStorage fallback.');
        return false;
    }
}

// Dashboard Manager dengan Supabase
class SupabaseDashboardManager {
    constructor() {
        this.dashboardData = {
            atlet: 180,
            tenaga: 54,
            cabor: 67
        };
        this.useSupabase = false;
        this.init();
    }

    async init() {
        this.useSupabase = await initSupabase();
        await this.loadDashboardData();
        this.setupEventListeners();
        this.updateDashboardDisplay();
        
        if (this.useSupabase) {
            this.setupRealtimeSubscription();
        }
    }

    async loadDashboardData() {
        if (this.useSupabase) {
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
                    console.log('Data loaded from Supabase:', this.dashboardData);
                }
            } catch (error) {
                console.error('Error loading from Supabase:', error);
                this.loadFromLocalStorage();
            }
        } else {
            this.loadFromLocalStorage();
        }
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('dispora_dashboard');
        if (savedData) {
            this.dashboardData = JSON.parse(savedData);
            console.log('Data loaded from localStorage:', this.dashboardData);
        }
    }

    async saveDashboardData() {
        if (this.useSupabase) {
            try {
                const { error } = await supabase
                    .from('dashboard_data')
                    .upsert({
                        id: 1,
                        atlet: this.dashboardData.atlet,
                        tenaga: this.dashboardData.tenaga,
                        cabor: this.dashboardData.cabor,
                        updated_at: new Date().toISOString()
                    });
                
                if (error) throw error;
                console.log('Data saved to Supabase');
            } catch (error) {
                console.error('Error saving to Supabase:', error);
                this.saveToLocalStorage();
            }
        } else {
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('dispora_dashboard', JSON.stringify(this.dashboardData));
        console.log('Data saved to localStorage');
    }

    setupEventListeners() {
        const form = document.getElementById('dashboard-form-element');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveDashboard();
            });
        }
    }

    setupRealtimeSubscription() {
        if (!this.useSupabase) return;

        supabase
            .channel('dashboard-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'dashboard_data',
                filter: 'id=eq.1'
            }, (payload) => {
                console.log('Real-time update received:', payload);
                if (payload.new) {
                    this.dashboardData = {
                        atlet: payload.new.atlet,
                        tenaga: payload.new.tenaga,
                        cabor: payload.new.cabor
                    };
                    this.updateDashboardDisplay();
                }
            })
            .subscribe();
    }

    showEditForm() {
        document.getElementById('dashboard-atlet').value = this.dashboardData.atlet;
        document.getElementById('dashboard-tenaga').value = this.dashboardData.tenaga;
        document.getElementById('dashboard-cabor').value = this.dashboardData.cabor;
        document.getElementById('dashboard-form').style.display = 'block';
    }

    hideForm() {
        document.getElementById('dashboard-form').style.display = 'none';
    }

    async saveDashboard() {
        this.dashboardData.atlet = parseInt(document.getElementById('dashboard-atlet').value);
        this.dashboardData.tenaga = parseInt(document.getElementById('dashboard-tenaga').value);
        this.dashboardData.cabor = parseInt(document.getElementById('dashboard-cabor').value);
        
        await this.saveDashboardData();
        this.updateDashboardDisplay();
        this.hideForm();
        
        const source = this.useSupabase ? 'Supabase' : 'localStorage';
        this.showNotification(`Data dashboard berhasil diperbarui! (${source})`, 'success');
    }

    updateDashboardDisplay() {
        // Update info cards
        const atletElement = document.querySelector('.info-card.blue .number');
        const tenagaElement = document.querySelector('.info-card.green .number');
        const caborElement = document.querySelector('.info-card.yellow .number');
        
        if (atletElement) atletElement.textContent = this.dashboardData.atlet;
        if (tenagaElement) tenagaElement.textContent = this.dashboardData.tenaga;
        if (caborElement) caborElement.textContent = this.dashboardData.cabor;
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Method untuk check connection status
    async checkConnection() {
        if (this.useSupabase) {
            try {
                const { data, error } = await supabase.from('dashboard_data').select('id').limit(1);
                return !error;
            } catch (error) {
                return false;
            }
        }
        return true; // localStorage always works
    }
}

// Global functions untuk HTML onclick events
function showEditDashboardForm() {
    if (window.supabaseDashboardManager) {
        window.supabaseDashboardManager.showEditForm();
    }
}

function hideDashboardForm() {
    if (window.supabaseDashboardManager) {
        window.supabaseDashboardManager.hideForm();
    }
}

// CSS untuk animasi notification
const notificationCSS = `
@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = notificationCSS;
document.head.appendChild(style);

// Export untuk penggunaan
window.SupabaseDashboardManager = SupabaseDashboardManager;
window.showEditDashboardForm = showEditDashboardForm;
window.hideDashboardForm = hideDashboardForm;
