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
            const localData = localStorage.getItem('bidpora_data');
            if (localData) {
                this.data = JSON.parse(localData);
                console.log('Data loaded from localStorage:', this.data);
                return;
            }

            // Jika tidak ada di localStorage, load dari JSON file
            const response = await fetch('data/database.json');
            const data = await response.json();
            this.data = {
                news: data.news || [],
                achievements: data.achievements || [],
                gallery: data.gallery || [],
                events: data.events || [],
                medal_tallies: data.medal_tallies || [],
                match_schedules: data.match_schedules || [],
                results: data.results || [],
                contacts: data.contacts || [],
                competitions: data.competitions || [],
                registrations: data.registrations || []
            };
            console.log('Data loaded from JSON file:', this.data);
        } catch (error) {
            console.error('Error loading data:', error);
            this.data = {
                news: [],
                achievements: [],
                gallery: [],
                events: [],
                medal_tallies: [],
                match_schedules: [],
                results: [],
                contacts: [],
                competitions: [],
                registrations: []
            };
        }
    }

    setupEventListeners() {
        // Setup untuk semua form
        this.setupForm('achievement', this.handleAchievementSubmit.bind(this));
        this.setupForm('gallery', this.handleGallerySubmit.bind(this));
        this.setupForm('event', this.handleEventSubmit.bind(this));
        this.setupForm('medal', this.handleMedalSubmit.bind(this));
        this.setupForm('match', this.handleMatchSubmit.bind(this));
        this.setupForm('result', this.handleResultSubmit.bind(this));
        this.setupForm('contact', this.handleContactSubmit.bind(this));
        this.setupForm('competition', this.handleCompetitionSubmit.bind(this));
        
        // Setup form keolahragaan (simple counter)
        this.setupForm('keolahragaan', this.handleKeolahragaanSubmit.bind(this));
        
        // Setup search untuk semua tabel
        this.setupSearch('achievement');
        this.setupSearch('gallery');
        this.setupSearch('event');
        this.setupSearch('medal');
        this.setupSearch('match');
        this.setupSearch('result');
        this.setupSearch('contact');
        this.setupSearch('competition');
        this.setupSearch('registration');
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
        this.renderTable('medal');
        this.renderTable('match');
        this.renderTable('result');
        this.renderTable('contact');
        this.renderTable('competition');
        this.renderTable('registration');
        
        // Load keolahragaan data
        this.loadKeolahragaanData();
        
        // Load filter options for registration
        this.loadCompetitionFilters();
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

    // Medal Management
    showAddMedalForm() { this.showForm('medal', 'Tambah Data Medali Baru'); }
    showEditMedalForm(id) {
        const row = this.data.medal_tallies.find(r => r.id == id);
        if (!row) return; this.showForm('medal', 'Edit Data Medali', row);
    }
    async handleMedalSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('medal');
        if (formData.id) {
            const idx = this.data.medal_tallies.findIndex(r => r.id == formData.id);
            if (idx !== -1) this.data.medal_tallies[idx] = { ...this.data.medal_tallies[idx], ...formData };
        } else {
            const newId = Math.max(...this.data.medal_tallies.map(r => r.id), 0) + 1;
            this.data.medal_tallies.push({ id: newId, ...formData });
        }
        await this.saveData();
        this.hideForm('medal');
        this.renderTable('medal');
        this.showNotification('Data medali berhasil disimpan!', 'success');
    }
    async deleteMedal(id){ if (!confirm('Hapus data ini?')) return; this.data.medal_tallies = this.data.medal_tallies.filter(r => r.id != id); await this.saveData(); this.renderTable('medal'); this.showNotification('Data medali dihapus', 'success'); }

    // Match Schedule Management
    showAddMatchForm() { this.showForm('match', 'Tambah Jadwal Baru'); }
    showEditMatchForm(id) {
        const row = this.data.match_schedules.find(r => r.id == id);
        if (!row) return; this.showForm('match', 'Edit Jadwal', row);
    }
    async handleMatchSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('match');
        if (formData.id) {
            const idx = this.data.match_schedules.findIndex(r => r.id == formData.id);
            if (idx !== -1) this.data.match_schedules[idx] = { ...this.data.match_schedules[idx], ...formData };
        } else {
            const newId = Math.max(...this.data.match_schedules.map(r => r.id), 0) + 1;
            this.data.match_schedules.push({ id: newId, ...formData });
        }
        await this.saveData();
        this.hideForm('match');
        this.renderTable('match');
        this.showNotification('Jadwal berhasil disimpan!', 'success');
    }
    async deleteMatch(id){ if (!confirm('Hapus jadwal ini?')) return; this.data.match_schedules = this.data.match_schedules.filter(r => r.id != id); await this.saveData(); this.renderTable('match'); this.showNotification('Jadwal dihapus', 'success'); }

    // Results Management
    showAddResultForm() { this.showForm('result', 'Tambah Hasil Pertandingan'); }
    showEditResultForm(id) {
        const row = this.data.results.find(r => r.id == id);
        if (!row) return; this.showForm('result', 'Edit Hasil Pertandingan', row);
    }
    async handleResultSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('result');
        if (formData.id) {
            const idx = this.data.results.findIndex(r => r.id == formData.id);
            if (idx !== -1) this.data.results[idx] = { ...this.data.results[idx], ...formData };
        } else {
            const newId = Math.max(...this.data.results.map(r => r.id), 0) + 1;
            this.data.results.push({ id: newId, ...formData });
        }
        await this.saveData();
        this.hideForm('result');
        this.renderTable('result');
        this.showNotification('Hasil pertandingan berhasil disimpan!', 'success');
    }
    async deleteResult(id){ if (!confirm('Hapus hasil ini?')) return; this.data.results = this.data.results.filter(r => r.id != id); await this.saveData(); this.renderTable('result'); this.showNotification('Hasil dihapus', 'success'); }

    // Contact Management
    showAddContactForm() { this.showForm('contact', 'Tambah Info Kontak Baru'); }
    showEditContactForm(id) {
        const row = this.data.contacts.find(r => r.id == id);
        if (!row) return; this.showForm('contact', 'Edit Info Kontak', row);
    }
    async handleContactSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('contact');
        if (formData.id) {
            const idx = this.data.contacts.findIndex(r => r.id == formData.id);
            if (idx !== -1) this.data.contacts[idx] = { ...this.data.contacts[idx], ...formData };
        } else {
            const newId = Math.max(...this.data.contacts.map(r => r.id), 0) + 1;
            this.data.contacts.push({ id: newId, ...formData });
        }
        await this.saveData();
        this.hideForm('contact');
        this.renderTable('contact');
        this.showNotification('Info kontak berhasil disimpan!', 'success');
    }
    async deleteContact(id){ if (!confirm('Hapus kontak ini?')) return; this.data.contacts = this.data.contacts.filter(r => r.id != id); await this.saveData(); this.renderTable('contact'); this.showNotification('Kontak dihapus', 'success'); }

    // Competition Management
    showAddCompetitionForm() { this.showForm('competition', 'Tambah Lomba Baru'); }
    showEditCompetitionForm(id) {
        const row = this.data.competitions.find(r => r.id == id);
        if (!row) return; this.showForm('competition', 'Edit Lomba', row);
    }
    async handleCompetitionSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData('competition');
        if (formData.id) {
            const idx = this.data.competitions.findIndex(r => r.id == formData.id);
            if (idx !== -1) this.data.competitions[idx] = { ...this.data.competitions[idx], ...formData };
        } else {
            const newId = Math.max(...this.data.competitions.map(r => r.id), 0) + 1;
            this.data.competitions.push({ 
                id: newId, 
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }
        await this.saveData();
        this.hideForm('competition');
        this.renderTable('competition');
        this.loadCompetitionFilters();
        this.showNotification('Lomba berhasil disimpan!', 'success');
    }
    async deleteCompetition(id){ 
        if (!confirm('Hapus lomba ini? Data pendaftar juga akan terhapus.')) return; 
        this.data.competitions = this.data.competitions.filter(r => r.id != id); 
        this.data.registrations = this.data.registrations.filter(r => r.competition_id != id);
        await this.saveData(); 
        this.renderTable('competition'); 
        this.renderTable('registration');
        this.loadCompetitionFilters();
        this.showNotification('Lomba dihapus', 'success'); 
    }

    // Registration Management
    loadCompetitionFilters() {
        const filterSelect = document.getElementById('filterCompetition');
        if (filterSelect) {
            const options = '<option value="">Semua Lomba</option>' + 
                this.data.competitions.map(comp => 
                    `<option value="${comp.id}">${comp.title}</option>`
                ).join('');
            filterSelect.innerHTML = options;
            
            filterSelect.addEventListener('change', () => {
                this.renderTable('registration');
            });
        }
    }

    viewRegistrationDetail(id) {
        const registration = this.data.registrations.find(r => r.id == id);
        if (!registration) return;
        
        const competition = this.data.competitions.find(c => c.id == registration.competition_id);
        
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        modalTitle.textContent = 'Detail Pendaftar';
        modalBody.innerHTML = `
            <div class="detail-meta">
                <div class="meta-item">
                    <span class="meta-label">Nama:</span>
                    <span class="meta-value">${registration.participant_name}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Lomba:</span>
                    <span class="meta-value">${competition ? competition.title : 'Unknown'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Jenis Kelamin:</span>
                    <span class="meta-value">${registration.gender}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Tanggal Lahir:</span>
                    <span class="meta-value">${new Date(registration.birth_date).toLocaleDateString('id-ID')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Alamat:</span>
                    <span class="meta-value">${registration.full_address}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Cabang Olahraga:</span>
                    <span class="meta-value">${registration.sport_category}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Tingkat Pendidikan:</span>
                    <span class="meta-value">${registration.education_level || '-'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Sekolah/Instansi:</span>
                    <span class="meta-value">${registration.school_institution || '-'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">No HP:</span>
                    <span class="meta-value">${registration.phone_number}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">NISN:</span>
                    <span class="meta-value">${registration.nisn || '-'}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Tanggal Daftar:</span>
                    <span class="meta-value">${new Date(registration.registration_date).toLocaleDateString('id-ID')}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Status:</span>
                    <span class="meta-value">${registration.status}</span>
                </div>
            </div>
            ${registration.notes ? `
                <div class="detail-content">
                    <h4>Catatan:</h4>
                    <p>${registration.notes}</p>
                </div>
            ` : ''}
        `;
        modal.style.display = 'block';
    }

    updateRegistrationStatus(id, status) {
        const registration = this.data.registrations.find(r => r.id == id);
        if (!registration) return;
        
        registration.status = status;
        this.saveData();
        this.renderTable('registration');
        this.showNotification(`Status pendaftar diubah menjadi ${status}`, 'success');
    }

    async deleteRegistration(id) {
        if (!confirm('Hapus data pendaftar ini?')) return;
        this.data.registrations = this.data.registrations.filter(r => r.id != id);
        await this.saveData();
        this.renderTable('registration');
        this.showNotification('Data pendaftar dihapus', 'success');
    }

    // Keolahragaan Management (Simple counter)
    loadKeolahragaanData() {
        // Load data from localStorage or set defaults
        const savedData = localStorage.getItem('bidpora_keolahragaan');
        let keolahragaanData = {
            jumlah_atlet: 180,
            jumlah_tenaga: 54,
            jumlah_cabor: 67
        };
        
        if (savedData) {
            try {
                keolahragaanData = JSON.parse(savedData);
            } catch(e) {}
        }
        
        // Update form fields
        document.getElementById('jumlah-atlet').value = keolahragaanData.jumlah_atlet;
        document.getElementById('jumlah-tenaga').value = keolahragaanData.jumlah_tenaga;
        document.getElementById('jumlah-cabor').value = keolahragaanData.jumlah_cabor;
        
        // Update preview cards
        document.getElementById('preview-atlet').textContent = keolahragaanData.jumlah_atlet;
        document.getElementById('preview-tenaga').textContent = keolahragaanData.jumlah_tenaga;
        document.getElementById('preview-cabor').textContent = keolahragaanData.jumlah_cabor;
        
        // Update dashboard cards
        this.updateDashboardCounters(keolahragaanData);
        
        // Add real-time preview update
        document.getElementById('jumlah-atlet').addEventListener('input', (e) => {
            document.getElementById('preview-atlet').textContent = e.target.value;
        });
        document.getElementById('jumlah-tenaga').addEventListener('input', (e) => {
            document.getElementById('preview-tenaga').textContent = e.target.value;
        });
        document.getElementById('jumlah-cabor').addEventListener('input', (e) => {
            document.getElementById('preview-cabor').textContent = e.target.value;
        });
    }

    async handleKeolahragaanSubmit(e) {
        e.preventDefault();
        
        const keolahragaanData = {
            jumlah_atlet: parseInt(document.getElementById('jumlah-atlet').value) || 0,
            jumlah_tenaga: parseInt(document.getElementById('jumlah-tenaga').value) || 0,
            jumlah_cabor: parseInt(document.getElementById('jumlah-cabor').value) || 0
        };
        
        // Save to localStorage
        localStorage.setItem('bidpora_keolahragaan', JSON.stringify(keolahragaanData));
        
        // Update dashboard counters
        this.updateDashboardCounters(keolahragaanData);
        
        this.showNotification('Data keolahragaan berhasil disimpan!', 'success');
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
        formData.forEach((value, key) => {
            const normalizedKey = key.startsWith(`${type}-`) ? key.slice(`${type}-`.length) : key;
            data[normalizedKey] = value;
        });
        
        // Also get data directly from elements for better reliability
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            let key = input.id;
            if (key.startsWith(`${type}-`)) {
                key = key.slice(`${type}-`.length);
            }
            if (input.type === 'checkbox') {
                data[key] = input.checked;
            } else if (input.value) {
                data[key] = input.value;
            }
        });
        
        return data;
    }

    async saveData() {
        // Simpan ke localStorage karena GitHub Pages tidak bisa write file
        try {
            localStorage.setItem('bidpora_data', JSON.stringify(this.data));
            console.log('Data saved to localStorage:', this.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
        
        // Update dashboard counters
        this.updateDashboardCounters();
        
        // Trigger update untuk semua halaman yang menggunakan data ini
        this.updateAllRelatedPages();
        try {
            // Map ringkasan medali untuk konsumsi public.html (emas/perak/perunggu agregat)
            const summary = this.data.medal_tallies.reduce((acc, r) => {
                acc.gold += parseInt(r.gold_count || 0, 10);
                acc.silver += parseInt(r.silver_count || 0, 10);
                acc.bronze += parseInt(r.bronze_count || 0, 10);
                return acc;
            }, { gold: 0, silver: 0, bronze: 0 });
            const publicData = {
                medals: summary,
                schedule: this.data.match_schedules.map(r => ({
                    time: r.match_time,
                    sport: r.sport,
                    match: `${r.team_a || ''} vs ${r.team_b || ''}`,
                    venue: r.venue
                })),
                results: this.data.results.map(r => ({
                    sport: r.sport,
                    team_a: r.team_a,
                    team_b: r.team_b,
                    score: r.score,
                    status: r.status
                })),
                contacts: this.data.contacts || [],
                news: this.data.news || [],
                achievements: this.data.achievements || [],
                gallery: this.data.gallery || [],
                competitions: this.data.competitions || [],
                registrations: this.data.registrations || []
            };
            localStorage.setItem('bidpora_public_bridge', JSON.stringify(publicData));
        } catch(_) {}
    }

    updateDashboardCounters(customData = null) {
        let counts;
        
        if (customData) {
            // Use custom data from keolahragaan form
            counts = {
                atlet: customData.jumlah_atlet,
                tenaga: customData.jumlah_tenaga,
                cabor: customData.jumlah_cabor
            };
        } else {
            // Load from localStorage keolahragaan data or use defaults
            const savedData = localStorage.getItem('bidpora_keolahragaan');
            if (savedData) {
                try {
                    const keolahragaanData = JSON.parse(savedData);
                    counts = {
                        atlet: keolahragaanData.jumlah_atlet,
                        tenaga: keolahragaanData.jumlah_tenaga,
                        cabor: keolahragaanData.jumlah_cabor
                    };
                } catch(e) {
                    counts = { atlet: 180, tenaga: 54, cabor: 67 };
                }
            } else {
                counts = { atlet: 180, tenaga: 54, cabor: 67 };
            }
        }
        
        const atletCard = document.querySelector('.info-card.blue .number');
        const tenagaCard = document.querySelector('.info-card.green .number');
        const caborCard = document.querySelector('.info-card.yellow .number');
        
        if (atletCard) atletCard.textContent = counts.atlet;
        if (tenagaCard) tenagaCard.textContent = counts.tenaga;
        if (caborCard) caborCard.textContent = counts.cabor;
        
        // Save to localStorage for dashboard charts
        localStorage.setItem('bidpora_dashboard', JSON.stringify(counts));
        
        // Update charts if available
        if (window.updateDashboardCharts) {
            window.updateDashboardCharts();
        }
    }

    updateAllRelatedPages() {
        // Update halaman Data E-Kompetisi jika ada
        if (window.updateEkompetisiData) {
            window.updateEkompetisiData(this.data.ekompetisi);
        }
        
        // Update halaman lain jika ada
        try { localStorage.setItem('bidpora_public_cache', JSON.stringify(this.data)); } catch(_) {}
    }

    renderTable(type) {
        const table = document.getElementById(`${type}Table`);
        if (!table) return;

        const tbody = table.querySelector('tbody');
        let data = [];
        switch(type) {
            case 'achievement':
                data = this.data.achievements || [];
                break;
            case 'gallery':
                data = this.data.gallery || [];
                break;
            case 'event':
                data = this.data.events || [];
                break;
            case 'medal':
                data = this.data.medal_tallies || [];
                break;
            case 'match':
                data = this.data.match_schedules || [];
                break;
            case 'result':
                data = this.data.results || [];
                break;
            case 'contact':
                data = this.data.contacts || [];
                break;
            case 'competition':
                data = this.data.competitions || [];
                break;
            case 'registration':
                data = this.data.registrations || [];
                // Apply competition filter if selected
                const filterCompetition = document.getElementById('filterCompetition');
                if (filterCompetition && filterCompetition.value) {
                    data = data.filter(reg => reg.competition_id == filterCompetition.value);
                }
                break;
            default:
                data = this.data[type] || [];
        }
        
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
                            <td>${item.date ? new Date(item.date).toLocaleDateString('id-ID') : ''}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-view" onclick="contentManager.showDetailModal('achievement', ${item.id})" title="Detail">
                                        <i class="fas fa-eye"></i>
                                    </button>
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
                                    <button class="btn-view" onclick="contentManager.showDetailModal('gallery', ${item.id})" title="Detail">
                                        <i class="fas fa-eye"></i>
                                    </button>
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
                                    <button class="btn-view" onclick="contentManager.showDetailModal('event', ${item.id})" title="Detail">
                                        <i class="fas fa-eye"></i>
                                    </button>
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
                case 'medal':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.competition_name || ''}</strong></td>
                            <td>${item.gold_count || 0}</td>
                            <td>${item.silver_count || 0}</td>
                            <td>${item.bronze_count || 0}</td>
                            <td>${item.competition_date || ''}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditMedalForm(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn-delete" onclick="contentManager.deleteMedal(${item.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'match':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.sport || ''}</strong></td>
                            <td>${item.team_a || ''} vs ${item.team_b || ''}</td>
                            <td>${item.match_date || ''}</td>
                            <td>${item.match_time || ''}</td>
                            <td>${item.venue || ''}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditMatchForm(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn-delete" onclick="contentManager.deleteMatch(${item.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'result':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.sport || ''}</strong></td>
                            <td>${item.team_a || ''}</td>
                            <td>${item.team_b || ''}</td>
                            <td>${item.score || ''}</td>
                            <td>${item.status || ''}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditResultForm(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn-delete" onclick="contentManager.deleteResult(${item.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'contact':
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><span class="badge ${item.type || ''}">${item.type || ''}</span></td>
                            <td><strong>${item.title || ''}</strong></td>
                            <td>${item.value || ''}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-edit" onclick="contentManager.showEditContactForm(${item.id})" title="Edit"><i class="fas fa-edit"></i></button>
                                    <button class="btn-delete" onclick="contentManager.deleteContact(${item.id})" title="Hapus"><i class="fas fa-trash"></i></button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'competition':
                    const registrationCount = this.data.registrations.filter(reg => reg.competition_id == item.id).length;
                    const statusClass = item.status === 'open' ? 'published' : item.status === 'closed' ? 'draft' : '';
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.title || ''}</strong></td>
                            <td>${item.sport_category || ''}</td>
                            <td>${item.start_date ? new Date(item.start_date).toLocaleDateString('id-ID') : ''} - ${item.end_date ? new Date(item.end_date).toLocaleDateString('id-ID') : ''}</td>
                            <td>${item.registration_start ? new Date(item.registration_start).toLocaleDateString('id-ID') : ''} - ${item.registration_end ? new Date(item.registration_end).toLocaleDateString('id-ID') : ''}</td>
                            <td><span class="status-badge ${statusClass}">${item.status || ''}</span></td>
                            <td>${registrationCount}${item.max_participants ? `/${item.max_participants}` : ''}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-view" onclick="contentManager.showDetailModal('competition', ${item.id})" title="Detail">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="btn-edit" onclick="contentManager.showEditCompetitionForm(${item.id})" title="Edit">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn-delete" onclick="contentManager.deleteCompetition(${item.id})" title="Hapus">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                case 'registration':
                    const competition = this.data.competitions.find(c => c.id == item.competition_id);
                    const statusBadgeClass = item.status === 'approved' ? 'published' : item.status === 'pending' ? 'draft' : 'badge-danger';
                    return `
                        <tr>
                            <td>${index + 1}</td>
                            <td><strong>${item.participant_name || ''}</strong></td>
                            <td>${competition ? competition.title : 'Unknown'}</td>
                            <td>${item.gender || ''}</td>
                            <td>${item.birth_date ? new Date(item.birth_date).toLocaleDateString('id-ID') : ''}</td>
                            <td>${item.school_institution || '-'}</td>
                            <td>${item.phone_number || ''}</td>
                            <td>${item.registration_date ? new Date(item.registration_date).toLocaleDateString('id-ID') : ''}</td>
                            <td><span class="status-badge ${statusBadgeClass}">${item.status || ''}</span></td>
                            <td>
                                <div class="action-buttons">
                                    <button class="btn-view" onclick="contentManager.viewRegistrationDetail(${item.id})" title="Detail">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <select onchange="contentManager.updateRegistrationStatus(${item.id}, this.value)" style="padding:2px;font-size:11px;margin-right:3px;">
                                        <option value="pending" ${item.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="approved" ${item.status === 'approved' ? 'selected' : ''}>Approved</option>
                                        <option value="rejected" ${item.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                                    </select>
                                    <button class="btn-delete" onclick="contentManager.deleteRegistration(${item.id})" title="Hapus">
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
            case 'medal':
                return ['competition_name'];
            case 'match':
                return ['sport', 'team_a', 'team_b', 'venue'];
            case 'result':
                return ['sport', 'team_a', 'team_b', 'status'];
            case 'contact':
                return ['type', 'title', 'value'];
            case 'competition':
                return ['title', 'sport_category', 'location', 'status'];
            case 'registration':
                return ['participant_name', 'gender', 'school_institution', 'phone_number'];
            default:
                return [];
        }
    }

    showNotification(message, type = 'info') {
        alert(message);
    }

    // Detail Modal Management
    showDetailModal(type, id) {
        let item;
        switch(type) {
            case 'achievement':
                item = this.data.achievements.find(a => a.id == id);
                break;
            case 'gallery':
                item = this.data.gallery.find(g => g.id == id);
                break;
            case 'event':
                item = this.data.events.find(e => e.id == id);
                break;
            case 'news':
                item = this.data.news.find(n => n.id == id);
                break;
            default:
                return;
        }

        if (!item) return;

        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');

        let content = '';
        switch(type) {
            case 'achievement':
                modalTitle.textContent = 'Detail Prestasi';
                content = `
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="detail-image">` : ''}
                    <div class="detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Judul:</span>
                            <span class="meta-value">${item.title}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Kategori:</span>
                            <span class="meta-value">${item.category}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Tanggal:</span>
                            <span class="meta-value">${item.date ? new Date(item.date).toLocaleDateString('id-ID') : ''}</span>
                        </div>
                    </div>
                    <div class="detail-content">
                        <h4>Deskripsi:</h4>
                        <p>${item.description || ''}</p>
                    </div>
                `;
                break;
            case 'gallery':
                modalTitle.textContent = 'Detail Galeri';
                content = `
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="detail-image">` : ''}
                    <div class="detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Judul:</span>
                            <span class="meta-value">${item.title}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Kategori:</span>
                            <span class="meta-value">${item.category}</span>
                        </div>
                    </div>
                    <div class="detail-content">
                        <h4>Deskripsi:</h4>
                        <p>${item.description || ''}</p>
                    </div>
                `;
                break;
            case 'event':
                modalTitle.textContent = 'Detail Event';
                content = `
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="detail-image">` : ''}
                    <div class="detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Judul:</span>
                            <span class="meta-value">${item.title}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Tanggal:</span>
                            <span class="meta-value">${item.event_date ? new Date(item.event_date).toLocaleDateString('id-ID') : ''}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Waktu:</span>
                            <span class="meta-value">${item.event_time || '-'}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Lokasi:</span>
                            <span class="meta-value">${item.location}</span>
                        </div>
                    </div>
                    <div class="detail-content">
                        <h4>Deskripsi:</h4>
                        <p>${item.description || ''}</p>
                    </div>
                `;
                break;
            case 'news':
                modalTitle.textContent = 'Detail Berita';
                content = `
                    ${item.image_url ? `<img src="${item.image_url}" alt="${item.title}" class="detail-image">` : ''}
                    <div class="detail-meta">
                        <div class="meta-item">
                            <span class="meta-label">Judul:</span>
                            <span class="meta-value">${item.title}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Penulis:</span>
                            <span class="meta-value">${item.author}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Tanggal:</span>
                            <span class="meta-value">${item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : ''}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Status:</span>
                            <span class="meta-value">${item.is_published ? 'Published' : 'Draft'}</span>
                        </div>
                    </div>
                    <div class="detail-content">
                        <h4>Konten:</h4>
                        <p>${item.content || ''}</p>
                    </div>
                `;
                break;
        }

        modalBody.innerHTML = content;
        modal.style.display = 'block';
    }
}

// Global functions for HTML onclick events
function showAddAchievementForm() { contentManager.showAddAchievementForm(); }
function hideAchievementForm() { contentManager.hideForm('achievement'); }

function showAddGalleryForm() { contentManager.showAddGalleryForm(); }
function hideGalleryForm() { contentManager.hideForm('gallery'); }

function showAddEventForm() { contentManager.showAddEventForm(); }
function hideEventForm() { contentManager.hideForm('event'); }

function showAddMedalForm() { contentManager.showAddMedalForm(); }
function hideMedalForm() { contentManager.hideForm('medal'); }

function showAddMatchForm() { contentManager.showAddMatchForm(); }
function hideMatchForm() { contentManager.hideForm('match'); }

function showAddResultForm() { contentManager.showAddResultForm(); }
function hideResultForm() { contentManager.hideForm('result'); }

function showAddContactForm() { contentManager.showAddContactForm(); }
function hideContactForm() { contentManager.hideForm('contact'); }

function showAddCompetitionForm() { contentManager.showAddCompetitionForm(); }
function hideCompetitionForm() { contentManager.hideForm('competition'); }

function exportRegistrations() {
    const data = contentManager.data.registrations;
    if (!data.length) {
        alert('Tidak ada data untuk diekspor');
        return;
    }
    
    // Simple CSV export
    let csv = 'No,Nama,Lomba,Jenis Kelamin,Tanggal Lahir,Alamat,Cabang Olahraga,Pendidikan,Sekolah/Instansi,No HP,NISN,Tanggal Daftar,Status\n';
    data.forEach((reg, index) => {
        const competition = contentManager.data.competitions.find(c => c.id == reg.competition_id);
        csv += `${index + 1},"${reg.participant_name}","${competition ? competition.title : 'Unknown'}","${reg.gender}","${reg.birth_date}","${reg.full_address}","${reg.sport_category}","${reg.education_level || ''}","${reg.school_institution || ''}","${reg.phone_number}","${reg.nisn || ''}","${reg.registration_date}","${reg.status}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-pendaftar-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Keolahragaan functions
function resetKeolahragaan() {
    if (confirm('Reset ke data default (180 atlet, 54 tenaga, 67 cabor)?')) {
        document.getElementById('jumlah-atlet').value = 180;
        document.getElementById('jumlah-tenaga').value = 54;
        document.getElementById('jumlah-cabor').value = 67;
        
        document.getElementById('preview-atlet').textContent = 180;
        document.getElementById('preview-tenaga').textContent = 54;
        document.getElementById('preview-cabor').textContent = 67;
    }
}

// Modal functions
function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.contentManager = new ContentManager();
});
