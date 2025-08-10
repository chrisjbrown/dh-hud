import * as svelte_store from 'svelte/store';
import * as svelte from 'svelte';
import { SvelteComponent } from 'svelte';

/**
 * Provides a convenient scrollable container / DIV that always allows keyboard scroll navigation by stopping
 * propagation of page up / down key events when the active element is or is contained by the container.
 *
 * Auto serialization of scroll state is handled by providing a store / `scrollTop`.
 *
 * A main slot is provided for a content component, but a fallback allows a child content component to be defined
 * by the `class` and `props` fields in {@link TJSScrollContainerData}.
 *
 */
declare class TjsScrollContainer extends SvelteComponent<
  TjsScrollContainer.Props,
  TjsScrollContainer.Events,
  TjsScrollContainer.Slots
> {}

/** Event / Prop / Slot type aliases for {@link TjsScrollContainer | associated component}. */
declare namespace TjsScrollContainer {
  /** Props type alias for {@link TjsScrollContainer | associated component}. */
  export type Props = {
    /** @type {import('.').TJSScrollContainerData} */
    container?: TJSScrollContainerData;
    /** @type {import('svelte/store').Writable<number>} */
    scrollTop?: svelte_store.Writable<number>;
    /** @type {{ [key: string]: string | null }} */
    styles?: { [key: string]: string | null };
  };
  /** Events type alias for {@link TjsScrollContainer | associated component}. */
  export type Events = { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsScrollContainer | associated component}. */
  export type Slots = { default: {} };
}

type TJSScrollContainerData = {
  /**
   * A svelte component class used as the content component when
   * there is no slotted component defined.
   */
  class?: svelte.SvelteComponent;
  /**
   * An object to apply to any data defined Svelte component when there is no slotted
   * component defined.
   */
  props?: object;
  /**
   * A Svelte store that serializes the scroll top
   * position of the scrollable container.
   */
  scrollTop?: svelte_store.Writable<number>;
  /**
   * Inline styles to assign to the container.
   */
  styles?: {
    [key: string]: string | null;
  };
};

export { TjsScrollContainer as TJSScrollContainer, type TJSScrollContainerData };
