/**
 * Citi Wheel Spin Game Integration Script
 * Complete React implementation with floating wheel game
 */

(function() {
    'use strict';

    const CONTAINER_ID = 'wheel-spin-game-container';
    let renderAttempts = 0;
    const MAX_RENDER_ATTEMPTS = 10;

    function debugLog(message, data = null, isError = false) {
        if (window.console && window.console.log) {
            const timestamp = new Date().toISOString();
            const logLevel = isError ? 'ERROR' : 'INFO';
            const logMessage = `[Citi WheelSpinGame] ${logLevel} ${timestamp}: ${message}`;
            
            if (isError) {
                console.error(logMessage, data);
            } else {
                console.log(logMessage, data);
            }
        }
    }

    function getDefaultSegments() {
        return [
            { text: "🎁 Free Gift", color: "#FF6B6B", value: "Claim your free gift now!" },
            { text: "💰 $10 Cash", color: "#4ECDC4", value: "Cash prize added to your account" },
            { text: "🎯 50% Off", color: "#45B7D1", value: "Use code: SPIN50" },
            { text: "🎪 Try Again", color: "#96CEB4", value: "Better luck next time!" },
            { text: "🏆 Grand Prize", color: "#FFEAA7", value: "You won the grand prize!" },
            { text: "🎨 Mystery Box", color: "#DDA0DD", value: "Open to reveal your surprise" }
        ];
    }

    // Utility function for class names
    function cn(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    // Confetti Component
    const Confetti = ({ isActive }) => {
        if (!isActive) return null;

        return React.createElement('div', {
            className: "fixed inset-0 pointer-events-none z-[60]"
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
    const SpinWheel = React.forwardRef(({
        className,
        size = "default",
        variant = "default",
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
        ...props
    }, ref) => {
        const canvasRef = React.useRef(null);
        const [spinning, setSpinning] = React.useState(false);
        const [spinResult, setSpinResult] = React.useState(null);
        const [rotation, setRotation] = React.useState(0);
        const [startSpinTime, setStartSpinTime] = React.useState(0);
        const [spinDuration, setSpinDuration] = React.useState(0);
        const [finalRotation, setFinalRotation] = React.useState(0);

        const drawWheel = React.useCallback(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const radius = Math.min(centerX, centerY) - 20;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw wheel shadow
            ctx.save();
            ctx.translate(centerX + 2, centerY + 2);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, 2 * Math.PI);
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fill();
            ctx.restore();

            // Draw the wheel segments
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(rotation);

            const arcSize = (2 * Math.PI) / segments.length;

            segments.forEach((segment, i) => {
                const startAngle = i * arcSize;
                const endAngle = (i + 1) * arcSize;

                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.arc(0, 0, radius, startAngle, endAngle);
                ctx.closePath();
                ctx.fillStyle = segment.color;
                ctx.fill();

                // Add metallic border
                ctx.lineWidth = 3;
                ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
                ctx.stroke();

                // Add subtle gradient
                const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
                gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
                ctx.fillStyle = gradient;
                ctx.fill();

                // Draw text for each segment with proper radial orientation
                ctx.save();
                const segmentCenterAngle = i * arcSize + arcSize / 2;
                const textRadius = radius * 0.7; // Position text at 70% of radius

                // Rotate to the segment's center angle
                ctx.rotate(segmentCenterAngle);

                // Set text properties for radial orientation
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 12px Arial, sans-serif";
                ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 1;
                ctx.shadowOffsetY = 1;

                // Draw text radially (like clock needles pointing toward center)
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

            // Draw pointer (re-designed for clear right-side placement and pointing inwards)
            ctx.beginPath();
            // Tip of the arrow (closest to wheel, pointing left)
            ctx.moveTo(centerX + radius - 5, centerY);
            // Top base point (further right, above center)
            ctx.lineTo(centerX + radius + 15, centerY - 10);
            // Bottom base point (further right, below center)
            ctx.lineTo(centerX + radius + 15, centerY + 10);
            ctx.closePath();
            ctx.fillStyle = "#ef4444";
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();
        }, [segments, rotation]);

        React.useEffect(() => {
            drawWheel();
        }, [drawWheel]);

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
            setStartSpinTime(Date.now());
            
            if (onSpinStart) {
                onSpinStart();
            }

            const totalRevolutions = minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
            const targetSegmentIndex = Math.floor(Math.random() * segments.length);
            const segmentAngle = (2 * Math.PI) / segments.length;
            const targetSegmentCenterAngle = targetSegmentIndex * segmentAngle + segmentAngle / 2;
            const rotationToAlignTarget = ((0 - targetSegmentCenterAngle + 2 * Math.PI) % (2 * Math.PI));
            const finalRot = totalRevolutions * 2 * Math.PI + rotationToAlignTarget;

            setFinalRotation(finalRot);
            setSpinDuration(animationDuration);

            const startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / animationDuration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 4);

                setRotation(finalRot * easedProgress);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    setSpinning(false);
                    
                    // Calculate the actual winning segment based on final rotation
                    const normalizedRotation = (finalRot % (2 * Math.PI));
                    const pointerAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
                    const segmentSize = (2 * Math.PI) / segments.length;
                    const winningSegmentIndex = Math.floor(pointerAngle / segmentSize) % segments.length;
                    
                    const result = segments[winningSegmentIndex];
                    setSpinResult(result);
                    if (onSpinEnd) {
                        onSpinEnd(result);
                    }
                }
            };

            requestAnimationFrame(animate);
        };

        const sizeClasses = {
            sm: "max-w-sm",
            default: "max-w-md",
            lg: "max-w-lg",
            xl: "max-w-xl",
        };

        const variantClasses = {
            default: "bg-background px-4",
            card: "bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl",
            minimal: "bg-transparent px-4",
        };

        return React.createElement('div', {
            ref: ref,
            className: cn(
                "relative flex flex-col items-center justify-center",
                sizeClasses[size] || sizeClasses.default,
                variantClasses[variant] || variantClasses.default,
                className
            ),
            ...props
        }, [
            title && React.createElement('h2', {
                key: 'title',
                className: "text-2xl font-bold mb-6 text-center text-foreground"
            }, title),
            React.createElement('div', {
                key: 'wheel-container',
                className: "relative mb-6"
            }, [
                React.createElement('canvas', {
                    key: 'canvas',
                    ref: canvasRef,
                    width: wheelSize,
                    height: wheelSize,
                    className: "rounded-full shadow-lg"
                }),
                spinning && React.createElement('div', {
                    key: 'spinning-overlay',
                    className: "absolute inset-0 flex items-center justify-center"
                }, React.createElement('div', {
                    className: "bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium"
                }, spinningText))
            ]),
            React.createElement(Button, {
                key: 'spin-button',
                onClick: spin,
                disabled: spinning || disabled,
                className: "min-w-[120px] font-semibold bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                'data-spin-button': true
            }, buttonText)
        ]);
    });

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
        const [isModalOpen, setIsModalOpen] = React.useState(false);
        const [showPrize, setShowPrize] = React.useState(false);
        const [currentPrize, setCurrentPrize] = React.useState(null);
        const [showConfetti, setShowConfetti] = React.useState(false);
        const [showEmailInput, setShowEmailInput] = React.useState(false);
        const [userEmail, setUserEmail] = React.useState('');
        const [emailError, setEmailError] = React.useState('');

        // Handle ESC key to close modal
        React.useEffect(() => {
            const handleEscape = (event) => {
                if (event.key === 'Escape' && isModalOpen) {
                    setIsModalOpen(false);
                }
            };

            if (isModalOpen) {
                document.addEventListener('keydown', handleEscape);
                // Prevent body scroll when modal is open
                document.body.style.overflow = 'hidden';
            }

            return () => {
                document.removeEventListener('keydown', handleEscape);
                document.body.style.overflow = 'unset';
            };
        }, [isModalOpen]);

        const handleCloseModal = React.useCallback(() => {
            setIsModalOpen(false);
        }, []);

        const handleBackdropClick = React.useCallback((event) => {
            if (event.target === event.currentTarget) {
                handleCloseModal();
            }
        }, [handleCloseModal]);

        // Enhanced prize reveal handler
        const handleSpinEnd = React.useCallback((result) => {
            setCurrentPrize(result);
            
            // Trigger confetti and prize reveal sequence - much faster timing
            setTimeout(() => {
                setShowConfetti(true);
                setShowPrize(true); // Show prize immediately with confetti
            }, 300); // Reduced from 1000ms to 300ms
            
            // Call original onSpinEnd if provided
            onSpinEnd?.(result);
        }, [onSpinEnd]);

        // Email validation function
        const validateEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        // Handle email submission
        const handleEmailSubmit = React.useCallback((email) => {
            if (!validateEmail(email)) {
                setEmailError('Please enter a valid email address');
                return false;
            }
            setUserEmail(email);
            setEmailError('');
            setShowEmailInput(false);
            // After email is submitted, trigger the actual spin
            setTimeout(() => {
                // Trigger spin by calling the spin function directly
                const spinButton = document.querySelector('[data-spin-button]');
                if (spinButton) {
                    spinButton.click();
                }
            }, 100);
            return true;
        }, []);

        // Handle spin button click - show email input first
        const handleSpinClick = React.useCallback(() => {
            setShowEmailInput(true);
        }, []);

        // Reset prize state when modal opens
        const handleOpenModal = React.useCallback(() => {
            setIsModalOpen(true);
            setShowPrize(false);
            setCurrentPrize(null);
            setShowConfetti(false);
            setShowEmailInput(false);
            setUserEmail('');
            setEmailError('');
        }, []);

        return React.createElement(React.Fragment, {}, [
                            // Confetti Effect - Full screen
                showConfetti && React.createElement('div', {
                    key: 'confetti',
                    className: "fixed inset-0 pointer-events-none z-[60]"
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
                )),
            
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
                    className: "absolute inset-0 rounded-full border-2 border-white/30 animate-ping"
                })
            ]),

                                    // Modal Overlay
                        isModalOpen && React.createElement('div', {
                            key: 'modal-overlay',
                            className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm",
                            onClick: handleBackdropClick
                        }, React.createElement('div', {
                            className: "relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl"
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
                    className: "absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-20"
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
                    variant: "card",
                    size: "lg",
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
                        className: "bg-white/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-white/30 shadow-2xl transform hover:scale-105 transition-transform duration-300"
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
                        className: "mt-8 bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-105 transform"
                    }, "Claim Prize")
                ]))
            ]))
        ]);
    };

    function initializeWheelSpinGame() {
        debugLog('🚀 Starting wheel spin game initialization...');

        // Enhanced dependency checking with more detailed logging
        if (typeof React === 'undefined') {
            debugLog('❌ React not found, waiting for dependencies...', null, true);
            debugLog('🔍 Available globals:', Object.keys(window).filter(key => key.includes('React')), true);
            return false;
        }

        if (typeof ReactDOM === 'undefined') {
            debugLog('❌ ReactDOM not found, waiting for dependencies...', null, true);
            debugLog('🔍 Available globals:', Object.keys(window).filter(key => key.includes('React')), true);
            return false;
        }

        debugLog('✅ React and ReactDOM found successfully');

        const container = document.getElementById(CONTAINER_ID);
        if (!container) {
            debugLog('❌ Container not found, waiting for DOM...', null, true);
            debugLog('🔍 Available containers:', Array.from(document.querySelectorAll('[id*="wheel"]')).map(el => el.id), true);
            return false;
        }

        if (container.dataset.initialized === 'true') {
            debugLog('✅ Component already initialized, skipping...');
            return true;
        }

        debugLog('✅ Container found:', container.id);

        try {
            const configElement = document.querySelector('.wsg-cmp-default');
            if (!configElement) {
                debugLog('❌ Configuration element not found', null, true);
                debugLog('🔍 Available elements with wsg:', Array.from(document.querySelectorAll('[class*="wsg"]')).map(el => el.className), true);
                return false;
            }

            debugLog('✅ Configuration element found');

            const segmentsScript = document.getElementById('wheel-spin-game-segments');
            let segments = [];
            
            if (segmentsScript && segmentsScript.textContent) {
                try {
                    segments = JSON.parse(segmentsScript.textContent.trim());
                    debugLog('✅ Segments JSON parsed successfully');
                } catch (e) {
                    debugLog('❌ Failed to parse segments JSON, using defaults', e, true);
                    debugLog('🔍 Raw segments content:', segmentsScript.textContent, true);
                    segments = getDefaultSegments();
                }
            } else {
                debugLog('⚠️ No segments found, using defaults');
                segments = getDefaultSegments();
            }

            const config = {
                title: configElement.dataset.wsgTitle || 'Spin to Win!',
                buttonText: configElement.dataset.wsgButtonText || 'SPIN',
                spinningText: configElement.dataset.wsgSpinningText || 'Spinning...',
                wheelSize: parseInt(configElement.dataset.wsgWheelSize) || 400,
                animationDuration: parseInt(configElement.dataset.wsgAnimationDuration) || 3000,
                minRevolutions: parseInt(configElement.dataset.wsgMinRevolutions) || 3,
                maxRevolutions: parseInt(configElement.dataset.wsgMaxRevolutions) || 5
            };

            debugLog('📋 Configuration loaded:', config);
            debugLog('🎯 Segments loaded:', segments);

                            // Create the main game component - render directly as FloatingWheelGame
                const WheelSpinGameApp = () => {
                    const handleSpinEnd = (result) => {
                        debugLog('🎉 Prize won:', result);
                    };

                    return React.createElement(FloatingWheelGame, {
                        segments: segments,
                        wheelSize: config.wheelSize,
                        animationDuration: config.animationDuration,
                        minRevolutions: config.minRevolutions,
                        maxRevolutions: config.maxRevolutions,
                        title: config.title,
                        buttonText: config.buttonText,
                        spinningText: config.spinningText,
                        onSpinEnd: handleSpinEnd
                    });
                };

            debugLog('✅ React components created successfully');

            try {
                const root = ReactDOM.createRoot(container);
                root.render(React.createElement(WheelSpinGameApp));
                debugLog('✅ React component rendered successfully');
            } catch (reactError) {
                debugLog('❌ React rendering failed:', reactError, true);
                throw reactError;
            }

            container.dataset.initialized = 'true';
            container.classList.remove('loading');
            
            debugLog('✅ Wheel spin game initialized successfully!');
            return true;

        } catch (error) {
            debugLog('❌ Failed to initialize wheel spin game', error, true);
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

    debugLog('🚀 Wheel spin game integration script loaded successfully');
})();
