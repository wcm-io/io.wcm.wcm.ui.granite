/**
 * @jest-environment jsdom
 */
describe('io.wcm.ui.granite.validation', () => {
  let validators;

  beforeAll(() => {
    // Mock Granite and capture registered validators
    validators = {};
    window.Granite = {
      $: (obj) => ({
        adaptTo: (to) => {
          if (to === 'foundation-registry') {
            return {
              register: (name, validator) => {
                validators[validator.selector] = validator.validate;
              }
            };
          }
        },
        val: () => obj.value,
        attr: (param) => obj[param]
      }),
      I18n: {
        get: (arg) => arg
      }
    };
    require('../../../main/webapp/app-root/clientlibs/io.wcm.ui.granite.validation/js/validation.js');
  });

  describe('wcmio.email', () => {
    let validate;
    beforeAll(() => {
      validate = validators['[data-foundation-validation~="wcmio.email"]'];
    });

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
      const result = validate({ value });
      expectValidationResult(result, isValid, "Please enter a valid email address.");
    });
  });

  describe('wcmio.url', () => {
    let validate;
    beforeAll(() => {
      validate = validators['[data-foundation-validation~="wcmio.url"]'];
    });

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
      const result = validate({ value });
      expectValidationResult(result, isValid, "Please enter a valid URL.");
    });
  });

  describe('wcmio.path', () => {
    let validate;
    beforeAll(() => {
      validate = validators['[data-foundation-validation~="wcmio.path"]'];
    });

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
      const result = validate({ value });
      expectValidationResult(result, isValid, "Please enter a valid content path.");
    });
  });

  describe('wcmio.pattern', () => {
    let validate;
    beforeAll(() => {
      validate = validators['[data-foundation-validation~="wcmio.pattern"]'];
    });

    test('matches pattern', () => {
      const result = validate({
        value: "abc",
        "data-wcmio-pattern": "^ab.*$",
        "data-wcmio-patternmessage": "Invalid."
      });
      expectValidationResult(result, true);
    });

    test('does not match pattern', () => {
      const result = validate({
        value: "def",
        "data-wcmio-pattern": "^ab.*$",
        "data-wcmio-patternmessage": "Invalid."
      });
      expectValidationResult(result, false, "Invalid.");
    });
  });
});

/**
 * Helper to check validation result.
 * If isValid is true, expects result to be null or undefined.
 * If isValid is false, expects result to be a string and optionally matches expectedMessage.
 */
function expectValidationResult(result, isValid, expectedMessage) {
  if (isValid) {
    expect(result === null || result === undefined).toBe(true);
  } else {
    expect(typeof result).toBe('string');
    if (expectedMessage !== undefined) {
      expect(result).toBe(expectedMessage);
    }
  }
}
