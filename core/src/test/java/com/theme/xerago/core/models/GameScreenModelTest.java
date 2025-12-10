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
class GameScreenModelTest {
	
	AemContext aemContext = new AemContext();
	
	GameScreenModel gamescreen;
	
	Resource resource;

	@BeforeEach
	void setUp() throws Exception {
		aemContext.addModelsForClasses(GameScreenModel.class);
		aemContext.load().json("/gamescreen.json", "/component");
		resource = aemContext.currentResource("/component/gamescreen");
		gamescreen = resource.adaptTo(GameScreenModel.class);
	}

	@Test
	void testGetTitle() {
		assertEquals("TAP TO START", gamescreen.getTitle());
	}

	@Test
	void testGetDescription() {
		assertEquals("Swipe left, right, up or down to move your avatar and collect the icons", gamescreen.getDescription());
	}

	@Test
	void testGetLogoReference() {
		assertEquals("/content/dam/xeragotheme/citi-blue-redarc-rgb.png", gamescreen.getLogoReference());
	}

	@Test
	void testGetRefreshLogoReference() {
		assertEquals("/content/dam/xeragotheme/refresh.png", gamescreen.getRefreshLogoReference());
	}

	@Test
	void testGetStatTitle() {
		assertEquals("Score 100 points to get your reward", gamescreen.getStatTitle());
	}

	@Test
	void testGetTimerImgReference() {
		assertEquals("/content/dam/xeragotheme/Time.png", gamescreen.getTimerImgReference());
	}

}
