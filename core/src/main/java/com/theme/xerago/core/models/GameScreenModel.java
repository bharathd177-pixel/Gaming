package com.theme.xerago.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class GameScreenModel {

	@ValueMapValue
	private String title;
	
	@ValueMapValue
	private String description;
	
	@ValueMapValue
	private String logoReference;
	
	@ValueMapValue
	private String refreshLogoReference;
	
	@ValueMapValue
	private String statTitle;
	
	@ValueMapValue
	private String timerImgReference;

	public String getTitle() {
		return title;
	}

	public String getDescription() {
		return description;
	}

	public String getLogoReference() {
		return logoReference;
	}

	public String getRefreshLogoReference() {
		return refreshLogoReference;
	}

	public String getStatTitle() {
		return statTitle;
	}

	public String getTimerImgReference() {
		return timerImgReference;
	}
	
}
