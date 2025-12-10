/**
 * Share Utilities Module
 * Provides share functionality for the Citi Gamification game
 */

class ShareUtils {
	constructor() {
		this.defaultConfig = {
			url: 'https://www.citibank.com.sg/promotions/play-citi-smrt-rush-hour/',
			title: 'Citi Metro Pac-Man SPA',
			text: 'Check out this amazing gamification experience by Citi! Play the game and win exciting rewards.'
		};
	}

	/**
	 * Get share metadata from various sources
	 * Priority: 1. Game-specific metadata, 2. Custom config, 3. Meta tags, 4. Default values
	 */
	getShareMetadata() {
		// Try to get from game instance first (for dynamic game data)
		if (window.game && typeof window.game.getGameShareMetadata === 'function') {
			const gameMetadata = window.game.getGameShareMetadata();
			if (gameMetadata) {
				return {
					url: gameMetadata.url || this.defaultConfig.url,
					title: gameMetadata.title || this.defaultConfig.title,
					text: gameMetadata.text || this.defaultConfig.text
				};
			}
		}

		// Try to get from custom configuration
		if (window.gameConfig && window.gameConfig.share) {
			return {
				url: window.gameConfig.share.url || this.defaultConfig.url,
				title: window.gameConfig.share.title || this.defaultConfig.title,
				text: window.gameConfig.share.text || this.defaultConfig.text
			};
		}

		// Try to get from meta tags
		const metaTitle = this.getMetaContent('og:title') || this.getMetaContent('twitter:title') || document.title;
		const metaDescription = this.getMetaContent('og:description') || this.getMetaContent('twitter:description') || this.getMetaContent('description');
		const metaUrl = this.getMetaContent('og:url') || window.location.href;

		return {
			url: metaUrl || this.defaultConfig.url,
			title: metaTitle || this.defaultConfig.title,
			text: metaDescription || this.defaultConfig.text
		};
	}

	/**
	 * Get content from meta tags
	 */
	getMetaContent(property) {
		const meta = document.querySelector(`meta[property="${property}"], meta[name="${property}"]`);
		return meta ? meta.getAttribute('content') : null;
	}

	/**
	 * Main share trigger function
	 */
	triggerShare() {
		const metadata = this.getShareMetadata();

		// Check if Web Share API is available (mobile devices)
		if (navigator.share) {
			navigator.share({
				title: metadata.title,
				text: metadata.text,
				url: metadata.url
			}).catch((error) => {
				console.log('Error sharing:', error);
				this.showCustomShareDialog(metadata.url, metadata.title, metadata.text);
			});
		} else {
			// Fallback to custom share dialog for desktop
			this.showCustomShareDialog(metadata.url, metadata.title, metadata.text);
		}
	}

	/**
	 * Show custom share dialog for desktop browsers
	 */
	// showCustomShareDialog(url, title, text) {
	//     // Remove existing share dialog if present
	//     const existingDialog = document.getElementById('custom-share-dialog');
	//     if (existingDialog) {
	//         existingDialog.remove();
	//     }

	//     // Create share dialog
	//     const dialog = document.createElement('div');
	//     dialog.id = 'custom-share-dialog';
	//     dialog.style.cssText = `
	//         position: fixed;
	//         top: 0;
	//         left: 0;
	//         width: 100%;
	//         height: 100%;
	//         background: rgba(0, 0, 0, 0.7);
	//         display: flex;
	//         justify-content: center;
	//         align-items: center;
	//         z-index: 10000;
	//         font-family: Arial, sans-serif;
	//     `;

	//     const dialogContent = document.createElement('div');
	//     dialogContent.style.cssText = `
	//         background: white;
	//         padding: 30px;
	//         border-radius: 15px;
	//         text-align: center;
	//         max-width: 400px;
	//         width: 90%;
	//         box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
	//     `;

