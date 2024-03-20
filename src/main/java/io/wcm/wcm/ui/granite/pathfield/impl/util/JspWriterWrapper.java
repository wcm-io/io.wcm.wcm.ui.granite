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
import java.io.PrintWriter;
import java.io.Writer;

import javax.servlet.jsp.JspWriter;

import org.jetbrains.annotations.NotNull;

/**
 * Provide JspWriter wrapper because {@link com.adobe.granite.ui.components.ComponentHelper} tries
 * to access the JspWriter from the dummy page context.
 */
class JspWriterWrapper extends JspWriter {

  private final PrintWriter writer;

  JspWriterWrapper(@NotNull Writer writer) {
    super(JspWriter.NO_BUFFER, true);
    this.writer = new PrintWriter(writer);
  }

  @Override
  public void print(boolean value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(char value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(int value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(long value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(float value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(double value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(char[] value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(String value) throws IOException {
    writer.print(value);
  }

  @Override
  public void print(Object value) throws IOException {
    writer.print(value);
  }

  @Override
  public void println() throws IOException {
    writer.println();
  }

  @Override
  public void println(boolean value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(char value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(int value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(long value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(float value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(double value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(char[] value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(String value) throws IOException {
    writer.println(value);
  }

  @Override
  public void println(Object value) throws IOException {
    writer.println(value);
  }

  @Override
  public void flush() throws IOException {
    writer.flush();
    throw new UnsupportedOperationException();
  }

  @Override
  public void close() throws IOException {
    writer.close();
  }

  @Override
  public void write(char[] cbuf, int off, int len) throws IOException {
    writer.write(cbuf, off, len);
  }

  // --- unsupported methods ---

  @Override
  public void newLine() throws IOException {
    throw new UnsupportedOperationException();
  }

  @Override
  public void clear() throws IOException {
    throw new UnsupportedOperationException();
  }

  @Override
  public void clearBuffer() throws IOException {
    throw new UnsupportedOperationException();
  }

  @Override
  public int getRemaining() {
    throw new UnsupportedOperationException();
  }

}
