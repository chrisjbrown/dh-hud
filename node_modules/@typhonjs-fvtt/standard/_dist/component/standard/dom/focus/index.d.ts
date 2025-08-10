import { SvelteComponent } from 'svelte';

/**
 * Provides a component to wrap focus to the first focusable element in the given `elementRoot` prop. Place this
 * component as the last child in `elementRoot`.
 *
 */
declare class TjsFocusWrap extends SvelteComponent<TjsFocusWrap.Props, TjsFocusWrap.Events, TjsFocusWrap.Slots> {}

/** Event / Prop / Slot type aliases for {@link TjsFocusWrap | associated component}. */
declare namespace TjsFocusWrap {
  /** Props type alias for {@link TjsFocusWrap | associated component}. */
  export type Props = {
    /** @type {HTMLElement} */
    elementRoot?: HTMLElement;
    /** @type {boolean} */
    enabled?: boolean;
  };
  /** Events type alias for {@link TjsFocusWrap | associated component}. */
  export type Events = { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsFocusWrap | associated component}. */
  export type Slots = {};
}

export { TjsFocusWrap as TJSFocusWrap };
