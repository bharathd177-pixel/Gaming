package com.theme.xerago.core.services.impl;

import com.day.cq.commons.jcr.JcrConstants;
import com.theme.xerago.core.services.ContentUpdateService;
import org.apache.sling.api.resource.*;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collections;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component(service = ContentUpdateService.class)
public class ContentUpdateServiceImpl implements ContentUpdateService {

    private static final Logger LOG = LoggerFactory.getLogger(ContentUpdateServiceImpl.class);
    private static final String SERVICE_NAME = "content-write";
    private static final Set<String> FORBIDDEN_PROPERTIES = new HashSet<>();

    static {
        FORBIDDEN_PROPERTIES.add(JcrConstants.JCR_PRIMARYTYPE);
        FORBIDDEN_PROPERTIES.add(JcrConstants.JCR_MIXINTYPES);
        FORBIDDEN_PROPERTIES.add(ResourceResolver.PROPERTY_RESOURCE_TYPE); // sling:resourceType
        FORBIDDEN_PROPERTIES.add("sling:resourceSuperType");
    }

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    public boolean updateComponentContent(ResourceResolver resolver, String pagePath, String componentId,
            Map<String, Object> updates)
            throws PersistenceException {
        if (updates == null || updates.isEmpty()) {
            LOG.warn("No updates provided for {}", pagePath);
            return false;
        }

        Resource pageResource = resolver.getResource(pagePath);
        if (pageResource == null) {
            LOG.error("Page not found: {}", pagePath);
            return false;
        }

        Resource contentNode = pageResource.getChild(JcrConstants.JCR_CONTENT);
        if (contentNode == null) {
            LOG.error("Page content not found: {}", pagePath);
            return false;
        }

        // Simple resolution: direct child or search? Design says "Component ID to node
        // path resolution".
        // Assuming componentId is the node name relative to jcr:content or a unique ID.
        // For this implementation, we will treat it as a relative path under
        // jcr:content.
        Resource componentResource = contentNode.getChild(componentId);

        if (componentResource == null) {
            // Try searching if not direct child?
            // For "Pure API", simplicity suggests direct path or deep path.
            // If resolving "hero", it might be "root/container/hero".
            // Let's assume componentId IS the relative path for now, e.g.
            // "root/container/hero".
            LOG.error("Component not found: {}/{}", contentNode.getPath(), componentId);
            return false;
        }

        ModifiableValueMap mvm = componentResource.adaptTo(ModifiableValueMap.class);
        if (mvm == null) {
            LOG.error("Resource is not modifiable: {}", componentResource.getPath());
            return false;
        }

        boolean changesMade = false;
        for (Map.Entry<String, Object> entry : updates.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();

            if (FORBIDDEN_PROPERTIES.contains(key)) {
                LOG.warn("Attempt to update forbidden property: {}", key);
                continue;
            }

            Resource targetResource = componentResource;
            String propertyName = key;

            // Handle nested paths (e.g., "plans/item0/badgeText")
            if (key.contains("/")) {
                int lastSlash = key.lastIndexOf('/');
                String relativePath = key.substring(0, lastSlash);
                propertyName = key.substring(lastSlash + 1);

                targetResource = componentResource.getChild(relativePath);
                if (targetResource == null) {
                    LOG.warn("Child resource not found for update: {} (full key: {})", relativePath, key);
                    continue;
                }
            }

            ModifiableValueMap targetMvm = targetResource.adaptTo(ModifiableValueMap.class);
            if (targetMvm != null) {
                targetMvm.put(propertyName, value);
                changesMade = true;
            } else {
                LOG.error("Target resource is not modifiable: {}", targetResource.getPath());
            }
        }

        if (changesMade) {
            resolver.commit();
            return true;
        }

        return false;
    }
}
