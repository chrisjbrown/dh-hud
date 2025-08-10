/**
 * We used to work with 2 digits after the decimal point, but it wasn't accurate enough,
 * so the library produced colors that were perceived differently.
 */
const ALPHA_PRECISION = 3;
/**
 * Valid CSS <angle> units.
 * https://developer.mozilla.org/en-US/docs/Web/CSS/angle
 */
const ANGLE_UNITS = {
    grad: 360 / 400,
    turn: 360,
    rad: 360 / (Math.PI * 2),
};

const isPresent = (value) => {
    if (typeof value === "string")
        return value.length > 0;
    if (typeof value === "number")
        return true;
    return false;
};
const round = (number, digits = 0, base = Math.pow(10, digits)) => {
    return Math.round(base * number) / base + 0;
};
/**
 * Clamps a value between an upper and lower bound.
 * We use ternary operators because it makes the minified code
 * is 2 times shorter then `Math.min(Math.max(a,b),c)`
 * NaN is clamped to the lower bound
 */
const clamp = (number, min = 0, max = 1) => {
    return number > max ? max : number > min ? number : min;
};
/**
 * Processes and clamps a degree (angle) value properly.
 * Any `NaN` or `Infinity` will be converted to `0`.
 * Examples: -1 => 359, 361 => 1
 */
const clampHue = (degrees) => {
    degrees = isFinite(degrees) ? degrees % 360 : 0;
    return degrees > 0 ? degrees : degrees + 360;
};
/**
 * Converts a hue value to degrees from 0 to 360 inclusive.
 */
const parseHue = (value, unit = "deg") => {
    return Number(value) * (ANGLE_UNITS[unit] || 1);
};

const clampRgba = (rgba) => ({
    r: clamp(rgba.r, 0, 255),
    g: clamp(rgba.g, 0, 255),
    b: clamp(rgba.b, 0, 255),
    a: clamp(rgba.a),
});
const roundRgba = (rgba, digits = 0) => ({
    r: round(rgba.r, digits),
    g: round(rgba.g, digits),
    b: round(rgba.b, digits),
    a: round(rgba.a, ALPHA_PRECISION > digits ? ALPHA_PRECISION : digits),
});
const parseRgba = ({ r, g, b, a = 1 }) => {
    if (!isPresent(r) || !isPresent(g) || !isPresent(b))
        return null;
    return clampRgba({
        r: Number(r),
        g: Number(g),
        b: Number(b),
        a: Number(a),
    });
};

const hexMatcher = /^#([0-9a-f]{3,8})$/i;
/** Parses any valid Hex3, Hex4, Hex6 or Hex8 string and converts it to an RGBA object */
const parseHex = (hex) => {
    const hexMatch = hexMatcher.exec(hex);
    if (!hexMatch)
        return null;
    hex = hexMatch[1];
    if (hex.length <= 4) {
        return {
            r: parseInt(hex[0] + hex[0], 16),
            g: parseInt(hex[1] + hex[1], 16),
            b: parseInt(hex[2] + hex[2], 16),
            a: hex.length === 4 ? round(parseInt(hex[3] + hex[3], 16) / 255, 2) : 1,
        };
    }
    if (hex.length === 6 || hex.length === 8) {
        return {
            r: parseInt(hex.substr(0, 2), 16),
            g: parseInt(hex.substr(2, 2), 16),
            b: parseInt(hex.substr(4, 2), 16),
            a: hex.length === 8 ? round(parseInt(hex.substr(6, 2), 16) / 255, 2) : 1,
        };
    }
    return null;
};
/** Formats any decimal number (e.g. 128) as a hexadecimal string (e.g. "08") */
const format = (number) => {
    const hex = number.toString(16);
    return hex.length < 2 ? "0" + hex : hex;
};
/** Converts RGBA object to Hex6 or (if it has alpha channel) Hex8 string */
const rgbaToHex = (rgba) => {
    const { r, g, b, a } = roundRgba(rgba);
    const alphaHex = a < 1 ? format(round(a * 255)) : "";
    return "#" + format(r) + format(g) + format(b) + alphaHex;
};

