package com.theme.xerago.core.models;

import static org.junit.jupiter.api.Assertions.*;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith({AemContextExtension.class, MockitoExtension.class})
class WheelSpinGameModelTest {
	
	AemContext aemContext = new  AemContext();
	
	
	WheelSpinGameModel wheelspin;
	
	Resource resource;

	@BeforeEach
	void setUp() throws Exception{
		aemContext.addModelsForClasses(WheelSpinGameModel.class, WheelSpinGameSegments.class);
		aemContext.load().json("/wheelspin.json", "/component");
		resource = aemContext.currentResource("/component/wheel_spin_game");
		wheelspin = resource.adaptTo(WheelSpinGameModel.class);
	}

	@Test
	void getTitle() {
		final String expected = "aa";
		wheelspin = resource.adaptTo(WheelSpinGameModel.class);
		String actual = wheelspin.getTitle();
		assertEquals(expected, actual);
	}

	@Test
	void testGetButtonText() {
		assertEquals("SPIN", wheelspin.getButtonText());
	}

	@Test
	void testGetSpinningText() {
		assertEquals("Spinning...", wheelspin.getSpinningText());
	}

	@Test
	void testGetWheelSize() {
		assertEquals(400, wheelspin.getWheelSize());
	}

	@Test
	void testGetAnimationDuration() {
		assertEquals(3000, wheelspin.getAnimationDuration());
	}

	@Test
	void testGetMinRevolutions() {
		assertEquals(3, wheelspin.getMinRevolutions());
	}

	@Test
	void testGetMaxRevolutions() {
		assertEquals(5, wheelspin.getMaxRevolutions());
	}


	@Test
	void testGetSegmentsCount() {
		assertEquals(3, wheelspin.getSegmentsCount());
	}

	@Test
	void testGetSegments() {
		//assertEquals(3, wheelspin.getSegments().size());
		assertEquals("Gift Cards", wheelspin.getSegments().get(0).getText());
	}
	
	 @Test
	    void testDefaultSegmentsWhenNoMultifield() {
		 aemContext.create().resource("/content/wheel",
	                "sling:resourceType", "xeragotheme/components/wheel-spin-game",
	                "title", "Default Test");

	        Resource resource = aemContext.currentResource("/content/wheel");
	        wheelspin = resource.adaptTo(WheelSpinGameModel.class);

	        assertNotNull(wheelspin);
	        assertEquals("Default Test", wheelspin.getTitle());

	        String json = wheelspin.getSegmentsJson();
	        assertNotNull(json);

	        
	        	com.google.gson.JsonArray arr = JsonParser.parseString(json).getAsJsonArray();
	            assertEquals(6, arr.size()); // ✅ covers getDefaultSegments()
	        
	    }

	    @Test
	    void testCustomSegments() {
	    	aemContext.create().resource("/content/wheel",
	                "sling:resourceType", "xeragotheme/components/wheel-spin-game",
	                "title", "Custom Test");

	        // Add multifield child
	    	aemContext.create().resource("/content/wheel/segments/0",
	                "text", "Gift Cards",
	                "color", "#ABCDEF",
	                "value", "Win a Gift",
	                "probability", 100,
	                "redeemCode", "SPECIAL123");

	    	wheelspin = aemContext.currentResource("/content/wheel").adaptTo(WheelSpinGameModel.class);

	        String json = wheelspin.getSegmentsJson();
	        assertNotNull(json);
	        JsonArray arr = JsonParser.parseString(json).getAsJsonArray();
	        assertEquals(1, arr.size());
	        JsonObject segment = arr.get(0).getAsJsonObject();
	        assertEquals("Gift Cards", segment.get("text").getAsString());
	        assertEquals("SPECIAL123", segment.get("redeemCode").getAsString());
	        }

	    @Test
	    void testRedeemCodeGeneratedWhenMissing() {
	    	aemContext.create().resource("/content/wheel",
	                "sling:resourceType", "xeragotheme/components/wheel-spin-game");

	        // Add multifield with no redeemCode
	    	aemContext.create().resource("/content/wheel/segments/0",
	                "text", "Lucky Prize",
	                "color", "#123456",
	                "value", "Surprise");

	    	wheelspin = aemContext.currentResource("/content/wheel").adaptTo(WheelSpinGameModel.class);

	        String json = wheelspin.getSegmentsJson();
	        assertTrue(json.contains("WHEELLUCKYPRI123")); // ✅ covers generateDefaultRedeemCode()
	    }

	    @Test
	    void testGetSegmentsDebug() {
	    	aemContext.create().resource("/content/wheel",
	                "sling:resourceType", "xeragotheme/components/wheel-spin-game");

	        // Add one segment
	    	aemContext.create().resource("/content/wheel/segments/0",
	                "text", "Debug Segment",
	                "color", "#FFFFFF",
	                "value", "Test");

	    	wheelspin = aemContext.currentResource("/content/wheel").adaptTo(WheelSpinGameModel.class);

	        String debug = wheelspin.getSegmentsDebug();
	        assertTrue(debug.contains("Debug Segment")); // ✅ covers debug method
	    }

}
