/**
 * @jest-environment jsdom
 */

require('@testing-library/jest-dom');
const matchers = require('@testing-library/jest-dom/matchers');
expect.extend({
    'toBeHidden': function (el) {
        return matchers.toHaveClass.call(this, el, 'hide wcmio-dialog-showhide-status-hide');
    },
    'toBeHiddenInherited': function(el) {
        const hidden = el.closest('.hide.wcmio-dialog-showhide-status-hide');
        return matchers.expect(hidden).toBeTrue();
    },
    'toBeFoundationValid': function(el) {
        return matchers.toHaveAttribute.call(this, el, 'data-valid', 'true');
    },
    'toHaveFoundationValidationMessage': function(el, message) {
        return message
            ? matchers.toHaveAttribute.call(this, el, 'data-validation-message', message)
            : matchers.toHaveAttribute.call(this, el, 'data-validation-message');
    }
});

window.$ = require('jquery');

require('../mocks/coral/commons')(window);
require('../mocks/granite/ui')(window, $);
require('../mocks/foundation/validation')(window, $);
require('../../../main/webapp/app-root/clientlibs/io.wcm.ui.granite.showhidedialogfields/js/showhide.js');

$(window).adaptTo('foundation-registry').register('foundation.validation.validator', {
    selector: "[data-foundation-validation~=simple-attribute]",
    validate: function (el) {
        return $(el).attr('data-simple-attribute') === 'true'
            ? undefined
            : 'Attribute was not "true"';
    }
});

const triggerContentLoaded = (selector = '#dialog') => {
    $(selector).trigger("foundation-contentloaded");
};

