/**
 * Citi Scratch Card Integration
 * Handles random prize selection from multiple prizes configured in AEM
 */

(function() {
    'use strict';

    // Configuration
    const CONTAINER_ID = 'citi-scratch-card-container';
    const MAX_RENDER_ATTEMPTS = 10;
    let renderAttempts = 0;
    let currentRoot = null;

    // Enhanced debug logging
    function debugLog(message, data = null, isError = false) {
        if (window.console && window.console.log) {
            const timestamp = new Date().toISOString();
            const logLevel = isError ? 'ERROR' : 'INFO';
            const logMessage = `[Citi ScratchCard] ${logLevel} ${timestamp}: ${message}`;
            
            if (isError) {
                console.error(logMessage, data);
            } else {
                console.log(logMessage, data);
            }
        }
    }



    // Check if all required dependencies are available
    function checkDependencies() {
        const deps = {
            React: typeof window.React,
            ReactDOM: typeof window.ReactDOM,
            GamificationComponents: typeof window.GamificationComponents,
            ScratchCard: window.GamificationComponents && typeof window.GamificationComponents.ScratchCard
        };
        
        debugLog('Dependency check:', deps);
        
        // Log detailed dependency information
        debugLog('React available:', !!window.React);
        debugLog('ReactDOM available:', !!window.ReactDOM);
        debugLog('GamificationComponents available:', !!window.GamificationComponents);
        if (window.GamificationComponents) {
            debugLog('GamificationComponents keys:', Object.keys(window.GamificationComponents));
            debugLog('ScratchCard available:', !!window.GamificationComponents.ScratchCard);
        }
        
        const missing = Object.entries(deps)
            .filter(([name, value]) => !value)
            .map(([name]) => name);
            
        if (missing.length > 0) {
            debugLog(`Missing dependencies: ${missing.join(', ')}`, null, true);
            return false;
        }
        
        return true;
    }

    // Wait for all required components to be available
    function waitForComponents(callback, maxAttempts = MAX_RENDER_ATTEMPTS) {
        let attempts = 0;
        
        function checkComponents() {
            attempts++;
            debugLog(`Checking for components (attempt ${attempts}/${maxAttempts})`);
            
            if (checkDependencies()) {
                debugLog('All components found, proceeding with initialization');
                callback();
                return;
            }
            
            if (attempts >= maxAttempts) {
                debugLog(`Failed to load components after ${maxAttempts} attempts`, null, true);
                const container = document.getElementById(CONTAINER_ID);
                if (container) {
                    container.innerHTML = `
                        <div style="padding: 20px; text-align: center; color: #666; border: 2px solid #ff0000; background: #fff5f5;">
                            <h3>Component Loading Failed</h3>
                            <p>Unable to load Scratch Card component. Please refresh the page.</p>
                            <p><strong>Missing components:</strong></p>
                            <ul style="text-align: left; display: inline-block;">
                                ${!window.GamificationComponents ? '<li>GamificationComponents</li>' : ''}
                                ${!window.React ? '<li>React</li>' : ''}
                                ${!window.ReactDOM ? '<li>ReactDOM</li>' : ''}
                                ${window.GamificationComponents && !window.GamificationComponents.ScratchCard ? '<li>ScratchCard component</li>' : ''}
                            </ul>
                            <p><strong>Troubleshooting:</strong></p>
                            <ul style="text-align: left; display: inline-block;">
                                <li>Check if clientlibs are properly included</li>
                                <li>Verify React and GamificationComponents are loaded</li>
                                <li>Check browser console for JavaScript errors</li>
                                <li>Try refreshing the page</li>
                            </ul>
                            <p><small>Check browser console for detailed error messages.</small></p>
                        </div>
                    `;
                }
                return;
            }
            
            debugLog(`Components not ready, retrying in 100ms... (${attempts}/${maxAttempts})`);
            setTimeout(checkComponents, 100);
        }
        
        checkComponents();
    }

    // Extract configuration data from DOM attributes with simplified approach like reference
    function extractConfig() {
        const container = document.querySelector('.scratchcard');
        if (!container) {
            debugLog('Container not found, using default config');
            return {};
        }

        const config = {};
        
        // Extract title
        const titleElement = container.querySelector('.scratch-card-default');
        if (titleElement) {
            config.title = titleElement.getAttribute('data-scratch-card-title') || 'Scratch to Win!';
        }

        // Extract prize configuration with random selection from multiple prizes
        const scratchCardDetails = container.querySelector('.scratch-card-details');
        if (scratchCardDetails) {
            const prizesJson = scratchCardDetails.getAttribute('data-scratch-card-details') || '[]';
            try {
                const prizes = JSON.parse(prizesJson);
                debugLog('All available prizes:', prizes);
                
                if (Array.isArray(prizes) && prizes.length > 0) {
                    // Randomly select one prize from the array
                    const randomIndex = Math.floor(Math.random() * prizes.length);
                    const selectedPrize = prizes[randomIndex];
                    debugLog(`Randomly selected prize ${randomIndex + 1} of ${prizes.length}:`, selectedPrize);
                    
                    // Map prize structure to React component structure (simplified like reference)
                    config.prize = {
                        text: selectedPrize.prizeName || 'Congratulations!',
                        value: selectedPrize.prizeCode || '',
                        color: selectedPrize.bgColor || '#4CAF50',
                        icon: selectedPrize.iconPath || '🎉'
                    };
                    
                    debugLog('Mapped prize structure:', config.prize);
                } else {
                    config.prize = null;
                }
            } catch (e) {
                debugLog('Error parsing prize JSON:', e);
                config.prize = null;
            }
        }

        // Ensure we have a default prize if none provided
        if (!config.prize) {
            config.prize = {
                text: '25% Discount',
                value: 'Code: SCRATCH25',
                color: '#4CAF50',
                icon: '🎉'
            };
            debugLog('Using default prize:', config.prize);
        }
        
        debugLog('Extracted configuration:', config);
        return config;
    }

         // Global variable to store the current prize configuration
     let currentPrizeConfig = null;
     
     // Render the Scratch Card component
     function renderScratchCard() {
         const container = document.getElementById(CONTAINER_ID);
         if (!container) {
             debugLog('Container not found for rendering', null, true);
             return;
         }

        // Clear previous content
        container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

        // Unmount previous React component if it exists
        if (currentRoot) {
            try {
                if (window.ReactDOM.unmountComponentAtNode) {
                    window.ReactDOM.unmountComponentAtNode(container);
                }
                currentRoot = null;
            } catch (e) {
                debugLog('Error unmounting previous component:', e, true);
            }
        }

                 const config = extractConfig();
         currentPrizeConfig = config.prize; // Store the current prize config globally
         debugLog('Rendering Scratch Card with config:', config);
         debugLog('Stored prize config:', currentPrizeConfig);

        try {
            // Verify ScratchCard component exists
            if (!window.GamificationComponents || !window.GamificationComponents.ScratchCard) {
                throw new Error('ScratchCard component not found in GamificationComponents');
            }

            const { ScratchCard } = window.GamificationComponents;
            
                         // Create React element with simplified props like reference
             const reactElement = window.React.createElement(ScratchCard, {
                 title: config.title || 'Scratch to Win!',
                 prize: config.prize,
                 variant: 'card',
                 size: 'lg',
                                onReveal: (prize) => {
                    debugLog('=== SCRATCH CARD REVEAL DEBUG ===');
                    debugLog('Raw prize parameter:', prize);
                    debugLog('Current prize config:', currentPrizeConfig);
                    
                    // Simple approach like reference implementation
                    let prizeText = 'Congratulations!';
                    let prizeValue = '';
                    
                    if (currentPrizeConfig) {
                        prizeText = currentPrizeConfig.text || 'Congratulations!';
                        prizeValue = currentPrizeConfig.value || '';
                        debugLog('Using stored prize configuration:', currentPrizeConfig);
                    } else {
                        debugLog('No prize data available, using default');
                    }
                    
                    const displayText = prizeValue ? `${prizeText} - ${prizeValue}` : prizeText;
                    debugLog('Final display text:', displayText);
                    alert(`🎨 You revealed: ${displayText}`);
                }
            });

            // Render based on React version
            if (window.ReactDOM.createRoot) {
                // React 18+
                currentRoot = window.ReactDOM.createRoot(container);
                currentRoot.render(reactElement);
                debugLog('Rendered with React 18 createRoot');
            } else {
                // React 17
                window.ReactDOM.render(reactElement, container);
                debugLog('Rendered with React 17 render');
            }

            // Verify rendering was successful
            verifyRendering(container);
            
        } catch (error) {
            debugLog('Error rendering Scratch Card component:', error, true);
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #666; border: 2px solid #ff0000; background: #fff5f5;">
                    <h3>Rendering Error</h3>
                    <p>Failed to render Scratch Card component: ${error.message}</p>
                    <p><strong>Error details:</strong></p>
                    <pre style="text-align: left; background: #f0f0f0; padding: 10px; border-radius: 4px; font-size: 12px; overflow-x: auto;">${error.stack || error.toString()}</pre>
                    <p><small>Check browser console for additional details.</small></p>
                </div>
            `;
        }
    }

    // Verify that the component rendered successfully
    function verifyRendering(container) {
        setTimeout(() => {
            // Check for ScratchCard specific elements
            const hasCanvas = container.querySelector('canvas') !== null;
            const hasScratchCardContent = container.querySelector('h2, .text-2xl, .text-xl') !== null;
            const hasLoadingSpinner = container.querySelector('.loading .spinner') !== null;
            const hasReactContent = container.querySelector('[data-reactroot], [data-reactid]') !== null;
            
            // Check if any ScratchCard content is present
            const hasScratchCardElements = hasCanvas || hasScratchCardContent || hasReactContent;
            
            if (hasScratchCardElements && !hasLoadingSpinner) {
                debugLog('Component rendered successfully');
                debugLog('Found elements:', {
                    canvas: hasCanvas,
                    scratchCardContent: hasScratchCardContent,
                    reactContent: hasReactContent
                });
            } else if (hasLoadingSpinner) {
                debugLog('Component still showing loading state, may need retry');
                // If still loading after 2 seconds, try to re-render
                setTimeout(() => {
                    if (container.querySelector('.loading .spinner')) {
                        debugLog('Still loading, attempting re-render');
                        renderScratchCard();
                    }
                }, 2000);
            } else {
                debugLog('Component may not have rendered properly');
                debugLog('Container content:', container.innerHTML.substring(0, 200) + '...');
            }
        }, 100);
    }

    // Initialize the Scratch Card component
    function initializeScratchcardInternal() {
        debugLog('Initializing Citi Scratch Card component');
        
        if (renderAttempts >= MAX_RENDER_ATTEMPTS) {
            debugLog(`Maximum render attempts (${MAX_RENDER_ATTEMPTS}) reached, stopping initialization`);
            return;
        }
        
        renderAttempts++;
        debugLog(`Render attempt ${renderAttempts}/${MAX_RENDER_ATTEMPTS}`);
        
        waitForComponents(() => {
            renderScratchCard();
        });
    }

    // Main initialization function
    function initializeCitiScratchcard() {
        debugLog('Citi Scratch Card initialization started');

        // Set a global flag to indicate our ScratchCard is being handled
        window.citiScratchCardHandled = true;

        // Check if the existing custom.js script is already handling ScratchCard
        const existingContainer = document.getElementById('scratch-card-container');
        if (existingContainer && existingContainer.querySelector('[data-reactroot], [data-reactid]')) {
            debugLog('Existing ScratchCard component detected, skipping our initialization');
            return;
        }
        
        initializeScratchcardInternal();
    }

    // Setup comprehensive event listeners for AEM authoring mode
    function setupEventListeners() {
        debugLog('Setting up event listeners for AEM authoring mode');

        // AEM-specific events
        if (window.CQ && window.CQ.WCM) {
            // Edit mode events
            window.CQ.WCM.on('edit', function() {
                debugLog('AEM edit mode activated');
            });

            window.CQ.WCM.on('editcomplete', function() {
                debugLog('AEM edit completed, reinitializing component');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            });

            // Dialog events
            window.CQ.WCM.on('dialogclose', function() {
                debugLog('AEM dialog closed, checking for updates');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            });

            window.CQ.WCM.on('dialogsubmit', function() {
                debugLog('AEM dialog submitted, reinitializing component');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            });

            // Component refresh events
            window.CQ.WCM.on('componentrefresh', function() {
                debugLog('AEM component refresh triggered');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            });

            window.CQ.WCM.on('componentupdate', function() {
                debugLog('AEM component update triggered');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            });
        }

        // General DOM events
        document.addEventListener('click', function(e) {
            if (e.target && e.target.classList.contains('cq-dialog-submit')) {
                debugLog('Dialog submit button clicked, reinitializing component');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            }
        });

        // MutationObserver for dynamic content changes
        const observer = new MutationObserver(function(mutations) {
            let shouldReinitialize = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Check if our container was added
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            (node.id === CONTAINER_ID || 
                             node.querySelector && node.querySelector('#' + CONTAINER_ID))) {
                            shouldReinitialize = true;
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    // Check if relevant data attributes changed
                    if (mutation.target && mutation.target.hasAttribute) {
                        const relevantAttrs = [
                            'data-sc-prize', 'data-sc-title', 'data-sc-btn-text', 
                            'data-sc-instructions', 'data-sc-card-width', 
                            'data-sc-card-height', 'data-sc-scratch-color',
                            'data-sc-scratch-pattern', 'data-sc-reveal-threshold'
                        ];
                        
                        if (relevantAttrs.some(attr => mutation.attributeName === attr)) {
                            shouldReinitialize = true;
                        }
                    }
                }
            });
            
            if (shouldReinitialize) {
                debugLog('DOM changes detected, reinitializing component');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 100);
            }
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [
                'data-sc-prize', 'data-sc-title', 'data-sc-btn-text', 
                'data-sc-instructions', 'data-sc-card-width', 
                'data-sc-card-height', 'data-sc-scratch-color',
                'data-sc-scratch-pattern', 'data-sc-reveal-threshold'
            ]
        });

        // Global error handling
        window.addEventListener('error', function(e) {
            debugLog('Global error caught:', e.error);
            if (e.error && e.error.message && e.error.message.includes('ScratchCard')) {
                debugLog('ScratchCard error detected, attempting recovery');
                setTimeout(() => {
                    renderAttempts = 0;
                    initializeScratchcardInternal();
                }, 1000);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            debugLog('DOM loaded, initializing Citi Scratch Card');
            setupEventListeners();
            // Add a small delay to ensure clientlibs are loaded
            setTimeout(() => {
                initializeCitiScratchcard();
            }, 500);
        });
    } else {
        debugLog('DOM already ready, initializing Citi Scratch Card immediately');
        setupEventListeners();
        // Add a small delay to ensure clientlibs are loaded
        setTimeout(() => {
            initializeCitiScratchcard();
        }, 500);
    }

    // Also initialize when window loads (for late-loading scenarios)
    window.addEventListener('load', function() {
        debugLog('Window loaded, checking if Citi Scratch Card needs initialization');
        const container = document.getElementById(CONTAINER_ID);
        if (container && container.querySelector('.loading .spinner')) {
            debugLog('Container found with loading state, initializing');
            renderAttempts = 0;
            initializeScratchcardInternal();
        }
    });

    // Export for global access if needed
    window.initializeCitiScratchcard = initializeCitiScratchcard;

})();
