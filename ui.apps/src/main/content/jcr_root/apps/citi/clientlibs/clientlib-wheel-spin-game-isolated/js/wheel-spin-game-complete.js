/**
 * Complete Wheel Spin Game Integration Script
 * Loaded separately to avoid MenuContentManager conflicts
 */

console.log('🚀 COMPLETE WHEEL SPIN GAME SCRIPT STARTING...');

(function() {
    'use strict';
    
    console.log('🔧 COMPLETE GAME SCRIPT EXECUTING...');
    
    // Check if React dependencies are available
    if (typeof React === 'undefined' || typeof ReactDOM === 'undefined') {
        console.error('❌ COMPLETE GAME: React dependencies not found');
        return;
    }
    
    console.log('✅ COMPLETE GAME: React and ReactDOM found');
    
    const { useState, useEffect, useCallback } = React;

    // Utility function for class names
    function cn(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    // Confetti Component
    const Confetti = ({ isActive }) => {
        if (!isActive) return null;

        return React.createElement('div', {
            className: "fixed inset-0 pointer-events-none z-60"
        }, Array.from({ length: 100 }).map((_, i) => 
            React.createElement('div', {
                key: i,
                className: "absolute animate-confetti",
                style: {
                    left: `${Math.random() * 100}%`,
                    top: '-10px',
                    animationDelay: `${Math.random() * 1}s`,
                    animationDuration: `${1 + Math.random() * 1}s`,
                }
            }, React.createElement('div', {
                className: "w-3 h-3 rounded-full shadow-lg",
                style: {
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFD93D', '#6BCF7F'][Math.floor(Math.random() * 8)],
                    transform: `rotate(${Math.random() * 360}deg)`,
                }
            }))
        ));
    };

    // Button Component
    const Button = ({ children, className, ...props }) => {
        return React.createElement('button', {
            className: cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                "bg-primary text-primary-foreground hover:bg-primary/90",
                "h-10 px-4 py-2",
                className
            ),
            ...props
        }, children);
    };

    // SpinWheel Component
    const SpinWheel = ({
        segments = [],
        wheelSize = 400,
        animationDuration = 3000,
        minRevolutions = 3,
        maxRevolutions = 5,
        title = "Spin to Win!",
        buttonText = "SPIN",
        spinningText = "Spinning...",
        disabled = false,
        onSpinStart,
        onSpinEnd,
        onSpinClick,
        userEmail,
        className,
    }) => {
        const [spinning, setSpinning] = useState(false);
        const [rotation, setRotation] = useState(0);

        const spin = () => {
            if (spinning || disabled) return;

            // If email is required but not provided, trigger email input
            if (!userEmail) {
                if (onSpinClick) {
                    onSpinClick();
                }
                return;
            }

            setSpinning(true);
            
            if (onSpinStart) {
                onSpinStart();
            }

            const totalRevolutions = minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
            const targetSegmentIndex = Math.floor(Math.random() * segments.length);
            const segmentAngle = (2 * Math.PI) / segments.length;
            const targetAngle = totalRevolutions * 360 + (targetSegmentIndex * segmentAngle * 180) / Math.PI;
            
            setRotation(prev => prev + targetAngle);

            setTimeout(() => {
                setSpinning(false);
                if (onSpinEnd) {
                    onSpinEnd(segments[targetSegmentIndex]);
                }
            }, animationDuration);
        };

        return React.createElement('div', {
            className: cn("flex flex-col items-center gap-6", className)
        }, [
            React.createElement('h2', {
                key: 'title',
                className: "text-2xl font-bold text-center text-gray-800"
            }, title),
            
            React.createElement('div', {
                key: 'wheel-container',
                className: "relative"
            }, [
                React.createElement('canvas', {
                    key: 'wheel-canvas',
                    width: wheelSize,
                    height: wheelSize,
                    className: "rounded-full shadow-2xl",
                    style: {
                        transform: `rotate(${rotation}deg)`,
                        transition: spinning ? `transform ${animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)` : 'none'
                    },
                    ref: (canvas) => {
                        if (!canvas || segments.length === 0) return;
                        
                        const ctx = canvas.getContext('2d');
                        const centerX = wheelSize / 2;
                        const centerY = wheelSize / 2;
                        const radius = wheelSize / 2 - 10;
                        const arcSize = (2 * Math.PI) / segments.length;

                        ctx.clearRect(0, 0, wheelSize, wheelSize);
                        ctx.save();
                        ctx.translate(centerX, centerY);

                        segments.forEach((segment, i) => {
                            const startAngle = i * arcSize;
                            const endAngle = (i + 1) * arcSize;

                            ctx.beginPath();
                            ctx.moveTo(0, 0);
                            ctx.arc(0, 0, radius, startAngle, endAngle);
                            ctx.closePath();
                            ctx.fillStyle = segment.color;
                            ctx.fill();

                            ctx.lineWidth = 3;
                            ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                            ctx.stroke();

                            ctx.save();
                            const segmentCenterAngle = i * arcSize + arcSize / 2;
                            const textRadius = radius * 0.7;

                            ctx.rotate(segmentCenterAngle);
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle";
                            ctx.fillStyle = "#ffffff";
                            ctx.font = "bold 12px Arial, sans-serif";
                            ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
                            ctx.shadowBlur = 2;
                            ctx.fillText(segment.text, textRadius, 0);
                            ctx.restore();
                        });
                        ctx.restore();

                        // Draw center circle
                        ctx.beginPath();
                        ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
                        ctx.fillStyle = "#ffffff";
                        ctx.fill();
                        ctx.lineWidth = 3;
                        ctx.strokeStyle = "#e5e7eb";
                        ctx.stroke();

                        // Draw pointer
                        ctx.beginPath();
                        ctx.moveTo(centerX + radius - 5, centerY);
                        ctx.lineTo(centerX + radius + 15, centerY - 10);
                        ctx.lineTo(centerX + radius + 15, centerY + 10);
                        ctx.closePath();
                        ctx.fillStyle = "#ef4444";
                        ctx.fill();
                        ctx.lineWidth = 2;
                        ctx.strokeStyle = "#ffffff";
                        ctx.stroke();
                    }
                })
            ]),
            
            React.createElement(Button, {
                key: 'spin-button',
                onClick: spin,
                disabled: spinning || disabled,
                className: "bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg font-semibold",
                'data-spin-button': true
            }, spinning ? spinningText : buttonText)
        ]);
    };

    // FloatingWheelGame Component
    const FloatingWheelGame = ({
        segments = [],
        wheelSize = 400,
        animationDuration = 3000,
        minRevolutions = 3,
        maxRevolutions = 5,
        title = "Spin to Win!",
        buttonText = "SPIN",
        spinningText = "Spinning...",
        disabled = false,
        onSpinStart,
        onSpinEnd,
        className,
    }) => {
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [showPrize, setShowPrize] = useState(false);
        const [currentPrize, setCurrentPrize] = useState(null);
        const [showConfetti, setShowConfetti] = useState(false);
        const [showEmailInput, setShowEmailInput] = useState(false);
        const [userEmail, setUserEmail] = useState('');
        const [emailError, setEmailError] = useState('');

        // Handle ESC key to close modal
        useEffect(() => {
            const handleEscape = (event) => {
                if (event.key === 'Escape' && isModalOpen) {
                    setIsModalOpen(false);
                }
            };

            if (isModalOpen) {
                document.addEventListener('keydown', handleEscape);
                document.body.style.overflow = 'hidden';
            }

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }, [isModalOpen]);

        const handleCloseModal = useCallback(() => {
            setIsModalOpen(false);
        }, []);

        const handleBackdropClick = useCallback((event) => {
            if (event.target === event.currentTarget) {
                handleCloseModal();
            }
        }, [handleCloseModal]);

        const handleSpinEnd = useCallback((result) => {
            setCurrentPrize(result);
            
            setTimeout(() => {
                setShowConfetti(true);
                setShowPrize(true);
            }, 300);
            
            onSpinEnd?.(result);
        }, [onSpinEnd]);

        const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const handleEmailSubmit = useCallback((email) => {
            if (!validateEmail(email)) {
                setEmailError('Please enter a valid email address');
                return false;
            }
            setUserEmail(email);
            setEmailError('');
            setShowEmailInput(false);
            setTimeout(() => {
                const spinButton = document.querySelector('[data-spin-button]');
                if (spinButton) {
                    spinButton.click();
                }
            }, 100);
            return true;
        }, []);

        const handleSpinClick = useCallback(() => {
            setShowEmailInput(true);
        }, []);

        const handleOpenModal = useCallback(() => {
            setIsModalOpen(true);
            setShowPrize(false);
            setCurrentPrize(null);
            setShowConfetti(false);
            setShowEmailInput(false);
            setUserEmail('');
            setEmailError('');
        }, []);

        return React.createElement(React.Fragment, {}, [
            // Confetti Effect
            React.createElement(Confetti, { key: 'confetti', isActive: showConfetti }),
            
            // Floating Icon
            React.createElement('button', {
                key: 'floating-button',
                onClick: handleOpenModal,
                className: cn(
                    "fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group",
                    "flex items-center justify-center text-white",
                    "animate-pulse hover:animate-none",
                    "focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-50",
                    className
                ),
                'aria-label': "Open Wheel Spin Game"
            }, [
                // Gift icon using SVG
                React.createElement('svg', {
                    key: 'gift-icon',
                    className: "w-8 h-8 group-hover:rotate-12 transition-transform duration-300",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg"
                }, React.createElement('path', {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                })),
                
                // Glow effect
                React.createElement('div', {
                    key: 'glow',
                    className: "absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"
                }),
                
                // Pulse ring
                React.createElement('div', {
                    key: 'pulse',
                    className: "absolute inset-0 rounded-full border-2 border-white-30 animate-ping"
                })
            ]),

            // Modal Overlay
            isModalOpen && React.createElement('div', {
                key: 'modal-overlay',
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-50 backdrop-blur-sm",
                onClick: handleBackdropClick
            }, React.createElement('div', {
                className: "relative w-full max-w-2xl max-h-90vh overflow-hidden bg-white rounded-2xl shadow-2xl"
            }, [
                // Close Button
                React.createElement('button', {
                    key: 'close-button',
                    onClick: handleCloseModal,
                    className: "absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300",
                    'aria-label': "Close modal"
                }, React.createElement('svg', {
                    className: "w-4 h-4 text-gray-600",
                    fill: "none",
                    stroke: "currentColor",
                    viewBox: "0 0 24 24",
                    xmlns: "http://www.w3.org/2000/svg"
                }, React.createElement('path', {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M6 18L18 6M6 6l12 12"
                }))),

                // Email Input Popup
                showEmailInput && React.createElement('div', {
                    key: 'email-overlay',
                    className: "absolute inset-0 flex items-center justify-center bg-black-50 backdrop-blur-sm z-20"
                }, React.createElement('div', {
                    className: "bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                }, [
                    React.createElement('h3', {
                        key: 'email-title',
                        className: "text-2xl font-bold text-center mb-6 text-gray-800"
                    }, "Enter Your Email"),
                    React.createElement('p', {
                        key: 'email-description',
                        className: "text-center mb-6 text-gray-600"
                    }, "Please enter your email address to spin the wheel and claim your prize!"),
                    React.createElement('input', {
                        key: 'email-input',
                        type: "email",
                        placeholder: "your.email@example.com",
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4",
                        value: userEmail,
                        onChange: (e) => {
                            setUserEmail(e.target.value);
                            if (emailError) setEmailError('');
                        },
                        onKeyPress: (e) => {
                            if (e.key === 'Enter') {
                                handleEmailSubmit(userEmail);
                            }
                        }
                    }),
                    emailError && React.createElement('p', {
                        key: 'email-error',
                        className: "text-red-500 text-sm mb-4 text-center"
                    }, emailError),
                    React.createElement('div', {
                        key: 'email-buttons',
                        className: "flex gap-3"
                    }, [
                        React.createElement('button', {
                            key: 'cancel-email',
                            onClick: () => setShowEmailInput(false),
                            className: "flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors duration-200"
                        }, "Cancel"),
                        React.createElement('button', {
                            key: 'submit-email',
                            onClick: () => handleEmailSubmit(userEmail),
                            className: "flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-200"
                        }, "Continue")
                    ])
                ])),

                // Game Content
                React.createElement('div', {
                    key: 'game-content',
                    className: cn("p-6 transition-opacity duration-200", (showPrize || showEmailInput) && "opacity-0")
                }, React.createElement(SpinWheel, {
                    segments: segments,
                    wheelSize: wheelSize,
                    animationDuration: animationDuration,
                    minRevolutions: minRevolutions,
                    maxRevolutions: maxRevolutions,
                    title: title,
                    buttonText: buttonText,
                    spinningText: spinningText,
                    disabled: disabled,
                    onSpinStart: onSpinStart,
                    onSpinEnd: handleSpinEnd,
                    onSpinClick: handleSpinClick,
                    userEmail: userEmail,
                    className: "w-full"
                })),

                // Prize Reveal Overlay
                showPrize && currentPrize && React.createElement('div', {
                    key: 'prize-overlay',
                    className: "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl animate-in fade-in duration-200"
                }, React.createElement('div', {
                    className: "text-center text-white p-8 animate-prize-pop"
                }, [
                    React.createElement('div', {
                        key: 'emoji',
                        className: "text-8xl mb-6 animate-bounce"
                    }, "🎉"),
                    React.createElement('h2', {
                        key: 'congrats',
                        className: "text-4xl font-bold mb-6 drop-shadow-lg text-white"
                    }, "Congratulations!"),
                    React.createElement('div', {
                        key: 'prize-card',
                        className: "bg-white-20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white-30 shadow-2xl transform hover:scale-105 transition-transform duration-300"
                    }, [
                        React.createElement('p', {
                            key: 'prize-text',
                            className: "text-3xl font-bold mb-3 drop-shadow-lg text-white"
                        }, currentPrize.text),
                        currentPrize.value && React.createElement('p', {
                            key: 'prize-value',
                            className: "text-xl text-white drop-shadow-lg"
                        }, currentPrize.value),
                        userEmail && React.createElement('p', {
                            key: 'user-email',
                            className: "text-lg text-white drop-shadow-lg mt-2"
                        }, `Email: ${userEmail}`)
                    ]),
                    React.createElement('button', {
                        key: 'claim-button',
                        onClick: handleCloseModal,
                        className: "mt-8 bg-white-20 hover:bg-white-30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white-30 hover:scale-105 transform"
                    }, "Claim Prize")
                ]))
            ]))
        ]);
    };

    // Initialize the game
    function initializeCompleteGame() {
        const container = document.getElementById('wheel-spin-game-container');
        if (!container) {
            console.error('❌ COMPLETE GAME: Container not found');
            return false;
        }

        console.log('✅ COMPLETE GAME: Container found, rendering complete wheel spin game...');
        
        // Get configuration data
        const configElement = document.querySelector('.wsg-cmp-default');
        const segmentsScript = document.getElementById('wheel-spin-game-segments');
        
        let segments = [];
        if (segmentsScript && segmentsScript.textContent) {
            try {
                segments = JSON.parse(segmentsScript.textContent.trim());
            } catch (e) {
                console.warn('Failed to parse segments, using defaults');
            }
        }
        
        // Default segments if none provided
        if (segments.length === 0) {
            segments = [
                { text: "🎁 Free Gift", color: "#FF6B6B", value: "Claim your free gift now!" },
                { text: "💰 $10 Cash", color: "#4ECDC4", value: "Cash prize added to your account" },
                { text: "🎯 50% Off", color: "#45B7D1", value: "Use code: SPIN50" },
                { text: "🎪 Try Again", color: "#96CEB4", value: "Better luck next time!" },
                { text: "🏆 Grand Prize", color: "#FFEAA7", value: "You won the grand prize!" },
                { text: "🎨 Mystery Box", color: "#DDA0DD", value: "Open to reveal your surprise" }
            ];
        }
        
        const config = {
            title: configElement?.dataset.wsgTitle || 'Spin to Win!',
            buttonText: configElement?.dataset.wsgButtonText || 'SPIN',
            spinningText: configElement?.dataset.wsgSpinningText || 'Spinning...',
            wheelSize: parseInt(configElement?.dataset.wsgWheelSize) || 400,
            animationDuration: parseInt(configElement?.dataset.wsgAnimationDuration) || 3000,
            minRevolutions: parseInt(configElement?.dataset.wsgMinRevolutions) || 3,
            maxRevolutions: parseInt(configElement?.dataset.wsgMaxRevolutions) || 5
        };
        
        try {
            const root = ReactDOM.createRoot(container);
            root.render(React.createElement(FloatingWheelGame, {
                segments: segments,
                wheelSize: config.wheelSize,
                animationDuration: config.animationDuration,
                minRevolutions: config.minRevolutions,
                maxRevolutions: config.maxRevolutions,
                title: config.title,
                buttonText: config.buttonText,
                spinningText: config.spinningText,
                onSpinEnd: (result) => {
                    console.log('🎉 Prize won:', result);
                }
            }));
            console.log('✅ COMPLETE GAME: Complete wheel spin game rendered successfully!');
            return true;
            
        } catch (error) {
            console.error('❌ COMPLETE GAME: Game rendering failed:', error);
            return false;
        }
    }

    // Try to initialize
    let attempts = 0;
    const maxAttempts = 10;
    
    function attemptInitialization() {
        if (attempts >= maxAttempts) {
            console.error('❌ COMPLETE GAME: Max initialization attempts reached');
            return;
        }

        attempts++;
        console.log(`🔄 COMPLETE GAME: Initialization attempt ${attempts}/${maxAttempts}`);

        if (initializeCompleteGame()) {
            console.log('✅ COMPLETE GAME: Initialization successful!');
            return;
        }

        const delay = Math.min(150 * Math.pow(2, attempts - 1), 2000);
        setTimeout(attemptInitialization, delay);
    }

    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attemptInitialization);
    } else {
        attemptInitialization();
    }

    window.addEventListener('load', () => {
        if (!document.getElementById('wheel-spin-game-container')?.dataset.initialized) {
            console.log('🔄 COMPLETE GAME: Retrying initialization on window load...');
            attemptInitialization();
        }
    });

    console.log('✅ COMPLETE GAME: Script loaded successfully');

})();
