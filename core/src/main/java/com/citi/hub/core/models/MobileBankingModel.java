package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class MobileBankingModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @ValueMapValue
    private String imageReference;

    @ValueMapValue
    private String buttonName;

    @ValueMapValue
    private String buttonLink;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getImageReference() {
        return imageReference;
    }

    public String getButtonName() {
        return buttonName;
    }

    public String getButtonLink() {
        return buttonLink;
    }

}
