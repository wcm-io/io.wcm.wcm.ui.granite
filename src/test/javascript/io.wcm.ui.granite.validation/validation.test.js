/**
 * @jest-environment jsdom
 */
window.$ = require('jquery');
require('../mocks/granite/ui')(window);
require('../mocks/granite/i18n')(window);
require('../mocks/foundation/validation')(window);

describe('io.wcm.ui.granite.validation', () => {
  function validate(type, value, isValid, validationMessage, additionalProperties = {}) {
    const el = document.createElement('input');
    Object.entries({
      'data-foundation-validation': type,
      ...additionalProperties
    }).forEach(([attributeName, attributeValue]) => el.setAttribute(attributeName, String(attributeValue)));
    el.setAttribute('data-foundation-validation', type);
    el.value = value;
    const validator = $(el).adaptTo("foundation-validation");
    const result = validator.checkValidity();
    expect(result).toBe(isValid);
    if (!isValid) {
      expect(validator.message).toBe(validationMessage);
    }
  }

  beforeAll(() => {
    require('../../../main/webapp/app-root/clientlibs/io.wcm.ui.granite.validation/js/validation.js');
  });

  describe('wcmio.email', () => {
    test.each([
      ["firstname.lastname@mycompany.com", true],
      ["http://myhost", false],
      ["http://www.domain.com/path1", false],
      ["https://myhost/path1/path2", false],
      ["ftp://myhost", false],
      ["//myhost", false],
      ["mailto:firstname.lastname@mycompany.com", false],
      ["tel:+49 123 456789", false],
      ["simplestring", false],
      ["www.domain.com", false],
      ["/content/site1/page1", false],
      ["/content/dam/sample.jpg", false],
      ["/ns1:this/is/ns2:a/path", false]
    ])('should validate "%s" as %s', (value, isValid) => {
      validate('wcmio.email', value, isValid, "Please enter a valid email address.");
    });
  });

  describe('wcmio.url', () => {
    test.each([
      ["firstname.lastname@mycompany.com", false],
      ["http://myhost", true],
      ["http://www.domain.com/path1", true],
      ["https://myhost/path1/path2", true],
      ["ftp://myhost", true],
      ["//myhost", true],
      ["mailto:firstname.lastname@mycompany.com", true],
      ["tel:+49 123 456789", true],
      ["simplestring", false],
      ["www.domain.com", false],
      ["/content/site1/page1", false],
      ["/content/dam/sample.jpg", false],
      ["/ns1:this/is/ns2:a/path", false]
    ])('should validate "%s" as %s', (value, isValid) => {
      validate('wcmio.url', value, isValid, "Please enter a valid URL.");
    });
  });

  describe('wcmio.path', () => {
    test.each([
      ["firstname.lastname@mycompany.com", false],
      ["http://myhost", false],
      ["http://www.domain.com/path1", false],
      ["https://myhost/path1/path2", false],
      ["ftp://myhost", false],
      ["//myhost", false],
      ["mailto:firstname.lastname@mycompany.com", false],
      ["tel:+49 123 456789", false],
      ["simplestring", false],
      ["www.domain.com", false],
      ["/content/site1/page1", true],
      ["/content/dam/sample.jpg", true],
      ["/ns1:this/is/ns2:a/path", true]
    ])('should validate "%s" as %s', (value, isValid) => {
      validate('wcmio.path', value, isValid, "Please enter a valid content path.");
    });
  });

  describe('wcmio.pattern', () => {
    test.each([
        ["abc", "^ab.*$", true],
        ["def", "^ab.*$", false]
    ])('should validate "%s" as %s', (value, pattern, isValid) => {
      validate('wcmio.pattern', value, isValid, "Invalid.", {
        'data-wcmio-pattern': pattern,
        'data-wcmio-patternmessage': "Invalid."
      });
    });
  });
});

