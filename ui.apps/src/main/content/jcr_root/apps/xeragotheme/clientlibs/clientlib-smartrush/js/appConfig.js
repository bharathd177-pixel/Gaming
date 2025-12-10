// Global variable to store the app config
window.appConfig = {};

// Function to load the config.json file
async function loadConfig() {
	try {
		let configPath;

		if (window.location.origin === 'https://devgaming.xerago.com') {
			configPath = '/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/config/config.dev.json';
		} else if (window.location.origin === 'https://testgaming.xerago.com') {
			configPath = '/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/config/config.test.json';
		} else {
			configPath = '/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/config/config.json';
		}

		const response = await fetch(`${configPath}`);
		const config = await response.json();
		window.appConfig = config;
	} catch (error) {
		console.error("Error loading config:", error);
		alert("Failed to load configuration.");
	}
}

// Load config once the window is loaded
window.onload = loadConfig;