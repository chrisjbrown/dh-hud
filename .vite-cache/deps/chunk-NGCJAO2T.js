// node_modules/@typhonjs-fvtt/runtime/_dist/util/object/index.js
function set(obj, key, val) {
  if (typeof val.value === "object") val.value = klona(val.value);
  if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === "__proto__") {
    Object.defineProperty(obj, key, val);
  } else obj[key] = val.value;
}
function klona(x) {
  if (typeof x !== "object") return x;
  var i = 0, k, list, tmp, str = Object.prototype.toString.call(x);
  if (str === "[object Object]") {
    tmp = Object.create(x.__proto__ || null);
  } else if (str === "[object Array]") {
    tmp = Array(x.length);
  } else if (str === "[object Set]") {
    tmp = /* @__PURE__ */ new Set();
    x.forEach(function(val) {
      tmp.add(klona(val));
    });
  } else if (str === "[object Map]") {
    tmp = /* @__PURE__ */ new Map();
    x.forEach(function(val, key) {
      tmp.set(klona(key), klona(val));
    });
  } else if (str === "[object Date]") {
    tmp = /* @__PURE__ */ new Date(+x);
  } else if (str === "[object RegExp]") {
    tmp = new RegExp(x.source, x.flags);
  } else if (str === "[object DataView]") {
    tmp = new x.constructor(klona(x.buffer));
  } else if (str === "[object ArrayBuffer]") {
    tmp = x.slice(0);
  } else if (str.slice(-6) === "Array]") {
    tmp = new x.constructor(x);
  }
  if (tmp) {
    for (list = Object.getOwnPropertySymbols(x); i < list.length; i++) {
      set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
    }
    for (i = 0, list = Object.getOwnPropertyNames(x); i < list.length; i++) {
      if (Object.hasOwnProperty.call(tmp, k = list[i]) && tmp[k] === x[k]) continue;
      set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
    }
  }
  return tmp || x;
}
function deepFreeze(data, { skipKeys } = {}) {
  if (typeof data !== "object" || data === null) {
    throw new TypeError(`deepFreeze error: 'data' is not an object or array.`);
  }
  if (skipKeys !== void 0 && Object.prototype.toString.call(skipKeys) !== "[object Set]") {
    throw new TypeError(`deepFreeze error: 'options.skipKeys' is not a Set.`);
  }
  const stack = [data];
  while (stack.length > 0) {
    const obj = stack.pop();
    if (typeof obj !== "object" || obj === null || Object.isFrozen(obj)) {
      continue;
    }
    const children = [];
    if (Array.isArray(obj)) {
      for (let cntr = 0; cntr < obj.length; cntr++) {
        children.push(obj[cntr]);
      }
    } else {
      for (const key in obj) {
        if (Object.hasOwn(obj, key) && !skipKeys?.has?.(key)) {
          children.push(obj[key]);
        }
      }
    }
    Object.freeze(obj);
    stack.push(...children);
  }
  return data;
}
function deepMerge(target, ...sourceObj) {
  if (Object.prototype.toString.call(target) !== "[object Object]") {
    throw new TypeError(`deepMerge error: 'target' is not an object.`);
  }
  if (sourceObj.length === 0) {
    throw new TypeError(`deepMerge error: 'sourceObj' is not an object.`);
  }
  for (let cntr = 0; cntr < sourceObj.length; cntr++) {
    if (Object.prototype.toString.call(sourceObj[cntr]) !== "[object Object]") {
      throw new TypeError(`deepMerge error: 'sourceObj[${cntr}]' is not an object.`);
    }
  }
  if (sourceObj.length === 1) {
    const stack = [];
    for (const obj of sourceObj) {
      stack.push({ target, source: obj });
    }
    while (stack.length > 0) {
      const { target: target2, source } = stack.pop();
      for (const prop in source) {
        if (Object.hasOwn(source, prop)) {
          const sourceValue = source[prop];
          const targetValue = target2[prop];
          if (Object.hasOwn(target2, prop) && targetValue?.constructor === Object && sourceValue?.constructor === Object) {
            stack.push({ target: targetValue, source: sourceValue });
          } else {
            target2[prop] = sourceValue;
          }
        }
      }
    }
  } else {
    const stack = [{ target, sources: sourceObj }];
    while (stack.length > 0) {
      const { target: target2, sources } = stack.pop();
      for (const source of sources) {
        for (const prop in source) {
          if (Object.hasOwn(source, prop)) {
            const sourceValue = source[prop];
            const targetValue = target2[prop];
            if (Object.hasOwn(target2, prop) && targetValue?.constructor === Object && sourceValue?.constructor === Object) {
              target2[prop] = Object.assign({}, targetValue);
              stack.push({ target: target2[prop], sources: [sourceValue] });
            } else {
              target2[prop] = sourceValue;
            }
          }
        }
      }
    }
  }
  return target;
}
function deepSeal(data, { skipKeys } = {}) {
  if (typeof data !== "object" || data === null) {
    throw new TypeError(`deepSeal error: 'data' is not an object or array.`);
  }
  if (skipKeys !== void 0 && Object.prototype.toString.call(skipKeys) !== "[object Set]") {
    throw new TypeError(`deepSeal error: 'options.skipKeys' is not a Set.`);
  }
  const stack = [data];
  while (stack.length > 0) {
    const obj = stack.pop();
    if (typeof obj !== "object" || obj === null || Object.isSealed(obj)) {
      continue;
    }
    const children = [];
    if (Array.isArray(obj)) {
      for (let cntr = 0; cntr < obj.length; cntr++) {
        children.push(obj[cntr]);
      }
    } else {
      for (const key in obj) {
        if (Object.hasOwn(obj, key) && !skipKeys?.has?.(key)) {
          children.push(obj[key]);
        }
      }
    }
    Object.seal(obj);
    stack.push(...children);
  }
  return data;
}
function hasAccessor(object, accessor) {
  if (typeof object !== "object" || object === null || object === void 0) {
    return false;
  }
  const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
  if (iDescriptor !== void 0 && iDescriptor.get !== void 0 && iDescriptor.set !== void 0) {
    return true;
  }
  for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
    const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
    if (descriptor !== void 0 && descriptor.get !== void 0 && descriptor.set !== void 0) {
      return true;
    }
  }
  return false;
}
function hasGetter(object, accessor) {
  if (typeof object !== "object" || object === null || object === void 0) {
    return false;
  }
  const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
  if (iDescriptor !== void 0 && iDescriptor.get !== void 0) {
    return true;
  }
  for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
    const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
    if (descriptor !== void 0 && descriptor.get !== void 0) {
      return true;
    }
  }
  return false;
}
function hasPrototype(target, Prototype) {
  if (typeof target !== "function") {
    return false;
  }
  if (target === Prototype) {
    return true;
  }
  for (let proto = Object.getPrototypeOf(target); proto; proto = Object.getPrototypeOf(proto)) {
    if (proto === Prototype) {
      return true;
    }
  }
  return false;
}
function hasSetter(object, accessor) {
  if (typeof object !== "object" || object === null || object === void 0) {
    return false;
  }
  const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
  if (iDescriptor !== void 0 && iDescriptor.set !== void 0) {
    return true;
  }
  for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
    const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
    if (descriptor !== void 0 && descriptor.set !== void 0) {
      return true;
    }
  }
  return false;
}
function isAsyncIterable(value) {
  if (typeof value !== "object" || value === null || value === void 0) {
    return false;
  }
  return Symbol.asyncIterator in value;
}
function isIterable(value) {
  if (value === null || value === void 0 || typeof value !== "object") {
    return false;
  }
  return Symbol.iterator in value;
}
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}
function objectKeys(object) {
  return typeof object === "object" && object !== null ? Object.keys(object) : [];
}
function objectSize(object) {
  if (object === void 0 || object === null || typeof object !== "object") {
    return 0;
  }
  const tag = Object.prototype.toString.call(object);
  if (tag === "[object Map]" || tag === "[object Set]") {
    return object.size;
  }
  if (tag === "[object String]") {
    return object.length;
  }
  return Object.keys(object).length;
}
function safeAccess(data, accessor, defaultValue) {
  if (typeof data !== "object" || data === null) {
    return defaultValue;
  }
  if (typeof accessor !== "string") {
    return defaultValue;
  }
  const keys = accessor.split(".");
  let result = data;
  for (let cntr = 0; cntr < keys.length; cntr++) {
    if (result[keys[cntr]] === void 0 || result[keys[cntr]] === null) {
      return defaultValue;
    }
    result = result[keys[cntr]];
  }
  return result;
}
function safeEqual(source, target, options) {
  if (typeof source !== "object" || source === null || typeof target !== "object" || target === null) {
    return false;
  }
  for (const accessor of safeKeyIterator(source, options)) {
    const sourceObjectValue = safeAccess(source, accessor);
    const targetObjectValue = safeAccess(target, accessor);
    if (sourceObjectValue !== targetObjectValue) {
      return false;
    }
  }
  return true;
}
function* safeKeyIterator(data, { arrayIndex = true, hasOwnOnly = true } = {}) {
  if (typeof data !== "object" || data === null) {
    throw new TypeError(`safeKeyIterator error: 'data' is not an object.`);
  }
  if (typeof arrayIndex !== "boolean") {
    throw new TypeError(`safeKeyIterator error: 'options.arrayIndex' is not a boolean.`);
  }
  if (typeof hasOwnOnly !== "boolean") {
    throw new TypeError(`safeKeyIterator error: 'options.hasOwnOnly' is not a boolean.`);
  }
  const stack = [{ obj: data, prefix: "" }];
  while (stack.length > 0) {
    const { obj, prefix } = stack.pop();
    for (const key in obj) {
      if (hasOwnOnly && !Object.hasOwn(obj, key)) {
        continue;
      }
      const fullKey = prefix ? `${prefix}.${key}` : key;
      const value = obj[key];
      if (Array.isArray(value)) {
        if (!arrayIndex) {
          continue;
        }
        for (let cntr = 0; cntr < value.length; cntr++) {
          yield `${fullKey}.${cntr}`;
        }
      } else if (typeof value === "object" && value !== null) {
        stack.push({ obj: value, prefix: fullKey });
      } else if (typeof value !== "function") {
        yield fullKey;
      }
    }
  }
}
function safeSet(data, accessor, value, { operation = "set", createMissing = false } = {}) {
  if (typeof data !== "object" || data === null) {
    throw new TypeError(`safeSet error: 'data' is not an object.`);
  }
  if (typeof accessor !== "string") {
    throw new TypeError(`safeSet error: 'accessor' is not a string.`);
  }
  if (typeof operation !== "string") {
    throw new TypeError(`safeSet error: 'options.operation' is not a string.`);
  }
  if (operation !== "add" && operation !== "div" && operation !== "mult" && operation !== "set" && operation !== "set-undefined" && operation !== "sub") {
    throw new Error(`safeSet error: Unknown 'options.operation'.`);
  }
  if (typeof createMissing !== "boolean") {
    throw new TypeError(`safeSet error: 'options.createMissing' is not a boolean.`);
  }
  const access = accessor.split(".");
  let result = false;
  if (access.length === 1 && !createMissing && !(access[0] in data)) {
    return false;
  }
  for (let cntr = 0; cntr < access.length; cntr++) {
    if (Array.isArray(data)) {
      const number = +access[cntr];
      if (!Number.isInteger(number) || number < 0) {
        return false;
      }
    }
    if (cntr === access.length - 1) {
      switch (operation) {
        case "add":
          data[access[cntr]] += value;
          result = true;
          break;
        case "div":
          data[access[cntr]] /= value;
          result = true;
          break;
        case "mult":
          data[access[cntr]] *= value;
          result = true;
          break;
        case "set":
          data[access[cntr]] = value;
          result = true;
          break;
        case "set-undefined":
          if (data[access[cntr]] === void 0) {
            data[access[cntr]] = value;
          }
          result = true;
          break;
        case "sub":
          data[access[cntr]] -= value;
          result = true;
          break;
      }
    } else {
      if (createMissing && data[access[cntr]] === void 0) {
        data[access[cntr]] = {};
      }
      if (data[access[cntr]] === null || typeof data[access[cntr]] !== "object") {
        return false;
      }
      data = data[access[cntr]];
    }
  }
  return result;
}

export {
  klona,
  deepFreeze,
  deepMerge,
  deepSeal,
  hasAccessor,
  hasGetter,
  hasPrototype,
  hasSetter,
  isAsyncIterable,
  isIterable,
  isObject,
  isPlainObject,
  objectKeys,
  objectSize,
  safeAccess,
  safeEqual,
  safeKeyIterator,
  safeSet
};
//# sourceMappingURL=chunk-NGCJAO2T.js.map
