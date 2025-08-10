/**
 * Provides an in-process eventbus for registering and triggering events. There are three varieties from the main
 * `Eventbus` to the `EventbusProxy` and `EventbusSecure` variations. A proxy eventbus tracks local registrations to
 * an associated Eventbus and makes it easy to unregister all events on the main eventbus through the proxy solving the
 * dangling listener issue. Proxy eventbuses are used in the TyphonJS `PluginManager` to manage plugin access to the
 * manager eventbus. There also is a secure variation that can not have events registered and only is accessible for
 * triggering events.
 *
 * @module
 */

/**
 * EventbusProxy provides a protected proxy of another Eventbus instance.
 *
 * The main use case of EventbusProxy is to allow indirect access to an eventbus. This is handy when it comes to
 * managing the event lifecycle for a plugin system. When a plugin is added it could receive a callback, perhaps named
 * `onPluginLoaded`, which contains an EventbusProxy instance rather than the direct eventbus. This EventbusProxy
 * instance is associated in the management system controlling plugin lifecycle. When a plugin is removed / unloaded the
 * management system can automatically unregister all events for the plugin without requiring the plugin author doing it
 * correctly if they had full control. IE This allows to plugin system to guarantee no dangling listeners.
 *
 * EventbusProxy provides the on / off, before, once, and trigger methods with the same signatures as found in
 * Eventbus. However, the proxy tracks all added event bindings which is used to proxy between the target
 * eventbus which is passed in from the constructor. All registration methods (on / off / once) proxy. In addition,
 * there is a `destroy` method which will unregister all of proxied events and remove references to the managed
 * eventbus. Any further usage of a destroyed EventbusProxy instance results in a ReferenceError thrown.
 *
 * Finally, the EventbusProxy only allows events registered through it to be turned off providing a buffer between
 * any consumers such that they can not turn off other registrations made on the eventbus or other proxy instances.
 */
