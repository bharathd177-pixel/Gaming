const bgMusic = document.getElementById("bgMusic");
bgMusic.volume = 0.3; // 30% volume

// Play music on first user click
document.body.addEventListener("click", async function startMusic() {
	try {
		await bgMusic.play();
		console.log("Music started 🎶");
		document.body.removeEventListener("click", startMusic); // run only once
	} catch (err) {
		console.warn("Audio playback blocked:", err);
	}
});

bgMusic.addEventListener("ended", () => {
	console.log("Music ended, restarting...");
	bgMusic.currentTime = 0; // rewind to start
	bgMusic.play(); // play again
});


//when user click the page first time music will start
// document.body.addEventListener("click", async function startMusic() {
// try {
// await bgMusic.play();
// console.log("Music started 🎶");
// document.body.removeEventListener("click", startMusic);
// } catch (err) {
// console.warn("Audio playback blocked:", err);
// }
// });

document.addEventListener("visibilitychange", async () => {
	if (document.hidden) {
		bgMusic.pause();
		console.log("Music paused ⏸️ (tab hidden)");
	} else {
		try {
			await bgMusic.play();
			console.log("Music resumed ▶️ (tab active)");
		} catch (err) {
			console.warn("Cannot autoplay until user interaction:", err);
		}
	}
});