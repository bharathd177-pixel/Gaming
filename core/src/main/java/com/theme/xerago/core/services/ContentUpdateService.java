package com.theme.xerago.core.services;

import org.apache.sling.api.resource.PersistenceException;
import java.util.Map;

/**
 * Service to handle content updates via API.
 */
public interface ContentUpdateService {

    /**
     * Updates an existing component's properties.
     *
     * @param pagePath    The path to the page containing the component.
     * @param componentId The node name or identifier of the component.
     * @param updates     Map of property names and values to update.
     * @return true if update was successful.
     * @throws PersistenceException if the update fails.
     */
    boolean updateComponentContent(org.apache.sling.api.resource.ResourceResolver resolver, String pagePath,
            String componentId, Map<String, Object> updates)
            throws PersistenceException;

}
