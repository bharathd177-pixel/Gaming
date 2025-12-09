package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CitiWealthManagement {

    @ValueMapValue
    private String sectionTitle;

    @ValueMapValue
    private String sectionDescription;

    private List<WealthCard> wealthCards;

    @PostConstruct
    protected void init() {
        // Initialize default wealth cards
        wealthCards = new ArrayList<>();
        wealthCards.add(new WealthCard(
            "Investment Planning",
            "Get expert guidance on building a diversified investment portfolio tailored to your financial goals.",
            "/content/dam/citi/images/icons/investment-planning.png",
            "Investment Planning Icon"
        ));
        wealthCards.add(new WealthCard(
            "Wealth Protection",
            "Secure your financial future with comprehensive insurance and protection strategies.",
            "/content/dam/citi/images/icons/wealth-protection.png",
            "Wealth Protection Icon"
        ));
        wealthCards.add(new WealthCard(
            "Retirement Planning",
            "Plan for a comfortable retirement with our specialized retirement planning services.",
            "/content/dam/citi/images/icons/retirement-planning.png",
            "Retirement Planning Icon"
        ));
        wealthCards.add(new WealthCard(
            "Estate Planning",
            "Ensure your legacy with professional estate planning and wealth transfer solutions.",
            "/content/dam/citi/images/icons/estate-planning.png",
            "Estate Planning Icon"
        ));
    }

    // Getters
    public String getSectionTitle() { return sectionTitle; }
    public String getSectionDescription() { return sectionDescription; }
    public List<WealthCard> getWealthCards() { return wealthCards; }

    // Inner class
    public static class WealthCard {
        private String title;
        private String description;
        private String iconImage;
        private String iconAlt;

        public WealthCard(String title, String description, String iconImage, String iconAlt) {
            this.title = title;
            this.description = description;
            this.iconImage = iconImage;
            this.iconAlt = iconAlt;
        }

        public String getTitle() { return title; }
        public String getDescription() { return description; }
        public String getIconImage() { return iconImage; }
        public String getIconAlt() { return iconAlt; }
        public String getLink() { return "#"; } // Default link
    }
}
