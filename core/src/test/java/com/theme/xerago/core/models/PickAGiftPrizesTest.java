package com.theme.xerago.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class PickAGiftPrizesTest {
	
	AemContext context = new AemContext();
	
	PickAGiftPrizes prize;
	
	Resource resource;

	@BeforeEach
	void setUp() throws Exception {
		context.addModelsForClasses(PickAGiftPrizes.class);
		context.load().json("/pickagift.json", "/component");
		resource = context.currentResource("/component/gift/prizes/item0");
		prize = resource.adaptTo(PickAGiftPrizes.class);
	}

	@Test
	void testGetText() {
		assertEquals("Prize 1", prize.getText());
	}

	@Test
	void testGetValue() {
		assertEquals("10% Discount", prize.getValue());
	}

	@Test
	void testGetIcon() {
		assertEquals("🎁", prize.getIcon());
	}

	@Test
	void testGetColor() {
		assertEquals("#3b82f6", prize.getColor());
	}

	@Test
	void testGetProbability() {
		assertEquals(20, prize.getProbability());
	}

	@Test
	void testGetRedeemCode() {
		assertEquals("PRIZE111", prize.getRedeemCode());
	}

}
