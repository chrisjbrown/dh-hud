/**
 * Provides common utility functions for Eventbus / EventbusProxy.
 */
class EventbusUtils
{
   /**
    * Used in instanceof checks to determine if callbacks are async.
    *
    * @type {Function}
    */
   static AsyncFunction = /* c8 ignore start */async function() {}.constructor;/* c8 ignore stop */

   /**
    * Used in instanceof checks to determine if callbacks are async.
    *
    * @type {Function}
    */
   static AsyncGeneratorFunction = /* c8 ignore start */async function *() {}.constructor;/* c8 ignore stop */

   /**
    * Regular expression used to split event strings.
    *
    * @type {RegExp}
    */
   static eventSplitter = /\s+/;

   /**
    * Iterates over the standard `event, callback` (as well as the fancy multiple space-separated events `"change blur",
    * callback` and event maps `{event: callback}`).
    *
    * @template T
    *
    * @param {Function}       iteratee - Event operation to invoke.
    *
    * @param {T}              events - EventbusEvents object
    *
    * @param {string | import('.').EventMap}  name - A single event name, compound event names, or a hash of event
    *        names.
    *
    * @param {Function}       callback - Event callback function
    *
    * @param {object}         opts - Optional parameters
    *
    * @returns {T} EventbusEvents object or processed data.
    */
   static eventsAPI(iteratee, events, name, callback, opts)
   {
      let i = 0, names;
      if (name && typeof name === 'object')
      {
         // Handle event maps.
         if (callback !== void 0 && 'context' in opts && opts.context === void 0) { opts.context = callback; }
         for (names = EventbusUtils.objectKeys(name); i < names.length; i++)
         {
            events = EventbusUtils.eventsAPI(iteratee, events, names[i], name[names[i]], opts);
         }
      }
      else if (name && typeof name === 'string' && EventbusUtils.eventSplitter.test(name))
      {
         // Handle space-separated event names by delegating them individually.
         for (names = name.split(EventbusUtils.eventSplitter); i < names.length; i++)
         {
            events = iteratee(events, names[i], callback, opts);
         }
      }
      else
      {
         // Finally, standard events.
         events = iteratee(events, name, callback, opts);
      }
      return events;
   }

   /**
    * Returns a string to output for error messages including any eventbus name.
    *
    * @param {import('.').Eventbus|import('.').EventbusProxy|import('.').EventbusSecure} eventbus - The eventbus to
    *        format.
    *
    * @returns {string} A string representing the eventbus.
    */
   static getErrorName(eventbus)
   {
      const name = eventbus.name;
      return name !== '' ? `[${name}] ` : '';
   }

   /**
    * The reducing API that returns the options for an event. Any guarded event sets guard and the higher type is set.
    *
    * @param {object}   output - The output object.
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {object} The output object.
    */
   static getOptions(output, name, callback, opts)
   {
      const events = opts.events;

      if (events)
      {
         const handlers = events[name];

         if (Array.isArray(handlers))
         {
            for (const handler of handlers)
            {
               if (handler.options.guard)
               {
                  output.guard = true;
               }

               if (handler.options.type > output.type)
               {
                  output.type = handler.options.type;
               }
            }
         }
      }

      return output;
   }

   /**
    * Provides  protected Object.keys functionality.
    *
    * @param {object}   object - Object to retrieve keys.
    *
    * @returns {string[]} Keys of object if any.
    */
   static objectKeys(object)
   {
      return object === null || typeof object !== 'object' ? [] : Object.keys(object);
   }

   /**
    * Reduces the event callbacks into a map of `{event: beforeWrapper}`. `after` unbinds the `beforeWrapper` after
    * it has been called the number of times specified by options.count.
    *
    * @param {import('.').EventbusEvents}   map - EventbusEvents object
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Function to invoke after event has been triggered once; `off()`
    *
    * @returns {import('.').EventbusEvents} The EventbusEvents object.
    */
   static beforeMap(map, name, callback, opts)
   {
      const after = opts.after;
      const count = opts.count + 1;

      if (callback)
      {
         // @ts-ignore
         const beforeWrapper = map[name] = EventbusUtils.#s_BEFORE(count, function()
         {
            return callback.apply(this, arguments);
         }, () => { after(name, beforeWrapper); });

         // @ts-ignore
         beforeWrapper._callback = callback;
      }
      return map;
   }

   /**
    * Creates a function that invokes `before`, with the `this` binding and arguments of the created function, while
    * it's called less than `count` times. Subsequent calls to the created function return the result of the last `before`
    * invocation.
    *
    * `after` is invoked after the count is reduced.
    *
    * @param {number}   count - The number of calls at which `before` is no longer invoked and then `after` is invoked.
    *
    * @param {Function} before - The function to restrict.
    *
    * @param {Function} after - The function to invoke after count number of calls.
    *
    * @returns {Function} Returns the new restricted function.
    */
   static #s_BEFORE(count, before, after)
   {
      let result;

      return function(...args)
      {
         if (--count > 0) { result = before.apply(this, args); }

         if (count <= 1)
         {
            if (after) { after.apply(this, args); }
            after = void 0;
            before = void 0;
         }

         return result;
      };
   }
}

/**
 * Provides the ability to bind and trigger custom named events. Bound callback functions may be triggered
 * asynchronously or synchronously returning results.
 */
class Eventbus
{
   /**
    * Stores the name of this eventbus.
    *
    * @type {string}
    */
   #name = '';

   /**
    * Stores the events map for associated events and callback / context data.
    *
    * @type {import('.').EventbusEvents}
    */
   #events;

