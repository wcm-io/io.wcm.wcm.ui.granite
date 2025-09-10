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

import java.util.function.Predicate;

import javax.jcr.Node;

import org.apache.sling.api.resource.Resource;

class NodePredicateWrapper implements Predicate<Resource> {

  private final Predicate<Node> delegate;

  NodePredicateWrapper(Predicate<Node> delegate) {
    this.delegate = delegate;
  }

  @Override
  public boolean test(Resource resource) {
    Node node = resource.adaptTo(Node.class);
    if (node != null) {
      return delegate.test(node);
    }
    return false;
  }

}
