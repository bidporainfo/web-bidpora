// CRUD News Management
class NewsManager {
    constructor() {
        this.newsData = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.searchTerm = '';
        this.init();
    }

    async init() {
        await this.loadNews();
        this.setupEventListeners();
        this.renderNewsTable();
    }

    async loadNews() {
        try {
            const response = await fetch('data/database.json');
            const data = await response.json();
            this.newsData = data.news || [];
        } catch (error) {
            console.error('Error loading news:', error);
            this.newsData = [];
        }
    }

    setupEventListeners() {
        // Form submit
        document.getElementById('news-form-element').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveNews();
        });

        // Search
        document.getElementById('newsSearch').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderNewsTable();
        });

        // Page size
        document.getElementById('newsPageSize').addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderNewsTable();
        });
    }

    showAddForm() {
        document.getElementById('form-title').textContent = 'Tambah Berita Baru';
        document.getElementById('news-form-element').reset();
        document.getElementById('news-id').value = '';
        document.getElementById('news-form').style.display = 'block';
        document.getElementById('news-title').focus();
    }

    showEditForm(newsId) {
        const news = this.newsData.find(n => n.id == newsId);
        if (!news) return;

        document.getElementById('form-title').textContent = 'Edit Berita';
        document.getElementById('news-id').value = news.id;
        document.getElementById('news-title').value = news.title;
        document.getElementById('news-content').value = news.content;
        document.getElementById('news-author').value = news.author;
        document.getElementById('news-published').checked = news.is_published;
        document.getElementById('news-form').style.display = 'block';
        document.getElementById('news-title').focus();
    }

    hideForm() {
        document.getElementById('news-form').style.display = 'none';
    }

    async saveNews() {
        const formData = new FormData(document.getElementById('news-form-element'));
        const newsId = document.getElementById('news-id').value;
        
        const newsData = {
            title: document.getElementById('news-title').value,
            content: document.getElementById('news-content').value,
            author: document.getElementById('news-author').value,
            is_published: document.getElementById('news-published').checked,
            published_at: new Date().toISOString()
        };

        // Handle image upload
        const imageFile = document.getElementById('news-image').files[0];
        if (imageFile) {
            // For now, we'll use a placeholder. In real implementation, you'd upload to a service
            newsData.image_url = `assets/images/uploaded/${Date.now()}_${imageFile.name}`;
        } else if (newsId) {
            // Keep existing image if no new image uploaded
            const existingNews = this.newsData.find(n => n.id == newsId);
            if (existingNews) {
                newsData.image_url = existingNews.image_url;
            }
        }

        if (newsId) {
            // Update existing news
            const index = this.newsData.findIndex(n => n.id == newsId);
            if (index !== -1) {
                this.newsData[index] = { ...this.newsData[index], ...newsData };
            }
        } else {
            // Add new news
            const newId = Math.max(...this.newsData.map(n => n.id), 0) + 1;
            this.newsData.push({
                id: newId,
                ...newsData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }

        // Save to JSON (in real implementation, this would be an API call)
        await this.saveToDatabase();
        
        this.hideForm();
        this.renderNewsTable();
        this.showNotification('Berita berhasil disimpan!', 'success');
    }

    async deleteNews(newsId) {
        if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;

        this.newsData = this.newsData.filter(n => n.id != newsId);
        await this.saveToDatabase();
        this.renderNewsTable();
        this.showNotification('Berita berhasil dihapus!', 'success');
    }

    async saveToDatabase() {
        // In a real implementation, this would be an API call to update the database
        // For now, we'll just update the local data
        console.log('News data updated:', this.newsData);
        // Note: In GitHub Pages, you can't directly write to files
        // You would need a backend service or use a service like Netlify Forms, Formspree, etc.
    }

    renderNewsTable() {
        const tbody = document.querySelector('#newsTable tbody');
        if (!tbody) return;

        // Filter and search
        let filteredNews = this.newsData.filter(news => 
            news.title.toLowerCase().includes(this.searchTerm) ||
            news.author.toLowerCase().includes(this.searchTerm) ||
            news.content.toLowerCase().includes(this.searchTerm)
        );

        // Sort by published_at (newest first)
        filteredNews.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

        // Pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedNews = filteredNews.slice(startIndex, endIndex);

        tbody.innerHTML = paginatedNews.map((news, index) => `
            <tr>
                <td>${startIndex + index + 1}</td>
                <td>
                    <div class="news-title-cell">
                        <strong>${news.title}</strong>
                        ${news.image_url ? '<br><small class="text-muted">📷 Memiliki gambar</small>' : ''}
                    </div>
                </td>
                <td>${news.author}</td>
                <td>${new Date(news.published_at).toLocaleDateString('id-ID')}</td>
                <td>
                    <span class="status-badge ${news.is_published ? 'published' : 'draft'}">
                        ${news.is_published ? 'Diterbitkan' : 'Draft'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-edit" onclick="newsManager.showEditForm(${news.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-delete" onclick="newsManager.deleteNews(${news.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        // Update pagination info
        this.updatePaginationInfo(filteredNews.length);
    }

    updatePaginationInfo(totalItems) {
        const startItem = (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, totalItems);
        
        // You can add pagination controls here if needed
        console.log(`Showing ${startItem} to ${endItem} of ${totalItems} entries`);
    }

    showNotification(message, type = 'info') {
        // Simple notification - you can enhance this
        alert(message);
    }
}

// Global functions for HTML onclick events
function showAddNewsForm() {
    newsManager.showAddForm();
}

function hideNewsForm() {
    newsManager.hideForm();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('newsTable')) {
        window.newsManager = new NewsManager();
    }
});
