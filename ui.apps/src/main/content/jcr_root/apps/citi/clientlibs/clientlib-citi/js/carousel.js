/**
 * Carousel JavaScript for Citibank Singapore Recreation
 * Hero carousel and general carousel functionality
 */

(function() {
    'use strict';

    class Carousel {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                autoplay: true,
                autoplaySpeed: 5000,
                pauseOnHover: true,
                showArrows: true,
                showDots: true,
                infinite: true,
                ...options
            };
            
            this.slides = this.element.querySelectorAll('.carousel-slide, .hero-slide');
            this.currentSlide = 0;
            this.totalSlides = this.slides.length;
            this.autoplayInterval = null;
            this.isPaused = false;
            
            if (this.totalSlides > 1) {
                this.init();
            }
        }

        init() {
            this.createControls();
            this.setupEventListeners();
            this.showSlide(0);
            
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }

        createControls() {
            // Create navigation arrows
            if (this.options.showArrows && this.totalSlides > 1) {
                this.createArrows();
            }
            
            // Create dots navigation
            if (this.options.showDots && this.totalSlides > 1) {
                this.createDots();
            }
            
            // Add carousel wrapper
            this.element.classList.add('carousel-initialized');
        }

        createArrows() {
            const prevArrow = document.createElement('button');
            const nextArrow = document.createElement('button');
            
            prevArrow.className = 'carousel-arrow carousel-arrow--prev';
            nextArrow.className = 'carousel-arrow carousel-arrow--next';
            
            prevArrow.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            nextArrow.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
            
            prevArrow.setAttribute('aria-label', 'Previous slide');
            nextArrow.setAttribute('aria-label', 'Next slide');
            
            prevArrow.addEventListener('click', () => this.prevSlide());
            nextArrow.addEventListener('click', () => this.nextSlide());
            
            this.element.appendChild(prevArrow);
            this.element.appendChild(nextArrow);
            
            this.prevArrow = prevArrow;
            this.nextArrow = nextArrow;
        }

        createDots() {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            
            for (let i = 0; i < this.totalSlides; i++) {
                const dot = document.createElement('button');
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.setAttribute('data-slide', i);
                
                dot.addEventListener('click', () => this.goToSlide(i));
                
                dotsContainer.appendChild(dot);
            }
            
            this.element.appendChild(dotsContainer);
            this.dotsContainer = dotsContainer;
            this.dots = dotsContainer.querySelectorAll('.carousel-dot');
        }

        setupEventListeners() {
            // Pause autoplay on hover
            if (this.options.pauseOnHover) {
                this.element.addEventListener('mouseenter', () => this.pauseAutoplay());
                this.element.addEventListener('mouseleave', () => this.resumeAutoplay());
            }
            
            // Keyboard navigation
            this.element.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.prevSlide();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextSlide();
                }
            });
            
            // Touch/swipe support
            this.setupTouchSupport();
            
            // Visibility change handling
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.pauseAutoplay();
                } else {
                    this.resumeAutoplay();
                }
            });
        }

        setupTouchSupport() {
            let startX = 0;
            let startY = 0;
            let endX = 0;
            let endY = 0;
            
            this.element.addEventListener('touchstart', (e) => {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });
            
            this.element.addEventListener('touchend', (e) => {
                endX = e.changedTouches[0].clientX;
                endY = e.changedTouches[0].clientY;
                
                const diffX = startX - endX;
                const diffY = startY - endY;
                
                // Check if it's a horizontal swipe
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    if (diffX > 0) {
                        this.nextSlide();
                    } else {
                        this.prevSlide();
                    }
                }
            }, { passive: true });
        }

        showSlide(index) {
            // Handle infinite loop
            if (this.options.infinite) {
                if (index < 0) {
                    index = this.totalSlides - 1;
                } else if (index >= this.totalSlides) {
                    index = 0;
                }
            } else {
                index = Math.max(0, Math.min(index, this.totalSlides - 1));
            }
            
            // Hide all slides
            this.slides.forEach((slide, i) => {
                slide.classList.remove('active');
                slide.setAttribute('aria-hidden', 'true');
            });
            
            // Show current slide
            this.slides[index].classList.add('active');
            this.slides[index].setAttribute('aria-hidden', 'false');
            
            // Update current slide index
            this.currentSlide = index;
            
            // Update controls
            this.updateControls();
            
            // Trigger custom event
            this.element.dispatchEvent(new CustomEvent('slideChange', {
                detail: { currentSlide: index, totalSlides: this.totalSlides }
            }));
        }

        updateControls() {
            // Update arrows
            if (this.prevArrow && this.nextArrow) {
                if (!this.options.infinite) {
                    this.prevArrow.disabled = this.currentSlide === 0;
                    this.nextArrow.disabled = this.currentSlide === this.totalSlides - 1;
                }
            }
            
            // Update dots
            if (this.dots) {
                this.dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === this.currentSlide);
                    dot.setAttribute('aria-current', i === this.currentSlide ? 'true' : 'false');
                });
            }
            
            // Update ARIA live region
            this.updateAriaLive();
        }

        updateAriaLive() {
            let liveRegion = this.element.querySelector('.carousel-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.className = 'carousel-live-region sr-only';
                liveRegion.setAttribute('aria-live', 'polite');
                this.element.appendChild(liveRegion);
            }
            
            liveRegion.textContent = `Slide ${this.currentSlide + 1} of ${this.totalSlides}`;
        }

        nextSlide() {
            this.showSlide(this.currentSlide + 1);
        }

        prevSlide() {
            this.showSlide(this.currentSlide - 1);
        }

        goToSlide(index) {
            this.showSlide(index);
        }

        startAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
            }
            
            this.autoplayInterval = setInterval(() => {
                if (!this.isPaused) {
                    this.nextSlide();
                }
            }, this.options.autoplaySpeed);
        }

        pauseAutoplay() {
            this.isPaused = true;
        }

        resumeAutoplay() {
            this.isPaused = false;
        }

        stopAutoplay() {
            if (this.autoplayInterval) {
                clearInterval(this.autoplayInterval);
                this.autoplayInterval = null;
            }
        }

        destroy() {
            this.stopAutoplay();
            this.element.classList.remove('carousel-initialized');
            
            // Remove controls
            if (this.prevArrow) this.prevArrow.remove();
            if (this.nextArrow) this.nextArrow.remove();
            if (this.dotsContainer) this.dotsContainer.remove();
            
            // Remove event listeners
            this.element.removeEventListener('mouseenter', this.pauseAutoplay);
            this.element.removeEventListener('mouseleave', this.resumeAutoplay);
        }
    }

    // ===== HERO CAROUSEL SPECIFIC =====

    class HeroCarousel extends Carousel {
        constructor(element, options = {}) {
            super(element, {
                autoplay: true,
                autoplaySpeed: 6000,
                pauseOnHover: true,
                showArrows: true,
                showDots: true,
                infinite: true,
                ...options
            });
            
            this.setupHeroSpecificFeatures();
        }

        setupHeroSpecificFeatures() {
            // Add hero-specific classes
            this.element.classList.add('hero-carousel');
            
            // Add progress bar
            this.createProgressBar();
            
            // Add slide content animations
            this.setupSlideAnimations();
        }

        createProgressBar() {
            const progressBar = document.createElement('div');
            progressBar.className = 'carousel-progress';
            progressBar.innerHTML = '<div class="carousel-progress-bar"></div>';
            
            this.element.appendChild(progressBar);
            this.progressBar = progressBar.querySelector('.carousel-progress-bar');
        }

        setupSlideAnimations() {
            // Add animation classes to slides
            this.slides.forEach(slide => {
                slide.classList.add('hero-slide');
                
                // Add animation delay to slide content
                const content = slide.querySelector('.hero-content');
                if (content) {
                    content.style.animationDelay = '0.3s';
                }
            });
        }

        showSlide(index) {
            super.showSlide(index);
            
            // Reset progress bar
            if (this.progressBar) {
                this.progressBar.style.width = '0%';
                this.progressBar.style.transition = 'none';
                
                // Trigger reflow
                this.progressBar.offsetHeight;
                
                // Animate progress bar
                this.progressBar.style.transition = `width ${this.options.autoplaySpeed}ms linear`;
                this.progressBar.style.width = '100%';
            }
        }
    }

    // ===== CAROUSEL STYLES =====

    function addCarouselStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .carousel-initialized {
                position: relative;
                overflow: hidden;
            }
            
            .carousel-slide,
            .hero-slide {
                display: none;
                opacity: 0;
                transition: opacity 0.5s ease-in-out;
            }
            
            .carousel-slide.active,
            .hero-slide.active {
                display: block;
                opacity: 1;
            }
            
            .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(0, 0, 0, 0.5);
                color: white;
                border: none;
                border-radius: 50%;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                z-index: 10;
            }
            
            .carousel-arrow:hover {
                background: rgba(0, 0, 0, 0.8);
                transform: translateY(-50%) scale(1.1);
            }
            
            .carousel-arrow:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .carousel-arrow--prev {
                left: 20px;
            }
            
            .carousel-arrow--next {
                right: 20px;
            }
            
            .carousel-dots {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: 8px;
                z-index: 10;
            }
            
            .carousel-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                border: none;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .carousel-dot:hover {
                background: rgba(255, 255, 255, 0.8);
            }
            
            .carousel-dot.active {
                background: white;
                transform: scale(1.2);
            }
            
            .carousel-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                z-index: 10;
            }
            
            .carousel-progress-bar {
                height: 100%;
                background: white;
                width: 0%;
            }
            
            .hero-slide .hero-content {
                animation: slideInUp 0.8s ease-out;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @media (max-width: 768px) {
                .carousel-arrow {
                    width: 40px;
                    height: 40px;
                }
                
                .carousel-arrow--prev {
                    left: 10px;
                }
                
                .carousel-arrow--next {
                    right: 10px;
                }
                
                .carousel-dots {
                    bottom: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== INITIALIZATION =====

    function initCarousels() {
        addCarouselStyles();
        
        // Initialize hero carousels
        const heroCarousels = document.querySelectorAll('.hero-carousel');
        heroCarousels.forEach(carousel => {
            new HeroCarousel(carousel);
        });
        
        // Initialize regular carousels
        const carousels = document.querySelectorAll('.carousel:not(.hero-carousel)');
        carousels.forEach(carousel => {
            new Carousel(carousel);
        });
    }

    // ===== PUBLIC API =====

    window.Carousel = {
        init: initCarousels,
        Carousel: Carousel,
        HeroCarousel: HeroCarousel
    };

    // ===== AUTO-INITIALIZATION =====

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousels);
    } else {
        initCarousels();
    }

})();
