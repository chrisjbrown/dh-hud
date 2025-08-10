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
declare function lerp(start: number, end: number, amount: number): number;

/**
 * Defines the shape of an interpolation function.
 */
interface InterpolateFunction<T> {
  /**
   * @param start - Start value.
   *
   * @param end - End value.
   *
   * @param amount - Current amount between 0 - 1 inclusive.
   *
   * @returns Interpolated value between start & end.
   */
  (start: T, end: T, amount: number): T;
}
/**
 * Defines the supported interpolation function names.
 */
type InterpolateFunctionName = 'lerp';

export { type InterpolateFunction, type InterpolateFunctionName, lerp };
