/**
 * Performs linear interpolation between a start & end value by given amount between 0 - 1 inclusive.
 *
 * @param {number}   start - Start value.
 *
 * @param {number}   end - End value.
 *
 * @param {number}   amount - Current amount between 0 - 1 inclusive.
 *
 * @returns {number} Linear interpolated value between start & end.
 */
function lerp(start, end, amount)
{
   return (1 - amount) * start + amount * end;
}

export { lerp };
//# sourceMappingURL=index.js.map
