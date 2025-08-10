/**
 * Splits the given string into an array of Unicode grapheme clusters.
 *
 * @param {string}   str - String to split.
 *
 * @returns {string[]} The string split by Unicode grapheme clusters.
 */
declare function graphemeSplit(str: string): string[];
/**
 * Provides an iterator for tokenizing a string by grapheme clusters.
 *
 * Note: This is a naive implementation that fully parses the string then returns the iterator over parsed clusters.
 * A future implementation will implement an immediate mode parser returning cluster by cluster as the string is
 * parsed.
 *
 * @param {string}   str - String to split.
 *
 * @returns {IterableIterator<string>} An iterator returning grapheme clusters.
 * @yields {string}
 */
declare function graphemeIterator(str: string): IterableIterator<string>;

export { graphemeIterator, graphemeSplit };