declare class EventbusProxy {
  /**
   * Creates the event proxy with an existing instance of Eventbus.
   *
   * @param {import('.').Eventbus}   eventbus - The target eventbus instance.
   */
  constructor(eventbus: Eventbus);
  /**
   * Just like `on`, but causes the bound callback to fire several times up to the count specified before being
   * removed. When multiple events are passed in using the space separated syntax, the event
   * will fire count times for every event you passed in, not once for a combination of all events.
   *
   * @param {number}            count - Number of times the function will fire before being removed.
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @param {object}            [context] - Event context
   *
   * @param {import('.').EventOptions | import('.').EventOptionsOut}   [options] - Event registration options.
   *
   * @returns {EventbusProxy} This EventbusProxy instance.
   */
  before(
    count: number,
    name: string | EventMap,
    callback: Function | object,
    context?: object,
    options?: EventOptions | EventOptionsOut,
  ): EventbusProxy;
  /**
   * Creates an EventbusProxy wrapping the backing Eventbus instance. An EventbusProxy proxies events allowing all
   * listeners added to be easily removed from the wrapped Eventbus.
   *
   * @returns {EventbusProxy} A new EventbusProxy for this eventbus.
   */
  createProxy(): EventbusProxy;
  /**
   * Unregisters all proxied events from the target eventbus and removes any local references. All subsequent calls
   * after `destroy` has been called result in a ReferenceError thrown.
   */
  destroy(): void;
  /**
   * Returns an iterable for all events from the proxied eventbus yielding an array with event name, callback function,
   * and event context.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, Function, object, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, Function, object, import('.').EventOptionsOut]}
   */
  entries(regex?: RegExp): Generator<[string, Function, object, EventOptionsOut], void, unknown>;
  /**
   * Returns the current proxied eventbus event count.
   *
   * @returns {number} Returns the current proxied event count.
   */
  get eventCount(): number;
  /**
   * Returns the current proxied eventbus callback count.
   *
   * @returns {number} Returns the current proxied callback count.
   */
  get callbackCount(): number;
  /**
   * Returns an iterable for the event names / keys of proxied eventbus event listeners.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @yields {string}
   */
  keys(regex?: RegExp): Generator<string, void, unknown>;
  /**
   * Returns an iterable for the event names / keys of registered event listeners along with event options.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, import('.').EventOptionsOut]}
   */
  keysWithOptions(regex?: RegExp): Generator<[string, EventOptionsOut], void, unknown>;
  /**
   * Returns whether this EventbusProxy has already been destroyed.
   *
   * @returns {boolean} Is destroyed state.
   */
  get isDestroyed(): boolean;
  /**
   * Returns the target eventbus name.
   *
   * @returns {string} The target eventbus name.
   */
  get name(): string;
  /**
   * Returns the current proxied event count.
   *
   * @returns {number} Returns the current proxied event count.
   */
  get proxyEventCount(): number;
  /**
   * Returns the current proxied callback count.
   *
   * @returns {number} Returns the current proxied callback count.
   */
  get proxyCallbackCount(): number;
  /**
   * Returns the options of an event name.
   *
   * @param {string}   name - Event name(s) to verify.
   *
   * @returns {import('.').EventOptionsOut} The event options.
   */
  getOptions(name: string): EventOptionsOut;
  /**
   * Returns the trigger type of event name.
   * Note: if trigger type is not set then undefined is returned for type otherwise 'sync' or 'async' is returned.
   *
   * @param {string}   name - Event name(s) to verify.
   *
   * @returns {string|undefined} The trigger type.
   */
  getType(name: string): string | undefined;
  /**
   * Returns whether an event name is guarded.
   *
   * @param {string|import('.').EventMap}  name - Event name(s) or event map to verify.
   *
   * @param {object}         [data] - Stores the output of which names are guarded.
   *
   * @returns {boolean} Whether the given event name is guarded.
   */
  isGuarded(name: string | EventMap, data?: object): boolean;
  /**
   * Remove a previously-bound proxied event binding.
   *
   * Please see {@link Eventbus#off}.
   *
   * @param {string|import('.').EventMap}  [name] - Event name(s) or event map.
   *
   * @param {Function}       [callback] - Event callback function
   *
   * @param {object}         [context] - Event context
   *
   * @returns {EventbusProxy} This EventbusProxy
   */
  off(name?: string | EventMap, callback?: Function, context?: object): EventbusProxy;
  /**
   * Bind a callback function to an object. The callback will be invoked whenever the event is fired. If you have a
   * large number of different events on a page, the convention is to use colons to namespace them: `poll:start`, or
   * `change:selection`.
   *
   * Please see {@link Eventbus#on}.
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @param {object}            [context] - Event context.
   *
   * @param {import('.').EventOptions | import('.').EventOptionsOut}   [options] - Event registration options.
   *
   * @returns {EventbusProxy} This EventbusProxy
   */
  on(
    name: string | EventMap,
    callback: Function | object,
    context?: object,
    options?: EventOptions | EventOptionsOut,
  ): EventbusProxy;
  /**
   * Just like `on`, but causes the bound callback to fire only once before being removed. Handy for saying "the next
   * time that X happens, do this". When multiple events are passed in using the space separated syntax, the event
   * will fire once for every event you passed in, not once for a combination of all events
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @param {object}            context - Event context
   *
   * @param {import('.').EventOptions | import('.').EventOptionsOut}   [options] - Event registration options.
   *
   * @returns {EventbusProxy} This EventbusProxy instance.
   */
  once(
    name: string | EventMap,
    callback: Function | object,
    context?: object,
    options?: EventOptions | EventOptionsOut,
  ): EventbusProxy;
  /**
   * Returns an iterable for all stored locally proxied events yielding an array with event name, callback
   * function, and event context.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, Function, object, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, Function, object, import('.').EventOptionsOut]}
   */
  proxyEntries(regex?: RegExp): Generator<[string, Function, object, EventOptionsOut], void, unknown>;
  /**
   * Returns an iterable for the event names / keys of the locally proxied event names.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @yields {string}
   */
  proxyKeys(regex?: RegExp): Generator<string, void, unknown>;
  /**
   * Returns an iterable for the event names / keys of the locally proxied event names with event options.
   *
   * Note: The event options returned will respect all the event options from a registered event on the main
   * eventbus if applicable.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, import('.').EventOptionsOut]}
   */
  proxyKeysWithOptions(regex?: RegExp): Generator<[string, EventOptionsOut], void, unknown>;
  /**
   * Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be
   * passed along to the event callbacks.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {EventbusProxy} This EventbusProxy.
   */
  trigger(name: string, ...args: any[]): EventbusProxy;
  /**
   * Provides `trigger` functionality, but collects any returned Promises from invoked targets and returns a
   * single Promise generated by `Promise.resolve` for a single value or `Promise.all` for multiple results. This is
   * a very useful mechanism to invoke asynchronous operations over an eventbus.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {Promise<void|*|*[]>} A Promise returning any results.
   */
  triggerAsync(name: string, ...args: any[]): Promise<void | any | any[]>;
  /**
   * Defers invoking `trigger`. This is useful for triggering events in the next clock tick.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {EventbusProxy} This EventbusProxy.
   */
  triggerDefer(name: string, ...args: any[]): EventbusProxy;
  /**
   * Provides `trigger` functionality, but collects any returned result or results from invoked targets as a single
   * value or in an array and passes it back to the callee in a synchronous manner.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {void|*|*[]} An Array of returned results.
   */
  triggerSync(name: string, ...args: any[]): void | any | any[];
  #private;
}

