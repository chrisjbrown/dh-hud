/**
 * Options for HashArray.
 */
type HashArrayOptions<T> = {
  /**
   * When true, any attempt to add items that collide with any items in the HashArray will be ignored.
   */
  ignoreDuplicates?: boolean;
  /**
   * An external array that is used for the list backing this HashArray allowing any owner direct access to the list.
   */
  list?: T[];
};
/**
 * A single key entry defined as a direct key / single string or array of strings for deep lookups.
 */
type Key = string | string[];
/**
 * A single string or an array of strings / arrays representing what fields on added objects are to be used as keys for
 * the trie search / HashArray.
 */
type KeyFields = Key[];

/**
 * Defines the operations for cloning items.
 */
declare enum CloneOps {
  /**
   * Do not clone items.
   */
  NONE = 0,
  /**
   * Copy items to new cloned HashArray.
   */
  SHALLOW = 1,
  /**
   * Clone all items.
   */
  DEEP = 2,
}
/**
 * HashArray is a data structure that combines the best feature of a hash (O(1) retrieval) and an array
 * (length and ordering). Think of it as a super-lightweight, extensible, self-indexing set database in memory.
 *
 * @template T
 */
declare class HashArray<T extends object> {
  #private;
  /**
   * An enum used in {@link HashArray.clone} determining how items are handled.
   */
  static readonly CloneOps: typeof CloneOps;
  /**
   * @param {string | KeyFields} [keyFields] - A single string or an array of strings / arrays representing what
   * fields on added objects are to be used as keys for the trie search / HashArray.
   *
   * @param {HashArrayOptions<T>}   [options] - Options.
   */
  constructor(keyFields?: string | KeyFields, options?: HashArrayOptions<T>);
  /**
   * @returns {KeyFields} A clone of the current key fields.
   */
  get keyFields(): KeyFields;
  /**
   * @returns {number} The mapped size; number of keys in HashArray.
   */
  get size(): number;
  /**
   * @returns {number} The flattened size; number of items in HashArray.
   */
  get sizeFlat(): number;
  /**
   * Add items or list of items to the HashArray instance.
   *
   * @param {...(T | Iterable<T>)}  items - Items to add.
   *
   * @returns {HashArray<T>} This instance.
   */
  add(...items: (T | Iterable<T>)[]): this;
  /**
   * Clones this HashArray. By default, returning an empty HashArray with cloned KeyFields. Set `items` in options
   * to `CloneOps.SHALLOW` to copy the items. To fully clone all items set `CloneOps.DEEP`.
   *
   * @param {object}               [opts] - Optional parameters.
   *
   * @param {HashArray.CloneOps}   [opts.items=HashArray.CloneOps.NONE] - Clone operation for items. By default,
   *        no items are included in the clone. Supply `SHALLOW` and items are copied. Supply `DEEP` and items are
   *        cloned as well.
   *
   * @param {HashArrayOptions<T>}  [opts.options] - Optional change to options for the clone that is merged with
   *        current HashArray options.
   */
  clone({ items, options }?: { items?: CloneOps; options?: HashArrayOptions<T> }): HashArray<T>;
  /**
   * Filters this HashArray returning a new HashArray with the items that pass the given filter test.
   *
   * @param {Key}   key - The Key to retrieve item(s) to iterate.
   *
   * @param {Key | ((item: T) => boolean)}  callbackOrIndex - A Key to lookup for filter inclusion or a callback
   *        function returning the filter result for the item.
   */
  filter(key: Key, callbackOrIndex: Key | ((item: T) => boolean)): HashArray<T>;
  /**
   * Iterates over all items retrieved by the given key invoking the callback function for each item.
   *
   * @param {Key}   key - The Key to retrieve items to iterate.
   *
   * @param {(item: T) => void}   callback - A callback invoked for each item.
   *
   * @returns {HashArray<T>} This instance.
   */
  forEach(key: Key, callback: (item: T) => void): this;
  /**
   * Iterates over all items retrieved by the given key invoking the callback function for each item with the value
   * found by the `index` Key and the item itself.
   *
   * @param {Key}   key - The Key to retrieve item(s) to iterate.
   *
   * @param {Key}   index - A specific Key in each item to lookup.
   *
   * @param {(value: any, item: T) => void}   callback - A callback invoked for each item with value of `index`
   *        and item.
   *
   * @returns {HashArray<T>} This instance.
   */
  forEachDeep(key: Key, index: Key, callback: (value: any, item: T) => void): this;
  /**
   * @returns {IterableIterator<[string, T[]]>} An entries iterator w/ key and all associated values.
   */
  entries(): IterableIterator<[string, T[]]>;
  /**
   * @returns {IterableIterator<[string, T]>} Generator of flattened entries.
   * @yields {[string, T]}
   */
  entriesFlat(): IterableIterator<[string, T]>;
  /**
   * @returns {IterableIterator<string>} A keys iterator.
   */
  keys(): IterableIterator<string>;
  /**
   * @returns {IterableIterator<T[]>} A values iterator / all items values grouped by key.
   */
  values(): IterableIterator<T[]>;
  /**
   * @returns {IterableIterator<T>} A flat values iterator by default in order added.
   */
  valuesFlat(): IterableIterator<T>;
  /**
   * Detects if the given item collides with an existing key / item pair.
   *
   * @param {Partial<T>}  item - A partial item to check for collision.
   *
   * @returns {boolean} Is there a collision?
   */
  collides(item: Partial<T>): boolean;
  /**
   * Verifies if this HashArray has this key.
   *
   * @param {string}   key - The key to check.
   *
   * @returns {boolean} Whether this HashArray already has the given key.
   */
  has(key: string): boolean;
  /**
   * Clears all items.
   *
   * @returns {HashArray<T>} This instance.
   */
  clear(): this;
  /**
   * Removes all item(s) given.
   *
   * @param {...T}  items - Items to remove.
   *
   * @returns {HashArray<T>} This instance.
   */
  remove(...items: T[]): this;
  /**
   * Remove item(s) associated with the given keys from the HashArray.
   *
   * @param {string[]} keys - Keys associated with the item(s) to be removed.
   *
   * @returns {HashArray<T>} This instance.
   */
  removeByKey(...keys: string[]): this;
  /**
   * When treating HashArray as a cache removing the first item removes the oldest item.
   *
   * @returns {HashArray<T>} This instance.
   */
  removeFirst(): this;
  /**
   * When treating HashArray as a cache removing the last item removes the newest item.
   *
   * @returns {HashArray<T>} This instance.
   */
  removeLast(): this;
  /**
   * Gets item(s) by the given key.
   *
   * @param {string}   key - The key for an item to retrieve.
   *
   * @returns {T | T[]} All items stored by the given key.
   */
  get(key: string): T | T[];
  /**
   * Gets all items stored by the given Key. You may pass `*` as a wildcard for all items.
   *
   * @param {Key}   keys - The Key for item(s) to retrieve.
   *
   * @returns {T[]} All item(s) for the given Key.
   */
  getAll(keys: Key): T[];
  /**
   * Gets item(s) by the given key always returning an array including an empty array when key is not in the HashArray.
   *
   * @param {string}   key - The key for item(s) to retrieve.
   *
   * @returns {T[]} All items for key or empty array.
   */
  getAsArray(key: string): T[];
  /**
   * Gets the item stored in the flat list of all items at the given index.
   *
   * @param {number}   index - The index to retrieve.
   */
  getAt(index: number): T;
  /**
   * Returns the intersection of this HashArray and a target HashArray.
   *
   * @param {HashArray<T>}   target - Another HashArray.
   *
   * @param {HashArray<T>}   [output] - Optional output HashArray.
   *
   * @returns {HashArray<T>} Returns a new HashArray that contains the intersection between this (A) and the HashArray
   *          passed in (B). Returns A ^ B.
   */
  intersection(target: HashArray<T>, output?: HashArray<T>): HashArray<T>;
}

