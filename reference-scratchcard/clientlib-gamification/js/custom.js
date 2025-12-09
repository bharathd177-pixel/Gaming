
console.log('🚀 Starting component initialization...');
console.log('🔍 Checking for GamificationComponents...');
            
if (typeof GamificationComponents === 'undefined') {
    console.log('⏳ GamificationComponents not ready, retrying...');
    setTimeout(initComponents, 100);
    
}
console.log('✅ GamificationComponents found:', Object.keys(GamificationComponents));

    // Check for required components
    const requiredComponents = [
        'SpinWheel', 'PickAGift', 'ScratchCard', 'SlotMachine', 'Quiz', 'Plinko',
        'MultiStepQuiz', 'MemoryMatchGame', 'MysteryPrizeEgg', 'ScavengerHunt'
    ];
    const missingComponents = requiredComponents.filter(comp => !GamificationComponents[comp]);

    if (missingComponents.length > 0) {
        console.error('❌ Missing components:', missingComponents);
        showError(`Missing components: ${missingComponents.join(', ')}`);
    }

    const {
        SpinWheel, PickAGift, ScratchCard, SlotMachine, Quiz, Plinko,
        MultiStepQuiz, MemoryMatchGame, MysteryPrizeEgg, ScavengerHunt
    } = GamificationComponents;

    // Remove loading states
    document.querySelectorAll('.loading').forEach(el => {
        el.innerHTML = '';
    });

    console.log('🎯 Starting component rendering...');
    //spin Wheel Configuration
    const spinningDefault = document.querySelector('.sw-cmp-default');
    const spinningSegment = document.querySelector('.sw-cmp-segments');
    let segmentsJson;
    let segment;
    let segmentsList;
    let spinWheelConfig;
    let swTitle;
    let swBtnText;
    let swSpinningText;
    if(spinningSegment){
        segmentsJson = spinningSegment.dataset.swSegments || "[]";
        segment = JSON.parse(segmentsJson);
    }
    if(segment){
        segmentsList = segment.map(item => ({
            text: item.segmentText,
            color: item.segmentColor,
            value: item.segmentValue
        }));
    }
    if(spinningDefault){
        swTitle = spinningDefault.dataset.swTitle || "Spin the Wheel!";
        swBtnText = spinningDefault.dataset.swBtnText || "SPIN";
        swSpinningText = spinningDefault.dataset.swSpinningText || "Spinning...";
    }
    let spinWheelSegments;
    if(segmentsList){
        spinWheelSegments = segmentsList;
    }

        // Pick a Gift Configuration
        let pickGiftDefault = document.querySelector('.pick-gift-default');
        let pickGiftDetails = document.querySelector('.pick-gift-details');
        let giftTitle;
        let giftDetailsJson;
        let giftDetails;
        if(pickGiftDefault){
            giftTitle = pickGiftDefault.dataset.giftTitle || "Pick a gift";
        }
        if(pickGiftDetails){
            giftDetailsJson = pickGiftDetails.dataset.giftDetails || [];
            giftDetails = JSON.parse(giftDetailsJson);
            
        }
        let pickAGiftPrizes;
        if(giftDetails){
            pickAGiftPrizes = giftDetails;
        }
        // const pickAGiftPrizes = [
        //     { text: "30% OFF", value: "Use code: GIFT30", color: "#e74c3c", icon: "🎯" },
        //     { text: "Free Shipping", value: "On orders over $25", color: "#3498db", icon: "🚚" },
        //     { text: "$15 Gift Card", value: "Valid for 60 days", color: "#27ae60", icon: "💳" },
        //     { text: "Buy 1 Get 1 Free", value: "Select items only", color: "#f39c12", icon: "🎁" },
        //     { text: "Try Again!", value: "Better luck next time", color: "#95a5a6", icon: "🔄" },
        //     { text: "20% OFF", value: "Use code: PICK20", color: "#9b59b6", icon: "🍀" }
        // ];

        // Scratch Card Configuration
        let scratchCardDefault = document.querySelector('.scratch-card-default');
        let scratchCardDetails = document.querySelector('.scratch-card-details');
        let scratchTitle;
        let cardDetailsJson;
        let cardDetails;
        let selectedCard;
        let cardText;
        let cardValue;
        let cardColor;
        let cardIcon;
        if (scratchCardDefault) {
            scratchTitle = scratchCardDefault.dataset.scratchCardTitle || "Scratch to Win!";
        }
        if (scratchCardDetails) {
            cardDetailsJson = scratchCardDetails.dataset.scratchCardDetails || [];
            cardDetails = JSON.parse(cardDetailsJson);
            let length = cardDetails.length;
            let cardSelector = Math.floor(Math.random() * length);
            selectedCard = cardDetails[cardSelector];
            cardText = selectedCard.cardText || "25% Discount";
            cardValue = selectedCard.cardValue || "Code: SCRATCH25";
            cardColor = selectedCard.cardColor || "#4CAF50";
            cardIcon = selectedCard.cardIcon || "🎉";
            console.log('Selected Scratch Card:', selectedCard);
            console.log('Scratch Card Details:', length);
        }
        const scratchCardPrize = {
            text: cardText,
            value: cardValue,
            color: cardColor,
            icon: cardIcon
        };

        // Quiz Configuration - Fixed to match expected interface
        // const quizData = {
        //     question: "What type of product are you looking for?",
        //     options: [
        //         "Electronics",
        //         "Clothing",
        //         "Home & Garden",
        //         "Sports & Outdoors"
        //     ],
        //     correctAnswer: "Electronics",
        //     correctFeedback: "Great choice! Electronics are always in demand.",
        //     incorrectFeedback: "That's a good option too! All categories have great products.",
        //     offer: {
        //         title: "🎉 Special Offer!",
        //         description: "Get 15% off your first order",
        //         code: "WELCOME15",
        //         validUntil: "2024-12-31"
        //     }
        // };

        // Plinko Configuration
        // const plinkoPrizes = [
        //     { text: "50% Off", value: "DISCOUNT50", color: "#FFC300" },
        //     { text: "Free Shipping", value: "FREESHIP", color: "#FF5733" },
        //     { text: "Gift Card", value: "GIFTCARD", color: "#C70039" },
        //     { text: "Try Again", value: "NOLUCK", color: "#900C3F" },
        //     { text: "20% Off", value: "DISCOUNT20", color: "#581845" }
        // ];

        // console.log('🎰 Rendering Slot Machine...');
