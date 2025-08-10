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
function clamp(value = 0, min = 0, max = 0)
{
   return Math.min(Math.max(value, min), max);
}

/**
 * Converts the given number from degrees to radians.
 *
 * @param {number}   deg - Degree number to convert
 *
 * @returns {number} Degree as radians.
 */
function degToRad(deg)
{
   return deg * (Math.PI / 180.0);
}

/**
 * Provides methods for retrieving pseudorandom values and other utilities using {@link Math.random}.
 */
class MathRandom
{
   /**
    * Private constructor to prevent instantiation.
    *
    * @private
    */
   constructor()
   {
      throw new Error('This class should not be instantiated.');
   }

   /**
    * Returns a random inclusive integer.
    *
    * @param {number}   min - Minimum value.
    *
    * @param {number}   max - Maximum value.
    *
    * @returns {number} Random inclusive integer.
    */
   static getInt(min, max)
   {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
   }

   /**
    * Returns a random floating point number between min (inclusive) and max (exclusive).
    *
    * @param {number}   min - Minimum value
    *
    * @param {number}   max - Maximum value.
    *
    * @returns {number} Random float.
    */
   static getFloat(min, max)
   {
      return Math.random() * (max - min) + min;
   }

   /**
    * Returns a random boolean.
    *
    * @returns {boolean} Random boolean.
    */
   static getBoolean()
   {
      return Math.random() > 0.5;
   }

   /**
    * Shuffles an array using the Fisher-Yates shuffle algorithm. Modifies the input array in place and returns it.
    *
    * @template T
    *
    * @param {T[]} arr - The array to shuffle.
    *
    * @returns {T[]} The shuffled array.
    */
   static shuffleArray(arr)
   {
      for (let i = arr.length - 1; i > 0; i--)
      {
         const j = MathRandom.getInt(0, i);
         [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
   }
}

/**
 * Converts the given number from radians to degrees.
 *
 * @param {number}   rad - Radian number to convert.
 *
 * @returns {number} Degree as radians.
 */
function radToDeg(rad)
{
   return rad * (180.0 / Math.PI);
}

export { MathRandom, clamp, degToRad, radToDeg };
//# sourceMappingURL=index.js.map
