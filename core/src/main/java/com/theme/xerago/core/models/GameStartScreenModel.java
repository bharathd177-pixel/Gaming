package com.theme.xerago.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class GameStartScreenModel {

	@ValueMapValue
	private String logoReference;
	
	@ValueMapValue
	private String gameTitle;
	
	@ValueMapValue
	private String gameSubTitle;
	
	@ValueMapValue
	private String startButtonText;
	
	@ValueMapValue
	private String tncButtonText;
	
	@ValueMapValue
	private String tncButtonUrl;
	
	@ValueMapValue
	private String howToPlayButtonText;
	
	@ValueMapValue
	private String howToPlayButtonUrl;

	public String getLogoReference() {
		return logoReference;
	}
	
	public String getGameTitle() {
		return gameTitle;
	}

	public String getGameSubTitle() {
		return gameSubTitle;
	}

	public String getStartButtonText() {
		return startButtonText;
	}

	public String getTncButtonText() {
		return tncButtonText;
	}

	public String getTncButtonUrl() {
		return tncButtonUrl;
	}

	public String getHowToPlayButtonText() {
		return howToPlayButtonText;
	}

	public String getHowToPlayButtonUrl() {
		return howToPlayButtonUrl;
	}
	
}
