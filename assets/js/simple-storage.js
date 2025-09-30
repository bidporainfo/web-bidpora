// Simple Storage System untuk DISPORA Web App
// Menggunakan localStorage dengan fitur export/import

class SimpleStorageManager {
    constructor() {
        this.dashboardData = {
            atlet: 180,
            tenaga: 54,
            cabor: 67
        };
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        this.updateDashboardDisplay();
        this.addExportImportButtons();
        // Prefill form on load so admin sees current values
        try { this.showEditForm(); } catch(_) {}
    }

    loadDashboardData() {
        const savedData = localStorage.getItem('dispora_dashboard');
        if (savedData) {
            try {
                this.dashboardData = JSON.parse(savedData);
                console.log('Data loaded from localStorage:', this.dashboardData);
            } catch (error) {
                console.error('Error parsing saved data:', error);
            }
        }
    }

    saveDashboardData() {
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

    addExportImportButtons() {
        // Tambahkan tombol export/import ke dashboard header
        const dashboardHeader = document.querySelector('.dashboard-header');
        if (dashboardHeader && !document.getElementById('export-import-buttons')) {
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'export-import-buttons';
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                margin-left: 20px;
            `;
            
            buttonContainer.innerHTML = `
                <button class="btn-secondary" onclick="simpleStorage.exportData()" title="Export Data">
                    <i class="fas fa-download"></i> Export
                </button>
                <button class="btn-secondary" onclick="simpleStorage.importData()" title="Import Data">
                    <i class="fas fa-upload"></i> Import
                </button>
                <input type="file" id="import-file" accept=".json" style="display: none;" onchange="simpleStorage.handleFileImport(event)">
            `;
            
            dashboardHeader.appendChild(buttonContainer);
        }
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

    saveDashboard() {
        this.dashboardData.atlet = parseInt(document.getElementById('dashboard-atlet').value);
        this.dashboardData.tenaga = parseInt(document.getElementById('dashboard-tenaga').value);
        this.dashboardData.cabor = parseInt(document.getElementById('dashboard-cabor').value);
        
        this.saveDashboardData();
        this.updateDashboardDisplay();
        if (window.updateDashboardCharts) { window.updateDashboardCharts(); }
        this.showNotification('Data dashboard berhasil diperbarui!', 'success');
        // Pastikan form tetap terlihat setelah simpan
        try { this.showEditForm(); } catch(_) {}
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

    // Export data ke file JSON
    exportData() {
        const dataToExport = {
            dashboard: this.dashboardData,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(dataToExport, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `dispora-dashboard-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Data berhasil di-export!', 'success');
    }

    // Import data dari file JSON
    importData() {
        document.getElementById('import-file').click();
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.dashboard) {
                    this.dashboardData = importedData.dashboard;
                    this.saveDashboardData();
                    this.updateDashboardDisplay();
                    this.showNotification('Data berhasil di-import!', 'success');
                } else {
                    this.showNotification('Format file tidak valid!', 'error');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showNotification('Error membaca file!', 'error');
            }
        };
        
        reader.readAsText(file);
        event.target.value = ''; // Reset input
    }

    // Reset data ke default
    resetData() {
        if (confirm('Apakah Anda yakin ingin reset data ke default?')) {
            this.dashboardData = {
                atlet: 180,
                tenaga: 54,
                cabor: 67
            };
            this.saveDashboardData();
            this.updateDashboardDisplay();
            this.showNotification('Data berhasil di-reset!', 'success');
        }
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Method untuk backup otomatis
    autoBackup() {
        const backupKey = 'dispora_dashboard_backup';
        const backupData = {
            data: this.dashboardData,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(backupKey, JSON.stringify(backupData));
    }

    // Method untuk restore dari backup
    restoreFromBackup() {
        const backupKey = 'dispora_dashboard_backup';
        const backupData = localStorage.getItem(backupKey);
        
        if (backupData) {
            try {
                const parsed = JSON.parse(backupData);
                this.dashboardData = parsed.data;
                this.saveDashboardData();
                this.updateDashboardDisplay();
                this.showNotification('Data berhasil di-restore dari backup!', 'success');
            } catch (error) {
                this.showNotification('Error restore backup!', 'error');
            }
        } else {
            this.showNotification('Tidak ada backup tersedia!', 'error');
        }
    }
}

// Global functions untuk HTML onclick events
function showEditDashboardForm() {
    if (window.simpleStorage) {
        window.simpleStorage.showEditForm();
    }
}

function hideDashboardForm() {
    if (window.simpleStorage) {
        window.simpleStorage.hideForm();
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
window.SimpleStorageManager = SimpleStorageManager;
window.showEditDashboardForm = showEditDashboardForm;
window.hideDashboardForm = hideDashboardForm;
