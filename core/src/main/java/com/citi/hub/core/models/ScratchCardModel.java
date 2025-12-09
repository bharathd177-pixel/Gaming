package com.citi.hub.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import java.util.List;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import javax.annotation.PostConstruct;

@Model(adaptables = Resource.class, 
       resourceType = "citi/components/floating-scratch-card",
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class ScratchCardModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String buttonText;

    @ValueMapValue
    private String modalTitle;

    @ValueMapValue
    private String modalSubtitle;

    @ValueMapValue
    private String emailPlaceholder;

    @ValueMapValue
    private String playButtonText;

    @ValueMapValue
    private String scratchText;

    @ChildResource
    private List<ScratchCardPrize> prizes;

    private String prizeJson;

    @PostConstruct
    protected void init() {
        // Debug logging for prize
        System.out.println("=== ScratchCardModel INIT ===");
        System.out.println("Prizes count: " + (prizes != null ? prizes.size() : 0));
        
        if (prizes != null && !prizes.isEmpty()) {
            System.out.println("Prizes details:");
            for (int i = 0; i < prizes.size(); i++) {
                ScratchCardPrize prize = prizes.get(i);
                System.out.println("  Prize " + i + ":");
                System.out.println("    Text: " + prize.getPrizeText());
                System.out.println("    Value: " + prize.getPrizeValue());
                System.out.println("    Icon: " + prize.getPrizeIcon());
                System.out.println("    Color: " + prize.getPrizeColor());
                System.out.println("    Probability: " + prize.getProbability());
                System.out.println("    Redeem Code: " + prize.getRedeemCode());
            }
        } else {
            System.out.println("No prizes found or prizes list is empty");
        }
        
        // Build prize JSON
        buildPrizeJson();
        
        System.out.println("Final prizeJson: " + prizeJson);
        System.out.println("=== END ScratchCardModel INIT ===");
    }

    private void buildPrizeJson() {
        try {
            Gson gson = new Gson();
            JsonArray prizesArray = new JsonArray();
            
            if (prizes != null && !prizes.isEmpty()) {
                // Manually build JSON to ensure all fields are included
                for (ScratchCardPrize prize : prizes) {
                    JsonObject prizeJson = new JsonObject();
                    prizeJson.addProperty("text", prize.getPrizeText() != null ? prize.getPrizeText() : "10% OFF");
                    prizeJson.addProperty("value", prize.getPrizeValue() != null ? prize.getPrizeValue() : "Save 10% on your next order");
                    prizeJson.addProperty("icon", prize.getPrizeIcon() != null ? prize.getPrizeIcon() : "🎯");
                    prizeJson.addProperty("color", prize.getPrizeColor() != null ? prize.getPrizeColor() : "#3b82f6");
                    prizeJson.addProperty("probability", prize.getProbability() != null ? prize.getProbability() : 25);
                    
                    // Handle redeem code - ensure it's not null in JSON
                    String redeemCode = prize.getRedeemCode();
                    if (redeemCode != null && !redeemCode.trim().isEmpty()) {
                        prizeJson.addProperty("redeemCode", redeemCode.trim());
                    } else {
                        // Generate a default redeem code based on the prize text
                        String prizeText = prize.getPrizeText() != null ? prize.getPrizeText() : "10% OFF";
                        String defaultRedeemCode = generateDefaultRedeemCode(prizeText);
                        prizeJson.addProperty("redeemCode", defaultRedeemCode);
                    }
                    
                    System.out.println("🎯 Scratch Card Prize - Text: " + prize.getPrizeText() + 
                                     ", Redeem Code: '" + (redeemCode != null ? redeemCode : "GENERATED") + "'");
                    prizesArray.add(prizeJson);
                }
                prizeJson = gson.toJson(prizesArray);
            } else {
                // Fallback to default prize array
                JsonObject defaultPrize = getDefaultPrize();
                prizesArray.add(defaultPrize);
                prizeJson = gson.toJson(prizesArray);
            }
        } catch (Exception e) {
            // Fallback to default prize
            Gson gson = new Gson();
            JsonArray prizesArray = new JsonArray();
            JsonObject defaultPrize = getDefaultPrize();
            prizesArray.add(defaultPrize);
            prizeJson = gson.toJson(prizesArray);
        }
    }

    private String generateDefaultRedeemCode(String prizeText) {
        // Generate a redeem code based on the prize text
        String baseCode = prizeText.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (baseCode.length() > 8) {
            baseCode = baseCode.substring(0, 8);
        }
        return "SCRATCH" + baseCode + "123";
    }

    private JsonObject getDefaultPrize() {
        JsonObject prize = new JsonObject();
        prize.addProperty("text", "10% OFF");
        prize.addProperty("value", "Save 10% on your next order");
        prize.addProperty("icon", "🎯");
        prize.addProperty("color", "#3b82f6");
        prize.addProperty("redeemCode", "SCRATCH123");
        return prize;
    }

    // Getters
    public String getTitle() {
        return title != null ? title : "Scratch & Win!";
    }

    public String getButtonText() {
        return buttonText != null ? buttonText : "🎫 SCRATCH CARD";
    }

    public String getModalTitle() {
        return modalTitle != null ? modalTitle : "Scratch & Win!";
    }

    public String getModalSubtitle() {
        return modalSubtitle != null ? modalSubtitle : "Enter your email and scratch the card to reveal your prize!";
    }

    public String getEmailPlaceholder() {
        return emailPlaceholder != null ? emailPlaceholder : "Enter your email to play";
    }

    public String getPlayButtonText() {
        return playButtonText != null ? playButtonText : "START SCRATCHING";
    }

    public String getScratchText() {
        return scratchText != null ? scratchText : "Scratch here to reveal your prize!";
    }

    public List<ScratchCardPrize> getPrizes() {
        return prizes;
    }

    public String getPrizeJson() {
        return prizeJson;
    }

    // Debug method to check prize loading
    public String getPrizeDebug() {
        return "Prizes count: " + (prizes != null ? prizes.size() : 0);
    }
}