package com.theme.xerago.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ScratchCardDetails {
    
    @ValueMapValue
    private String cardText;

    @ValueMapValue
    private String cardValue;

    @ValueMapValue
    private String cardColor;

    @ValueMapValue
    private String iconReference;

    public String getCardText() {
        return cardText;
    }

    public String getCardValue() {
        return cardValue;
    }

    public String getCardColor() {
        return cardColor;
    }

    public String getIconReference() {
        return iconReference;
    }
}
