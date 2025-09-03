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

import org.apache.commons.collections4.Predicate;
import org.apache.sling.api.resource.Resource;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;

/**
 * Wrapper for latest PredicateProvider implementation that returns java.util.function.Predicate.
 */
class LatestPredicateProviderWrapper extends AbstractPredicateProviderWrapper {

  private static final String NODE_PREDICATE_INTERFACE = "com.day.cq.commons.predicates.NodePredicate";

  LatestPredicateProviderWrapper(ServiceReference<?> serviceReference, BundleContext bundleContext) {
    super(serviceReference, bundleContext);
  }

  @SuppressWarnings("unchecked")
  @Override
  public @Nullable Predicate<Resource> getPredicate(@NotNull String name) {
    java.util.function.Predicate<Resource> predicate = (java.util.function.Predicate)getPredicateInternal(name);
    if (predicate == null) {
      return null;
    }
    if (isNodePredicate(predicate)) {
      return new NodePredicateWrapper((java.util.function.Predicate)predicate)::test;
    }
    return predicate::test;
  }

  /**
   * Checks if the given predicate implementation implements the NodePredicate interface.
   * @param obj Predicate implementation
   * @return true if NodePredicate
   */
  private static boolean isNodePredicate(Object obj) {
    for (Class<?> intf : obj.getClass().getInterfaces()) {
      if (NODE_PREDICATE_INTERFACE.equals(intf.getName())) {
        return true;
      }
    }
    return false;
  }

}
