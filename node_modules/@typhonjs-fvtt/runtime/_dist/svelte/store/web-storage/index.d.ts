import * as svelte_store from 'svelte/store';
import {
  Stores,
  StoresValues,
  Subscriber,
  Updater,
  Unsubscriber,
  Readable,
  StartStopNotifier,
  Writable,
} from 'svelte/store';

/**
 * Generates derived, readable, writable helper functions wrapping the given Storage API provided with any additional
 * customization for data serialization. By default, JSON serialization is used.
 *
 * @param {object}   opts - Generator options.
 *
 * @param {Storage}  opts.storage - The web storage source.
 *
 * @param {(value: any, ...rest: any[]) => string}  [opts.serialize] - Replace with custom serialization;
 *        default: `JSON.stringify`.
 *
 * @param {(value: string, ...rest: any[]) => any}  [opts.deserialize] - Replace with custom deserialization;
 *        default: `JSON.parse`.
 *
 * @returns {StorageStores} A complete set of store helper functions and associated storage API instance and
 *          serialization strategy.
 */
declare function storeGenerator({
  storage,
  serialize,
  deserialize,
}: {
  storage: Storage;
  serialize?: (value: any, ...rest: any[]) => string;
  deserialize?: (value: string, ...rest: any[]) => any;
}): StorageStores;
type AdvancedDeriver<S extends Stores, T> = (
  values: StoresValues<S>,
  set: Subscriber<T>,
  update: (fn: Updater<T>) => void,
) => Unsubscriber | void;
type Deriver<S extends Stores, T> = SimpleDeriver<S, T> | AdvancedDeriver<S, T>;
type SimpleDeriver<S extends Stores, T> = (values: StoresValues<S>) => T;
/**
 * @template S, T
 *
 * Derived value store by synchronizing one or more readable stores and applying an aggregation function over its
 * input values.
 *
 * @param {string}   key - Storage key.
 *
 * @param {S}        stores - Input stores.
 *
 * @param {Deriver<S, T>}  fn - Function callback that aggregates the values.
 *
 * @param {T}        [initial_value] When used asynchronously.
 *
 * @returns {Readable<T>} A derived storage store.
 */
type StorageDerived = <S extends Stores, T>(
  key: string,
  stores: S,
  fn: Deriver<S, T>,
  initial_value?: T,
) => Readable<T>;
/**
 * @template T
 * Creates a `Readable` store that allows reading by subscription.
 *
 * @param {string}   key - storage key
 *
 * @param {T}        value -  initial value
 *
 * @param {StartStopNotifier<T>} start - Start and stop notifications for subscriptions.
 *
 * @returns {Readable<T>} A readable storage store.
 */
type StorageReadable = <T>(key: string, value: T, start: StartStopNotifier<T>) => Readable<T>;
/**
 * @template T
 * Create a `Writable` store that allows both updating and reading by subscription.
 *
 * @param {string}   key - Storage key.
 *
 * @param {T}        value - Default value.
 *
 * @param {StartStopNotifier<T>} [start] - Start and stop notifications for subscriptions.
 *
 * @returns {Writable<T>} A writable storage store.
 */
type StorageWritable = <T>(key: string, value: T, start?: StartStopNotifier<T>) => Writable<T>;
/**
 * The generated web storage store helper functions along with the associated storage API source and serialization
 * strategy.
 */
type StorageStores = {
  derived: StorageDerived;
  readable: StorageReadable;
  writable: StorageWritable;
  storage: Storage;
  serialize: (value: any, ...rest: any[]) => string;
  deserialize: (value: string, ...rest: any[]) => any;
};

/**
 * Provides the TRL web storage store API.
 */
