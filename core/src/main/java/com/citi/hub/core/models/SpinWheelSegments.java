package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;


@Model(adaptables = Resource.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class SpinWheelSegments {

    @ValueMapValue
    private String segmentText;

    @ValueMapValue
    private String segmentValue;

    @ValueMapValue
    private String segmentColor;

    public String getSegmentText() {
        return segmentText;
    }

    public String getSegmentValue() {
        return segmentValue;
    }

    public String getSegmentColor() {
        return segmentColor;
    }

}
