/*
 * #%L
 * wcm.io
 * %%
 * Copyright (C) 2025 wcm.io
 * %%
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * #L%
 */
package io.wcm.wcm.ui.granite.util.impl;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.apache.commons.collections4.Predicate;
import org.apache.sling.api.resource.Resource;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Gets predicate instances from AEM PredicateProvider.
 *
 * <p>
 * Tries to get them from latest implementation from <code>com.day.cq.commons.predicates.PredicateProvider</code>
 * first (introduced in AEMaaCS API in 2025), and if that's not available, falls back to
 * <code>com.day.cq.commons.predicate.PredicateProvider</code> (also available in AEM 6.x).
 * </p>
 */
public final class PredicateProviderUtils {

  private static final String PREDICATE_PROVIDER_CLASS_NAME_LATEST = "com.day.cq.commons.predicates.PredicateProvider";
  private static final String PREDICATE_PROVIDER_CLASS_NAME_LEGACY = "com.day.cq.commons.predicate.PredicateProvider";

  private static final Logger log = LoggerFactory.getLogger(PredicateProviderUtils.class);

  private PredicateProviderUtils() {
    // static methods only
  }

  /**
   * Get list of predicates for given filter names.
   * @param filter Array of filter names
   * @param bundleContext OSGi bundle context
   * @return List of predicates
   */
  @SuppressWarnings({ "java:S2583", "null" }) // filter may be null
  public static @NotNull List<Predicate<Resource>> toPredicates(@NotNull String @Nullable [] filter, @NotNull BundleContext bundleContext) {
    if (filter == null || filter.length == 0) {
      return Collections.emptyList();
    }
    try (PredicateProviderWrapper predicateProvider = getPredicateProvider(bundleContext)) {
      return Arrays.asList(filter).stream()
          .filter(Objects::nonNull)
          .map(item -> {
            Predicate<Resource> predicate = predicateProvider.getPredicate(item);
            if (predicate != null) {
              return predicate;
            }
            else {
              log.warn("Unable to find predicate implementation for filter: {}", item);
              return null;
            }
          })
          .filter(Objects::nonNull)
          .collect(Collectors.toList());
    }
    catch (Exception ex) {
      log.warn("Unable to close predicate provider.", ex);
      return Collections.emptyList();
    }
  }

  private static @NotNull PredicateProviderWrapper getPredicateProvider(@NotNull BundleContext bundleContext) {
    ServiceReference<?> serviceReference = bundleContext.getServiceReference(PREDICATE_PROVIDER_CLASS_NAME_LATEST);
    if (serviceReference != null) {
      log.debug("Using legacy PredicateProvider implementation: {}", PREDICATE_PROVIDER_CLASS_NAME_LATEST);
      return new LatestPredicateProviderWrapper(serviceReference, bundleContext);
    }
    serviceReference = bundleContext.getServiceReference(PREDICATE_PROVIDER_CLASS_NAME_LEGACY);
    if (serviceReference != null) {
      log.debug("Using legacy PredicateProvider implementation: {}", PREDICATE_PROVIDER_CLASS_NAME_LEGACY);
      return new LegacyPredicateProviderWrapper(serviceReference, bundleContext);
    }
    log.warn("No PredicateProvider implementation found.");
    return new FallbackPredicateProviderWrapper();
  }

}
