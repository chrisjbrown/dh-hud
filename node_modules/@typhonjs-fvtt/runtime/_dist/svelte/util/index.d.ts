import { SvelteComponent, ComponentProps, ComponentConstructorOptions } from 'svelte';

/**
 * Provides utilities to verify and parse {@link TJSSvelte.Config} configuration objects and general verification of
 * Svelte components.
 */
declare class TJSSvelte {
  private constructor();
  static get config(): TJSSvelte.API.Config;
  /**
   * @returns The utility API.
   */
  static get util(): TJSSvelte.API.Util;
}
declare namespace TJSSvelte {
  namespace API {
    interface Config {
      /**
       * Validates `config` argument whether it is a valid {@link TJSSvelte.Config.Dynamic} or
       * {@link TJSSvelte.Config.Standard} configuration object suitable for parsing by
       * {@link TJSSvelte.API.Config.parseConfig}.
       *
       * @param config - The potential config object to validate.
       *
       * @param [options] - Options.
       *
       * @param [options.raiseException=false] - If validation fails raise an exception.
       *
       * @returns Is the config a valid TJSSvelte.Config.Dynamic or TJSSvelte.Config.Standard configuration object.
       *
       * @throws {TypeError}  Any validation error when `raiseException` is enabled.
       */
      isConfig(
        config: unknown,
        options?: {
          raiseException?: boolean;
        },
      ): config is TJSSvelte.Config.Dynamic | TJSSvelte.Config.Standard;
      /**
       * Validates `config` argument whether it is a valid {@link TJSSvelte.Config.Embed} configuration object
       * suitable for directly mounting via the `<svelte:component>` directive.
       *
       * @param config - The potential config object to validate.
       *
       * @param [options] - Options.
       *
       * @param [options.raiseException=false] - If validation fails raise an exception.
       *
       * @returns Is the config a valid TJSSvelte.Config.Embed configuration object.
       *
       * @throws {TypeError}  Any validation error when `raiseException` is enabled.
       */
      isConfigEmbed(
        config: unknown,
        options?: {
          raiseException?: boolean;
        },
      ): config is TJSSvelte.Config.Embed;
      /**
       * Parses a TyphonJS Svelte dynamic or standard config object ensuring that the class specified is a Svelte
       * component, loads any dynamic defined `context` or `props` preparing the config object for loading into the
       * Svelte component.
       *
       * @param config - Svelte config object.
       *
       * @param [options] - Options.
       *
       * @param [options.contextExternal] - When true any context data provided will be loaded into `#external`
       *        context separating it from any internal context created by the component.
       *
       * @param [options.thisArg] - `This` reference to set for invoking any `context` or `props` defined as
       *        functions for {@link Config.Dynamic} configuration objects.
       *
       * @returns The processed Svelte config object turned with parsed `props` & `context` converted into the format
       *          supported by Svelte.
       */
      parseConfig(
        config: TJSSvelte.Config.Dynamic | TJSSvelte.Config.Standard,
        options?: {
          thisArg?: unknown;
        },
      ): TJSSvelte.Config.Parsed;
    }
    interface Util {
      /**
       * Provides basic duck typing to determine if the provided function is a constructor function for a Svelte
       * component.
       *
       * @param comp - Data to check as a Svelte component.
       *
       * @returns Whether basic duck typing succeeds.
       */
      isComponent(comp: unknown): boolean;
      /**
       * Provides basic duck typing to determine if the provided object is a HMR ProxyComponent instance or class.
       *
       * @param {unknown}  comp - Data to check as a HMR proxy component.
       *
       * @returns {boolean} Whether basic duck typing succeeds.
       */
      isHMRProxy(comp: unknown): boolean;
      /**
       * Runs outro transition then destroys Svelte component.
       *
       * Workaround for https://github.com/sveltejs/svelte/issues/4056
       *
       * @param instance - A Svelte component.
       *
       * @returns Promise returned after outro transition completed and component destroyed.
       */
      outroAndDestroy(instance: SvelteComponent): Promise<void>;
    }
  }
  namespace Config {
    /**
     * Provides the TRL / client side configuration object to load a Svelte component that is suitable to use
     * with {@link TJSSvelte.API.Config.parseConfig}.
     *
     * Defines a dynamic config that allows the `context` and `props` properties to also be defined as a function that
     * returns an object of properties to respectively load into given component. This can be useful when defining a
     * config in a static context where it is helpful to pass an instance / `this` reference when defining `context`
     * and `props`.
     *
     * See {@link Config.Embed} or {@link Config.Standard} that narrows the type accepted for `context` and `props`
     * to just an `object`.
     *
     * @typeParam Component - A specific component to narrow the allowed `class` and `props`.
     *
     * @typeParam [Config] - Additional options to omit properties from allowed in `context` or `props`.
     */
    interface Dynamic<
      Component extends SvelteComponent = SvelteComponent,
      Config extends {
        ContextOmit?: keyof NonNullable<Config['ContextShape']>;
        ContextShape?: {
          [key: string]: any;
        };
        PropsOmit?: keyof ComponentProps<Component>;
      } = {
        ContextOmit: never;
        ContextShape: {};
        PropsOmit: never;
      },
    > {
      /**
       * A child of `target` to render the component immediately before.
       */
      anchor?: Element;
      /**
       * The Svelte component class / constructor function.
       */
      class: new (options: ComponentConstructorOptions<ComponentProps<Component>>) => Component;
      /**
       * The root-level additional data to add to the context passed to the component.
       */
      context?: NarrowContextObject<Config> | NarrowContextFunction<Config>;
      /**
       * If true, will play transitions on initial render, rather than waiting for subsequent state changes.
       */
      intro?: boolean;
      /**
       * Props to pass to the component. You may define props as an `object` or a function returning an `object`.
       */
      props?: NarrowPropsObject<Component, Config> | NarrowPropsFunction<Component, Config>;
      /**
       * The target to render component to. By default, `document.body` is used as the target if not otherwise
       * defined.
       */
      target?: Element | Document | ShadowRoot;
    }
    /**
     * Defines the TRL / client side embed configuration object to load a Svelte component that is suitable to be
     * mounted directly by the `<svelte:component>` directive. Just `class` and `props` are supported.
     *
     * @typeParam Component - A specific component to narrow the allowed `class` and `props`.
     *
     * @typeParam [Config] - Additional options to omit properties from allowed in `context` or `props`.
     */
    interface Embed<
      Component extends SvelteComponent = SvelteComponent,
      Config extends {
        PropsOmit?: keyof ComponentProps<Component>;
      } = {
        PropsOmit: never;
      },
    > {
      /**
       * The Svelte component class / constructor function.
       */
      class: new (options: ComponentConstructorOptions<ComponentProps<Component>>) => Component;
      /**
       * If true, will play transitions on initial render, rather than waiting for subsequent state changes.
       */
      intro?: boolean;
      /**
       * Props to pass to the component. You may define props as an `object`.
       */
      props?: NarrowPropsObject<Component, Config>;
    }
    /**
     * Defines the TRL / client side configuration object to load a Svelte component that is suitable to use
     * with {@link TJSSvelte.API.Config.parseConfig}.
     *
     * @typeParam Component - A specific component to narrow the allowed `class` and `props`.
     *
     * @typeParam [Config] - Additional options to omit properties from allowed in `context` or `props`.
     */
    interface Standard<
      Component extends SvelteComponent = SvelteComponent,
      Config extends {
        ContextOmit?: keyof NonNullable<Config['ContextShape']>;
        ContextShape?: {
          [key: string]: any;
        };
        PropsOmit?: keyof ComponentProps<Component>;
      } = {
        ContextOmit: never;
        ContextShape: {};
        PropsOmit: never;
      },
    > {
      /**
       * A child of `target` to render the component immediately before.
       */
      anchor?: Element;
      /**
       * The Svelte component class / constructor function.
       */
      class: new (options: ComponentConstructorOptions<ComponentProps<Component>>) => Component;
      /**
       * The root-level additional data to add to the context passed to the component.
       */
      context?: NarrowContextObject<Config>;
      /**
       * If true, will play transitions on initial render, rather than waiting for subsequent state changes.
       */
      intro?: boolean;
      /**
       * Props to pass to the component. You may define props as an `object`.
       */
      props?: NarrowPropsObject<Component, Config>;
      /**
       * The target to render component to. By default, `document.body` is used as the target if not otherwise
       * defined.
       */
      target?: Element | Document | ShadowRoot;
    }
    /**
     * The result of after parsing {@link Standard} or {@link Dynamic} by {@link TJSSvelte.parseConfig}.
     */
    interface Parsed {
      /**
       * The Svelte component class / constructor function.
       */
      class: new (options: ComponentConstructorOptions<ComponentProps<SvelteComponent>>) => SvelteComponent;
      /**
       * A child of `target` to render the component immediately before.
       */
      anchor?: Element;
      /**
       * The root-level additional data to add to the context passed to the component.
       */
      context: Map<string, any>;
      /**
       * If true, will play transitions on initial render, rather than waiting for subsequent state changes.
       */
      intro?: boolean;
      /**
       * Props to pass to the component.
       */
      props: {
        [key: string]: any;
      };
      /**
       * The target to render component to.
       */
      target?: Element | Document | ShadowRoot;
    }
  }
}
/**
 * Always narrow and evaluate the `context` property even if `ConfigShape` just has the omitted keys. This is done
 * through the forced addition of `__uniqueKey_DO_NOT_USE_OR_REMOVE__`.
 *
 * Also do not evaluate if `ContextOmit` is undefined / never.
 */
