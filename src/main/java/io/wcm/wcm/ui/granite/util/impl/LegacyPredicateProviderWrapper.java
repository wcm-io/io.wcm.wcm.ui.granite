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

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

import org.apache.commons.collections4.Predicate;
import org.apache.sling.api.resource.Resource;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

class LegacyPredicateProviderWrapper implements PredicateProviderWrapper {

  private final ServiceReference<?> serviceReference;
  private final BundleContext bundleContext;
  private final Object service;
  private Method getPredicateMethod;

  private static final Logger log = LoggerFactory.getLogger(LegacyPredicateProviderWrapper.class);

  LegacyPredicateProviderWrapper(ServiceReference<?> serviceReference, BundleContext bundleContext) {
    this.serviceReference = serviceReference;
    this.bundleContext = bundleContext;
    service = bundleContext.getService(serviceReference);
    if (service != null) {
      try {
        getPredicateMethod = service.getClass().getMethod("getPredicate", String.class);
      }
      catch (NoSuchMethodException | SecurityException ex) {
        log.warn("Legacy PredicateProvider service does not implement expected method 'getPredicate(String)'.", ex);
      }
    }
  }

  @Override
  public @Nullable Predicate<Resource> getPredicate(@NotNull String name) {
    if (getPredicateMethod != null) {
      try {
        Object predicate = getPredicateMethod.invoke(service, name);
        Method evaluateMethod = predicate.getClass().getMethod("evaluate", Object.class);
        return resource -> {
          try {
            return Boolean.TRUE.equals(evaluateMethod.invoke(predicate, resource));
          }
          catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException ex) {
            log.warn("Error calling 'getPredicate(String)' on legacy PredicateProvider service.", ex);
            return false;
          }
        };
      }
      catch (SecurityException | IllegalAccessException | IllegalArgumentException | InvocationTargetException | NoSuchMethodException ex) {
        log.warn("Error calling 'getPredicate(String)' on legacy PredicateProvider service.", ex);
      }

    }
    return null;
  }

  @Override
  public void unget() {
    bundleContext.ungetService(serviceReference);
  }

}