// Wait for components to load
function initComponents() {
    
        // Spin Wheel Configuration
        
        // Render Slot Machine (using vanilla JS since it's not a React component)
        // const slotMachineContainer = document.getElementById('slot-machine-container');
        // if (slotMachineContainer) {
        //     try {
        //         const slotMachine = new GamificationComponents.SlotMachine(slotMachineContainer, {
        //             onWin: (result) => {
        //                 console.log('🎰 Slot Machine Result:', result);
        //                 alert(`🎰 Congratulations! You won: ${result.prize || result.winAmount}`);
        //             }
        //         });
        //         console.log('✅ Slot Machine rendered successfully');
        //     } catch (error) {
        //         console.error('❌ Error rendering Slot Machine:', error);
        //         slotMachineContainer.innerHTML = '<div class="error-message">Failed to load Slot Machine</div>';
        //     }
        // }

        console.log('🎡 Rendering Spin Wheel...');
        // Render Spin Wheel
        
            ReactDOM.render(
                React.createElement(SpinWheel, {
                    segments: spinWheelSegments,
                    title: swTitle,
                    variant: "card",
                    size: "lg",
                    onSpin: (result) => {
                        console.log('🎡 Spin Wheel Result:', result);
                        alert(`🎉 Congratulations! You won: ${result.text}`);
                    }
                }),
                document.getElementById('spin-wheel-container')
            );
            console.log('✅ Spin Wheel rendered successfully');
        

        console.log('🎁 Rendering Pick a Gift...');
        
        // Render Scratch Card
        try {
            ReactDOM.render(
                React.createElement(ScratchCard, {
                    prize: scratchCardPrize,
                    title: scratchTitle || "Scratch to Win!",
                    variant: "card",
                    size: "lg",
                    onReveal: (prize) => {
                        console.log('🎨 Scratch Card Result:', prize);
                        alert(`🎨 You revealed: ${prize.text} - ${prize.value}`);
                    }
                }),
                document.getElementById('scratch-card-container')
            );
            console.log('✅ Scratch Card rendered successfully');
        } catch (error) {
            console.error('❌ Error rendering Scratch Card:', error);
            document.getElementById('scratch-card-container').innerHTML = '<div class="error-message">Failed to load Scratch Card</div>';
        }

        console.log('📝 Rendering Quiz...');

        // Render Pick a Gift
        try {
            ReactDOM.render(
                React.createElement(PickAGift, {
                    prizes: pickAGiftPrizes,
                    title: "Choose a Gift!",
                    subtitle: "Pick one of the gift boxes to reveal your prize",
                    size: "lg",
                    onPrizeSelected: (prize) => {
                        console.log('🎁 Pick a Gift Result:', prize);
                        alert(`🎁 You selected: ${prize.text} - ${prize.value}`);
                    }
                }),
                document.getElementById('pick-a-gift-container')
            );
            console.log('✅ Pick a Gift rendered successfully');
        } catch (error) {
            console.error('❌ Error rendering Pick a Gift:', error);
            document.getElementById('pick-a-gift-container').innerHTML = '<div class="error-message">Failed to load Pick a Gift</div>';
        }

        console.log('🎨 Rendering Scratch Card...');
        // Render Quiz - Fixed props structure
        // try {
        //     ReactDOM.render(
        //         React.createElement(Quiz, {
        //             quizData: quizData,
        //             title: "Quick Quiz",
        //             onAnswerSelect: (answer, isCorrect) => {
        //                 console.log('📝 Quiz Answer:', answer, 'Correct:', isCorrect);
        //             },
        //             onQuizComplete: (result) => {
        //                 console.log('📝 Quiz Result:', result);
        //                 alert(`📝 Quiz completed! ${result.isCorrect ? 'Correct!' : 'Try again!'}`);
        //             }
        //         }),
        //         document.getElementById('quiz-container')
        //     );
        //     console.log('✅ Quiz rendered successfully');
        // } catch (error) {
        //     console.error('❌ Error rendering Quiz:', error);
        //     document.getElementById('quiz-container').innerHTML = '<div class="error-message">Failed to load Quiz</div>';
        // }

        // console.log('🎯 Rendering Plinko...');
        // Render Plinko
        // try {
        //     ReactDOM.render(
        //         React.createElement(Plinko, {
        //             prizes: plinkoPrizes,
        //             onDropEnd: (prize) => {
        //                 console.log('🎯 Plinko Result:', prize);
        //                 alert(`🎯 You won: ${prize.text} - ${prize.value}`);
        //             }
        //         }),
        //         document.getElementById('plinko-container')
        //     );
        //     console.log('✅ Plinko rendered successfully');
        // } catch (error) {
        //     console.error('❌ Error rendering Plinko:', error);
        //     document.getElementById('plinko-container').innerHTML = '<div class="error-message">Failed to load Plinko</div>';
        // }

        // console.log('📋 Rendering Multi-Step Quiz...');
        // Render Multi-Step Quiz
        // try {
        //     ReactDOM.render(
        //         React.createElement(MultiStepQuiz, {
        //             onComplete: (answers) => {
        //                 console.log('📋 Multi-Step Quiz Result:', answers);
        //                 alert(`📋 Quiz completed! Check console for answers.`);
        //             }
        //         }),
        //         document.getElementById('multi-step-quiz-container')
        //     );
        //     console.log('✅ Multi-Step Quiz rendered successfully');
        // } catch (error) {
        //     console.error('❌ Error rendering Multi-Step Quiz:', error);
        //     document.getElementById('multi-step-quiz-container').innerHTML = '<div class="error-message">Failed to load Multi-Step Quiz</div>';
        // }

        // console.log('🧠 Rendering Memory Match Game...');
        // Render Memory Match Game
        // try {
        //     ReactDOM.render(
        //         React.createElement(MemoryMatchGame, {
        //             onGameComplete: (moves, time) => {
        //                 console.log('🧠 Memory Match Result:', { moves, time });
        //                 alert(`🧠 Game completed! Moves: ${moves}, Time: ${Math.floor(time / 1000)}s`);
        //             }
        //         }),
        //         document.getElementById('memory-match-container')
        //     );
        //     console.log('✅ Memory Match Game rendered successfully');
        // } catch (error) {
        //     console.error('❌ Error rendering Memory Match Game:', error);
        //     document.getElementById('memory-match-container').innerHTML = '<div class="error-message">Failed to load Memory Match Game</div>';
        // }

        // console.log('🥚 Rendering Mystery Prize Egg...');
        // Render Mystery Prize Egg
        // try {
        //     ReactDOM.render(
        //         React.createElement(MysteryPrizeEgg, {
        //             onPrizeRevealed: (prize) => {
        //                 console.log('🥚 Mystery Egg Prize:', prize);
        //                 alert(`🥚 You found: ${prize.name} - ${prize.description}`);
        //             },
        //             onGameComplete: (prizes) => {
        //                 console.log('🥚 All eggs cracked:', prizes);
        //                 alert(`🥚 All eggs cracked! Found ${prizes.length} prizes.`);
        //             }
        //         }),
        //         document.getElementById('mystery-egg-container')
        //     );
        //     console.log('✅ Mystery Prize Egg rendered successfully');
        // } catch (error) {
        //     console.error('❌ Error rendering Mystery Prize Egg:', error);
        //     document.getElementById('mystery-egg-container').innerHTML = '<div class="error-message">Failed to load Mystery Prize Egg</div>';
        // }

        //console.log('🗺️ Rendering Scavenger Hunt...');
        // Render Scavenger Hunt
        // try {
        //     ReactDOM.render(
        //         React.createElement(ScavengerHunt, {
        //             onClueFound: (clue) => {
        //                 console.log('🗺️ Clue found:', clue);
        //                 alert(`🗺️ Clue found: ${clue.text}`);
        //             },
        //             onGameComplete: (clues) => {
        //                 console.log('🗺️ Scavenger Hunt completed:', clues);
        //                 alert(`🗺️ Scavenger Hunt completed! Found ${clues.length} clues.`);
        //             }
        //         }),
        //         document.getElementById('scavenger-hunt-container')
        //     );
        //     console.log('✅ Scavenger Hunt rendered successfully');
        // } catch (error) {
        //     console.error('❌ Error rendering Scavenger Hunt:', error);
        //     document.getElementById('scavenger-hunt-container').innerHTML = '<div class="error-message">Failed to load Scavenger Hunt</div>';
        // }

        console.log('✅ All gamification components loaded successfully!');
        showSuccess('All components loaded successfully!');

    
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `<strong>Error:</strong> ${message}`;
    document.querySelector('.container').insertBefore(errorDiv, document.querySelector('.components-grid'));
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<strong>Success:</strong> ${message}`;
    document.querySelector('.container').insertBefore(successDiv, document.querySelector('.components-grid'));
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, starting initialization...');
    initComponents();
});

// Fallback initialization
setTimeout(() => {
    if (typeof GamificationComponents === 'undefined') {
        console.error('❌ GamificationComponents failed to load after timeout');
        showError('Components failed to load. Please check the console for errors.');
    }
}, 5000);