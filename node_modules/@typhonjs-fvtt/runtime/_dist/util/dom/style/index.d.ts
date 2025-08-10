/**
 * Provides resources for parsing style strings.
 */
declare class StyleParse {
  /**
   * Parses a pixel string / computed styles. Ex. `100px` returns `100`.
   *
   * @param {string}   value - Value to parse.
   *
   * @returns {number|undefined} The integer component of a pixel string.
   */
  static pixels(value: string): number | undefined;
  /**
   * Returns the pixel value for `1rem` based on the root document element. You may apply an optional multiplier.
   *
   * @param {number} [multiplier=1] - Optional multiplier to apply to `rem` pixel value; default: 1.
   *
   * @param {object} [options] - Optional parameters.
   *
   * @param {Document} [options.targetDocument=document] The target DOM {@link Document} if different from the main
   *        browser global `document`.
   *
   * @returns {number} The pixel value for `1rem` with or without a multiplier based on the root document element.
   */
  static remPixels(
    multiplier?: number,
    {
      targetDocument,
    }?: {
      targetDocument?: Document;
    },
  ): number;
}

/**
 * Provides a managed dynamic style sheet / element useful in configuring global CSS variables. When creating an
 * instance of TJSStyleManager you must provide a "document key" / string for the style element added. The style element
 * can be accessed via `document[docKey]`.
 *
 * Instances of TJSStyleManager can also be versioned by supplying a positive integer greater than or equal to `1` via
 * the 'version' option. This version number is assigned to the associated style element. When a TJSStyleManager
 * instance is created and there is an existing instance with a version that is lower than the current instance all CSS
 * rules are removed letting the higher version to take precedence. This isn't a perfect system and requires thoughtful
 * construction of CSS variables exposed, but allows multiple independently compiled TRL packages to load the latest
 * CSS variables. It is recommended to always set `overwrite` option of {@link TJSStyleManager.setProperty} and
 * {@link TJSStyleManager.setProperties} to `false` when loading initial values.
 */
declare class TJSStyleManager {
  /**
   *
   * @param {object}   opts - Options.
   *
   * @param {string}   opts.docKey - Required key providing a link to a specific style sheet element.
   *
   * @param {string}   [opts.selector=:root] - Selector element.
   *
   * @param {Document} [opts.document] - Target document to load styles into.
   *
   * @param {number}   [opts.version] - An integer representing the version / level of styles being managed.
   */
  constructor({
    docKey,
    selector,
    document,
    version,
  }?: {
    docKey: string;
    selector?: string;
    document?: Document;
    version?: number;
  });
  /**
   * @returns {string} Provides an accessor to get the `cssText` for the style sheet.
   */
  get cssText(): string;
  /**
   * @returns {number} Returns the version of this instance.
   */
  get version(): number;
  /**
   * Provides a copy constructor to duplicate an existing TJSStyleManager instance into a new document.
   *
   * Note: This is used to support the `PopOut` module.
   *
   * @param {Document} [document] Target browser document to clone into.
   *
   * @returns {TJSStyleManager} New style manager instance.
   */
  clone(document?: Document): TJSStyleManager;
  get(): {};
  /**
   * Gets a particular CSS variable.
   *
   * @param {string}   key - CSS variable property key.
   *
   * @returns {string} Returns CSS variable value.
   */
  getProperty(key: string): string;
  /**
   * Set rules by property / value; useful for CSS variables.
   *
   * @param {{ [key: string]: string }}  rules - An object with property / value string pairs to load.
   *
   * @param {boolean}                 [overwrite=true] - When true overwrites any existing values.
   */
  setProperties(
    rules: {
      [key: string]: string;
    },
    overwrite?: boolean,
  ): void;
  /**
   * Sets a particular property.
   *
   * @param {string}   key - CSS variable property key.
   *
   * @param {string}   value - CSS variable value.
   *
   * @param {boolean}  [overwrite=true] - Overwrite any existing value.
   */
  setProperty(key: string, value: string, overwrite?: boolean): void;
  /**
   * Removes the property keys specified. If `keys` is an iterable list then all property keys in the list are removed.
   *
   * @param {Iterable<string>} keys - The property keys to remove.
   */
  removeProperties(keys: Iterable<string>): void;
  /**
   * Removes a particular CSS variable.
   *
   * @param {string}   key - CSS variable property key.
   *
   * @returns {string} CSS variable value when removed.
   */
  removeProperty(key: string): string;
  #private;
}

export { StyleParse, TJSStyleManager };
