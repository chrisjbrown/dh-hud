import { SvelteComponent } from 'svelte';

/**
 * @privateRemarks
 * TODO: Add description
 *
 */
declare class TjsButton extends SvelteComponent<TjsButton.Props, TjsButton.Events, TjsButton.Slots> {}

/** Event / Prop / Slot type aliases for {@link TjsButton | associated component}. */
declare namespace TjsButton {
  /** Props type alias for {@link TjsButton | associated component}. */
  export type Props = {
    keyCode?: any;
    button?: any;
    label?: any;
    title?: any;
    enabled?: any;
    icon?: any;
    styles?: any;
    efx?: any;
    onPress?: any;
    onContextMenu?: any;
    clickPropagate?: any;
  };
  /** Events type alias for {@link TjsButton | associated component}. */
  export type Events = { click: MouseEvent; contextmenu: MouseEvent; press: CustomEvent<any> } & {
    [evt: string]: CustomEvent<any>;
  };
  /** Slots type alias for {@link TjsButton | associated component}. */
  export type Slots = { default: {} };
}

/**
 * Provides a generic "input" component that creates the specific input component based on 'type'. If no `type`
 * property is available in the input object `text` is the default.
 *
 * You may optionally define a label either as `input.label` or through the `label` prop as a string. The label
 * element uses `display: contents` which ignores the label element and lays out the children as if the
 * label element does not exist which is perfect for a grid layout.
 *
 * The available `type` props include:
 * ```
 * - `button`: A standard button.
 * - `checkbox`: A checkbox input.
 * - `number`: A number input.
 * - `range`: A range input.
 * - `range-number`: A range + number input.
 * - `select`: A select input.
 *
 * The following types are forwarded onto a standard text input: `email`, `password`, `search`, `text`, `url`.
 * ```
 *
 * ### CSS Variables
 *
 * The following CSS variables control the associated styles with the default values:
 * ```
 * --tjs-input-label-display - content
 * --tjs-input-label-text-align - right
 * --tjs-input-label-white-space - nowrap
 * ```
 */
declare class TjsInput extends SvelteComponent<TjsInput.Props, TjsInput.Events, TjsInput.Slots> {}

/** Event / Prop / Slot type aliases for {@link TjsInput | associated component}. */
declare namespace TjsInput {
  /** Props type alias for {@link TjsInput | associated component}. */
  export type Props = { input?: any; type?: any };
  /** Events type alias for {@link TjsInput | associated component}. */
  export type Events = { click: any; press: any; contextmenu: any } & { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsInput | associated component}. */
  export type Slots = {};
}

/**
 * Provides a data driven checkbox input w/ label.
 *
 * ### CSS Variables:
 * ```
 * --tjs-input-appearance
 * --tjs-input-border
 * --tjs-input-border-radius
 * --tjs-input-border-disabled
 * --tjs-input-box-shadow-focus
 * --tjs-input-box-shadow-focus-visible
 * --tjs-input-cursor
 * --tjs-input-cursor-disabled
 * --tjs-input-flex
 * --tjs-input-outline-focus-visible
 * --tjs-input-outline-offset
 * --tjs-input-transition-focus-visible
 * --tjs-input-transition-hover
 *
 * --tjs-input-checkbox-appearance
 * --tjs-input-checkbox-background
 * --tjs-input-checkbox-border
 * --tjs-input-checkbox-border-radius
 * --tjs-input-checkbox-border-disabled
 * --tjs-input-checkbox-box-shadow-focus
 * --tjs-input-checkbox-box-shadow-focus-visible
 * --tjs-input-checkbox-cursor
 * --tjs-input-checkbox-cursor-disabled
 * --tjs-input-checkbox-diameter
 * --tjs-input-checkbox-flex
 * --tjs-input-checkbox-height
 * --tjs-input-checkbox-outline-hover
 * --tjs-input-checkbox-outline-focus-visible
 * --tjs-input-checkbox-outline-offset
 * --tjs-input-checkbox-transition-focus-visible
 * --tjs-input-checkbox-transition-hover
 * --tjs-input-checkbox-width
 * ```
 */
declare class TjsInputCheckbox extends SvelteComponent<
  TjsInputCheckbox.Props,
  TjsInputCheckbox.Events,
  TjsInputCheckbox.Slots
> {}

/** Event / Prop / Slot type aliases for {@link TjsInputCheckbox | associated component}. */
declare namespace TjsInputCheckbox {
  /** Props type alias for {@link TjsInputCheckbox | associated component}. */
  export type Props = { input?: any; label?: any; readonly?: any; enabled?: any; styles?: any; efx?: any; store?: any };
  /** Events type alias for {@link TjsInputCheckbox | associated component}. */
  export type Events = { pointerdown: PointerEvent } & { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsInputCheckbox | associated component}. */
  export type Slots = {};
}

