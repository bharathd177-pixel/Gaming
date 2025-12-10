(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react'), require('react-dom')) :
  typeof define === 'function' && define.amd ? define(['react', 'react-dom'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Gamification = factory(global.React, global.ReactDOM));
})(this, (function (React, ReactDOM) { 'use strict';

  // Simple scratch card component
  function ScratchCard({ prize, onReveal }) {
    const [isRevealed, setIsRevealed] = React.useState(false);
    
    const handleReveal = () => {
      setIsRevealed(true);
      if (onReveal) onReveal(prize);
    };

    return React.createElement('div', {
      style: {
        width: '300px',
        height: '200px',
        background: isRevealed ? '#fff' : '#ccc',
        border: '2px solid #333',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold'
      },
      onClick: handleReveal
    }, isRevealed ? (prize?.text || 'Prize!') : 'Click to scratch!');
  }

  // Simple pick-a-gift component
  function PickAGift({ prizes, onSelect }) {
    const [selectedPrize, setSelectedPrize] = React.useState(null);
    
    const handleSelect = (prize) => {
      setSelectedPrize(prize);
      if (onSelect) onSelect(prize);
    };

    if (selectedPrize) {
      return React.createElement('div', {
        style: { textAlign: 'center', padding: '20px' }
      }, React.createElement('h2', null, 'You won: ' + selectedPrize.text));
    }

    return React.createElement('div', {
      style: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }
    }, (prizes || []).map((prize, index) => 
      React.createElement('div', {
        key: index,
        style: {
          width: '100px',
          height: '100px',
          background: prize.color || '#f0f0f0',
          border: '2px solid #333',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        },
        onClick: () => handleSelect(prize)
      }, prize.text || 'Gift ' + (index + 1))
    ));
  }

  // Floating modal wrapper
  function FloatingModal({ children, isOpen, onClose }) {
    if (!isOpen) return null;

    return React.createElement('div', {
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      },
      onClick: onClose
    }, React.createElement('div', {
      style: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '500px',
        width: '90%'
      },
      onClick: (e) => e.stopPropagation()
    }, children));
  }

  // Advanced Scratch Card with Canvas
  function AdvancedScratchCard({ prize, onReveal, cardWidth = 300, cardHeight = 200 }) {
    const canvasRef = React.useRef(null);
    const [isRevealed, setIsRevealed] = React.useState(false);
    const [isScratching, setIsScratching] = React.useState(false);

    React.useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      canvas.width = cardWidth;
      canvas.height = cardHeight;

      // Draw scratch surface
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(0, 0, cardWidth, cardHeight);
      
      // Add scratch pattern
      ctx.fillStyle = '#a0a0a0';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Scratch to reveal', cardWidth / 2, cardHeight / 2);
    }, [cardWidth, cardHeight]);

    const handleScratch = (e) => {
      if (isRevealed) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();

      // Check if enough is scratched
      const imageData = ctx.getImageData(0, 0, cardWidth, cardHeight);
      const pixels = imageData.data;
      let transparent = 0;
      
      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparent++;
      }

      const scratchedPercentage = (transparent / (cardWidth * cardHeight)) * 100;
      if (scratchedPercentage > 30 && !isRevealed) {
        setIsRevealed(true);
        if (onReveal) onReveal(prize);
      }
    };

    return React.createElement('div', {
      style: {
        position: 'relative',
        width: cardWidth + 'px',
        height: cardHeight + 'px',
        margin: '0 auto',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
      }
    },
      // Prize background
      React.createElement('div', {
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(135deg, ${prize?.color || '#28a745'}, ${prize?.color || '#28a745'}dd)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
          color: 'white',
          textAlign: 'center'
        }
      }, prize?.text || 'Prize!'),
      
      // Scratch canvas
      React.createElement('canvas', {
        ref: canvasRef,
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'crosshair'
        },
        onMouseDown: () => setIsScratching(true),
        onMouseUp: () => setIsScratching(false),
        onMouseMove: (e) => isScratching && handleScratch(e),
        onClick: handleScratch
      })
    );
  }

  // Confetti Component
  function Confetti({ isActive }) {
    if (!isActive) return null;

    const particles = Array.from({ length: 50 }, (_, i) => 
      React.createElement('div', {
        key: i,
        style: {
          position: 'fixed',
          left: Math.random() * 100 + '%',
          top: '-10px',
          width: '10px',
          height: '10px',
          backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)],
          animation: `confetti-fall ${2 + Math.random() * 3}s linear infinite`,
          animationDelay: Math.random() * 2 + 's',
          zIndex: 9999
        }
      })
    );

    return React.createElement('div', null, ...particles);
  }

  // Floating scratch card game (matching React component)
  function FloatingScratchCardGame({ prize, cardWidth = 300, cardHeight = 200 }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [showEmailInput, setShowEmailInput] = React.useState(false);
    const [showPrize, setShowPrize] = React.useState(false);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
    const [currentPrize, setCurrentPrize] = React.useState(null);
    const [activePrize, setActivePrize] = React.useState(prize || { text: '50% Off', color: '#28a745', value: 'SAVE50' });

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setShowEmailInput(false);
      setShowPrize(false);
      setShowConfetti(false);
      setUserEmail('');
      setCurrentPrize(null);
    };

    const handleEmailSubmit = (e) => {
      e.preventDefault();
      if (userEmail) {
        setShowEmailInput(false);
      }
    };

    const handleReveal = (wonPrize) => {
      setCurrentPrize(wonPrize);
      setShowEmailInput(true);
    };

    const handleEmailConfirm = () => {
      setShowEmailInput(false);
      setShowPrize(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    return React.createElement('div', null,
      // Confetti
      React.createElement(Confetti, { isActive: showConfetti }),

      // Floating button
      React.createElement('button', {
        onClick: handleOpenModal,
        style: {
          position: 'fixed',
          bottom: '24px',
          right: '96px',
          zIndex: 40,
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite'
        },
        onMouseEnter: (e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.animation = 'none';
        },
        onMouseLeave: (e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.animation = 'pulse 2s infinite';
        }
      }, '🎁'),

      // Modal
      isModalOpen && React.createElement('div', {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        },
        onClick: handleCloseModal
      },
        React.createElement('div', {
          style: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          },
          onClick: (e) => e.stopPropagation()
        },
          // Close button
          React.createElement('button', {
            onClick: handleCloseModal,
            style: {
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }
          }, '×'),

          // Email input overlay
          showEmailInput && React.createElement('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              zIndex: 10
            }
          },
            React.createElement('div', {
              style: { textAlign: 'center', padding: '20px' }
            },
              React.createElement('h2', {
                style: { marginBottom: '20px', color: '#333' }
              }, 'Enter your email to claim your prize!'),
              React.createElement('form', {
                onSubmit: (e) => {
                  e.preventDefault();
                  handleEmailConfirm();
                }
              },
                React.createElement('input', {
                  type: 'email',
                  value: userEmail,
                  onChange: (e) => setUserEmail(e.target.value),
                  placeholder: 'your@email.com',
                  required: true,
                  style: {
                    width: '100%',
                    padding: '12px',
                    margin: '10px 0',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }
                }),
                React.createElement('div', {
                  style: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }
                },
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => setShowEmailInput(false),
                    style: {
                      padding: '12px 24px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }
                  }, 'Cancel'),
                  React.createElement('button', {
                    type: 'submit',
                    style: {
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }
                  }, 'Claim Prize')
                )
              )
            )
          ),

          // Game content
          React.createElement('div', {
            style: {
              opacity: showEmailInput ? 0.3 : 1,
              transition: 'opacity 0.2s',
              textAlign: 'center'
            }
          },
            React.createElement('h2', {
              style: { marginBottom: '20px', color: '#333' }
            }, 'Scratch to reveal your prize!'),
            React.createElement(AdvancedScratchCard, {
              prize: activePrize,
              onReveal: handleReveal,
              cardWidth: cardWidth,
              cardHeight: cardHeight
            })
          )
        )
      ),

      // Prize reveal overlay
      showPrize && currentPrize && React.createElement('div', {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60
        }
      },
        React.createElement('div', {
          style: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            animation: 'prize-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
          }
        },
          React.createElement('div', {
            style: { fontSize: '64px', marginBottom: '20px' }
          }, '🎉'),
          React.createElement('h1', {
            style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }
          }, 'Congratulations!'),
          React.createElement('p', {
            style: { fontSize: '20px', marginBottom: '8px', color: '#666' }
          }, 'You won:'),
          // Prize display with value/code box (matching React version)
          React.createElement('div', {
            style: {
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              border: '2px solid rgba(236, 72, 153, 0.2)'
            }
          },
            React.createElement('div', {
              style: { fontSize: '48px', marginBottom: '12px' }
            }, '🎯'),
            React.createElement('p', {
              style: { fontSize: '28px', fontWeight: 'bold', color: currentPrize.color || '#28a745', marginBottom: '12px' }
            }, currentPrize.text),
            currentPrize.value && React.createElement('div', {
              style: {
                background: currentPrize.color || '#28a745',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block'
              }
            }, 'Use code ' + currentPrize.value)
          ),
          userEmail && React.createElement('p', {
            style: { fontSize: '14px', color: '#666', marginBottom: '20px' }
          }, 'Prize details sent to: ' + userEmail),
          React.createElement('button', {
            onClick: handleCloseModal,
            style: {
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }
          }, 'Close')
        )
      )
    );
  }

  // Advanced Pick-a-Gift Component
  function AdvancedPickAGift({ prizes, onReveal }) {
    const [selectedPrize, setSelectedPrize] = React.useState(null);
    const [isRevealing, setIsRevealing] = React.useState(false);

    const handleSelect = (prize) => {
      if (selectedPrize) return;
      
      setSelectedPrize(prize);
      setIsRevealing(true);
      
      setTimeout(() => {
        if (onReveal) onReveal(prize);
      }, 800);
    };

    return React.createElement('div', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
        gap: '16px',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto'
      }
    }, (prizes || []).map((prize, index) => 
      React.createElement('div', {
        key: index,
        onClick: () => handleSelect(prize),
        style: {
          width: '120px',
          height: '120px',
          background: selectedPrize === prize 
            ? `linear-gradient(135deg, ${prize.color || '#f0f0f0'}, ${prize.color || '#f0f0f0'}dd)`
            : `linear-gradient(135deg, #f8f9fa, #e9ecef)`,
          border: selectedPrize === prize ? `3px solid ${prize.color || '#007bff'}` : '2px solid #dee2e6',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: selectedPrize ? 'default' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          transform: selectedPrize === prize ? 'scale(1.05)' : 'scale(1)',
          boxShadow: selectedPrize === prize 
            ? '0 8px 25px rgba(0,0,0,0.15)' 
            : '0 2px 8px rgba(0,0,0,0.1)',
          color: selectedPrize === prize ? 'white' : '#333'
        },
        onMouseEnter: selectedPrize ? undefined : (e) => {
          e.target.style.transform = 'scale(1.02)';
          e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.12)';
        },
        onMouseLeave: selectedPrize ? undefined : (e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
      },
        React.createElement('div', {
          style: { fontSize: '32px', marginBottom: '8px' }
        }, '🎁'),
        React.createElement('div', null, prize.text || `Gift ${index + 1}`)
      )
    ));
  }

  // Floating pick-a-gift game (matching React component)
  function FloatingPickAGiftGame({ prizes }) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [showEmailInput, setShowEmailInput] = React.useState(false);
    const [showPrize, setShowPrize] = React.useState(false);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');
    const [currentPrize, setCurrentPrize] = React.useState(null);

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setShowEmailInput(false);
      setShowPrize(false);
      setShowConfetti(false);
      setUserEmail('');
      setCurrentPrize(null);
    };

    const handleReveal = (wonPrize) => {
      setCurrentPrize(wonPrize);
      setShowEmailInput(true);
    };

    const handleEmailConfirm = () => {
      setShowEmailInput(false);
      setShowPrize(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    return React.createElement('div', null,
      // Confetti
      React.createElement(Confetti, { isActive: showConfetti }),

      // Floating button
      React.createElement('button', {
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
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          transition: 'all 0.3s ease',
          animation: 'pulse 2s infinite'
        },
        onMouseEnter: (e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.animation = 'none';
        },
        onMouseLeave: (e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.animation = 'pulse 2s infinite';
        }
      }, '🎁'),

      // Modal
      isModalOpen && React.createElement('div', {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        },
        onClick: handleCloseModal
      },
        React.createElement('div', {
          style: {
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          },
          onClick: (e) => e.stopPropagation()
        },
          // Close button
          React.createElement('button', {
            onClick: handleCloseModal,
            style: {
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666'
            }
          }, '×'),

          // Email input overlay
          showEmailInput && React.createElement('div', {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '16px',
              zIndex: 10
            }
          },
            React.createElement('div', {
              style: { textAlign: 'center', padding: '20px' }
            },
              React.createElement('h2', {
                style: { marginBottom: '20px', color: '#333' }
              }, 'Enter your email to claim your prize!'),
              React.createElement('form', {
                onSubmit: (e) => {
                  e.preventDefault();
                  handleEmailConfirm();
                }
              },
                React.createElement('input', {
                  type: 'email',
                  value: userEmail,
                  onChange: (e) => setUserEmail(e.target.value),
                  placeholder: 'your@email.com',
                  required: true,
                  style: {
                    width: '100%',
                    padding: '12px',
                    margin: '10px 0',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }
                }),
                React.createElement('div', {
                  style: { display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }
                },
                  React.createElement('button', {
                    type: 'button',
                    onClick: () => setShowEmailInput(false),
                    style: {
                      padding: '12px 24px',
                      backgroundColor: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }
                  }, 'Cancel'),
                  React.createElement('button', {
                    type: 'submit',
                    style: {
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }
                  }, 'Claim Prize')
                )
              )
            )
          ),

          // Game content
          React.createElement('div', {
            style: {
              opacity: showEmailInput ? 0.3 : 1,
              transition: 'opacity 0.2s',
              textAlign: 'center'
            }
          },
            React.createElement('h2', {
              style: { marginBottom: '20px', color: '#333' }
            }, 'Pick a gift to reveal your prize!'),
            React.createElement(AdvancedPickAGift, {
              prizes: prizes || defaultPrizes,
              onReveal: handleReveal
            })
          )
        )
      ),

      // Prize reveal overlay
      showPrize && currentPrize && React.createElement('div', {
        style: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 60
        }
      },
        React.createElement('div', {
          style: {
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '40px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '90%',
            animation: 'prize-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards'
          }
        },
          React.createElement('div', {
            style: { fontSize: '64px', marginBottom: '20px' }
          }, '🎉'),
          React.createElement('h1', {
            style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#333' }
          }, 'Congratulations!'),
          React.createElement('p', {
            style: { fontSize: '20px', marginBottom: '8px', color: '#666' }
          }, 'You won:'),
          // Prize display with value/code box (matching React version)
          React.createElement('div', {
            style: {
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
              border: '2px solid rgba(236, 72, 153, 0.2)'
            }
          },
            React.createElement('div', {
              style: { fontSize: '48px', marginBottom: '12px' }
            }, '🎯'),
            React.createElement('p', {
              style: { fontSize: '28px', fontWeight: 'bold', color: currentPrize.color || '#28a745', marginBottom: '12px' }
            }, currentPrize.text),
            currentPrize.value && React.createElement('div', {
              style: {
                background: currentPrize.color || '#28a745',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 'bold',
                display: 'inline-block'
              }
            }, 'Use code ' + currentPrize.value)
          ),
          userEmail && React.createElement('p', {
            style: { fontSize: '14px', color: '#666', marginBottom: '20px' }
          }, 'Prize details sent to: ' + userEmail),
          React.createElement('button', {
            onClick: handleCloseModal,
            style: {
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }
          }, 'Close')
        )
      )
    );
  }

  // Helper to mount components
  function mount(component, container) {
    const root = ReactDOM.createRoot(container);
    root.render(component);
    return () => root.unmount();
  }

  // Default prizes with proper value codes
  const defaultPrizes = [
    { text: '10% OFF', color: '#FFC300', value: 'DISCOUNT10' },
    { text: 'Free Shipping', color: '#FF5733', value: 'FREESHIP' },
    { text: 'Gift Card', color: '#2E86C1', value: 'GIFTCARD' }
  ];

  const defaultPrize = { text: '50% OFF', color: '#28a745', value: 'SCRATCH50' };

  // Render functions
  function renderPickAGift(container, props = {}) {
    const prizes = props.prizes || defaultPrizes;
    return mount(React.createElement(PickAGift, { prizes: prizes }), container);
  }

  function renderScratchCard(container, props = {}) {
    const prize = props.prize || defaultPrize;
    return mount(React.createElement(ScratchCard, { prize: prize }), container);
  }

  function renderFloatingPickAGift(container, props = {}) {
    const prizes = props.prizes || defaultPrizes;
    return mount(React.createElement(FloatingPickAGiftGame, { prizes: prizes }), container);
  }

  function renderFloatingScratchCard(container, props = {}) {
    const prize = props.prize || defaultPrize;
    return mount(React.createElement(FloatingScratchCardGame, { prize: prize }), container);
  }

  // API object
  const gamificationAPI = {
    renderPickAGift: renderPickAGift,
    renderScratchCard: renderScratchCard,
    renderFloatingPickAGift: renderFloatingPickAGift,
    renderFloatingScratchCard: renderFloatingScratchCard
  };

  return gamificationAPI;

}));
