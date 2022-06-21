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

import java.util.HashMap;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceWrapper;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.CompositeValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import com.adobe.granite.ui.components.ExpressionHelper;

public class LimitIncreaseDatasourceWrapper extends ResourceWrapper {

  ValueMap wrapper = null;
  long limit;

  public LimitIncreaseDatasourceWrapper(Resource datasource, ExpressionHelper ex, long amount) {
    super(datasource);
    limit = ex.get(getResource().getValueMap().get("limit", String.class), Long.class) + amount;
  }

  @Override
  public ValueMap getValueMap() {
    if (wrapper == null) {
      ValueMapDecorator overrides = new ValueMapDecorator(new HashMap<>());
      overrides.put("limit", "" + limit);
      wrapper = new CompositeValueMap(overrides, getResource().getValueMap(), true);
    }

    return wrapper;
  }
}
