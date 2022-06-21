<%--
  #%L
  wcm.io
  %%
  Copyright (C) 2019 wcm.io
  %%
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
  #L%
--%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="com.adobe.granite.ui.components.Config"%>
<%@page import="com.adobe.granite.ui.components.ExpressionHelper"%>
<%@page import="com.day.text.Text"%>
<%@page import="org.apache.commons.lang3.StringUtils"%>
<%@page import="org.apache.sling.api.resource.Resource"%>
<%@page import="org.apache.sling.api.resource.ResourceResolver"%>
<%@page import="org.apache.sling.api.request.RequestDispatcherOptions"%>
<%@page import="org.apache.sling.api.wrappers.ValueMapDecorator"%>
<%@page import="io.wcm.wcm.ui.granite.resource.GraniteUiSyntheticResource"%>
<%@include file="../../../global/global.jsp" %><%

// validate paths and fallback to next-possible paths if invalid to ensure picker can always be used
Config cfg = cmp.getConfig();
ExpressionHelper ex = cmp.getExpressionHelper();
String rootPath = StringUtils.trimToNull(ex.getString(cfg.get("rootPath", String.class)));
String path = StringUtils.trimToNull(ex.getString(cfg.get("path", String.class)));

// ensure both rootPath and path point ot existing paths - fallback to parent/root path if that's not the case
rootPath = getExistingPath(rootPath, "/", resourceResolver);
path = getExistingPath(path, rootPath, resourceResolver);

Map<String,Object> props = new HashMap<>();
props.put("rootPath", rootPath);
props.put("path", path);

// simulate resource for dialog field def with new rootPath instead of configured one
Resource resourceWrapper = GraniteUiSyntheticResource.wrapMerge(resource, new ValueMapDecorator(props));

RequestDispatcherOptions options = new RequestDispatcherOptions();
options.setForceResourceType("granite/ui/components/coral/foundation/picker");
RequestDispatcher dispatcher = slingRequest.getRequestDispatcher(resourceWrapper, options);
dispatcher.include(slingRequest, slingResponse);

%><%!

/**
 * Make sure the given path exists. If it does not exist go up to parent hierarchy until it returns an
 * existing resource path - up to the root path. As fallback, return the root path.
 */
String getExistingPath(String path, String rootPath, ResourceResolver resourceResolver) {
  if (StringUtils.equals(path, rootPath)) {
    return path;
  }
  String rootPathWithSuffix = rootPath;
  if (!StringUtils.endsWith(rootPathWithSuffix, "/")) {
    rootPathWithSuffix += "/";
  }
  if (path == null || !StringUtils.startsWith(path, rootPathWithSuffix)) {
    return rootPath;
  }
  if (resourceResolver.getResource(path) != null) {
    return path;
  }
  String parentPath = Text.getRelativeParent(path, 1);
  return getExistingPath(parentPath, rootPathWithSuffix, resourceResolver);
}

%>