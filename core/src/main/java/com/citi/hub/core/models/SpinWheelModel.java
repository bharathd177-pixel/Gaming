package com.citi.hub.core.models;

import java.util.List;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import com.google.gson.Gson;


@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SpinWheelModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String buttonText;

    @ValueMapValue
    private String spinningText;

    @Inject
    private List<SpinWheelSegments> segments;

    public String getTitle() {
        return title;
    }

    public String getButtonText() {
        return buttonText;
    }

    public String getSpinningText() {
        return spinningText;
    }

    public List<SpinWheelSegments> getSegments() {
        return segments;
    }
    public String getSegmentsJson() {
        return new Gson().toJson(segments);
    }

}