   /**
    * Provides a constructor which optionally takes the eventbus name.
    *
    * @param {string}   name - Optional eventbus name.
    */
   constructor(name = '')
   {
      if (typeof name !== 'string') { throw new TypeError(`'name' is not a string`); }

      this.#name = name;

      /**
       * Stores the Listening instances for this context.
       *
       * @type {{ [key: string]: object }}
       * @private
       */
      this._listeners = void 0;

      /**
       * A unique ID set when listened to.
       *
       * @type {string}
       * @private
       */
      this._listenId = void 0;

      /**
       * Stores the Listening instances for other contexts.
       *
       * @type {{ [key: string]: object }}
       * @private
       */
      this._listeningTo = void 0;
   }

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
   before(count, name, callback, context = void 0, options = {})
   {
      if (!Number.isInteger(count)) { throw new TypeError(`'count' is not an integer`); }

      const data = {};
      if (this.isGuarded(name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- before() failed as event name(s) are guarded: ${JSON.stringify(data.names)}`);
         return this;
      }

      // Map the event into a `{event: beforeWrapper}` object.
      const events = EventbusUtils.eventsAPI(EventbusUtils.beforeMap, {}, name, callback,
       { count, after: this.off.bind(this) });

      if (typeof name === 'string' && (context === null || context === void 0)) { callback = void 0; }

      return this.on(events, callback, context, options);
   }

   /**
    * Returns an iterable for all stored events yielding an array with event name, callback function, and event context.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @returns {Generator<[string, Function, object, import('.').EventOptionsOut], void, unknown>} Generator
    * @yields {[string, Function, object, import('.').EventOptionsOut]}
    */
   *entries(regex = void 0)
   {
      if (regex !== void 0 && !(regex instanceof RegExp)) { throw new TypeError(`'regex' is not a RegExp`); }

      if (!this.#events) { return; }

      if (regex)
      {
         for (const name in this.#events)
         {
            if (regex.test(name))
            {
               for (const event of this.#events[name])
               {
                  yield [name, event.callback, event.context, JSON.parse(JSON.stringify(event.options))];
               }
            }
         }
      }
      else
      {
         for (const name in this.#events)
         {
            for (const event of this.#events[name])
            {
               yield [name, event.callback, event.context, JSON.parse(JSON.stringify(event.options))];
            }
         }
      }
   }

   /**
    * Returns the current event count.
    *
    * @returns {number} Returns the current event count.
    */
   get eventCount()
   {
      if (!this.#events) { return 0; }

      return Object.keys(this.#events).length;
   }

   /**
    * Returns the current callback count.
    *
    * @returns {number} The current callback count.
    */
   get callbackCount()
   {
      if (!this.#events) { return 0; }

      let count = 0;

      for (const name in this.#events) { count += this.#events[name].length; }

      return count;
   }

   /**
    * Returns the options of an event name.
    *
    * @param {string}   name - Event name(s) to verify.
    *
    * @returns {import('.').EventOptionsOut} The event options.
    */
   getOptions(name)
   {
      const result = EventbusUtils.eventsAPI(EventbusUtils.getOptions, { guard: false, type: 0 }, name, void 0,
       { events: this.#events });

      let type = void 0;

      switch (result.type)
      {
         case 1:
            type = 'sync';
            break;
         case 2:
            type = 'async';
            break;
      }

      return { guard: result.guard, type };
   }

   /**
    * Returns the trigger type of event name.
    * Note: if trigger type is not set then undefined is returned for type otherwise 'sync' or 'async' is returned.
    *
    * @param {string}   name - Event name(s) to verify.
    *
    * @returns {string|undefined} The trigger type.
    */
   getType(name)
   {
      const result = EventbusUtils.eventsAPI(Eventbus.#s_GET_TYPE, { type: 0 }, name, void 0, { events: this.#events });

      switch (result.type)
      {
         case 1:
            return 'sync';
         case 2:
            return 'async';
         default:
            return void 0;
      }
   }

   /**
    * Returns whether an event name is guarded.
    *
    * @param {string|import('.').EventMap}   name - Event name(s) or event map to verify.
    *
    * @param {object}         [data] - Stores the output of which names are guarded.
    *
    * @returns {boolean} Whether the given event name is guarded.
    */
   isGuarded(name, data = {})
   {
      data.names = [];
      data.guarded = false;

      const result = EventbusUtils.eventsAPI(Eventbus.#s_IS_GUARDED, data, name, void 0, { events: this.#events });

      return result.guarded;
   }

   /**
    * Returns an iterable for the event names / keys of registered event listeners.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @yields {string}
    */
   *keys(regex = void 0)
   {
      if (regex !== void 0 && !(regex instanceof RegExp)) { throw new TypeError(`'regex' is not a RegExp`); }

      if (!this.#events) { return; }

      if (regex)
      {
         for (const name in this.#events)
         {
            if (regex.test(name))
            {
               yield name;
            }
         }
      }
      else
      {
         for (const name in this.#events)
         {
            yield name;
         }
      }
   }

   /**
    * Returns an iterable for the event names / keys of registered event listeners along with event options.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
    * @yields {[string, import('.').EventOptionsOut]}
    */
   *keysWithOptions(regex = void 0)
   {
      if (regex !== void 0 && !(regex instanceof RegExp)) { throw new TypeError(`'regex' is not a RegExp`); }

      if (!this.#events) { return; }

      if (regex)
      {
         for (const name in this.#events)
         {
            if (regex.test(name))
            {
               yield [name, this.getOptions(name)];
            }
         }
      }
      else
      {
         for (const name in this.#events)
         {
            yield [name, this.getOptions(name)];
         }
      }
   }

   /**
    * Returns the current eventbus name.
    *
    * @returns {string} The current eventbus name.
    */
   get name()
   {
      return this.#name;
   }

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
   listenTo(obj, name, callback)
   {
      if (!obj) { return this; }

      const data = {};
      if (Eventbus.#s_TRY_CATCH_IS_GUARDED(obj, name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- listenTo() failed as event name(s) are guarded for target object: ${JSON.stringify(data.names)}`);
         return this;
      }

      const id = obj._listenId || (obj._listenId = Eventbus.#s_UNIQUE_ID('l'));
      const listeningTo = this._listeningTo || (this._listeningTo = {});
      let listening = Eventbus.#listening = listeningTo[id];

      // This object is not listening to any other events on `obj` yet.
      // Set up the necessary references to track the listening callbacks.
      if (!listening)
      {
         this._listenId || (this._listenId = Eventbus.#s_UNIQUE_ID('l'));
         listening = Eventbus.#listening = listeningTo[id] = new Eventbus.#Listening(this, obj);
      }

      // Bind callbacks on obj.
      const error = Eventbus.#s_TRY_CATCH_ON(obj, name, callback, this);
      Eventbus.#listening = void 0;

      if (error) { throw error; }

      // If the target obj is not an Eventbus, track events manually.
      if (listening.interop) { listening.on(name, callback); }

      return this;
   }

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
   listenToBefore(count, obj, name, callback)
   {
      if (!Number.isInteger(count)) { throw new TypeError(`'count' is not an integer`); }

      // Map the event into a `{event: beforeWrapper}` object.
      const events = EventbusUtils.eventsAPI(EventbusUtils.beforeMap, {}, name, callback, {
         count,
         after: this.stopListening.bind(this, obj)
      });

      return this.listenTo(obj, events);
   }

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
   listenToOnce(obj, name, callback)
   {
      // Map the event into a `{event: beforeWrapper}` object.
      const events = EventbusUtils.eventsAPI(EventbusUtils.beforeMap, {}, name, callback, {
         count: 1,
         after: this.stopListening.bind(this, obj)
      });

      return this.listenTo(obj, events);
   }

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
   off(name, callback = void 0, context = void 0)
   {
      if (!this.#events) { return this; }

      this.#events = EventbusUtils.eventsAPI(Eventbus.#s_OFF_API, this.#events, name, callback,
       { context, listeners: this._listeners });

      return this;
   }

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
   on(name, callback, context = void 0, options = {})
   {
      if (options == null || options.constructor !== Object)   // eslint-disable-line eqeqeq
      {
         throw new TypeError(`'options' must be an object literal.`);
      }

      const data = {};
      if (this.isGuarded(name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- on() failed as event name(s) are guarded: ${JSON.stringify(data.names)}`);
         return this;
      }

      this.#events = EventbusUtils.eventsAPI(Eventbus.#s_ON_API, this.#events || {}, name, callback, {
         context,
         ctx: this,
         options,
         listening: Eventbus.#listening
      });

      if (Eventbus.#listening)
      {
         const listeners = this._listeners || (this._listeners = {});
         listeners[Eventbus.#listening.id] = Eventbus.#listening;

         // Allow the listening to use a counter, instead of tracking callbacks for library interop.
         Eventbus.#listening.interop = false;
      }

      return this;
   }

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
   once(name, callback, context = void 0, options = {})
   {
      const data = {};
      if (this.isGuarded(name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- once() failed as event name(s) are guarded: ${JSON.stringify(data.names)}`);
         return this;
      }

      // Map the event into a `{event: beforeWrapper}` object.
      const events = EventbusUtils.eventsAPI(EventbusUtils.beforeMap, {}, name, callback,
       { count: 1, after: this.off.bind(this) });

      if (typeof name === 'string' && (context === null || context === void 0)) { callback = void 0; }

      return this.on(events, callback, context, options);
   }

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
   stopListening(obj, name = void 0, callback = void 0)
   {
      const listeningTo = this._listeningTo;
      if (!listeningTo) { return this; }

      const ids = obj ? [obj._listenId] : EventbusUtils.objectKeys(listeningTo);

      for (let i = 0; i < ids.length; i++)
      {
         const listening = listeningTo[ids[i]];

         // If listening doesn't exist, this object is not currently listening to obj. Break out early.
         if (!listening) { break; }

         listening.obj.off(name, callback, this);

         if (listening.interop) { listening.off(name, callback); }
      }

      return this;
   }

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
   trigger(name, ...args)
   {
      if (!this.#events) { return this; }

      Eventbus.#s_RESULTS_TARGET_API(Eventbus.#s_TRIGGER_API, Eventbus.#s_TRIGGER_EVENTS, this.#events, name, void 0,
       args);

      return this;
   }

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
   async triggerAsync(name, ...args)
   {
      if (!this.#events) { return void 0; }

      const result = Eventbus.#s_RESULTS_TARGET_API(Eventbus.#s_TRIGGER_API, Eventbus.#s_TRIGGER_ASYNC_EVENTS,
       this.#events, name, void 0, args);

      // No event callbacks were triggered.
      if (result === void 0) { return void 0; }

      // A single Promise has been returned; just return it.
      if (!Array.isArray(result)) { return result; }

      // Multiple events & callbacks have been triggered so reduce the returned array of Promises and filter all
      // values from each Promise result removing any undefined values.
      return Promise.all(result).then((results) =>
      {
         let allResults = [];

         for (const pResult of results)
         {
            if (Array.isArray(pResult))
            {
               allResults = allResults.concat(pResult);
            }
            else if (pResult !== void 0)
            {
               allResults.push(pResult);
            }
         }

         return allResults.length > 1 ? allResults : allResults.length === 1 ? allResults[0] : void 0;
      });
   }

   /**
    * Defers invoking `trigger`. This is useful for triggering events in the next clock tick.
    *
    * @param {string}   name - Event name(s)
    *
    * @param {...*}     args - Additional arguments passed to the event function(s).
    *
    * @returns {Eventbus} This Eventbus instance.
    */
   triggerDefer(name, ...args)
   {
      setTimeout(() => { this.trigger(name, ...args); }, 0);

      return this;
   }

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
   triggerSync(name, ...args)
   {
      if (!this.#events) { return void 0; }

      return Eventbus.#s_RESULTS_TARGET_API(Eventbus.#s_TRIGGER_API, Eventbus.#s_TRIGGER_SYNC_EVENTS, this.#events,
       name, void 0, args);
   }

   // Internal static reducers and data ------------------------------------------------------------------------------

   /**
    * Generate a unique integer ID (unique within the entire client session).
    *
    * @type {number} - unique ID counter.
    */
   static #idCounter = 0;

   /**
    * Static listening object
    *
    * @type {object}
    */
   static #listening;

   /**
    * A listening class that tracks and cleans up memory bindings when all callbacks have been offed.
    */
   static #Listening = class
   {
      /**
       * @type {import('.').EventbusEvents|{}}
       */
      #events;

      /**
       * @type {string}
       */
      #id;

      /**
       * @type {object}
       */
      #listener;

      /**
       * @type {object}
       */
      #obj;

      /**
       * @type {boolean}
       */
      #interop;

      /**
       * Current listening count.
       *
       * @type {number}
       */
      #count = 0;

      constructor(listener, obj)
      {
         this.#id = listener._listenId;
         this.#listener = listener;
         this.#obj = obj;
         this.#interop = true;
      }

      // Cleans up memory bindings between the listener and the target of the listener.
      cleanup()
      {
         delete this.#listener._listeningTo[this.#obj._listenId];
         if (!this.#interop) { delete this.#obj._listeners[this.#id]; }
      }

      get id() { return this.#id; }

      get interop() { return this.#interop; }

      get obj() { return this.#obj; }

      incrementCount() { this.#count++; }

      /**
       * @see {@link Eventbus#on}
       *
       * @param {string|import('.').EventMap}   name - Event name(s) or event map.
       *
       * @param {Function|object}   callback - Event callback function or context for event map.
       *
       * @param {object}            [context] - Event context
       *
       * @returns {object} This Listening instance.
       */
      on(name, callback, context = void 0)
      {
         this.#events = EventbusUtils.eventsAPI(Eventbus.#s_ON_API, this.#events || {}, name, callback,
         {
            context,
            ctx: this,
            options: {},
            listening: this
         });

         return this;
      }

      /**
       * Offs a callback (or several). Uses an optimized counter if the target of the listener uses Eventbus. Otherwise,
       * falls back to manual tracking to support events library interop.
       *
       * @param {string|import('.').EventMap}   [name] - Event name(s) or event map.
       *
       * @param {Function|object}   [callback] - Event callback function or context for event map.
       */
      off(name, callback)
      {
         let cleanup;

         if (this.#interop)
         {
            this.#events = EventbusUtils.eventsAPI(Eventbus.#s_OFF_API, this.#events, name, callback, {
               context: void 0,
               listeners: void 0
            });
            cleanup = !this.#events;
         }
         else
         {
            this.#count--;
            cleanup = this.#count === 0;
         }

         if (cleanup) { this.cleanup(); }
      }

      /**
       * Sets interop.
       *
       * @param {boolean} value Value to set.
       */
      set interop(value)
      {
         /* c8 ignore next 1 */
         if (typeof value !== 'boolean') { throw new TypeError(`'value' is not a boolean`); }
         this.#interop = value;
      }
   };

   /**
    * The reducing API that returns the trigger type for an event. The higher type is set.
    *
    * @param {object}   output - The output object.
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {object} The output object.
    */
   static #s_GET_TYPE(output, name, callback, opts)
   {
      const events = opts.events;

      if (events)
      {
         const handlers = events[name];

         if (Array.isArray(handlers))
         {
            for (const handler of handlers)
            {
               if (handler.options.type > output.type)
               {
                  output.type = handler.options.type;
               }
            }
         }
      }

      return output;
   }

   /**
    * The reducing API that tests if an event name is guarded. Any event data of a give event name can have the guarded
    * state set. If so the event name will be added to the output names array and `output.guarded` set to true.
    *
    * @param {object}   output - The output object.
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {object} The output object.
    */
   static #s_IS_GUARDED(output, name, callback, opts)
   {
      const events = opts.events;

      if (events)
      {
         const handlers = events[name];

         if (Array.isArray(handlers))
         {
            for (const handler of handlers)
            {
               if (handler.options.guard)
               {
                  output.names.push(name);
                  output.guarded = true;
                  return output;
               }
            }
         }
      }

      return output;
   }

   /**
    * The reducing API that removes a callback from the `events` object.
    *
    * @param {import('.').EventbusEvents}   events - EventbusEvents object
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {void | import('.').EventbusEvents} EventbusEvents object
    */
   static #s_OFF_API(events, name, callback, opts)
   {
      /* c8 ignore next 1 */
      if (!events) { return; }

      const context = opts.context, listeners = opts.listeners;
      let i = 0, names;

      // Delete all event listeners and `drop` events.
      if (!name && !context && !callback)
      {
         for (names = EventbusUtils.objectKeys(listeners); i < names.length; i++)
         {
            listeners[names[i]].cleanup();
         }
         return;
      }

      names = name ? [name] : EventbusUtils.objectKeys(events);

      for (; i < names.length; i++)
      {
         name = names[i];
         const handlers = events[name];

         // Bail out if there are no events stored.
         if (!handlers) { break; }

         // Find any remaining events.
         const remaining = [];
         for (let j = 0; j < handlers.length; j++)
         {
            const handler = handlers[j];
            // @ts-ignore
            if (callback && callback !== handler.callback && callback !== handler.callback._callback ||
             context && context !== handler.context)
            {
               remaining.push(handler);
            }
            else
            {
               const listening = handler.listening;
               if (listening) { listening.off(name, callback); }
            }
         }

         // Replace events if there are any remaining.  Otherwise, clean up.
         if (remaining.length)
         {
            events[name] = remaining;
         }
         else
         {
            delete events[name];
         }
      }

      return events;
   }

   /**
    * The reducing API that adds a callback to the `events` object.
    *
    * @param {import('.').EventbusEvents}   events - EventbusEvents object
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {import('.').EventbusEvents} EventbusEvents object.
    */
   static #s_ON_API(events, name, callback, opts)
   {
      if (callback)
      {
         const handlers = events[name] || (events[name] = []);
         const context = opts.context, ctx = opts.ctx, listening = opts.listening;

         // Make a copy of options.
         const options = JSON.parse(JSON.stringify(opts.options));

         // Ensure that guard is set.
         options.guard = typeof options.guard === 'boolean' ? options.guard : false;

         // Determine automatically if the callback is `async` via being defined with the `async` modifier.
         if (callback instanceof EventbusUtils.AsyncFunction ||
          callback instanceof EventbusUtils.AsyncGeneratorFunction)
         {
            options.type = 2;
         }
         else
         {
            // Ensure that type is set.
            switch (options.type)
            {
               case 'sync':
                  options.type = 1;
                  break;
               case 'async':
                  options.type = 2;
                  break;
               default:
                  options.type = 0;
                  break;
            }
         }

         if (listening) { listening.incrementCount(); }

         handlers.push({ callback, context, ctx: context || ctx, options, listening });
      }
      return events;
   }

   /**
    * Iterates over the standard `event, callback` (as well as the fancy multiple space-separated events `"change blur",
    * callback` and event maps `{event: callback}`).
    *
    * @param {Function} iteratee - Trigger API
    *
    * @param {Function} iterateeTarget - Internal function which is dispatched to.
    *
    * @param {import('.').EventbusEvents | {}}   events - Array of stored event callback data.
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {*} The results of the callback if any.
    */
   static #s_RESULTS_TARGET_API(iteratee, iterateeTarget, events, name, callback, opts)
   {
      let results = void 0;
      let i = 0, names;

      // Handle the case of multiple events being triggered. The potential results of each event & callbacks must be
      // processed into a single array of results.
      if (name && EventbusUtils.eventSplitter.test(name))
      {
         // Handle space-separated event names by delegating them individually.
         for (names = name.split(EventbusUtils.eventSplitter); i < names.length; i++)
         {
            const result = iteratee(iterateeTarget, events, names[i], callback, opts);

            // Determine type of `results`; 0: undefined, 1: single value, 2: an array of values.
            const resultsType = Array.isArray(results) ? 2 : results !== void 0 ? 1 : 0;

            // Handle an array result depending on existing results value.
            if (Array.isArray(result))
            {
               switch (resultsType)
               {
                  case 0:
                     // Simply set results.
                     results = result;
                     break;
                  case 1:
                     // Create a new array from existing results then concat the new result array.
                     results = [results].concat(result);
                     break;
                  case 2:
                     // `results` is already an array so concat the new result array.
                     results = results.concat(result);
                     break;
               }
            }
            else if (result !== void 0)
            {
               switch (resultsType)
               {
                  case 0:
                     // Simply set results.
                     results = result;
                     break;
                  case 1: {
                     // Create a new array from existing results then push the new result value.
                     const newArray = [results];
                     newArray.push(result);
                     results = newArray;
                     break;
                  }
                  case 2:
                     // `results` is already an array so push the new result array.
                     results.push(result);
                     break;
               }
            }
         }
      }
      else
      {
         // Just single event.
         results = iteratee(iterateeTarget, events, name, callback, opts);
      }

      return results;
   }

   /**
    * Handles triggering the appropriate event callbacks.
    *
    * @param {Function} iterateeTarget - Internal function which is dispatched to.
    *
    * @param {import('.').EventbusEvents}   objEvents - Array of stored event callback data.
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - callback
    *
    * @param {*[]}      args - Arguments supplied to a trigger method.
    *
    * @returns {*} The results from the triggered event.
    */
   static #s_TRIGGER_API(iterateeTarget, objEvents, name, callback, args)
   {
      let result;

      if (objEvents)
      {
         const events = objEvents[name];
         let allEvents = objEvents.all;
         if (events && allEvents) { allEvents = allEvents.slice(); }
         if (events) { result = iterateeTarget(events, args); }
         if (allEvents) { result = iterateeTarget(allEvents, [name].concat(args)); }
      }

      return result;
   }

   /**
    * A difficult-to-believe, but optimized internal dispatch function for triggering events. Tries to keep the usual
    * cases speedy.
    *
    * @param {import('.').EventData[]} events - Array of stored event callback data.
    *
    * @param {*[]}         args - Event argument array
    */
   static #s_TRIGGER_EVENTS(events, args)
   {
      let ev, i = -1;
      const a1 = args[0], a2 = args[1], a3 = args[2], l = events.length;

      switch (args.length)
      {
         case 0:
            while (++i < l) { (ev = events[i]).callback.call(ev.ctx); }
            return;
         case 1:
            while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1); }
            return;
         case 2:
            while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1, a2); }
            return;
         case 3:
            while (++i < l) { (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); }
            return;
         default:
            while (++i < l) { (ev = events[i]).callback.apply(ev.ctx, args); }
            return;
      }
   }

   /**
    * A difficult-to-believe, but optimized internal dispatch function for triggering events. Tries to keep the usual
    * cases speedy. This dispatch method uses ES6 Promises and adds any returned results to an array which is added to
    * a `Promise.all` construction which passes back a Promise which waits until all Promises complete. Any target
    * invoked may return a Promise or any result. This is very useful to use for any asynchronous operations.
    *
    * @param {import('.').EventData[]} events - Array of stored event callback data.
    *
    * @param {*[]}         args - Arguments supplied to `triggerAsync`.
    *
    * @returns {Promise<void|*|*[]>} A Promise of the results from the triggered event.
    */
   static async #s_TRIGGER_ASYNC_EVENTS(events, args)
   {
      let ev, i = -1;
      const a1 = args[0], a2 = args[1], a3 = args[2], l = events.length;

      const results = [];

      switch (args.length)
      {
         case 0:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx);

               // If we received a valid result add it to the promises array.
               if (result !== void 0) { results.push(result); }
            }
            break;

         case 1:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx, a1);

               // If we received a valid result add it to the promises array.
               if (result !== void 0) { results.push(result); }
            }
            break;

