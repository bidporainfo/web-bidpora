// GitHub Storage System untuk DISPORA Web App
// Menggunakan GitHub API untuk menyimpan data di repository

class GitHubStorageManager {
    constructor() {
        this.dashboardData = { atlet: 0, tenaga: 0, cabor: 0 };
        this.githubConfig = {
            owner: 'disporainfo',
            repo: 'web-simpora',
            token: '',
            filePath: 'data/database.json'
        };
        // Load saved config if any
        try {
            const saved = localStorage.getItem('dispora_github_config');
            if (saved) {
                const cfg = JSON.parse(saved);
                this.githubConfig = { ...this.githubConfig, ...cfg };
            }
        } catch(_) {}
        this.init();
    }

    init() {
        this.loadDashboardData();
        this.setupEventListeners();
        this.updateDashboardDisplay();
        this.addGitHubButtons();
    }

    async loadDashboardData() {
        try {
            // Coba load dari GitHub dulu
            const githubData = await this.loadFromGitHub();
            if (githubData) {
                this.dashboardData = githubData;
                console.log('Data loaded from GitHub:', this.dashboardData);
                return;
            }
        } catch (error) {
            console.log('GitHub not available, using localStorage');
        }

        // Fallback ke localStorage
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

    async loadFromGitHub() {
        if (!this.githubConfig.owner || this.githubConfig.owner === 'your-username') {
            throw new Error('GitHub not configured');
        }

        const url = `https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.filePath}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to load from GitHub');
        }

        const data = await response.json();
        const content = atob(data.content);
        return JSON.parse(content);
    }

    async saveToGitHub(compiledDatabaseJson) {
        if (!this.githubConfig.owner || this.githubConfig.owner === 'your-username') {
            throw new Error('GitHub not configured');
        }

        const content = JSON.stringify(compiledDatabaseJson, null, 2);
        const encodedContent = btoa(content);

        // Get current file SHA
        let sha = null;
        try {
            const getUrl = `https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.filePath}`;
            const getResponse = await fetch(getUrl);
            if (getResponse.ok) {
                const fileData = await getResponse.json();
                sha = fileData.sha;
            }
        } catch (error) {
            // File doesn't exist yet, that's okay
        }

        const url = `https://api.github.com/repos/${this.githubConfig.owner}/${this.githubConfig.repo}/contents/${this.githubConfig.filePath}`;
        
        const payload = {
            message: `Update data/database.json - ${new Date().toISOString()}`,
            content: encodedContent,
            ...(sha && { sha })
        };

        const headers = {
            'Content-Type': 'application/json',
            ...(this.githubConfig.token && { 'Authorization': `token ${this.githubConfig.token}` })
        };

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error('Failed to save to GitHub');
        }

        return true;
    }

    async saveDashboardData() {
        try {
            const databaseJson = await this.buildDatabaseJson();
            await this.saveToGitHub(databaseJson);
            console.log('Data saved to GitHub');
        } catch (error) {
            console.log('GitHub save failed, using localStorage:', error);
            localStorage.setItem('dispora_dashboard', JSON.stringify(this.dashboardData));
            console.log('Data saved to localStorage');
        }
    }

    async buildDatabaseJson() {
        // Get current remote database.json to preserve sections not managed locally
        let remote = {};
        try { remote = await this.loadFromGitHub(); } catch(_) {}

        // Local pieces
        let localContent = {};
        try {
            const d = localStorage.getItem('dispora_data');
            if (d) localContent = JSON.parse(d);
        } catch(_) {}

        // Assemble
        const compiled = {
            users: remote.users || [],
            news: remote.news || [],
            achievements: localContent.achievements || remote.achievements || [],
            gallery: localContent.gallery || remote.gallery || [],
            events: localContent.events || remote.events || [],
            medal_tallies: remote.medal_tallies || [],
            match_schedules: remote.match_schedules || [],
            results: remote.results || [],
            // optional: embed dashboard numbers for public if needed later
            _dashboard: this.dashboardData
        };
        return compiled;
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

    addGitHubButtons() {
        const dashboardHeader = document.querySelector('.dashboard-header');
        if (dashboardHeader && !document.getElementById('github-buttons')) {
            const buttonContainer = document.createElement('div');
            buttonContainer.id = 'github-buttons';
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
                margin-left: 20px;
            `;
            
            buttonContainer.innerHTML = `
                <button class="btn-secondary" onclick="githubStorage.pushToGitHub()" title="Kirim ke GitHub">
                    <i class="fab fa-github"></i> Sync GitHub
                </button>
                <button class="btn-secondary" onclick="githubStorage.showConfig()" title="Konfigurasi GitHub">
                    <i class="fas fa-cog"></i> Config
                </button>
            `;
            
            dashboardHeader.appendChild(buttonContainer);
        }
    }

    async pushToGitHub() {
        try {
            const databaseJson = await this.buildDatabaseJson();
            await this.saveToGitHub(databaseJson);
            this.showNotification('Berhasil push data ke GitHub!', 'success');
        } catch (error) {
            this.showNotification('Gagal push ke GitHub: ' + error.message, 'error');
        }
    }

    showConfig() {
        const owner = prompt('GitHub Username/Org:', this.githubConfig.owner || '');
        if (owner === null) return;
        const repo = prompt('Repository name:', this.githubConfig.repo || '');
        if (repo === null) return;
        const filePath = prompt('Data file path (ex: data/database.json):', this.githubConfig.filePath || 'data/database.json');
        if (filePath === null) return;
        const token = prompt('Personal Access Token (repo scope). Token disimpan lokal di browser:', this.githubConfig.token || '');
        if (token === null) return;

        this.githubConfig = { owner, repo, filePath, token };
        localStorage.setItem('dispora_github_config', JSON.stringify(this.githubConfig));
        this.showNotification('Konfigurasi GitHub disimpan!', 'success');
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
        if (window.updateDashboardCharts) { window.updateDashboardCharts(); }
        this.showNotification('Data dashboard berhasil diperbarui!', 'success');
        try { this.showEditForm(); } catch(_) {}
    }

    updateDashboardDisplay() {
        const atletElement = document.querySelector('.info-card.blue .number');
        const tenagaElement = document.querySelector('.info-card.green .number');
        const caborElement = document.querySelector('.info-card.yellow .number');
        
        if (atletElement) atletElement.textContent = this.dashboardData.atlet;
        if (tenagaElement) tenagaElement.textContent = this.dashboardData.tenaga;
        if (caborElement) caborElement.textContent = this.dashboardData.cabor;
    }

    showNotification(message, type = 'info') {
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
}

// Global functions
function showEditDashboardForm() {
    if (window.githubStorage) {
        window.githubStorage.showEditForm();
    }
}

function hideDashboardForm() {
    if (window.githubStorage) {
        window.githubStorage.hideForm();
    }
}

// Export
window.GitHubStorageManager = GitHubStorageManager;
window.showEditDashboardForm = showEditDashboardForm;
window.hideDashboardForm = hideDashboardForm;
