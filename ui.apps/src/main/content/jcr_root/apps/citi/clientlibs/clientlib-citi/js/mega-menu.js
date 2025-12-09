/**
 * Mega Menu JavaScript for Citibank Singapore Recreation
 * Enhanced navigation functionality
 */

(function() {
    'use strict';

    class MegaMenu {
        constructor() {
            this.menuTabs = document.querySelectorAll('.mega-menu-tab');
            this.activeTab = null;
            this.isMobile = window.innerWidth < 1280;
            this.init();
        }

        init() {
            this.setupEventListeners();
            this.setupKeyboardNavigation();
            this.setupMobileBehavior();
        }

        setupEventListeners() {
            this.menuTabs.forEach(tab => {
                const label = tab.querySelector('.mega-menu-label');
                const panel = tab.querySelector('.mega-menu-panel');
                
                if (label && panel) {
                    // Mouse events for desktop
                    if (!this.isMobile) {
                        tab.addEventListener('mouseenter', () => this.openMenu(tab));
                        tab.addEventListener('mouseleave', () => this.closeMenu(tab));
                    }
                    
                    // Click events for mobile
                    label.addEventListener('click', (e) => {
                        if (this.isMobile) {
                            e.preventDefault();
                            this.toggleMenu(tab);
                        }
                    });
                }
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.mega-menu-tab')) {
                    this.closeAllMenus();
                }
            });

            // Handle window resize
            window.addEventListener('resize', () => {
                const wasMobile = this.isMobile;
                this.isMobile = window.innerWidth < 1280;
                
                if (wasMobile !== this.isMobile) {
                    this.handleResponsiveChange();
                }
            });
        }

        setupKeyboardNavigation() {
            this.menuTabs.forEach(tab => {
                const label = tab.querySelector('.mega-menu-label');
                const panel = tab.querySelector('.mega-menu-panel');
                
                if (label && panel) {
                    label.addEventListener('keydown', (e) => {
                        switch (e.key) {
                            case 'Enter':
                            case ' ':
                                e.preventDefault();
                                this.toggleMenu(tab);
                                break;
                            case 'Escape':
                                this.closeAllMenus();
                                break;
                            case 'ArrowDown':
                                e.preventDefault();
                                this.focusFirstMenuItem(panel);
                                break;
                        }
                    });

                    // Handle keyboard navigation within menu panels
                    panel.addEventListener('keydown', (e) => {
                        this.handlePanelKeyboardNavigation(e, panel);
                    });
                }
            });
        }

        setupMobileBehavior() {
            // Add mobile-specific classes and behaviors
            if (this.isMobile) {
                this.menuTabs.forEach(tab => {
                    tab.classList.add('mobile-menu-tab');
                });
            }
        }

        openMenu(tab) {
            if (this.isMobile) return;
            
            this.closeAllMenus();
            const panel = tab.querySelector('.mega-menu-panel');
            if (panel) {
                panel.classList.remove('hidden');
                this.activeTab = tab;
                tab.classList.add('active');
                
                // Add ARIA attributes
                const label = tab.querySelector('.mega-menu-label');
                if (label) {
                    label.setAttribute('aria-expanded', 'true');
                }
            }
        }

        closeMenu(tab) {
            if (this.isMobile) return;
            
            const panel = tab.querySelector('.mega-menu-panel');
            if (panel) {
                panel.classList.add('hidden');
                tab.classList.remove('active');
                
                // Remove ARIA attributes
                const label = tab.querySelector('.mega-menu-label');
                if (label) {
                    label.setAttribute('aria-expanded', 'false');
                }
            }
            
            if (this.activeTab === tab) {
                this.activeTab = null;
            }
        }

        toggleMenu(tab) {
            const panel = tab.querySelector('.mega-menu-panel');
            const isOpen = panel && !panel.classList.contains('hidden');
            
            if (isOpen) {
                this.closeMenu(tab);
            } else {
                this.openMenu(tab);
            }
        }

        closeAllMenus() {
            this.menuTabs.forEach(tab => {
                this.closeMenu(tab);
            });
            this.activeTab = null;
        }

        focusFirstMenuItem(panel) {
            const firstLink = panel.querySelector('a');
            if (firstLink) {
                firstLink.focus();
            }
        }

        handlePanelKeyboardNavigation(e, panel) {
            const focusableElements = panel.querySelectorAll(
                'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length === 0) return;
            
            const currentIndex = Array.from(focusableElements).indexOf(document.activeElement);
            const totalElements = focusableElements.length;
            
            switch (e.key) {
                case 'Tab':
                    // Handle tab trapping
                    if (e.shiftKey && currentIndex === 0) {
                        e.preventDefault();
                        focusableElements[totalElements - 1].focus();
                    } else if (!e.shiftKey && currentIndex === totalElements - 1) {
                        e.preventDefault();
                        focusableElements[0].focus();
                    }
                    break;
                    
                case 'Escape':
                    this.closeAllMenus();
                    // Return focus to the menu label
                    const parentTab = panel.closest('.mega-menu-tab');
                    if (parentTab) {
                        const label = parentTab.querySelector('.mega-menu-label');
                        if (label) {
                            label.focus();
                        }
                    }
                    break;
                    
                case 'ArrowDown':
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % totalElements;
                    focusableElements[nextIndex].focus();
                    break;
                    
                case 'ArrowUp':
                    e.preventDefault();
                    const prevIndex = currentIndex === 0 ? totalElements - 1 : currentIndex - 1;
                    focusableElements[prevIndex].focus();
                    break;
            }
        }

        handleResponsiveChange() {
            // Close all menus when switching between mobile and desktop
            this.closeAllMenus();
            
            // Update classes and behaviors
            this.menuTabs.forEach(tab => {
                if (this.isMobile) {
                    tab.classList.add('mobile-menu-tab');
                } else {
                    tab.classList.remove('mobile-menu-tab');
                }
            });
        }

        // Public methods
        getActiveTab() {
            return this.activeTab;
        }

        isMenuOpen(tab) {
            const panel = tab.querySelector('.mega-menu-panel');
            return panel && !panel.classList.contains('hidden');
        }
    }

    // ===== MENU ANIMATIONS =====

    class MenuAnimations {
        constructor() {
            this.setupAnimations();
        }

        setupAnimations() {
            // Add CSS classes for animations
            const style = document.createElement('style');
            style.textContent = `
                .mega-menu-panel {
                    transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
                    transform-origin: top center;
                }
                
                .mega-menu-panel.hidden {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                    visibility: hidden;
                }
                
                .mega-menu-panel:not(.hidden) {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    visibility: visible;
                }
                
                .mega-menu-tab.active .mega-menu-label {
                    background-color: var(--citi-gray-700);
                }
                
                .mega-menu-label:focus-visible {
                    outline: 2px solid var(--citi-blue);
                    outline-offset: 2px;
                }
                
                @media (max-width: 1279px) {
                    .mobile-menu-tab .mega-menu-panel {
                        position: static;
                        transform: none;
                        box-shadow: none;
                        border-top: 1px solid var(--citi-gray-700);
                        margin-top: var(--spacing-sm);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===== MENU CONTENT MANAGEMENT =====

    class MenuContentManager {
        constructor() {
            this.setupContentLoading();
        }

        setupContentLoading() {
            // Handle dynamic content loading if needed
            this.menuTabs.forEach(tab => {
                const panel = tab.querySelector('.mega-menu-panel');
                if (panel && panel.dataset.lazyLoad) {
                    this.loadMenuContent(panel);
                }
            });
        }

        async loadMenuContent(panel) {
            try {
                const response = await fetch(panel.dataset.lazyLoad);
                const content = await response.text();
                panel.innerHTML = content;
                panel.removeAttribute('data-lazy-load');
            } catch (error) {
                console.error('Failed to load menu content:', error);
            }
        }
    }

    // ===== MENU ANALYTICS =====

    class MenuAnalytics {
        constructor() {
            this.setupTracking();
        }

        setupTracking() {
            // Track menu interactions
            document.addEventListener('click', (e) => {
                const menuLink = e.target.closest('.mega-menu-panel a');
                if (menuLink) {
                    this.trackMenuClick(menuLink);
                }
            });
        }

        trackMenuClick(link) {
            // Track menu link clicks for analytics
            const menuData = {
                menuSection: link.closest('.mega-menu-tab')?.querySelector('.mega-menu-label')?.textContent,
                linkText: link.textContent,
                linkUrl: link.href,
                timestamp: new Date().toISOString()
            };
            
            // Send to analytics (implement as needed)
            console.log('Menu click tracked:', menuData);
        }
    }

    // ===== INITIALIZATION =====

    let megaMenuInstance = null;

    function initMegaMenu() {
        if (megaMenuInstance) {
            return megaMenuInstance;
        }

        megaMenuInstance = new MegaMenu();
        new MenuAnimations();
        new MenuContentManager();
        new MenuAnalytics();

        return megaMenuInstance;
    }

    // ===== PUBLIC API =====

    window.MegaMenu = {
        init: initMegaMenu,
        getInstance: () => megaMenuInstance
    };

    // ===== AUTO-INITIALIZATION =====

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMegaMenu);
    } else {
        initMegaMenu();
    }

})();
