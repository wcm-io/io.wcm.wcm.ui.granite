/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');
const matchers = require('@testing-library/jest-dom/matchers');
expect.extend({
    'toBeHidden': function (el) {
        return matchers.toHaveClass.call(this, el, 'hide wcmio-dialog-showhide-status-hide');
    }
});

window.$ = require('jquery');
window.$.fn.adaptTo = jest.fn();
window.Granite = {
    "$": $
};
window.Coral = {
    "commons": {
        "ready": function(el, callback) {
            callback(el);
        }
    }
}

// load validation script from clientlib
require('../../../main/webapp/app-root/clientlibs/io.wcm.ui.granite.showhidedialogfields/js/showhide.js');

function getMockValidationApi() {
    return {checkValidity: jest.fn(), updateUI: jest.fn()};
}

// assert validator implementation
describe('dialog-showhide', () => {
    function setSelected(select, ...values) {
        $(select).children('coral-select-item').each(function (index, element) {
            values.includes($(element).attr('value'))
                ? $(element).attr('selected', '')
                : $(element).removeAttr('selected');
        });
    }

    test('select', () => {
        document.body.innerHTML = `
            <coral-select class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".select-target">
                <coral-select-item value="1">1</coral-select-item>
                <coral-select-item value="2">2</coral-select-item>
                <coral-select-item value="3">3</coral-select-item>
                <coral-select-item value="4">4</coral-select-item>
            </coral-select>
            <div class="select-target" id="select-target-1" data-showhidetargetvalue="1"><input id="input-1" type="text"/></div>
            <div class="select-target" id="select-target-2" data-showhidetargetvalue="2"><input id="input-2" type="text"/></div>
            <div class="select-target" id="select-target-3" data-showhidetargetvalue="3"><input id="input-3" type="text" aria-required="true"/></div>
            <div class="select-target" id="select-target-4" data-showhidetargetvalues="3,4"><input id="input-4" type="text" aria-required="true"/></div>
            `;

        const select = document.querySelector('coral-select');
        const targetElement1 = document.querySelector('#select-target-1');
        const targetElement2 = document.querySelector('#select-target-2');
        const targetElement3 = document.querySelector('#select-target-3');
        const targetElement4 = document.querySelector('#select-target-4');
        const api1 = getMockValidationApi();
        const api2 = getMockValidationApi();
        window.$.fn.adaptTo.mockReturnValueOnce(api1).mockReturnValueOnce(api2);

        setSelected(select, '1');
        $(document.body).trigger("foundation-contentloaded");
        expect(targetElement1).not.toBeHidden();
        expect(targetElement2).toBeHidden();
        expect(targetElement3).toBeHidden();
        expect(targetElement4).toBeHidden();

        expect(window.$.fn.adaptTo.mock.calls.length).toBe(2);
        expect(window.$.fn.adaptTo.mock.calls[0][0]).toBe("foundation-validation");
        expect(window.$.fn.adaptTo.mock.calls[1][0]).toBe("foundation-validation");
        expect(window.$.fn.adaptTo.mock.instances.length).toBe(2);
        expect(window.$.fn.adaptTo.mock.instances[0][0].id).toBe(targetElement3.querySelector('input').id);
        expect(window.$.fn.adaptTo.mock.instances[1][0].id).toBe(targetElement4.querySelector('input').id);
        expect(api1.checkValidity).toHaveBeenCalled();
        expect(api1.updateUI).toHaveBeenCalled();
        expect(api2.checkValidity).toHaveBeenCalled();
        expect(api2.updateUI).toHaveBeenCalled();

        setSelected(select, '2', '4');
        $(select).trigger('change');
        expect(targetElement1).toBeHidden();
        expect(targetElement2).not.toBeHidden();
        expect(targetElement3).toBeHidden();
        expect(targetElement4).not.toBeHidden();

        expect(window.$.fn.adaptTo.mock.calls.length).toBe(3);
        expect(window.$.fn.adaptTo.mock.calls[2][0]).toBe("foundation-validation");
        expect(window.$.fn.adaptTo.mock.instances.length).toBe(3);
        expect(window.$.fn.adaptTo.mock.instances[2][0].id).toBe(targetElement4.querySelector('input').id);
    });

    test('checkbox', () => {
        document.body.innerHTML = `
            <coral-checkbox class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".checkbox-target">
                <input type="checkbox"/>
            </coral-checkbox>
            <div class="checkbox-target" id="checkbox-target-1" data-showhidetargetvalue="true"><input id="input-1" type="text"/></div>
            <div class="checkbox-target" id="checkbox-target-2" data-showhidetargetvalue="false"><input id="input-2" type="text"/></div>
            `;

        const checkbox = document.querySelector('coral-checkbox');
        checkbox.checked = false;
        const targetElement1 = document.querySelector('#checkbox-target-1');
        const targetElement2 = document.querySelector('#checkbox-target-2');
        const api1 = getMockValidationApi();
        const api2 = getMockValidationApi();
        window.$.fn.adaptTo.mockReturnValueOnce(api1).mockReturnValueOnce(api2);

        $(document.body).trigger("foundation-contentloaded");
        expect(targetElement1).toBeHidden();
        expect(targetElement2).not.toBeHidden();

        checkbox.checked = true;
        checkbox.querySelector('input').checked = true;
        $(checkbox).trigger('change');
        expect(targetElement1).not.toBeHidden();
        expect(targetElement2).toBeHidden();
    });
});