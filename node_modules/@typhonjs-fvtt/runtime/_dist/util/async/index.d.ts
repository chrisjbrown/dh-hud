/**
 * Provides utility functions for retrieving data about images.
 */
declare class ImageData {
  /**
   * Loads given URLs into image elements returning those that resolved with width & height dimensions. This is useful
   * when the size of an image is necessary before usage.
   *
   * @param {string | { url?: string } | Iterable<string | { url?: string }>} urls - A list of image URLS to load or
   *        object with an `url` property.
   *
   * @param {object} [options] - Optional options.
   *
   * @param {string} [options.accessor='url'] - Accessor string to access child attribute when `urls` entry contains
   *        objects.
   *
   * @param {boolean} [options.warn=false] - Log debug warnings when a target URL can not be determined; default: false.
   *
   * @returns {(Promise<{
   *    fulfilled: { url: string, width: number, height: number }[],
   *    rejected: { url: string }[]
   * }>)} An object with `fulfilled` and `rejected` requests.
   */
  static getDimensions(
    urls:
      | string
      | {
          url?: string;
        }
      | Iterable<
          | string
          | {
              url?: string;
            }
        >,
    {
      accessor,
      warn,
    }?: {
      accessor?: string;
      warn?: boolean;
    },
  ): Promise<{
    fulfilled: {
      url: string;
      width: number;
      height: number;
    }[];
    rejected: {
      url: string;
    }[];
  }>;
}

/**
 * Provides management of a single Promise that can be shared and accessed across JS & Svelte components. This allows a
 * Promise to be created and managed as part of the TRL application lifecycle and accessed safely in various control
 * flow scenarios. When resolution of the current managed Promise starts further interaction is prevented.
 *
 * Note: to enable debugging / log statements set the static `logging` variable to true.
 */
declare class ManagedPromise {
  /**
   * Sets global logging enabled state.
   *
   * @param {boolean}  logging - New logging enabled state.
   */
  static set logging(logging: boolean);
  /**
   * @returns {boolean} Whether global logging is enabled.
   */
  static get logging(): boolean;
  /**
   * @returns {boolean} Whether there is an active managed Promise.
   */
  get isActive(): boolean;
  /**
   * @returns {boolean} Whether there is an active managed Promise and resolution is currently being processed.
   */
  get isProcessing(): boolean;
  /**
   * Resolves any current Promise with undefined and creates a new current Promise.
   *
   * @template T
   *
   * @param {object} opts - Options.
   *
   * @param {boolean}  [opts.reuse=false] - When true if there is an existing live Promise it is returned immediately.
   *
   * @returns {Promise<T>} The new current managed Promise.
   */
  create<T>({ reuse }?: { reuse?: boolean }): Promise<T>;
  /**
   * Gets the current Promise if any.
   *
   * @returns {Promise<any>} Current Promise.
   */
  get(): Promise<any>;
  /**
   * Rejects the current Promise if applicable.
   *
   * @param {*}  [result] - Result to reject.
   *
   * @returns {boolean} Was the promise rejected.
   */
  reject(result?: any): boolean;
  /**
   * Resolves the current Promise if applicable.
   *
   * @param {*}  [result] - Result to resolve.
   *
   * @returns {boolean} Was the promise resolved.
   */
  resolve(result?: any): boolean;
  #private;
}

export { ImageData, ManagedPromise };