type NarrowContextFunction<
  Config extends {
    ContextOmit?: keyof NonNullable<Config['ContextShape']> | '__uniqueKey_DO_NOT_USE_OR_REMOVE__';
    ContextShape?: {
      [key: string]: unknown;
    };
  },
> = () => Config['ContextOmit'] extends never
  ? NonNullable<Config['ContextShape']>
  : Omit<
      NonNullable<Config['ContextShape']> & {
        __uniqueKey_DO_NOT_USE_OR_REMOVE__?: never;
      },
      NonNullable<
        Config extends {
          ContextOmit: infer OmitType;
        }
          ? OmitType
          : ''
      >
    >;
/**
 * Always narrow and evaluate the `context` property even if `ConfigShape` just has the omitted keys. This is done
 * through the forced addition of `__uniqueKey_DO_NOT_USE_OR_REMOVE__`.
 *
 * Also do not evaluate if `ContextOmit` is undefined / never.
 */
type NarrowContextObject<
  Config extends {
    ContextOmit?: keyof NonNullable<Config['ContextShape']> | '__uniqueKey_DO_NOT_USE_OR_REMOVE__';
    ContextShape?: {
      [key: string]: unknown;
    };
  },
> = Config['ContextOmit'] extends never
  ? NonNullable<Config['ContextShape']>
  : Omit<
      NonNullable<Config['ContextShape']> & {
        __uniqueKey_DO_NOT_USE_OR_REMOVE__?: never;
      },
      NonNullable<
        Config extends {
          ContextOmit: infer OmitType;
        }
          ? OmitType
          : ''
      >
    >;
/**
 * Narrows allowed props omitting / preventing definition of anything defined in `PropsOmit`.
 */
type NarrowPropsFunction<
  Component extends SvelteComponent,
  Config extends {
    PropsOmit?: keyof ComponentProps<Component>;
  },
> = () => Partial<{
  [K in keyof ComponentProps<Component>]: K extends NonNullable<Config['PropsOmit']>
    ? never
    : ComponentProps<Component>[K];
}>;
/**
 * Narrows allowed props omitting / preventing definition of anything defined in `PropsOmit`.
 *
 * Note: If `PropsOmit` includes all valid props, the type system will allow any props.
 */
type NarrowPropsObject<
  Component extends SvelteComponent,
  Config extends {
    PropsOmit?: keyof ComponentProps<Component>;
  },
> = Partial<Omit<ComponentProps<Component>, NonNullable<Config['PropsOmit']>>>;

export { TJSSvelte };
