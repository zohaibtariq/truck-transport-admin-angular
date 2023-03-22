/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { animate, state, style, transition, trigger, } from '@angular/animations';
/** Time and timing curve for expansion panel animations. */
// Note: Keep this in sync with the Sass variable for the panel header animation.
export const EXPANSION_PANEL_ANIMATION_TIMING = '225ms cubic-bezier(0.4,0.0,0.2,1)';
/**
 * Animations used by the Material expansion panel.
 *
 * A bug in angular animation's `state` when ViewContainers are moved using ViewContainerRef.move()
 * causes the animation state of moved components to become `void` upon exit, and not update again
 * upon reentry into the DOM.  This can lead a to situation for the expansion panel where the state
 * of the panel is `expanded` or `collapsed` but the animation state is `void`.
 *
 * To correctly handle animating to the next state, we animate between `void` and `collapsed` which
 * are defined to have the same styles. Since angular animates from the current styles to the
 * destination state's style definition, in situations where we are moving from `void`'s styles to
 * `collapsed` this acts a noop since no style values change.
 *
 * In the case where angular's animation state is out of sync with the expansion panel's state, the
 * expansion panel being `expanded` and angular animations being `void`, the animation from the
 * `expanded`'s effective styles (though in a `void` animation state) to the collapsed state will
 * occur as expected.
 *
 * Angular Bug: https://github.com/angular/angular/issues/18847
 *
 * @docs-private
 */
