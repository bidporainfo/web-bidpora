// CRUD Management untuk semua konten
class ContentManager {
    constructor() {
        this.data = {};
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchTerm = '';
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.renderAllTables();
    }

    async loadData() {
        try {
            // Cek localStorage dulu
            const localData = localStorage.getItem('dispora_data');
            if (localData) {
                this.data = JSON.parse(localData);
                console.log('Data loaded from localStorage:', this.data);
                return;
            }

            // Jika tidak ada di localStorage, load dari JSON file
            const response = await fetch('data/database.json');
            const data = await response.json();
            this.data = {
                achievements: data.achievements || [],
                gallery: data.gallery || [],
                events: data.events || []
            };
            console.log('Data loaded from JSON file:', this.data);
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = {
                achievements: [],
                gallery: [],
                events: []
            };
        }
    }

    setupEventListeners() {
        // Setup untuk semua form
        this.setupForm('achievement', this.handleAchievementSubmit.bind(this));
        this.setupForm('gallery', this.handleGallerySubmit.bind(this));
        this.setupForm('event', this.handleEventSubmit.bind(this));
        
        // Setup search untuk semua tabel
        this.setupSearch('achievement');
        this.setupSearch('gallery');
        this.setupSearch('event');
    }

    setupSearch(type) {
        const searchInput = document.getElementById(`${type}Search`);
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.renderTable(type);
            });
        }
    }

    renderAllTables() {
        this.renderTable('achievement');
        this.renderTable('gallery');
        this.renderTable('event');
    }

    setupForm(type, submitHandler) {
        const form = document.getElementById(`${type}-form-element`);
        if (form) {
            form.addEventListener('submit', submitHandler);
        }
    }

    // Achievement Management
    showAddAchievementForm() {
        this.showForm('achievement', 'Tambah Prestasi Baru');
    }

    showEditAchievementForm(id) {
        const achievement = this.data.achievements.find(a => a.id == id);
        if (!achievement) return;
        
        this.showForm('achievement', 'Edit Prestasi', achievement);
    }

    async handleAchievementSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('achievement');
        
        if (formData.id) {
            // Update
            const index = this.data.achievements.findIndex(a => a.id == formData.id);
            if (index !== -1) {
                this.data.achievements[index] = { ...this.data.achievements[index], ...formData };
            }
        } else {
            // Add new
            const newId = Math.max(...this.data.achievements.map(a => a.id), 0) + 1;
            this.data.achievements.push({
                id: newId,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        await this.saveData();
        this.hideForm('achievement');
        this.renderTable('achievement');
        this.showNotification('Prestasi berhasil disimpan!', 'success');
    }

    async deleteAchievement(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus prestasi ini?')) return;
        
        this.data.achievements = this.data.achievements.filter(a => a.id != id);
        await this.saveData();
        this.renderTable('achievement');
        this.showNotification('Prestasi berhasil dihapus!', 'success');
    }

    // Gallery Management
    showAddGalleryForm() {
        this.showForm('gallery', 'Tambah Foto Baru');
    }

    showEditGalleryForm(id) {
        const gallery = this.data.gallery.find(g => g.id == id);
        if (!gallery) return;
        
        this.showForm('gallery', 'Edit Foto', gallery);
    }

    async handleGallerySubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('gallery');
        
        if (formData.id) {
            const index = this.data.gallery.findIndex(g => g.id == formData.id);
            if (index !== -1) {
                this.data.gallery[index] = { ...this.data.gallery[index], ...formData };
            }
        } else {
            const newId = Math.max(...this.data.gallery.map(g => g.id), 0) + 1;
            this.data.gallery.push({
                id: newId,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        await this.saveData();
        this.hideForm('gallery');
        this.renderTable('gallery');
        this.showNotification('Foto berhasil disimpan!', 'success');
    }

    async deleteGallery(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus foto ini?')) return;
        
        this.data.gallery = this.data.gallery.filter(g => g.id != id);
        await this.saveData();
        this.renderTable('gallery');
        this.showNotification('Foto berhasil dihapus!', 'success');
    }

    // Event Management
    showAddEventForm() {
        this.showForm('event', 'Tambah Event Baru');
    }

    showEditEventForm(id) {
        const event = this.data.events.find(e => e.id == id);
        if (!event) return;
        
        this.showForm('event', 'Edit Event', event);
    }

    async handleEventSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('event');
        
        if (formData.id) {
            const index = this.data.events.findIndex(e => e.id == formData.id);
            if (index !== -1) {
                this.data.events[index] = { ...this.data.events[index], ...formData };
            }
        } else {
            const newId = Math.max(...this.data.events.map(e => e.id), 0) + 1;
            this.data.events.push({
                id: newId,
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        await this.saveData();
        this.hideForm('event');
        this.renderTable('event');
        this.showNotification('Event berhasil disimpan!', 'success');
    }

    async deleteEvent(id) {
        if (!confirm('Apakah Anda yakin ingin menghapus event ini?')) return;
        
        this.data.events = this.data.events.filter(e => e.id != id);
        await this.saveData();
        this.renderTable('event');
        this.showNotification('Event berhasil dihapus!', 'success');
    }


    // Generic Form Methods
    showForm(type, title, data = null) {
        document.getElementById(`${type}-form-title`).textContent = title;
        document.getElementById(`${type}-form`).style.display = 'block';
        
        if (data) {
            // Fill form with existing data
            Object.keys(data).forEach(key => {
                const element = document.getElementById(`${type}-${key}`);
                if (element) {
                    element.value = data[key];
                }
            });
        } else {
            // Clear form
            document.getElementById(`${type}-form-element`).reset();
            document.getElementById(`${type}-id`).value = '';
        }
    }

    hideForm(type) {
        document.getElementById(`${type}-form`).style.display = 'none';
    }

    getFormData(type) {
        const form = document.getElementById(`${type}-form-element`);
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key.replace(`${type}-`, '')] = value;
        }
        
        return data;
    }

    async saveData() {
        // Simpan ke localStorage karena GitHub Pages tidak bisa write file
        try {
            localStorage.setItem('dispora_data', JSON.stringify(this.data));
            console.log('Data saved to localStorage:', this.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
        
        // Trigger update untuk semua halaman yang menggunakan data ini
        this.updateAllRelatedPages();
    }

    updateAllRelatedPages() {
        // Update halaman Data E-Kompetisi jika ada
        if (window.updateEkompetisiData) {
            window.updateEkompetisiData(this.data.ekompetisi);
        }
        
        // Update halaman lain jika ada
        if (window.updateNewsData) {
            window.updateNewsData(this.data.news);
        }
    }

    renderTable(type) {
        const table = document.getElementById(`${type}Table`);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        let data = this.data[type] || [];
        
        console.log(`Rendering ${type} table with data:`, data);
        
        // Filter data berdasarkan search term
        if (this.searchTerm) {
            data = data.filter(item => {
                const searchableFields = this.getSearchableFields(type);
                return searchableFields.some(field => 
                    String(item[field] || '').toLowerCase().includes(this.searchTerm)
                );
            });
        }
        
        tbody.innerHTML = data.map((item, index) => {
            switch(type) {
                case 'achievement':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.title}</strong></td>
                            <td>${item.category}</td>
                            <td>${new Date(item.achievement_date).toLocaleDateString('id-ID')}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditAchievementForm(${item.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete" onclick="contentManager.deleteAchievement(${item.id})" title="Hapus">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'gallery':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.title}</strong></td>
                            <td>${item.category}</td>
                            <td>
                                ${item.image_url ? 
                                    `<img src="${item.image_url}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">` : 
                                    'No Image'
                                }
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditGalleryForm(${item.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete" onclick="contentManager.deleteGallery(${item.id})" title="Hapus">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'event':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.title}</strong></td>
                            <td>${new Date(item.event_date).toLocaleDateString('id-ID')}</td>
                            <td>${item.event_time || '-'}</td>
                            <td>${item.location}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditEventForm(${item.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete" onclick="contentManager.deleteEvent(${item.id})" title="Hapus">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                default:
                    return '';
            }
        }).join('');
    }

    getSearchableFields(type) {
        switch(type) {
            case 'achievement':
                return ['title', 'category', 'description'];
            case 'gallery':
                return ['title', 'category', 'description'];
            case 'event':
                return ['title', 'location', 'description'];
            default:
                return [];
        }
    }

    showNotification(message, type = 'info') {
        alert(message);
    }
}

// Global functions for HTML onclick events
function showAddAchievementForm() { contentManager.showAddAchievementForm(); }
function hideAchievementForm() { contentManager.hideForm('achievement'); }

function showAddGalleryForm() { contentManager.showAddGalleryForm(); }
function hideGalleryForm() { contentManager.hideForm('gallery'); }

function showAddEventForm() { contentManager.showAddEventForm(); }
function hideEventForm() { contentManager.hideForm('event'); }


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.contentManager = new ContentManager();
});
