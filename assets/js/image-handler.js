// Image Handler untuk Website SIMPORA
// Menangani loading gambar dan fallback ke placeholder

class ImageHandler {
    constructor() {
        this.placeholderBase = 'https://via.placeholder.com/';
        this.init();
    }

    init() {
        // Handle semua gambar yang gagal load
        document.addEventListener('DOMContentLoaded', () => {
            this.setupImageFallbacks();
            this.preloadImages();
        });
    }

    setupImageFallbacks() {
        const images = document.querySelectorAll('img[data-fallback]');
        
        images.forEach(img => {
            img.addEventListener('error', (e) => {
                const fallback = e.target.getAttribute('data-fallback');
                if (fallback && e.target.src !== fallback) {
                    e.target.src = fallback;
                }
            });
        });
    }

    preloadImages() {
        const imageUrls = [
            'assets/images/pomnas-ceremony.jpg',
            'assets/images/basketball-championship.jpg',
            'assets/images/karate-competition.jpg',
            'assets/images/swimming-competition.jpg',
            'assets/images/football-match.jpg',
            'assets/images/athletics-competition.jpg'
        ];

        imageUrls.forEach(url => {
            const img = new Image();
            img.src = url;
        });
    }

    // Method untuk generate placeholder berdasarkan konteks
    generatePlaceholder(width, height, text, bgColor = '4A90E2', textColor = 'FFFFFF') {
        return `${this.placeholderBase}${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`;
    }

    // Method untuk update gambar berita dari database
    updateNewsImage(newsId, imageUrl) {
        const newsCard = document.querySelector(`[data-news-id="${newsId}"]`);
        if (newsCard) {
            const img = newsCard.querySelector('.news-image img');
            if (img) {
                img.src = imageUrl;
            }
        }
    }

    // Method untuk lazy loading gambar
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// CSS untuk lazy loading
const lazyLoadingCSS = `
    img.lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    img.lazy.loaded {
        opacity: 1;
    }
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = lazyLoadingCSS;
document.head.appendChild(style);

// Initialize Image Handler
const imageHandler = new ImageHandler();

// Export untuk penggunaan di file lain
window.ImageHandler = ImageHandler;
