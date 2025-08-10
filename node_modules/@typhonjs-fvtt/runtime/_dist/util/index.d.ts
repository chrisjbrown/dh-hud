/**
 * Provides various utilities for generating hash codes for strings and UUIDs.
 *
 * This class should not be constructed as it only contains static methods.
 */
declare class Hashing {
  /**
   * Provides a solid string hashing algorithm.
   *
   * Sourced from: https://stackoverflow.com/a/52171480
   *
   * @param {string}   str - String to hash.
   *
   * @param {number}   [seed=0] - A seed value altering the hash.
   *
   * @returns {number} Hash code.
   */
  static hashCode(str: string, seed?: number): number;
  /**
   * Validates that the given string is formatted as a UUIDv4 string.
   *
   * @param {unknown}   uuid - UUID string to test.
   *
   * @returns {uuid is string} Is UUIDv4 string.
   */
  static isUuidv4(uuid: unknown): uuid is string;
  /**
   * Generates a UUID v4 compliant ID. Please use a complete UUID generation package for guaranteed compliance.
   *
   * This code is an evolution of the following Gist.
   * https://gist.github.com/jed/982883
   *
   * There is a public domain / free copy license attached to it that is not a standard OSS license...
   * https://gist.github.com/jed/982883#file-license-txt
   *
   * @returns {string} UUIDv4
   */
  static uuidv4(): string;
}

/**
 * Provides utility functions for strings.
 *
 * This class should not be constructed as it only contains static methods.
 */
declare class Strings {
  /**
   * Escape a given input string prefacing special characters with backslashes for use in a regular expression.
   *
   * @param {string}   string - An un-escaped input string.
   *
   * @returns {string} The escaped string suitable for use in a regular expression.
   */
  static escape(string: string): string;
  /**
   * Normalizes a string.
   *
   * @param {string}   string - A string to normalize for comparisons.
   *
   * @returns {string} Cleaned string.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/normalize
   */
  static normalize(string: string): string;
}

/**
 * Provides timing related higher-order functions.
 *
 * This class should not be constructed as it only contains static methods.
 */
declare class Timing {
  /**
   * Wraps a callback in a debounced timeout. Delay execution of the callback function until the function has not been
   * called for the given delay in milliseconds.
   *
   * @template Args
   *
   * @param {(...args: Args[]) => void} callback - A function to execute once the debounced threshold has been passed.
   *
   * @param {number}   delay - An amount of time in milliseconds to delay.
   *
   * @returns {(...args: Args[]) => void} A wrapped function that can be called to debounce execution.
   *
   * @example
   * /**
   *  * Debounce the update invocation by 500ms.
   *  *\/
   * const updateDebounced = Timing.debounce(() => doc.update(), 500);
   *
   * // Use the function like:
   * updateDebounced();
   *
   * @example
   * /**
   *  * Debounce the update invocation by 500ms.
   *  *
   *  * \@param {string} value - A value to update.
   *  *\/
   * const updateDebounced = Timing.debounce((value) => doc.update(value), 500);
   *
   * // Use the function like:
   * updateDebounced('new value');
   */
  static debounce<Args>(callback: (...args: Args[]) => void, delay: number): (...args: Args[]) => void;
  /**
   * Creates a double click event handler that distinguishes between single and double clicks. Calls the `single`
   * callback on a single click and the `double` callback on a double click. The default double click delay to invoke
   * the `double` callback is 400 milliseconds.
   *
   * @param {object}   opts - Optional parameters.
   *
   * @param {(event: Event) => void} [opts.single] - Single click callback.
   *
   * @param {(event: Event) => void} [opts.double] - Double click callback.
   *
   * @param {number}   [opts.delay=400] - Double click delay.
   *
   * @returns {(event: Event) => void} The gated double-click handler.
   *
   * @example
   * // Given a button element.
   * button.addEventListener('click', Timing.doubleClick({
   *    single: (event) => console.log('Single click: ', event),
   *    double: (event) => console.log('Double click: ', event)
   * });
   */
  static doubleClick({
    single,
    double,
    delay,
  }: {
    single?: (event: Event) => void;
    double?: (event: Event) => void;
    delay?: number;
  }): (event: Event) => void;
}

export { Hashing, Strings, Timing };
