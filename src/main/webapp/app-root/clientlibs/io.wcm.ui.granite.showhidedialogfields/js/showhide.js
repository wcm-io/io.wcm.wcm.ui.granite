/**
 * Extension to the standard dropdown/select and checkbox components. It enables hidding/unhidding of other components
 * based on the selection made in the dropdown/select or the checkbox state.
 *
 * Usage:
 * - Add the class wcmio-dialog-showhide to the dropdown/select or checkbox element
 * - Add the data attribute wcmio-dialog-showhide-target to the element.
 *   The value should be a selector, usually a specific class name (the target class),
 *   to find all possible target elements that can be shown/hidden.
 * - Add the target class to each target component that can be shown/hidden
 * - Add the class hidden to each target component to make them initially hidden
 * - Add the data attribute showhidetargetvalue to each target component, the value should equal the value of the select
 *   option that will unhide this element. In case of a checkbox use "true" or "false" for checkbox state.
 * - Alternatively, you can add the data attribute showhidetargetvalues to a target component to show
 *   it for a comma-separated list of target values.
 * - When desired, showhidetargetnot can be used to invert the check, allowing the use of a list of values that cause
 *   the field to be hidden instead of shown.
 *
 * To ensure the show/hide features is applied only to a certain group of elements in the edit dialog,
 * when it cannot be ensured that the CSS class is unique across the whole dialog (e.g. in multi fields):
 * - Add the data attribute wcmio-dialog-showhide-parent to the dropdown/select element, value should be
 *   a selector that identifies a common parent element. Only dialog fields that are children of that element
 *   (e.g. a container) will be processed.
 *
 * This only supports Coral UI 3.
 */
