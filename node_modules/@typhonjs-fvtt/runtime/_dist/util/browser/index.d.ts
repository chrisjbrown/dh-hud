/**
 * Provides utility methods for checking browser capabilities.
 *
 * @see https://kilianvalkhof.com/2021/web/detecting-media-query-support-in-css-and-javascript/
 *
 * @privateRemarks
 * TODO: perhaps add support for various standard media query checks for level 4 & 5.
 */
declare class BrowserSupports {
  /**
   * Check for container query support.
   *
   * @returns {boolean} True if container queries supported.
   */
  static get containerQueries(): boolean;
}

/**
 * Provides access to the Clipboard API for reading / writing text strings. This requires a secure context.
 *
 * Note: `writeText` will attempt to use the older `execCommand` if available when `navigator.clipboard` is not
 * available.
 */
declare class ClipboardAccess {
  /**
   * Uses `navigator.clipboard` if available to read text from the clipboard.
   *
   * Note: Always returns `undefined` when `navigator.clipboard` is not available or the clipboard contains the
   * empty string.
   *
   * @param {Window} [activeWindow=globalThis] Optional active current window.
   *
   * @returns {Promise<string|undefined>} The current clipboard text or undefined.
   */
  static readText(activeWindow?: Window): Promise<string | undefined>;
  /**
   * Uses `navigator.clipboard` if available then falls back to `document.execCommand('copy')` if available to copy
   * the given text to the clipboard.
   *
   * @param {string}   text - Text to copy to the browser clipboard.
   *
   * @param {Window} [activeWindow=globalThis] Optional active current window.
   *
   * @returns {Promise<boolean>} Copy successful.
   */
  static writeText(text: string, activeWindow?: Window): Promise<boolean>;
}

/**
 * Provides cross window checks for DOM nodes / elements, events, and essential duck typing for any class based object
 * with a constructor name. The impetus is that certain browsers such as Chrome and Firefox behave differently when
 * performing `instanceof` checks when elements are moved between browser windows. With Firefox in particular the
 * entire JS runtime can not use `instanceof` checks as the instances of fundamental DOM elements differ between
 * windows.
 *
 * TRL supports moving applications from a main central browser window and popping them out into separate standalone
 * app instances in a separate browser window. In this case for essential DOM element and event checks it is necessary
 * to employ the workarounds found in `CrossWindow`.
 */
