package com.theme.xerago.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class WheelSpinGameSegmentsTest {
	
	AemContext aemContext = new AemContext();
	Resource resource;
	Resource resourceTwo;
	WheelSpinGameSegments wheelSpinSegments;
	WheelSpinGameSegments wheelSpinSegmentsTwo;

	@BeforeEach
	void setUp() throws Exception {
		aemContext.addModelsForClasses(WheelSpinGameSegments.class);
		aemContext.load().json("/wheelspin.json", "/component");
		resource = aemContext.currentResource("/component/wheel_spin_game/segments/item0");
		wheelSpinSegments = resource.adaptTo(WheelSpinGameSegments.class);
	}

	@Test
	void testGetText() {
		assertEquals("Gift Cards", wheelSpinSegments.getText());
	}

	@Test
	void testGetColor() {
		assertEquals("#0074D9", wheelSpinSegments.getColor());
	}

	@Test
	void testGetValue() {
		assertEquals("1", wheelSpinSegments.getValue());
	}

	@Test
	void testGetBgColor() {
		assertEquals("blue", wheelSpinSegments.getBgColor());
	}

	@Test
	void testGetIcon() {
		assertEquals("test", wheelSpinSegments.getIcon());
	}

	@Test
	void testGetProbability() {
		assertEquals(0.125, wheelSpinSegments.getProbability());
		resourceTwo = aemContext.currentResource("/component/wheel_spin_game/segments/item1");
		wheelSpinSegmentsTwo = resourceTwo.adaptTo(WheelSpinGameSegments.class);
		assertEquals(0.125, wheelSpinSegmentsTwo.getProbability());
	}

	@Test
	void testGetRedeemCode() {
		assertEquals("GIFTCARD", wheelSpinSegments.getRedeemCode());
	}

}
