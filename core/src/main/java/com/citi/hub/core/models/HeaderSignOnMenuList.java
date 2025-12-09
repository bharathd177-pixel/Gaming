package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class HeaderSignOnMenuList {

    @ValueMapValue
    private String signOnMenuName;

    @ValueMapValue
    private String signOnMenuUrl;

    public String getSignOnMenuName() {
        return signOnMenuName;
    }

    public String getSignOnMenuUrl() {
        return signOnMenuUrl;
    }
}
