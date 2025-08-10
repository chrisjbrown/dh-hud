/**
 * Documentation: {@link https://github.com/omgovich/colord#getting-started}
 *
 * Note: For the time being `colord` provides "the best" API / support for working with color with Javascript. It
 * however may not be the long term solution for TRL as it is not maintained.
 *
 * @module
 */

type RgbColor = {
  r: number;
  g: number;
  b: number;
};
type HslColor = {
  h: number;
  s: number;
  l: number;
};
type HsvColor = {
  h: number;
  s: number;
  v: number;
};
type HwbColor = {
  h: number;
  w: number;
  b: number;
};
interface XyzColor {
  x: number;
  y: number;
  z: number;
}
interface LabColor {
  l: number;
  a: number;
  b: number;
}
interface LchColor {
  l: number;
  c: number;
  h: number;
}
interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
}
type WithAlpha<O> = O & {
  a: number;
};
type RgbaColor = WithAlpha<RgbColor>;
type HslaColor = WithAlpha<HslColor>;
type HsvaColor = WithAlpha<HsvColor>;
type HwbaColor = WithAlpha<HwbColor>;
type XyzaColor = WithAlpha<XyzColor>;
type LabaColor = LabColor & {
  alpha: number;
};
type LchaColor = WithAlpha<LchColor>;
type CmykaColor = WithAlpha<CmykColor>;
type ObjectColor =
  | RgbColor
  | RgbaColor
  | HslColor
  | HslaColor
  | HsvColor
  | HsvaColor
  | HwbColor
  | HwbaColor
  | XyzColor
  | XyzaColor
  | LabColor
  | LabaColor
  | LchColor
  | LchaColor
  | CmykColor
  | CmykaColor;
type AnyColor = string | ObjectColor;
type InputObject = Record<string, unknown>;
type Format = 'name' | 'hex' | 'rgb' | 'hsl' | 'hsv' | 'hwb' | 'xyz' | 'lab' | 'lch' | 'cmyk';
type Input = string | InputObject;
type ParseFunction<I extends Input> = (input: I) => RgbaColor | null;
type Parser<I extends Input> = [ParseFunction<I>, Format];
type Parsers = {
  string: Array<Parser<string>>;
  object: Array<Parser<InputObject>>;
};

declare class Colord {
  private readonly parsed;
  readonly rgba: RgbaColor;
  constructor(input: AnyColor);
  /**
   * Returns a boolean indicating whether or not an input has been parsed successfully.
   * Note: If parsing is unsuccessful, Colord defaults to black (does not throws an error).
   */
  isValid(): boolean;
  /**
   * Returns the brightness of a color (from 0 to 1).
   * The calculation logic is modified from WCAG.
   * https://www.w3.org/TR/AERT/#color-contrast
   */
  brightness(): number;
  /**
   * Same as calling `brightness() < 0.5`.
   */
  isDark(): boolean;
  /**
   * Same as calling `brightness() >= 0.5`.
   * */
  isLight(): boolean;
  /**
   * Returns the hexadecimal representation of a color.
   * When the alpha channel value of the color is less than 1,
   * it outputs #rrggbbaa format instead of #rrggbb.
   */
  toHex(): string;
  /**
   * Converts a color to RGB color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toRgb(digits?: number): RgbaColor;
  /**
   * Converts a color to RGB color space and returns a string representation.
   * Outputs an alpha value only if it is less than 1.
   */
  toRgbString(digits?: number): string;
  /**
   * Converts a color to HSL color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsl(digits?: number): HslaColor;
  /**
   * Converts a color to HSL color space and returns a string representation.
   * Always includes an alpha value from 0 to 1.
   */
  toHslString(digits?: number): string;
  /**
   * Converts a color to HSV color space and returns an object.
   * Always includes an alpha value from 0 to 1.
   */
  toHsv(digits?: number): HsvaColor;
  /**
   * Creates a new instance containing an inverted (opposite) version of the color.
   */
  invert(): Colord;
  /**
   * Increases the HSL saturation of a color by the given amount.
   */
  saturate(amount?: number): Colord;
  /**
   * Decreases the HSL saturation of a color by the given amount.
   */
  desaturate(amount?: number): Colord;
  /**
   * Makes a gray color with the same lightness as a source color.
   */
  grayscale(): Colord;
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  lighten(amount?: number): Colord;
  /**
   * Increases the HSL lightness of a color by the given amount.
   */
  darken(amount?: number): Colord;
  /**
   * Changes the HSL hue of a color by the given amount.
   */
  rotate(amount?: number): Colord;
  /**
   * Allows to get or change an alpha channel value.
   */
  alpha(): number;
  alpha(value: number): Colord;
  /**
   * Allows to get or change a hue value.
   */
  hue(): number;
  hue(value: number): Colord;
  /**
   * Determines whether two values are the same color.
   */
  isEqual(color: AnyColor | Colord): boolean;
}
/**
 * Parses the given input color and creates a new `Colord` instance.
 * See accepted input formats: https://github.com/omgovich/colord#color-parsing
 */
declare const colord: (input: AnyColor | Colord) => Colord;

type Plugin = (ColordClass: typeof Colord, parsers: Parsers) => void;
declare const extend: (plugins: Plugin[]) => void;

/**
 * Returns a color model name for the input passed to the function.
 */
declare const getFormat: (input: Input) => Format | undefined;

declare const random: () => Colord;

export {
  type AnyColor,
  Colord,
  type HslColor,
  type HslaColor,
  type HsvColor,
  type HsvaColor,
  type HwbColor,
  type HwbaColor,
  type LabColor,
  type LabaColor,
  type LchColor,
  type LchaColor,
  type Plugin,
  type RgbColor,
  type RgbaColor,
  type XyzColor,
  type XyzaColor,
  colord,
  extend,
  getFormat,
  random,
};
