package com.theme.xerago.core.models;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import com.google.gson.Gson;

@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ScratchCardModel {

    @ValueMapValue
    private String title;

     @Inject
    private List<ScratchCardDetails> cardDetails;

     public String getTitle() {
         return title;
     }

     public String getCardDetails() {
         return new Gson().toJson(cardDetails);
     }
}
