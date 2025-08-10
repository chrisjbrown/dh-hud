/**
 * Allowed arithmetic operators
 */
type CompareOperator = '>' | '>=' | '=' | '<' | '<=' | '!=';

/**
 * Compare [semver](https://semver.org/) version strings using the specified operator.
 *
 * @param v1 First version to compare
 * @param v2 Second version to compare
 * @param operator Allowed arithmetic operator to use
 * @returns `true` if the comparison between the firstVersion and the secondVersion satisfies the operator, `false` otherwise.
 *
 * @example
 * ```
 * compare('10.1.8', '10.0.4', '>'); // return true
 * compare('10.0.1', '10.0.1', '='); // return true
 * compare('10.1.1', '10.2.2', '<'); // return true
 * compare('10.1.1', '10.2.2', '<='); // return true
 * compare('10.1.1', '10.2.2', '>='); // return false
 * ```
 */
declare const compare: (v1: string, v2: string, operator: CompareOperator) => boolean;

/**
 * Compare [semver](https://semver.org/) version strings to find greater, equal or lesser.
 * This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`.
 * @param v1 - First version to compare
 * @param v2 - Second version to compare
 * @returns Numeric value compatible with the [Array.sort(fn) interface](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters).
 */
declare const compareVersions: (v1: string, v2: string) => 0 | 1 | -1;

/**
 * Match [npm semver](https://docs.npmjs.com/cli/v6/using-npm/semver) version range.
 *
 * @param version Version number to match
 * @param range Range pattern for version
 * @returns `true` if the version number is within the range, `false` otherwise.
 *
 * @example
 * ```
 * satisfies('1.1.0', '^1.0.0'); // return true
 * satisfies('1.1.0', '~1.0.0'); // return false
 * ```
 */
declare const satisfies: (version: string, range: string) => boolean;

/**
 * Validate [semver](https://semver.org/) version strings.
 *
 * @param version Version number to validate
 * @returns `true` if the version number is a valid semver version number, `false` otherwise.
 *
 * @example
 * ```
 * validate('1.0.0-rc.1'); // return true
 * validate('1.0-rc.1'); // return false
 * validate('foo'); // return false
 * ```
 */
declare const validate: (version: string) => boolean;
/**
 * Validate [semver](https://semver.org/) version strings strictly. Will not accept wildcards and version ranges.
 *
 * @param version Version number to validate
 * @returns `true` if the version number is a valid semver version number `false` otherwise
 *
 * @example
 * ```
 * validate('1.0.0-rc.1'); // return true
 * validate('1.0-rc.1'); // return false
 * validate('foo'); // return false
 * ```
 */
declare const validateStrict: (version: string) => boolean;

export { type CompareOperator, compare, compareVersions, satisfies, validate, validateStrict };
