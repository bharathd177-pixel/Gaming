package com.citi.hub.core.models;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeaderModel {

    @ValueMapValue
    private String logoReference;

    @ValueMapValue
    private String language;

    @ValueMapValue
    private String signText;

    @Inject
    private List<HeaderSignOnMenuList> signOnMenu;

    @ValueMapValue
    private String applyButtonText;

    @ValueMapValue
    private String applyButtonUrl; 
    
    @Inject
    private List<HeaderMegaMenu> megaMenu;

    public String getLogoReference() {
        return logoReference;
    }

    public String getLanguage() {
        return language;
    }

    public String getSignText() {
        return signText;
    }

    public String getApplyButtonText() {
        return applyButtonText;
    }

    public String getApplyButtonUrl() {
        return applyButtonUrl;
    }

    public List<HeaderMegaMenu> getMegaMenu() {
        return megaMenu;
    }
    
    public List<HeaderSignOnMenuList> getSignOnMenu() {
        return signOnMenu;
    }

}