export const matExpansionAnimations = {
    /** Animation that rotates the indicator arrow. */
    indicatorRotate: trigger('indicatorRotate', [
        state('collapsed, void', style({ transform: 'rotate(0deg)' })),
        state('expanded', style({ transform: 'rotate(180deg)' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
    /** Animation that expands and collapses the panel content. */
    bodyExpansion: trigger('bodyExpansion', [
        state('collapsed, void', style({ height: '0px', visibility: 'hidden' })),
        state('expanded', style({ height: '*', visibility: 'visible' })),
        transition('expanded <=> collapsed, void => collapsed', animate(EXPANSION_PANEL_ANIMATION_TIMING)),
    ]),
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5zaW9uLWFuaW1hdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvZXhwYW5zaW9uL2V4cGFuc2lvbi1hbmltYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFDTCxPQUFPLEVBRVAsS0FBSyxFQUNMLEtBQUssRUFDTCxVQUFVLEVBQ1YsT0FBTyxHQUNSLE1BQU0scUJBQXFCLENBQUM7QUFFN0IsNERBQTREO0FBQzVELGlGQUFpRjtBQUNqRixNQUFNLENBQUMsTUFBTSxnQ0FBZ0MsR0FBRyxtQ0FBbUMsQ0FBQztBQUVwRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sc0JBQXNCLEdBRy9CO0lBQ0Ysa0RBQWtEO0lBQ2xELGVBQWUsRUFBRSxPQUFPLENBQUMsaUJBQWlCLEVBQUU7UUFDMUMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLEVBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFDLENBQUMsQ0FBQztRQUN2RCxVQUFVLENBQ1IsMkNBQTJDLEVBQzNDLE9BQU8sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUMxQztLQUNGLENBQUM7SUFDRiw4REFBOEQ7SUFDOUQsYUFBYSxFQUFFLE9BQU8sQ0FBQyxlQUFlLEVBQUU7UUFDdEMsS0FBSyxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7UUFDdEUsS0FBSyxDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUMsQ0FBQyxDQUFDO1FBQzlELFVBQVUsQ0FDUiwyQ0FBMkMsRUFDM0MsT0FBTyxDQUFDLGdDQUFnQyxDQUFDLENBQzFDO0tBQ0YsQ0FBQztDQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7XG4gIGFuaW1hdGUsXG4gIEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YSxcbiAgc3RhdGUsXG4gIHN0eWxlLFxuICB0cmFuc2l0aW9uLFxuICB0cmlnZ2VyLFxufSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcblxuLyoqIFRpbWUgYW5kIHRpbWluZyBjdXJ2ZSBmb3IgZXhwYW5zaW9uIHBhbmVsIGFuaW1hdGlvbnMuICovXG4vLyBOb3RlOiBLZWVwIHRoaXMgaW4gc3luYyB3aXRoIHRoZSBTYXNzIHZhcmlhYmxlIGZvciB0aGUgcGFuZWwgaGVhZGVyIGFuaW1hdGlvbi5cbmV4cG9ydCBjb25zdCBFWFBBTlNJT05fUEFORUxfQU5JTUFUSU9OX1RJTUlORyA9ICcyMjVtcyBjdWJpYy1iZXppZXIoMC40LDAuMCwwLjIsMSknO1xuXG4vKipcbiAqIEFuaW1hdGlvbnMgdXNlZCBieSB0aGUgTWF0ZXJpYWwgZXhwYW5zaW9uIHBhbmVsLlxuICpcbiAqIEEgYnVnIGluIGFuZ3VsYXIgYW5pbWF0aW9uJ3MgYHN0YXRlYCB3aGVuIFZpZXdDb250YWluZXJzIGFyZSBtb3ZlZCB1c2luZyBWaWV3Q29udGFpbmVyUmVmLm1vdmUoKVxuICogY2F1c2VzIHRoZSBhbmltYXRpb24gc3RhdGUgb2YgbW92ZWQgY29tcG9uZW50cyB0byBiZWNvbWUgYHZvaWRgIHVwb24gZXhpdCwgYW5kIG5vdCB1cGRhdGUgYWdhaW5cbiAqIHVwb24gcmVlbnRyeSBpbnRvIHRoZSBET00uICBUaGlzIGNhbiBsZWFkIGEgdG8gc2l0dWF0aW9uIGZvciB0aGUgZXhwYW5zaW9uIHBhbmVsIHdoZXJlIHRoZSBzdGF0ZVxuICogb2YgdGhlIHBhbmVsIGlzIGBleHBhbmRlZGAgb3IgYGNvbGxhcHNlZGAgYnV0IHRoZSBhbmltYXRpb24gc3RhdGUgaXMgYHZvaWRgLlxuICpcbiAqIFRvIGNvcnJlY3RseSBoYW5kbGUgYW5pbWF0aW5nIHRvIHRoZSBuZXh0IHN0YXRlLCB3ZSBhbmltYXRlIGJldHdlZW4gYHZvaWRgIGFuZCBgY29sbGFwc2VkYCB3aGljaFxuICogYXJlIGRlZmluZWQgdG8gaGF2ZSB0aGUgc2FtZSBzdHlsZXMuIFNpbmNlIGFuZ3VsYXIgYW5pbWF0ZXMgZnJvbSB0aGUgY3VycmVudCBzdHlsZXMgdG8gdGhlXG4gKiBkZXN0aW5hdGlvbiBzdGF0ZSdzIHN0eWxlIGRlZmluaXRpb24sIGluIHNpdHVhdGlvbnMgd2hlcmUgd2UgYXJlIG1vdmluZyBmcm9tIGB2b2lkYCdzIHN0eWxlcyB0b1xuICogYGNvbGxhcHNlZGAgdGhpcyBhY3RzIGEgbm9vcCBzaW5jZSBubyBzdHlsZSB2YWx1ZXMgY2hhbmdlLlxuICpcbiAqIEluIHRoZSBjYXNlIHdoZXJlIGFuZ3VsYXIncyBhbmltYXRpb24gc3RhdGUgaXMgb3V0IG9mIHN5bmMgd2l0aCB0aGUgZXhwYW5zaW9uIHBhbmVsJ3Mgc3RhdGUsIHRoZVxuICogZXhwYW5zaW9uIHBhbmVsIGJlaW5nIGBleHBhbmRlZGAgYW5kIGFuZ3VsYXIgYW5pbWF0aW9ucyBiZWluZyBgdm9pZGAsIHRoZSBhbmltYXRpb24gZnJvbSB0aGVcbiAqIGBleHBhbmRlZGAncyBlZmZlY3RpdmUgc3R5bGVzICh0aG91Z2ggaW4gYSBgdm9pZGAgYW5pbWF0aW9uIHN0YXRlKSB0byB0aGUgY29sbGFwc2VkIHN0YXRlIHdpbGxcbiAqIG9jY3VyIGFzIGV4cGVjdGVkLlxuICpcbiAqIEFuZ3VsYXIgQnVnOiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xODg0N1xuICpcbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdEV4cGFuc2lvbkFuaW1hdGlvbnM6IHtcbiAgcmVhZG9ubHkgaW5kaWNhdG9yUm90YXRlOiBBbmltYXRpb25UcmlnZ2VyTWV0YWRhdGE7XG4gIHJlYWRvbmx5IGJvZHlFeHBhbnNpb246IEFuaW1hdGlvblRyaWdnZXJNZXRhZGF0YTtcbn0gPSB7XG4gIC8qKiBBbmltYXRpb24gdGhhdCByb3RhdGVzIHRoZSBpbmRpY2F0b3IgYXJyb3cuICovXG4gIGluZGljYXRvclJvdGF0ZTogdHJpZ2dlcignaW5kaWNhdG9yUm90YXRlJywgW1xuICAgIHN0YXRlKCdjb2xsYXBzZWQsIHZvaWQnLCBzdHlsZSh7dHJhbnNmb3JtOiAncm90YXRlKDBkZWcpJ30pKSxcbiAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7dHJhbnNmb3JtOiAncm90YXRlKDE4MGRlZyknfSkpLFxuICAgIHRyYW5zaXRpb24oXG4gICAgICAnZXhwYW5kZWQgPD0+IGNvbGxhcHNlZCwgdm9pZCA9PiBjb2xsYXBzZWQnLFxuICAgICAgYW5pbWF0ZShFWFBBTlNJT05fUEFORUxfQU5JTUFUSU9OX1RJTUlORyksXG4gICAgKSxcbiAgXSksXG4gIC8qKiBBbmltYXRpb24gdGhhdCBleHBhbmRzIGFuZCBjb2xsYXBzZXMgdGhlIHBhbmVsIGNvbnRlbnQuICovXG4gIGJvZHlFeHBhbnNpb246IHRyaWdnZXIoJ2JvZHlFeHBhbnNpb24nLCBbXG4gICAgc3RhdGUoJ2NvbGxhcHNlZCwgdm9pZCcsIHN0eWxlKHtoZWlnaHQ6ICcwcHgnLCB2aXNpYmlsaXR5OiAnaGlkZGVuJ30pKSxcbiAgICBzdGF0ZSgnZXhwYW5kZWQnLCBzdHlsZSh7aGVpZ2h0OiAnKicsIHZpc2liaWxpdHk6ICd2aXNpYmxlJ30pKSxcbiAgICB0cmFuc2l0aW9uKFxuICAgICAgJ2V4cGFuZGVkIDw9PiBjb2xsYXBzZWQsIHZvaWQgPT4gY29sbGFwc2VkJyxcbiAgICAgIGFuaW1hdGUoRVhQQU5TSU9OX1BBTkVMX0FOSU1BVElPTl9USU1JTkcpLFxuICAgICksXG4gIF0pLFxufTtcbiJdfQ==