describe('dialog-showhide', () => {
    describe('General', () => {
        let logSpy = jest.spyOn(console, 'error');
        beforeEach(() => {
            logSpy.mockClear();
        });

        it('Show/hide target missing', () => {
            document.body.innerHTML = `
            <div id="dialog">
                <coral-checkbox class="wcmio-dialog-showhide" id="target-missing">
                    <input/>
                </coral-checkbox>
            </div>`;
            triggerContentLoaded();
            expect(logSpy).toHaveBeenCalledWith('Missing data-wcmio-dialog-showhide-target attribute on [object HTMLElement].');
        });

        it('Show/hide parent', () => {
            document.body.innerHTML = `
            <div id="dialog">
                <div class="content">
                    <coral-checkbox class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".target" data-wcmio-dialog-showhide-parent=".content" id="target-missing">
                        <input/>
                    </coral-checkbox>
                    <div class="target"></div>
                </div>
                <div class="other-content">
                    <div class="target"></div>            
                </div>
            </div>`;
            triggerContentLoaded();
            expect(document.querySelector('.content .target')).toBeHidden();
            expect(document.querySelector('.other-content .target')).not.toBeHidden();
        });

        it('Targets field wrapper if applicable', () => {
            document.body.innerHTML = `
            <div id="dialog">
                <coral-checkbox class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".target" data-wcmio-dialog-showhide-parent=".content" id="target-missing">
                    <input/>
                </coral-checkbox>
                <div class="coral-Form-fieldwrapper">
                    <div class="target" data-showhidetargetvalue="false">
                        <input data-foundation-validation="simple-attribute" aria-required="true"/>
                    </div>
                </div>
            </div>
            `;
            triggerContentLoaded();
            expect(document.querySelector('.coral-Form-fieldwrapper')).toBeHidden();
            expect(document.querySelector('.coral-Form-fieldwrapper .target')).not.toBeHidden();
            expect(document.querySelector('.coral-Form-fieldwrapper .target input')).not.toBeRequired();
            expect(document.querySelector('.coral-Form-fieldwrapper .target input')).toBeFoundationValid();
        });

        it('Targets tab as well as tab content if applicable', () => {
            document.body.innerHTML = `
            <div id="dialog">
                <coral-checkbox class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".target">
                    <input/>
                </coral-checkbox>
                <coral-tabview>
                    <coral-tablist>
                        <coral-tab id="label1"></coral-tab>
                        <coral-tab id="label2"></coral-tab>
                    </coral-tablist>
                    <coral-panelstack>
                        <coral-panel aria-labelledby="label1">
                            <coral-panel-content>
                                <div class="target" data-showhidetargetvalue="true"></div>
                            </coral-panel-content>
                        </coral-panel>
                        <coral-panel aria-labelledby="label2">
                            <coral-panel-content>
                                <div class="target" data-showhidetargetvalue="false"></div>
                            </coral-panel-content>
                        </coral-panel>
                    </coral-panelstack>
                </coral-tabview>
            </div>
            `;
            const checkbox = document.querySelector('coral-checkbox');
            checkbox.value = 'true';
            checkbox.checked = true;
            const targets = document.querySelectorAll('.target');
            const tabs = document.querySelectorAll('coral-tab');
            triggerContentLoaded();
            expect(targets[0]).not.toBeHidden();
            expect(targets[1]).toBeHidden();
            expect(tabs[0]).not.toBeHidden();
            expect(tabs[1]).toBeHidden();
            checkbox.value = 'false';
            $(checkbox).trigger('change');
            expect(targets[0]).toBeHidden();
            expect(targets[1]).not.toBeHidden();
            expect(tabs[0]).toBeHidden();
            expect(tabs[1]).not.toBeHidden();
        });

        it('Does not execute validation logic if target is already hidden', () => {
            document.body.innerHTML = `
            <div id="dialog">
                <coral-checkbox class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".target" data-wcmio-dialog-showhide-parent=".content">
                    <input/>
                </coral-checkbox>
                <div class="coral-Form-fieldwrapper wcmio-dialog-showhide-status-hide target">
                    <div id="test" data-showhidetargetvalue="false" data-foundation-validation="simple-attribute"></div>
                </div>
            </div>
            `;
            triggerContentLoaded();
            // Should not be hidden by wcmio-dialog-showhide
            expect(document.querySelector('#test')).not.toBeHidden();
            // Should not have validation triggered
            expect(document.querySelector('#test')).not.toHaveAttribute('data-valid');
        });
    });

    describe('Select', () => {
        function setSelected(select, ...values) {
            $(select).children('coral-select-item').each(function (index, element) {
                values.includes($(element).attr('value'))
                    ? $(element).attr('selected', '')
                    : $(element).removeAttr('selected');
            });
        }

        let select;
        let targetElement1;
        let targetElement2;
        let targetElement3;
        let targetElement4;

        beforeEach(() => {
            document.body.innerHTML = `
            <div id="dialog">
                <coral-select class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".select-target">
                    <coral-select-item value="1">1</coral-select-item>
                    <coral-select-item value="2">2</coral-select-item>
                    <coral-select-item value="3">3</coral-select-item>
                    <coral-select-item value="4">4</coral-select-item>
                </coral-select>
                <div class="select-target" id="select-target-1" data-showhidetargetvalue="1"><input id="input-1" type="text"/></div>
                <div class="select-target" id="select-target-2" data-showhidetargetvalue="2"><input id="input-2" type="text"/></div>
                <div class="select-target" id="select-target-3" data-showhidetargetvalue="3"><input id="input-3" type="text" aria-required="true" data-foundation-validation="simple-attribute" data-simple-attribute="true"/></div>
                <div class="select-target" id="select-target-4" data-showhidetargetvalues="3,4"><input id="input-4" type="text" aria-required="true" data-foundation-validation="simple-attribute" data-simple-attribute="false"/></div>
            </div>
            `;
            select = document.querySelector('coral-select');
            targetElement1 = document.querySelector('#select-target-1');
            targetElement2 = document.querySelector('#select-target-2');
            targetElement3 = document.querySelector('#select-target-3');
            targetElement4 = document.querySelector('#select-target-4');
        });

        it('Load', () => {
            setSelected(select, '1');
            triggerContentLoaded();
            expect(targetElement1).not.toBeHidden();
            expect(targetElement2).toBeHidden();
            expect(targetElement3).toBeHidden();
            expect(targetElement4).toBeHidden();
            expect(targetElement3.querySelector('input')).not.toBeRequired();
            expect(targetElement3.querySelector('input')).toBeFoundationValid();
            expect(targetElement3.querySelector('input')).not.toHaveFoundationValidationMessage();
            expect(targetElement4.querySelector('input')).not.toBeRequired();
            expect(targetElement4.querySelector('input')).toBeFoundationValid();
            expect(targetElement4.querySelector('input')).not.toHaveFoundationValidationMessage();
        });

        it('Change', () => {
            setSelected(select, '1');
            triggerContentLoaded();
            setSelected(select, '2', '4');
            $(select).trigger('change');
            expect(targetElement1).toBeHidden();
            expect(targetElement2).not.toBeHidden();
            expect(targetElement3).toBeHidden();
            expect(targetElement4).not.toBeHidden();
            expect(targetElement3.querySelector('input')).not.toBeRequired();
            expect(targetElement3.querySelector('input')).toBeFoundationValid();
            expect(targetElement3.querySelector('input')).not.toHaveFoundationValidationMessage();
            expect(targetElement4.querySelector('input')).toBeRequired();
            expect(targetElement4.querySelector('input')).not.toBeFoundationValid();
            expect(targetElement4.querySelector('input')).toHaveFoundationValidationMessage('Attribute was not "true"');
        });
    });

    describe('Checkbox', () => {
        let checkbox;
        let targetElement1;
        let targetElement2;
        beforeEach(() => {
            document.body.innerHTML = `
            <div id="dialog">
                <coral-checkbox class="wcmio-dialog-showhide" data-wcmio-dialog-showhide-target=".checkbox-target">
                    <input type="checkbox" value="true"/>
                </coral-checkbox>
                <div class="checkbox-target" id="checkbox-target-1" data-showhidetargetvalue="true"><input id="input-1" type="text"/></div>
                <div class="checkbox-target" id="checkbox-target-2" data-showhidetargetvalue=""><input id="input-2" type="text"/></div>
            </div>
            `;
            checkbox = document.querySelector('coral-checkbox');
            checkbox.value = 'true';
            targetElement1 = document.querySelector('#checkbox-target-1');
            targetElement2 = document.querySelector('#checkbox-target-2');
        });

        it('Load', () => {
            checkbox.checked = false;
            checkbox.querySelector('input').checked = false;
            triggerContentLoaded();
            expect(targetElement1).toBeHidden();
            expect(targetElement2).toBeHidden();
        });

        it('Change', () => {
            triggerContentLoaded();
            checkbox.checked = true;
            checkbox.querySelector('input').checked = true;
            $(checkbox).trigger('change');
            expect(targetElement1).not.toBeHidden();
            expect(targetElement2).toBeHidden();
        });
    });
});