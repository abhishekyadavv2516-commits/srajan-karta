/* =============================================
   SRAJAN KARTA — Hero Image Slider
   Crossfade with Ken Burns Effect
   ============================================= */

class HeroSlider {
  constructor() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.hero-dot');
    this.prevBtn = document.querySelector('.hero-prev');
    this.nextBtn = document.querySelector('.hero-next');

    if (this.slides.length === 0) return;

    this.currentIndex = 0;
    this.slideCount = this.slides.length;
    this.autoplayInterval = null;
    this.autoplayDelay = 6000;
    this.isTransitioning = false;

    this.init();
  }

  init() {
    // Set up controls
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.next());
    }

    // Dot navigation
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goTo(index));
    });

    // Touch support
    this.initTouchSupport();

    // Pause on hover
    const hero = document.querySelector('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', () => this.pause());
      hero.addEventListener('mouseleave', () => this.play());
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const hero = document.querySelector('.hero');
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        if (e.key === 'ArrowLeft') this.prev();
        if (e.key === 'ArrowRight') this.next();
      }
    });

    // Start autoplay
    this.play();
  }

  goTo(index) {
    if (this.isTransitioning || index === this.currentIndex) return;
    this.isTransitioning = true;

    // Reset Ken Burns on current slide
    this.slides[this.currentIndex].classList.remove('active');
    this.slides[this.currentIndex].style.animation = 'none';

    // Activate new slide
    this.currentIndex = index;
    const currentSlide = this.slides[this.currentIndex];
    currentSlide.style.animation = 'none';

    // Force reflow to restart animation
    void currentSlide.offsetWidth;

    currentSlide.classList.add('active');
    currentSlide.style.animation = '';

    // Update dots
    this.dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });

    // Reset autoplay
    this.pause();
    this.play();

    setTimeout(() => {
      this.isTransitioning = false;
    }, 1200);
  }

  next() {
    const nextIndex = (this.currentIndex + 1) % this.slideCount;
    this.goTo(nextIndex);
  }

  prev() {
    const prevIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;
    this.goTo(prevIndex);
  }

  play() {
    this.pause();
    this.autoplayInterval = setInterval(() => this.next(), this.autoplayDelay);
  }

  pause() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  initTouchSupport() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    let startX = 0;
    let endX = 0;
    const minSwipeDistance = 50;

    hero.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) >= minSwipeDistance) {
        if (diff > 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }, { passive: true });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new HeroSlider();
});
