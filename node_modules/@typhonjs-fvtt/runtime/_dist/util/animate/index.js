/**
 * Awaits `requestAnimationFrame` calls by the counter specified. This allows asynchronous applications for direct /
 * inline style modification amongst other direct animation techniques.
 *
 * @param {number}   [cntr=1] - A positive integer greater than 0 for amount of requestAnimationFrames to wait.
 *
 * @returns {Promise<number>} Returns time of last `requestAnimationFrame` callback.
 */
async function nextAnimationFrame(cntr = 1)
{
   if (!Number.isInteger(cntr) || cntr < 1)
   {
      throw new TypeError(`nextAnimationFrame error: 'cntr' must be a positive integer greater than 0.`);
   }

   let currentTime;

   // Await count of `rAF` callbacks.
   for (;--cntr >= 0;) { currentTime = await new Promise((resolve) => requestAnimationFrame(resolve)); }

   return currentTime;
}

export { nextAnimationFrame };
//# sourceMappingURL=index.js.map
