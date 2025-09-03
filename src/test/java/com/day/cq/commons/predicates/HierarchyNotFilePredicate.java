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
package com.day.cq.commons.predicates;

import javax.jcr.Node;
import javax.jcr.RepositoryException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.commons.jcr.JcrConstants;

/**
 * New predicate implementation that is introduced in AEMaaCS API in 2024.
 */
public class HierarchyNotFilePredicate implements NodePredicate {

  private final Logger log = LoggerFactory.getLogger(HierarchyNotFilePredicate.class);

  @Override
  public boolean test(Node node) {
    try {
      return node.isNodeType(JcrConstants.NT_HIERARCHYNODE) && !node.isNodeType(JcrConstants.NT_FILE);
    }
    catch (RepositoryException ex) {
      log.warn("Error evaluating predciate.", ex);
    }
    return false;
  }
}

