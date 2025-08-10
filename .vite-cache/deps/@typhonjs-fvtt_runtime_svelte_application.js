import {
  A11yHelper,
  ApplicationShell_default,
  CrossWindow,
  TJSGlassPane_default,
  TJSPosition,
  TJSSvelte,
  applyStyles,
  localize,
  propertyStore,
  subscribeIgnoreFirst
} from "./chunk-5LD54QW7.js";
import {
  deepMerge,
  hasGetter,
  isObject,
  klona,
  safeAccess,
  safeSet
} from "./chunk-NGCJAO2T.js";
import "./chunk-C4DBGOHH.js";
import {
  derived,
  writable
} from "./chunk-M2FRMPL5.js";
import {
  fade
} from "./chunk-MC3UIZRO.js";
import "./chunk-WSHISOYD.js";
import "./chunk-X7HCJ7ZS.js";
import {
  HtmlTag,
  SvelteComponentDev,
  action_destroyer,
  add_flush_callback,
  add_location,
  append_dev,
  append_styles,
  assign,
  attr_dev,
  bind,
  binding_callbacks,
  check_outros,
  component_subscribe,
  construct_svelte_component_dev,
  create_component,
  destroy_block,
  destroy_component,
  detach_dev,
  dispatch_dev,
  element,
  empty,
  ensure_array_like_dev,
  flush,
  getContext,
  get_spread_object,
  get_spread_update,
  get_store_value,
  globals,
  group_outros,
  init,
  insert_dev,
  is_function,
  listen_dev,
  mount_component,
  noop,
  onDestroy,
  onMount,
  prevent_default,
  prop_dev,
  run_all,
  safe_not_equal,
  setContext,
  set_data_dev,
  space,
  stop_propagation,
  text,
  transition_in,
  transition_out,
  update_keyed_each,
  validate_each_keys,
  validate_slots,
  validate_store
} from "./chunk-GBPX7F5N.js";
import "./chunk-CVMU2DPX.js";
import "./chunk-PZ5AY32C.js";

// node_modules/@typhonjs-fvtt/runtime/_dist/svelte/store/web-storage/index.js
function storeGenerator({ storage, serialize = JSON.stringify, deserialize = JSON.parse }) {
  function isSimpleDeriver(deriver) {
    return deriver.length < 2;
  }
  function storageReadable(key, value, start) {
    return {
      subscribe: storageWritable(key, value, start).subscribe
    };
  }
  function storageWritable(key, value, start) {
    function wrap_start(ogSet) {
      return start(function wrap_set(new_value) {
        if (storage) {
          storage.setItem(key, serialize(new_value));
        }
        return ogSet(new_value);
      }, function wrap_update(fn) {
        set(fn(get_store_value(ogStore)));
      });
    }
    if (storage) {
      const storageValue = storage.getItem(key);
      try {
        if (storageValue) {
          value = deserialize(storageValue);
        }
      } catch (err) {
      }
      storage.setItem(key, serialize(value));
    }
    const ogStore = writable(value, start ? wrap_start : void 0);
    function set(new_value) {
      if (storage) {
        storage.setItem(key, serialize(new_value));
      }
      ogStore.set(new_value);
    }
    function update(fn) {
      set(fn(get_store_value(ogStore)));
    }
    function subscribe(run, invalidate) {
      return ogStore.subscribe(run, invalidate);
    }
    return { set, update, subscribe };
  }
  function storageDerived(key, stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;
    if (storage && storage.getItem(key)) {
      try {
        initial_value = deserialize(storage.getItem(key));
      } catch (err) {
      }
    }
    return storageReadable(key, initial_value, (set, update) => {
      let inited = false;
      const values = [];
      let pending = 0;
      let cleanup;
      const sync = () => {
        if (pending) {
          return;
        }
        cleanup?.();
        const input = single ? values[0] : values;
        if (isSimpleDeriver(fn)) {
          set(fn(input));
        } else {
          const result = fn(input, set, update);
          if (typeof result === "function") {
            cleanup = result;
          }
        }
      };
      const unsubscribers = stores_array.map((store, i) => store.subscribe((value) => {
        values[i] = value;
        pending &= ~(1 << i);
        if (inited) {
          sync();
        }
      }, () => {
        pending |= 1 << i;
      }));
      inited = true;
      sync();
      return function stop() {
        unsubscribers.forEach((unsubscriber) => unsubscriber());
        cleanup?.();
      };
    });
  }
  return {
    readable: storageReadable,
    writable: storageWritable,
    derived: storageDerived,
    storage,
    serialize,
    deserialize
  };
}
var localStores = storeGenerator({ storage: globalThis?.localStorage });
localStores.derived;
localStores.readable;
localStores.writable;
var sessionStores = storeGenerator({ storage: globalThis?.sessionStorage });
sessionStores.derived;
sessionStores.readable;
sessionStores.writable;
var TJSWebStorage = class {
  /** @type {import('./').StorageStores} */
  #storageStores;
  /**
   * @type {(Map<string, {
   *    store: import('svelte/store').Writable,
   *    deserialize?: (value: string, ...rest: any[]) => any,
   *    serialize?: (value: any, ...rest: any[]) => string
   * }>)}
   */
  #stores = /* @__PURE__ */ new Map();
  /**
   * @param {import('./').StorageStores} storageStores - Provides a complete set of
   *        storage API store helper functions and the associated storage API instance and serializations strategy.
   */
  constructor(storageStores) {
    this.#storageStores = storageStores;
  }
  /**
   * Creates a new store for the given key.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in stores map.
   *
   * @param {T}        [defaultValue] - A default value to set for the store.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The new store.
   */
  #createStore(key, defaultValue = void 0, storageStores) {
    try {
      const value = this.#storageStores.storage.getItem(key);
      if (value !== null) {
        const deserialize = storageStores?.deserialize ?? this.#storageStores.deserialize;
        defaultValue = deserialize(value);
      }
    } catch (err) {
    }
    const writable2 = storageStores?.writable ?? this.#storageStores.writable;
    return writable2(key, defaultValue);
  }
  /**
   * @param {string}   key - Storage key.
   *
   * @returns {(value: string, ...rest: any[]) => any} Deserialize function.
   */
  #getDeserialize(key) {
    return this.#stores.get(key)?.deserialize ?? this.#storageStores.deserialize;
  }
  /**
   * @param {string}   key - Storage key.
   *
   * @returns {(value: any, ...rest: any[]) => string} Serialize function.
   */
  #getSerialize(key) {
    return this.#stores.get(key)?.serialize ?? this.#storageStores.serialize;
  }
  /**
   * Gets a store from the `stores` Map or creates a new store for the key and a given default value.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in stores map.
   *
   * @param {T}        [defaultValue] - A default value to set for the store.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The store for the given key.
   */
  #getStore(key, defaultValue = void 0, storageStores) {
    const storeEntry = this.#stores.get(key);
    if (storeEntry) {
      return storeEntry.store;
    }
    const store = this.#createStore(key, defaultValue, storageStores);
    this.#stores.set(key, {
      store,
      deserialize: storageStores?.deserialize,
      serialize: storageStores?.serialize
    });
    return store;
  }
  /**
   * Get value from the storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {*} Value from session storage or if not defined any default value provided.
   */
  getItem(key, defaultValue) {
    let value = defaultValue;
    const storageValue = this.#storageStores.storage.getItem(key);
    if (storageValue !== null) {
      try {
        value = this.#getDeserialize(key)(storageValue);
      } catch (err) {
        value = defaultValue;
      }
    } else if (defaultValue !== void 0) {
      try {
        const newValue = this.#getSerialize(key)(defaultValue);
        this.#storageStores.storage.setItem(key, newValue);
      } catch (err) {
      }
    }
    return value;
  }
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @template T
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {T}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @param {import('./').StorageStores} [storageStores] - Additional store creation options.
   *
   * @returns {import('svelte/store').Writable<T>} The Svelte store for this key.
   */
  getStore(key, defaultValue, storageStores) {
    return this.#getStore(key, defaultValue, storageStores);
  }
  /**
   * Returns whether a store has already been created for the given key.
   *
   * @param {string}   key - Key to lookup in storage API.
   */
  hasStore(key) {
    return this.#stores.has(key);
  }
  /**
   * Sets the value for the given key in storage API.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {*}        value - A value to set for this key.
   */
  setItem(key, value) {
    const store = this.#getStore(key);
    store.set(value);
  }
  /**
   * Convenience method to swap a boolean value stored in storage API updating the associated store value.
   *
   * @param {string}   key - Key to lookup in storage API.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */
  swapItemBoolean(key, defaultValue) {
    const store = this.#getStore(key, defaultValue);
    let currentValue = false;
    try {
      currentValue = !!this.#getDeserialize(key)(this.#storageStores.storage.getItem(key));
    } catch (err) {
    }
    const newValue = typeof currentValue === "boolean" ? !currentValue : false;
    store.set(newValue);
    return newValue;
  }
  // Iterators ------------------------------------------------------------------------------------------------------
  /**
   * @template T
   *
   * Returns an iterable for the session storage keys and stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<[string, import('svelte/store').Writable<T>]>} Iterable iterator of keys and stores.
   * @yields {import('svelte/store').Writable<[string, Writable<T>]>}
   */
  *entries(regex = void 0) {
    if (regex !== void 0 && !CrossWindow.isRegExp(regex)) {
      throw new TypeError(`'regex' is not a RegExp`);
    }
    if (!this.#stores.size) {
      return void 0;
    }
    if (regex) {
      for (const key of this.#stores.keys()) {
        if (regex.test(key)) {
          yield [key, this.getStore(key)];
        }
      }
    } else {
      for (const key of this.#stores.keys()) {
        yield [key, this.getStore(key)];
      }
    }
  }
  /**
   * Returns an iterable for the session storage keys from existing stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<string>} Iterable iterator of session storage keys.
   * @yields {string}
   */
  *keys(regex = void 0) {
    if (regex !== void 0 && !CrossWindow.isRegExp(regex)) {
      throw new TypeError(`'regex' is not a RegExp`);
    }
    if (!this.#stores.size) {
      return void 0;
    }
    if (regex) {
      for (const key of this.#stores.keys()) {
        if (regex.test(key)) {
          yield key;
        }
      }
    } else {
      for (const key of this.#stores.keys()) {
        yield key;
      }
    }
  }
  /**
   * @template T
   *
   * Returns an iterable for the session storage stores.
   *
   * @param {RegExp} [regex] - Optional regular expression to filter by storage keys.
   *
   * @returns {IterableIterator<import('svelte/store').Writable<T>>} Iterable iterator of stores.
   * @yields {import('svelte/store').Writable<T>}
   */
  *stores(regex = void 0) {
    if (regex !== void 0 && !CrossWindow.isRegExp(regex)) {
      throw new TypeError(`'regex' is not a RegExp`);
    }
    if (!this.#stores.size) {
      return void 0;
    }
    if (regex) {
      for (const key of this.#stores.keys()) {
        if (regex.test(key)) {
          yield this.getStore(key);
        }
      }
    } else {
      for (const key of this.#stores.keys()) {
        yield this.getStore(key);
      }
    }
  }
};
var TJSSessionStorage = class extends TJSWebStorage {
  constructor() {
    super(sessionStores);
  }
};

// node_modules/@typhonjs-fvtt/runtime/_dist/svelte/component/internal/dialog/DialogContent.svelte
var { Object: Object_1, console: console_1 } = globals;
var file = "node_modules/@typhonjs-fvtt/runtime/_dist/svelte/component/internal/dialog/DialogContent.svelte";
function add_css(target) {
  append_styles(target, "svelte-159aylm", ".dialog-buttons.svelte-159aylm{padding-top:8px}.tjs-dialog-button.svelte-159aylm:hover{box-shadow:var(--tjs-dialog-button-box-shadow-focus-hover, var(--tjs-default-box-shadow-focus-hover));outline:var(--tjs-dialog-button-outline-focus-hover, var(--tjs-default-outline-focus-hover, revert));transition:var(--tjs-dialog-button-transition-focus-hover, var(--tjs-default-transition-focus-hover));text-shadow:var(--tjs-dialog-button-text-shadow-focus-hover, var(--tjs-default-text-shadow-focus-hover, inherit))}.tjs-dialog-button.svelte-159aylm:focus-visible{box-shadow:var(--tjs-dialog-button-box-shadow-focus-visible, var(--tjs-default-box-shadow-focus-visible));outline:var(--tjs-dialog-button-outline-focus-visible, var(--tjs-default-outline-focus-visible, revert));transition:var(--tjs-dialog-button-transition-focus-visible, var(--tjs-default-transition-focus-visible));text-shadow:var(--tjs-dialog-button-text-shadow-focus-visible, var(--tjs-default-text-shadow-focus-hover, inherit))}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGlhbG9nQ29udGVudC5zdmVsdGUiLCJtYXBwaW5ncyI6IkFBa1lHLCtCQUNHLGVBQ0gsQ0FFQSx3Q0FDRyxxR0FBc0csQ0FDdEcsb0dBQXFHLENBQ3JHLHFHQUFzRyxDQUN0RyxpSEFDSCxDQUVBLGdEQUNHLHlHQUEwRyxDQUMxRyx3R0FBeUcsQ0FDekcseUdBQTBHLENBQzFHLG1IQUNIIiwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJEaWFsb2dDb250ZW50LnN2ZWx0ZSJdfQ== */");
}
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[26] = list[i];
  return child_ctx;
}
function create_if_block_3(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
    /*dialogProps*/
    ctx[7]
  ];
  var switch_value = (
    /*dialogClass*/
    ctx[6]
  );
  function switch_props(ctx2, dirty) {
    let switch_instance_props = {};
    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }
    if (dirty !== void 0 && dirty & /*dialogProps*/
    128) {
      switch_instance_props = assign(switch_instance_props, get_spread_update(switch_instance_spread_levels, [get_spread_object(
        /*dialogProps*/
        ctx2[7]
      )]));
    }
    return {
      props: switch_instance_props,
      $$inline: true
    };
  }
  if (switch_value) {
    switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx));
    ctx[16](switch_instance);
  }
  const block = {
    c: function create() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (switch_instance) mount_component(switch_instance, target, anchor);
      insert_dev(target, switch_instance_anchor, anchor);
      current = true;
    },
    p: function update(ctx2, dirty) {
      if (dirty & /*dialogClass*/
      64 && switch_value !== (switch_value = /*dialogClass*/
      ctx2[6])) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }
        if (switch_value) {
          switch_instance = construct_svelte_component_dev(switch_value, switch_props(ctx2, dirty));
          ctx2[16](switch_instance);
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        const switch_instance_changes = dirty & /*dialogProps*/
        128 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
          /*dialogProps*/
          ctx2[7]
        )]) : {};
        switch_instance.$set(switch_instance_changes);
      }
    },
    i: function intro(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(switch_instance_anchor);
      }
      ctx[16](null);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_3.name,
    type: "if",
    source: "(366:28) ",
    ctx
  });
  return block;
}
function create_if_block_2(ctx) {
  let html_tag;
  let html_anchor;
  const block = {
    c: function create() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m: function mount(target, anchor) {
      html_tag.m(
        /*content*/
        ctx[3],
        target,
        anchor
      );
      insert_dev(target, html_anchor, anchor);
    },
    p: function update(ctx2, dirty) {
      if (dirty & /*content*/
      8) html_tag.p(
        /*content*/
        ctx2[3]
      );
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(html_anchor);
        html_tag.d();
      }
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_2.name,
    type: "if",
    source: "(364:6) {#if typeof content === 'string'}",
    ctx
  });
  return block;
}
function create_if_block(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let each_value = ensure_array_like_dev(
    /*buttons*/
    ctx[1]
  );
  const get_key = (ctx2) => (
    /*button*/
    ctx2[26].id
  );
  validate_each_keys(ctx, each_value, get_each_context, get_key);
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  const block = {
    c: function create() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr_dev(div, "class", "dialog-buttons tjs-dialog-buttons svelte-159aylm");
      add_location(div, file, 371, 3, 12469);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(div, null);
        }
      }
      ctx[20](div);
    },
    p: function update(ctx2, dirty) {
      if (dirty & /*buttons, onClick, currentButtonId*/
      530) {
        each_value = ensure_array_like_dev(
          /*buttons*/
          ctx2[1]
        );
        validate_each_keys(ctx2, each_value, get_each_context, get_key);
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, destroy_block, create_each_block, null, get_each_context);
      }
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(div);
      }
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      ctx[20](null);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block.name,
    type: "if",
    source: "(371:3) {#if buttons.length}",
    ctx
  });
  return block;
}
function create_if_block_1(ctx) {
  let html_tag;
  let raw_value = (
    /*button*/
    ctx[26].icon + ""
  );
  let html_anchor;
  const block = {
    c: function create() {
      html_tag = new HtmlTag(false);
      html_anchor = empty();
      html_tag.a = html_anchor;
    },
    m: function mount(target, anchor) {
      html_tag.m(raw_value, target, anchor);
      insert_dev(target, html_anchor, anchor);
    },
    p: function update(ctx2, dirty) {
      if (dirty & /*buttons*/
      2 && raw_value !== (raw_value = /*button*/
      ctx2[26].icon + "")) html_tag.p(raw_value);
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(html_anchor);
        html_tag.d();
      }
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block_1.name,
    type: "if",
    source: "(379:36) {#if button.icon}",
    ctx
  });
  return block;
}
function create_each_block(key_1, ctx) {
  let button_1;
  let span;
  let t0_value = (
    /*button*/
    ctx[26].label + ""
  );
  let t0;
  let span_title_value;
  let t1;
  let button_1_class_value;
  let button_1_disabled_value;
  let applyStyles_action;
  let mounted;
  let dispose;
  let if_block = (
    /*button*/
    ctx[26].icon && create_if_block_1(ctx)
  );
  function click_handler() {
    return (
      /*click_handler*/
      ctx[18](
        /*button*/
        ctx[26]
      )
    );
  }
  function focus_handler() {
    return (
      /*focus_handler*/
      ctx[19](
        /*button*/
        ctx[26]
      )
    );
  }
  const block = {
    key: key_1,
    first: null,
    c: function create() {
      button_1 = element("button");
      span = element("span");
      if (if_block) if_block.c();
      t0 = text(t0_value);
      t1 = space();
      attr_dev(span, "title", span_title_value = /*button*/
      ctx[26].title);
      add_location(span, file, 378, 9, 12883);
      attr_dev(button_1, "class", button_1_class_value = "dialog-button tjs-dialog-button " + /*button*/
      ctx[26].id + " svelte-159aylm");
      button_1.disabled = button_1_disabled_value = /*button*/
      ctx[26].disabled;
      add_location(button_1, file, 373, 6, 12589);
      this.first = button_1;
    },
    m: function mount(target, anchor) {
      insert_dev(target, button_1, anchor);
      append_dev(button_1, span);
      if (if_block) if_block.m(span, null);
      append_dev(span, t0);
      append_dev(button_1, t1);
      if (!mounted) {
        dispose = [
          listen_dev(button_1, "click", stop_propagation(prevent_default(click_handler)), false, true, true, false),
          listen_dev(button_1, "focus", focus_handler, false, false, false, false),
          action_destroyer(applyStyles_action = applyStyles.call(
            null,
            button_1,
            /*button*/
            ctx[26].styles
          ))
        ];
        mounted = true;
      }
    },
    p: function update(new_ctx, dirty) {
      ctx = new_ctx;
      if (
        /*button*/
        ctx[26].icon
      ) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_1(ctx);
          if_block.c();
          if_block.m(span, t0);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (dirty & /*buttons*/
      2 && t0_value !== (t0_value = /*button*/
      ctx[26].label + "")) set_data_dev(t0, t0_value);
      if (dirty & /*buttons*/
      2 && span_title_value !== (span_title_value = /*button*/
      ctx[26].title)) {
        attr_dev(span, "title", span_title_value);
      }
      if (dirty & /*buttons*/
      2 && button_1_class_value !== (button_1_class_value = "dialog-button tjs-dialog-button " + /*button*/
      ctx[26].id + " svelte-159aylm")) {
        attr_dev(button_1, "class", button_1_class_value);
      }
      if (dirty & /*buttons*/
      2 && button_1_disabled_value !== (button_1_disabled_value = /*button*/
      ctx[26].disabled)) {
        prop_dev(button_1, "disabled", button_1_disabled_value);
      }
      if (applyStyles_action && is_function(applyStyles_action.update) && dirty & /*buttons*/
      2) applyStyles_action.update.call(
        null,
        /*button*/
        ctx[26].styles
      );
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(button_1);
      }
      if (if_block) if_block.d();
      mounted = false;
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_each_block.name,
    type: "each",
    source: "(373:6) {#each buttons as button (button.id)}",
    ctx
  });
  return block;
}
function create_fragment(ctx) {
  let main;
  let div;
  let current_block_type_index;
  let if_block0;
  let t;
  let current;
  const if_block_creators = [create_if_block_2, create_if_block_3];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (typeof /*content*/
    ctx2[3] === "string") return 0;
    if (
      /*dialogClass*/
      ctx2[6]
    ) return 1;
    return -1;
  }
  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }
  let if_block1 = (
    /*buttons*/
    ctx[1].length && create_if_block(ctx)
  );
  const block = {
    c: function create() {
      main = element("main");
      div = element("div");
      if (if_block0) if_block0.c();
      t = space();
      if (if_block1) if_block1.c();
      attr_dev(div, "class", "dialog-content");
      add_location(div, file, 362, 3, 12182);
      add_location(main, file, 361, 0, 12172);
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      insert_dev(target, main, anchor);
      append_dev(main, div);
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div, null);
      }
      ctx[17](div);
      append_dev(main, t);
      if (if_block1) if_block1.m(main, null);
      current = true;
    },
    p: function update(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx2, dirty);
        }
      } else {
        if (if_block0) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }
        if (~current_block_type_index) {
          if_block0 = if_blocks[current_block_type_index];
          if (!if_block0) {
            if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
            if_block0.c();
          } else {
            if_block0.p(ctx2, dirty);
          }
          transition_in(if_block0, 1);
          if_block0.m(div, null);
        } else {
          if_block0 = null;
        }
      }
      if (
        /*buttons*/
        ctx2[1].length
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
        } else {
          if_block1 = create_if_block(ctx2);
          if_block1.c();
          if_block1.m(main, null);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block0);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block0);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(main);
      }
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
      ctx[17](null);
      if (if_block1) if_block1.d();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
