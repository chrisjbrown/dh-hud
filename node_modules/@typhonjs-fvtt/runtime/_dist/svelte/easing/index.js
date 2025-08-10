import * as svelteEasingFunc from 'svelte/easing';

/**
 * Defines a read-only list of Svelte easing function names.
 *
 * @type {Readonly<import('./types').EasingFunctionName[]>}
 */
const easingList = Object.freeze([
   'backIn',
   'backInOut',
   'backOut',
   'bounceIn',
   'bounceInOut',
   'bounceOut',
   'circIn',
   'circInOut',
   'circOut',
   'cubicIn',
   'cubicInOut',
   'cubicOut',
   'elasticIn',
   'elasticInOut',
   'elasticOut',
   'expoIn',
   'expoInOut',
   'expoOut',
   'linear',
   'quadIn',
   'quadInOut',
   'quadOut',
   'quartIn',
   'quartInOut',
   'quartOut',
   'quintIn',
   'quintInOut',
   'quintOut',
   'sineIn',
   'sineInOut',
   'sineOut'
]);

/**
 * @type {Readonly<{ [key in import('./types').EasingFunctionName]: import('#runtime/svelte/easing').EasingFunction }>}
 */
const easingFunc = svelteEasingFunc;

/**
 * Performs a lookup for standard Svelte easing functions by name. For convenience if passing in a function it is
 * returned verbatim.
 *
 * @param {import('./types').EasingReference} easingRef - The name of a standard Svelte easing function or a supplied
 *        easing function.
 *
 * @param {object}   [options] - Optional parameters.
 *
 * @param {import('./types').EasingFunctionName | false} [options.default='linear'] - A default easing function by
 *        name to return. When specified as `false` no default fallback easing function is selected. The default value
 *        is `linear`.
 *
 * @returns {import('#runtime/svelte/easing').EasingFunction} The requested easing function.
 */
function getEasingFunc(easingRef, options)
{
   if (typeof easingRef === 'function') { return easingRef; }

   const easingFn = easingFunc[easingRef];

   return easingFn ? easingFn : easingFunc[options?.default ?? 'linear'];
}

export { easingFunc, easingList, getEasingFunc };
//# sourceMappingURL=index.js.map
