package com.theme.xerago.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PickAGiftPrizes {

    @ValueMapValue
    private String text;

    @ValueMapValue
    private String value;

    @ValueMapValue
    private String icon;

    @ValueMapValue
    private String color;

    @ValueMapValue
    private Integer probability;

    @ValueMapValue
    private String redeemCode;

    public String getText() {
        return text;
    }

    public String getValue() {
        return value;
    }

    public String getIcon() {
        return icon != null ? icon : "🎁";
    }

    public String getColor() {
        return color;
    }

    public Integer getProbability() {
        return probability;
    }

    public String getRedeemCode() {
        return redeemCode;
    }
}