interface WebStorage {
  /**
   * Get value from the storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {*} Value from session storage or if not defined any default value provided.
   */
  getItem(key: string, defaultValue: any): unknown;
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {T}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @param {StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The Svelte store for this key.
   */
  getStore<T>(key: string, defaultValue?: T, storageStores?: StorageStores): Writable<T>;
  /**
   * Returns whether a store has already been created for the given key.
   *
   * @param {string}   key - Key to lookup in storage API.
   */
  hasStore(key: string): boolean;
  /**
   * Sets the value for the given key in storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        value - A value to set for this key.
   */
  setItem(key: string, value: any): void;
  /**
   * Convenience method to swap a boolean value stored in storage API updating the associated store value.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */
  swapItemBoolean(key: string, defaultValue?: boolean): boolean;
  /**
   * @template T
   *
   * Returns an iterable for the session storage keys and stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<[string, Writable<T>]>} Iterable iterator of keys and stores.
   * @yields {Writable<[string, Writable<T>]>}
   */
  entries<T>(regex?: RegExp): IterableIterator<[string, Writable<T>]>;
  /**
   * Returns an iterable for the session storage keys from existing stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<string>} Iterable iterator of session storage keys.
   * @yields {string}
   */
  keys(regex?: RegExp): IterableIterator<string>;
  /**
   * @template T
   *
   * Returns an iterable for the session storage stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<Writable<T>>} Iterable iterator of stores.
   * @yields {Writable<T>}
   */
  stores<T>(regex?: RegExp): IterableIterator<Writable<T>>;
}

/**
 * Provides the base Storage API store manager. It is recommended to use {@link TJSLocalStorage} &
 * {@link TJSSessionStorage} for standard browser local and session storage use cases. TJSWebStorage exists
 * to provide additional customization options for custom Storage API compatible storage instances and custom
 * serialization configuration.
 *
 * @implements {import('./types').WebStorage}
 */
declare class TJSWebStorage implements WebStorage {
  /**
   * @param {import('./').StorageStores} storageStores - Provides a complete set of
   *        storage API store helper functions and the associated storage API instance and serializations strategy.
   */
  constructor(storageStores: StorageStores);
  /**
   * Get value from the storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {*} Value from session storage or if not defined any default value provided.
   */
  getItem(key: string, defaultValue?: any): any;
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {T}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The Svelte store for this key.
   */
  getStore<T>(key: string, defaultValue?: T, storageStores?: StorageStores): svelte_store.Writable<T>;
  /**
   * Returns whether a store has already been created for the given key.
   *
   * @param {string}   key - Key to lookup in storage API.
   */
  hasStore(key: string): boolean;
  /**
   * Sets the value for the given key in storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        value - A value to set for this key.
   */
  setItem(key: string, value: any): void;
  /**
   * Convenience method to swap a boolean value stored in storage API updating the associated store value.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */
  swapItemBoolean(key: string, defaultValue?: boolean): boolean;
  /**
   * @template T
   *
   * Returns an iterable for the session storage keys and stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<[string, import('svelte/store').Writable<T>]>} Iterable iterator of keys and stores.
   * @yields {import('svelte/store').Writable<[string, Writable<T>]>}
   */
  entries<T>(regex?: RegExp): IterableIterator<[string, svelte_store.Writable<T>]>;
  /**
   * Returns an iterable for the session storage keys from existing stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<string>} Iterable iterator of session storage keys.
   * @yields {string}
   */
  keys(regex?: RegExp): IterableIterator<string>;
  /**
   * @template T
   *
   * Returns an iterable for the session storage stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<import('svelte/store').Writable<T>>} Iterable iterator of stores.
   * @yields {import('svelte/store').Writable<T>}
   */
  stores<T>(regex?: RegExp): IterableIterator<svelte_store.Writable<T>>;
  #private;
}

/**
 * Provides a {@link TJSWebStorage} instance for standard browser local storage use cases.
 */
declare class TJSLocalStorage extends TJSWebStorage {
  constructor();
}

/**
 * Provides a {@link TJSWebStorage} instance for standard browser session storage use cases.
 */
declare class TJSSessionStorage extends TJSWebStorage {
  constructor();
}

/**
 * Provides all Storage API enabled `localStorage` store helper functions. Data is serialized as JSON.
 */
declare const localStores: StorageStores;

/**
 * Provides all Storage API enabled `sessionStorage` store helper functions. Data is serialized as JSON.
 */
declare const sessionStores: StorageStores;

export {
  type StorageDerived,
  type StorageReadable,
  type StorageStores,
  type StorageWritable,
  TJSLocalStorage,
  TJSSessionStorage,
  TJSWebStorage,
  type WebStorage,
  localStores,
  sessionStores,
  storeGenerator,
};