const clampHsva = (hsva) => ({
    h: clampHue(hsva.h),
    s: clamp(hsva.s, 0, 100),
    v: clamp(hsva.v, 0, 100),
    a: clamp(hsva.a),
});
const roundHsva = (hsva, digits = 0) => ({
    h: round(hsva.h, digits),
    s: round(hsva.s, digits),
    v: round(hsva.v, digits),
    a: round(hsva.a, ALPHA_PRECISION > digits ? ALPHA_PRECISION : digits),
});
const parseHsva = ({ h, s, v, a = 1 }) => {
    if (!isPresent(h) || !isPresent(s) || !isPresent(v))
        return null;
    const hsva = clampHsva({
        h: Number(h),
        s: Number(s),
        v: Number(v),
        a: Number(a),
    });
    return hsvaToRgba(hsva);
};
const rgbaToHsva = ({ r, g, b, a }) => {
    const max = Math.max(r, g, b);
    const delta = max - Math.min(r, g, b);
    const hh = delta
        ? max === r
            ? (g - b) / delta
            : max === g
                ? 2 + (b - r) / delta
                : 4 + (r - g) / delta
        : 0;
    return {
        h: 60 * (hh < 0 ? hh + 6 : hh),
        s: max ? (delta / max) * 100 : 0,
        v: (max / 255) * 100,
        a,
    };
};
const hsvaToRgba = ({ h, s, v, a }) => {
    h = (h / 360) * 6;
    s = s / 100;
    v = v / 100;
    const hh = Math.floor(h), b = v * (1 - s), c = v * (1 - (h - hh) * s), d = v * (1 - (1 - h + hh) * s), module = hh % 6;
    return {
        r: [v, c, b, b, d, v][module] * 255,
        g: [d, v, v, c, b, b][module] * 255,
        b: [b, b, d, v, v, c][module] * 255,
        a: a,
    };
};

const clampHsla = (hsla) => ({
    h: clampHue(hsla.h),
    s: clamp(hsla.s, 0, 100),
    l: clamp(hsla.l, 0, 100),
    a: clamp(hsla.a),
});
const roundHsla = (hsla, digits = 0) => ({
    h: round(hsla.h, digits),
    s: round(hsla.s, digits),
    l: round(hsla.l, digits),
    a: round(hsla.a, ALPHA_PRECISION > digits ? ALPHA_PRECISION : digits),
});
const parseHsla = ({ h, s, l, a = 1 }) => {
    if (!isPresent(h) || !isPresent(s) || !isPresent(l))
        return null;
    const hsla = clampHsla({
        h: Number(h),
        s: Number(s),
        l: Number(l),
        a: Number(a),
    });
    return hslaToRgba(hsla);
};
const hslaToHsva = ({ h, s, l, a }) => {
    s *= (l < 50 ? l : 100 - l) / 100;
    return {
        h: h,
        s: s > 0 ? ((2 * s) / (l + s)) * 100 : 0,
        v: l + s,
        a,
    };
};
const hsvaToHsla = ({ h, s, v, a }) => {
    const hh = ((200 - s) * v) / 100;
    return {
        h,
        s: hh > 0 && hh < 200 ? ((s * v) / 100 / (hh <= 100 ? hh : 200 - hh)) * 100 : 0,
        l: hh / 2,
        a,
    };
};
const hslaToRgba = (hsla) => {
    return hsvaToRgba(hslaToHsva(hsla));
};
const rgbaToHsla = (rgba) => {
    return hsvaToHsla(rgbaToHsva(rgba));
};

