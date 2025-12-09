package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class CitiFooter {

    @ValueMapValue
    private String appsTitle;

    @ValueMapValue
    private String googlePlayLink;

    @ValueMapValue
    private String googlePlayImage;

    @ValueMapValue
    private String appStoreLink;

    @ValueMapValue
    private String appStoreImage;

    @ValueMapValue
    private String instagramLink;

    @ValueMapValue
    private String youtubeLink;

    @ValueMapValue
    private String facebookLink;

    @ValueMapValue
    private String sdicLogo;

    @ValueMapValue
    private String copyrightText1;

    @ValueMapValue
    private String copyrightText2;

    private List<FooterColumn> footerColumns;

    @PostConstruct
    protected void init() {
        // Initialize default footer columns
        footerColumns = new ArrayList<>();
        
        // Personal Banking Column
        List<FooterLink> personalBankingLinks = new ArrayList<>();
        personalBankingLinks.add(new FooterLink("Savings Account", "#"));
        personalBankingLinks.add(new FooterLink("Current Account", "#"));
        personalBankingLinks.add(new FooterLink("Fixed Deposits", "#"));
        personalBankingLinks.add(new FooterLink("Ready Credit", "#"));
        footerColumns.add(new FooterColumn("Personal Banking", personalBankingLinks));

        // Credit Cards Column
        List<FooterLink> creditCardLinks = new ArrayList<>();
        creditCardLinks.add(new FooterLink("Credit Cards", "#"));
        creditCardLinks.add(new FooterLink("Rewards Program", "#"));
        creditCardLinks.add(new FooterLink("Card Benefits", "#"));
        creditCardLinks.add(new FooterLink("Apply Now", "#"));
        footerColumns.add(new FooterColumn("Credit Cards", creditCardLinks));

        // Wealth Management Column
        List<FooterLink> wealthManagementLinks = new ArrayList<>();
        wealthManagementLinks.add(new FooterLink("Investment Planning", "#"));
        wealthManagementLinks.add(new FooterLink("Insurance", "#"));
        wealthManagementLinks.add(new FooterLink("Retirement Planning", "#"));
        wealthManagementLinks.add(new FooterLink("Estate Planning", "#"));
        footerColumns.add(new FooterColumn("Wealth Management", wealthManagementLinks));

        // Support Column
        List<FooterLink> supportLinks = new ArrayList<>();
        supportLinks.add(new FooterLink("Contact Us", "#"));
        supportLinks.add(new FooterLink("Branch Locator", "#"));
        supportLinks.add(new FooterLink("FAQs", "#"));
        supportLinks.add(new FooterLink("Security", "#"));
        footerColumns.add(new FooterColumn("Support", supportLinks));
    }

    // Getters
    public String getAppsTitle() { return appsTitle; }
    public String getGooglePlayLink() { return googlePlayLink; }
    public String getGooglePlayImage() { return googlePlayImage; }
    public String getAppStoreLink() { return appStoreLink; }
    public String getAppStoreImage() { return appStoreImage; }
    public String getInstagramLink() { return instagramLink; }
    public String getYoutubeLink() { return youtubeLink; }
    public String getFacebookLink() { return facebookLink; }
    public String getSdicLogo() { return sdicLogo; }
    public String getCopyrightText1() { return copyrightText1; }
    public String getCopyrightText2() { return copyrightText2; }
    public List<FooterColumn> getFooterColumns() { return footerColumns; }

    // Inner classes
    public static class FooterColumn {
        private String title;
        private List<FooterLink> links;

        public FooterColumn(String title, List<FooterLink> links) {
            this.title = title;
            this.links = links;
        }

        public String getTitle() { return title; }
        public List<FooterLink> getLinks() { return links; }
    }

    public static class FooterLink {
        private String text;
        private String url;

        public FooterLink(String text, String url) {
            this.text = text;
            this.url = url;
        }

        public String getText() { return text; }
        public String getUrl() { return url; }
    }
}
