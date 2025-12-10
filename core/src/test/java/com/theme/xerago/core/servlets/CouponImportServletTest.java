 package com.theme.xerago.core.servlets;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

import javax.servlet.ServletException;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.Rendition;
import com.google.common.collect.ImmutableMap;

import io.wcm.testing.mock.aem.junit5.AemContext; 
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class CouponImportServletTest {

	AemContext context = new AemContext(); 
	
	CouponImportServlet servlet;
	
	@BeforeEach
	void setUp() throws Exception {
		servlet = new  CouponImportServlet();
		context.registerInjectActivateService(servlet);
	}

	@Test
	void testDoGetSlingHttpServletRequestSlingHttpServletResponse() throws ServletException, IOException {
		String json = "[{\"id\":\"c1\",\"name\":\"coupon1\"},{\"id\":\"c2\",\"name\":\"coupon2\"}]";
		ByteArrayInputStream is = new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8));
		
		  // Mock DAM Asset and Rendition
		Asset asset = mock(Asset.class);
		Rendition rendition = mock(Rendition.class);
		when(asset.getOriginal()).thenReturn(rendition);
		when(rendition.getStream()).thenReturn(is);
		
		// Register DAM resource in context
		 context.create().resource("/content/dam/xeragotheme/coupons.json");
		 
		// Adapt DAM resource to Asset
		 context.registerAdapter(Resource.class, Asset.class, asset);

		// Create target parent path
	        context.create().resource("/content/coupons/static");
	        
	        // Execute servlet
	        context.request().setParameterMap(ImmutableMap.of(
	                "damPath", "/content/dam/xeragotheme/coupons.json",
	                "targetPath", "/content/coupons/static"
	        ));
	        servlet.doGet(context.request(), context.response());
	     // Verify only one coupon "c1" exists
	        Resource coupon1 = context.resourceResolver().getResource("/content/coupons/static/c1");
	        assertNotNull(coupon1, "Coupon c1 should be created");
	        assertEquals("coupon1", coupon1.getValueMap().get("name", String.class));

	        
	}
	 @Test
	    void testDoGet_whenDamResourceNotFound() throws Exception {
	        // Missing DAM path
	        context.request().setParameterMap(ImmutableMap.of( 
	                "damPath", "/content/dam/missing.json",
	                "targetPath", "/content/coupons/static"
	        ));

	        servlet.doGet(context.request(), context.response());

	        // No resource should be created
	        Resource staticPath = context.resourceResolver().getResource("/content/coupons/static");
	        assertNull(staticPath, "No target path should be created since damPath is missing");
	    }

}
