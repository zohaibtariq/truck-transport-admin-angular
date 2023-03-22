"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAriaAttributeKeys = void 0;
let ariaAttributeKeys = null;
function getAriaAttributeKeys() {
    return (ariaAttributeKeys !== null && ariaAttributeKeys !== void 0 ? ariaAttributeKeys : (ariaAttributeKeys = new Set([
        // Source: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques
        'aria-activedescendant',
        'aria-atomic',
        'aria-autocomplete',
        'aria-busy',
        'aria-checked',
        'aria-colcount',
        'aria-colindex',
        'aria-colspan',
        'aria-controls',
        'aria-current',
        'aria-describedby',
        'aria-details',
        'aria-disabled',
        'aria-dragged',
        'aria-dropeffect',
        'aria-errormessage',
        'aria-expanded',
        'aria-flowto',
        'aria-haspopup',
        'aria-hidden',
        'aria-invalid',
        'aria-label',
        'aria-labelledby',
        'aria-level',
        'aria-live',
        'aria-modal',
        'aria-multiline',
        'aria-multiselectable',
        'aria-orientation',
        'aria-owns',
        'aria-placeholder',
        'aria-posinset',
        'aria-pressed',
        'aria-readonly',
        'aria-relevant',
        'aria-required',
        'aria-rowcount',
        'aria-rowindex',
        'aria-rowspan',
        'aria-selected',
        'aria-setsize',
        'aria-sort',
        'aria-valuemax',
        'aria-valuemin',
        'aria-valuenow',
        'aria-valuetext',
    ])));
}
exports.getAriaAttributeKeys = getAriaAttributeKeys;
