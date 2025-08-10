import * as svelte_store from 'svelte/store';
import { Readable, Updater, Writable } from 'svelte/store';

/**
 * Extends {@link Writable} to allow type differentiation between writing and reading data. This is useful when
 * converting or transforming input data to a different or more specific output.
 *
 * @typeParam W - Writable / input type.
 *
 * @typeParam R - Readable / output type.
 */
interface IOWritable<W, R> extends Readable<R> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: W): void;
  /**
   * Update value using callback and inform subscribers.
   * @param updater callback
   */
  update(this: void, updater: Updater<W>): void;
}
/**
 * The minimal requirements of the [writable store contract](https://svelte.dev/docs/svelte-components#script-4-prefix-stores-with-$-to-access-their-values).
 *
 * A minimal writable is a {@link Readable} / subscribable, but only has a `set` method omitting the `update` method
 * from `Writable`.
 *
 * Extends the minimal writable interface to allow type differentiation between writing and reading data. This is
 * useful when converting or transforming input data to a different or more specific output.
 *
 * @typeParam W - Writable / input type.
 *
 * @typeParam R - Readable / output type.
 */
interface MinimalIOWritable<W, R> extends Readable<R> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: W): void;
}
/**
 * The minimal requirements of the [writable store contract](https://svelte.dev/docs/svelte-components#script-4-prefix-stores-with-$-to-access-their-values).
 *
 * A minimal writable is a {@link Readable} / subscribable, but only has a `set` method omitting the `update` method
 * from `Writable`.
 *
 * @typeParam T - type of data.
 */
interface MinimalWritable<T> extends Readable<T> {
  /**
   * Set value and inform subscribers.
   * @param value to set
   */
  set(this: void, value: T): void;
}
/**
 * Combines a minimal writable Svelte store with a callable function. This type allows a minimal writable store to
 * also act as a function enabling flexible reactive behavior.
 *
 * @typeParam T - The type of value stored in the minimal writable store.
 *
 * @typeParam Args - The tuple of argument types accepted by the function.
 *
 * @typeParam R - The return type of the function.
 */
type MinimalWritableFn<T, Args extends unknown[], R = void> = MinimalWritable<T> & ((...args: Args) => R);
/**
 * Combines a writable Svelte store with a callable function. This type allows a writable store to also act as a
 * function enabling flexible reactive behavior.
 *
 * @typeParam T - The type of the value stored in the writable store.
 *
 * @typeParam Args - The tuple of argument types accepted by the function.
 *
 * @typeParam R - The return type of the function.
 */
type WritableFn<T, Args extends unknown[], R> = Writable<T> & ((...args: Args) => R);

/**
 * Provides a basic test for a given variable to test if it has the shape of a readable store by having a `subscribe`
 * function.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ a `subscribe` function.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isReadableStore(store: any): boolean;
/**
 * Provides a basic test for a given variable to test if it has the shape of a minimal writable store by having a
 * `subscribe` and `set` functions.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ `subscribe` & `set` functions.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a {@link MinimalWritable} store.
 */
declare function isMinimalWritableStore(store: any): boolean;
/**
 * Provides a basic test for a given variable to test if it has the shape of a writable store by having a `subscribe`
 * `set`, and `update` functions.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ `subscribe`, `set, and `update`
 * functions.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isWritableStore(store: any): boolean;
/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} update - function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeIgnoreFirst(
  store: svelte_store.Readable<any> | svelte_store.Writable<any>,
  update: any,
): svelte_store.Unsubscriber;
/**
 * Subscribes to the given store with two update functions provided. The first function is invoked on the initial
 * subscription. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} first - Function to receive first update.
 *
 * @param {import('svelte/store').Updater} update - Function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeFirstRest(
  store: svelte_store.Readable<any> | svelte_store.Writable<any>,
  first: any,
  update: any,
): svelte_store.Unsubscriber;

export {
  type IOWritable,
  type MinimalIOWritable,
  type MinimalWritable,
  type MinimalWritableFn,
  type WritableFn,
  isMinimalWritableStore,
  isReadableStore,
  isWritableStore,
  subscribeFirstRest,
  subscribeIgnoreFirst,
};
