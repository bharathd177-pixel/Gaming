function showGameOver(finalScore) {
	var gameOver = document.getElementById('gameOver');
	if (gameOver) gameOver.style.display = 'none';
	var tryAgain = document.getElementById('try-again');
	var scoreSpan = document.getElementById('try-again-score');
	if (scoreSpan) scoreSpan.textContent = finalScore;
	if (tryAgain) {
		tryAgain.style.display = 'flex';
		document.body.style.overflow = 'hidden';
		window.scrollTo(0, 0);
	}
}
document.addEventListener('DOMContentLoaded', function() {
	// SPA navigation logic with section-specific initialization
	function showSection(sectionId) {
		document.getElementById('start-screen').style.display = 'none';
		document.getElementById('game-screen').style.display = 'none';
		var howToPlay = document.getElementById('how-to-play-section');
		if (howToPlay) howToPlay.style.display = 'none';
		document.getElementById(sectionId).style.display = 'block';

		if (sectionId !== 'game-screen') {
			document.body.style.overflow = 'auto';
		}
	}

	// Door Animation Overlay logic

	function preloadImgs(images, callback) {
		let loaded = 0;
		const total = images.length;
		images.forEach(src => {
			const img = new Image();
			img.onload = () => {
				loaded++;
				if (loaded === total) callback();
			};
			img.src = src;
		});
	}


	function playDoorTransition() {
		preloadGameAssets();

		const gameScreen = document.getElementById('game-screen');
		const startScreen = document.getElementById('start-screen');
		const howToPlaySection = document.getElementById('how-to-play-section');

		// Hide start screen & how-to-play section if present
		if (startScreen) {
			startScreen.style.display = 'none';
		}
		if (howToPlaySection) {
			howToPlaySection.style.display = 'none';
		}

		// Hide game screen initially
		if (gameScreen) {
			gameScreen.classList.remove('slide-up');
			gameScreen.style.visibility = 'hidden';
			gameScreen.style.opacity = '0';
			gameScreen.style.display = 'none';
		}

		// Show the game screen directly (no doors)
		setTimeout(() => {
			if (gameScreen) {
				gameScreen.style.display = 'block';
				document.body.style.overflow = 'hidden';
				window.scrollTo(0, 0);
				initGameScreen();

				// Fade in and slide up animation
				gameScreen.style.visibility = 'visible';
				gameScreen.style.opacity = '1';
				setTimeout(() => {
					requestAnimationFrame(() => {
						gameScreen.classList.add('slide-up');
					});
				}, 100);
			}
		}, 100);
	}



	// Game initialization logic

	let gameInitialized = false;
	function initGameScreen() {
		if (!gameInitialized) {
			if (typeof startGame === "function") {
				startGame();
			}
			gameInitialized = true;
		}
	}

	// Start Screen → Game Screen with Door Animation
	var startButton = document.getElementById('to-door-animation');
	// if (startButton) {
	//     startButton.addEventListener('click', playDoorTransition);
	// }

	if (startButton) {
		startButton.addEventListener('click', function() {
			// First, run your door transition
			playDoorTransition();

			var adobeEvent = new CustomEvent('adobeEvent', {
				detail: {
					pageName: "sg:public:icms:smrt card:gamification:landing page",
					language: "en",
					pageCategory: "pre-login campaign page",
					eventCategory: "interaction",
					eventAction: "click",
					eventLabel: "start the game"

				}
			});
			window.adobeEvent = window.adobeEvent || {};

			window.adobeEvent = {
				detail: {
					pageName: "sg:public:icms:smrt card:gamification:landing page",
					language: "en",
					pageCategory: "pre-login campaign page",
					eventCategory: "interaction",
					eventAction: "click",
					eventLabel: "start the game"
				}

			};
			document.querySelector('body').dispatchEvent(adobeEvent);


		});
	}

	// On load, show only the start screen
	showSection('start-screen');

	// Add event listener for How to Play link
	var howToPlayLinks = Array.from(document.querySelectorAll('.tnc a')).filter(a => a.textContent.trim().toLowerCase().includes('how to play'));
	howToPlayLinks.forEach(function(link) {
		link.addEventListener('click', function(e) {
			e.preventDefault();
			
			showSection('how-to-play-section');
			//alert("How to Play Display");

		});
	});

	// Add event listener for Start Game button in How to Play section
	document.addEventListener('click', function(e) {
		if (e.target && e.target.id === 'start-game-from-how-to-play') {
			playDoorTransition();
		}
	});
});