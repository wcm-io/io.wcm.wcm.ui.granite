/*
 * #%L
 * wcm.io
 * %%
 * Copyright (C) 2024 wcm.io
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
package io.wcm.wcm.ui.granite.pathfield.impl.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

import java.io.IOException;

import javax.servlet.jsp.JspWriter;
import javax.servlet.jsp.PageContext;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
class DummyPageContextTest {

  private final AemContext context = new AemContext();
  private PageContext underTest;

  @BeforeEach
  protected void setUp() {
    this.underTest = new DummyPageContext(context.request(), context.response());
  }

  @Test
  void testRequest() {
    assertSame(context.request(), underTest.getRequest());
  }

  @Test
  void testResponse() {
    assertSame(context.response(), underTest.getResponse());
  }

  @Test
  void testJspWriter() throws IOException {
    JspWriter writer = underTest.getOut();
    writer.write("test");
    assertEquals("test", context.response().getOutputAsString());
  }

}
