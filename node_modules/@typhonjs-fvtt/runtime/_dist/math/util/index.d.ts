/**
 * Clamps a value between min / max values.
 *
 * @param {number}   value - Value to clamp.
 *
 * @param {number}   min - Minimum value.
 *
 * @param {number}   max - Maximum value.
 *
 * @returns {number} Clamped value.
 */
declare function clamp(value?: number, min?: number, max?: number): number;

/**
 * Converts the given number from degrees to radians.
 *
 * @param {number}   deg - Degree number to convert
 *
 * @returns {number} Degree as radians.
 */
declare function degToRad(deg: number): number;

/**
 * Provides methods for retrieving pseudorandom values and other utilities using {@link Math.random}.
 */
declare class MathRandom {
  /**
   * Returns a random inclusive integer.
   *
   * @param {number}   min - Minimum value.
   *
   * @param {number}   max - Maximum value.
   *
   * @returns {number} Random inclusive integer.
   */
  static getInt(min: number, max: number): number;
  /**
   * Returns a random floating point number between min (inclusive) and max (exclusive).
   *
   * @param {number}   min - Minimum value
   *
   * @param {number}   max - Maximum value.
   *
   * @returns {number} Random float.
   */
  static getFloat(min: number, max: number): number;
  /**
   * Returns a random boolean.
   *
   * @returns {boolean} Random boolean.
   */
  static getBoolean(): boolean;
  /**
   * Shuffles an array using the Fisher-Yates shuffle algorithm. Modifies the input array in place and returns it.
   *
   * @template T
   *
   * @param {T[]} arr - The array to shuffle.
   *
   * @returns {T[]} The shuffled array.
   */
  static shuffleArray<T>(arr: T[]): T[];
}

/**
 * Converts the given number from radians to degrees.
 *
 * @param {number}   rad - Radian number to convert.
 *
 * @returns {number} Degree as radians.
 */
declare function radToDeg(rad: number): number;

export { MathRandom, clamp, degToRad, radToDeg };