	//     dialogContent.innerHTML = `
	//         <h3 style="margin: 0 0 20px 0; color: #333; font-size: 18px;">Share This Game</h3>
	//         <div style="margin-bottom: 20px;">
	//             <button onclick="window.shareUtils.shareToFacebook('${url}', '${title}')" style="
	//                 background: #1877f2;
	//                 color: white;
	//                 border: none;
	//                 padding: 12px 20px;
	//                 margin: 5px;
	//                 border-radius: 8px;
	//                 cursor: pointer;
	//                 font-size: 14px;
	//                 display: inline-block;
	//                 width: 120px;
	//             ">Facebook</button>
	//             <button onclick="window.shareUtils.shareToTwitter('${url}', '${title}')" style="
	//                 background: #1da1f2;
	//                 color: white;
	//                 border: none;
	//                 padding: 12px 20px;
	//                 margin: 5px;
	//                 border-radius: 8px;
	//                 cursor: pointer;
	//                 font-size: 14px;
	//                 display: inline-block;
	//                 width: 120px;
	//             ">Twitter</button>
	//             <button onclick="window.shareUtils.shareViaEmail('${url}', '${title}', '${text}')" style="
	//                 background: #ea4335;
	//                 color: white;
	//                 border: none;
	//                 padding: 12px 20px;
	//                 margin: 5px;
	//                 border-radius: 8px;
	//                 cursor: pointer;
	//                 font-size: 14px;
	//                 display: inline-block;
	//                 width: 120px;
	//             ">Email</button>
	//         </div>
	//         <div style="margin-bottom: 20px;">
	//             <button onclick="window.shareUtils.copyToClipboard('${url}')" style="
	//                 background: #6c757d;
	//                 color: white;
	//                 border: none;
	//                 padding: 12px 20px;
	//                 margin: 5px;
	//                 border-radius: 8px;
	//                 cursor: pointer;
	//                 font-size: 14px;
	//                 display: inline-block;
	//                 width: 120px;
	//             ">Copy Link</button>
	//         </div>
	//         <button onclick="window.shareUtils.closeShareDialog()" style="
	//             background: #dc3545;
	//             color: white;
	//             border: none;
	//             padding: 10px 20px;
	//             border-radius: 8px;
	//             cursor: pointer;
	//             font-size: 14px;
	//         ">Close</button>
	//     `;

	//     dialog.appendChild(dialogContent);
	//     document.body.appendChild(dialog);

	//     // Close dialog when clicking outside
	//     dialog.addEventListener('click', (e) => {
	//         if (e.target === dialog) {
	//             this.closeShareDialog();
	//         }
	//     });
	// }

	/**
	 * Share to Facebook
	 */
	shareToFacebook(url, title) {
		const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
		window.open(facebookUrl, '_blank', 'width=600,height=400');
	}

	/**
	 * Share to Twitter
	 */
	shareToTwitter(url, title) {
		const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
		window.open(twitterUrl, '_blank', 'width=600,height=400');
	}

	/**
	 * Share via Email
	 */
	shareViaEmail(url, title, text) {
		const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`;
		window.location.href = emailUrl;
	}

	/**
	 * Copy text to clipboard
	 */
	copyToClipboard(text) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text).then(() => {
				this.showCopySuccess();
			}).catch(err => {
				console.error('Failed to copy: ', err);
				this.fallbackCopyToClipboard(text);
			});
		} else {
			this.fallbackCopyToClipboard(text);
		}
	}

	/**
	 * Fallback copy method for older browsers
	 */
	fallbackCopyToClipboard(text) {
		const textArea = document.createElement('textarea');
		textArea.value = text;
		textArea.style.position = 'fixed';
		textArea.style.left = '-999999px';
		textArea.style.top = '-999999px';
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			document.execCommand('copy');
			this.showCopySuccess();
		} catch (err) {
			console.error('Fallback copy failed: ', err);
		}

		document.body.removeChild(textArea);
	}

	/**
	 * Show copy success notification
	 */
	showCopySuccess() {
		const existingToast = document.getElementById('copy-success-toast');
		if (existingToast) {
			existingToast.remove();
		}

		const toast = document.createElement('div');
		toast.id = 'copy-success-toast';
		toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        `;
		toast.textContent = 'Link copied to clipboard!';
		document.body.appendChild(toast);

		setTimeout(() => {
			if (toast.parentNode) {
				toast.parentNode.removeChild(toast);
			}
		}, 3000);
	}

	/**
	 * Close share dialog
	 */
	closeShareDialog() {
		const dialog = document.getElementById('custom-share-dialog');
		if (dialog) {
			dialog.remove();
		}
	}
}

// Create global instance for backward compatibility
window.shareUtils = new ShareUtils();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ShareUtils;
}

/*
 * Configuration Example:
 * 
 * To customize share content, you can set window.gameConfig:
 * 
 * window.gameConfig = {
 *     share: {
 *         url: 'https://your-custom-url.com',
 *         title: 'Your Custom Title',
 *         text: 'Your custom share text'
 *     }
 * };
 * 
 * Or the game will automatically use dynamic data from the game instance
 * if the getGameShareMetadata() method is available.
 */