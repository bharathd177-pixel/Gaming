/**
 * Main JavaScript for Citibank Singapore Recreation
 * Core functionality and utilities
 */

(function() {
    'use strict';

    // ===== UTILITY FUNCTIONS =====

    /**
     * Debounce function to limit function calls
     */
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    /**
     * Throttle function to limit function calls
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Check if element is in viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Smooth scroll to element
     */
    function smoothScrollTo(element, duration = 500) {
        const targetPosition = element.offsetTop;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // ===== CORE FUNCTIONALITY =====

    /**
     * Initialize all components
     */
    function init() {
        console.log('Initializing Citibank Singapore website...');
        
        // Initialize components
        initMegaMenu();
        initMobileMenu();
        initHeroCarousel();
        initScrollEffects();
        initAccessibility();
        
        // Add event listeners
        addEventListeners();
        
        console.log('Website initialization complete');
    }

    /**
     * Add global event listeners
     */
    function addEventListeners() {
        // Window resize
        window.addEventListener('resize', debounce(handleResize, 250));
        
        // Scroll events
        window.addEventListener('scroll', throttle(handleScroll, 16));
        
        // Keyboard navigation
        document.addEventListener('keydown', handleKeydown);
        
        // Focus management
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Recalculate any dynamic layouts
        updateLayout();
    }

    /**
     * Handle scroll events
     */
    function handleScroll() {
        // Update scroll-based effects
        updateScrollEffects();
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(event) {
        // Escape key to close menus
        if (event.key === 'Escape') {
            closeAllMenus();
        }
        
        // Tab key navigation
        if (event.key === 'Tab') {
            handleTabNavigation(event);
        }
    }

    /**
     * Handle focus management
     */
    function handleFocusIn(event) {
        const target = event.target;
        
        // Add focus styles
        if (target.classList.contains('mega-menu-label')) {
            target.classList.add('focus-visible');
        }
    }

    function handleFocusOut(event) {
        const target = event.target;
        
        // Remove focus styles
        if (target.classList.contains('mega-menu-label')) {
            target.classList.remove('focus-visible');
        }
    }

    /**
     * Close all open menus
     */
    function closeAllMenus() {
        // Close mega menu panels
        const megaMenuPanels = document.querySelectorAll('.mega-menu-panel');
        megaMenuPanels.forEach(panel => {
            panel.classList.add('hidden');
        });
        
        // Close mobile menu
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        
        // Close sign on menu
        const signOnDetails = document.querySelector('.sign-on-menu details');
        if (signOnDetails) {
            signOnDetails.removeAttribute('open');
        }
    }

    /**
     * Handle tab navigation
     */
    function handleTabNavigation(event) {
        // Trap focus in mega menu when open
        const activeMegaMenu = document.querySelector('.mega-menu-panel:not(.hidden)');
        if (activeMegaMenu) {
            const focusableElements = activeMegaMenu.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                } else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    /**
     * Update layout calculations
     */
    function updateLayout() {
        // Recalculate any dynamic heights or positions
        const header = document.querySelector('.site-header');
        if (header) {
            const headerHeight = header.offsetHeight;
            document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
        }
    }

    /**
     * Update scroll-based effects
     */
    function updateScrollEffects() {
        const scrollY = window.pageYOffset;
        
        // Add scroll class to body
        if (scrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
        
        // Update header appearance
        updateHeaderAppearance(scrollY);
    }

    /**
     * Update header appearance based on scroll
     */
    function updateHeaderAppearance(scrollY) {
        const header = document.querySelector('.site-header');
        if (!header) return;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // ===== COMPONENT INITIALIZATION =====

    /**
     * Initialize mega menu functionality
     */
    function initMegaMenu() {
        const megaMenuTabs = document.querySelectorAll('.mega-menu-tab');
        
        megaMenuTabs.forEach(tab => {
            const label = tab.querySelector('.mega-menu-label');
            const panel = tab.querySelector('.mega-menu-panel');
            
            if (label && panel) {
                // Mouse events
                tab.addEventListener('mouseenter', () => {
                    closeAllMenus();
                    panel.classList.remove('hidden');
                });
                
                tab.addEventListener('mouseleave', () => {
                    setTimeout(() => {
                        if (!tab.matches(':hover')) {
                            panel.classList.add('hidden');
                        }
                    }, 100);
                });
                
                // Keyboard events
                label.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        const isOpen = !panel.classList.contains('hidden');
                        
                        if (isOpen) {
                            panel.classList.add('hidden');
                        } else {
                            closeAllMenus();
                            panel.classList.remove('hidden');
                        }
                    }
                });
            }
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.mega-menu-tab')) {
                closeAllMenus();
            }
        });
    }

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isOpen = mobileMenu.classList.contains('active');
                
                if (isOpen) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                } else {
                    mobileMenu.classList.add('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    }

    /**
     * Initialize hero carousel
     */
    function initHeroCarousel() {
        const carousel = document.querySelector('.hero-carousel');
        if (!carousel) return;
        
        const slides = carousel.querySelectorAll('.hero-slide');
        if (slides.length <= 1) return;
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        }
        
        // Auto-advance slides
        setInterval(nextSlide, 5000);
    }

    /**
     * Initialize scroll effects
     */
    function initScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        const animateElements = document.querySelectorAll('.product-card, .insight-card, .section-title');
        animateElements.forEach(el => observer.observe(el));
    }

    /**
     * Initialize accessibility features
     */
    function initAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link sr-only focus:not-sr-only';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 1000;
        `;
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.id = 'main-content';
        }
        
        // Add ARIA labels
        const buttons = document.querySelectorAll('button:not([aria-label])');
        buttons.forEach(button => {
            if (button.textContent.trim()) {
                button.setAttribute('aria-label', button.textContent.trim());
            }
        });
    }

    // ===== PUBLIC API =====

    // Expose functions for external use
    window.CitiBank = {
        init: init,
        smoothScrollTo: smoothScrollTo,
        closeAllMenus: closeAllMenus,
        isInViewport: isInViewport
    };

    // ===== INITIALIZATION =====

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
