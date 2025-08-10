import * as svelte_action from 'svelte/action';
import { Action } from 'svelte/action';

/**
 * Options for {@link dynamicAction}. Provide the hosted action and any associated data that is passed to the action.
 * You may update the action or data dynamically to apply new actions.
 */
type DynamicActionOptions =
  | undefined
  | {
      action: Action<HTMLElement, unknown>;
      data?: unknown;
    };

/**
 * Applies the given action dynamically allowing the hosted action to be updated reactively while still appropriately
 * handling the action lifecycle methods.
 *
 * @param {HTMLElement} node - The node associated with the action.
 *
 * @param {import('./types').DynamicActionOptions} options - Defines the action to dynamically mount.
 *
 * @returns {import('svelte/action').ActionReturn<import('./types').DynamicActionOptions>} The action lifecycle
 *          methods.
 */
declare function dynamicAction(
  node: HTMLElement,
  { action, data }?: DynamicActionOptions,
): svelte_action.ActionReturn<DynamicActionOptions>;

export { type DynamicActionOptions, dynamicAction };
