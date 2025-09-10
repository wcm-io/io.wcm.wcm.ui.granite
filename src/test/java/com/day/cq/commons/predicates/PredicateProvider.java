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

import java.util.function.Predicate;

/**
 * This new predicate provider interface is introduced in AEMaaCS API in 2024.
 */
public interface PredicateProvider {

  Predicate getPredicate(String name);

}
