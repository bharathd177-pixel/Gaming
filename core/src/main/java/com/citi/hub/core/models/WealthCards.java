package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class WealthCards {

    @ValueMapValue
    private String cardTitle;

    @ValueMapValue
    private String cardDescription;

    @ValueMapValue
    private String cardImageReference;

    public String getCardTitle() {
        return cardTitle;
    }

    public String getCardDescription() {
        return cardDescription;
    }

    public String getCardImageReference() {
        return cardImageReference;
    }

}
