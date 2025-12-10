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
class GameStartScreenModelTest {
	
	AemContext aemContext = new AemContext();
	
	GameStartScreenModel gameScreen;
	
	Resource resource;

	@BeforeEach
	void setUp() throws Exception {
		aemContext.addModelsForClasses(GameStartScreenModel.class);
		aemContext.load().json("/startscreen.json", "/component");
		resource = aemContext.currentResource("/component/startscreen");
		gameScreen = resource.adaptTo(GameStartScreenModel.class);
	}

	@Test
	void testGetLogoReference() {
		assertEquals("/content/dam/xeragotheme/citi-blue-redarc-rgb.png", gameScreen.getLogoReference());
	}

	@Test
	void testGetGameTitle() {
		assertEquals("Rush Hour Run", gameScreen.getGameTitle());
	}

	@Test
	void testGetGameSubTitle() {
		assertEquals("Presented by Citi SMRT Card", gameScreen.getGameSubTitle());
	}

	@Test
	void testGetStartButtonText() {
		assertEquals("Start Game", gameScreen.getStartButtonText());
	}

	@Test
	void testGetTncButtonText() {
		assertEquals("Terms & Conditions", gameScreen.getTncButtonText());
	}

	@Test
	void testGetTncButtonUrl() {
		assertEquals("https://www.citibank.com.sg/tncsrushhourrun/", gameScreen.getTncButtonUrl());
	}

	@Test
	void testGetHowToPlayButtonText() {
		assertEquals("How to Play", gameScreen.getHowToPlayButtonText());
	}

	@Test
	void testGetHowToPlayButtonUrl() {
		assertEquals("#", gameScreen.getHowToPlayButtonUrl());
	}

}
