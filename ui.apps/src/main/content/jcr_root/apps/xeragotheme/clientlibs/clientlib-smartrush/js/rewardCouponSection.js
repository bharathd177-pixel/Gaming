function copyRewardCouponSection() {
	const code = document.getElementById("rewardCouponSection").innerText;

	const pr_merchant_type = document.getElementById('pr_merchant_type').value;
	const pr_reward_title = document.getElementById('pr_reward_title').value;
	const pr_category_tag = document.getElementById('pr_category').value;

	//console.log(pr_merchant_type + "Test");
	navigator.clipboard.writeText(code).then(() => {
		alert("Coupon code copied!");
		//console.log(pr_category_tag + " - " + pr_merchant_type + " - " + pr_reward_title + " - copy");
		/*  const copyVal = (pr_category_tag && pr_merchant_type && pr_reward_title) 
					 ? `${pr_category_tag} - ${pr_merchant_type} - ${pr_reward_title} - copy`
					 : 'Groceries - Quan Shui wet market - S$5 off Fresh Groceries Delivery with min. S$60 spend - copy'; */

		var adobeEvent = new CustomEvent('adobeEvent', {
			detail: {
				pageName: "sg:public:icms:smrt card:gamification:completed",
				language: "en",
				pageCategory: "pre-login campaign page",
				eventCategory: "interaction",
				eventAction: "click",
				eventLabel: `${pr_category_tag} - ${pr_merchant_type} - ${pr_reward_title} - copy`

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
				eventLabel: `${pr_category_tag} - ${pr_merchant_type} - ${pr_reward_title} - copy`
			}

		};
		document.querySelector('body').dispatchEvent(adobeEvent);

	});
}