// Functional syntax
// hsl( <hue>, <percentage>, <percentage>, <alpha-value>? )
const commaHslaMatcher = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
// Whitespace syntax
// hsl( <hue> <percentage> <percentage> [ / <alpha-value> ]? )
const spaceHslaMatcher = /^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid HSL[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#the-hsl-notation
 */
const parseHslaString = (input) => {
    const match = commaHslaMatcher.exec(input) || spaceHslaMatcher.exec(input);
    if (!match)
        return null;
    const hsla = clampHsla({
        h: parseHue(match[1], match[2]),
        s: Number(match[3]),
        l: Number(match[4]),
        a: match[5] === undefined ? 1 : Number(match[5]) / (match[6] ? 100 : 1),
    });
    return hslaToRgba(hsla);
};
const rgbaToHslaString = (rgba, digits = 0) => {
    const { h, s, l, a } = roundHsla(rgbaToHsla(rgba), digits);
    return a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`;
};

// Functional syntax
// rgb( <percentage>#{3} , <alpha-value>? )
// rgb( <number>#{3} , <alpha-value>? )
const commaRgbaMatcher = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
// Whitespace syntax
// rgb( <percentage>{3} [ / <alpha-value> ]? )
// rgb( <number>{3} [ / <alpha-value> ]? )
const spaceRgbaMatcher = /^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i;
/**
 * Parses a valid RGB[A] CSS color function/string
 * https://www.w3.org/TR/css-color-4/#rgb-functions
 */
const parseRgbaString = (input) => {
    const match = commaRgbaMatcher.exec(input) || spaceRgbaMatcher.exec(input);
    if (!match)
        return null;
    // Mixing numbers and percentages is not allowed
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_syntax_variations
    if (match[2] !== match[4] || match[4] !== match[6])
        return null;
    return clampRgba({
        r: Number(match[1]) / (match[2] ? 100 / 255 : 1),
        g: Number(match[3]) / (match[4] ? 100 / 255 : 1),
        b: Number(match[5]) / (match[6] ? 100 / 255 : 1),
        a: match[7] === undefined ? 1 : Number(match[7]) / (match[8] ? 100 : 1),
    });
};
const rgbaToRgbaString = (rgba, digits = 0) => {
    const { r, g, b, a } = roundRgba(rgba, digits);
    return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
};

// The built-in input parsing functions.
// We use array instead of object to keep the bundle size lighter.
const parsers = {
    string: [
        [parseHex, "hex"],
        [parseRgbaString, "rgb"],
        [parseHslaString, "hsl"],
    ],
    object: [
        [parseRgba, "rgb"],
        [parseHsla, "hsl"],
        [parseHsva, "hsv"],
    ],
};
const findValidColor = (input, parsers) => {
    for (let index = 0; index < parsers.length; index++) {
        const result = parsers[index][0](input);
        if (result)
            return [result, parsers[index][1]];
    }
    return [null, undefined];
};
/** Tries to convert an incoming value into RGBA color by going through all color model parsers */
const parse = (input) => {
    if (typeof input === "string") {
        return findValidColor(input.trim(), parsers.string);
    }
    // Don't forget that the type of `null` is "object" in JavaScript
    // https://bitsofco.de/javascript-typeof/
    if (typeof input === "object" && input !== null) {
        return findValidColor(input, parsers.object);
    }
    return [null, undefined];
};
/**
 * Returns a color model name for the input passed to the function.
 */
const getFormat = (input) => parse(input)[1];

const changeAlpha = (rgba, a) => ({
    r: rgba.r,
    g: rgba.g,
    b: rgba.b,
    a,
});

const saturate = (rgba, amount) => {
    const hsla = rgbaToHsla(rgba);
    return {
        h: hsla.h,
        s: clamp(hsla.s + amount * 100, 0, 100),
        l: hsla.l,
        a: hsla.a,
    };
};

/**
 * Returns the brightness of a color [0-1].
 * https://www.w3.org/TR/AERT/#color-contrast
 * https://en.wikipedia.org/wiki/YIQ
 */
const getBrightness = (rgba) => {
    return (rgba.r * 299 + rgba.g * 587 + rgba.b * 114) / 1000 / 255;
};

const lighten = (rgba, amount) => {
    const hsla = rgbaToHsla(rgba);
    return {
        h: hsla.h,
        s: hsla.s,
        l: clamp(hsla.l + amount * 100, 0, 100),
        a: hsla.a,
    };
};

const invert = (rgba) => ({
    r: 255 - rgba.r,
    g: 255 - rgba.g,
    b: 255 - rgba.b,
    a: rgba.a,
});

class Colord {
    parsed;
    rgba;
    constructor(input) {
        // Internal color format is RGBA object.
        // We do not round the internal RGBA numbers for better conversion accuracy.
        this.parsed = parse(input)[0];
        this.rgba = this.parsed || { r: 0, g: 0, b: 0, a: 1 };
    }
    /**
     * Returns a boolean indicating whether or not an input has been parsed successfully.
     * Note: If parsing is unsuccessful, Colord defaults to black (does not throws an error).
     */
    isValid() {
        return this.parsed !== null;
    }
    /**
     * Returns the brightness of a color (from 0 to 1).
     * The calculation logic is modified from WCAG.
     * https://www.w3.org/TR/AERT/#color-contrast
     */
    brightness() {
        return round(getBrightness(this.rgba), 2);
    }
    /**
     * Same as calling `brightness() < 0.5`.
     */
    isDark() {
        return getBrightness(this.rgba) < 0.5;
    }
    /**
     * Same as calling `brightness() >= 0.5`.
     * */
    isLight() {
        return getBrightness(this.rgba) >= 0.5;
    }
    /**
     * Returns the hexadecimal representation of a color.
     * When the alpha channel value of the color is less than 1,
     * it outputs #rrggbbaa format instead of #rrggbb.
     */
    toHex() {
        return rgbaToHex(this.rgba);
    }
    /**
     * Converts a color to RGB color space and returns an object.
     * Always includes an alpha value from 0 to 1.
     */
    toRgb(digits = 0) {
        return roundRgba(this.rgba, digits);
    }
    /**
     * Converts a color to RGB color space and returns a string representation.
     * Outputs an alpha value only if it is less than 1.
     */
    toRgbString(digits = 0) {
        return rgbaToRgbaString(this.rgba, digits);
    }
    /**
     * Converts a color to HSL color space and returns an object.
     * Always includes an alpha value from 0 to 1.
     */
    toHsl(digits = 0) {
        return roundHsla(rgbaToHsla(this.rgba), digits);
    }
    /**
     * Converts a color to HSL color space and returns a string representation.
     * Always includes an alpha value from 0 to 1.
     */
    toHslString(digits = 0) {
        return rgbaToHslaString(this.rgba, digits);
    }
    /**
     * Converts a color to HSV color space and returns an object.
     * Always includes an alpha value from 0 to 1.
     */
    toHsv(digits = 0) {
        return roundHsva(rgbaToHsva(this.rgba), digits);
    }
    /**
     * Creates a new instance containing an inverted (opposite) version of the color.
     */
    invert() {
        return colord(invert(this.rgba));
    }
    /**
     * Increases the HSL saturation of a color by the given amount.
     */
    saturate(amount = 0.1) {
        return colord(saturate(this.rgba, amount));
    }
    /**
     * Decreases the HSL saturation of a color by the given amount.
     */
    desaturate(amount = 0.1) {
        return colord(saturate(this.rgba, -amount));
    }
    /**
     * Makes a gray color with the same lightness as a source color.
     */
    grayscale() {
        return colord(saturate(this.rgba, -1));
    }
    /**
     * Increases the HSL lightness of a color by the given amount.
     */
    lighten(amount = 0.1) {
        return colord(lighten(this.rgba, amount));
    }
    /**
     * Increases the HSL lightness of a color by the given amount.
     */
    darken(amount = 0.1) {
        return colord(lighten(this.rgba, -amount));
    }
    /**
     * Changes the HSL hue of a color by the given amount.
     */
    rotate(amount = 15) {
        return this.hue(this.hue() + amount);
    }
    alpha(value) {
        if (typeof value === "number")
            return colord(changeAlpha(this.rgba, value));
        return round(this.rgba.a, ALPHA_PRECISION);
    }
    hue(value) {
        const hsla = rgbaToHsla(this.rgba);
        if (typeof value === "number")
            return colord({ h: value, s: hsla.s, l: hsla.l, a: hsla.a });
        return round(hsla.h);
    }
    /**
     * Determines whether two values are the same color.
     */
    isEqual(color) {
        return this.toHex() === colord(color).toHex();
    }
}
/**
 * Parses the given input color and creates a new `Colord` instance.
 * See accepted input formats: https://github.com/omgovich/colord#color-parsing
 */
const colord = (input) => {
    if (input instanceof Colord)
        return input;
    return new Colord(input);
};

const activePlugins = [];
const extend = (plugins) => {
    plugins.forEach((plugin) => {
        if (activePlugins.indexOf(plugin) < 0) {
            plugin(Colord, parsers);
            activePlugins.push(plugin);
        }
    });
};

const random = () => {
    return new Colord({
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
    });
};

export { Colord, colord, extend, getFormat, random };
//# sourceMappingURL=index.js.map
