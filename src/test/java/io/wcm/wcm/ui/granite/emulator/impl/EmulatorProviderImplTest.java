/*
 * #%L
 * wcm.io
 * %%
 * Copyright (C) 2015 wcm.io
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
package io.wcm.wcm.ui.granite.emulator.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.emulator.Emulator;
import com.day.cq.wcm.emulator.EmulatorProvider;
import com.day.cq.wcm.mobile.api.device.DeviceGroup;
import com.day.cq.wcm.mobile.api.device.DeviceGroupList;

import io.wcm.testing.mock.aem.junit5.AemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;

@ExtendWith(AemContextExtension.class)
@SuppressWarnings("null")
class EmulatorProviderImplTest {

  private final AemContext context = new AemContext();

  private EmulatorProvider underTest;

  private Page page1;
  private Page page2;
  private Page page3;

  @BeforeEach
  void setUp() {
    underTest = context.registerInjectActivateService(new EmulatorProviderImpl(),
        "templatePathPatterns", new String[] { "^/apps/app1/.*$", "^/apps/app2/.*$" });

    page1 = context.create().page("/content/page1", "/apps/app1/template1",
        "cq:deviceGroups", new String[] {
            "/etc/mobile/groups/responsive"
        });
    page2 = context.create().page("/content/page1/page2", "/apps/app2/template2");
    page3 = context.create().page("/content/page1/page3", "/apps/app3/template3");
  }

  @Test
  void testHandles() {
    assertTrue(underTest.handles(page1.adaptTo(Resource.class)));
    assertTrue(underTest.handles(page2.adaptTo(Resource.class)));
    assertFalse(underTest.handles(page3.adaptTo(Resource.class)));
  }

  @Test
  void testGetEmulators() {
    Resource resource = mock(Resource.class);
    Page page = mock(Page.class);
    when(resource.adaptTo(Page.class)).thenReturn(page);
    DeviceGroupListMock deviceGroupList = new DeviceGroupListMock();
    when(page.adaptTo(DeviceGroupList.class)).thenReturn(deviceGroupList);
    DeviceGroup deviceGroup1 = mock(DeviceGroup.class);
    Emulator emulator1 = mock(Emulator.class);
    Emulator emulator2 = mock(Emulator.class);
    deviceGroupList.add(deviceGroup1);
    when(deviceGroup1.getEmulators()).thenReturn(List.of(emulator1, emulator2));
    DeviceGroup deviceGroup2 = mock(DeviceGroup.class);
    Emulator emulator3 = mock(Emulator.class);
    when(deviceGroup2.getEmulators()).thenReturn(List.of(emulator3));
    deviceGroupList.add(deviceGroup2);

    List<Emulator> emulators = underTest.getEmulators(resource);
    assertEquals(3, emulators.size());
    assertTrue(emulators.contains(emulator1));
    assertTrue(emulators.contains(emulator2));
    assertTrue(emulators.contains(emulator3));
  }

  private static final class DeviceGroupListMock extends ArrayList<DeviceGroup> implements DeviceGroupList {
    private static final long serialVersionUID = 1L;
    // DeviceGroup list
  }

}
