/*
 * #%L
 * wcm.io
 * %%
 * Copyright (C) 2022 wcm.io
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
package io.wcm.wcm.ui.granite.pathfield.impl;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceWrapper;

public class DatasourceOverrideWrapper extends ResourceWrapper {

  Resource datasource;

  public DatasourceOverrideWrapper(Resource resource, Resource datasource) {
    super(resource);
    this.datasource = datasource;
  }

  @Override
  public Resource getChild(String relPath) {
    if ("datasource".equals(relPath) && datasource != null) {
      return datasource;
    }
    return getResource().getChild(relPath);
  }

}