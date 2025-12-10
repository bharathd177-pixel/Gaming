// Asset Preloading
function preloadGameAssets() {
	const images = [
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/Citi-logo.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/citi-card.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/copy.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/home.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/share.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/01-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/02-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/03-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/04-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/05-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/06-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/07-icon.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/Avator-Back.gif',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/Avator-Front.gif',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/leftwalkcycle.gif',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/rightwalkcycle.gif',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/leftsidewalkcycle_01.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/rightsidewalkcycle_01.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/Victor-backturnleftleg.png',
		'/etc.clientlibs/xeragotheme/clientlibs/clientlib-smartrush/resources/images/Victor-leftleg.png'
	];
	images.forEach(src => {
		const img = new Image();
		img.src = src;
	});
}

$(document).ready(function() {
	preloadGameAssets()
});