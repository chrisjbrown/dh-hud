import * as svelte_action from 'svelte/action';

/**
 * Provides an action to apply CSS style properties provided as an object.
 *
 * @param {HTMLElement} node - Target element
 *
 * @param {{ [key: string]: string | null }}  properties - Hyphen case CSS property key / value object of properties
 *        to set.
 *
 * @returns {import('svelte/action').ActionReturn<{ [key: string]: string | null }>} Lifecycle functions.
 */
declare function applyStyles(
  node: HTMLElement,
  properties: {
    [key: string]: string | null;
  },
): svelte_action.ActionReturn<{
  [key: string]: string | null;
}>;

export { applyStyles };
