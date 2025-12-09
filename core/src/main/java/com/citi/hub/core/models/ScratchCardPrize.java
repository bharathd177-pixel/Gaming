package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ScratchCardPrize {
    
    @ValueMapValue
    private String prizeText;
    
    @ValueMapValue
    private String prizeValue;
    
    @ValueMapValue
    private String prizeIcon;
    
    @ValueMapValue
    private String prizeColor;
    
    @ValueMapValue
    private Integer probability;
    
    @ValueMapValue
    private String redeemCode;
    
    // Original getters for dialog properties
    public String getPrizeText() {
        return prizeText;
    }
    
    public String getPrizeValue() {
        return prizeValue;
    }
    
    public String getPrizeIcon() {
        return prizeIcon;
    }
    
    public String getPrizeColor() {
        return prizeColor;
    }
    
    public Integer getProbability() {
        return probability != null ? probability : 25;
    }
    
    // Mapped getters for JavaScript compatibility
    public String getText() {
        return prizeText;
    }
    
    public String getValue() {
        return prizeValue;
    }
    
    public String getIcon() {
        return prizeIcon;
    }
    
    public String getColor() {
        return prizeColor;
    }
    
    public String getRedeemCode() {
        return redeemCode;
    }
}
