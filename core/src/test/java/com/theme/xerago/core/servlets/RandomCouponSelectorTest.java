package com.theme.xerago.core.servlets;

import static org.junit.jupiter.api.Assertions.*;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class RandomCouponSelectorTest {

    private RandomCouponSelector servlet = new RandomCouponSelector();

    // wcm.io will inject AemContext for each test
    private final AemContext context = new AemContext(ResourceResolverType.JCR_MOCK);

    @BeforeEach
    void setUp() {
        // Create test coupon structure in JCR
        context.create().resource("/content/coupons/static/coupon1",
                "code", "COUPON-123",
                "discount", "10%");

        context.create().resource("/content/coupons/static/coupon2",
                "code", "COUPON-456",
                "discount", "20%");
    }

    @Test
    void testDoGet_withCoupons(AemContext context) throws Exception {
        SlingHttpServletRequest request = context.request();
        SlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        String result = context.response().getOutputAsString();

        assertNotNull(result);
        assertTrue(result.contains("COUPON-123") || result.contains("COUPON-456"),
                "Response should contain one of the coupons");
        assertEquals("application/Json", response.getContentType());
    }

    @Test
    void testDoGet_noCoupons(AemContext context) throws Exception {
        Resource coupon1 = context.resourceResolver().getResource("/content/coupons/static/coupon1");
        Resource coupon2 = context.resourceResolver().getResource("/content/coupons/static/coupon2");

        context.resourceResolver().delete(coupon1);
        context.resourceResolver().delete(coupon2);

        SlingHttpServletRequest request = context.request();
        SlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        String result = context.response().getOutputAsString();

        assertEquals(404, response.getStatus());
        assertTrue(result.contains("No coupons available"));
    }

    @Test
    void testDoGet_noFolder(AemContext context) throws Exception {
        Resource couponFolder = context.resourceResolver().getResource("/content/coupons");
        context.resourceResolver().delete(couponFolder);

        SlingHttpServletRequest request = context.request();
        SlingHttpServletResponse response = context.response();

        servlet.doGet(request, response);

        String result = context.response().getOutputAsString();

        assertEquals(404, response.getStatus());
        assertTrue(result.contains("coupon folder not found"));
    }
}