         case 2:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx, a1, a2);

               // If we received a valid result add it to the promises array.
               if (result !== void 0) { results.push(result); }
            }
            break;

         case 3:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);

               // If we received a valid result add it to the promises array.
               if (result !== void 0) { results.push(result); }
            }
            break;

         default:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.apply(ev.ctx, args);

               // If we received a valid result add it to the promises array.
               if (result !== void 0) { results.push(result); }
            }
            break;
      }

      // If there are multiple results then use Promise.all otherwise Promise.resolve. Filter out any undefined results.
      return results.length > 1 ? Promise.all(results).then((values) =>
      {
         const filtered = values.filter((entry) => entry !== void 0);
         switch (filtered.length)
         {
            case 0: return void 0;
            case 1: return filtered[0];
            default: return filtered;
         }
      }) : results.length === 1 ? results[0] : void 0;
   }

   /**
    * A difficult-to-believe, but optimized internal dispatch function for triggering events. Tries to keep the usual
    * cases speedy. This dispatch method synchronously passes back a single value or an array with all results returned
    * by any invoked targets.
    *
    * @param {import('.').EventData[]} events - Array of stored event callback data.
    *
    * @param {*[]}         args - Arguments supplied to `triggerSync`.
    *
    * @returns {void|*|*[]} The results from the triggered event.
    */
   static #s_TRIGGER_SYNC_EVENTS(events, args)
   {
      let ev, i = -1;
      const a1 = args[0], a2 = args[1], a3 = args[2], l = events.length;

      const results = [];

      switch (args.length)
      {
         case 0:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx);

               // If we received a valid result return immediately.
               if (result !== void 0) { results.push(result); }
            }
            break;
         case 1:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx, a1);

               // If we received a valid result return immediately.
               if (result !== void 0) { results.push(result); }
            }
            break;
         case 2:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx, a1, a2);

               // If we received a valid result return immediately.
               if (result !== void 0) { results.push(result); }
            }
            break;
         case 3:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.call(ev.ctx, a1, a2, a3);

               // If we received a valid result return immediately.
               if (result !== void 0) { results.push(result); }
            }
            break;
         default:
            while (++i < l)
            {
               const result = (ev = events[i]).callback.apply(ev.ctx, args);

               // If we received a valid result return immediately.
               if (result !== void 0) { results.push(result); }
            }
            break;
      }

      // Return the results array if there are more than one or just a single result.
      return results.length > 1 ? results : results.length === 1 ? results[0] : void 0;
   }

   /**
    * A try-catch guarded function. Used when attempting to invoke `isGuarded` from another eventbus / context via
    * `listenTo`.
    *
    * @param {object}         obj - Event target / context
    *
    * @param {string|import('.').EventMap}   name - Event name(s) or event map.
    *
    * @param {object}         data - Output data.
    *
    * @returns {boolean} Any error if thrown.
    */
   static #s_TRY_CATCH_IS_GUARDED(obj, name, data = {})
   {
      let guarded = false;

      try
      {
         const result = obj.isGuarded(name, data);
         if (typeof result === 'boolean') { guarded = result; }
      }
      catch (err)
      {
         guarded = false;
         data.names = [];
         data.guarded = false;
      }

      return guarded;
   }

   /**
    * A try-catch guarded #on function, to prevent poisoning the static `Eventbus.#listening` variable. Used when
    * attempting to invoke `on` from another eventbus / context via `listenTo`.
    *
    * @param {object}            obj - Event target / context
    *
    * @param {string|import('.').EventMap}   name - Event name(s) or event map.
    *
    * @param {Function|object}   callback - Event callback function or context for event map.
    *
    * @param {object}            [context] - Event context
    *
    * @returns {Error} Any error if thrown.
    */
   static #s_TRY_CATCH_ON(obj, name, callback, context)
   {
      let error;

      try
      {
         obj.on(name, callback, context);
      }
      catch (err)
      {
         error = err;
      }

      return error;
   }

   /**
    * Creates a new unique ID with a given prefix
    *
    * @param {string}   prefix - An optional prefix to add to unique ID.
    *
    * @returns {string} A new unique ID with a given prefix.
    */
   static #s_UNIQUE_ID(prefix = '')
   {
      const id = `${++Eventbus.#idCounter}`;
      return prefix ? `${prefix}${id}` /* c8 ignore next */ : id;
   }
}

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
class EventbusProxy
{
   /**
    * Stores the target eventbus.
    *
    * @type {import('.').Eventbus}
    */
   #eventbus;

