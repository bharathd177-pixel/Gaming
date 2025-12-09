package com.citi.hub.core.models;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class WealthModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String description;

    @Inject
    private List<WealthCards> wealthCards;

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public List<WealthCards> getWealthCards() {
        return wealthCards;
    }

}
