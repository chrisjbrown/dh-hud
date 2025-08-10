import { Writable } from 'svelte/store';

/**
 * Provides various type aliases used by {@link ResizeObserverManager}.
 */
declare namespace ResizeObserverData {
  /**
   * A function that receives offset / content height & width changes.
   */
  type ResizeFunction = (
    offsetWidth: number,
    offsetHeight: number,
    contentWidth?: number,
    contentHeight?: number,
  ) => unknown;
  /**
   * An object to update as a target for {@link ResizeObserverManager} resize updates.
   */
  type ResizeObject = {
    /** Stores `contentHeight` attribute. */
    contentHeight?: number;
    /** Stores `contentWidth` attribute. */
    contentWidth?: number;
    /** Stores `offsetHeight` attribute. */
    offsetHeight?: number;
    /** Stores `offsetWidth` attribute. */
    offsetWidth?: number;
  };
  /**
   * An extended object type defining various ways to create a valid target for {@link ResizeObserverManager}.
   */
  type ResizeObjectExtended = {
    /** Either a function or a writable store to receive resize updates. */
    resizeObserved?: Writable<ResizeObject> | ResizeFunction;
    /** A function that is invoked with content width & height changes. */
    setContentBounds?: (contentWidth: number, contentHeight: number) => unknown;
    /** A function that is invoked with offset width & height changes. */
    setDimension?: (offsetWidth: number, offsetHeight: number) => unknown;
    /** An object with a `stores` attribute and subsequent `resizeObserved` writable store. */
    stores?: {
      resizeObserved: Writable<ResizeObject>;
    };
  };
  /**
   * The receiving target for observed resize data associated with {@link ResizeObserverManager}. Just one of the
   * mechanisms defined is required to conform to a valid target.
   */
  type ResizeTarget = ResizeObject | ResizeObjectExtended | ResizeFunction;
}

/**
 * Provides an instance of {@link ResizeObserver} that can manage multiple elements and notify a wide range of
 * {@link ResizeObserverData.ResizeTarget} listeners. Offset width and height is also provided through caching the
 * margin and padding styles of the target element.
 *
 * The action, {@link resizeObserver}, utilizes ResizeObserverManager for automatic registration and removal
 * via Svelte.
 */
declare class ResizeObserverManager {
  /**
   * Add an {@link HTMLElement} and {@link ResizeObserverData.ResizeTarget} instance for monitoring. Create cached
   * style attributes for the given element include border & padding dimensions for offset width / height calculations.
   *
   * @param {HTMLElement}    el - The element to observe.
   *
   * @param {import('./types').ResizeObserverData.ResizeTarget} target - A target that contains one of several
   *        mechanisms for updating resize data.
   */
  add(el: HTMLElement, target: ResizeObserverData.ResizeTarget): void;
  /**
   * Clears and unobserves all currently tracked elements and managed targets.
   */
  clear(): void;
  /**
   * Removes all {@link ResizeObserverData.ResizeTarget} instances for the given element from monitoring when just an
   * element is provided otherwise removes a specific target from the monitoring map. If no more targets remain then
   * the element is removed from monitoring.
   *
   * @param {HTMLElement} el - Element to remove from monitoring.
   *
   * @param {import('./types').ResizeObserverData.ResizeTarget} [target] - A specific target to remove from monitoring.
   */
  remove(el: HTMLElement, target?: ResizeObserverData.ResizeTarget): void;
  /**
   * Provides a function that when invoked with an element updates the cached styles for each subscriber of the
   * element.
   *
   * The style attributes cached to calculate offset height / width include border & padding dimensions. You only need
   * to update the cache if you change border or padding attributes of the element.
   *
   * @param {HTMLElement} el - A HTML element.
   */
  updateCache(el: HTMLElement): void;
  #private;
}

export { ResizeObserverData, ResizeObserverManager };
