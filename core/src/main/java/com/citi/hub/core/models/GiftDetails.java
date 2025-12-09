package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class GiftDetails {
    
    @ValueMapValue
    private String text;

    @ValueMapValue
    private String value;

    @ValueMapValue
    private String color;

    @ValueMapValue
    private String icon;

    public String getText() {
        return text;
    }

    public String getValue() {
        return value;
    }

    public String getGiftColor() {
        return color;
    }

    public String getIcon() {
        return icon;
    }    
}
