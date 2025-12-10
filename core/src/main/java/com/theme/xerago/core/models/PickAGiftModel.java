package com.theme.xerago.core.models;

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
       resourceType = "citi/components/floating-pick-a-gift",
       defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)
public class PickAGiftModel {

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

    @Inject
    private List<PickAGiftPrizes> prizes;

    private String prizesJson;
    private int prizesCount;

    @PostConstruct
    protected void init() {
        // Debug logging for prizes
        System.out.println("=== PickAGiftModel INIT ===");
        System.out.println("Prizes list: " + (prizes == null ? "null" : "size=" + prizes.size()));
        if (prizes != null) {
            for (int i = 0; i < prizes.size(); i++) {
                PickAGiftPrizes prize = prizes.get(i);
                System.out.println("Prize " + i + ": text=" + prize.getText() + ", icon=" + prize.getIcon() + ", color=" + prize.getColor() + ", probability=" + prize.getProbability());
            }
        }
        
        // Build prizes JSON from multifield data
        buildPrizesJson();
        
        System.out.println("Final prizesJson: " + prizesJson);
        System.out.println("=== END PickAGiftModel INIT ===");
    }

    private void buildPrizesJson() {
        try {
            Gson gson = new Gson();
            JsonArray prizesArray = new JsonArray();

            // Check if we have custom prizes from multifield
            if (prizes != null && !prizes.isEmpty()) {
                // Process custom prizes from multifield
                for (PickAGiftPrizes prize : prizes) {
                    String text = prize.getText();
                    
                    // Only add if text is provided (required field)
                    if (text != null && !text.trim().isEmpty()) {
                        JsonObject prizeJson = new JsonObject();
                        prizeJson.addProperty("text", text.trim());
                        prizeJson.addProperty("value", prize.getValue() != null ? prize.getValue() : "");
                        prizeJson.addProperty("icon", prize.getIcon());
                        prizeJson.addProperty("color", prize.getColor());
                        prizeJson.addProperty("probability", prize.getProbability());
                        
                        // Handle redeem code - ensure it's not null in JSON
                        String redeemCode = prize.getRedeemCode();
                        if (redeemCode != null && !redeemCode.trim().isEmpty()) {
                            prizeJson.addProperty("redeemCode", redeemCode.trim());
                        } else {
                            // Generate a default redeem code based on the prize text
                            String defaultRedeemCode = generateDefaultRedeemCode(text.trim());
                            prizeJson.addProperty("redeemCode", defaultRedeemCode);
                        }
                        
                        System.out.println("🎁 Pick a Gift Prize - Text: " + prize.getText() + 
                                         ", Redeem Code: '" + (redeemCode != null ? redeemCode : "GENERATED") + "'");
                        prizesArray.add(prizeJson);
                    }
                }
            }

            // Use default prizes if no custom prizes configured
            if (prizesArray.size() == 0) {
                System.out.println("🎁 No custom prizes found, using default prizes with redeem codes");
                prizesArray = getDefaultPrizes();
            } else {
                System.out.println("🎁 Using " + prizesArray.size() + " custom prizes");
            }

            prizesCount = prizesArray.size();
            prizesJson = gson.toJson(prizesArray);
            System.out.println("🎁 Final prizes JSON: " + prizesJson);

        } catch (Exception e) {
            System.out.println("❌ Error building prizes JSON: " + e.getMessage());
            e.printStackTrace();
            // Fallback to default prizes
            Gson gson = new Gson();
            JsonArray defaultPrizes = getDefaultPrizes();
            prizesCount = defaultPrizes.size();
            prizesJson = gson.toJson(defaultPrizes);
        }
    }

    private String generateDefaultRedeemCode(String prizeText) {
        // Generate a redeem code based on the prize text
        String baseCode = prizeText.replaceAll("[^A-Za-z0-9]", "").toUpperCase();
        if (baseCode.length() > 8) {
            baseCode = baseCode.substring(0, 8);
        }
        return "PICK" + baseCode + "123";
    }

