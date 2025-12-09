package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FooterSubMenu {

    @ValueMapValue
    private String subMenuTitle;

    @ValueMapValue
    private String subMenuUrl;

    public String getSubMenuTitle() {
        return subMenuTitle;
    }

    public String getSubMenuUrl() {
        return subMenuUrl;
    }
}