/**
 * Provides extra examples of how various additional operations can be added on top of HashArray. These operations
 * are not included with HashArray to keep it lean and mean for {@link TrieSearch}. By all means though extend
 * HashArray and add the operations that you need.
 *
 * There are tests for all operations below in `./test/hash/HAExtra.test.ts`.
 */
declare class HashArrayUtil {
  #private;
  /**
   * Iterates deeply over items specified by `key` and `index` with an optional `weightKey` and calculates the
   * average value.
   *
   * @template T
   *
   * @param {HashArray<T>} source - Source HashArray.
   *
   * @param {Key}   key - The Key to retrieve item(s) to iterate.
   *
   * @param {Key}   index - A specific Key in each item to lookup.
   *
   * @param {Key}   [weightKey] - A specific Key in each item to provide a weighting value.
   *
   * @returns {number} The average value for the given iteration.
   */
  static average<T extends object>(source: HashArray<T>, key: Key, index: Key, weightKey?: Key): number;
  /**
   * Iterates deeply over items specified by `key` and `index` with an optional `weightKey` and calculates the sum.
   *
   * @template T
   *
   * @param {HashArray<T>}   source - Source HashArray.
   *
   * @param {Key}   key - The Key to retrieve item(s) to iterate.
   *
   * @param {Key}   index - A specific Key in each item to lookup.
   *
   * @param {Key}   [weightKey] - A specific Key in each item to provide a weighting value.
   *
   * @returns {number} The sum for the given iteration.
   */
  static sum<T extends object>(source: HashArray<T>, key: Key, index: Key, weightKey?: Key): number;
  /**
   * Returns the difference of this HashArray and a target HashArray. If no output HashArray is provided the source
   * is cloned.
   *
   * @template T
   *
   * @param {HashArray<T>}   source - Source HashArray.
   *
   * @param {HashArray<T>}   target - Target HashArray.
   *
   * @param {HashArray<T>}   output - Optional output HashArray.
   *
   * @returns {HashArray<T>} Returns a new HashArray that contains the difference between source (A) and target (B)
   *          HashArrays. Returns A - B.
   */
  static difference<T extends object>(source: HashArray<T>, target: HashArray<T>, output?: HashArray<T>): HashArray<T>;
  /**
   * @template T
   *
   * @param {HashArray<T>} source - Source HashArray.
   *
   * @param {number}   count - How many items to sample.
   *
   * @param {Key} [key] - The Key for item(s) to sample.
   *
   * @returns {T[]} Random subset of items.
   * @see http://en.wikipedia.org/wiki/Image_(mathematics)
   */
  static sample<T extends object>(source: HashArray<T>, count: number, key?: Key): T[];
}

/**
 * Returns the value for a Key in the given item / object.
 *
 * @param {object}   item - The target item or partial item.
 *
 * @param {Key}      key - The Key to lookup in item.
 *
 * @returns {any} Value for key in item.
 */
declare function getValueFromKey(item: object, key: Key): any;

export { HashArray, type HashArrayOptions, HashArrayUtil, type Key, type KeyFields, getValueFromKey };