    private JsonArray getDefaultPrizes() {
        JsonArray prizes = new JsonArray();
        
        // Default prizes matching the UMD test file
        JsonObject prize1 = new JsonObject();
        prize1.addProperty("text", "10% Off");
        prize1.addProperty("value", "Save 10% on your next order");
        prize1.addProperty("icon", "🎯");
        prize1.addProperty("color", "#3b82f6");
        prize1.addProperty("probability", 30);
        prize1.addProperty("redeemCode", "PICK10OFF");
        prizes.add(prize1);
        
        JsonObject prize2 = new JsonObject();
        prize2.addProperty("text", "Free Shipping");
        prize2.addProperty("value", "Free shipping on orders over $50");
        prize2.addProperty("icon", "🚚");
        prize2.addProperty("color", "#10b981");
        prize2.addProperty("probability", 25);
        prize2.addProperty("redeemCode", "PICKFREESHIP");
        prizes.add(prize2);
        
        JsonObject prize3 = new JsonObject();
        prize3.addProperty("text", "15% Off");
        prize3.addProperty("value", "Save 15% on your next order");
        prize3.addProperty("icon", "💰");
        prize3.addProperty("color", "#f59e0b");
        prize3.addProperty("probability", 20);
        prize3.addProperty("redeemCode", "PICK15OFF");
        prizes.add(prize3);
        
        JsonObject prize4 = new JsonObject();
        prize4.addProperty("text", "Buy 1 Get 1");
        prize4.addProperty("value", "Buy one get one free on select items");
        prize4.addProperty("icon", "🎁");
        prize4.addProperty("color", "#8b5cf6");
        prize4.addProperty("probability", 15);
        prize4.addProperty("redeemCode", "PICKBOGO");
        prizes.add(prize4);
        
        JsonObject prize5 = new JsonObject();
        prize5.addProperty("text", "20% Off");
        prize5.addProperty("value", "Save 20% on your next order");
        prize5.addProperty("icon", "⭐");
        prize5.addProperty("color", "#ef4444");
        prize5.addProperty("probability", 8);
        prize5.addProperty("redeemCode", "PICK20OFF");
        prizes.add(prize5);
        
        JsonObject prize6 = new JsonObject();
        prize6.addProperty("text", "$25 Off");
        prize6.addProperty("value", "Get $25 off orders over $100");
        prize6.addProperty("icon", "💎");
        prize6.addProperty("color", "#06b6d4");
        prize6.addProperty("probability", 2);
        prize6.addProperty("redeemCode", "PICK25OFF");
        prizes.add(prize6);
        
        return prizes;
    }

    // Getters
    public String getTitle() {
        return title;
    }

    public String getButtonText() {
        return buttonText;
    }

    public String getModalTitle() {
        return modalTitle;
    }

    public String getModalSubtitle() {
        return modalSubtitle;
    }

    public String getEmailPlaceholder() {
        return emailPlaceholder;
    }

    public String getPlayButtonText() {
        return playButtonText;
    }

    public String getPrizesJson() {
        return prizesJson;
    }

    public int getPrizesCount() {
        return prizesCount;
    }

    public List<PickAGiftPrizes> getPrizes() {
        return prizes;
    }

    // Debug method to check prizes loading
    public String getPrizesDebug() {
        StringBuilder debug = new StringBuilder();
        debug.append("Prizes list: ");
        if (prizes == null) {
            debug.append("null");
        } else if (prizes.isEmpty()) {
            debug.append("empty (size: 0)");
        } else {
            debug.append("size: ").append(prizes.size());
            for (int i = 0; i < prizes.size(); i++) {
                PickAGiftPrizes prize = prizes.get(i);
                debug.append(", [").append(i).append("]: text='")
                     .append(prize.getText()).append("', icon='")
                     .append(prize.getIcon()).append("', color='")
                     .append(prize.getColor()).append("', probability=")
                     .append(prize.getProbability());
            }
        }
        return debug.toString();
    }
}