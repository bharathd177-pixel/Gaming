package com.theme.xerago.core.servlets;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.Servlet;
import javax.servlet.ServletException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.PersistenceException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.servlets.annotations.SlingServletPaths;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.dam.api.Asset;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Component(service=Servlet.class)
@SlingServletPaths(value="/bin/importcoupons")
public class CouponImportServlet extends SlingAllMethodsServlet {

	private static final Logger Log = LoggerFactory.getLogger(CouponImportServlet.class);
	
//	@Reference
//	private transient CouponImportService couponImportService;
 
	@Override
	protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
			throws ServletException, IOException {
		String damPath = request.getParameter("damPath");
		String targetPath = request.getParameter("targetPath");
		ResourceResolver resolver = request.getResourceResolver();
		Resource resource = resolver.getResource(damPath);
		Log.error("dam res in servlet: ", resource);
		if(resource == null) {
			Log.error("Dam resource from servlet calling also not found at {}", damPath);
			return;
		}
		Asset asset = resource.adaptTo(Asset.class);
		if(asset == null) {
			Log.error("Servlet Not an Asset");
		}
		try {
			InputStream is = asset.getOriginal().getStream();
			JsonElement root = JsonParser.parseReader(new InputStreamReader(is));
			if(root.isJsonArray()) {
				JsonArray coupons = root.getAsJsonArray();
				Log.error("content path {}",targetPath);
				Resource parent = resolver.getResource(targetPath);
				if(parent == null) {
					Log.error("Target content path not found {}", targetPath);
					parent = createResourcePath(resolver, targetPath);
				}
				for(JsonElement element : coupons) {
					JsonObject obj = element.getAsJsonObject();
					String id = obj.get("id").getAsString();
					Resource existingChild = resolver.getResource(targetPath + "/" + id);
					if(existingChild != null) {
						Log.error("coupon code is already exists, skipping: {}", existingChild.getPath());
						continue;
					}
					Map<String, Object> props = new HashMap<>();
					for(String key : obj.keySet()) {
						props.put(key, obj.get(key).getAsString());
					}
					props.put("jcr:primaryType", "nt:unstructured");
					Resource child = resolver.create(parent, id, props);
					Log.error("coupon created {}", child.getPath());
				}
				
			}
			resolver.commit();
			Log.error("Coupon import completed successfully");
		}catch(Exception e) {
			Log.error("Error importing coupons test", e);
		}
//		if(damPath == null || targetPath == null) {
//			response.setStatus(400);
//			response.getWriter().write("missing parameter : damPath and targetPath are required");
//			return;
//		}
//		try {
//			String status = couponImportService.importCoupons(damPath, targetPath);
//			if("success".equals(status)) {
//				response.setStatus(200);
//				response.getWriter().write("coupon imported successfully");
//			}
//			else {
//				Log.error("error importing coupons");
//				response.getWriter().write("failed to import coupons");
//			}
//		}catch(Exception e) {
//			Log.error("error importing coupons", e);
//			response.getWriter().write("failed to import coupons" + e.getMessage());
//		}
			
	}
	private Resource createResourcePath(ResourceResolver resolver, String path) throws PersistenceException {
		String[] segments = path.split("/");
		StringBuilder currentPath = new StringBuilder();
		Resource parent = resolver.getResource("/");
		for(String segment : segments) {
			if(segment.isEmpty()) continue;
			currentPath.append("/").append(segment);
			Resource res = resolver.getResource(currentPath.toString());
			if(res == null) {
				res = resolver.create(parent, segment, null);
			}
			parent = res;
		}
		return parent;
	}
	
}
