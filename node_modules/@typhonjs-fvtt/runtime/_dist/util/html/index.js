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
function processHTML({ html, process, selector, containerElement = 'div', firstMatchOnly = false, namespaceURI })
{
   if (typeof html !== 'string') { throw new TypeError(`processHTML error: 'html' is not a string.`); }
   if (typeof process !== 'function') { throw new TypeError(`processHTML error: 'process' is not a function.`); }
   if (typeof selector !== 'string') { throw new TypeError(`processHTML error: 'selector' is not a string.`); }

   if (typeof containerElement !== 'string')
   {
      throw new TypeError(`processHTML error: 'containerElement' is not a string.`);
   }

   if (typeof firstMatchOnly !== 'boolean')
   {
      throw new TypeError(`processHTML error: 'firstMatchOnly' is not a boolean.`);
   }

   if (namespaceURI !== void 0 && typeof namespaceURI !== 'string')
   {
      throw new TypeError(`processHTML error: 'namespaceURI' is not a string.`);
   }

   const resolveSelector = namespaceURI ? `${namespaceURI}|${selector}` : selector;

   const container = document.createElement(containerElement);
   container.innerHTML = html;

   if (firstMatchOnly)
   {
      const element = container.querySelector(resolveSelector);
      if (element) { process(element); }
   }
   else
   {
      const elements = container.querySelectorAll(resolveSelector);
      if (elements)
      {
         for (const element of elements) { process(element); }
      }
   }

   return container.innerHTML;
}

export { processHTML };
//# sourceMappingURL=index.js.map
