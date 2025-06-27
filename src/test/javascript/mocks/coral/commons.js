module.exports = function(window) {
    window.Coral = window.Coral || {};
    window.Coral.commons = {
        // Should ideally be a reference to the Coral components, instead
        TABBABLE_ELEMENT_SELECTOR: 'input:not([disabled]):not([tabindex="-1"]),select:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]):not([tabindex="-1"]),button:not([disabled]):not([tabindex="-1"]),a[href]:not([tabindex="-1"]),area[href]:not([tabindex="-1"]),summary:not([tabindex="-1"]),iframe:not([tabindex="-1"]),object:not([tabindex="-1"]),embed:not([tabindex="-1"]),audio[controls]:not([tabindex="-1"]),video[controls]:not([tabindex="-1"]),[contenteditable]:not([tabindex="-1"]),[tabindex]:not([tabindex="-1"])',
        ready: (field, callback) => {
            callback(field);
        }
    };
};
