package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CitiHeader {

    @ValueMapValue
    private String logoLink;

    @ValueMapValue
    private String logoImage;

    @ValueMapValue
    private String logoAlt;

    @ValueMapValue
    private String languageCode;

    @ValueMapValue
    private String searchLabel;

    @ValueMapValue
    private String signOnText;

    @ValueMapValue
    private String mobileMenuLabel;

    private List<NavigationItem> navigationItems;
    private List<SignOnLink> signOnLinks;

    @PostConstruct
    protected void init() {
        // Initialize default navigation items
        navigationItems = new ArrayList<>();
        navigationItems.add(new NavigationItem("Wealth Management", "#", false));
        navigationItems.add(new NavigationItem("Personal Banking", "#", false));
        navigationItems.add(new NavigationItem("Credit Cards", "#", false));
        navigationItems.add(new NavigationItem("Ready Credit", "#", false));
        navigationItems.add(new NavigationItem("Home Loans", "#", false));
        navigationItems.add(new NavigationItem("Deposits", "#", false));
        navigationItems.add(new NavigationItem("Investments", "#", false));
        navigationItems.add(new NavigationItem("Insurance", "#", false));
        navigationItems.add(new NavigationItem("More", "#", false));
        navigationItems.add(new NavigationItem("Apply Now", "#", true));

        // Initialize default sign-on links
        signOnLinks = new ArrayList<>();
        signOnLinks.add(new SignOnLink("Citibank Online", "#", "_blank"));
        signOnLinks.add(new SignOnLink("IPB Singapore Online", "#", "_blank"));
    }

    // Getters
    public String getLogoLink() { return logoLink; }
    public String getLogoImage() { return logoImage; }
    public String getLogoAlt() { return logoAlt; }
    public String getLanguageCode() { return languageCode; }
    public String getSearchLabel() { return searchLabel; }
    public String getSignOnText() { return signOnText; }
    public String getMobileMenuLabel() { return mobileMenuLabel; }
    public List<NavigationItem> getNavigationItems() { return navigationItems; }
    public List<SignOnLink> getSignOnLinks() { return signOnLinks; }

    // Inner classes
    public static class NavigationItem {
        private String text;
        private String link;
        private boolean isCTA;

        public NavigationItem(String text, String link, boolean isCTA) {
            this.text = text;
            this.link = link;
            this.isCTA = isCTA;
        }

        public String getText() { return text; }
        public String getLink() { return link; }
        public boolean getIsCTA() { return isCTA; }
    }

    public static class SignOnLink {
        private String text;
        private String link;
        private String target;

        public SignOnLink(String text, String link, String target) {
            this.text = text;
            this.link = link;
            this.target = target;
        }

        public String getText() { return text; }
        public String getLink() { return link; }
        public String getTarget() { return target; }
    }
}
