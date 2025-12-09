/**
 * Isolated Wheel Spin Game Integration Script
 * Loaded separately to avoid MenuContentManager conflicts
 */

console.log('🚀 ISOLATED WHEEL SPIN GAME SCRIPT STARTING...');

(function() {
    'use strict';
    
    console.log('🔧 ISOLATED SCRIPT EXECUTING...');

    const CONTAINER_ID = 'wheel-spin-game-container';
    let renderAttempts = 0;
    const MAX_RENDER_ATTEMPTS = 10;

    function debugLog(message, data = null, isError = false) {
        const timestamp = new Date().toISOString();
        const logLevel = isError ? 'ERROR' : 'INFO';
        const logMessage = `[Isolated WheelSpinGame] ${logLevel} ${timestamp}: ${message}`;
        
        if (isError) {
            console.error(logMessage, data);
        } else {
            console.log(logMessage, data);
        }
    }

    function initializeWheelSpinGame() {
        debugLog('🚀 Starting isolated wheel spin game initialization...');

        // Check React dependencies
        if (typeof React === 'undefined') {
            debugLog('❌ React not found, waiting for dependencies...', null, true);
            return false;
        }

        if (typeof ReactDOM === 'undefined') {
            debugLog('❌ ReactDOM not found, waiting for dependencies...', null, true);
            return false;
        }

        debugLog('✅ React and ReactDOM found successfully');

        const container = document.getElementById(CONTAINER_ID);
        if (!container) {
            debugLog('❌ Container not found, waiting for DOM...', null, true);
            return false;
        }

        if (container.dataset.initialized === 'true') {
            debugLog('✅ Component already initialized, skipping...');
            return true;
        }

        debugLog('✅ Container found:', container.id);

        // Make sure container is visible
        container.style.display = 'block';
        container.style.position = 'relative';

        try {
            // Create a simple floating button to test React rendering
            const FloatingButton = () => {
                const [isOpen, setIsOpen] = React.useState(false);

                return React.createElement('div', {
                    style: {
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 1000,
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '24px',
                        animation: 'pulse 2s infinite'
                    },
                    onClick: () => {
                        setIsOpen(!isOpen);
                        alert('🎉 Wheel Spin Game Button Clicked!\n\nThis confirms React is working!');
                    }
                }, [
                    React.createElement('span', {
                        key: 'gift-icon'
                    }, '🎁'),
                    
                    // Pulse animation
                    React.createElement('style', {
                        key: 'pulse-style'
                    }, `
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.1); }
                        }
                    `)
                ]);
            };

            debugLog('✅ React component created successfully');

            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(FloatingButton));
            
            debugLog('✅ React component rendered successfully');

            container.dataset.initialized = 'true';
            debugLog('✅ Isolated wheel spin game initialized successfully!');
            
            // Show success indicator
            setTimeout(() => {
                const successDiv = document.createElement('div');
                successDiv.style.cssText = `
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    background: green;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 9999;
                    font-size: 12px;
                `;
                successDiv.textContent = '✅ Isolated Script Success!';
                document.body.appendChild(successDiv);
                
                // Remove after 5 seconds
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 5000);
            }, 500);

            return true;

        } catch (error) {
            debugLog('❌ Failed to initialize isolated wheel spin game', error, true);
            
            // Show error indicator
            setTimeout(() => {
                const errorDiv = document.createElement('div');
                errorDiv.style.cssText = `
                    position: fixed;
                    bottom: 100px;
                    right: 20px;
                    background: red;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    z-index: 9999;
                    font-size: 12px;
                    max-width: 300px;
                `;
                errorDiv.textContent = '❌ Isolated Script Error: ' + error.message;
                document.body.appendChild(errorDiv);
            }, 500);
            
            return false;
        }
    }

    function attemptInitialization() {
        if (renderAttempts >= MAX_RENDER_ATTEMPTS) {
            debugLog('❌ Max initialization attempts reached', null, true);
            return;
        }

        renderAttempts++;
        debugLog(`🔄 Initialization attempt ${renderAttempts}/${MAX_RENDER_ATTEMPTS}`);

        if (initializeWheelSpinGame()) {
            debugLog('✅ Initialization successful!');
            return;
        }

        const delay = Math.min(150 * Math.pow(2, renderAttempts - 1), 2000);
        setTimeout(attemptInitialization, delay);
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptInitialization);
    } else {
        attemptInitialization();
    }

    window.addEventListener('load', () => {
        if (!document.getElementById(CONTAINER_ID)?.dataset.initialized) {
            debugLog('🔄 Retrying initialization on window load...');
            attemptInitialization();
        }
    });

    debugLog('✅ Isolated wheel spin game script loaded successfully');

})();

console.log('✅ ISOLATED WHEEL SPIN GAME SCRIPT COMPLETED');
