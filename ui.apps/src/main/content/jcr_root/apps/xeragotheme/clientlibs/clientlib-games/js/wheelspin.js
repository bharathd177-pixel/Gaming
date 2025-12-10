
console.log('🔥 WHEEL SPIN GAME - Loading complete game...');

// Wait for DOM and React to be ready
setTimeout(function () {
    console.log('🔧 Checking React dependencies...');

    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
        console.log('✅ React and ReactDOM found!');

        var container = document.getElementById('wheel-spin-game-container');
        if (container) {
            console.log('✅ Container found, rendering complete wheel spin game...');

            var useState = React.useState;
            var useEffect = React.useEffect;
            var useCallback = React.useCallback;

            // Utility function for class names
            function cn() {
                var classes = Array.prototype.slice.call(arguments);
                return classes.filter(Boolean).join(' ');
            }

            // Confetti Component
            var Confetti = function (props) {
                if (!props.isActive) return null;

                return React.createElement('div', {
                    style: {
                        position: 'fixed',
                        inset: '0',
                        pointerEvents: 'none',
                        zIndex: 60
                    }
                }, Array.from({ length: 100 }).map(function (_, i) {
                    return React.createElement('div', {
                        key: i,
                        style: {
                            position: 'absolute',
                            left: Math.random() * 100 + '%',
                            top: '-10px',
                            animation: 'confetti-fall ' + (1 + Math.random() * 1) + 's linear forwards',
                            animationDelay: Math.random() * 1 + 's'
                        }
                    }, React.createElement('div', {
                        style: {
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FFD93D', '#6BCF7F'][Math.floor(Math.random() * 8)],
                            transform: 'rotate(' + (Math.random() * 360) + 'deg)'
                        }
                    }));
                }));
            };

            // Button Component
            var Button = function (props) {
                var restProps = Object.assign({}, props);
                delete restProps.className;
                delete restProps.children;

                return React.createElement('button', Object.assign({
                    style: Object.assign({
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        whiteSpace: 'nowrap',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'colors 0.2s',
                        outline: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        height: '40px',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        paddingTop: '8px',
                        paddingBottom: '8px'
                    }, props.style || {})
                }, restProps), props.children);
            };

            // SpinWheel Component
            var SpinWheel = React.forwardRef(function (props, ref) {
                var segments = props.segments || [];
                var wheelSize = props.wheelSize || 400;
                var animationDuration = props.animationDuration || 3000;
                var minRevolutions = props.minRevolutions || 3;
                var maxRevolutions = props.maxRevolutions || 5;
                var title = props.title || "Spin to Win!";
                var buttonText = props.buttonText || "SPIN";
                var spinningText = props.spinningText || "Spinning...";
                var disabled = props.disabled || false;
                var onSpinStart = props.onSpinStart;
                var onSpinEnd = props.onSpinEnd;
                var onSpinClick = props.onSpinClick;
                var userEmail = props.userEmail;

                var canvasRef = React.useRef(null);
                var spinning = useState(false);
                var setSpinning = spinning[1];
                spinning = spinning[0];

                var spinResult = useState(null);
                var setSpinResult = spinResult[1];
                spinResult = spinResult[0];

                var rotation = useState(0);
                var setRotation = rotation[1];
                rotation = rotation[0];

                var drawWheel = useCallback(function () {
                    var canvas = canvasRef.current;
                    if (!canvas) return;
                    var ctx = canvas.getContext("2d");
                    if (!ctx) return;

                    var centerX = canvas.width / 2;
                    var centerY = canvas.height / 2;
                    var radius = Math.min(centerX, centerY) - 20;

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

                    var arcSize = (2 * Math.PI) / segments.length;

                    segments.forEach(function (segment, i) {
                        var startAngle = i * arcSize;
                        var endAngle = (i + 1) * arcSize;

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
                        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
                        gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
                        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
                        ctx.fillStyle = gradient;
                        ctx.fill();

                        // Draw text for each segment with proper radial orientation
                        ctx.save();
                        var segmentCenterAngle = i * arcSize + arcSize / 2;
                        var textRadius = radius * 0.7; // Position text at 70% of radius

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

                useEffect(function () {
                    drawWheel();
                }, [drawWheel]);

                var spin = function () {
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

                    var totalRevolutions = minRevolutions + Math.random() * (maxRevolutions - minRevolutions);
                    var targetSegmentIndex = Math.floor(Math.random() * segments.length);
                    var segmentAngle = (2 * Math.PI) / segments.length;
                    var targetSegmentCenterAngle = targetSegmentIndex * segmentAngle + segmentAngle / 2;
                    var rotationToAlignTarget = ((0 - targetSegmentCenterAngle + 2 * Math.PI) % (2 * Math.PI));
                    var finalRot = totalRevolutions * 2 * Math.PI + rotationToAlignTarget;

                    var startTime = Date.now();
                    var animate = function () {
                        var elapsed = Date.now() - startTime;
                        var progress = Math.min(elapsed / animationDuration, 1);
                        var easedProgress = 1 - Math.pow(1 - progress, 4);

                        setRotation(finalRot * easedProgress);

                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setSpinning(false);

                            // Calculate the actual winning segment based on final rotation
                            var normalizedRotation = (finalRot % (2 * Math.PI));
                            var pointerAngle = (2 * Math.PI - normalizedRotation) % (2 * Math.PI);
                            var segmentSize = (2 * Math.PI) / segments.length;
                            var winningSegmentIndex = Math.floor(pointerAngle / segmentSize) % segments.length;

                            var result = segments[winningSegmentIndex];
                            setSpinResult(result);
                            if (onSpinEnd) {
                                onSpinEnd(result);
                            }
                        }
                    };

                    requestAnimationFrame(animate);
                };

                return React.createElement('div', {
                    ref: ref,
                    style: {
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        maxWidth: '32rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '16px',
                        padding: '32px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                    }
                }, [
                    title && React.createElement('h2', {
                        key: 'title',
                        style: {
                            fontSize: '32px',
                            fontWeight: 'bold',
                            marginBottom: '24px',
                            textAlign: 'center',
                            color: '#1f2937'
                        }
                    }, title),
                    React.createElement('div', {
                        key: 'wheel-container',
                        style: {
                            position: 'relative',
                            marginBottom: '24px'
                        }
                    }, [
                        React.createElement('canvas', {
                            key: 'canvas',
                            ref: canvasRef,
                            width: wheelSize,
                            height: wheelSize,
                            style: {
                                borderRadius: '50%',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }
                        }),
                        spinning && React.createElement('div', {
                            key: 'spinning-overlay',
                            style: {
                                position: 'absolute',
                                inset: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }
                        }, React.createElement('div', {
                            style: {
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '50px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }
                        }, spinningText))
                    ]),
                    React.createElement(Button, {
                        key: 'spin-button',
                        onClick: spin,
                        disabled: spinning || disabled,
                        style: {
                            backgroundColor: '#8b5cf6',
                            color: 'white',
                            padding: '16px 48px',
                            fontSize: '20px',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.39)',
                            minWidth: '120px',
                            opacity: (spinning || disabled) ? 0.5 : 1
                        },
                        'data-spin-button': true
                    }, buttonText)
                ]);
            });

            // FloatingWheelGame Component
            var FloatingWheelGame = function (props) {
                // Get configuration from data attributes
                var configElement = document.querySelector('.wsg-cmp-default');
                var config = {};

                if (configElement) {
                    config.title = configElement.getAttribute('data-wsg-title') || "Spin to Win!";
                    config.buttonText = configElement.getAttribute('data-wsg-button-text') || "SPIN";
                    config.spinningText = configElement.getAttribute('data-wsg-spinning-text') || "Spinning...";
                    config.wheelSize = parseInt(configElement.getAttribute('data-wsg-wheel-size')) || 400;
                    config.animationDuration = parseInt(configElement.getAttribute('data-wsg-animation-duration')) || 3000;
                    config.minRevolutions = parseInt(configElement.getAttribute('data-wsg-min-revolutions')) || 3;
                    config.maxRevolutions = parseInt(configElement.getAttribute('data-wsg-max-revolutions')) || 5;
                    console.log('🎮 Configuration loaded:', config);
                } else {
                    console.warn('⚠️ Configuration element not found, using defaults');
                }

                var segments = props.segments || [];
                var wheelSize = config.wheelSize || props.wheelSize || 400;
                var animationDuration = config.animationDuration || props.animationDuration || 3000;
                var minRevolutions = config.minRevolutions || props.minRevolutions || 3;
                var maxRevolutions = config.maxRevolutions || props.maxRevolutions || 5;
                var title = config.title || props.title || "Spin to Win!";
                var buttonText = config.buttonText || props.buttonText || "SPIN";
                var spinningText = config.spinningText || props.spinningText || "Spinning...";
                var disabled = props.disabled || false;
                var onSpinStart = props.onSpinStart;
                var onSpinEnd = props.onSpinEnd;

                var isModalOpen = useState(false);
                var setIsModalOpen = isModalOpen[1];
                isModalOpen = isModalOpen[0];

                var showPrize = useState(false);
                var setShowPrize = showPrize[1];
                showPrize = showPrize[0];

                var currentPrize = useState(null);
                var setCurrentPrize = currentPrize[1];
                currentPrize = currentPrize[0];

                var showConfetti = useState(false);
                var setShowConfetti = showConfetti[1];
                showConfetti = showConfetti[0];

                var showEmailInput = useState(false);
                var setShowEmailInput = showEmailInput[1];
                showEmailInput = showEmailInput[0];

                var userEmail = useState('');
                var setUserEmail = userEmail[1];
                userEmail = userEmail[0];

                var emailError = useState('');
                var setEmailError = emailError[1];
                emailError = emailError[0];

                // Get segments from script tag
                if (segments.length === 0) {
                    try {
                        var segmentsScript = document.getElementById('wheel-spin-game-segments');
                        if (segmentsScript && segmentsScript.textContent) {
                            segments = JSON.parse(segmentsScript.textContent.trim());
                            console.log('🎯 Segments loaded from AEM:', segments);
                            console.log('🔍 Segments redeem codes check:', segments.map(function (s) { return { text: s.text, redeemCode: s.redeemCode }; }));
                            console.log('🔍 Raw segments data structure:', JSON.stringify(segments, null, 2));
                        }
                    } catch (e) {
                        console.warn('Failed to parse segments, using defaults:', e);
                    }

                    // Default segments if none provided
                    if (segments.length === 0) {
                        segments = [
                            { text: "🎁 Free Gift", color: "#FF6B6B" },
                            { text: "💰 $10 Cash", color: "#4ECDC4" },
                            { text: "🎯 50% Off", color: "#45B7D1" },
                            { text: "🎪 Try Again", color: "#96CEB4" },
                            { text: "🏆 Grand Prize", color: "#FFEAA7" },
                            { text: "🎨 Mystery Box", color: "#DDA0DD" }
                        ];
                        console.log('🎯 Using default segments:', segments);
                    }
                }

                // Normalize segments to ensure redeem codes are preserved
                segments = segments.map(function (segment) {
                    return {
                        text: segment.text || segment.segmentText || 'Prize',
                        color: segment.color || segment.segmentColor || '#FF6B6B',
                        value: segment.value || segment.segmentValue || '',
                        bgColor: segment.bgColor || segment.segmentBgColor || '',
                        icon: segment.icon || segment.segmentIcon || '',
                        probability: segment.probability || 0.125,
                        redeemCode: segment.redeemCode || null
                    };
                });

                // IMMEDIATE FIX: Generate redeem codes if null
                segments.forEach(function (segment) {
                    if (!segment.redeemCode || segment.redeemCode.trim() === '') {
                        var baseCode = segment.text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                        if (baseCode.length > 8) {
                            baseCode = baseCode.substring(0, 8);
                        }
                        segment.redeemCode = "WHEEL" + baseCode + "123";
                        console.log('🔧 Generated redeem code for:', segment.text, '->', segment.redeemCode);
                    }
                });

                console.log('🔍 Segments redeem codes check:', segments.map(function (s) { return { text: s.text, redeemCode: s.redeemCode }; }));

                // Handle ESC key to close modal
                useEffect(function () {
                    var handleEscape = function (event) {
                        if (event.key === 'Escape' && isModalOpen) {
                            setIsModalOpen(false);
                        }
                    };

                    if (isModalOpen) {
                        document.addEventListener('keydown', handleEscape);
                        // Prevent body scroll when modal is open
                        document.body.style.overflow = 'hidden';
                    }

                    return function () {
                        document.removeEventListener('keydown', handleEscape);
                        document.body.style.overflow = 'unset';
                    };
                }, [isModalOpen]);

                var handleCloseModal = useCallback(function () {
                    setIsModalOpen(false);
                }, []);

                var handleBackdropClick = useCallback(function (event) {
                    if (event.target === event.currentTarget) {
                        handleCloseModal();
                    }
                }, [handleCloseModal]);

                // Enhanced prize reveal handler
                var handleSpinEnd = useCallback(function (result) {
                    console.log('🎯 Wheel spin result with redeem code:', result);
                    setCurrentPrize(result);

                    // Trigger confetti and prize reveal sequence - much faster timing
                    setTimeout(function () {
                        setShowConfetti(true);
                        setShowPrize(true); // Show prize immediately with confetti
                    }, 300); // Reduced from 1000ms to 300ms

                    // Call original onSpinEnd if provided
                    if (onSpinEnd) {
                        onSpinEnd(result);
                    }
                }, [onSpinEnd]);

                // Email validation function
                var validateEmail = function (email) {
                    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                };

                // Handle email submission
                var handleEmailSubmit = useCallback(function (email) {
                    if (!validateEmail(email)) {
                        setEmailError('Please enter a valid email address');
                        return false;
                    }
                    setUserEmail(email);
                    setEmailError('');
                    setShowEmailInput(false);
                    // After email is submitted, trigger the actual spin
                    setTimeout(function () {
                        // Trigger spin by calling the spin function directly
                        var spinButton = document.querySelector('[data-spin-button]');
                        if (spinButton) {
                            spinButton.click();
                        }
                    }, 100);
                    return true;
                }, []);

                // Handle spin button click - show email input first
                var handleSpinClick = useCallback(function () {
                    setShowEmailInput(true);
                }, []);

                // Reset prize state when modal opens
                var handleOpenModal = useCallback(function () {
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
                        style: {
                            position: 'fixed',
                            bottom: '24px',
                            right: '24px',
                            zIndex: 40,
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            animation: 'pulse 2s infinite',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        },
                        'aria-label': "Open Wheel Spin Game"
                    }, [
                        // Gift icon using SVG
                        React.createElement('svg', {
                            key: 'gift-icon',
                            style: { width: '32px', height: '32px' },
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            xmlns: "http://www.w3.org/2000/svg"
                        }, React.createElement('path', {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                        }))
                    ]),

                    // Modal Overlay
                    isModalOpen && React.createElement('div', {
                        key: 'modal-overlay',
                        style: {
                            position: 'fixed',
                            inset: '0',
                            zIndex: 50,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '16px',
                            backgroundColor: 'rgba(0,0,0,0.5)'
                        },
                        onClick: handleBackdropClick
                    }, React.createElement('div', {
                        style: {
                            position: 'relative',
                            width: '100%',
                            maxWidth: '32rem',
                            maxHeight: '90vh',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                        }
                    }, [
                        // Close Button
                        React.createElement('button', {
                            key: 'close-button',
                            onClick: handleCloseModal,
                            style: {
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                zIndex: 10,
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: '#f3f4f6',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            },
                            'aria-label': "Close modal"
                        }, React.createElement('svg', {
                            style: { width: '16px', height: '16px', color: '#4b5563' },
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
                            style: {
                                position: 'absolute',
                                inset: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                zIndex: 20
                            }
                        }, React.createElement('div', {
                            style: {
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '32px',
                                maxWidth: '400px',
                                width: '100%',
                                margin: '16px',
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
                            }
                        }, [
                            React.createElement('h3', {
                                key: 'email-title',
                                style: { fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px', color: '#1f2937' }
                            }, "Enter Your Email"),
                            React.createElement('p', {
                                key: 'email-description',
                                style: { textAlign: 'center', marginBottom: '24px', color: '#6b7280' }
                            }, "Please enter your email address to spin the wheel and claim your prize!"),
                            React.createElement('input', {
                                key: 'email-input',
                                type: "email",
                                placeholder: "your.email@example.com",
                                style: {
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                    fontSize: '16px',
                                    outline: 'none',
                                    boxSizing: 'border-box'
                                },
                                value: userEmail,
                                onChange: function (e) {
                                    setUserEmail(e.target.value);
                                    if (emailError) setEmailError('');
                                },
                                onKeyPress: function (e) {
                                    if (e.key === 'Enter') {
                                        handleEmailSubmit(userEmail);
                                    }
                                }
                            }),
                            emailError && React.createElement('p', {
                                key: 'email-error',
                                style: { color: '#ef4444', fontSize: '14px', marginBottom: '16px', textAlign: 'center' }
                            }, emailError),
                            React.createElement('div', {
                                key: 'email-buttons',
                                style: { display: 'flex', gap: '12px' }
                            }, [
                                React.createElement('button', {
                                    key: 'cancel-email',
                                    onClick: function () { setShowEmailInput(false); },
                                    style: {
                                        flex: 1,
                                        padding: '12px 16px',
                                        backgroundColor: '#e5e7eb',
                                        color: '#374151',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }
                                }, "Cancel"),
                                React.createElement('button', {
                                    key: 'submit-email',
                                    onClick: function () { handleEmailSubmit(userEmail); },
                                    style: {
                                        flex: 1,
                                        padding: '12px 16px',
                                        backgroundColor: '#8b5cf6',
                                        color: 'white',
                                        fontWeight: '600',
                                        borderRadius: '8px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }
                                }, "Continue")
                            ])
                        ])),

                        // Game Content
                        React.createElement('div', {
                            key: 'game-content',
                            style: {
                                padding: '24px',
                                opacity: (showPrize || showEmailInput) ? 0 : 1,
                                transition: 'opacity 0.2s'
                            }
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
                            userEmail: userEmail
                        })),

                        // Prize Reveal Overlay
                        showPrize && currentPrize && React.createElement('div', {
                            key: 'prize-overlay',
                            style: {
                                position: 'absolute',
                                inset: '0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                                borderRadius: '16px'
                            }
                        }, [

                            React.createElement('div', {
                                style: { textAlign: 'center', color: 'white', padding: '32px' }
                            }, [
                                React.createElement('div', {
                                    key: 'emoji',
                                    style: { fontSize: '80px', marginBottom: '24px' }
                                }, "🎉"),
                                React.createElement('h2', {
                                    key: 'congrats',
                                    style: { fontSize: '36px', fontWeight: 'bold', marginBottom: '24px' }
                                }, "Congratulations!"),
                                React.createElement('p', {
                                    key: 'prize-message',
                                    style: { fontSize: '24px', marginBottom: '24px' }
                                }, 'You won a ' + currentPrize.text + '!'),
                                React.createElement('div', {
                                    key: 'prize-card',
                                    style: {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        borderRadius: '16px',
                                        padding: '32px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        marginBottom: '24px'
                                    }
                                }, [
                                    currentPrize.value && React.createElement('p', {
                                        key: 'prize-value',
                                        style: { fontSize: '18px', marginBottom: '16px' }
                                    }, currentPrize.value),
                                    currentPrize.redeemCode && React.createElement('div', {
                                        key: 'redeem-code',
                                        style: {
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            border: '1px solid rgba(255,255,255,0.2)'
                                        }
                                    }, [
                                        React.createElement('p', {
                                            key: 'redeem-label',
                                            style: { fontSize: '14px', marginBottom: '8px', opacity: 0.9 }
                                        }, 'Your Redeem Code:'),
                                        React.createElement('p', {
                                            key: 'redeem-value',
                                            style: { fontSize: '20px', fontWeight: 'bold', fontFamily: 'monospace' }
                                        }, currentPrize.redeemCode)
                                    ]),
                                    userEmail && React.createElement('p', {
                                        key: 'user-email',
                                        style: { fontSize: '16px', marginTop: '16px', opacity: 0.8 }
                                    }, 'Email: ' + userEmail)
                                ]),
                                React.createElement('button', {
                                    key: 'claim-button',
                                    onClick: handleCloseModal,
                                    style: {
                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                        color: 'white',
                                        fontWeight: '600',
                                        padding: '16px 32px',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(255,255,255,0.3)',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease'
                                    },
                                    onMouseEnter: function (e) {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.boxShadow = '0 6px 20px rgba(255,255,255,0.2)';
                                    },
                                    onMouseLeave: function (e) {
                                        e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.boxShadow = 'none';
                                    }
                                }, "Claim Prize")
                            ])
                        ])
                    ]))
                ]);
            };

            try {
                var root = ReactDOM.createRoot(container);
                root.render(React.createElement(FloatingWheelGame));
                console.log('✅ Complete wheel spin game rendered successfully!');
            } catch (error) {
                console.error('❌ React rendering failed:', error);
            }
        } else {
            console.error('❌ Container not found');
        }
    } else {
        console.error('❌ React dependencies not found');
        console.log('Available globals:', Object.keys(window).filter(function (key) {
            return key.toLowerCase().includes('react');
        }));
    }
}, 1000);
