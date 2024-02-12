/*
 * #%L
 * wcm.io
 * %%
 * Copyright (C) 2019 wcm.io
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

import java.io.IOException;

import javax.servlet.jsp.JspWriter;

/**
 * Workaround because {@link com.adobe.granite.ui.components.ComponentHelper} always tries
 * to access the JspWriter from the dummy page context.
 */
class DummyJspWriter extends JspWriter {

  DummyJspWriter() {
    super(0, false);
  }

  // --- ignore but accept all writing methods 

  @Override
  public void newLine() throws IOException {
    // ignore
  }

  @Override
  public void print(boolean b) throws IOException {
    // ignore
  }

  @Override
  public void print(char c) throws IOException {
    // ignore
  }

  @Override
  public void print(int i) throws IOException {
    // ignore
  }

  @Override
  public void print(long l) throws IOException {
    // ignore
  }

  @Override
  public void print(float f) throws IOException {
    // ignore
  }

  @Override
  public void print(double d) throws IOException {
    // ignore
  }

  @Override
  public void print(char[] s) throws IOException {
    // ignore
  }

  @Override
  public void print(String s) throws IOException {
    // ignore
  }

  @Override
  public void print(Object obj) throws IOException {
    // ignore
  }

  @Override
  public void println() throws IOException {
    // ignore
  }

  @Override
  public void println(boolean x) throws IOException {
    // ignore
  }

  @Override
  public void println(char x) throws IOException {
    // ignore
  }

  @Override
  public void println(int x) throws IOException {
    // ignore
  }

  @Override
  public void println(long x) throws IOException {
    // ignore
  }

  @Override
  public void println(float x) throws IOException {
    // ignore
  }

  @Override
  public void println(double x) throws IOException {
    // ignore
  }

  @Override
  public void println(char[] x) throws IOException {
    // ignore
  }

  @Override
  public void println(String x) throws IOException {
    // ignore
  }

  @Override
  public void println(Object x) throws IOException {
    // ignore
  }

  @Override
  public void clear() throws IOException {
    // ignore
  }

  @Override
  public void clearBuffer() throws IOException {
    // ignore
  }

  @Override
  public void flush() throws IOException {
    // ignore
  }

  @Override
  public void close() throws IOException {
    // ignore
  }

  @Override
  public void write(char[] cbuf, int off, int len) throws IOException {
    // ignore
  }

  // --- unsupported methods ---

  @Override
  public int getRemaining() {
    throw new UnsupportedOperationException();
  }

}
