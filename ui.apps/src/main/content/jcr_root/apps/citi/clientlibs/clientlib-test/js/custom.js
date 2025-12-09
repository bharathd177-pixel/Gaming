// Wrap the entire script in an IIFE to prevent global variable conflicts
(function() {
    const debugMode = true; // Set to true to enable console logging

    function debugLog(message, data = null, isError = false) {
        if (debugMode) {
            if (isError) {
                console.error('❌', message, data || '');
            } else {
                console.log('✅', message, data || '');
            }
        }
    }

    debugLog('🚀 Starting component initialization...');

    // Check if all required dependencies are available
    function checkDependencies() {
        const deps = {
            React: typeof window.React,
            ReactDOM: typeof window.ReactDOM,
            GamificationComponents: typeof window.GamificationComponents
        };

        debugLog('Dependency check:', deps);

        // Check if GamificationComponents exists and has the required components
        if (!deps.GamificationComponents) {
            debugLog('GamificationComponents not found in global scope', null, true);
            return false;
        }

        const requiredComponents = [
            'SpinWheel', 'PickAGift', 'ScratchCard', 'MemoryMatchGame', 'MysteryPrizeEgg', 
            'Quiz', 'MultiStepQuiz', 'SlotMachine', 'ScavengerHunt'
        ];

        const missingComponents = requiredComponents.filter(comp => 
            !window.GamificationComponents[comp]
        );

        if (missingComponents.length > 0) {
            debugLog(`Missing components: ${missingComponents.join(', ')}`, null, true);
            return false;
        }

        return true;
    }

    // Add retry counter to prevent infinite loops
    let retryCount = 0;
    const maxRetries = 10;

    // Main initialization function for all components in custom.js
    function initializeAllGamificationComponents() {
        debugLog('Attempting to initialize all custom.js Gamification Components...');

        if (!checkDependencies()) {
            retryCount++;
            if (retryCount >= maxRetries) {
                debugLog(`Max retries (${maxRetries}) reached. Stopping initialization.`, null, true);
                return;
            }
            debugLog(`Dependencies not ready, retrying initialization... (${retryCount}/${maxRetries})`);
            // Use exponential backoff or a fixed retry with a limit
            setTimeout(initializeAllGamificationComponents, 200 * retryCount); // Increasing delay
            return;
        }

        // Reset retry counter on success
        retryCount = 0;

        // Now that dependencies are confirmed, proceed with rendering logic
        const { 
            SpinWheel, PickAGift, ScratchCard, MemoryMatchGame, MysteryPrizeEgg, 
            Quiz, MultiStepQuiz, SlotMachine, ScavengerHunt 
        } = window.GamificationComponents;

        debugLog('✅ All components loaded successfully:', Object.keys(window.GamificationComponents));

        // Spin Wheel Initialization
        const spinningDefault = document.querySelector('.sw-cmp-default');
        let swTitle = '';
        let swBtnText = '';
        let swSpinningText = '';
        let swCongratsText = '';
        let swResetText = '';

        if (spinningDefault) {
            swBtnText = spinningDefault.dataset.swBtnText || "SPIN";
            swSpinningText = spinningDefault.dataset.swSpinningText || "Spinning...";
        }

        const spinWheelContainer = document.getElementById('spin-wheel-container');
        if (spinWheelContainer) {
            debugLog('Found Spin Wheel Container', spinWheelContainer);
            
            // Get segments from the sw-cmp-segments element
            const segmentsElement = document.querySelector('.sw-cmp-segments');
            let spinWheelSegments = [];
            
            if (segmentsElement && segmentsElement.dataset.swSegments) {
                try {
                    spinWheelSegments = JSON.parse(segmentsElement.dataset.swSegments);
                } catch (error) {
                    debugLog('Error parsing spin wheel segments:', error, true);
                    spinWheelSegments = [];
                }
            }
            
            const swPrizes = (spinWheelSegments || []).map(segment => ({
                text: segment.segmentText,
                value: segment.segmentValue,
                color: segment.segmentColor
            }));

            try {
                ReactDOM.render(
                    React.createElement(SpinWheel, {
                        segments: swPrizes,
                        title: swTitle,
                        buttonText: swBtnText,
                        spinningText: swSpinningText,
                        congratulationsText: swCongratsText,
                        resetButtonText: swResetText
                    }),
                    spinWheelContainer
                );
                debugLog('✅ Spin Wheel rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Spin Wheel:', error, true);
            }
        } else {
            debugLog('Spin Wheel Container not found.');
        }

        // Pick-a-Gift Initialization
        const pickAGiftContainer = document.getElementById('pick-a-gift-container');
        if (pickAGiftContainer) {
            debugLog('Found Pick-a-Gift Container', pickAGiftContainer);
            
            // Get gift data from the pick-gift-details element
            const giftDetailsElement = document.querySelector('.pick-gift-details');
            let giftData = [];
            
            if (giftDetailsElement && giftDetailsElement.dataset.giftDetails) {
                try {
                    giftData = JSON.parse(giftDetailsElement.dataset.giftDetails);
                } catch (error) {
                    debugLog('Error parsing gift details:', error, true);
                    giftData = [];
                }
            }
            
            const pickAGiftPrizes = (giftData || []).map(gift => ({
                text: gift.text,
                value: gift.value,
                color: gift.giftColor || gift.color,
                icon: gift.icon || '🎁'
            }));

            // Get title from pick-gift-default element
            const giftDefaultElement = document.querySelector('.pick-gift-default');
            const giftTitle = giftDefaultElement?.dataset.giftTitle || "Pick A Gift!";

            try {
                ReactDOM.render(
                    React.createElement(PickAGift, {
                        prizes: pickAGiftPrizes,
                        title: giftTitle,
                        instructions: pickAGiftContainer.dataset.instructions || "Click a gift to reveal your prize!",
                        resetButtonText: pickAGiftContainer.dataset.resetButtonText || "Play Again"
                    }),
                    pickAGiftContainer
                );
                debugLog('✅ Pick-a-Gift rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Pick-a-Gift:', error, true);
            }
        } else {
            debugLog('Pick-a-Gift Container not found.');
        }

        // Scratch Card Initialization
        const scratchCardContainer = document.getElementById('citi-scratch-card-container');
        if (scratchCardContainer) {
            debugLog('Found Scratch Card Container', scratchCardContainer);
            
            // Get scratch card data from the script tag to avoid HTML encoding issues
            const scratchCardDataScript = document.getElementById('scratch-card-data');
            let scratchCardData = [];
            
            if (scratchCardDataScript && scratchCardDataScript.textContent) {
                try {
                    scratchCardData = JSON.parse(scratchCardDataScript.textContent.trim());
                    debugLog('Successfully parsed scratch card data:', scratchCardData);
                } catch (error) {
                    debugLog('Error parsing scratch card details:', error, true);
                    debugLog('Raw data content:', scratchCardDataScript.textContent);
                    scratchCardData = [];
                }
            } else {
                debugLog('No scratch card data script found');
            }
            
            // Get title from scratch-card-default element
            const scratchCardDefaultElement = document.querySelector('.scratch-card-default');
            const scratchCardTitle = scratchCardDefaultElement?.dataset.scratchCardTitle || "Scratch Card!";

            // Map all prizes to the format expected by the ScratchCard component
            const scratchCardPrizes = (scratchCardData || []).length > 0 ? 
                (scratchCardData || []).map(prize => ({
                    text: prize.prizeName || prize.name || prize.cardText || prize.text || "Congratulations!",
                    value: prize.prizeCode || prize.code || prize.cardValue || prize.value || "You won a prize!",
                    color: prize.bgColor || prize.cardColor || prize.color || "#4CAF50",
                    icon: prize.iconPath || prize.icon || "🎉"
                })) : [{
                    text: "Congratulations!",
                    value: "You won a prize!",
                    color: "#4CAF50",
                    icon: "🎉"
                }];
            
            // Function to randomly select a prize
            const getRandomPrize = () => {
                const randomIndex = Math.floor(Math.random() * scratchCardPrizes.length);
                const selectedPrize = scratchCardPrizes[randomIndex];
                debugLog(`Selected prize ${randomIndex + 1} of ${scratchCardPrizes.length}:`, selectedPrize);
                return selectedPrize;
            };
            
            // Initial random prize selection
            let currentPrize = getRandomPrize();

            // Function to re-render with a new random prize
            const renderScratchCard = (prize) => {
                try {
                    ReactDOM.render(
                        React.createElement(ScratchCard, {
                            prize: prize,
                            title: scratchCardTitle,
                            instructions: scratchCardContainer.dataset.instructions || "Scratch the surface to reveal your prize!",
                            resetButtonText: scratchCardContainer.dataset.resetButtonText || "Play Again",
                            onReset: () => {
                                // Select a new random prize when reset is clicked
                                const newPrize = getRandomPrize();
                                renderScratchCard(newPrize);
                            }
                        }),
                        scratchCardContainer
                    );
                    debugLog('✅ Scratch Card rendered successfully');
                } catch (error) {
                    debugLog('❌ Error rendering Scratch Card:', error, true);
                }
            };

            // Initial render
            renderScratchCard(currentPrize);
        } else {
            debugLog('Scratch Card Container not found.');
        }

        // Memory Match Game Initialization
        const memoryMatchGameContainer = document.getElementById('memory-match-game-container');
        if (memoryMatchGameContainer) {
            debugLog('Found Memory Match Game Container', memoryMatchGameContainer);
            const matchGameData = JSON.parse(memoryMatchGameContainer.dataset.gameData || '[]');
            const matchGameVariants = JSON.parse(memoryMatchGameContainer.dataset.variants || '[]');

            try {
                ReactDOM.render(
                    React.createElement(MemoryMatchGame, {
                        gameData: matchGameData,
                        variants: matchGameVariants,
                        title: memoryMatchGameContainer.dataset.title || "Memory Match Game!",
                        instructions: memoryMatchGameContainer.dataset.instructions || "Match the pairs!",
                        resetButtonText: memoryMatchGameContainer.dataset.resetButtonText || "Play Again"
                    }),
                    memoryMatchGameContainer
                );
                debugLog('✅ Memory Match Game rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Memory Match Game:', error, true);
            }
        } else {
            debugLog('Memory Match Game Container not found.');
        }

        // Mystery Prize Egg Initialization
        const mysteryPrizeEggContainer = document.getElementById('mystery-prize-egg-container');
        if (mysteryPrizeEggContainer) {
            debugLog('Found Mystery Prize Egg Container', mysteryPrizeEggContainer);
            const prizeEggData = JSON.parse(mysteryPrizeEggContainer.dataset.gameData || '[]');
            const prizeEggVariants = JSON.parse(mysteryPrizeEggContainer.dataset.variants || '[]');

            try {
                ReactDOM.render(
                    React.createElement(MysteryPrizeEgg, {
                        gameData: prizeEggData,
                        variants: prizeEggVariants,
                        title: mysteryPrizeEggContainer.dataset.title || "Mystery Prize Egg!",
                        instructions: mysteryPrizeEggContainer.dataset.instructions || "Crack the egg!",
                        resetButtonText: mysteryPrizeEggContainer.dataset.resetButtonText || "Play Again"
                    }),
                    mysteryPrizeEggContainer
                );
                debugLog('✅ Mystery Prize Egg rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Mystery Prize Egg:', error, true);
            }
        } else {
            debugLog('Mystery Prize Egg Container not found.');
        }

        // One Question Quiz Initialization
        const oneQuestionQuizContainer = document.getElementById('one-question-quiz-container');
        if (oneQuestionQuizContainer) {
            debugLog('Found One Question Quiz Container', oneQuestionQuizContainer);
            const quizData = JSON.parse(oneQuestionQuizContainer.dataset.quizData || '[]');
            const quizVariants = JSON.parse(oneQuestionQuizContainer.dataset.variants || '[]');

            try {
                ReactDOM.render(
                    React.createElement(Quiz, {
                        quizData: quizData,
                        variants: quizVariants,
                        title: oneQuestionQuizContainer.dataset.title || "One Question Quiz!",
                        instructions: oneQuestionQuizContainer.dataset.instructions || "Answer the question!",
                        resetButtonText: oneQuestionQuizContainer.dataset.resetButtonText || "Play Again"
                    }),
                    oneQuestionQuizContainer
                );
                debugLog('✅ One Question Quiz rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering One Question Quiz:', error, true);
            }
        } else {
            debugLog('One Question Quiz Container not found.');
        }

        // Multi Step Quiz Initialization
        const multiStepQuizContainer = document.getElementById('multi-step-quiz-container');
        if (multiStepQuizContainer) {
            debugLog('Found Multi Step Quiz Container', multiStepQuizContainer);
            const multiStepQuizData = JSON.parse(multiStepQuizContainer.dataset.quizData || '[]');
            const multiStepQuizVariants = JSON.parse(multiStepQuizContainer.dataset.variants || '[]');

            try {
                ReactDOM.render(
                    React.createElement(MultiStepQuiz, {
                        quizData: multiStepQuizData,
                        variants: multiStepQuizVariants,
                        title: multiStepQuizContainer.dataset.title || "Multi Step Quiz!",
                        instructions: multiStepQuizContainer.dataset.instructions || "Answer the questions!",
                        resetButtonText: multiStepQuizContainer.dataset.resetButtonText || "Play Again"
                    }),
                    multiStepQuizContainer
                );
                debugLog('✅ Multi Step Quiz rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Multi Step Quiz:', error, true);
            }
        } else {
            debugLog('Multi Step Quiz Container not found.');
        }

        // Slot Machine Initialization
        const slotMachineContainer = document.getElementById('slot-machine-container');
        if (slotMachineContainer) {
            debugLog('Found Slot Machine Container', slotMachineContainer);
            const slotMachineData = JSON.parse(slotMachineContainer.dataset.gameData || '[]');
            const slotMachineVariants = JSON.parse(slotMachineContainer.dataset.variants || '[]');

            try {
                ReactDOM.render(
                    React.createElement(SlotMachine, {
                        gameData: slotMachineData,
                        variants: slotMachineVariants,
                        title: slotMachineContainer.dataset.title || "Slot Machine!",
                        instructions: slotMachineContainer.dataset.instructions || "Spin to win!",
                        resetButtonText: slotMachineContainer.dataset.resetButtonText || "Play Again"
                    }),
                    slotMachineContainer
                );
                debugLog('✅ Slot Machine rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Slot Machine:', error, true);
            }
        } else {
            debugLog('Slot Machine Container not found.');
        }

        // Scavenger Hunt Initialization
        const scavengerHuntContainer = document.getElementById('scavenger-hunt-container');
        if (scavengerHuntContainer) {
            debugLog('Found Scavenger Hunt Container', scavengerHuntContainer);
            const huntData = JSON.parse(scavengerHuntContainer.dataset.gameData || '[]');
            const huntVariants = JSON.parse(scavengerHuntContainer.dataset.variants || '[]');

            try {
                ReactDOM.render(
                    React.createElement(ScavengerHunt, {
                        gameData: huntData,
                        variants: huntVariants,
                        title: scavengerHuntContainer.dataset.title || "Scavenger Hunt!",
                        instructions: scavengerHuntContainer.dataset.instructions || "Find the hidden items!",
                        resetButtonText: scavengerHuntContainer.dataset.resetButtonText || "Play Again"
                    }),
                    scavengerHuntContainer
                );
                debugLog('✅ Scavenger Hunt rendered successfully');
            } catch (error) {
                debugLog('❌ Error rendering Scavenger Hunt:', error, true);
            }
        } else {
            debugLog('Scavenger Hunt Container not found.');
        }
    }

    // Listener for DOM changes (e.g., when components are dynamically added by AEM editor)
    let isInitializing = false;
    const observer = new MutationObserver(function(mutationsList, observer) {
        // Prevent multiple simultaneous initializations
        if (isInitializing) {
            return;
        }
        
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any of the added nodes are gamification containers
                const hasGamificationContainers = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        return node.id && (
                            node.id.includes('spin-wheel') ||
                            node.id.includes('pick-a-gift') ||
                            node.id.includes('scratch-card') ||
                            node.id.includes('quiz') ||
                            node.id.includes('memory') ||
                            node.id.includes('mystery') ||
                            node.id.includes('slot') ||
                            node.id.includes('scavenger')
                        );
                    }
                    return false;
                });
                
                if (hasGamificationContainers) {
                    debugLog('Gamification containers detected, re-checking for components...');
                    isInitializing = true;
                    // Use a small delay to ensure DOM is stable
                    setTimeout(() => {
                        initializeAllGamificationComponents();
                        isInitializing = false;
                    }, 100);
                }
            }
        }
    });

    // Start observing the document body for configured mutations
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial component load on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        debugLog('DOM loaded, initiating initial component check...');
        // Add a small delay to ensure clientlibs are loaded, then try to initialize
        setTimeout(initializeAllGamificationComponents, 100);
    });
})();