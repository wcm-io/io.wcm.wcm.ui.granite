module.exports = function(window, $) {
    window.Granite = window.Granite || {};
    window.Granite.$ = $;
    window.Granite.UI = {
        Foundation: {
            Utils: {}
        }
    };

    const registryItems = new Map;
    window.Granite.UI.Foundation.Registry = {
        register: function (d, c) {
            registryItems.has(d) ? registryItems.get(d).push(c) : registryItems.set(d, [c]);
        },
        get: function (d) {
            return registryItems.has(d) ? registryItems.get(d) : []
        }
    };
    window.Granite.UI.Foundation.Registry.register("foundation.adapters", {
        type: "foundation-registry",
        selector: $(window),
        adapter: function () {
            return window.Granite.UI.Foundation.Registry;
        }
    });

    window.Granite.UI.Foundation.Adapters = function () {
        const registry = window.Granite.UI.Foundation.Registry;
        const adapters = function() {
            return registry.get("foundation.adapters");
        };
        return {
            register: function(type, selector, adapter) {
                registry.register("foundation.adapters", {
                    type: type,
                    selector: selector,
                    adapter: adapter
                });
            },

            has: function(type) {
                return adapters().some(function(config) {
                    return config.type === type;
                });
            },

            get: function(type) {
                return adapters()
                    .filter(config => config.type === type);
            },

            adapt: function(object, type) {
                if (object && type) {
                    const $el = $(object);
                    const items = adapters();
                    for (let i = items.length - 1; i >= 0; i--) {
                        const adapter = items[i];
                        if (adapter.type === type && $el.is(adapter.selector)) {
                            return adapter.adapter(object);
                        }
                    }
                }
            }
        };
    }();
    $.fn.adaptTo = $.fn.adaptTo || function (adapterName) {
        return window.Granite.UI.Foundation.Adapters.adapt(this[0], adapterName);
    };
};