/**
 * EventbusSecure provides a secure wrapper around another Eventbus instance.
 *
 * The main use case of EventbusSecure is to provide a secure eventbus window for public consumption. Only
 * events can be triggered, but not registered / unregistered.
 *
 * You must use the initialize method passing in an existing Eventbus instance as the eventbus reference is private.
 * In order to secure the eventbus from unwanted access there is no way to access the eventbus reference externally from
 * the EventbusSecure instance. The initialize method returns an {@link EventbusSecureObj} object which
 * contains two functions to control the secure eventbus externally; `destroy` and `setEventbus`. Expose to end
 * consumers just the `eventbusSecure` instance.
 */
declare class EventbusSecure {
  /**
   * Creates the EventbusSecure instance with an existing instance of Eventbus. An object / EventbusSecureObj is
   * returned with an EventbusSecure reference and two functions for controlling the underlying Eventbus reference.
   *
   * `destroy()` will destroy the underlying Eventbus reference.
   * `setEventbus(<eventbus>)` will set the underlying reference.
   *
   * @param {import('.').Eventbus | import('.').EventbusProxy}  eventbus - The target eventbus instance.
   *
   * @param {string}                  [name] - If a name is provided this will be used instead of eventbus name.
   *
   * @returns {import('.').EventbusSecureObj} The control object which contains an EventbusSecure reference and
   *          control functions.
   */
  static initialize(eventbus: Eventbus | EventbusProxy, name?: string): EventbusSecureObj;
  /**
   * Returns an iterable for the event names / keys of secured eventbus event listeners.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @yields {string}
   */
  keys(regex?: RegExp): Generator<string, void, unknown>;
  /**
   * Returns an iterable for the event names / keys of registered event listeners along with event options.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, import('.').EventOptionsOut]}
   */
  keysWithOptions(regex?: RegExp): Generator<[string, EventOptionsOut], void, unknown>;
  /**
   * Returns whether this instance has already been destroyed.
   *
   * @returns {boolean} Is destroyed state.
   */
  get isDestroyed(): boolean;
  /**
   * Returns the name associated with this instance.
   *
   * @returns {string} The target eventbus name.
   */
  get name(): string;
  /**
   * Returns the options of an event name.
   *
   * @param {string}   name - Event name(s) to verify.
   *
   * @returns {import('.').EventOptionsOut} The event options.
   */
  getOptions(name: string): EventOptionsOut;
  /**
   * Returns the trigger type of event name.
   * Note: if trigger type is not set then undefined is returned for type otherwise 'sync' or 'async' is returned.
   *
   * @param {string}   name - Event name(s) to verify.
   *
   * @returns {string|undefined} The trigger type.
   */
  getType(name: string): string | undefined;
  /**
   * Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be
   * passed along to the event callbacks.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {EventbusSecure} This instance.
   */
  trigger(name: string, ...args: any[]): EventbusSecure;
  /**
   * Provides `trigger` functionality, but collects any returned Promises from invoked targets and returns a
   * single Promise generated by `Promise.resolve` for a single value or `Promise.all` for multiple results. This is
   * a very useful mechanism to invoke asynchronous operations over an eventbus.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {Promise<void|*|*[]>} A Promise to returning any results.
   */
  triggerAsync(name: string, ...args: any[]): Promise<void | any | any[]>;
  /**
   * Defers invoking `trigger`. This is useful for triggering events in the next clock tick.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {EventbusSecure} This EventbusProxy.
   */
  triggerDefer(name: string, ...args: any[]): EventbusSecure;
  /**
   * Provides `trigger` functionality, but collects any returned result or results from invoked targets as a single
   * value or in an array and passes it back to the callee in a synchronous manner.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {void|*|*[]} An Array of returned results.
   */
  triggerSync(name: string, ...args: any[]): void | any | any[];
  #private;
}