/**
 * A number input type.
 *
 * ### CSS Variables:
 * ```
 * --tjs-input-appearance
 * --tjs-input-background
 * --tjs-input-border
 * --tjs-input-border-radius
 * --tjs-input-border-disabled
 * --tjs-input-box-shadow-focus
 * --tjs-input-box-shadow-focus-visible
 * --tjs-input-caret-color
 * --tjs-input-color
 * --tjs-input-color-disabled
 * --tjs-input-cursor
 * --tjs-input-cursor-disabled
 * --tjs-input-flex
 * --tjs-input-font-family
 * --tjs-input-font-size
 * --tjs-input-height
 * --tjs-input-line-height
 * --tjs-input-padding
 * --tjs-input-placeholder-color
 * --tjs-input-outline-focus-visible
 * --tjs-input-outline-offset
 * --tjs-input-overflow
 * --tjs-input-text-align
 * --tjs-input-transition-focus-visible
 * --tjs-input-value-invalid-color
 * --tjs-input-width
 *
 * --tjs-input-number-appearance
 * --tjs-input-number-background
 * --tjs-input-number-border
 * --tjs-input-number-border-radius
 * --tjs-input-number-border-disabled
 * --tjs-input-number-box-shadow-focus
 * --tjs-input-number-box-shadow-focus-visible
 * --tjs-input-number-caret-color
 * --tjs-input-number-color
 * --tjs-input-number-color-disabled
 * --tjs-input-number-cursor
 * --tjs-input-number-cursor-disabled
 * --tjs-input-number-flex
 * --tjs-input-number-font-family
 * --tjs-input-number-font-size
 * --tjs-input-number-height
 * --tjs-input-number-line-height
 * --tjs-input-number-outline-focus-visible
 * --tjs-input-number-outline-offset
 * --tjs-input-number-overflow
 * --tjs-input-number-padding
 * --tjs-input-number-placeholder-color
 * --tjs-input-number-text-align
 * --tjs-input-number-transition-focus-visible
 * --tjs-input-number-value-invalid-color
 * --tjs-input-number-width
 *
 * Webkit unique variables:
 * --tjs-input-number-webkit-inner-spin-button-appearance
 * --tjs-input-number-webkit-inner-spin-button-opacity
 * --tjs-input-number-webkit-outer-spin-button-appearance
 * --tjs-input-number-webkit-outer-spin-button-opacity
 * ```
 */
declare class TjsInputNumber extends SvelteComponent<
  TjsInputNumber.Props,
  TjsInputNumber.Events,
  TjsInputNumber.Slots
> {}

/** Event / Prop / Slot type aliases for {@link TjsInputNumber | associated component}. */
declare namespace TjsInputNumber {
  /** Props type alias for {@link TjsInputNumber | associated component}. */
  export type Props = {
    input?: any;
    max?: any;
    min?: any;
    label?: any;
    options?: any;
    readonly?: any;
    enabled?: any;
    styles?: any;
    efx?: any;
    placeholder?: any;
    step?: any;
    store?: any;
    storeIsValid?: any;
  };
  /** Events type alias for {@link TjsInputNumber | associated component}. */
  export type Events = { pointerdown: PointerEvent } & { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsInputNumber | associated component}. */
  export type Slots = {};
}

/**
 * ### CSS Variables:
 * ```
 * --tjs-input-appearance
 * --tjs-input-background
 * --tjs-input-border
 * --tjs-input-border-radius
 * --tjs-input-border-disabled
 * --tjs-input-box-shadow-focus
 * --tjs-input-box-shadow-focus-visible
 * --tjs-input-caret-color
 * --tjs-input-color
 * --tjs-input-color-disabled
 * --tjs-input-cursor
 * --tjs-input-cursor-disabled
 * --tjs-input-flex
 * --tjs-input-font-family
 * --tjs-input-font-size
 * --tjs-input-height
 * --tjs-input-line-height
 * --tjs-input-padding
 * --tjs-input-placeholder-color
 * --tjs-input-outline-focus-visible
 * --tjs-input-outline-offset
 * --tjs-input-overflow
 * --tjs-input-range-align
 * --tjs-input-transition-focus-visible
 * --tjs-input-value-invalid-color
 * --tjs-input-width
 *
 * --tjs-input-range-appearance
 * --tjs-input-range-background
 * --tjs-input-range-border
 * --tjs-input-range-border-radius
 * --tjs-input-range-border-disabled
 * --tjs-input-range-box-shadow-focus
 * --tjs-input-range-box-shadow-focus-visible
 * --tjs-input-range-caret-color
 * --tjs-input-range-color
 * --tjs-input-range-color-disabled
 * --tjs-input-range-cursor
 * --tjs-input-range-cursor-disabled
 * --tjs-input-range-flex
 * --tjs-input-range-font-family
 * --tjs-input-range-font-size
 * --tjs-input-range-height
 * --tjs-input-range-line-height
 * --tjs-input-range-outline-focus-visible
 * --tjs-input-range-outline-offset
 * --tjs-input-range-overflow
 * --tjs-input-range-padding
 * --tjs-input-range-placeholder-color
 * --tjs-input-range-slider-track-box-shadow
 * --tjs-input-range-slider-track-box-shadow-focus
 * --tjs-input-range-text-align
 * --tjs-input-range-slider-thumb-box-shadow
 * --tjs-input-range-slider-thumb-box-shadow-focus
 * --tjs-input-range-transition-focus-visible
 * --tjs-input-range-value-invalid-color
 * --tjs-input-range-width
 * ```
 */