var s_REGEX_HTML = /^\s*<.*>$/;
function instance($$self, $$props, $$invalidate) {
  let autoClose;
  let focusFirst;
  let resolveId;
  let $elementRoot;
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("DialogContent", slots, []);
  let { data = void 0 } = $$props;
  let { preventDefault = false } = $$props;
  let { stopPropagation = false } = $$props;
  let { dialogComponent = void 0 } = $$props;
  const { elementRoot } = getContext("#internal").stores;
  validate_store(elementRoot, "elementRoot");
  component_subscribe($$self, elementRoot, (value) => $$invalidate(15, $elementRoot = value));
  const application = getContext("#external")?.application;
  const managedPromise = getContext("#managedPromise");
  let buttons;
  let contentEl;
  let buttonsEl;
  let content = void 0;
  let dialogClass;
  let dialogProps = {};
  let currentButtonId = data.default;
  onDestroy(() => {
    const rootEl = $elementRoot;
    if (A11yHelper.isFocusTarget(rootEl)) {
      rootEl.removeEventListener("keydown", onKeydown);
      rootEl.removeEventListener("keyup", onKeyup);
    }
  });
  onMount(() => {
    if (focusFirst) {
      const focusEl = A11yHelper.getFirstFocusableElement(contentEl);
      if (A11yHelper.isFocusTarget(focusEl)) {
        setTimeout(() => focusEl.focus(), 0);
      }
    }
  });
  function onClick(button) {
    try {
      let result = void 0;
      const callback = button?.onPress;
      switch (typeof callback) {
        case "function":
          result = callback({ application });
          break;
        case "string":
          if (dialogComponent !== void 0 && typeof dialogComponent[callback] === "function") {
            result = dialogComponent[callback]({ application });
          } else {
            if (dialogComponent === void 0) {
              console.warn(`[TRL] TJSDialog warning: 'onPress' defined as a string with no associated content Svelte component.`);
            } else if (typeof dialogComponent?.[callback] !== "function") {
              console.warn(`[TRL] TJSDialog warning: The content Svelte component does not contain an associated function '${callback}'. Did you remember to add '<svelte:options accessors={true} />' and export the function?`);
            }
          }
          break;
      }
      if (button.autoClose && autoClose) {
        if (resolveId && result === void 0) {
          result = button.id;
        }
        managedPromise.resolve(result);
      }
    } catch (err) {
      const notifyError = typeof data.notifyError === "boolean" ? data.notifyError : true;
      if (notifyError) {
        globalThis.ui.notifications.error(err, { console: false });
      }
      if (!managedPromise.reject(err)) {
        throw err;
      }
    } finally {
      if (button.autoClose && autoClose) {
        application.close();
      }
    }
  }
  function onKeydown(event) {
    switch (event.code) {
      case "ArrowLeft":
      case "ArrowRight":
      case "Enter":
        event.stopPropagation();
        break;
      case "Tab":
        event.stopPropagation();
        setTimeout(
          () => {
            const activeWindow = application.reactive.activeWindow;
            const activeElement = activeWindow.document.activeElement;
            if (A11yHelper.isFocusTarget(activeElement) && A11yHelper.isFocusTarget(buttonsEl) && buttonsEl.contains(activeElement)) {
              for (let cntr = 0; cntr < activeElement.classList.length; cntr++) {
                const item = activeElement.classList.item(cntr);
                if (item !== "dialog-button" && item !== "default" && typeof data.buttons[item] !== void 0) {
                  $$invalidate(4, currentButtonId = item);
                  break;
                }
              }
            }
          },
          0
        );
        break;
      default:
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        break;
    }
  }
  function onKeyup(event) {
    switch (event.code) {
      case "ArrowLeft": {
        event.preventDefault();
        event.stopPropagation();
        const activeWindow = application.reactive.activeWindow;
        const activeEl = activeWindow.document.activeElement;
        if (A11yHelper.isFocusTarget(buttonsEl)) {
          if (A11yHelper.isFocusTarget(activeEl) && buttonsEl.contains(activeEl)) {
            const currentIndex = buttons.findIndex((button) => button.id === currentButtonId);
            if (buttons.length && currentIndex > 0) {
              $$invalidate(4, currentButtonId = buttons[currentIndex - 1].id);
            }
          }
          const buttonEl = buttonsEl.querySelector(`.${currentButtonId}`);
          if (A11yHelper.isFocusTarget(buttonEl)) {
            buttonEl.focus();
          }
        }
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        event.stopPropagation();
        const activeWindow = application.reactive.activeWindow;
        const activeEl = activeWindow.document.activeElement;
        if (A11yHelper.isFocusTarget(buttonsEl)) {
          if (A11yHelper.isFocusTarget(activeEl) && (buttonsEl.contains(activeEl) || currentButtonId === void 0)) {
            const currentIndex = buttons.findIndex((button) => button.id === currentButtonId);
            if (buttons.length && currentIndex < buttons.length - 1) {
              $$invalidate(4, currentButtonId = buttons[currentIndex + 1].id);
            }
          }
          const buttonEl = buttonsEl.querySelector(`.${currentButtonId}`);
          if (A11yHelper.isFocusTarget(buttonEl)) {
            buttonEl.focus();
          }
        }
        break;
      }
      case "Enter":
        event.preventDefault();
        event.stopPropagation();
        break;
      default:
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        break;
    }
  }
  const writable_props = ["data", "preventDefault", "stopPropagation", "dialogComponent"];
  Object_1.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot") console_1.warn(`<DialogContent> was created with unknown prop '${key}'`);
  });
  function switch_instance_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      dialogComponent = $$value;
      $$invalidate(0, dialogComponent);
    });
  }
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      contentEl = $$value;
      $$invalidate(5, contentEl);
    });
  }
  const click_handler = (button) => onClick(button);
  const focus_handler = (button) => $$invalidate(4, currentButtonId = button.id);
  function div_binding_1($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      buttonsEl = $$value;
      $$invalidate(2, buttonsEl);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("data" in $$props2) $$invalidate(10, data = $$props2.data);
    if ("preventDefault" in $$props2) $$invalidate(11, preventDefault = $$props2.preventDefault);
    if ("stopPropagation" in $$props2) $$invalidate(12, stopPropagation = $$props2.stopPropagation);
    if ("dialogComponent" in $$props2) $$invalidate(0, dialogComponent = $$props2.dialogComponent);
  };
  $$self.$capture_state = () => ({
    getContext,
    onDestroy,
    onMount,
    applyStyles,
    TJSSvelte,
    A11yHelper,
    localize,
    isObject,
    data,
    preventDefault,
    stopPropagation,
    dialogComponent,
    s_REGEX_HTML,
    elementRoot,
    application,
    managedPromise,
    buttons,
    contentEl,
    buttonsEl,
    content,
    dialogClass,
    dialogProps,
    currentButtonId,
    onClick,
    onKeydown,
    onKeyup,
    autoClose,
    resolveId,
    focusFirst,
    $elementRoot
  });
  $$self.$inject_state = ($$props2) => {
    if ("data" in $$props2) $$invalidate(10, data = $$props2.data);
    if ("preventDefault" in $$props2) $$invalidate(11, preventDefault = $$props2.preventDefault);
    if ("stopPropagation" in $$props2) $$invalidate(12, stopPropagation = $$props2.stopPropagation);
    if ("dialogComponent" in $$props2) $$invalidate(0, dialogComponent = $$props2.dialogComponent);
    if ("buttons" in $$props2) $$invalidate(1, buttons = $$props2.buttons);
    if ("contentEl" in $$props2) $$invalidate(5, contentEl = $$props2.contentEl);
    if ("buttonsEl" in $$props2) $$invalidate(2, buttonsEl = $$props2.buttonsEl);
    if ("content" in $$props2) $$invalidate(3, content = $$props2.content);
    if ("dialogClass" in $$props2) $$invalidate(6, dialogClass = $$props2.dialogClass);
    if ("dialogProps" in $$props2) $$invalidate(7, dialogProps = $$props2.dialogProps);
    if ("currentButtonId" in $$props2) $$invalidate(4, currentButtonId = $$props2.currentButtonId);
    if ("autoClose" in $$props2) $$invalidate(13, autoClose = $$props2.autoClose);
    if ("resolveId" in $$props2) resolveId = $$props2.resolveId;
    if ("focusFirst" in $$props2) $$invalidate(14, focusFirst = $$props2.focusFirst);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*$elementRoot*/
    32768) {
      $: if ($elementRoot) {
        const rootEl = $elementRoot;
        if (A11yHelper.isFocusTarget(rootEl)) {
          rootEl.addEventListener("keydown", onKeydown);
          rootEl.addEventListener("keyup", onKeyup);
        }
      }
    }
    if ($$self.$$.dirty & /*data*/
    1024) {
      $: $$invalidate(13, autoClose = typeof data.autoClose === "boolean" ? data.autoClose : true);
    }
    if ($$self.$$.dirty & /*data*/
    1024) {
      $: $$invalidate(14, focusFirst = typeof data.focusFirst === "boolean" ? data.focusFirst : false);
    }
    if ($$self.$$.dirty & /*data*/
    1024) {
      $: {
        $$invalidate(1, buttons = !isObject(data.buttons) ? [] : Object.keys(data.buttons).reduce(
          (array, key) => {
            const b = data.buttons[key];
            const icon = typeof b.icon !== "string" ? void 0 : s_REGEX_HTML.test(b.icon) ? b.icon : `<i class="${b.icon}"></i>`;
            const autoClose2 = typeof b.autoClose === "boolean" ? b.autoClose : true;
            const disabled = typeof b.disabled === "boolean" ? b.disabled : false;
            const label = typeof b.label === "string" ? `${icon !== void 0 ? " " : ""}${localize(b.label)}` : "";
            const title = typeof b.title === "string" ? localize(b.title) : void 0;
            const condition = typeof b.condition === "function" ? b.condition.call(b) : b.condition ?? true;
            if (condition) {
              array.push({
                ...b,
                id: key,
                autoClose: autoClose2,
                icon,
                label,
                title,
                disabled
              });
            }
            return array;
          },
          []
        ));
      }
    }
    if ($$self.$$.dirty & /*buttons, currentButtonId*/
    18) {
      $: if (!buttons.find((button) => button.id === currentButtonId)) {
        $$invalidate(4, currentButtonId = void 0);
      }
    }
    if ($$self.$$.dirty & /*focusFirst, buttonsEl, currentButtonId*/
    16404) {
      $: if (!focusFirst && A11yHelper.isFocusTarget(buttonsEl)) {
        const buttonEl = buttonsEl.querySelector(`.${currentButtonId}`);
        if (A11yHelper.isFocusTarget(buttonEl)) {
          buttonEl.focus();
        }
      }
    }
    if ($$self.$$.dirty & /*data*/
    1024) {
      $: resolveId = typeof data.resolveId === "boolean" ? data.resolveId : false;
    }
    if ($$self.$$.dirty & /*content, data*/
    1032) {
      $: if (content !== data.content) {
        $$invalidate(
          3,
          content = data.content
        );
        try {
          if (TJSSvelte.config.isConfigEmbed(content)) {
            $$invalidate(6, dialogClass = content.class);
            $$invalidate(7, dialogProps = content.props);
          } else {
            $$invalidate(6, dialogClass = void 0);
            $$invalidate(7, dialogProps = {});
          }
        } catch (err) {
          $$invalidate(6, dialogClass = void 0);
          $$invalidate(7, dialogProps = {});
          $$invalidate(3, content = err.message);
          console.error(err);
        }
      }
    }
  };
  return [
    dialogComponent,
    buttons,
    buttonsEl,
    content,
    currentButtonId,
    contentEl,
    dialogClass,
    dialogProps,
    elementRoot,
    onClick,
    data,
    preventDefault,
    stopPropagation,
    autoClose,
    focusFirst,
    $elementRoot,
    switch_instance_binding,
    div_binding,
    click_handler,
    focus_handler,
    div_binding_1
  ];
}
var DialogContent = class extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(
      this,
      options,
      instance,
      create_fragment,
      safe_not_equal,
      {
        data: 10,
        preventDefault: 11,
        stopPropagation: 12,
        dialogComponent: 0
      },
      add_css
    );
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "DialogContent",
      options,
      id: create_fragment.name
    });
  }
  get data() {
    throw new Error("<DialogContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set data(value) {
    throw new Error("<DialogContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get preventDefault() {
    throw new Error("<DialogContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set preventDefault(value) {
    throw new Error("<DialogContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get stopPropagation() {
    throw new Error("<DialogContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set stopPropagation(value) {
    throw new Error("<DialogContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  get dialogComponent() {
    throw new Error("<DialogContent>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
  set dialogComponent(value) {
    throw new Error("<DialogContent>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
  }
};
var DialogContent_default = DialogContent;

// node_modules/@typhonjs-fvtt/runtime/_dist/svelte/component/internal/dialog/DialogShell.svelte
function create_else_block(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let updating_elementContent;
  let current;
  const applicationshell_spread_levels = [
    /*appProps*/
    ctx[6]
  ];
  function applicationshell_elementRoot_binding_1(value) {
    ctx[16](value);
  }
  function applicationshell_elementContent_binding_1(value) {
    ctx[17](value);
  }
  let applicationshell_props = {
    $$slots: { default: [create_default_slot_2] },
    $$scope: { ctx }
  };
  for (let i = 0; i < applicationshell_spread_levels.length; i += 1) {
    applicationshell_props = assign(applicationshell_props, applicationshell_spread_levels[i]);
  }
  if (
    /*elementRoot*/
    ctx[0] !== void 0
  ) {
    applicationshell_props.elementRoot = /*elementRoot*/
    ctx[0];
  }
  if (
    /*elementContent*/
    ctx[1] !== void 0
  ) {
    applicationshell_props.elementContent = /*elementContent*/
    ctx[1];
  }
  applicationshell = new ApplicationShell_default({
    props: applicationshell_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding_1));
  binding_callbacks.push(() => bind(applicationshell, "elementContent", applicationshell_elementContent_binding_1));
  const block = {
    c: function create() {
      create_component(applicationshell.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p: function update(ctx2, dirty) {
      const applicationshell_changes = dirty & /*appProps*/
      64 ? get_spread_update(applicationshell_spread_levels, [get_spread_object(
        /*appProps*/
        ctx2[6]
      )]) : {};
      if (dirty & /*$$scope, data, dialogComponent*/
      8388620) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & /*elementRoot*/
      1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = /*elementRoot*/
        ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      if (!updating_elementContent && dirty & /*elementContent*/
      2) {
        updating_elementContent = true;
        applicationshell_changes.elementContent = /*elementContent*/
        ctx2[1];
        add_flush_callback(() => updating_elementContent = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_else_block.name,
    type: "else",
    source: "(304:0) {:else}",
    ctx
  });
  return block;
}
function create_if_block2(ctx) {
  let tjsglasspane;
  let current;
  const tjsglasspane_spread_levels = [
    {
      id: `${/*application*/
      ctx[4].id}-glasspane`
    },
    /*modalProps*/
    ctx[7],
    { zIndex: (
      /*zIndex*/
      ctx[8]
    ) }
  ];
  let tjsglasspane_props = {
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  for (let i = 0; i < tjsglasspane_spread_levels.length; i += 1) {
    tjsglasspane_props = assign(tjsglasspane_props, tjsglasspane_spread_levels[i]);
  }
  tjsglasspane = new TJSGlassPane_default({
    props: tjsglasspane_props,
    $$inline: true
  });
  tjsglasspane.$on(
    "glasspane:close",
    /*glasspane_close_handler*/
    ctx[13]
  );
  tjsglasspane.$on(
    "glasspane:keydown:escape",
    /*glasspane_keydown_escape_handler*/
    ctx[14]
  );
  const block = {
    c: function create() {
      create_component(tjsglasspane.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(tjsglasspane, target, anchor);
      current = true;
    },
    p: function update(ctx2, dirty) {
      const tjsglasspane_changes = dirty & /*application, modalProps, zIndex*/
      400 ? get_spread_update(tjsglasspane_spread_levels, [
        dirty & /*application*/
        16 && {
          id: `${/*application*/
          ctx2[4].id}-glasspane`
        },
        dirty & /*modalProps*/
        128 && get_spread_object(
          /*modalProps*/
          ctx2[7]
        ),
        dirty & /*zIndex*/
        256 && { zIndex: (
          /*zIndex*/
          ctx2[8]
        ) }
      ]) : {};
      if (dirty & /*$$scope, appProps, elementRoot, elementContent, data, dialogComponent*/
      8388687) {
        tjsglasspane_changes.$$scope = { dirty, ctx: ctx2 };
      }
      tjsglasspane.$set(tjsglasspane_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(tjsglasspane.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(tjsglasspane.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(tjsglasspane, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_if_block2.name,
    type: "if",
    source: "(296:0) {#if modal}",
    ctx
  });
  return block;
}
function create_default_slot_2(ctx) {
  let dialogcontent;
  let updating_dialogComponent;
  let current;
  function dialogcontent_dialogComponent_binding_1(value) {
    ctx[15](value);
  }
  let dialogcontent_props = { data: (
    /*data*/
    ctx[3]
  ) };
  if (
    /*dialogComponent*/
    ctx[2] !== void 0
  ) {
    dialogcontent_props.dialogComponent = /*dialogComponent*/
    ctx[2];
  }
  dialogcontent = new DialogContent_default({
    props: dialogcontent_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(dialogcontent, "dialogComponent", dialogcontent_dialogComponent_binding_1));
  const block = {
    c: function create() {
      create_component(dialogcontent.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(dialogcontent, target, anchor);
      current = true;
    },
    p: function update(ctx2, dirty) {
      const dialogcontent_changes = {};
      if (dirty & /*data*/
      8) dialogcontent_changes.data = /*data*/
      ctx2[3];
      if (!updating_dialogComponent && dirty & /*dialogComponent*/
      4) {
        updating_dialogComponent = true;
        dialogcontent_changes.dialogComponent = /*dialogComponent*/
        ctx2[2];
        add_flush_callback(() => updating_dialogComponent = false);
      }
      dialogcontent.$set(dialogcontent_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(dialogcontent.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(dialogcontent.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(dialogcontent, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_2.name,
    type: "slot",
    source: "(305:3) <ApplicationShell bind:elementRoot bind:elementContent {...appProps}>",
    ctx
  });
  return block;
}
function create_default_slot_1(ctx) {
  let dialogcontent;
  let updating_dialogComponent;
  let current;
  function dialogcontent_dialogComponent_binding(value) {
    ctx[10](value);
  }
  let dialogcontent_props = {
    data: (
      /*data*/
      ctx[3]
    ),
    stopPropagation: true
  };
  if (
    /*dialogComponent*/
    ctx[2] !== void 0
  ) {
    dialogcontent_props.dialogComponent = /*dialogComponent*/
    ctx[2];
  }
  dialogcontent = new DialogContent_default({
    props: dialogcontent_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(dialogcontent, "dialogComponent", dialogcontent_dialogComponent_binding));
  const block = {
    c: function create() {
      create_component(dialogcontent.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(dialogcontent, target, anchor);
      current = true;
    },
    p: function update(ctx2, dirty) {
      const dialogcontent_changes = {};
      if (dirty & /*data*/
      8) dialogcontent_changes.data = /*data*/
      ctx2[3];
      if (!updating_dialogComponent && dirty & /*dialogComponent*/
      4) {
        updating_dialogComponent = true;
        dialogcontent_changes.dialogComponent = /*dialogComponent*/
        ctx2[2];
        add_flush_callback(() => updating_dialogComponent = false);
      }
      dialogcontent.$set(dialogcontent_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(dialogcontent.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(dialogcontent.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(dialogcontent, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot_1.name,
    type: "slot",
    source: "(300:6) <ApplicationShell bind:elementRoot bind:elementContent {...appProps}>",
    ctx
  });
  return block;
}
function create_default_slot(ctx) {
  let applicationshell;
  let updating_elementRoot;
  let updating_elementContent;
  let current;
  const applicationshell_spread_levels = [
    /*appProps*/
    ctx[6]
  ];
  function applicationshell_elementRoot_binding(value) {
    ctx[11](value);
  }
  function applicationshell_elementContent_binding(value) {
    ctx[12](value);
  }
  let applicationshell_props = {
    $$slots: { default: [create_default_slot_1] },
    $$scope: { ctx }
  };
  for (let i = 0; i < applicationshell_spread_levels.length; i += 1) {
    applicationshell_props = assign(applicationshell_props, applicationshell_spread_levels[i]);
  }
  if (
    /*elementRoot*/
    ctx[0] !== void 0
  ) {
    applicationshell_props.elementRoot = /*elementRoot*/
    ctx[0];
  }
  if (
    /*elementContent*/
    ctx[1] !== void 0
  ) {
    applicationshell_props.elementContent = /*elementContent*/
    ctx[1];
  }
  applicationshell = new ApplicationShell_default({
    props: applicationshell_props,
    $$inline: true
  });
  binding_callbacks.push(() => bind(applicationshell, "elementRoot", applicationshell_elementRoot_binding));
  binding_callbacks.push(() => bind(applicationshell, "elementContent", applicationshell_elementContent_binding));
  const block = {
    c: function create() {
      create_component(applicationshell.$$.fragment);
    },
    m: function mount(target, anchor) {
      mount_component(applicationshell, target, anchor);
      current = true;
    },
    p: function update(ctx2, dirty) {
      const applicationshell_changes = dirty & /*appProps*/
      64 ? get_spread_update(applicationshell_spread_levels, [get_spread_object(
        /*appProps*/
        ctx2[6]
      )]) : {};
      if (dirty & /*$$scope, data, dialogComponent*/
      8388620) {
        applicationshell_changes.$$scope = { dirty, ctx: ctx2 };
      }
      if (!updating_elementRoot && dirty & /*elementRoot*/
      1) {
        updating_elementRoot = true;
        applicationshell_changes.elementRoot = /*elementRoot*/
        ctx2[0];
        add_flush_callback(() => updating_elementRoot = false);
      }
      if (!updating_elementContent && dirty & /*elementContent*/
      2) {
        updating_elementContent = true;
        applicationshell_changes.elementContent = /*elementContent*/
        ctx2[1];
        add_flush_callback(() => updating_elementContent = false);
      }
      applicationshell.$set(applicationshell_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(applicationshell.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(applicationshell.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(applicationshell, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_default_slot.name,
    type: "slot",
    source: "(297:3) <TJSGlassPane id={`${application.id}-glasspane`} {...modalProps} {zIndex}                  on:glasspane:close={() => application.close()}                  on:glasspane:keydown:escape={() => application.close()}>",
    ctx
  });
  return block;
}
function create_fragment2(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block2, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*modal*/
      ctx2[5]
    ) return 0;
    return 1;
  }
  current_block_type_index = select_block_type(ctx, -1);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  const block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx2, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2, dirty);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];
        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block.c();
        } else {
          if_block.p(ctx2, dirty);
        }
        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) {
        detach_dev(if_block_anchor);
      }
      if_blocks[current_block_type_index].d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block,
    id: create_fragment2.name,
    type: "component",
    source: "",
    ctx
  });
  return block;
}
var s_MODAL_BACKGROUND = "#50505080";
function instance2($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  validate_slots("DialogShell", slots, []);
  let { elementContent = void 0 } = $$props;
  let { elementRoot = void 0 } = $$props;
  let { data = {} } = $$props;
  let { dialogComponent = void 0 } = $$props;
  let { managedPromise = void 0 } = $$props;
  const application = getContext("#external")?.application;
  const dialogOptions = writable({});
  setContext("#managedPromise", managedPromise);
  setContext("#dialogOptions", dialogOptions);
  const s_MODAL_TRANSITION = fade;
  const s_MODAL_TRANSITION_OPTIONS = { duration: 200 };
  let modal = void 0;
  const appProps = {
    // Stores any transition functions.
    transition: void 0,
    inTransition: void 0,
    outTransition: void 0,
    // Stores properties to set for options for any transitions.
    transitionOptions: void 0,
    inTransitionOptions: void 0,
    outTransitionOptions: void 0,
    // Stores any style overrides for application shell.
    stylesApp: void 0,
    stylesContent: void 0
  };
  const modalProps = {
    // Background CSS style string.
    background: void 0,
    slotSeparate: void 0,
    styles: void 0,
    // Close modal on glasspane input.
    closeOnInput: void 0,
    // Stores any transition functions.
    transition: void 0,
    inTransition: void 0,
    outTransition: void 0,
    // Stores properties to set for options for any transitions.
    transitionOptions: void 0,
    inTransitionOptions: void 0,
    outTransitionOptions: void 0
  };
  let zIndex = void 0;
  if (modal === void 0) {
    modal = typeof data?.modal === "boolean" ? data.modal : false;
  }
  const activeWindow = application.reactive.activeWindow;
  if (!modal) {
    onDestroy(() => activeWindow.document.removeEventListener("keydown", onKeydown));
    onMount(() => activeWindow.document.addEventListener("keydown", onKeydown));
  }
  function onKeydown(event) {
    if (event.code === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      application.close();
    }
  }
  const writable_props = ["elementContent", "elementRoot", "data", "dialogComponent", "managedPromise"];
  Object.keys($$props).forEach((key) => {
    if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$" && key !== "slot") console.warn(`<DialogShell> was created with unknown prop '${key}'`);
  });
  function dialogcontent_dialogComponent_binding(value) {
    dialogComponent = value;
    $$invalidate(2, dialogComponent);
  }
  function applicationshell_elementRoot_binding(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  function applicationshell_elementContent_binding(value) {
    elementContent = value;
    $$invalidate(1, elementContent);
  }
  const glasspane_close_handler = () => application.close();
  const glasspane_keydown_escape_handler = () => application.close();
  function dialogcontent_dialogComponent_binding_1(value) {
    dialogComponent = value;
    $$invalidate(2, dialogComponent);
  }
  function applicationshell_elementRoot_binding_1(value) {
    elementRoot = value;
    $$invalidate(0, elementRoot);
  }
  function applicationshell_elementContent_binding_1(value) {
    elementContent = value;
    $$invalidate(1, elementContent);
  }
  $$self.$$set = ($$props2) => {
    if ("elementContent" in $$props2) $$invalidate(1, elementContent = $$props2.elementContent);
    if ("elementRoot" in $$props2) $$invalidate(0, elementRoot = $$props2.elementRoot);
    if ("data" in $$props2) $$invalidate(3, data = $$props2.data);
    if ("dialogComponent" in $$props2) $$invalidate(2, dialogComponent = $$props2.dialogComponent);
    if ("managedPromise" in $$props2) $$invalidate(9, managedPromise = $$props2.managedPromise);
  };
  $$self.$capture_state = () => ({
    getContext,
    onDestroy,
    onMount,
    setContext,
    writable,
    fade,
    ApplicationShell: ApplicationShell_default,
    TJSGlassPane: TJSGlassPane_default,
    A11yHelper,
    isObject,
    DialogContent: DialogContent_default,
    elementContent,
    elementRoot,
    data,
    dialogComponent,
    managedPromise,
    application,
    dialogOptions,
    s_MODAL_TRANSITION,
    s_MODAL_TRANSITION_OPTIONS,
    s_MODAL_BACKGROUND,
    modal,
    appProps,
    modalProps,
    zIndex,
    activeWindow,
    onKeydown
  });
  $$self.$inject_state = ($$props2) => {
    if ("elementContent" in $$props2) $$invalidate(1, elementContent = $$props2.elementContent);
    if ("elementRoot" in $$props2) $$invalidate(0, elementRoot = $$props2.elementRoot);
    if ("data" in $$props2) $$invalidate(3, data = $$props2.data);
    if ("dialogComponent" in $$props2) $$invalidate(2, dialogComponent = $$props2.dialogComponent);
    if ("managedPromise" in $$props2) $$invalidate(9, managedPromise = $$props2.managedPromise);
    if ("modal" in $$props2) $$invalidate(5, modal = $$props2.modal);
    if ("zIndex" in $$props2) $$invalidate(8, zIndex = $$props2.zIndex);
  };
  if ($$props && "$$inject" in $$props) {
    $$self.$inject_state($$props.$$inject);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*elementRoot, modal*/
    33) {
      $: if (A11yHelper.isFocusTarget(elementRoot)) {
        elementRoot.setAttribute("role", "dialog");
        if (modal) {
          elementRoot.setAttribute("aria-modal", "true");
        }
      }
    }
    if ($$self.$$.dirty & /*data, modal, zIndex, application*/
    312) {
      $: if (isObject(data)) {
        dialogOptions.set(data);
        const newZIndex = Number.isInteger(data.zIndex) || data.zIndex === null ? data.zIndex : modal ? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER - 1;
        if (zIndex !== newZIndex) {
          $$invalidate(8, zIndex = newZIndex);
        }
        const newDraggable = typeof data.draggable === "boolean" ? data.draggable : void 0;
        if (newDraggable !== void 0 && application.reactive.draggable !== newDraggable) {
          $$invalidate(4, application.reactive.draggable = newDraggable, application);
        }
        const newFocusAuto = typeof data.focusAuto === "boolean" ? data.focusAuto : void 0;
        if (newFocusAuto !== void 0 && application.reactive.focusAuto !== newFocusAuto) {
          $$invalidate(4, application.reactive.focusAuto = newFocusAuto, application);
        }
        const newFocusKeep = typeof data.focusKeep === "boolean" ? data.focusKeep : void 0;
        if (newFocusKeep !== void 0 && application.reactive.focusKeep !== newFocusKeep) {
          $$invalidate(4, application.reactive.focusKeep = newFocusKeep, application);
        }
        const newFocusTrap = typeof data.focusTrap === "boolean" ? data.focusTrap : void 0;
        if (newFocusTrap !== void 0 && application.reactive.focusTrap !== newFocusTrap) {
          $$invalidate(4, application.reactive.focusTrap = newFocusTrap, application);
        }
        const newMinimizable = typeof data.minimizable === "boolean" ? data.minimizable : void 0;
        if (newMinimizable !== void 0 && application.reactive.minimizable !== newMinimizable) {
          $$invalidate(4, application.reactive.minimizable = newMinimizable, application);
        }
        const newResizable = typeof data.resizable === "boolean" ? data.resizable : void 0;
        if (newResizable !== void 0 && application.reactive.resizable !== newResizable) {
          $$invalidate(4, application.reactive.resizable = newResizable, application);
        }
        const newTitle = data.title ?? "Dialog";
        if (newTitle !== application?.options?.title) {
          $$invalidate(4, application.reactive.title = newTitle, application);
        }
        if (application.position.zIndex !== zIndex) {
          $$invalidate(4, application.position.zIndex = zIndex, application);
        }
      }
    }
    if ($$self.$$.dirty & /*data, appProps*/
    72) {
      $: if (isObject(data?.transition)) {
        const d = data.transition;
        if (d?.transition !== appProps.transition) {
          $$invalidate(6, appProps.transition = d.transition, appProps);
        }
        if (d?.inTransition !== appProps.inTransition) {
          $$invalidate(6, appProps.inTransition = d.inTransition, appProps);
        }
        if (d?.outTransition !== appProps.outTransition) {
          $$invalidate(6, appProps.outTransition = d.outTransition, appProps);
        }
        if (d?.transitionOptions !== appProps.transitionOptions) {
          $$invalidate(6, appProps.transitionOptions = d.transitionOptions, appProps);
        }
        if (d?.inTransitionOptions !== appProps.inTransitionOptions) {
          $$invalidate(6, appProps.inTransitionOptions = d.inTransitionOptions, appProps);
        }
        if (d?.outTransitionOptions !== appProps.outTransitionOptions) {
          $$invalidate(6, appProps.outTransitionOptions = d.outTransitionOptions, appProps);
        }
      }
    }
    if ($$self.$$.dirty & /*data, modalProps*/
    136) {
      $: {
        const newModalBackground = typeof data?.modalOptions?.background === "string" ? data.modalOptions.background : s_MODAL_BACKGROUND;
        if (newModalBackground !== modalProps.background) {
          $$invalidate(7, modalProps.background = newModalBackground, modalProps);
        }
      }
    }
    if ($$self.$$.dirty & /*data, modalProps*/
    136) {
      $: {
        const newModalSlotSeparate = typeof data?.modalOptions?.slotSeparate === "boolean" ? data.modalOptions.slotSeparate : void 0;
        if (newModalSlotSeparate !== modalProps.slotSeparate) {
          $$invalidate(7, modalProps.slotSeparate = newModalSlotSeparate, modalProps);
        }
      }
    }
    if ($$self.$$.dirty & /*data, modalProps*/
    136) {
      $: {
        const newModalStyles = isObject(data?.modalOptions?.styles) ? data.modalOptions.styles : void 0;
        if (newModalStyles !== modalProps.styles) {
          $$invalidate(7, modalProps.styles = newModalStyles, modalProps);
        }
      }
    }
    if ($$self.$$.dirty & /*data, modalProps*/
    136) {
      $: {
        const newModalCloseOnInput = typeof data?.modalOptions?.closeOnInput === "boolean" ? data.modalOptions.closeOnInput : void 0;
        if (newModalCloseOnInput !== modalProps.closeOnInput) {
          $$invalidate(7, modalProps.closeOnInput = newModalCloseOnInput, modalProps);
        }
      }
    }
    if ($$self.$$.dirty & /*data, modalProps*/
    136) {
      $: if (isObject(data?.modalOptions?.transition)) {
        const d = data.modalOptions.transition;
        if (d?.transition !== modalProps.transition) {
          $$invalidate(
            7,
            modalProps.transition = typeof d?.transition === "function" ? d.transition : s_MODAL_TRANSITION,
            modalProps
          );
        }
        if (d?.inTransition !== modalProps.inTransition) {
          $$invalidate(7, modalProps.inTransition = d.inTransition, modalProps);
        }
        if (d?.outTransition !== modalProps.outTransition) {
          $$invalidate(7, modalProps.outTransition = d.outTransition, modalProps);
        }
        if (d?.transitionOptions !== modalProps.transitionOptions) {
          $$invalidate(
            7,
            modalProps.transitionOptions = isObject(d?.transitionOptions) ? d.transitionOptions : s_MODAL_TRANSITION_OPTIONS,
            modalProps
          );
        }
        if (d?.inTransitionOptions !== modalProps.inTransitionOptions) {
          $$invalidate(7, modalProps.inTransitionOptions = d.inTransitionOptions, modalProps);
        }
        if (d?.outTransitionOptions !== modalProps.outTransitionOptions) {
          $$invalidate(7, modalProps.outTransitionOptions = d.outTransitionOptions, modalProps);
        }
      } else {
        const newModalTransition = typeof data?.modalOptions?.transition?.transition === "function" ? data.modalOptions.transition.transition : s_MODAL_TRANSITION;
        if (newModalTransition !== modalProps.transition) {
          $$invalidate(7, modalProps.transition = newModalTransition, modalProps);
        }
        const newModalTransitionOptions = isObject(data?.modalOptions?.transitionOptions) ? data.modalOptions.transitionOptions : s_MODAL_TRANSITION_OPTIONS;
        if (newModalTransitionOptions !== modalProps.transitionOptions) {
          $$invalidate(7, modalProps.transitionOptions = newModalTransitionOptions, modalProps);
        }
      }
    }
  };
  return [
    elementRoot,
    elementContent,
    dialogComponent,
    data,
    application,
    modal,
    appProps,
    modalProps,
    zIndex,
    managedPromise,
    dialogcontent_dialogComponent_binding,
    applicationshell_elementRoot_binding,
    applicationshell_elementContent_binding,
    glasspane_close_handler,
    glasspane_keydown_escape_handler,
    dialogcontent_dialogComponent_binding_1,
    applicationshell_elementRoot_binding_1,
    applicationshell_elementContent_binding_1
  ];
}
var DialogShell = class extends SvelteComponentDev {
  constructor(options) {
    super(options);
    init(this, options, instance2, create_fragment2, safe_not_equal, {
      elementContent: 1,
      elementRoot: 0,
      data: 3,
      dialogComponent: 2,
      managedPromise: 9
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: this,
      tagName: "DialogShell",
      options,
      id: create_fragment2.name
    });
  }
  get elementContent() {
    return this.$$.ctx[1];
  }
  set elementContent(elementContent) {
    this.$$set({ elementContent });
    flush();
  }
  get elementRoot() {
    return this.$$.ctx[0];
  }
  set elementRoot(elementRoot) {
    this.$$set({ elementRoot });
    flush();
  }
  get data() {
    return this.$$.ctx[3];
  }
  set data(data) {
    this.$$set({ data });
    flush();
  }
  get dialogComponent() {
    return this.$$.ctx[2];
  }
  set dialogComponent(dialogComponent) {
    this.$$set({ dialogComponent });
    flush();
  }
  get managedPromise() {
    return this.$$.ctx[9];
  }
  set managedPromise(managedPromise) {
    this.$$set({ managedPromise });
    flush();
  }
};
var DialogShell_default = DialogShell;

// node_modules/@typhonjs-fvtt/runtime/_dist/util/async/index.js
var ManagedPromise = class _ManagedPromise {
  /** @type {boolean} */
  static #logging = false;
  /** @type {{ isProcessing?: boolean, promise?: Promise, reject: Function, resolve: Function }} */
  #current;
  /**
   * @returns {boolean} Whether global logging is enabled.
   */
  static get logging() {
    return this.#logging;
  }
  /**
   * @returns {boolean} Whether there is an active managed Promise.
   */
  get isActive() {
    return this.#current !== void 0;
  }
  /**
   * @returns {boolean} Whether there is an active managed Promise and resolution is currently being processed.
   */
  get isProcessing() {
    return this.#current !== void 0 ? this.#current.isProcessing : false;
  }
  /**
   * Sets global logging enabled state.
   *
   * @param {boolean}  logging - New logging enabled state.
   */
  static set logging(logging) {
    if (typeof logging !== "boolean") {
      throw new TypeError(`[TRL] ManagedPromise.logging error: 'logging' is not a boolean.`);
    }
    this.#logging = logging;
  }
  // ----------------------------------------------------------------------------------------------------------------
  /**
   * Resolves any current Promise with undefined and creates a new current Promise.
   *
   * @template T
   *
   * @param {object} opts - Options.
   *
   * @param {boolean}  [opts.reuse=false] - When true if there is an existing live Promise it is returned immediately.
   *
   * @returns {Promise<T>} The new current managed Promise.
   */
  create({ reuse = false } = {}) {
    if (typeof reuse !== "boolean") {
      throw new TypeError(`[TRL] ManagedPromise.create error: 'reuse' is not a boolean.`);
    }
    if (reuse && this.#current !== void 0 && CrossWindow.isPromise(this.#current.promise)) {
      if (_ManagedPromise.#logging) {
        console.warn(`[TRL] ManagedPromise.create info: Reusing / returning existing managed Promise.`);
      }
      return this.#current.promise;
    }
    if (this.#current !== void 0) {
      if (_ManagedPromise.#logging) {
        console.warn(
          `[TRL] ManagedPromise.create info: Creating a new Promise and resolving existing immediately.`
        );
      }
      this.#current.resolve(void 0);
      this.#current = void 0;
    }
    const promise = new Promise((resolve, reject) => {
      this.#current = {
        isProcessing: false,
        reject,
        resolve
      };
    });
    this.#current.promise = promise;
    return promise;
  }
  /**
   * Gets the current Promise if any.
   *
   * @returns {Promise<any>} Current Promise.
   */
  get() {
    return this.#current ? this.#current.promise : void 0;
  }
  /**
   * Rejects the current Promise if applicable.
   *
   * @param {*}  [result] - Result to reject.
   *
   * @returns {boolean} Was the promise rejected.
   */
  reject(result = void 0) {
    if (this.#current !== void 0 && this.#current.isProcessing) {
      if (_ManagedPromise.#logging) {
        console.warn(`[TRL] ManagedPromise.reject info: Currently processing promise.`);
      }
      return true;
    }
    if (this.#current !== void 0) {
      this.#current.isProcessing = true;
      if (CrossWindow.isPromise(result)) {
        result.then((value) => {
          this.#current.reject(value);
          this.#current = void 0;
        }).catch((err) => {
          this.#current.reject(err);
          this.#current = void 0;
        });
      } else {
        this.#current.reject(result);
        this.#current = void 0;
      }
      return true;
    } else {
      if (_ManagedPromise.#logging) {
        console.warn(`[TRL] ManagedPromise.reject warning: No current managed Promise to reject.`);
      }
      return false;
    }
  }
  /**
   * Resolves the current Promise if applicable.
   *
   * @param {*}  [result] - Result to resolve.
   *
   * @returns {boolean} Was the promise resolved.
   */
  resolve(result = void 0) {
    if (this.#current !== void 0 && this.#current.isProcessing) {
      if (_ManagedPromise.#logging) {
        console.warn(`[TRL] ManagedPromise.resolve info: Currently processing promise.`);
      }
      return true;
    }
    if (this.#current !== void 0) {
      if (CrossWindow.isPromise(result)) {
        this.#current.isProcessing = true;
        result.then((value) => {
          this.#current.resolve(value);
          this.#current = void 0;
        }).catch((err) => {
          this.#current.reject(err);
          this.#current = void 0;
        });
      } else {
        this.#current.resolve(result);
        this.#current = void 0;
      }
      return true;
    } else {
      if (_ManagedPromise.#logging) {
        console.warn(`[TRL] ManagedPromise.resolve warning: No current managed Promise to resolve.`);
      }
      return false;
    }
  }
};

// node_modules/@typhonjs-fvtt/runtime/_dist/svelte/application/index.js
var ApplicationState = class {
  /** @type {import('../../SvelteApp.js').SvelteApp} */
  #application;
  /**
   * Stores the current save state key being restored by animating. When a restore is already being animated with the
   * same name the subsequent restore animation is ignored.
   *
   * @type {string | undefined}
   */
  #currentRestoreKey;
  /** @type {Map<string, import('../../types').SvelteApp.API.State.Data>} */
  #dataSaved = /* @__PURE__ */ new Map();
  /**
   * @param {import('../../SvelteApp.js').SvelteApp}   application - The application.
   */
  constructor(application) {
    this.#application = application;
    Object.seal(this);
  }
  /**
   * Clears all saved application state.
   */
  clear() {
    this.#dataSaved.clear();
  }
  /**
   * Returns current application state along with any extra data passed into method.
   *
   * @param {object} [extra] - Extra data to add to application state.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data} Passed in object with current application state.
   */
  current(extra = {}) {
    return Object.assign(extra, {
      position: this.#application?.position?.get(),
      beforeMinimized: this.#application?.position?.state.get({ name: "#beforeMinimized" }),
      options: this.#application?.reactive?.toJSON(),
      ui: { minimized: this.#application?.reactive?.minimized }
    });
  }
  /**
   * Gets any saved application state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Saved data set name.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data | undefined} Any saved application state.
   */
  get({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.get] error: 'name' is not a string.`);
    }
    return this.#dataSaved.get(name);
  }
  /**
   * @returns {IterableIterator<string>} The saved application state names / keys.
   */
  keys() {
    return this.#dataSaved.keys();
  }
  /**
   * Removes and returns any saved application state by name.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to remove and retrieve.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data | undefined} Any saved application state.
   */
  remove({ name }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.remove] error: 'name' is not a string.`);
    }
    const data = this.#dataSaved.get(name);
    this.#dataSaved.delete(name);
    return data;
  }
  /**
   * Restores a previously saved application state by `name` returning the data. Several optional parameters are
   * available to animate / tween to the new state. When `animateTo` is true an animation is scheduled via
   * {@link #runtime/svelte/store/position!TJSPosition.API.Animation.to} and the duration and easing name or function may be
   * specified.
   *
   * @param {object}            options - Options.
   *
   * @param {string}            options.name - Saved data set name.
   *
   * @param {boolean}           [options.remove=false] - Remove data set.
   *
   * @param {boolean}           [options.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [options.duration=0.1] - Duration in seconds.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/easing').EasingReference} [options.ease='linear'] - Easing function or easing
   *        function name.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data | undefined} Any saved application state.
   */
  restore({ name, remove = false, animateTo = false, duration = 0.1, ease = "linear" }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.restore] error: 'name' is not a string.`);
    }
    const dataSaved = this.#dataSaved.get(name);
    if (dataSaved) {
      if (remove) {
        this.#dataSaved.delete(name);
      }
      if (animateTo && name !== this.#currentRestoreKey) {
        this.#currentRestoreKey = name;
        this.#setImpl(dataSaved, {
          animateTo,
          async: true,
          duration,
          ease
        }).then(() => {
          if (name === this.#currentRestoreKey) {
            this.#currentRestoreKey = void 0;
          }
        });
      }
    }
    return dataSaved;
  }
  /**
   * Saves current application state with the opportunity to add extra data to the saved state.
   *
   * @param {object}   options - Options.
   *
   * @param {string}   options.name - Name to index this saved state.
   *
   * @returns {import('../../types').SvelteApp.API.State.Data} Current saved application state.
   */
  save({ name, ...extra }) {
    if (typeof name !== "string") {
      throw new TypeError(`[SvelteApp.state.save] error: 'name' is not a string.`);
    }
    const data = this.current(extra);
    this.#dataSaved.set(name, data);
    return data;
  }
  /**
   * Sets application state from the given `SvelteApp.API.State.Data` instance. Several optional parameters are
   * available to animate / tween to the new state. When `animateTo` is true an animation is scheduled via
   * {@link #runtime/svelte/store/position!AnimationAPI.to} and the duration and easing name or function may be
   * specified.
   *
   * Note: If serializing application state any minimized apps will use the before minimized state on initial render
   * of the app as it is currently not possible to render apps with Foundry VTT core API in the minimized state.
   *
   * @param {import('../../types').SvelteApp.API.State.Data}   data - Saved data set name.
   *
   * @param {object}         [options] - Optional parameters
   *
   * @param {boolean}        [options.animateTo=false] - Animate to restore data.
   *
   * @param {number}         [options.duration=0.1] - Duration in seconds.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/easing').EasingReference} [options.ease='linear'] - Easing function or easing
   *        function name.
   */
  set(data, options = {}) {
    this.#setImpl(data, { ...options, async: false });
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Sets application state from the given `SvelteApp.API.State.Data` instance. Several optional parameters are
   * available to animate / tween to the new state. When `animateTo` is true an animation is scheduled via
   * {@link #runtime/svelte/store/position!AnimationAPI.to} and the duration and easing name or function may be
   * specified.
   *
   * Note: If serializing application state any minimized apps will use the before minimized state on initial render
   * of the app as it is currently not possible to render apps with Foundry VTT core API in the minimized state.
   *
   * @privateRemarks
   * TODO: THIS METHOD NEEDS TO BE REFACTORED WHEN TRL IS MADE INTO A STANDALONE FRAMEWORK.
   *
   * @param {import('../../types').SvelteApp.API.State.Data}   data - Saved data set name.
   *
   * @param {object}            [opts] - Optional parameters
   *
   * @param {boolean}           [opts.async=false] - If animating return a Promise that resolves with any saved data.
   *
   * @param {boolean}           [opts.animateTo=false] - Animate to restore data.
   *
   * @param {number}            [opts.duration=0.1] - Duration in seconds.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/easing').EasingReference} [opts.ease='linear'] - Easing function or easing
   *        function name.
   *
   * @returns {undefined | Promise<void>} When asynchronous the animation Promise.
   */
  #setImpl(data, { async = false, animateTo = false, duration = 0.1, ease = "linear" } = {}) {
    if (!isObject(data)) {
      throw new TypeError(`[SvelteApp.state.set] error: 'data' is not an object.`);
    }
    const application = this.#application;
    if (!isObject(data?.position)) {
      console.warn(`[SvelteApp.state.set] warning: 'data.position' is not an object.`);
      return;
    }
    const rendered = application.rendered;
    if (animateTo) {
      if (!rendered) {
        console.warn(`[SvelteApp.state.set] warning: application is not rendered and 'animateTo' is true.`);
        return;
      }
      if (data.position.transformOrigin !== application.position.transformOrigin) {
        application.position.transformOrigin = data.position.transformOrigin;
      }
      if (isObject(data?.ui)) {
        const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
        if (application?.reactive?.minimized && !minimized) {
          application.maximize({ animate: false, duration: 0 });
        }
      }
      const promise = application.position.animate.to(data.position, {
        duration,
        ease,
        strategy: "cancelAll"
      }).finished.then(({ cancelled }) => {
        if (cancelled) {
          return;
        }
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration: 0 });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
      });
      if (async) {
        return promise;
      }
    } else {
      if (rendered) {
        if (isObject(data?.options)) {
          application?.reactive.mergeOptions(data.options);
        }
        if (isObject(data?.ui)) {
          const minimized = typeof data.ui?.minimized === "boolean" ? data.ui.minimized : false;
          if (application?.reactive?.minimized && !minimized) {
            application.maximize({ animate: false, duration: 0 });
          } else if (!application?.reactive?.minimized && minimized) {
            application.minimize({ animate: false, duration });
          }
        }
        if (isObject(data?.beforeMinimized)) {
          application.position.state.set({ name: "#beforeMinimized", ...data.beforeMinimized });
        }
        application.position.set(data.position);
      } else {
        let positionData = data.position;
        if (isObject(data.beforeMinimized)) {
          positionData = data.beforeMinimized;
          positionData.left = data.position.left;
          positionData.top = data.position.top;
        }
        application.position.set(positionData);
      }
    }
  }
};
var GetSvelteData = class {
  /** @type {import('svelte').SvelteComponent[] | null[]} */
  #applicationShellHolder;
  /** @type {import('./types').SvelteData[]} */
  #svelteData;
  /**
   * Keep a direct reference to the SvelteData array in an associated {@link SvelteApp}.
   *
   * @param {import('svelte').SvelteComponent[] | null[]}  applicationShellHolder - A reference to the mounted app shell.
   *
   * @param {import('./types').SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
   */
  constructor(applicationShellHolder, svelteData) {
    this.#applicationShellHolder = applicationShellHolder;
    this.#svelteData = svelteData;
  }
  /**
   * Returns any mounted application shell.
   *
   * @returns {import('svelte').SvelteComponent} Any mounted application shell.
   */
  get appShell() {
    return this.#applicationShellHolder[0];
  }
  /**
   * Returns any mounted application shell.
   *
   * @deprecated Use {@link GetSvelteData.appShell}; since `0.2.0` removal in `0.5.0`.
   *
   * @returns {import('svelte').SvelteComponent} Any mounted application shell.
   */
  get applicationShell() {
    return this.#applicationShellHolder[0];
  }
  /**
   * Returns mounted application shell data / config.
   *
   * @internal
   *
   * @returns {import('./types').SvelteData} Any mounted application shell data.
   */
  get appShellData() {
    return this.#svelteData[0];
  }
};
var SvelteReactive = class {
  /**
   * @type {import('../SvelteApp').SvelteApp}
   */
  #application;
  /**
   * @type {boolean}
   */
  #initialized = false;
  /** @type {import('@typhonjs-fvtt/runtime/svelte/store/web-storage').WebStorage} */
  #sessionStorage;
  /**
   * The Application option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {import('./types').StoreAppOptions}
   */
  #storeAppOptions;
  /**
   * Stores the update function for `#storeAppOptions`.
   *
   * @type {(this: void, updater: import('svelte/store').Updater<object>) => void}
   */
  #storeAppOptionsUpdate;
  /**
   * Stores the UI state data to make it accessible via getters.
   *
   * @type {object}
   */
  #dataUIState;
  /**
   * The UI option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {import('./types').StoreUIOptions}
   */
  #storeUIState;
  /**
   * Stores the update function for `#storeUIState`.
   *
   * @type {(this: void, updater: import('svelte/store').Updater<object>) => void}
   */
  #storeUIStateUpdate;
  /**
   * Stores the unsubscribe functions from local store subscriptions.
   *
   * @type {import('svelte/store').Unsubscriber[]}
   */
  #storeUnsubscribe = [];
  /**
   * @param {import('../SvelteApp').SvelteApp} application - The host Foundry application.
   */
  constructor(application) {
    this.#application = application;
    const optionsSessionStorage = application?.options?.sessionStorage;
    if (optionsSessionStorage !== void 0 && !(optionsSessionStorage instanceof TJSWebStorage)) {
      throw new TypeError(`'options.sessionStorage' is not an instance of TJSWebStorage.`);
    }
    this.#sessionStorage = optionsSessionStorage !== void 0 ? optionsSessionStorage : new TJSSessionStorage();
  }
  /**
   * Initializes reactive support. Package private for internal use.
   *
   * @returns {import('./types-local').SvelteReactiveStores | undefined} Internal methods to interact with Svelte
   * stores.
   *
   * @package
   * @internal
   */
  initialize() {
    if (this.#initialized) {
      return;
    }
    this.#initialized = true;
    this.#storesInitialize();
    return {
      appOptionsUpdate: this.#storeAppOptionsUpdate,
      uiStateUpdate: this.#storeUIStateUpdate,
      subscribe: this.#storesSubscribe.bind(this),
      unsubscribe: this.#storesUnsubscribe.bind(this)
    };
  }
  // Store getters -----------------------------------------------------------------------------------------------------
  /**
   * @returns {import('@typhonjs-fvtt/runtime/svelte/store/web-storage').WebStorage} Returns WebStorage (session) instance.
   */
  get sessionStorage() {
    return this.#sessionStorage;
  }
  /**
   * Returns the store for app options.
   *
   * @returns {import('../../types').SvelteApp.API.Reactive.AppOptions} App options store.
   */
  get storeAppOptions() {
    return this.#storeAppOptions;
  }
  /**
   * Returns the store for UI options.
   *
   * @returns {import('../../types').SvelteApp.API.Reactive.UIState} UI options store.
   */
  get storeUIState() {
    return this.#storeUIState;
  }
  // Only reactive getters ---------------------------------------------------------------------------------------------
  /**
   * Returns the current active Window / WindowProxy UI state.
   *
   * @returns {Window} Active window UI state.
   */
  get activeWindow() {
    return this.#dataUIState.activeWindow ?? globalThis;
  }
  /**
   * Returns the current dragging UI state.
   *
   * @returns {boolean} Dragging UI state.
   */
  get dragging() {
    return this.#dataUIState.dragging;
  }
  /**
   * Returns the current minimized UI state.
   *
   * @returns {boolean} Minimized UI state.
   */
  get minimized() {
    return this.#dataUIState.minimized;
  }
  /**
   * Returns the current resizing UI state.
   *
   * @returns {boolean} Resizing UI state.
   */
  get resizing() {
    return this.#dataUIState.resizing;
  }
  /**
   * Sets the current active Window / WindowProxy UI state.
   *
   * Note: This is protected usage and used internally.
   *
   * @param {Window} activeWindow - Active Window / WindowProxy UI state.
   *
   * @hidden
   */
  set activeWindow(activeWindow) {
    if (activeWindow === void 0 || activeWindow === null || Object.prototype.toString.call(activeWindow) === "[object Window]") {
      this.#storeUIStateUpdate((options) => deepMerge(options, { activeWindow: activeWindow ?? globalThis }));
    }
  }
  // Reactive getter / setters -----------------------------------------------------------------------------------------
  /**
   * Returns the draggable app option.
   *
   * @returns {boolean} Draggable app option.
   */
  get draggable() {
    return this.#application?.options?.draggable;
  }
  /**
   * Returns the focusAuto app option.
   *
   * @returns {boolean} When true auto-management of app focus is enabled.
   */
  get focusAuto() {
    return this.#application?.options?.focusAuto;
  }
  /**
   * Returns the focusKeep app option.
   *
   * @returns {boolean} When `focusAuto` and `focusKeep` is true; keeps internal focus.
   */
  get focusKeep() {
    return this.#application?.options?.focusKeep;
  }
  /**
   * Returns the focusTrap app option.
   *
   * @returns {boolean} When true focus trapping / wrapping is enabled keeping focus inside app.
   */
  get focusTrap() {
    return this.#application?.options?.focusTrap;
  }
  /**
   * Returns the headerButtonNoClose app option.
   *
   * @returns {boolean} Remove the close the button in header app option.
   */
  get headerButtonNoClose() {
    return this.#application?.options?.headerButtonNoClose;
  }
  /**
   * Returns the headerButtonNoLabel app option.
   *
   * @returns {boolean} Remove the labels from buttons in header app option.
   */
  get headerButtonNoLabel() {
    return this.#application?.options?.headerButtonNoLabel;
  }
  /**
   * Returns the headerIcon app option.
   *
   * @returns {string|void} URL for header app icon.
   */
  get headerIcon() {
    return this.#application?.options?.headerIcon;
  }
  /**
   * Returns the headerNoTitleMinimized app option.
   *
   * @returns {boolean} When true removes the header title when minimized.
   */
  get headerNoTitleMinimized() {
    return this.#application?.options?.headerNoTitleMinimized;
  }
  /**
   * Returns the minimizable app option.
   *
   * @returns {boolean} Minimizable app option.
   */
  get minimizable() {
    return this.#application?.options?.minimizable;
  }
  /**
   * Returns the Foundry popOut state; {@link Application.popOut}
   *
   * @returns {boolean} Positionable app option.
   */
  get popOut() {
    return this.#application.popOut;
  }
  /**
   * Returns the positionable app option; {@link SvelteApp.Options.positionable}
   *
   * @returns {boolean} Positionable app option.
   */
  get positionable() {
    return this.#application?.options?.positionable;
  }
  /**
   * Returns the resizable option.
   *
   * @returns {boolean} Resizable app option.
   */
  get resizable() {
    return this.#application?.options?.resizable;
  }
  /**
   * Returns the title accessor from the parent Application class; {@link Application.title}
   *
   * @privateRemarks
   * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.    *
   *
   * @returns {string} Title.
   */
  get title() {
    return this.#application.title;
  }
  /**
   * Sets `this.options.draggable` which is reactive for application shells.
   *
   * @param {boolean}  draggable - Sets the draggable option.
   */
  set draggable(draggable) {
    if (typeof draggable === "boolean") {
      this.setOptions("draggable", draggable);
    }
  }
  /**
   * Sets `this.options.focusAuto` which is reactive for application shells.
   *
   * @param {boolean}  focusAuto - Sets the focusAuto option.
   */
  set focusAuto(focusAuto) {
    if (typeof focusAuto === "boolean") {
      this.setOptions("focusAuto", focusAuto);
    }
  }
  /**
   * Sets `this.options.focusKeep` which is reactive for application shells.
   *
   * @param {boolean}  focusKeep - Sets the focusKeep option.
   */
  set focusKeep(focusKeep) {
    if (typeof focusKeep === "boolean") {
      this.setOptions("focusKeep", focusKeep);
    }
  }
  /**
   * Sets `this.options.focusTrap` which is reactive for application shells.
   *
   * @param {boolean}  focusTrap - Sets the focusTrap option.
   */
  set focusTrap(focusTrap) {
    if (typeof focusTrap === "boolean") {
      this.setOptions("focusTrap", focusTrap);
    }
  }
  /**
   * Sets `this.options.headerButtonNoClose` which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoClose - Sets the headerButtonNoClose option.
   */
  set headerButtonNoClose(headerButtonNoClose) {
    if (typeof headerButtonNoClose === "boolean") {
      this.setOptions("headerButtonNoClose", headerButtonNoClose);
    }
  }
  /**
   * Sets `this.options.headerButtonNoLabel` which is reactive for application shells.
   *
   * @param {boolean}  headerButtonNoLabel - Sets the headerButtonNoLabel option.
   */
  set headerButtonNoLabel(headerButtonNoLabel) {
    if (typeof headerButtonNoLabel === "boolean") {
      this.setOptions("headerButtonNoLabel", headerButtonNoLabel);
    }
  }
  /**
   * Sets `this.options.headerIcon` which is reactive for application shells.
   *
   * @param {string | undefined}  headerIcon - Sets the headerButtonNoLabel option.
   */
  set headerIcon(headerIcon) {
    if (headerIcon === void 0 || typeof headerIcon === "string") {
      this.setOptions("headerIcon", headerIcon);
    }
  }
  /**
   * Sets `this.options.headerNoTitleMinimized` which is reactive for application shells.
   *
   * @param {boolean}  headerNoTitleMinimized - Sets the headerNoTitleMinimized option.
   */
  set headerNoTitleMinimized(headerNoTitleMinimized) {
    if (typeof headerNoTitleMinimized === "boolean") {
      this.setOptions("headerNoTitleMinimized", headerNoTitleMinimized);
    }
  }
  /**
   * Sets `this.options.minimizable` which is reactive for application shells that are also pop out.
   *
   * @param {boolean}  minimizable - Sets the minimizable option.
   */
  set minimizable(minimizable) {
    if (typeof minimizable === "boolean") {
      this.setOptions("minimizable", minimizable);
    }
  }
  /**
   * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
   * from `ui.windows`.
   *
   * @param {boolean}  popOut - Sets the popOut option.
   */
  set popOut(popOut) {
    if (typeof popOut === "boolean") {
      this.setOptions("popOut", popOut);
    }
  }
  /**
   * Sets `this.options.positionable` enabling / disabling {@link SvelteApp.position}.
   *
   * @param {boolean}  positionable - Sets the positionable option.
   */
  set positionable(positionable) {
    if (typeof positionable === "boolean") {
      this.setOptions("positionable", positionable);
    }
  }
  /**
   * Sets `this.options.resizable` which is reactive for application shells.
   *
   * @param {boolean}  resizable - Sets the resizable option.
   */
  set resizable(resizable) {
    if (typeof resizable === "boolean") {
      this.setOptions("resizable", resizable);
    }
  }
  /**
   * Sets `this.options.title` which is reactive for application shells.
   *
   * Note: Will set empty string if title is undefined or null.
   *
   * @param {string | undefined | null}   title - Application title; will be localized, so a translation key is fine.
   */
  set title(title) {
    if (typeof title === "string") {
      this.setOptions("title", title);
    } else if (title === void 0 || title === null) {
      this.setOptions("title", "");
    }
  }
  // Reactive Options API -------------------------------------------------------------------------------------------
  /**
   * Provides a way to safely get this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */
  getOptions(accessor, defaultValue) {
    return safeAccess(this.#application.options, accessor, defaultValue);
  }
  /**
   * Provides a way to merge `options` into this applications options and update the appOptions store.
   *
   * @param {object}   options - The options object to merge with `this.options`.
   */
  mergeOptions(options) {
    this.#storeAppOptionsUpdate((instanceOptions) => deepMerge(instanceOptions, options));
  }
  /**
   * Provides a way to safely set this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Additionally, if an application shell Svelte component is mounted and exports the `appOptions` property then
   * the application options is set to `appOptions` potentially updating the application shell / Svelte component.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {any}      value - Value to set.
   */
  setOptions(accessor, value) {
    const success = safeSet(this.#application.options, accessor, value, { createMissing: true });
    if (success) {
      this.#storeAppOptionsUpdate(() => this.#application.options);
    }
  }
  /**
   * Serializes the main {@link SvelteApp.Options} for common application state.
   *
   * @returns {import('../../types').SvelteApp.API.Reactive.Data} Common application state.
   */
  toJSON() {
    return {
      draggable: this.#application?.options?.draggable ?? true,
      focusAuto: this.#application?.options?.focusAuto ?? true,
      focusKeep: this.#application?.options?.focusKeep ?? false,
      focusTrap: this.#application?.options?.focusTrap ?? true,
      headerButtonNoClose: this.#application?.options?.headerButtonNoClose ?? false,
      headerButtonNoLabel: this.#application?.options?.headerButtonNoLabel ?? false,
      headerNoTitleMinimized: this.#application?.options?.headerNoTitleMinimized ?? false,
      minimizable: this.#application?.options?.minimizable ?? true,
      positionable: this.#application?.options?.positionable ?? true,
      resizable: this.#application?.options?.resizable ?? true
    };
  }
  /**
   * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
   * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
   * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
   * the new buttons.
   *
   * Optionally you can set in the SvelteApp app options {@link SvelteApp.Options.headerButtonNoClose}
   * to remove the close button and {@link SvelteApp.Options.headerButtonNoLabel} to true and labels will be
   * removed from the header buttons.
   *
   * @param {object} [opts] - Optional parameters (for internal use)
   *
   * @param {boolean} [opts.headerButtonNoClose] - The value for `headerButtonNoClose`.
   *
   * @param {boolean} [opts.headerButtonNoLabel] - The value for `headerButtonNoLabel`.
   */
  updateHeaderButtons({
    headerButtonNoClose = this.#application.options.headerButtonNoClose,
    headerButtonNoLabel = this.#application.options.headerButtonNoLabel
  } = {}) {
    let buttons = this.#application._getHeaderButtons();
    if (typeof headerButtonNoClose === "boolean" && headerButtonNoClose) {
      buttons = buttons.filter((button) => button.class !== "close");
    }
    if (typeof headerButtonNoLabel === "boolean" && headerButtonNoLabel) {
      for (const button of buttons) {
        button.label = void 0;
      }
    }
    this.#storeUIStateUpdate((options) => {
      options.headerButtons = buttons;
      return options;
    });
  }
  // Internal implementation ----------------------------------------------------------------------------------------
  /**
   * Initializes the Svelte stores and derived stores for the application options and UI state.
   *
   * While writable stores are created the update method is stored in private variables locally and derived Readable
   * stores are provided for essential options which are commonly used.
   *
   * These stores are injected into all Svelte components mounted under the `external` context: `storeAppOptions` and
   * `storeUIState`.
   */
  #storesInitialize() {
    const writableAppOptions = writable(this.#application.options);
    this.#storeAppOptionsUpdate = writableAppOptions.update;
    const storeAppOptions = {
      subscribe: writableAppOptions.subscribe,
      draggable: propertyStore(writableAppOptions, "draggable"),
      focusAuto: propertyStore(writableAppOptions, "focusAuto"),
      focusKeep: propertyStore(writableAppOptions, "focusKeep"),
      focusTrap: propertyStore(writableAppOptions, "focusTrap"),
      headerButtonNoClose: propertyStore(writableAppOptions, "headerButtonNoClose"),
      headerButtonNoLabel: propertyStore(writableAppOptions, "headerButtonNoLabel"),
      headerIcon: propertyStore(writableAppOptions, "headerIcon"),
      headerNoTitleMinimized: propertyStore(writableAppOptions, "headerNoTitleMinimized"),
      minimizable: propertyStore(writableAppOptions, "minimizable"),
      popOut: propertyStore(writableAppOptions, "popOut"),
      positionable: propertyStore(writableAppOptions, "positionable"),
      resizable: propertyStore(writableAppOptions, "resizable"),
      title: propertyStore(writableAppOptions, "title")
    };
    Object.freeze(storeAppOptions);
    this.#storeAppOptions = storeAppOptions;
    this.#dataUIState = {
      activeWindow: globalThis,
      dragging: false,
      headerButtons: [],
      minimized: this.#application._minimized,
      resizing: false
    };
    const writableUIOptions = writable(this.#dataUIState);
    this.#storeUIStateUpdate = writableUIOptions.update;
    const storeUIState = {
      subscribe: writableUIOptions.subscribe,
      // activeWindow: propertyStore(writableUIOptions, 'activeWindow'),
      activeWindow: derived(writableUIOptions, ($options, set) => set($options.activeWindow)),
      dragging: propertyStore(writableUIOptions, "dragging"),
      headerButtons: derived(writableUIOptions, ($options, set) => set($options.headerButtons)),
      minimized: derived(writableUIOptions, ($options, set) => set($options.minimized)),
      resizing: propertyStore(writableUIOptions, "resizing")
    };
    Object.freeze(storeUIState);
    this.#storeUIState = storeUIState;
  }
  /**
   * Registers local store subscriptions for app options. `popOut` controls registering this app with `ui.windows`.
   *
   * @see SvelteApp._injectHTML
   */
  #storesSubscribe() {
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoClose, (value) => {
      this.updateHeaderButtons({ headerButtonNoClose: value });
    }));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.headerButtonNoLabel, (value) => {
      this.updateHeaderButtons({ headerButtonNoLabel: value });
    }));
    this.#storeUnsubscribe.push(subscribeIgnoreFirst(this.#storeAppOptions.popOut, (value) => {
      if (value && this.#application.rendered) {
        globalThis.ui.windows[this.#application.appId] = this.#application;
      } else {
        delete globalThis.ui.windows[this.#application.appId];
      }
    }));
  }
  /**
   * Unsubscribes from any locally monitored stores.
   *
   * @see SvelteApp.close
   */
  #storesUnsubscribe() {
    this.#storeUnsubscribe.forEach((unsubscribe) => unsubscribe());
    this.#storeUnsubscribe = [];
  }
};
var applicationShellContract = ["elementRoot"];
Object.freeze(applicationShellContract);
function isApplicationShell(component) {
  if (component === null || component === void 0) {
    return false;
  }
  let compHasContract = true;
  let protoHasContract = true;
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(component, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      compHasContract = false;
    }
  }
  const prototype = Object.getPrototypeOf(component);
  for (const accessor of applicationShellContract) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
    if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) {
      protoHasContract = false;
    }
  }
  return compHasContract || protoHasContract;
}
function loadSvelteConfig({ app, config, elementRootUpdate } = {}) {
  let target;
  if (CrossWindow.isHTMLElement(config.target)) {
    target = config.target;
  } else if (typeof config.target === "string") {
    const activeWindow = app?.reactive?.activeWindow;
    target = activeWindow?.document?.querySelector(config.target);
  }
  if (!CrossWindow.isHTMLElement(target)) {
    console.log(
      `%c[TRL] loadSvelteConfig error - Could not find target, '${config.target}', for config:
`,
      "background: rgb(57,34,34)",
      config
    );
    throw new Error();
  }
  const NewSvelteComponent = config.class;
  const svelteConfig = TJSSvelte.config.parseConfig({ ...config, target }, { contextExternal: true, thisArg: app });
  const externalContext = svelteConfig.context.get("#external");
  externalContext.application = app;
  externalContext.elementRootUpdate = elementRootUpdate;
  externalContext.sessionStorage = app.reactive.sessionStorage;
  let eventbus;
  if (isObject(app._eventbus) && typeof app._eventbus.createProxy === "function") {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  }
  Object.seal(externalContext);
  const component = new NewSvelteComponent(svelteConfig);
  svelteConfig.eventbus = eventbus;
  let element2;
  if (isApplicationShell(component)) {
    element2 = component.elementRoot;
  }
  if (!CrossWindow.isHTMLElement(element2)) {
    console.log(
      `%c[TRL] loadSvelteConfig error - No application shell contract found. Did you bind and export a HTMLElement as 'elementRoot' and include '<svelte:options accessors={true}/>'?

Offending config:
`,
      "background: rgb(57,34,34)",
      config
    );
    throw new Error();
  }
  return { config: svelteConfig, component, element: element2 };
}
var TJSAppIndex = class {
  /**
   * Stores all visible / rendered apps.
   *
   * @type {Map<string, import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp>}
   */
  static #visibleApps = /* @__PURE__ */ new Map();
  /**
   * Adds a SvelteApp to all visible apps tracked.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp} app - A SvelteApp
   *
   * @package
   */
  static add(app) {
    this.#visibleApps.set(app.id, app);
  }
  /**
   * Removes a SvelteApp from all visible apps tracked.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp} app - A SvelteApp
   *
   * @package
   */
  static delete(app) {
    this.#visibleApps.delete(app.id);
  }
  /**
   * Gets a particular app by ID.
   *
   * @param {string}   key - App ID.
   *
   * @returns {import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp} Associated app.
   */
  static get(key) {
    return this.#visibleApps.get(key);
  }
  /**
   * Returns whether an associated app by ID is being tracked.
   *
   * @param {string}   key - App ID.
   *
   * @returns {boolean} The given App ID is visible.
   */
  static has(key) {
    return this.#visibleApps.has(key);
  }
  /**
   * @returns {IterableIterator<string>} All visible app IDs.
   */
  static keys() {
    return this.#visibleApps.keys();
  }
  /**
   * @returns {IterableIterator<import('@typhonjs-fvtt/runtime/svelte/application').SvelteApp>} All visible apps.
   */
  static values() {
    return this.#visibleApps.values();
  }
};
var FoundryHMRSupport = class {
  static initialize() {
    if (import.meta.hot) {
      Hooks.on("hotReload", (data) => {
        if (data?.extension === "json") {
          setTimeout(() => {
            for (const app of TJSAppIndex.values()) {
              const appShell = app.svelte.appShell;
              const hmrComponent = appShell?.$$?.hmr_cmp;
              if (appShell && typeof hmrComponent?.$replace === "function") {
                const svelteData = app.svelte.appShellData;
                if (svelteData) {
                  try {
                    hmrComponent.$replace(hmrComponent.constructor, {
                      target: svelteData.config.target,
                      anchor: svelteData.config.anchor,
                      preserveLocalState: true,
                      conservative: true
                    });
                  } catch (error) {
                    const name = hmrComponent?.constructor?.name ?? "Unknown";
                    console.error(`TyphonJS Runtime Library error; Could not hot reload component: '${name}'`);
                    console.error(error);
                  }
                }
              }
            }
          }, 0);
        }
        return true;
      });
    }
  }
};
var SvelteApp = class extends Application {
  /**
   * Stores the first mounted component which follows the application shell contract.
   *
   * @type {import('svelte').SvelteComponent[] | null[]} Application shell.
   */
  #applicationShellHolder = [null];
  /**
   * Stores and manages application state for saving / restoring / serializing.
   *
   * @type {import('./types').SvelteApp.API.State}
   */
  #applicationState;
  /**
   * Stores the target element which may not necessarily be the main element.
   *
   * @type {HTMLElement}
   */
  #elementTarget = null;
  /**
   * Stores the content element which is set for application shells.
   *
   * @type {HTMLElement}
   */
  #elementContent = null;
  /**
   * On initial render gating of `setPosition` invoked by `Application._render` occurs, so that percentage values
   * can correctly be positioned with initial helper constraints (centered).
   *
   * @type {boolean}
   */
  #gateSetPosition = false;
  /**
   * Stores initial z-index from `_renderOuter` to set to target element / Svelte component.
   *
   * @type {number}
   */
  #initialZIndex = 95;
  /**
   * Stores on mount state which is checked in _render to trigger onSvelteMount callback.
   *
   * @type {boolean}
   */
  #onMount = false;
  /**
   * The position store.
   *
   * @type {TJSPosition}
   */
  #position;
  /**
   * Contains the Svelte stores and reactive accessors.
   *
   * @type {SvelteReactive}
   */
  #reactive;
  /**
   * Stores SvelteData entries with instantiated Svelte components.
   *
   * @type {import('./internal/state-svelte/types').SvelteData[] | null[]}
   */
  #svelteData = [null];
  /**
   * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
   * #svelteData.
   *
   * @type {import('./types').SvelteApp.API.Svelte<Options>}
   */
  #getSvelteData = new GetSvelteData(this.#applicationShellHolder, this.#svelteData);
  /**
   * Contains methods to interact with the Svelte stores.
   *
   * @type {import('./internal/state-reactive/types-local').SvelteReactiveStores}
   */
  #stores;
  /**
   * @param {Partial<import('./types').SvelteApp.Options>} [options] - The options for the application.
   */
  constructor(options = {}) {
    super(options);
    if (!isObject(this.options.svelte)) {
      throw new Error(`SvelteApp - constructor - No Svelte configuration object found in 'options'.`);
    }
    this.#applicationState = new ApplicationState(this);
    this.#position = new TJSPosition(this, {
      ...this.position,
      ...this.options,
      initial: this.options.positionInitial,
      ortho: this.options.positionOrtho,
      validator: this.options.positionValidator
    });
    delete this.position;
    Object.defineProperty(this, "position", {
      get: () => this.#position,
      set: (position) => {
        if (isObject(position)) {
          this.#position.set(position);
        }
      }
    });
    this.#reactive = new SvelteReactive(this);
    this.#stores = this.#reactive.initialize();
  }
  /**
   * Specifies the default options that SvelteApp supports.
   *
   * @returns {import('./types').SvelteApp.Options} options - Application options.
   * @see https://foundryvtt.com/api/interfaces/client.ApplicationOptions.html
   */
  static get defaultOptions() {
    return (
      /** @type {import('./types').SvelteApp.Options} */
      deepMerge(super.defaultOptions, {
        defaultCloseAnimation: true,
        // If false the default slide close animation is not run.
        draggable: true,
        // If true then application shells are draggable.
        focusAuto: true,
        // When true auto-management of app focus is enabled.
        focusKeep: false,
        // When `focusAuto` and `focusKeep` is true; keeps internal focus.
        focusSource: void 0,
        // Stores any A11yFocusSource data that is applied when app is closed.
        focusTrap: true,
        // When true focus trapping / wrapping is enabled keeping focus inside app.
        headerButtonNoClose: false,
        // If true then the close header button is removed.
        headerButtonNoLabel: false,
        // If true then header button labels are removed for application shells.
        headerIcon: void 0,
        // Sets a header icon given an image URL.
        headerNoTitleMinimized: false,
        // If true then header title is hidden when application is minimized.
        minHeight: MIN_WINDOW_HEIGHT,
        // Assigned to position. Number specifying minimum window height.
        minWidth: MIN_WINDOW_WIDTH,
        // Assigned to position. Number specifying minimum window width.
        positionable: true,
        // If false then `position.set` does not take effect.
        positionInitial: TJSPosition.Initial.browserCentered,
        // A helper for initial position placement.
        positionOrtho: true,
        // When true TJSPosition is optimized for orthographic use.
        positionValidator: TJSPosition.Validators.transformWindow,
        // A function providing the default validator.
        sessionStorage: void 0,
        // An instance of WebStorage (session) to share across SvelteApps.
        svelte: void 0,
        // A Svelte configuration object.
        transformOrigin: "top left"
        // By default, 'top / left' respects rotation when minimizing.
      })
    );
  }
  /**
   * Returns the content element if an application shell is mounted.
   *
   * @returns {HTMLElement} Content element.
   */
  get elementContent() {
    return this.#elementContent;
  }
  /**
   * Returns the target element or main element if no target defined.
   *
   * @returns {HTMLElement} Target element.
   */
  get elementTarget() {
    return this.#elementTarget;
  }
  /**
   * Returns the reactive accessors & Svelte stores for SvelteApp.
   *
   * @returns {import('./types').SvelteApp.API.Reactive} The reactive accessors & Svelte stores.
   */
  get reactive() {
    return this.#reactive;
  }
  /**
   * Returns the application state manager.
   *
   * @returns {import('./types').SvelteApp.API.State} The application state manager.
   */
  get state() {
    return this.#applicationState;
  }
  /**
   * Returns the `Svelte` helper class w/ various methods to access the mounted application shell component.
   *
   * @returns {import('./types').SvelteApp.API.Svelte<Options>} `Svelte` / mounted application shell API.
   */
  get svelte() {
    return this.#getSvelteData;
  }
  /**
   * In this case of when a template is defined in app options `html` references the inner HTML / template. However,
   * to activate classic v1 tabs for a Svelte component the element target is passed as an array simulating JQuery as
   * the element is retrieved immediately and the core listeners use standard DOM queries.
   *
   * @protected
   * @ignore
   * @internal
   */
  _activateCoreListeners(html) {
    super._activateCoreListeners(typeof this.options.template === "string" ? html : [this.popOut ? this.#elementTarget?.firstChild : this.#elementTarget]);
  }
  /**
   * Provide an override to set this application as the active window regardless of z-index. Changes behaviour from
   * Foundry core.
   *
   * @param {object} [opts] - Optional parameters.
   *
   * @param {boolean} [opts.focus=true] - When true and the active element is not contained in the app `elementTarget`
   *        is focused..
   *
   * @param {boolean} [opts.force=false] - Force bring to top; will increment z-index by popOut order.
   *
   * @ignore
   * @internal
   */
  bringToTop({ focus = true, force = false } = {}) {
    if (this.reactive.activeWindow !== globalThis) {
      return;
    }
    if (force || this.popOut) {
      super.bringToTop();
    }
    const elementTarget = this.elementTarget;
    const activeElement = document.activeElement;
    if (focus && elementTarget && activeElement !== elementTarget && !elementTarget?.contains(activeElement)) {
      if (A11yHelper.isFocusTarget(activeElement)) {
        activeElement.blur();
      }
      elementTarget?.focus();
    }
    globalThis.ui.activeWindow = this;
  }
  /**
   * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
   * best visual result is to destroy them after the default slide up animation occurs, but before the element
   * is removed from the DOM.
   *
   * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
   * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
   * the Svelte components are destroyed and then the element is removed from the DOM.
   *
   * Close the application and unregisters references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes.
   *
   * @param {object}   [options] - Optional parameters.
   *
   * @param {boolean}  [options.force] - Force close regardless of render state.
   *
   * @returns {Promise<void>}    A Promise which resolves once the application is closed.
   *
   * @ignore
   * @internal
   */
  async close(options = {}) {
    const states = Application.RENDER_STATES;
    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    }
    const el = this.#elementTarget;
    if (!el) {
      this._state = states.CLOSED;
      return;
    }
    if (CrossWindow.getWindow(el, { throws: false }) !== globalThis) {
      return;
    }
    this._state = states.CLOSING;
    this.#stores.unsubscribe();
    const content = el.querySelector(".window-content");
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    for (const cls of this.constructor._getInheritanceChain()) {
      Hooks.call(`close${cls.name}`, this, $(el));
    }
    const animate = typeof this.options.defaultCloseAnimation === "boolean" ? this.options.defaultCloseAnimation : true;
    if (animate) {
      el.style.minHeight = "0";
      const { paddingBottom, paddingTop } = globalThis.getComputedStyle(el);
      await el.animate([
        { maxHeight: `${el.clientHeight}px`, paddingTop, paddingBottom },
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: 250, easing: "ease-in", fill: "forwards" }).finished;
    }
    const svelteDestroyPromises = [];
    for (const entry of this.#svelteData) {
      if (!isObject(entry)) {
        continue;
      }
      svelteDestroyPromises.push(TJSSvelte.util.outroAndDestroy(entry.component));
      const eventbus = entry.config.eventbus;
      if (isObject(eventbus) && typeof eventbus.off === "function") {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    }
    await Promise.allSettled(svelteDestroyPromises);
    TJSAppIndex.delete(this);
    this.#svelteData[0] = null;
    el.remove();
    this.position.state.restore({
      name: "#beforeMinimized",
      properties: ["width", "height"],
      silent: true,
      remove: true
    });
    this.#applicationShellHolder[0] = null;
    this._element = null;
    this.#elementContent = null;
    this.#elementTarget = null;
    delete globalThis.ui.windows[this.appId];
    this._minimized = false;
    this._scrollPositions = null;
    this._state = states.CLOSED;
    this.#onMount = false;
    this.#stores.uiStateUpdate((storeOptions) => deepMerge(storeOptions, { minimized: this._minimized }));
    A11yHelper.applyFocusSource(this.options.focusSource);
    delete this.options.focusSource;
  }
  /**
   * Specify the set of config buttons which should appear in the SvelteApp header. Buttons should be returned as
   * an Array of objects. The header buttons which are added to the application can be modified by the
   * `getApplicationHeaderButtons` hook.
   *
   * SvelteApp extends the button functionality with full reactivity for state changes during callbacks. Callbacks
   * receive the button data and can modify it to update the button state.
   *
   * @privateRemarks Provide a basic override implementation to extend types with additional SvelteApp functionality.
   *
   * @returns {import('./types').SvelteApp.HeaderButton[]} All header buttons.
   * @protected
   */
  _getHeaderButtons() {
    return super._getHeaderButtons();
  }
  /**
   * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
   * pop-out of Application or provide no template and render into a document fragment which is then attached to the
   * DOM.
   *
   * @protected
   * @ignore
   * @internal
   */
  _injectHTML() {
    this.reactive.updateHeaderButtons();
    const elementRootUpdate = () => {
      let cntr = 0;
      return (elementRoot) => {
        if (elementRoot !== null && elementRoot !== void 0 && cntr++ > 0) {
          this.#updateApplicationShell();
          return true;
        }
        return false;
      };
    };
    if (!isObject(this.options.svelte)) {
      throw new Error(`SvelteApp - _injectHTML - No Svelte configuration object found in 'options'.`);
    }
    const svelteData = loadSvelteConfig({
      app: this,
      config: this.options.svelte,
      elementRootUpdate
    });
    if (this.svelte.appShell !== null) {
      throw new Error(
        `SvelteApp - _injectHTML - An application shell is already mounted; offending config:
${JSON.stringify(this.options.svelte)}`
      );
    }
    this.#applicationShellHolder[0] = svelteData.component;
    if (TJSSvelte.util.isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr)) {
      svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
    }
    this.#svelteData[0] = svelteData;
    this._element = $(this.svelte.appShell.elementRoot);
    this.#elementContent = hasGetter(this.svelte.appShell, "elementContent") ? this.svelte.appShell.elementContent : null;
    this.#elementTarget = hasGetter(this.svelte.appShell, "elementTarget") ? this.svelte.appShell.elementTarget : this.svelte.appShell.elementRoot;
    if (typeof this.options.positionable === "boolean" && this.options.positionable) {
      this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
    }
    this.#stores.subscribe();
  }
  /**
   * Provides a mechanism to update the UI options store for maximized.
   *
   * Note: the sanity check is duplicated from {@link Application.maximize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApp.minimize}
   * to animate the content area.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.animate=true] - When true perform default maximizing animation.
   *
   * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
   */
  async maximize({ animate = true, duration = 0.1 } = {}) {
    if (!this.popOut || [false, null].includes(this._minimized)) {
      return;
    }
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const positionBefore = this.position.state.get({ name: "#beforeMinimized" });
    if (animate) {
      await this.position.state.restore({
        name: "#beforeMinimized",
        async: true,
        animateTo: true,
        properties: ["width"],
        duration: 0.1
      });
    }
    element2.classList.remove("minimized");
    for (let cntr = header.children.length; --cntr >= 0; ) {
      header.children[cntr].style.display = null;
    }
    content.style.display = null;
    let constraints;
    if (animate) {
      ({ constraints } = this.position.state.restore({
        name: "#beforeMinimized",
        animateTo: true,
        properties: ["height"],
        remove: true,
        duration
      }));
    } else {
      ({ constraints } = this.position.state.remove({ name: "#beforeMinimized" }));
    }
    await content.animate([
      { maxHeight: 0, paddingTop: 0, paddingBottom: 0, offset: 0 },
      { ...constraints, offset: 1 },
      { maxHeight: "100%", offset: 1 }
    ], { duration: durationMS, fill: "forwards" }).finished;
    this.position.set({
      minHeight: positionBefore.minHeight ?? this.options?.minHeight ?? MIN_WINDOW_HEIGHT,
      minWidth: positionBefore.minWidth ?? this.options?.minWidth ?? MIN_WINDOW_WIDTH
    });
    element2.style.minWidth = null;
    element2.style.minHeight = null;
    this._minimized = false;
    setTimeout(() => {
      content.style.overflow = null;
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = null;
      }
    }, 50);
    this.#stores.uiStateUpdate((options) => deepMerge(options, { minimized: false }));
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.minimize} the store is updated _before_
   * performing the rest of animations. This allows application shells to remove / show any resize handlers
   * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApp.minimize}
   * to animate the content area.
   *
   * @param {object}   [opts] - Optional parameters.
   *
   * @param {boolean}  [opts.animate=true] - When true perform default minimizing animation.
   *
   * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
   */
  async minimize({ animate = true, duration = 0.1 } = {}) {
    if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) {
      return;
    }
    this.#stores.uiStateUpdate((options) => deepMerge(options, { minimized: true }));
    this._minimized = null;
    const durationMS = duration * 1e3;
    const element2 = this.elementTarget;
    const header = element2.querySelector(".window-header");
    const content = element2.querySelector(".window-content");
    const beforeMinWidth = this.position.minWidth;
    const beforeMinHeight = this.position.minHeight;
    this.position.set({ minWidth: 100, minHeight: 30 });
    element2.style.minWidth = "100px";
    element2.style.minHeight = "30px";
    if (content) {
      content.style.overflow = "hidden";
      for (let cntr = content.children.length; --cntr >= 0; ) {
        content.children[cntr].style.overflow = "hidden";
      }
    }
    const { paddingBottom, paddingTop } = globalThis.getComputedStyle(content);
    const constraints = {
      maxHeight: `${content.clientHeight}px`,
      paddingTop,
      paddingBottom
    };
    if (animate) {
      const animation = content.animate([
        constraints,
        { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
      ], { duration: durationMS, fill: "forwards" });
      animation.finished.then(() => content.style.display = "none");
    } else {
      setTimeout(() => content.style.display = "none", durationMS);
    }
    const saved = this.position.state.save({ name: "#beforeMinimized", constraints });
    saved.minWidth = beforeMinWidth;
    saved.minHeight = beforeMinHeight;
    const headerOffsetHeight = header.offsetHeight;
    this.position.minHeight = headerOffsetHeight;
    if (animate) {
      await this.position.animate.to({ height: headerOffsetHeight }, { duration }).finished;
    }
    for (let cntr = header.children.length; --cntr >= 0; ) {
      const className = header.children[cntr].className;
      if (className.includes("window-title") || className.includes("close")) {
        continue;
      }
      if (className.includes("keep-minimized")) {
        header.children[cntr].style.display = "block";
        continue;
      }
      header.children[cntr].style.display = "none";
    }
    if (animate) {
      await this.position.animate.to({ width: MIN_WINDOW_WIDTH }, { duration: 0.1 }).finished;
    }
    element2.classList.add("minimized");
    this._minimized = true;
  }
  /**
   * Provides a callback after all Svelte components are initialized.
   */
  onSvelteMount() {
  }
  // eslint-disable-line no-unused-vars
  /**
   * Provides a callback after the main application shell is remounted. This may occur during HMR / hot module
   * replacement or directly invoked from the `elementRootUpdate` callback passed to the application shell component
   * context.
   */
  onSvelteRemount() {
  }
  // eslint-disable-line no-unused-vars
  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @protected
   * @ignore
   * @internal
   */
  _replaceHTML(element2, html) {
    if (!element2.length) {
      return;
    }
    this.reactive.updateHeaderButtons();
  }
  /**
   * Provides an override verifying that a new Application being rendered for the first time doesn't have a
   * corresponding DOM element already loaded. This is a check that only occurs when `this._state` is
   * `Application.RENDER_STATES.NONE`. It is useful in particular when SvelteApp has a static ID
   * explicitly set in `this.options.id` and long intro / outro transitions are assigned. If a new application
   * sharing this static ID attempts to open / render for the first time while an existing DOM element sharing
   * this static ID exists then the initial render is cancelled below rather than crashing later in the render
   * cycle {@link TJSPosition.set}.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _render(force = false, options = {}) {
    if (isObject(options?.focusSource)) {
      this.options.focusSource = options.focusSource;
    }
    const activeWindow = this.reactive.activeWindow;
    try {
      if (this._state === Application.RENDER_STATES.NONE && A11yHelper.isFocusTarget(activeWindow.document.querySelector(`#${this.id}`))) {
        console.warn(`SvelteApp - _render: A DOM element already exists for CSS ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
        return;
      }
    } catch (err) {
      console.warn(`SvelteApp - _render: Potentially malformed application ID '${this.id}'. Cancelling initial render for new application with appId '${this.appId}'.`);
      return;
    }
    this.#gateSetPosition = true;
    await super._render(force, options);
    this.#gateSetPosition = false;
    if ([Application.RENDER_STATES.CLOSING, Application.RENDER_STATES.RENDERING].includes(this._state)) {
      return;
    }
    if (!force && this._state <= Application.RENDER_STATES.NONE) {
      return;
    }
    if (!this._minimized) {
      this.#position.set({
        left: typeof this.options?.left === "string" ? this.options.left : void 0,
        height: typeof this.options?.height === "string" ? this.options.height : void 0,
        maxHeight: typeof this.options?.maxHeight === "string" ? this.options.maxHeight : void 0,
        maxWidth: typeof this.options?.maxWidth === "string" ? this.options.maxWidth : void 0,
        minHeight: typeof this.options?.minHeight === "string" ? this.options.minHeight : void 0,
        minWidth: typeof this.options?.minWidth === "string" ? this.options.minWidth : void 0,
        rotateX: typeof this.options?.rotateX === "string" ? this.options.rotateX : void 0,
        rotateY: typeof this.options?.rotateY === "string" ? this.options.rotateY : void 0,
        rotateZ: typeof this.options?.rotateZ === "string" ? this.options.rotateZ : void 0,
        rotation: typeof this.options?.rotation === "string" ? this.options.rotation : void 0,
        top: typeof this.options?.top === "string" ? this.options.top : void 0,
        width: typeof this.options?.width === "string" ? this.options.width : void 0,
        ...options
      });
    }
    if (!this.#onMount) {
      TJSAppIndex.add(this);
      this.onSvelteMount();
      this.#onMount = true;
    }
  }
  /**
   * Render the inner application content. Provide an empty JQuery element per the core Foundry API.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _renderInner() {
    const activeWindow = this.reactive.activeWindow;
    const html = activeWindow.document.createDocumentFragment();
    return $(html);
  }
  /**
   * Stores the initial z-index set in `_renderOuter` which is used in `_injectHTML` to set the target element
   * z-index after the Svelte component is mounted.
   *
   * @protected
   * @ignore
   * @internal
   */
  async _renderOuter() {
    const html = await super._renderOuter();
    this.#initialZIndex = html[0].style.zIndex;
    return html;
  }
  /**
   * All calculation and updates of position are implemented in {@link TJSPosition.set}.
   * This allows position to be fully reactive and in control of updating inline styles for the application.
   *
   * This method remains for backward compatibility with Foundry. If you have a custom override quite likely you need
   * to update to using the {@link TJSPosition.validators} / ValidatorAPI functionality.
   *
   * @param {TJSPosition.API.Data.TJSPositionDataRelative}   [position] - TJSPosition data.
   *
   * @returns {TJSPosition} The updated position object for the application containing the new values.
   * @ignore
   */
  setPosition(position) {
    return !this.#gateSetPosition ? this.position.set(position) : this.position;
  }
  /**
   * This method is invoked by the `elementRootUpdate` callback that is added to the external context passed to
   * Svelte components. When invoked it updates the local element roots tracked by SvelteApp.
   *
   * This method may also be invoked by HMR / hot module replacement via `svelte-hmr`.
   */
  #updateApplicationShell() {
    const applicationShell = this.svelte.appShell;
    if (applicationShell !== null) {
      this._element = $(applicationShell.elementRoot);
      this.#elementContent = hasGetter(applicationShell, "elementContent") ? applicationShell.elementContent : null;
      this.#elementTarget = hasGetter(applicationShell, "elementTarget") ? applicationShell.elementTarget : null;
      if (this.#elementTarget === null) {
        this.#elementTarget = typeof this.options.selectorTarget === "string" ? this._element[0].querySelector(this.options.selectorTarget) : this._element[0];
      }
      if (typeof this.options.positionable === "boolean" && this.options.positionable) {
        this.#elementTarget.style.zIndex = typeof this.options.zIndex === "number" ? this.options.zIndex : this.#initialZIndex ?? 95;
        super.bringToTop();
        this.position.set(this.position.get());
      }
      super._activateCoreListeners([this.popOut ? this.#elementTarget?.firstChild : this.#elementTarget]);
      this.onSvelteRemount();
    }
  }
};
var PopoutSupport = class {
  static initialize() {
    Hooks.on("PopOut:loading", (app, popout) => {
      if (app instanceof SvelteApp) {
        app.position.enabled = false;
        app.state.save({
          name: "#beforePopout",
          headerButtonNoClose: app.reactive.headerButtonNoClose
        });
        app.reactive.activeWindow = popout;
        app.reactive.headerButtonNoClose = true;
      }
    });
    Hooks.on("PopOut:popin", (app) => this.#handleRejoin(app));
    Hooks.on("PopOut:close", (app) => this.#handleRejoin(app));
  }
  /**
   * Handles rejoining the app to main browser window.
   *
   * @param {Application} app - The target app.
   */
  static #handleRejoin(app) {
    if (app instanceof SvelteApp) {
      app.position.enabled = true;
      const beforeData = app.state.remove({ name: "#beforePopout" });
      if (beforeData) {
        app.reactive.headerButtonNoClose = beforeData?.headerButtonNoClose ?? false;
      }
      app.reactive.activeWindow = void 0;
    }
  }
};
var TJSDialogData = class {
  /**
   * @type {import('../../index.js').SvelteApp}
   */
  #application;
  /**
   * Stores the dialog options data.
   *
   * @type {import('./types').TJSDialog.OptionsData}
   */
  #internal = {};
  /**
   * @param {import('../../index.js').SvelteApp} application - The host Foundry application.
   */
  constructor(application) {
    this.#application = application;
    Object.seal(this);
  }
  /**
   * @returns {{ [key: string]: import('./types').TJSDialogButtonData }} The dialog button configuration.
   */
  get buttons() {
    return this.#internal.buttons;
  }
  /**
   * Set the dialog button configuration.
   *
   * @param {string} buttons - New dialog button configuration.
   */
  set buttons(buttons) {
    this.#internal.buttons = buttons;
    this.#updateComponent();
  }
  /**
   * @returns {import('@typhonjs-fvtt/runtime/svelte/util').TJSSvelte.Config.Minimal | string} The Svelte configuration object or HTML string
   *          content.
   */
  get content() {
    return this.#internal.content;
  }
  /**
   * Set the Svelte configuration object or HTML string content.
   *
   * @param {import('@typhonjs-fvtt/runtime/svelte/util').TJSSvelte.Config.Minimal | string} content - New Svelte configuration object or
   *        HTML string content.
   */
  set content(content) {
    this.#internal.content = content;
    this.#updateComponent();
  }
  /**
   * @returns {string} The default button ID to focus initially.
   */
  get default() {
    return this.#internal.default;
  }
  /**
   * Set the default button ID to focus initially.
   *
   * @param {string} newDefault - New default button ID to focus initially.
   */
  set default(newDefault) {
    this.#internal.default = newDefault;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} The dialog draggable state; draggable when true.
   */
  get draggable() {
    return this.#internal.draggable;
  }
  /**
   * Set the dialog state; draggable when true.
   *
   * @param {boolean} draggable - New dialog draggable state; draggable when true.
   */
  set draggable(draggable) {
    this.#internal.draggable = draggable;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true auto-management of app focus is enabled.
   */
  get focusAuto() {
    return this.#internal.focusAuto;
  }
  /**
   * Set the dialog auto-management of app focus.
   *
   * @param {boolean} focusAuto - New dialog auto-management of app focus.
   */
  set focusAuto(focusAuto) {
    this.#internal.focusAuto = focusAuto;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true the first focusable element that isn't a button is focused.
   */
  get focusFirst() {
    return this.#internal.focusFirst;
  }
  /**
   * Set the dialog first focusable element state.
   *
   * @param {boolean} focusFirst - New dialog first focusable element state.
   */
  set focusFirst(focusFirst) {
    this.#internal.focusFirst = focusFirst;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When `focusAuto` and `focusKeep` is true; keeps internal focus.
   */
  get focusKeep() {
    return this.#internal.focusKeep;
  }
  /**
   * Set the dialog `focusKeep` state. When `focusAuto` and `focusKeep` is true; keeps internal focus.
   *
   * @param {boolean} focusKeep - New dialog `focusKeep` state.
   */
  set focusKeep(focusKeep) {
    this.#internal.focusKeep = focusKeep;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true the dialog is minimizable.
   */
  get minimizable() {
    return this.#internal.minimizable;
  }
  /**
   * Set the dialog `minimizable` state. When true the dialog is minimizable.
   *
   * @param {boolean} minimizable - New dialog `minimizable` state.
   */
  set minimizable(minimizable) {
    this.#internal.minimizable = minimizable;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true a modal dialog is displayed.
   */
  get modal() {
    return this.#internal.modal;
  }
  /**
   * Set the dialog `modal` state. When true a modal dialog is displayed.
   *
   * @param {boolean} modal - New dialog `modal` state.
   */
  set modal(modal) {
    this.#internal.modal = modal;
    this.#updateComponent();
  }
  /**
   * @returns {import('./types').TJSDialog.OptionsModal} Additional options for modal dialog display.
   */
  get modalOptions() {
    return this.#internal.modalOptions;
  }
  /**
   * Set additional options for modal dialog display.
   *
   * @param {import('./types').TJSDialog.OptionsModal} modalOptions - New additional options for modal dialog display.
   */
  set modalOptions(modalOptions) {
    this.#internal.modalOptions = modalOptions;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true and an error is raised in dialog callback functions post a UI error notification.
   */
  get notifyError() {
    return this.#internal.notifyError;
  }
  /**
   * Set the dialog `notifyError` state. When true and an error is raised in dialog callback functions post a UI error
   * notification.
   *
   * @param {boolean} notifyError - New dialog `notifyError` state.
   */
  set notifyError(notifyError) {
    this.#internal.notifyError = notifyError;
    this.#updateComponent();
  }
  /**
   * @returns {string | ((data?: { application?: import('../../index.js').TJSDialog }) => any)} Callback invoked when
   *          dialog is closed; no button option selected. When defined as a string any matching function by name
   *          exported from content Svelte component is invoked.
   */
  get onClose() {
    return this.#internal.onClose;
  }
  /**
   * Set callback invoked when dialog is closed; no button option selected. When defined as a string any matching
   * function by name exported from content Svelte component is invoked..
   *
   * @param {string | ((data?: { application?: import('../../index.js').TJSDialog }) => any)} onClose - New dialog
   *        `onClose` state.
   */
  set onClose(onClose) {
    this.#internal.onClose = onClose;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} Dialog `rejectClose` state. When true and a Promise has been created by {@link TJSDialog.wait}
   *          and the Promise is not in the process of being resolved or rejected on close of the dialog any `onClose`
   *          function is invoked and any result that is undefined will cause the Promise to then be rejected..
   */
  get rejectClose() {
    return this.#internal.rejectClose;
  }
  /**
   * Set the dialog `rejectClose` state.
   *
   * @param {boolean} rejectClose - New dialog `rejectClose` state.
   */
  set rejectClose(rejectClose) {
    this.#internal.rejectClose = rejectClose;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true the dialog is resizable.
   */
  get resizable() {
    return this.#internal.resizable;
  }
  /**
   * Set the dialog `resizable` state. When true the dialog is resizable.
   *
   * @param {boolean} resizable - New dialog `resizable` state.
   */
  set resizable(resizable) {
    this.#internal.resizable = resizable;
    this.#updateComponent();
  }
  /**
   * @returns {boolean} When true and resolving any Promises and there are undefined results from any button callbacks
   *          the button ID is resolved.
   */
  get resolveId() {
    return this.#internal.resolveId;
  }
  /**
   * Set the dialog `resolveId` state. When true and resolving any Promises and there are undefined results from any
   * button callbacks the button ID is resolved.
   *
   * @param {boolean} resolveId - New dialog `resolveId` state.
   */
  set resolveId(resolveId) {
    this.#internal.resolveId = resolveId;
    this.#updateComponent();
  }
  /**
   * @returns {string} The dialog window title.
   */
  get title() {
    return this.#internal.title;
  }
  /**
   * Set the dialog window title.
   *
   * @param {string} title - New dialog window title.
   */
  set title(title) {
    this.#internal.title = title;
    this.#updateComponent();
  }
  /**
   * @returns {import('./types').TJSDialog.OptionsTransition} Transition options for the dialog.
   */
  get transition() {
    return this.#internal.transition;
  }
  /**
   * Set transition options for the dialog.
   *
   * @param {import('./types').TJSDialog.OptionsTransition} transition - New transition options for the dialog.
   */
  set transition(transition) {
    this.#internal.transition = transition;
    this.#updateComponent();
  }
  /**
   * @returns {number | null} A specific z-index for the dialog. Pass null for the dialog to act like other
   *          applications in regard bringing to top when activated.
   */
  get zIndex() {
    return this.#internal.zIndex;
  }
  /**
   * Set specific z-index for the dialog.
   *
   * @param {number | null} zIndex - New z-index for the dialog.
   */
  set zIndex(zIndex) {
    this.#internal.zIndex = zIndex;
    this.#updateComponent();
  }
  /**
   * Provides a cloned copy of the dialog data.
   * Note: The content attribute is not cloned as complex / props may be present.
   *
   * @returns {import('./types').TJSDialog.OptionsData} A clone of the dialog data.
   */
  clone() {
    const shallowCopy = { ...this.#internal };
    delete shallowCopy.content;
    const cData = klona(shallowCopy);
    cData.content = this.#internal.content;
    return cData;
  }
  /**
   * Provides a way to safely get this dialogs data given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {any}      [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {any} Value at the accessor.
   */
  get(accessor, defaultValue) {
    return safeAccess(this.#internal, accessor, defaultValue);
  }
  /**
   * @param {import('./types').TJSDialog.OptionsData} data - Merge provided data object into Dialog data.
   */
  merge(data) {
    deepMerge(this.#internal, data);
    this.#updateComponent();
  }
  /**
   * Sets the dialog data; this is reactive.
   *
   * @param {import('./types').TJSDialog.OptionsData}   data - Dialog data.
   */
  replace(data) {
    if (!isObject(data)) {
      throw new TypeError(`TJSDialogData replace error: 'data' is not an object'.`);
    }
    this.#internal = {};
    this.merge(data);
  }
  /**
   * Provides a way to safely set this dialogs data given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Automatically the dialog data will be updated in the associated DialogShell Svelte component.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {any}      value - Value to set.
   *
   * @returns {boolean} True if successful.
   */
  set(accessor, value) {
    const success = safeSet(this.#internal, accessor, value, { createMissing: true });
    if (success) {
      this.#updateComponent();
    }
    return success;
  }
  /**
   * Updates the data in the Svelte dialog component.
   */
  #updateComponent() {
    const component = this.#application.svelte.appShell;
    if (component?.data) {
      component.data = this.clone();
    }
  }
};
var TJSDialog = class _TJSDialog extends SvelteApp {
  /** @type {TJSDialogData} */
  #data;
  /** @type {ManagedPromise} */
  #managedPromise;
  /**
   * @param {import('./internal/state-dialog/types').TJSDialog.OptionsData} data - Dialog options.
   *
   * @param {import('./types').SvelteApp.OptionsCore}   [options] - SvelteApp options.
   */
  constructor(data, options = {}) {
    super({ popOutModuleDisable: typeof data?.modal === "boolean" ? data.modal : false, ...options });
    this.#managedPromise = new ManagedPromise();
    this.#data = new TJSDialogData(this);
    this.#data.replace(data);
  }
  /**
   * Default options for TJSDialog. Provides a default width and setting `height` to `auto` to always display dialog
   * content even if it changes. The default `DialogShell` / `svelte` options should not be changed and instead mount
   * the dialog content component by supplying a Svelte configuration object to dialog data `content` field.
   *
   * @returns {import('./types').SvelteApp.Options} Default options
   */
  static get defaultOptions() {
    return (
      /** @type {import('./types').SvelteApp.Options} */
      deepMerge(super.defaultOptions, {
        classes: ["dialog", "tjs-dialog"],
        width: 400,
        height: "auto",
        svelte: {
          class: DialogShell_default,
          intro: true,
          target: document.body,
          /**
           * `this` is the TJSDialog instance when invoked.
           *
           * @this {TJSDialog}
           *
           * @returns {{data: import('./types').TJSDialog.OptionsData, managedPromise: ManagedPromise}} Props
           */
          props: function() {
            return {
              data: this.#data.clone(),
              managedPromise: this.#managedPromise
            };
          }
        }
      })
    );
  }
  /**
   * Returns the dialog data.
   *
   * @returns {import('./internal/state-dialog/types').TJSDialog.Data} Dialog data.
   */
  get data() {
    return this.#data;
  }
  /**
   * @returns {import('@typhonjs-fvtt/runtime/util/async').ManagedPromise} Returns the managed promise.
   */
  get managedPromise() {
    return this.#managedPromise;
  }
  /**
   * Close the dialog and un-register references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes.
   *
   * @param {object}   [options] - Optional parameters.
   *
   * @param {boolean}  [options.force] - Force close regardless of render state.
   *
   * @returns {Promise<void>} A Promise which resolves once the application is closed with the callback value or
   *                          `true`.
   */
  async close(options) {
    try {
      if (this.#managedPromise.isActive && !this.#managedPromise.isProcessing) {
        const result = _TJSDialog.#invokeFn(this.#data.onClose, this, null);
        const rejectClose = typeof this.#data.rejectClose === "boolean" ? this.#data.rejectClose : false;
        if (rejectClose && result === null) {
          this.#managedPromise.reject(new Error("TJSDialog was closed without a choice being made."));
        } else {
          this.#managedPromise.resolve(result);
        }
      }
    } catch (err) {
      const notifyError = typeof this.#data.notifyError === "boolean" ? this.#data.notifyError : true;
      if (notifyError) {
        globalThis.ui.notifications.error(err, { console: false });
      }
      if (!this.#managedPromise.reject(err)) {
        throw err;
      }
    } finally {
      await super.close(options);
    }
  }
  /**
   * Brings to top or renders this dialog returning a Promise that is resolved any button pressed or when the dialog
   * is closed.
   *
   * Creates an anonymous data defined TJSDialog returning a Promise that can be awaited upon for the user to make a
   * choice.
   *
   * Note: `null` is returned if the dialog is closed without a user making a choice.
   *
   * @template T
   *
   * @param {object}   [options] - Options.
   *
   * @param {boolean}  [options.reuse=false] - When true if there is an existing managed Promise this allows multiple
   *        sources to await on the same result.
   *
   * @returns {Promise<T>} A promise for dialog resolution.
   */
  async wait(options) {
    if (this.rendered) {
      this.bringToTop();
    } else {
      this.render(true, { focus: true });
    }
    return this.#managedPromise.create(options);
  }
  // ---------------------------------------------------------------------------------------------------------------
  /**
   * A helper factory method to create simple confirmation dialog windows which consist of simple yes / no prompts.
   * If you require more flexibility, a custom TJSDialog instance is preferred. The default focused button is 'yes'.
   * You can change the default focused button by setting `default` to `yes` or `no`.
   *
   * @template T
   *
   * @param {import('./internal/state-dialog/types').TJSDialog.OptionsData & {
   *    onYes?: string | ((data?: { application?: TJSDialog }) => any),
   *    onNo?: string | ((data?: { application?: TJSDialog }) => any)
   * }} [data] - Confirm dialog options.
   *
   * @param {string|((data?: { application?: TJSDialog }) => any)} [data.onYes] - Callback function upon `yes`; may be
   *        an async function. When defined as a string any matching function by name exported from content Svelte
   *        component is invoked.
   *
   * @param {string|((data?: { application?: TJSDialog }) => any)} [data.onNo] - Callback function upon `no`; may be an
   *        async function. When defined as a string any matching function by name exported from content Svelte
   *        component is invoked.
   *
   * @param {import('./types').SvelteApp.OptionsCore}  [options]  SvelteApp options passed to the
   *        TJSDialog constructor.
   *
   * @returns {Promise<T>} A promise which resolves with result of yes / no callbacks or true / false.
   *
   * @example
   * const result = await TJSDialog.confirm({
   *  title: 'A Yes or No Question',
   *  content: '<p>Choose wisely.</p>',
   *  onYes: () => 'YES Result',
   *  onNo: () => 'NO Result'
   * });
   *
   * // Logs 'YES result', 'NO Result', or null if the user closed the dialog without making a selection.
   * console.log(result);
   */
  static async confirm({ onYes, onNo, ...data } = {}, options = {}) {
    const mergedButtons = deepMerge({
      yes: {
        icon: "fas fa-check",
        label: "Yes"
      },
      no: {
        icon: "fas fa-times",
        label: "No"
      }
    }, data.buttons ?? {});
    return this.wait({
      ...data,
      buttons: deepMerge(mergedButtons, {
        yes: {
          onPress: ({ application }) => this.#invokeFn(onYes, application, true)
        },
        no: {
          onPress: ({ application }) => this.#invokeFn(onNo, application, false)
        }
      }),
      default: data.default ?? "yes"
    }, options);
  }
  /**
   * A helper method to invoke a callback function directly or lookup an exported function with the same name from any
   * content Svelte component to invoke. This is used internally to apply default values for `confirm` and `prompt`.
   *
   * @param {string|((data?: { application?: TJSDialog }) => any)} callback - Callback function to invoke; may be an
   *        async function. When defined as a string any matching function by name exported from content Svelte
   *        component is invoked.
   *
   * @param {TJSDialog} application - TJSDialog instance passed to callback.
   *
   * @param {*} [defaultResult] - An optional default result to return; undefined if not specified.
   *
   * @returns {*} Result.
   *
   * @internal
   */
  static #invokeFn(callback, application, defaultResult = void 0) {
    let result = defaultResult;
    switch (typeof callback) {
      case "function":
        result = callback({ application });
        break;
      case "string": {
        const dialogComponent = application?.svelte?.appShell?.dialogComponent;
        if (dialogComponent !== void 0 && typeof dialogComponent?.[callback] === "function") {
          result = dialogComponent?.[callback]({ application });
        } else {
          if (dialogComponent === void 0) {
            console.warn(`[TRL] TJSDialog warning: 'onPress' defined as a string with no associated content Svelte component.`);
          } else if (typeof dialogComponent?.[callback] !== "function") {
            console.warn(`[TRL] TJSDialog warning: The content Svelte component does not contain an associated function '${callback}'. Did you remember to add '<svelte:options accessors={true} />' and export the function?`);
          }
        }
        break;
      }
    }
    return result;
  }
  /**
   * A helper factory method to display a basic "prompt" style TJSDialog with a single button.
   *
   * @template T
   *
   * @param {import('./internal/state-dialog/types').TJSDialog.OptionsData & {
   *    onOk?: string | ((data?: { application?: TJSDialog }) => any),
   *    label?: string,
   *    icon?: string
   * }} [data] - Prompt dialog options that includes any TJSDialog options along with the following optional fields:
   *
   * @param {string|((data?: { application?: TJSDialog }) => any)} [data.onOk] - Callback function upon `ok`; may be
   *        an async function. When defined as a string any matching function by name exported from content Svelte
   *        component is invoked.
   *
   * @param {string}   [data.label] - The OK prompt button text.
   *
   * @param {string}   [data.icon="fas fa-check"] - Set another icon besides `fas fa-check` for button.
   *
   * @param {import('./types').SvelteApp.OptionsCore}  [options]  SvelteApp options passed to the
   *        TJSDialog constructor.
   *
   * @returns {Promise<T>} The returned value from the provided callback function or `true` if the button
   *          is pressed.
   *
   * @example
   * const result = await TJSDialog.prompt({
   *  title: 'Are you OK?',
   *  content: '<p>Are you OK?.</p>',
   *  label: 'Feeling Fine!',
   *  onOk: () => 'OK'
   * });
   *
   * // Logs 'OK' or null if the user closed the dialog without making a selection.
   * console.log(result);
   */
  static async prompt({ onOk, label, icon = "fas fa-check", ...data } = {}, options = {}) {
    return this.wait({
      ...data,
      buttons: {
        ok: {
          icon,
          label,
          onPress: ({ application }) => this.#invokeFn(onOk, application, true)
        }
      },
      default: "ok"
    }, options);
  }
  /**
   * Creates an anonymous data defined TJSDialog returning a Promise that can be awaited upon for the user to make a
   * choice.
   *
   * Note: By default `null` is returned if the dialog is closed without a user making a choice.
   *
   * @template T
   *
   * @param {import('./internal/state-dialog/types').TJSDialog.OptionsData}  data - Dialog data passed to the
   *        TJSDialog constructor.
   *
   * @param {import('./types').SvelteApp.OptionsCore}  [options]  SvelteApp options passed to the
   *        TJSDialog constructor.
   *
   * @returns {Promise<T>} A Promise that resolves to the chosen result.
   */
  static async wait(data, options = {}) {
    if (!isObject(data)) {
      throw new TypeError(`TJSDialog.wait error: 'data' is not an object'.`);
    }
    return new this({ ...data }, options).wait();
  }
};
if (import.meta.hot) {
  FoundryHMRSupport.initialize();
}
PopoutSupport.initialize();
export {
  SvelteApp,
  SvelteApp as SvelteApplication,
  TJSDialog
};
//# sourceMappingURL=@typhonjs-fvtt_runtime_svelte_application.js.map
