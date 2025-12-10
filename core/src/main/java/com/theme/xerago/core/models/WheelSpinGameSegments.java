package com.theme.xerago.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class WheelSpinGameSegments {

    @ValueMapValue
    private String text;

    @ValueMapValue
    private String color;

    @ValueMapValue
    private String value;

    @ValueMapValue
    private String bgColor;

    @ValueMapValue
    private String icon;

    @ValueMapValue
    private Double probability;

    @ValueMapValue
    private String redeemCode;

    public String getText() {
        return text;
    }

    public String getColor() {
        return color;
    }

    public String getValue() {
        return value;
    }

    public String getBgColor() {
        return bgColor;
    }

    public String getIcon() {
        return icon;
    }

    public Double getProbability() {
        return probability != null ? probability : 0.125; // Default equal probability for 8 segments
    }

    public String getRedeemCode() {
        return redeemCode;
    }
}
