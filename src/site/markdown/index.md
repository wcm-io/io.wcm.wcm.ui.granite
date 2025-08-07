## About WCM Granite UI Extensions

Granite UI Components for AEM Touch UI.

[![Maven Central](https://img.shields.io/maven-central/v/io.wcm/io.wcm.wcm.ui.granite)](https://repo1.maven.org/maven2/io/wcm/io.wcm.wcm.ui.granite/)


### Documentation

* [Granite UI components][components]
* [Granite UI validators][validation]
* [Granite UI Show/Hide for dialog fields][showhide]
* [API documentation][apidocs]
* [Changelog][changelog]


### Overview

This library provides a selection of [Granite UI components][components] usable in any projects. Some components are subclasses of Granite UI components shipped with AEM Touch UI, overriding and extending some of its features.

Additionally a set of [Granite UI validators][validation] is provided which can be used with AEM 6.2 and up.


### AEM Version Support Matrix

|WCM Granite UI Extensions version |AEM version supported
|----------------------------------|----------------------
|1.10.2 or higher                  |AEM 6.5.17+, AEMaaCS
|1.9.4 - 1.10.0                    |AEM 6.5.7+, AEMaaCS
|1.9.0 - 1.9.2                     |AEM 6.5+, AEMaaCS
|1.7.x - 1.8.x                     |AEM 6.4+, AEMaaCS
|1.6.x                             |AEM 6.3+
|1.2.x - 1.5.x                     |AEM 6.2+
|1.0.x - 1.1.x                     |AEM 6.1+
|0.x                               |AEM 6.0+


### Usage of deprecated APIs

This module uses the API `org.apache.commons.collections` (Commons Collections 3) which is marked as deprecated in AEM. However, it's also baked into the AEM product API itself ([PredicateProvider](https://developer.adobe.com/experience-manager/reference-materials/cloud-service/javadoc/com/day/cq/commons/predicate/PredicateProvider.html) directly references [Commons Collections 3 Predicate](https://developer.adobe.com/experience-manager/reference-materials/cloud-service/javadoc/org/apache/commons/collections/Predicate.html). So this is unavoidable, unless Adobe changes the AEM product API.


### GitHub Repository

Sources: https://github.com/wcm-io/io.wcm.wcm.ui.granite


[components]: components.html
[validation]: validation.html
[showhide]: showhide.html
[apidocs]: apidocs/
[changelog]: changes.html