/**
 * Provides the ability to bind and trigger custom named events. Bound callback functions may be triggered
 * asynchronously or synchronously returning results.
 */
declare class Eventbus {
  /**
   * Provides a constructor which optionally takes the eventbus name.
   *
   * @param {string}   name - Optional eventbus name.
   */
  constructor(name?: string);
  /**
   * Just like `on`, but causes the bound callback to fire several times up to the count specified before being
   * removed. When multiple events are passed in using the space separated syntax, the event
   * will fire count times for every event you passed in, not once for a combination of all events.
   *
   * @param {number}            count - Number of times the function will fire before being removed.
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @param {object}            [context] - Event context
   *
   * @param {import('.').EventOptions | import('.').EventOptionsOut} [options] - Event registration options.
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  before(
    count: number,
    name: string | EventMap,
    callback: Function | object,
    context?: object,
    options?: EventOptions | EventOptionsOut,
  ): Eventbus;
  /**
   * Returns an iterable for all stored events yielding an array with event name, callback function, and event context.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, Function, object, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, Function, object, import('.').EventOptionsOut]}
   */
  entries(regex?: RegExp): Generator<[string, Function, object, EventOptionsOut], void, unknown>;
  /**
   * Returns the current event count.
   *
   * @returns {number} Returns the current event count.
   */
  get eventCount(): number;
  /**
   * Returns the current callback count.
   *
   * @returns {number} The current callback count.
   */
  get callbackCount(): number;
  /**
   * Returns the options of an event name.
   *
   * @param {string}   name - Event name(s) to verify.
   *
   * @returns {import('.').EventOptionsOut} The event options.
   */
  getOptions(name: string): EventOptionsOut;
  /**
   * Returns the trigger type of event name.
   * Note: if trigger type is not set then undefined is returned for type otherwise 'sync' or 'async' is returned.
   *
   * @param {string}   name - Event name(s) to verify.
   *
   * @returns {string|undefined} The trigger type.
   */
  getType(name: string): string | undefined;
  /**
   * Returns whether an event name is guarded.
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map to verify.
   *
   * @param {object}         [data] - Stores the output of which names are guarded.
   *
   * @returns {boolean} Whether the given event name is guarded.
   */
  isGuarded(name: string | EventMap, data?: object): boolean;
  /**
   * Returns an iterable for the event names / keys of registered event listeners.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @yields {string}
   */
  keys(regex?: RegExp): Generator<string, void, unknown>;
  /**
   * Returns an iterable for the event names / keys of registered event listeners along with event options.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter event names.
   *
   * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
   * @yields {[string, import('.').EventOptionsOut]}
   */
  keysWithOptions(regex?: RegExp): Generator<[string, EventOptionsOut], void, unknown>;
  /**
   * Returns the current eventbus name.
   *
   * @returns {string} The current eventbus name.
   */
  get name(): string;
  /**
   * Tell an object to listen to a particular event on another object. The advantage of using this form, instead of
   * other.on(event, callback, object), is that listenTo allows the object to keep track of the events, and they can
   * be removed all at once later on. The callback will always be called with object as context.
   *
   * @example
   * ```js
   * view.listenTo(model, 'change', view.render);
   * ```
   *
   * @param {object}            obj - Event context
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  listenTo(obj: object, name: string | EventMap, callback: Function | object): Eventbus;
  _listeningTo: {};
  _listenId: string;
  /**
   * Just like `listenTo`, but causes the bound callback to fire count times before being removed.
   *
   * @param {number}            count - Number of times the function will fire before being removed.
   *
   * @param {object}            obj - Target event context.
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  listenToBefore(count: number, obj: object, name: string | EventMap, callback: Function | object): Eventbus;
  /**
   * Just like `listenTo`, but causes the bound callback to fire only once before being removed.
   *
   * @param {object}            obj - Target event context
   *
   * @param {string|import('.').EventMap}     name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  listenToOnce(obj: object, name: string | EventMap, callback: Function | object): Eventbus;
  /**
   * Remove a previously-bound callback function from an object. If no context is specified, all the versions of
   * the callback with different contexts will be removed. If no callback is specified, all callbacks for the event
   * will be removed. If no event is specified, callbacks for all events will be removed.
   *
   * Note that calling model.off(), for example, will indeed remove all events on the model.
   *
   * @example
   * ```js
   * // Removes just the `onChange` callback.
   * object.off('change', onChange);
   *
   * // Removes all 'change' callbacks.
   * object.off('change');
   *
   * // Removes the `onChange` callback for all events.
   * object.off(null, onChange);
   *
   * // Removes all callbacks for `context` for all events.
   * object.off(null, null, context);
   *
   * // Removes all callbacks on `object`.
   * object.off();
   * ```
   *
   * @param {string|import('.').EventMap}   [name] - Event name(s) or event map.
   *
   * @param {Function}       [callback] - Event callback function
   *
   * @param {object}         [context] - Event context
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  off(name?: string | EventMap, callback?: Function, context?: object): Eventbus;
  /**
   * Bind a callback function to an object. The callback will be invoked whenever the event is fired. If you have a
   * large number of different events on a page, the convention is to use colons to namespace them: 'poll:start', or
   * 'change:selection'.
   *
   * To supply a context value for this when the callback is invoked, pass the optional last argument:
   * `model.on('change', this.render, this)` or `model.on({change: this.render}, this)`.
   *
   * @example
   * ```js
   * // The event string may also be a space-delimited list of several events...
   * book.on('change:title change:author', ...);
   * ```
   *
   * @example
   * ```js
   * Callbacks bound to the special 'all' event will be triggered when any event occurs, and are passed the name of
   * the event as the first argument. For example, to proxy all events from one object to another:
   * proxy.on('all', (eventName) => {
   *    object.trigger(eventName);
   * });
   * ```
   *
   * @example
   * ```js
   * All event methods also support an event map syntax, as an alternative to positional arguments:
   * book.on({
   *    'change:author': authorPane.update,
   *    'change:title change:subtitle': titleView.update,
   *    'destroy': bookView.remove
   * });
   * ```
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @param {object}            [context] - Event context
   *
   * @param {import('.').EventOptions | import('.').EventOptionsOut}         [options] - Event registration options.
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  on(
    name: string | EventMap,
    callback: Function | object,
    context?: object,
    options?: EventOptions | EventOptionsOut,
  ): Eventbus;
  _listeners: {};
  /**
   * Just like `on`, but causes the bound callback to fire only once before being removed. Handy for saying "the next
   * time that X happens, do this". When multiple events are passed in using the space separated syntax, the event
   * will fire once for every event you passed in, not once for a combination of all events
   *
   * @param {string|import('.').EventMap}   name - Event name(s) or event map.
   *
   * @param {Function|object}   callback - Event callback function or context for event map.
   *
   * @param {object}            [context] - Event context.
   *
   * @param {import('.').EventOptions | import('.').EventOptionsOut}         [options] - Event registration options.
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  once(
    name: string | EventMap,
    callback: Function | object,
    context?: object,
    options?: EventOptions | EventOptionsOut,
  ): Eventbus;
  /**
   * Tell an object to stop listening to events. Either call stopListening with no arguments to have the object remove
   * all of its registered callbacks ... or be more precise by telling it to remove just the events it's listening to
   * on a specific object, or a specific event, or just a specific callback.
   *
   * @example
   * ```js
   * view.stopListening();
   *
   * view.stopListening(model);
   * ```
   *
   * @param {object}   obj - Event context
   *
   * @param {string}   [name] - Event name(s)
   *
   * @param {Function} [callback] - Event callback function
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  stopListening(obj: object, name?: string, callback?: Function): Eventbus;
  /**
   * Trigger callbacks for the given event, or space-delimited list of events. Subsequent arguments to trigger will be
   * passed along to the event callbacks.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  trigger(name: string, ...args: any[]): Eventbus;
  /**
   * Provides `trigger` functionality, but collects any returned Promises from invoked targets and returns a
   * single Promise generated by `Promise.resolve` for a single value or `Promise.all` for multiple results. This is
   * a very useful mechanism to invoke asynchronous operations over an eventbus.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {Promise<void|*|*[]>} A Promise with any results.
   */
  triggerAsync(name: string, ...args: any[]): Promise<void | any | any[]>;
  /**
   * Defers invoking `trigger`. This is useful for triggering events in the next clock tick.
   *
   * @param {string}   name - Event name(s)
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {Eventbus} This Eventbus instance.
   */
  triggerDefer(name: string, ...args: any[]): Eventbus;
  /**
   * Provides `trigger` functionality, but collects any returned result or results from invoked targets as a single
   * value or in an array and passes it back to the callee in a synchronous manner.
   *
   * @param {string}   name - Event name(s).
   *
   * @param {...*}     args - Additional arguments passed to the event function(s).
   *
   * @returns {void|*|*[]} The results of the event invocation.
   */
  triggerSync(name: string, ...args: any[]): void | any | any[];
  #private;
}

