module.exports = function(window) {
    window.Granite.UI.Foundation.Registry.register("foundation.adapters", {
        type: "foundation-validation",
        selector: "*",
        adapter: function (el) {
            const $el = $(el);
            return {
                willValidate: function() {
                    return true
                },
                setCustomValidity: function(message) {
                    this.customMessage = message;
                },
                getValidity: function() {
                    const self = this;
                    return {
                        getCustomError: () => {
                            return !!self.customMessage;
                        },
                        isValid: () => {
                            return !self.customMessage && !self.message;
                        },
                        isValidated: () => {
                            return self.isValidated;
                        }
                    }
                },
                checkValidity: function(options = {}) {
                    if (!this.willValidate()) {
                        this.message = null;
                        this.customMessage = null;
                        this.isValidated = true;
                        !options.suppressEvent && $el.trigger("foundation-validation-valid");
                        return true;
                    }
                    this.isValidated = true;
                    if (this.customMessage) {
                        !options.suppressEvent && $el.trigger("foundation-validation-invalid");
                        return false;
                    }
                    this.message = null;
                    const validators = Granite.UI.Foundation.Registry.get("foundation.validation.validator");
                    this.message = validators
                        .filter(validator => $el.is(validator.selector))
                        .map(validator => validator.validate(el))
                        .find(message => message);
                    !options.suppressEvent && $el.trigger("foundation-validation-" + (this.message ? "invalid" : "valid"));
                    return !this.message;
                },
                getValidationMessage: function() {
                    return !this.willValidate() ? '' : this.customMessage || this.message || '';
                },
                updateUI: function() {
                    if ($el.data('foundationValidationUi') === 'none') {
                        return;
                    }
                    $el.attr('data-valid', this.getValidity().isValid().toString());
                    const message = this.getValidationMessage();
                    message
                        ? $el.attr('data-validation-message', message)
                        : $el.removeAttr('data-validation-message');
                }
            };
        }
    });
};