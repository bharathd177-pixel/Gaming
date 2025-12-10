// Tap-to-Start Overlay Logic 1296 to end
function showTapToStart() {
	const tapOverlay = document.getElementById('tapToStart');
	if (tapOverlay) {
		tapOverlay.style.display = 'flex';
	}

	if (window.game) {
		window.game.gameRunning = false;
		window.game.setupTapToStart();
	}
}

window.addEventListener('load', () => {
	clearAllTimers();

	game = new MetroMazeGame();

	game.gameRunning = false;
	game.gameTimer = null;
	game.timeLeft = 60;

	setupPlayAgainButton();

	animateDoors();
});

// Improved pull-to-refresh prevention: only block downward swipe from top
let maybePrevent = false;
let startY = 0;
window.addEventListener('touchstart', function(e) {
	if (e.touches && e.touches.length === 1) {
		startY = e.touches[0].clientY;
		maybePrevent = (window.scrollY === 0);
	}
});
window.addEventListener('touchmove', function(e) {
	const currentY = e.touches && e.touches.length ? e.touches[0].clientY : 0;
	const isPullingDown = currentY - startY > 10;
	if (maybePrevent && isPullingDown) {
		e.preventDefault();
	}
}, { passive: false });

$(document).ready(function() {

	$("#how-to-play").one("click", function() {

		var cta = $(event.target).text() || $(this).text().trim();

		var adobeEvent = new CustomEvent('adobeEvent', {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:landing page",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: cta

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
				eventLabel: cta
			}

		};
		document.querySelector('body').dispatchEvent(adobeEvent);
	})

	$("#tnc-link").one("click", function() {

		//var cta = $(event.target).attr('id');

		var cta = $(event.target).text() || $(this).text().trim();

		var adobeEvent = new CustomEvent('adobeEvent', {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:landing page",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: cta

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
				eventLabel: cta
			}

		};
		document.querySelector('body').dispatchEvent(adobeEvent);
	})

	$("#start-game-from-how-to-play").one("click", function() {

		//var ctaValue = $(this).text();

		var adobeEvent = new CustomEvent('adobeEvent', {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:how to play",
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
				pageName: "sg:public:icms:smrt card:gamification:how to play",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: "start the game"
			}

		};
		document.querySelector('body').dispatchEvent(adobeEvent);
	})

	$(".reward-apply-btn").one(
		"click", function() {

			//var valueInside = $(this).text().trim();

			var adobeEvent = new CustomEvent('adobeEvent', {
				detail: {
					pageName: "sg:public:icms:smrt card:gamification:completed",
					language: "en",
					pageCategory: "pre-login campaign page",
					eventCategory: "interaction",
					eventAction: "click",
					eventLabel: "apply now"

				}
			});
			window.adobeEvent = window.adobeEvent || {};

			window.adobeEvent = {
				detail: {
					pageName: "sg:public:icms:smrt card:gamification:completed",
					language: "en",
					pageCategory: "pre-login campaign page",
					eventCategory: "interaction",
					eventAction: "click",
					eventLabel: "apply now"
				}

			};
			document.querySelector('body').dispatchEvent(adobeEvent);
		})

	$(".reward-home-btn").one("click", function() {

		var adobeEvent = new CustomEvent('adobeEvent', {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:completed",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: "back to home page"

			}
		});
		window.adobeEvent = window.adobeEvent || {};

		window.adobeEvent = {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:completed",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: "back to home page"
			}

		};
		document.querySelector('body').dispatchEvent(adobeEvent);
	})

	$(".reward-share-btn").one("click", function() {

		var adobeEvent = new CustomEvent('adobeEvent', {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:completed",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: "share"

			}
		});
		window.adobeEvent = window.adobeEvent || {};

		window.adobeEvent = {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:completed",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: "share"
			}

		};
		document.querySelector('body').dispatchEvent(adobeEvent);
	})

}

);