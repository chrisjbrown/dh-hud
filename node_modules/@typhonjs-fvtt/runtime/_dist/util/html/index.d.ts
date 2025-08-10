/**
 * Processes the given HTML by creating by running a CSS selector query with all matched elements being passed through
 * the provided `process` function.
 *
 * @param {object}                  opts - Options
 *
 * @param {string}                  opts.html - The HTML to process.
 *
 * @param {(HTMLElement) => void}   opts.process - The selected element processing function.
 *
 * @param {string}                  opts.selector - The CSS selector query.
 *
 * @param {string}                  [opts.containerElement='div'] - Use a specific container element.
 *
 * @param {boolean}                 [opts.firstMatchOnly=false] - When true `querySelector` is invoked to process the
 *        first matching element only.
 *
 * @param {string}                  [opts.namespaceURI] - The namespace URI of the elements to select.
 *
 * @returns {string} The processed HTML.
 */
declare function processHTML({
  html,
  process,
  selector,
  containerElement,
  firstMatchOnly,
  namespaceURI,
}: {
  html: string;
  process: (HTMLElement: any) => void;
  selector: string;
  containerElement?: string;
  firstMatchOnly?: boolean;
  namespaceURI?: string;
}): string;

export { processHTML };