declare class CrossWindow {
  /**
   * Convenience method to retrieve the `document.activeElement` value in the current Window context of a DOM Node /
   * Element, EventTarget, Document, or Window.
   *
   * @param {Document | EventTarget | Node | UIEvent | Window}  target - DOM Node / Element, EventTarget, Document,
   *        UIEvent or Window to query.
   *
   * @param {object} [options] - Options.
   *
   * @param {boolean} [options.throws=true] - When `true` and target is invalid throw an exception. If `false` and the
   *        target is invalid `undefined` is returned; default: `true`.
   *
   * @returns {Element | null} Active element or `undefined` when `throws` option is `false` and the target is invalid.
   *
   * @throws {@link TypeError} Target must be a DOM Node / Element, Document, UIEvent, or Window.
   */
  static getActiveElement(
    target: Document | EventTarget | Node | UIEvent | Window,
    {
      throws,
    }?: {
      throws?: boolean;
    },
  ): Element | null;
  /**
   * Convenience method to retrieve the `Document` value in the current context of a DOM Node / Element, EventTarget,
   * Document, UIEvent, or Window.
   *
   * @param {Document | EventTarget | Node | UIEvent | Window}  target - DOM Node / Element, EventTarget, Document,
   *        UIEvent or Window to query.
   *
   * @param {object} [options] - Options.
   *
   * @param {boolean} [options.throws=true] - When `true` and target is invalid throw an exception. If `false` and the
   *        target is invalid `undefined` is returned; default: `true`.
   *
   * @returns {Document} Active document or `undefined` when `throws` option is `false` and the target is invalid.
   *
   * @throws {@link TypeError} Target must be a DOM Node / Element, Document, UIEvent, or Window.
   */
  static getDocument(
    target: Document | EventTarget | Node | UIEvent | Window,
    {
      throws,
    }?: {
      throws?: boolean;
    },
  ): Document;
  /**
   * Convenience method to retrieve the `Window` value in the current context of a DOM Node / Element, EventTarget,
   * Document, or Window.
   *
   * @param {Document | EventTarget | Node | UIEvent | Window}  target - DOM Node / Element, EventTarget, Document,
   *        UIEvent or Window to query.
   *
   * @param {object} [options] - Options.
   *
   * @param {boolean} [options.throws=true] - When `true` and target is invalid throw an exception. If `false` and the
   *        target is invalid `undefined` is returned; default: `true`.
   *
   * @returns {Window} Active window or `undefined` when `throws` option is `false` and the target is invalid.
   *
   * @throws {@link TypeError} Target must be a DOM Node / Element, Document, UIEvent, or Window.
   */
  static getWindow(
    target: Document | EventTarget | Node | UIEvent | Window,
    {
      throws,
    }?: {
      throws?: boolean;
    },
  ): Window;
  /**
   * Provides basic prototype string type checking if `target` is a Document.
   *
   * @param {unknown}  target - A potential Document to test.
   *
   * @returns {target is Document} Is `target` a Document.
   */
  static isDocument(target: unknown): target is Document;
  /**
   * Provides basic prototype string type checking if `target` is a Map.
   *
   * @param {unknown}  target - A potential Map to test.
   *
   * @returns {target is Map} Is `target` a Map.
   */
  static isMap(target: unknown): target is Map<any, any>;
  /**
   * Provides basic prototype string type checking if `target` is a Promise.
   *
   * @param {unknown}  target - A potential Promise to test.
   *
   * @returns {target is Promise} Is `target` a Promise.
   */
  static isPromise(target: unknown): target is Promise<any>;
  /**
   * Provides basic prototype string type checking if `target` is a RegExp.
   *
   * @param {unknown}  target - A potential RegExp to test.
   *
   * @returns {target is RegExp} Is `target` a RegExp.
   */
  static isRegExp(target: unknown): target is RegExp;
  /**
   * Provides basic prototype string type checking if `target` is a Set.
   *
   * @param {unknown}  target - A potential Set to test.
   *
   * @returns {target is Set} Is `target` a Set.
   */
  static isSet(target: unknown): target is Set<any>;
  /**
   * Provides basic prototype string type checking if `target` is a URL.
   *
   * @param {unknown}  target - A potential URL to test.
   *
   * @returns {target is URL} Is `target` a URL.
   */
  static isURL(target: unknown): target is URL;
  /**
   * Provides basic prototype string type checking if `target` is a Window.
   *
   * @param {unknown}  target - A potential Window to test.
   *
   * @returns {target is Window} Is `target` a Window.
   */
  static isWindow(target: unknown): target is Window;
  /**
   * Ensures that the given target is an `instanceof` all known DOM elements that are focusable. Please note that
   * additional checks are required regarding focusable state; use {@link A11yHelper.isFocusable} for a complete check.
   *
   * @param {unknown}  target - Target to test for `instanceof` focusable HTML element.
   *
   * @returns {boolean} Is target an `instanceof` a focusable DOM element.
   */
  static isFocusableHTMLElement(target: unknown): boolean;
  /**
   * Provides precise type checking if `target` is a DocumentFragment.
   *
   * @param {unknown}  target - A potential DocumentFragment to test.
   *
   * @returns {target is DocumentFragment} Is `target` a DocumentFragment.
   */
  static isDocumentFragment(target: unknown): target is DocumentFragment;
  /**
   * Provides precise type checking if `target` is an Element.
   *
   * @param {unknown}  target - A potential Element to test.
   *
   * @returns {target is Element} Is `target` an Element.
   */
  static isElement(target: unknown): target is Element;
  /**
   * Provides precise type checking if `target` is a HTMLAnchorElement.
   *
   * @param {unknown}  target - A potential HTMLAnchorElement to test.
   *
   * @returns {target is HTMLAnchorElement} Is `target` a HTMLAnchorElement.
   */
  static isHTMLAnchorElement(target: unknown): target is HTMLAnchorElement;
  /**
   * Provides precise type checking if `target` is a HTMLElement.
   *
   * @param {unknown}  target - A potential HTMLElement to test.
   *
   * @returns {target is HTMLElement} Is `target` a HTMLElement.
   */
  static isHTMLElement(target: unknown): target is HTMLElement;
  /**
   * Provides precise type checking if `target` is a Node.
   *
   * @param {unknown}  target - A potential Node to test.
   *
   * @returns {target is Node} Is `target` a DOM Node.
   */
  static isNode(target: unknown): target is Node;
  /**
   * Provides precise type checking if `target` is a ShadowRoot.
   *
   * @param {unknown}  target - A potential ShadowRoot to test.
   *
   * @returns {target is ShadowRoot} Is `target` a ShadowRoot.
   */
  static isShadowRoot(target: unknown): target is ShadowRoot;
  /**
   * Provides precise type checking if `target` is a SVGElement.
   *
   * @param {unknown}  target - A potential SVGElement to test.
   *
   * @returns {target is SVGElement} Is `target` a SVGElement.
   */
  static isSVGElement(target: unknown): target is SVGElement;
  /**
   * Provides basic duck type checking for `Event` signature and optional constructor name(s).
   *
   * @param {unknown}  target - A potential DOM event to test.
   *
   * @param {string | Set<string>} [types] Specific constructor name or Set of constructor names to match.
   *
   * @returns {target is Event} Is `target` an Event with optional constructor name check.
   */
  static isEvent(target: unknown, types?: string | Set<string>): target is Event;
  /**
   * Provides basic duck type checking for `Event` signature for standard mouse / pointer events including
   * `MouseEvent` and `PointerEvent`.
   *
   * @param {unknown}  target - A potential DOM event to test.
   *
   * @returns {target is PointerEvent} Is `target` a MouseEvent or PointerEvent.
   */
  static isPointerEvent(target: unknown): target is PointerEvent;
  /**
   * Provides basic duck type checking for `Event` signature for all UI events.
   *
   * @param {unknown}  target - A potential DOM event to test.
   *
   * @returns {target is UIEvent} Is `target` a UIEvent.
   * @see https://developer.mozilla.org/en-US/docs/Web/API/UIEvent
   */
  static isUIEvent(target: unknown): target is UIEvent;
  /**
   * Provides basic duck type checking for `Event` signature for standard user input events including `KeyboardEvent`,
   * `MouseEvent`, and `PointerEvent`.
   *
   * @param {unknown}  target - A potential DOM event to test.
   *
   * @returns {target is KeyboardEvent | MouseEvent | PointerEvent} Is `target` a Keyboard, MouseEvent, or
   *          PointerEvent.
   */
  static isUserInputEvent(target: unknown): target is KeyboardEvent | MouseEvent | PointerEvent;
  /**
   * Provides basic type checking by constructor name(s) for objects. This can be useful when checking multiple
   * constructor names against a provided Set.
   *
   * @param {unknown}  target - Object to test for constructor name.
   *
   * @param {string | Set<string>} types Specific constructor name or Set of constructor names to match.
   *
   * @returns {boolean} Does the provided object constructor name match the types provided.
   */
  static isCtorName(target: unknown, types: string | Set<string>): boolean;
}

/**
 * Provides a utility function to parse / construct fully qualified URL instances from a URL string.
 */
declare class URLParser {
  /**
   * Parses a URL string converting it to a fully qualified URL. If URL is an existing URL instance it is returned
   * immediately. Optionally you may construct a fully qualified URL from a relative base origin / path or with a
   * route prefix added to the current location origin.
   *
   * @param {object} options - Options.
   *
   * @param {string | URL}   options.url - URL string to convert to a URL.
   *
   * @param {string}   [options.base] - Optional fully qualified base path for relative URL construction.
   *
   * @param {string}   [options.routePrefix] - Optional route prefix to add to location origin for absolute URL strings
   *        when `base` is not defined.
   *
   * @returns {URL | null} Parsed URL or null if `url` is not parsed.
   */
  static parse({ url, base, routePrefix }: { url: string | URL; base?: string; routePrefix?: string }): URL | null;
}

export { BrowserSupports, ClipboardAccess, CrossWindow, URLParser };
