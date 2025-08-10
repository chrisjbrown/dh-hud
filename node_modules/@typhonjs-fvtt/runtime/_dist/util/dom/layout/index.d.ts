/**
 * Recursive function that finds the closest parent stacking context.
 * See also https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
 *
 * Original author: Kerry Liu / https://github.com/gwwar
 *
 * @see https://github.com/gwwar/z-context/blob/master/content-script.js
 * @see https://github.com/gwwar/z-context/blob/master/LICENSE
 *
 * @param {Element} node -
 *
 * @param {Window} [activeWindow=globalThis] The target active window as applicable.
 *
 * @returns {StackingContext | undefined} The closest parent stacking context or undefined if none.
 *
 */
declare function getStackingContext(node: Element, activeWindow?: Window): StackingContext | undefined;
type StackingContext = {
  /**
   * - A DOM Element.
   */
  node: Element;
  /**
   * - Reason for why a stacking context was created.
   */
  reason: string;
};

export { type StackingContext, getStackingContext };