/**
 * The callback data for an event.
 */
type EventData = {
  /**
   * Callback function
   */
  callback: Function;
  /**
   * Event context
   */
  context: object;
  /**
   * Event context or local eventbus instance.
   */
  ctx: object;
  /**
   * Holds options for this event registration, One such option is 'guarded' which
   * prevents multiple registrations.
   */
  options: EventOptionsOut;
  /**
   * Any associated listening instance.
   */
  listening?: object;
};
/**
 * Event data stored by event name.
 */
type EventbusEvents = {
  [key: string]: EventData[];
};
/**
 * Defines multiple events that can be used to registered in one API
 * call.
 */
type EventMap = {
  [key: string]: Function;
};
/**
 * The control object returned by `EventbusSecure.initialize`.
 */
type EventbusSecureObj = {
  /**
   * A function which destroys the underlying Eventbus reference.
   */
  destroy: Function;
  /**
   * The EventbusSecure instance.
   */
  eventbusSecure: EventbusSecure;
  /**
   * A
   * function to set the underlying Eventbus reference.
   */
  setEventbus: (eventbus: Eventbus | EventbusProxy, name?: string) => void;
};
/**
 * Event registration options.
 */
type EventOptions = {
  /**
   * When set to true this registration is guarded. Further attempts to register an
   * event by the same name will not be possible as long as a guarded event exists with the same name.
   */
  guard?: boolean;
  /**
   * Provides a hint on the trigger type. It may be a string 'sync' or 'async'.
   * Any other value is not recognized and internally type will be set to undefined. If the callback is a function
   * defined with the `async` modifier it will automatically be detected as async.
   */
  type?: 'sync' | 'async';
};
/**
 * The complete options for an event name returned from `entries`, etc.
 */
type EventOptionsOut = {
  /**
   * The guarded option.
   */
  guard: boolean;
  /**
   * The type option.
   */
  type: 'async' | 'sync' | void;
};

export {
  type EventData,
  type EventMap,
  type EventOptions,
  type EventOptionsOut,
  Eventbus,
  type EventbusEvents,
  EventbusProxy,
  EventbusSecure,
  type EventbusSecureObj,
};
