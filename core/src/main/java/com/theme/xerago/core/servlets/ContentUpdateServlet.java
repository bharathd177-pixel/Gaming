package com.theme.xerago.core.servlets;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.theme.xerago.core.services.ContentUpdateService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component(service = Servlet.class, property = {
        Constants.SERVICE_DESCRIPTION + "=Content Update API Servlet",
        "sling.servlet.methods=" + HttpConstants.METHOD_POST,
        "sling.servlet.methods=" + HttpConstants.METHOD_GET,
        "sling.servlet.paths=" + "/bin/content/update"
})
public class ContentUpdateServlet extends SlingAllMethodsServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger LOG = LoggerFactory.getLogger(ContentUpdateServlet.class);
    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Reference
    private ContentUpdateService contentUpdateService;

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            Map<String, Object> payload = MAPPER.readValue(request.getInputStream(),
                    new TypeReference<Map<String, Object>>() {
                    });

            String pagePath = (String) payload.get("pagePath");
            String componentId = (String) payload.get("componentId");
            @SuppressWarnings("unchecked")
            Map<String, Object> updates = (Map<String, Object>) payload.get("updates");

            if (pagePath == null || componentId == null || updates == null) {
                response.setStatus(SlingHttpServletResponse.SC_BAD_REQUEST);
                response.getWriter()
                        .write(jsonResponse("failed", "Missing required fields: pagePath, componentId, or updates"));
                return;
            }

            boolean success = contentUpdateService.updateComponentContent(request.getResourceResolver(), pagePath,
                    componentId, updates);

            if (success) {
                response.setStatus(SlingHttpServletResponse.SC_OK);
                response.getWriter().write(jsonResponse("success", "Component updated successfully"));
            } else {
                response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().write(jsonResponse("failed", "Update operation failed see logs for details"));
            }

        } catch (Exception e) {
            LOG.error("Error processing content update request", e);
            response.setStatus(SlingHttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(jsonResponse("error", "Internal server error: " + e.getMessage()));
        }

    }

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        response.getWriter().write("{\"status\":\"valid\", \"message\":\"Content Update API is active\"}");
    }

    private String jsonResponse(String status, String message) {
        try {
            Map<String, String> map = new HashMap<>();
            map.put("status", status);
            map.put("message", message);
            return MAPPER.writeValueAsString(map);
        } catch (Exception e) {
            return "{\"status\":\"error\", \"message\":\"JSON serialization error\"}";
        }
    }
}
