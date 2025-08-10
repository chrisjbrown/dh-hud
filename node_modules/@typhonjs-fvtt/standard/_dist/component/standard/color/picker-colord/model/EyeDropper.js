/**
 * Provides a wrapper around the browser EyeDropper API. The EyeDropper requires a secure context including `localhost`.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API
 */
export class EyeDropper
{
   /**
    * @returns {boolean} Is the EyeDropper API available?
    */
   static get isAvailable()
   {
      return globalThis.EyeDropper !== void 0;
   }
}
