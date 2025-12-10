package com.theme.xerago.core.models;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.google.gson.JsonArray;
import com.google.gson.JsonParser;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class PickAGiftModelTest {
	
	AemContext context = new AemContext();
	
	PickAGiftModel model;
	
	Resource resource;

	@BeforeEach
	void setUp() throws Exception {
		context.addModelsForClasses(PickAGiftModel.class);
		context.load().json("/pickagift.json", "/component");
		resource = context.currentResource("/component/gift");
		model = resource.adaptTo(PickAGiftModel.class);
	}

	@Test
	void testGetTitle() {
		assertEquals("Pick Your Prize!", model.getTitle());
	}

	@Test
	void testGetButtonText() {
		assertEquals("🎁 PICK A GIFT", model.getButtonText());
	}

	@Test
	void testGetModalTitle() {
		assertEquals("Pick Your Prize!", model.getModalTitle());
	}

	@Test
	void testGetModalSubtitle() {
		assertEquals("Choose one of the gift boxes below to reveal your prize!", model.getModalSubtitle());
	}

	@Test
	void testGetEmailPlaceholder() {
		assertEquals("Enter your email to play", model.getEmailPlaceholder());
	}

	@Test
	void testGetPlayButtonText() {
		assertEquals("PLAY NOW", model.getPlayButtonText());
	}

	@Test
	void testGetPrizesJson() {
		String json = model.getPrizesJson();
		assertNotNull(json);
	}

	@Test
	void testGetPrizesCount() {
		assertEquals(3, model.getPrizesCount());
	}

	@Test
	void testGetPrizes() {
		assertNotNull(model.getPrizes());
	}

	@Test
	void testGetPrizesDebug() {
		String debug = model.getPrizesDebug();
		assertTrue(debug.contains("size:"));
	}
	
	@Test
	void testCustomPrizesWithoutRedeemCodeGenerateDefault() {
		PickAGiftPrizes prize = mock(PickAGiftPrizes.class);
		when(prize.getText()).thenReturn("Special Prize");
	    when(prize.getValue()).thenReturn("Exclusive offer");
	    when(prize.getIcon()).thenReturn("⭐");
	    when(prize.getColor()).thenReturn("#ff0000");
	    when(prize.getProbability()).thenReturn(40);
	    when(prize.getRedeemCode()).thenReturn(null);
	    
	    model.getPrizes().clear();
	    model.getPrizes().add(prize);
	    model.init();
	    
	    JsonArray arr = JsonParser.parseString(model.getPrizesJson()).getAsJsonArray();
	    String redeemCode = arr.get(0).getAsJsonObject().get("redeemCode").getAsString();
	    assertTrue(redeemCode.startsWith("PICK"));
	}

	@Test
	void testDefaultPrizes() {
		model.getPrizes().clear();
		model.init();
		assertEquals(6, model.getPrizesCount());
	}
}
