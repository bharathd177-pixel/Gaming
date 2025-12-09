package com.citi.hub.core.models;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class FooterMenu {

    @ValueMapValue
    private String menuTitle;

    @Inject
    private List<FooterSubMenu> menuItems;

    public String getMenuTitle() {
        return menuTitle;
    }

    public List<FooterSubMenu> getMenuItems() {
        return menuItems;
    }
}
