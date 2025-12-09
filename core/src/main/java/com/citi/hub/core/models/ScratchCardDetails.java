package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ScratchCardDetails {
    
    @ValueMapValue
    private String prizeName;

    @ValueMapValue
    private String prizeCode;

    @ValueMapValue
    private String bgColor;

    @ValueMapValue
    private String iconPath;

    public String getPrizeName() {
        return prizeName != null ? prizeName : "Congratulations!";
    }

    // Normalized accessor for HTL/JSON compatibility
    public String getName() {
        return getPrizeName();
    }

    public String getPrizeCode() {
        return prizeCode != null ? prizeCode : "";
    }

    // Normalized accessor for HTL/JSON compatibility
    public String getCode() {
        return getPrizeCode();
    }

    public String getBgColor() {
        return bgColor != null ? bgColor : "#4CAF50";
    }

    public String getIconPath() {
        return iconPath != null ? iconPath : "";
    }
    
    // Legacy getters for backward compatibility
    public String getCardText() {
        return getPrizeName();
    }

    public String getCardValue() {
        return getPrizeCode();
    }

    public String getCardColor() {
        return getBgColor();
    }

    public String getIcon() {
        return getIconPath();
    }
    
    // Additional getters for better JSON compatibility
    public String getText() {
        return getPrizeName();
    }
    
    public String getValue() {
        return getPrizeCode();
    }
    
    public String getColor() {
        return getBgColor();
    }
}
