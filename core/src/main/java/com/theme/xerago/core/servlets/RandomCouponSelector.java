package com.theme.xerago.core.servlets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletResourceTypes;
import org.osgi.service.component.annotations.Component;
import org.apache.sling.api.servlets.HttpConstants;

import com.google.gson.Gson;

@Component(service=Servlet.class)
@SlingServletResourceTypes(resourceTypes="xeragotheme/components/smartRushGame/gamestartscreen",
selectors = "coupon",
extensions = "json",
methods = HttpConstants.METHOD_GET)
public class RandomCouponSelector extends SlingAllMethodsServlet {

	private final Random random = new Random();
	
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		ResourceResolver resolver = request.getResourceResolver();
		Resource couponFolder = resolver.getResource("/content/coupons/static");
		if(couponFolder == null) {
			response.setStatus(404);
			response.getWriter().write("coupon folder not found");
			return;
		}
		List<Resource> coupons = new ArrayList<>();
		for(Resource coupon : couponFolder.getChildren()) {
			coupons.add(coupon);
		}
		
		if(coupons.isEmpty()) {
			response.setStatus(404);
			response.getWriter().write("No coupons available");
			return;
		}
		
		Resource selectedCoupon = coupons.get(random.nextInt(coupons.size()));
		
		ValueMap couponProps = selectedCoupon.getValueMap();
		Gson gson = new Gson();
		response.setContentType("application/Json");
		response.getWriter().write(gson.toJson(couponProps));
		
	}

}
