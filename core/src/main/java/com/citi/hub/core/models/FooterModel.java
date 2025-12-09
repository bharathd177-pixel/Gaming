package com.citi.hub.core.models;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FooterModel {

    @Inject
    private List<FooterMenu> footerMenu;

    @ValueMapValue
    private String appTitle;

    @ValueMapValue
    private String googlePlayImageReference;

    @ValueMapValue
    private String googlePlayLink;

    @ValueMapValue
    private String appleStoreImageReference;

    @ValueMapValue
    private String appleStoreLink;

    @ValueMapValue
    private String sdicLogoReference;

    public String getSdicLogoReference() {
        return sdicLogoReference;
    }

    @ValueMapValue
    private String copyright;

    public List<FooterMenu> getFooterMenu() {
        return footerMenu;
    }

    public String getAppTitle() {
        return appTitle;
    }

    public String getGooglePlayImageReference() {
        return googlePlayImageReference;
    }

    public String getGooglePlayLink() {
        return googlePlayLink;
    }

    public String getAppleStoreImageReference() {
        return appleStoreImageReference;
    }

    public String getAppleStoreLink() {
        return appleStoreLink;
    }

    public String getCopyright() {
        return copyright;
    }
}
