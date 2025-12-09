package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

@Model(adaptables = Resource.class, 
       resourceType = "citi/components/wheel-spin-game",
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class WheelSpinGameModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String buttonText;

    @ValueMapValue
    private String spinningText;

    @ValueMapValue
    private Integer wheelSize;

    @ValueMapValue
    private Integer animationDuration;

    @ValueMapValue
    private Integer minRevolutions;

    @ValueMapValue
    private Integer maxRevolutions;

    @Inject
    private List<WheelSpinGameSegments> segments;

    private String segmentsJson;
    private int segmentsCount;

    @PostConstruct
    protected void init() {
        // Debug logging for segments
        System.out.println("=== WheelSpinGameModel INIT ===");
        System.out.println("Segments list: " + (segments == null ? "null" : "size=" + segments.size()));
        if (segments != null) {
            for (int i = 0; i < segments.size(); i++) {
                WheelSpinGameSegments segment = segments.get(i);
                System.out.println("Segment " + i + ": text=" + segment.getText() + ", color=" + segment.getColor() + ", value=" + segment.getValue());
            }
        }
        
        // Build segments JSON from multifield data
        buildSegmentsJson();
        
        System.out.println("Final segmentsJson: " + segmentsJson);
        System.out.println("=== END WheelSpinGameModel INIT ===");
    }

    private void buildSegmentsJson() {
        try {
            Gson gson = new Gson();
            JsonArray segmentsArray = new JsonArray();

            // Check if we have custom segments from multifield
            if (segments != null && !segments.isEmpty()) {
                // Process custom segments from multifield
                for (WheelSpinGameSegments segment : segments) {
                    String text = segment.getText();
                    
                    // Only add if text is provided (required field)
                    if (text != null && !text.trim().isEmpty()) {
                        JsonObject segmentJson = new JsonObject();
                        segmentJson.addProperty("text", text.trim());
                        segmentJson.addProperty("color", segment.getColor() != null ? segment.getColor() : "#FF6B6B");
                        segmentJson.addProperty("value", segment.getValue() != null ? segment.getValue() : "");
                        segmentJson.addProperty("bgColor", segment.getBgColor() != null ? segment.getBgColor() : "");
                        segmentJson.addProperty("icon", segment.getIcon() != null ? segment.getIcon() : "");
                        segmentJson.addProperty("probability", segment.getProbability());
                        
                        // Handle redeem code - ensure it's not null in JSON
                        String redeemCode = segment.getRedeemCode();
                        if (redeemCode != null && !redeemCode.trim().isEmpty()) {
                            segmentJson.addProperty("redeemCode", redeemCode.trim());
                        } else {
                            // Generate a default redeem code based on the segment text
                            String defaultRedeemCode = generateDefaultRedeemCode(text.trim());
                            segmentJson.addProperty("redeemCode", defaultRedeemCode);
                        }
                        
                        System.out.println("🎯 Wheel Spin Segment - Text: " + segment.getText() + 
                                         ", Redeem Code: '" + (redeemCode != null ? redeemCode : "GENERATED") + "'");
                        segmentsArray.add(segmentJson);
                    }
                }
            }

            // Use default segments if no custom segments configured
            if (segmentsArray.size() == 0) {
                segmentsArray = getDefaultSegments();
            }

            segmentsCount = segmentsArray.size();
            segmentsJson = gson.toJson(segmentsArray);

        } catch (Exception e) {
            // Fallback to default segments
            Gson gson = new Gson();
            JsonArray defaultSegments = getDefaultSegments();
            segmentsCount = defaultSegments.size();
            segmentsJson = gson.toJson(defaultSegments);
        }
    }

    private JsonArray getDefaultSegments() {
        JsonArray segments = new JsonArray();
        
        // Default segments matching the test file
        String[][] defaultData = {
            {"🎁 Free Gift", "#FF6B6B", "Claim your free gift now!", "WHEELGIFT"},
            {"💰 $10 Cash", "#4ECDC4", "Cash prize added to your account", "WHEELCASH"},
            {"🎯 50% Off", "#45B7D1", "Use code: SPIN50", "WHEEL50OFF"},
            {"🎪 Try Again", "#96CEB4", "Better luck next time!", ""},
            {"🏆 Grand Prize", "#FFEAA7", "You won the grand prize!", "WHEELGRAND"},
            {"🎨 Mystery Box", "#DDA0DD", "Open to reveal your surprise", "WHEELMYSTERY"}
        };

        for (String[] data : defaultData) {
            JsonObject segment = new JsonObject();
            segment.addProperty("text", data[0]);
            segment.addProperty("color", data[1]);
            segment.addProperty("value", data[2]);
            segment.addProperty("redeemCode", data[3]);
            segments.add(segment);
        }

        return segments;
    }

    private String generateDefaultRedeemCode(String segmentText) {
        // Generate a redeem code based on the segment text
        String baseCode = segmentText.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (baseCode.length() > 8) {
            baseCode = baseCode.substring(0, 8);
        }
        return "WHEEL" + baseCode + "123";
    }

    // Getters
    public String getTitle() {
        return title != null ? title : "Spin to Win!";
    }

    public String getButtonText() {
        return buttonText != null ? buttonText : "SPIN";
    }

    public String getSpinningText() {
        return spinningText != null ? spinningText : "Spinning...";
    }

    public Integer getWheelSize() {
        return wheelSize != null ? wheelSize : 400;
    }

    public Integer getAnimationDuration() {
        return animationDuration != null ? animationDuration : 3000;
    }

    public Integer getMinRevolutions() {
        return minRevolutions != null ? minRevolutions : 3;
    }

    public Integer getMaxRevolutions() {
        return maxRevolutions != null ? maxRevolutions : 5;
    }

    public String getSegmentsJson() {
        return segmentsJson;
    }

    public int getSegmentsCount() {
        return segmentsCount;
    }

    public List<WheelSpinGameSegments> getSegments() {
        return segments;
    }

    // Debug method to check segments loading
    public String getSegmentsDebug() {
        StringBuilder debug = new StringBuilder();
        debug.append("Segments list: ");
        if (segments == null) {
            debug.append("null");
        } else if (segments.isEmpty()) {
            debug.append("empty (size: 0)");
        } else {
            debug.append("size: ").append(segments.size());
            for (int i = 0; i < segments.size(); i++) {
                WheelSpinGameSegments segment = segments.get(i);
                debug.append(", [").append(i).append("]: text='")
                     .append(segment.getText()).append("', color='")
                     .append(segment.getColor()).append("', value='")
                     .append(segment.getValue()).append("'");
            }
        }
        return debug.toString();
    }
}