declare class TjsInputRange extends SvelteComponent<TjsInputRange.Props, TjsInputRange.Events, TjsInputRange.Slots> {}

/** Event / Prop / Slot type aliases for {@link TjsInputRange | associated component}. */
declare namespace TjsInputRange {
  /** Props type alias for {@link TjsInputRange | associated component}. */
  export type Props = {
    input?: any;
    max?: any;
    min?: any;
    label?: any;
    options?: any;
    readonly?: any;
    enabled?: any;
    styles?: any;
    efx?: any;
    step?: any;
    store?: any;
  };
  /** Events type alias for {@link TjsInputRange | associated component}. */
  export type Events = { pointerdown: PointerEvent } & { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsInputRange | associated component}. */
  export type Slots = {};
}

/**
 * Provides a combined {@link TJSInputRange} / {@link TJSInputNumber} component with a single slotted label wrapper.
 * This is a convenience component enabling easy hook up of a range + number input from the same data source.
 *
 * There is no explicit layout defined. The `input` data is forwarded on to both range / number components with
 * the exception that `readonly` only applies to the number input.
 *
 * Note: The `efx` animation action applies to both the range / number inputs.
 *
 */
declare class TjsInputRangeNumber extends SvelteComponent<
  TjsInputRangeNumber.Props,
  TjsInputRangeNumber.Events,
  TjsInputRangeNumber.Slots
> {}

/** Event / Prop / Slot type aliases for {@link TjsInputRangeNumber | associated component}. */
declare namespace TjsInputRangeNumber {
  /** Props type alias for {@link TjsInputRangeNumber | associated component}. */
  export type Props = {
    input?: any;
    max?: any;
    min?: any;
    label?: any;
    options?: any;
    readonly?: any;
    enabled?: any;
    styles?: any;
    efx?: any;
    step?: any;
    store?: any;
  };
  /** Events type alias for {@link TjsInputRangeNumber | associated component}. */
  export type Events = { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsInputRangeNumber | associated component}. */
  export type Slots = {};
}

/**
 * A generic input type has issues w/ 2-way binding w/ Svelte.
 * https://github.com/sveltejs/svelte/issues/3921
 *
 * A "hack" is used to set the type on the input element: `{...{ type }}`
 *
 * Only use this component for text inputs presently. More work to come.
 *
 * ### CSS Variables:
 * ```
 * --tjs-input-appearance
 * --tjs-input-background
 * --tjs-input-border
 * --tjs-input-border-radius
 * --tjs-input-border-disabled
 * --tjs-input-box-shadow-focus
 * --tjs-input-box-shadow-focus-visible
 * --tjs-input-caret-color
 * --tjs-input-color
 * --tjs-input-color-disabled
 * --tjs-input-cursor
 * --tjs-input-cursor-disabled
 * --tjs-input-flex
 * --tjs-input-font-family
 * --tjs-input-font-size
 * --tjs-input-height
 * --tjs-input-line-height
 * --tjs-input-padding
 * --tjs-input-placeholder-color
 * --tjs-input-outline-focus-visible
 * --tjs-input-outline-offset
 * --tjs-input-overflow
 * --tjs-input-text-align
 * --tjs-input-transition-focus-visible
 * --tjs-input-value-invalid-color
 * --tjs-input-width
 *
 * --tjs-input-text-appearance
 * --tjs-input-text-background
 * --tjs-input-text-border
 * --tjs-input-text-border-radius
 * --tjs-input-text-border-disabled
 * --tjs-input-text-box-shadow-focus
 * --tjs-input-text-box-shadow-focus-visible
 * --tjs-input-text-caret-color
 * --tjs-input-text-color
 * --tjs-input-text-color-disabled
 * --tjs-input-text-cursor
 * --tjs-input-text-cursor-disabled
 * --tjs-input-text-flex
 * --tjs-input-text-font-family
 * --tjs-input-text-font-size
 * --tjs-input-text-height
 * --tjs-input-text-line-height
 * --tjs-input-text-outline-focus-visible
 * --tjs-input-text-outline-offset
 * --tjs-input-text-overflow
 * --tjs-input-text-padding
 * --tjs-input-text-placeholder-color
 * --tjs-input-text-text-align
 * --tjs-input-text-transition-focus-visible
 * --tjs-input-text-value-invalid-color
 * --tjs-input-text-width
 * ```
 */