   /**
    * Stores all proxied event bindings.
    *
    * @type {import('.').EventbusEvents}
    */
   #events;

   /**
    * Creates the event proxy with an existing instance of Eventbus.
    *
    * @param {import('.').Eventbus}   eventbus - The target eventbus instance.
    */
   constructor(eventbus)
   {
      this.#eventbus = eventbus;

      Object.seal(this);
   }

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
   before(count, name, callback, context = void 0, options = {})
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }
      if (!Number.isInteger(count)) { throw new TypeError(`'count' is not an integer`); }

      const data = {};
      if (this.#eventbus.isGuarded(name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- before() failed as event name(s) are guarded: ${JSON.stringify(data.names)}`);
         return this;
      }

      // Map the event into a `{event: beforeWrapper}` object.
      const events = EventbusUtils.eventsAPI(EventbusUtils.beforeMap, {}, name, callback,
       { count, after: this.off.bind(this) });

      if (typeof name === 'string' && (context === null || context === void 0)) { callback = void 0; }

      return this.on(events, callback, context, options);
   }

   /**
    * Creates an EventbusProxy wrapping the backing Eventbus instance. An EventbusProxy proxies events allowing all
    * listeners added to be easily removed from the wrapped Eventbus.
    *
    * @returns {EventbusProxy} A new EventbusProxy for this eventbus.
    */
   createProxy()
   {
      return new EventbusProxy(this.#eventbus);
   }

   /**
    * Unregisters all proxied events from the target eventbus and removes any local references. All subsequent calls
    * after `destroy` has been called result in a ReferenceError thrown.
    */
   destroy()
   {
      if (this.#eventbus !== null)
      {
         this.off();
      }

      this.#events = void 0;

      this.#eventbus = null;
   }

   /**
    * Returns an iterable for all events from the proxied eventbus yielding an array with event name, callback function,
    * and event context.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @returns {Generator<[string, Function, object, import('.').EventOptionsOut], void, unknown>} Generator
    * @yields {[string, Function, object, import('.').EventOptionsOut]}
    */
   *entries(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      for (const entry of this.#eventbus.entries(regex))
      {
         yield entry;
      }
   }

   /**
    * Returns the current proxied eventbus event count.
    *
    * @returns {number} Returns the current proxied event count.
    */
   get eventCount()
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.eventCount;
   }

   /**
    * Returns the current proxied eventbus callback count.
    *
    * @returns {number} Returns the current proxied callback count.
    */
   get callbackCount()
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.callbackCount;
   }

   /**
    * Returns an iterable for the event names / keys of proxied eventbus event listeners.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @yields {string}
    */
   *keys(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      for (const entry of this.#eventbus.keys(regex))
      {
         yield entry;
      }
   }

   /**
    * Returns an iterable for the event names / keys of registered event listeners along with event options.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
    * @yields {[string, import('.').EventOptionsOut]}
    */
   *keysWithOptions(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      for (const entry of this.#eventbus.keysWithOptions(regex))
      {
         yield entry;
      }
   }

   /**
    * Returns whether this EventbusProxy has already been destroyed.
    *
    * @returns {boolean} Is destroyed state.
    */
   get isDestroyed()
   {
      return this.#eventbus === null;
   }

   /**
    * Returns the target eventbus name.
    *
    * @returns {string} The target eventbus name.
    */
   get name()
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return `proxy-${this.#eventbus.name}`;
   }

   /**
    * Returns the current proxied event count.
    *
    * @returns {number} Returns the current proxied event count.
    */
   get proxyEventCount()
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      if (!this.#events) { return 0; }

      return Object.keys(this.#events).length;
   }

   /**
    * Returns the current proxied callback count.
    *
    * @returns {number} Returns the current proxied callback count.
    */
   get proxyCallbackCount()
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      if (!this.#events) { return 0; }

      let count = 0;

      for (const name in this.#events) { count += this.#events[name].length; }

      return count;
   }

   /**
    * Returns the options of an event name.
    *
    * @param {string}   name - Event name(s) to verify.
    *
    * @returns {import('.').EventOptionsOut} The event options.
    */
   getOptions(name)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.getOptions(name);
   }

   /**
    * Returns the trigger type of event name.
    * Note: if trigger type is not set then undefined is returned for type otherwise 'sync' or 'async' is returned.
    *
    * @param {string}   name - Event name(s) to verify.
    *
    * @returns {string|undefined} The trigger type.
    */
   getType(name)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.getType(name);
   }

   /**
    * Returns whether an event name is guarded.
    *
    * @param {string|import('.').EventMap}  name - Event name(s) or event map to verify.
    *
    * @param {object}         [data] - Stores the output of which names are guarded.
    *
    * @returns {boolean} Whether the given event name is guarded.
    */
   isGuarded(name, data = {})
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.isGuarded(name, data);
   }

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
   off(name = void 0, callback = void 0, context = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      this.#events = EventbusUtils.eventsAPI(EventbusProxy.#s_OFF_API, this.#events || {}, name, callback, {
         context,
         eventbus: this.#eventbus,
      });

      return this;
   }

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
   on(name, callback, context = void 0, options = {})
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      if (options == null || options.constructor !== Object)   // eslint-disable-line eqeqeq
      {
         throw new TypeError(`'options' must be an object literal.`);
      }

      const data = {};
      if (this.#eventbus.isGuarded(name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- on() failed as event name(s) are guarded: ${JSON.stringify(data.names)}`);
         return this;
      }

      // Hang onto the options as s_ON_API sets the context we need to pass to the eventbus in `opts.ctx`.
      const opts = { context, ctx: this, options };

      this.#events = EventbusUtils.eventsAPI(EventbusProxy.#s_ON_API, this.#events || {}, name, callback, opts);

      this.#eventbus.on(name, callback, opts.ctx, options);

      return this;
   }

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
   once(name, callback, context = void 0, options = {})
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      const data = {};
      if (this.#eventbus.isGuarded(name, data))
      {
         console.warn(`@typhonjs-plugin/eventbus ${EventbusUtils.getErrorName(this)}` +
          `- once() failed as event name(s) are guarded: ${JSON.stringify(data.names)}`);
         return this;
      }

      // Map the event into a `{event: beforeWrapper}` object.
      const events = EventbusUtils.eventsAPI(EventbusUtils.beforeMap, {}, name, callback,
       { count: 1, after: this.off.bind(this) });

      if (typeof name === 'string' && (context === null || context === void 0)) { callback = void 0; }

      return this.on(events, callback, context, options);
   }

   /**
    * Returns an iterable for all stored locally proxied events yielding an array with event name, callback
    * function, and event context.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @returns {Generator<[string, Function, object, import('.').EventOptionsOut], void, unknown>} Generator
    * @yields {[string, Function, object, import('.').EventOptionsOut]}
    */
   *proxyEntries(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }
      if (regex !== void 0 && !(regex instanceof RegExp)) { throw new TypeError(`'regex' is not a RegExp`); }

      if (!this.#events) { return; }

      if (regex)
      {
         for (const name in this.#events)
         {
            if (regex.test(name))
            {
               for (const event of this.#events[name])
               {
                  yield [name, event.callback, event.context, JSON.parse(JSON.stringify(event.options))];
               }
            }
         }
      }
      else
      {
         for (const name in this.#events)
         {
            for (const event of this.#events[name])
            {
               yield [name, event.callback, event.context, JSON.parse(JSON.stringify(event.options))];
            }
         }
      }
   }

   /**
    * Returns an iterable for the event names / keys of the locally proxied event names.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @yields {string}
    */
   *proxyKeys(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }
      if (regex !== void 0 && !(regex instanceof RegExp)) { throw new TypeError(`'regex' is not a RegExp`); }

      if (!this.#events) { return; }

      if (regex)
      {
         for (const name in this.#events)
         {
            if (regex.test(name))
            {
               yield name;
            }
         }
      }
      else
      {
         for (const name in this.#events)
         {
            yield name;
         }
      }
   }

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
   *proxyKeysWithOptions(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }
      if (regex !== void 0 && !(regex instanceof RegExp)) { throw new TypeError(`'regex' is not a RegExp`); }

      if (regex)
      {
         for (const name in this.#events)
         {
            if (regex.test(name))
            {
               yield [name, this.#eventbus.getOptions(name)];
            }
         }
      }
      else
      {
         for (const name in this.#events)
         {
            yield [name, this.#eventbus.getOptions(name)];
         }
      }
   }

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
   trigger(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      this.#eventbus.trigger(name, ...args);

      return this;
   }

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
   triggerAsync(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.triggerAsync(name, ...args);
   }

   /**
    * Defers invoking `trigger`. This is useful for triggering events in the next clock tick.
    *
    * @param {string}   name - Event name(s)
    *
    * @param {...*}     args - Additional arguments passed to the event function(s).
    *
    * @returns {EventbusProxy} This EventbusProxy.
    */
   triggerDefer(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      this.#eventbus.triggerDefer(name, ...args);

      return this;
   }

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
   triggerSync(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusProxy instance has been destroyed.'); }

      return this.#eventbus.triggerSync(name, ...args);
   }

   // Internal reducer API -------------------------------------------------------------------------------------------

   /**
    * The reducing API that removes a callback from the `events` object. And delegates invoking off to the eventbus
    * reference.
    *
    * @param {import('.').EventbusEvents}   events - EventbusEvents object
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {void | import('.').EventbusEvents} EventbusEvents object
    */
   static #s_OFF_API(events, name, callback, opts)
   {
      /* c8 ignore next 1 */
      if (!events) { return; }

      const context = opts.context;
      const eventbus = opts.eventbus;

      const names = name ? [name] : EventbusUtils.objectKeys(events);

      for (let i = 0; i < names.length; i++)
      {
         name = names[i];
         const handlers = events[name];

         // Bail out if there are no events stored.
         if (!handlers) { break; }

         // Find any remaining events.
         const remaining = [];
         for (let j = 0; j < handlers.length; j++)
         {
            const handler = handlers[j];

            // @ts-ignore
            if ((callback && callback !== handler.callback && callback !== handler.callback._callback) ||
             (context && context !== handler.context))
            {
               remaining.push(handler);
               continue;
            }

            // Must explicitly remove the event by the stored full set of name, handler, context to ensure
            // non-proxied event registrations are not removed.
            /* c8 ignore next 1 */ // @ts-ignore
            eventbus.off(name, handler.callback || handler.callback._callback, handler.context || handler.ctx);
         }

         // Replace events if there are any remaining.  Otherwise, clean up.
         if (remaining.length)
         {
            events[name] = remaining;
         }
         else
         {
            // eventbus.off(name, callback, context);
            delete events[name];
         }
      }

      return events;
   }

   /**
    * The reducing API that adds a callback to the `events` object.
    *
    * @param {import('.').EventbusEvents}   events - EventbusEvents object
    *
    * @param {string}   name - Event name
    *
    * @param {Function} callback - Event callback
    *
    * @param {object}   opts - Optional parameters
    *
    * @returns {import('.').EventbusEvents} EventbusEvents object.
    */
   static #s_ON_API(events, name, callback, opts)
   {
      if (callback)
      {
         const handlers = events[name] || (events[name] = []);
         const context = opts.context, ctx = opts.ctx;

         // Make a copy of options.
         const options = JSON.parse(JSON.stringify(opts.options));

         // Ensure that guard is set.
         options.guard = options.guard !== void 0 && typeof options.guard === 'boolean' ? options.guard : false;

         // Determine automatically if the callback is `async` via being defined with the `async` modifier.
         if (callback instanceof EventbusUtils.AsyncFunction ||
          callback instanceof EventbusUtils.AsyncGeneratorFunction)
         {
            options.type = 2;
         }
         else
         {
            // Ensure that type is set.
            switch (options.type)
            {
               case 'sync':
                  options.type = 1;
                  break;
               case 'async':
                  options.type = 2;
                  break;
               default:
                  options.type = 0;
                  break;
            }
         }

         // Set opts `ctx` as this is what we send to the eventbus.
         opts.ctx = context || ctx;

         handlers.push({ callback, context, ctx: opts.ctx, options });
      }

      return events;
   }
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
class EventbusSecure
{
   /**
    * Stores the target eventbus.
    *
    * @type {import('.').Eventbus | import('.').EventbusProxy}
    */
   #eventbus;

   /**
    * Stores a potentially alternate name instead of returning the wrapped Eventbus instance name.
    *
    * @type {string}
    */
   #name;

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
   static initialize(eventbus, name = void 0)
   {
      if (name !== void 0 && typeof name !== 'string') { throw new TypeError(`'name' is not a string.`); }

      const eventbusSecure = new EventbusSecure();
      eventbusSecure.#eventbus = eventbus;
      eventbusSecure.#name = name === void 0 ? eventbus.name : name;
      Object.seal(eventbusSecure);

      return {
         destroy: function()
         {
            if (!eventbusSecure.isDestroyed)
            {
               eventbusSecure.#eventbus = null;

               if (this) { this.eventbusSecure = void 0; }
            }
         },

         /**
          * @param {import('.').Eventbus | import('.').EventbusProxy}   eventbus - Target eventbus.
          *
          * @param {string}   [name] - Eventbus name.
          */
         setEventbus: function(eventbus, name = void 0)
         {
            if (name !== void 0 && typeof name !== 'string') { throw new TypeError(`'name' is not a string.`); }

            if (!eventbusSecure.isDestroyed)
            {
               // Adopt the new eventbus name as the current name set matches the wrapped eventbus.
               if (name === void 0 && eventbusSecure.#name === eventbusSecure.#eventbus.name)
               {
                  eventbusSecure.#name = eventbus.name;
               }
               else if (name !== void 0)
               {
                  eventbusSecure.#name = name;
               }

               eventbusSecure.#eventbus = eventbus;
            }
         },

         eventbusSecure
      };
   }

   /**
    * Returns an iterable for the event names / keys of secured eventbus event listeners.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @yields {string}
    */
   *keys(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      for (const entry of this.#eventbus.keys(regex))
      {
         yield entry;
      }
   }

   /**
    * Returns an iterable for the event names / keys of registered event listeners along with event options.
    *
    * @param {RegExp} [regex] - Optional regular expression to filter event names.
    *
    * @returns {Generator<[string, import('.').EventOptionsOut], void, unknown>} Generator
    * @yields {[string, import('.').EventOptionsOut]}
    */
   *keysWithOptions(regex = void 0)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      for (const entry of this.#eventbus.keysWithOptions(regex))
      {
         yield entry;
      }
   }

   /**
    * Returns whether this instance has already been destroyed.
    *
    * @returns {boolean} Is destroyed state.
    */
   get isDestroyed()
   {
      return this.#eventbus === null;
   }

   /**
    * Returns the name associated with this instance.
    *
    * @returns {string} The target eventbus name.
    */
   get name()
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      return this.#name;
   }

   /**
    * Returns the options of an event name.
    *
    * @param {string}   name - Event name(s) to verify.
    *
    * @returns {import('.').EventOptionsOut} The event options.
    */
   getOptions(name)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      return this.#eventbus.getOptions(name);
   }

   /**
    * Returns the trigger type of event name.
    * Note: if trigger type is not set then undefined is returned for type otherwise 'sync' or 'async' is returned.
    *
    * @param {string}   name - Event name(s) to verify.
    *
    * @returns {string|undefined} The trigger type.
    */
   getType(name)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      return this.#eventbus.getType(name);
   }

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
   trigger(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      this.#eventbus.trigger(name, ...args);

      return this;
   }

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
   triggerAsync(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      return this.#eventbus.triggerAsync(name, ...args);
   }

   /**
    * Defers invoking `trigger`. This is useful for triggering events in the next clock tick.
    *
    * @param {string}   name - Event name(s)
    *
    * @param {...*}     args - Additional arguments passed to the event function(s).
    *
    * @returns {EventbusSecure} This EventbusProxy.
    */
   triggerDefer(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      this.#eventbus.triggerDefer(name, ...args);

      return this;
   }

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
   triggerSync(name, ...args)
   {
      if (this.isDestroyed) { throw new ReferenceError('This EventbusSecure instance has been destroyed.'); }

      return this.#eventbus.triggerSync(name, ...args);
   }
}

export { Eventbus, EventbusProxy, EventbusSecure };
//# sourceMappingURL=index.js.map