(function(document, $) {
  "use strict";

  // when a dialog gets injected
  $(document).on("foundation-contentloaded", function (e) {
    // if there is already an inital value make sure the according target element becomes visible
    showHideHandler($(".wcmio-dialog-showhide", e.target));
  });

  function showHideHandler(el) {
    el.each(function (i, element) {
      Coral.commons.ready(element, function (component) {
        showHide(component, element);
        $(component).on("change", function() {
          showHide(component, element);
        });
      });
    });
  }

  function includesCommaSeparated(valuesString, values) {
    if (valuesString) {
      return valuesString.split(",").find(item => values.includes(item)) != undefined;
    }
    return false
  }

  function showHide(component, element) {
    // get the selector to find the target elements.
    var $element = $(element);
    var target = $element.data("wcmioDialogShowhideTarget");
    if (!target) {
      console.error('Missing data-wcmio-dialog-showhide-target attribute on ' + element + '.');
      return;
    }

    // Check if this show/hide handler is itself within a hidden context
    // If so, all its targets should be treated as hidden regardless of its own logic
    var isHandlerHidden = $element.closest('.hide.wcmio-dialog-showhide-status-hide').length > 0;

    // optional: get the selector to find the comment parent element
    var parentSelector = $element.data("wcmioDialogShowhideParent");

    // check if all elements in the dialog, or only those that whare the same parent should be processed
    var $target;
    var $parent = [];
    if (parentSelector) {
      $parent = $element.parents(parentSelector);
    }
    if ($parent.length > 0) {
      $target = $(target, $parent);
    } else {
      $target = $(target);
    }

    var values = [];
    if ($element.is("coral-checkbox") && typeof component.checked !== "undefined") {
      component.checked && values.push(component.value);
    } else if ($element.is("coral-radio") && typeof component.checked !== "undefined") {
      component.checked && values.push($element.attr("value"));
    } else if ($element.is("[role=radiogroup]")) {
      $element.children("coral-radio[checked]").each(function (i, el) {
        var value = $(el).attr("value") || ""
        values.push(value);
      });
    } else if ($element.is("coral-select")) {
      $element.children("coral-select-item[selected]").each(function (index, el) {
        var value = $(el).attr("value") || ""
        values.push(value);
      });
    } else if (typeof component.value !== "undefined") {
      values.push(component.value);
    } else {
      console.error('Unsupported component', component, 'and element', element);
    }

    $target.each(function (index, element) {
      // make sure all unselected target elements are hidden.
      // unhide the target element that contains the selected value as data-showhidetargetvalue attribute
      var targetValueIsContained = !!(values.includes(element.dataset.showhidetargetvalue)
          || includesCommaSeparated(element.dataset.showhidetargetvalues, values));
      var not = element.dataset.showhidetargetnot === 'true';
      var show = element && targetValueIsContained !== not;
      
      // If the handler itself is hidden, force all targets to be hidden
      if (isHandlerHidden) {
        show = false;
      }
      
      setVisibilityAndHandleFieldValidation($(element), show);
    });
  }

  /**
   * Shows or hides an element based on parameter "show" and toggles validations if needed. If element
   * is being shown, all VISIBLE fields inside it whose validation is false would be changed to set the validation
   * to true. If element is being hidden, all fields inside it whose validation is true would be changed to
   * set validation to false.
   *
   * @param {jQuery} $element Element to show or hide.
   * @param {Boolean} show <code>true</code> to show the element.
   */
  function setVisibilityAndHandleFieldValidation($element, show) {

    // if target element is part of a field wrapper, target the wrapper instead
    var $fieldWrapperParent = $element.parent(".coral-Form-fieldwrapper");
    if ($fieldWrapperParent.length > 0) {
      $element = $fieldWrapperParent;
    }
    // if target element is part of a coral-panel, target also the coral-tab
    var $parent = $element.parent();
    if ($parent.is("coral-panel-content")) {
      $element = $element.add($('#' + $parent.parent().attr('aria-labelledby')));
    }

    toggleHiddenInput($element, show);

    if (show) {
      $element.removeClass("hide");
      $element.removeClass("wcmio-dialog-showhide-status-hide");
      filterElementsExcludingNestedShowHide($element, "[data-validation]:not([data-validation='']), [data-foundation-validation]:not([data-foundation-validation='']), [data-was-validation], [data-was-foundation-validation], [aria-required], [data-was-aria-required], foundation-autocomplete")
          .filter(":not(input[role=combobox])") // Input belonging to foundation-autocomplete
          .filter(":not(.hide>input)")
          .filter(":not(input.hide)")
          .filter(":not(.hide>textarea)")
          .filter(":not(textarea.hide)")
          .filter(":not(.hide>coral-multifield)")
          .filter(":not(input.coral-multifield)")
          .each(function (index, field) {
            toggleValidation($(field), true);
          });
    } else {
      $element.addClass("hide");
      filterElementsExcludingNestedShowHide($element, "[data-validation]:not([data-validation='']), [data-foundation-validation]:not([data-foundation-validation='']), [data-was-validation], [data-was-foundation-validation], [aria-required], [data-was-aria-required], foundation-autocomplete")
          .filter(":not(input[role=combobox])") // Input belonging to foundation-autocomplete
          .each(function (index, field) {
            toggleValidation($(field), false);
          });
      $element.addClass("wcmio-dialog-showhide-status-hide");
    }

    // Trigger re-evaluation of nested show/hide handlers when context visibility changes
    $element.find('.wcmio-dialog-showhide').each(function() {
      var $nestedHandler = $(this);
      var nestedComponent = $nestedHandler[0];
      showHide(nestedComponent, nestedComponent);
    });
  }

  function toggleHiddenInput($element, show) {
    if (show) {
      filterElementsExcludingNestedShowHide($element, "input:hidden[data-was-hidden]")
        .each(function (index, field) {
          var $field = $(field);
          $field.removeAttr("data-was-hidden");
          $field.removeAttr("disabled");
        });
      if ($element.attr("type") === "hidden" && $element.attr("data-was-hidden") !== undefined) {
        $element.removeAttr("data-was-hidden");
        $element.removeAttr("disabled");
      }
    } else {
      filterElementsExcludingNestedShowHide($element, "input:hidden")
        .filter(":not([data-was-hidden])")
        .filter(":not([disabled])")
        .filter(":not([name$='@Delete'])")
        .each(function (index, field) {
          var $field = $(field);
          $field.attr("data-was-hidden", true);
          $field.attr("disabled", true);
        });
      if ($element.attr("type") === "hidden" && $element.attr("disabled") === undefined &&
        $element.attr("name") !== undefined && !$element.attr("name").endsWith("@Delete")) {
        $element.attr("data-was-hidden", true);
        $element.attr("disabled", true);
      }
    }
  }

  /**
   * If the form element is not shown we have to disable the required validation for that field.
   *
   * @param {jQuery} $field To disable / enable required validation.
   * @param {boolean} show Should the field be shown or hidden?
   */
  function toggleValidation($field, show) {
    [
      {
        name: 'data-validation',
        tempName: 'data-was-validation'
      },
      {
        name: 'data-foundation-validation',
        tempName: 'data-was-foundation-validation'
      },
      {
        name: 'aria-required',
        tempName: 'data-was-aria-required'
      }
    ].forEach(function(obj) {
      var attributeName = show ? obj.tempName : obj.name;
      var value = $field.attr(attributeName);
      $field.removeAttr(attributeName);
      if (value) {
        $field.attr(show ? obj.name : obj.tempName, value);
      }
    });
    if ($field.is("foundation-autocomplete")) {
      var required = $field.prop("required");
      var wasRequired = $field.attr("data-was-required");
      if (!wasRequired) {
        $field.attr("data-was-required", required);
        wasRequired = String(required);
      }
      if (wasRequired === 'true') {
        $field.prop('required', show);
      }
    }
  }

  /**
   * Filters elements within the given parent element, excluding those that belong to nested show/hide handlers.
   * This prevents conflicts when show/hide handlers are nested inside each other.
   *
   * @param {jQuery} $parent Parent element to search within.
   * @param {String} selector CSS selector to find elements.
   * @returns {jQuery} Filtered jQuery object containing only elements not controlled by nested handlers.
   */
  function filterElementsExcludingNestedShowHide($parent, selector) {
    var $allElements = $parent.find(selector);
    var $filteredElements = $();

    // Find all nested show/hide control elements within the parent
    var $nestedShowHideElements = $parent.find('.wcmio-dialog-showhide');

    $allElements.each(function() {
      var $element = $(this);
      var belongsToNestedHandler = false;

      // Check if this element is controlled by any nested show/hide handler
      $nestedShowHideElements.each(function() {
        var $nestedControl = $(this);
        var nestedTarget = $nestedControl.data("wcmioDialogShowhideTarget");
        
        if (nestedTarget) {
          // Check if the element is within the scope of this nested handler's target
          var $nestedTargets = $(nestedTarget);
          $nestedTargets.each(function() {
            if ($(this).find($element).length > 0 || $(this).is($element)) {
              belongsToNestedHandler = true;
              return false; // Break out of loop
            }
          });
          
          if (belongsToNestedHandler) {
            return false; // Break out of outer loop
          }
        }
      });

      // Only include elements that don't belong to nested handlers
      if (!belongsToNestedHandler) {
        $filteredElements = $filteredElements.add($element);
      }
    });

    return $filteredElements;
  }

})(document, Granite.$);