declare class TjsInputText extends SvelteComponent<TjsInputText.Props, TjsInputText.Events, TjsInputText.Slots> {}

/** Event / Prop / Slot type aliases for {@link TjsInputText | associated component}. */
declare namespace TjsInputText {
  /** Props type alias for {@link TjsInputText | associated component}. */
  export type Props = {
    input?: any;
    type?: any;
    label?: any;
    options?: any;
    readonly?: any;
    enabled?: any;
    styles?: any;
    efx?: any;
    placeholder?: any;
    store?: any;
    storeIsValid?: any;
  };
  /** Events type alias for {@link TjsInputText | associated component}. */
  export type Events = { pointerdown: PointerEvent } & { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsInputText | associated component}. */
  export type Slots = {};
}

/**
 * ### CSS Variables
 * ```
 * --tjs-input-appearance
 * --tjs-input-background
 * --tjs-input-border
 * --tjs-input-border-radius
 * --tjs-input-border-disabled
 * --tjs-input-box-shadow-focus
 * --tjs-input-box-shadow-focus-visible
 * --tjs-input-color
 * --tjs-input-color-disabled
 * --tjs-input-cursor
 * --tjs-input-cursor-disabled
 * --tjs-input-flex
 * --tjs-input-font-family
 * --tjs-input-font-size
 * --tjs-input-height
 * --tjs-input-line-height
 * --tjs-input-outline-focus-visible
 * --tjs-input-outline-offset
 * --tjs-input-overflow
 * --tjs-input-text-overflow
 * --tjs-input-transition-focus-visible
 * --tjs-input-width
 *
 * --tjs-select-appearance
 * --tjs-select-background
 * --tjs-select-border
 * --tjs-select-border-radius
 * --tjs-select-border-disabled
 * --tjs-select-box-shadow-focus
 * --tjs-select-box-shadow-focus-visible
 * --tjs-select-color
 * --tjs-select-color-disabled
 * --tjs-select-cursor
 * --tjs-select-cursor-disabled
 * --tjs-select-flex
 * --tjs-select-font-family
 * --tjs-select-font-size
 * --tjs-select-height
 * --tjs-select-line-height
 * --tjs-select-outline-focus-visible
 * --tjs-select-outline-offset
 * --tjs-select-overflow
 * --tjs-select-text-overflow
 * --tjs-select-transition-focus-visible
 * --tjs-select-width
 *
 * --tjs-select-option-background; fallback: --tjs-default-popup-background; default: #23221d
 * --tjs-select-option-color; fallback: --tjs-default-popup-primary-color; default: #b5b3a4
 * ```
 */
declare class TjsSelect extends SvelteComponent<TjsSelect.Props, TjsSelect.Events, TjsSelect.Slots> {}

/** Event / Prop / Slot type aliases for {@link TjsSelect | associated component}. */
declare namespace TjsSelect {
  /** Props type alias for {@link TjsSelect | associated component}. */
  export type Props = {
    label?: any;
    select?: any;
    options?: any;
    enabled?: any;
    styles?: any;
    efx?: any;
    store?: any;
    selected?: any;
  };
  /** Events type alias for {@link TjsSelect | associated component}. */
  export type Events = { change: Event; pointerdown: PointerEvent } & { [evt: string]: CustomEvent<any> };
  /** Slots type alias for {@link TjsSelect | associated component}. */
  export type Slots = {};
}

export {
  TjsButton as TJSButton,
  TjsInput as TJSInput,
  TjsInputCheckbox as TJSInputCheckbox,
  TjsInputNumber as TJSInputNumber,
  TjsInputRange as TJSInputRange,
  TjsInputRangeNumber as TJSInputRangeNumber,
  TjsInputText as TJSInputText,
  TjsSelect as TJSSelect,
};
