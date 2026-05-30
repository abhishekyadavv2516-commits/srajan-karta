/* =============================================
   SRAJAN KARTA — Gallery & Lightbox
   Masonry Layout · Category Filters · Lightbox Modal
   ============================================= */

class Gallery {
  constructor() {
    this.filterBtns = document.querySelectorAll('.filter-btn');
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImage = document.querySelector('.lightbox-image');
    this.lightboxCaption = document.querySelector('.lightbox-caption');
    this.lightboxClose = document.querySelector('.lightbox-close');
    this.lightboxPrev = document.querySelector('.lightbox-prev');
    this.lightboxNext = document.querySelector('.lightbox-next');

    this.currentFilter = 'all';
    this.currentLightboxIndex = 0;
    this.visibleItems = [];

    if (this.galleryItems.length === 0) return;

    this.init();
  }

  init() {
    // Show all items initially
    this.filterItems('all');

    // Filter buttons
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.filterItems(filter);

        // Update active button
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Lightbox click handlers
    this.galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.openLightbox(item);
      });
    });

    // Lightbox controls
    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightboxPrev) {
      this.lightboxPrev.addEventListener('click', () => this.prevImage());
    }
    if (this.lightboxNext) {
      this.lightboxNext.addEventListener('click', () => this.nextImage());
    }

    // Close lightbox on background click
    if (this.lightbox) {
      this.lightbox.addEventListener('click', (e) => {
        if (e.target === this.lightbox) {
          this.closeLightbox();
        }
      });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox || !this.lightbox.classList.contains('open')) return;

      switch (e.key) {
        case 'Escape':
          this.closeLightbox();
          break;
        case 'ArrowLeft':
          this.prevImage();
          break;
        case 'ArrowRight':
          this.nextImage();
          break;
      }
    });
  }

  filterItems(filter) {
    this.currentFilter = filter;

    this.galleryItems.forEach((item, index) => {
      const category = item.getAttribute('data-category');
      const shouldShow = filter === 'all' || category === filter;

      if (shouldShow) {
        // Stagger the appearance
        setTimeout(() => {
          item.style.display = '';
          // Force reflow
          void item.offsetWidth;
          item.classList.add('show');
        }, index * 50);
      } else {
        item.classList.remove('show');
        setTimeout(() => {
          item.style.display = 'none';
        }, 400);
      }
    });

    // Update visible items array for lightbox navigation
    setTimeout(() => {
      this.visibleItems = Array.from(this.galleryItems).filter(item => {
        return item.classList.contains('show');
      });
    }, 500);
  }

  openLightbox(item) {
    if (!this.lightbox || !this.lightboxImage) return;

    const img = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-title');
    const categoryEl = item.querySelector('.gallery-category');

    if (img) {
      this.lightboxImage.src = img.src;
      this.lightboxImage.alt = img.alt;
    }

    if (this.lightboxCaption) {
      const title = titleEl ? titleEl.textContent : '';
      const category = categoryEl ? categoryEl.textContent : '';
      this.lightboxCaption.textContent = title + (category ? ' — ' + category : '');
    }

    // Find index in visible items
    this.currentLightboxIndex = this.visibleItems.indexOf(item);

    this.lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  prevImage() {
    if (this.visibleItems.length === 0) return;
    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
    this.updateLightboxImage();
  }

  nextImage() {
    if (this.visibleItems.length === 0) return;
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.visibleItems.length;
    this.updateLightboxImage();
  }

  updateLightboxImage() {
    const item = this.visibleItems[this.currentLightboxIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const titleEl = item.querySelector('.gallery-title');
    const categoryEl = item.querySelector('.gallery-category');

    // Animate image change
    this.lightboxImage.style.opacity = '0';
    this.lightboxImage.style.transform = 'scale(0.95)';

    setTimeout(() => {
      if (img) {
        this.lightboxImage.src = img.src;
        this.lightboxImage.alt = img.alt;
      }

      if (this.lightboxCaption) {
        const title = titleEl ? titleEl.textContent : '';
        const category = categoryEl ? categoryEl.textContent : '';
        this.lightboxCaption.textContent = title + (category ? ' — ' + category : '');
      }

      this.lightboxImage.style.opacity = '1';
      this.lightboxImage.style.transform = 'scale(1)';
    }, 200);
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Gallery();
});
