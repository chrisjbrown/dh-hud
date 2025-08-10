function set(obj, key, val) {
	if (typeof val.value === 'object') val.value = klona(val.value);
	if (!val.enumerable || val.get || val.set || !val.configurable || !val.writable || key === '__proto__') {
		Object.defineProperty(obj, key, val);
	} else obj[key] = val.value;
}

function klona(x) {
	if (typeof x !== 'object') return x;

	var i=0, k, list, tmp, str=Object.prototype.toString.call(x);

	if (str === '[object Object]') {
		tmp = Object.create(x.__proto__ || null);
	} else if (str === '[object Array]') {
		tmp = Array(x.length);
	} else if (str === '[object Set]') {
		tmp = new Set;
		x.forEach(function (val) {
			tmp.add(klona(val));
		});
	} else if (str === '[object Map]') {
		tmp = new Map;
		x.forEach(function (val, key) {
			tmp.set(klona(key), klona(val));
		});
	} else if (str === '[object Date]') {
		tmp = new Date(+x);
	} else if (str === '[object RegExp]') {
		tmp = new RegExp(x.source, x.flags);
	} else if (str === '[object DataView]') {
		tmp = new x.constructor( klona(x.buffer) );
	} else if (str === '[object ArrayBuffer]') {
		tmp = x.slice(0);
	} else if (str.slice(-6) === 'Array]') {
		// ArrayBuffer.isView(x)
		// ~> `new` bcuz `Buffer.slice` => ref
		tmp = new x.constructor(x);
	}

	if (tmp) {
		for (list=Object.getOwnPropertySymbols(x); i < list.length; i++) {
			set(tmp, list[i], Object.getOwnPropertyDescriptor(x, list[i]));
		}

		for (i=0, list=Object.getOwnPropertyNames(x); i < list.length; i++) {
			if (Object.hasOwnProperty.call(tmp, k=list[i]) && tmp[k] === x[k]) continue;
			set(tmp, k, Object.getOwnPropertyDescriptor(x, k));
		}
	}

	return tmp || x;
}

/**
 * Provides common object manipulation utility functions and TypeScript type guards.
 *
 * @packageDocumentation
 */
/**
 * Freezes all entries traversed that are objects including entries in arrays.
 *
 * @param data - An object or array.
 *
 * @param [options] - Options
 *
 * @param [options.skipKeys] - A Set of strings indicating keys of objects to not freeze.
 *
 * @returns The frozen object.
 *
 * @typeParam T - Type of data.
 */
function deepFreeze(data, { skipKeys } = {}) {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError(`deepFreeze error: 'data' is not an object or array.`);
    }
    if (skipKeys !== void 0 && Object.prototype.toString.call(skipKeys) !== '[object Set]') {
        throw new TypeError(`deepFreeze error: 'options.skipKeys' is not a Set.`);
    }
    const stack = [data];
    while (stack.length > 0) {
        const obj = stack.pop();
        if (typeof obj !== 'object' || obj === null || Object.isFrozen(obj)) {
            continue;
        }
        // Collect nested properties before freezing.
        const children = [];
        if (Array.isArray(obj)) {
            for (let cntr = 0; cntr < obj.length; cntr++) {
                children.push(obj[cntr]);
            }
        }
        else {
            for (const key in obj) {
                if (Object.hasOwn(obj, key) && !skipKeys?.has?.(key)) {
                    children.push(obj[key]);
                }
            }
        }
        // Freeze after collecting children to avoid modifying a frozen object.
        Object.freeze(obj);
        // Push collected children onto the stack for further processing.
        stack.push(...children);
    }
    return data;
}
function deepMerge(target, ...sourceObj) {
    if (Object.prototype.toString.call(target) !== '[object Object]') {
        throw new TypeError(`deepMerge error: 'target' is not an object.`);
    }
    if (sourceObj.length === 0) {
        throw new TypeError(`deepMerge error: 'sourceObj' is not an object.`);
    }
    for (let cntr = 0; cntr < sourceObj.length; cntr++) {
        if (Object.prototype.toString.call(sourceObj[cntr]) !== '[object Object]') {
            throw new TypeError(`deepMerge error: 'sourceObj[${cntr}]' is not an object.`);
        }
    }
    // When merging a single source object there is an implementation that is twice as fast as multiple source objects.
    if (sourceObj.length === 1) {
        const stack = [];
        for (const obj of sourceObj) {
            stack.push({ target, source: obj });
        }
        while (stack.length > 0) {
            const { target, source } = stack.pop(); // LIFO but maintains correct merge order.
            for (const prop in source) {
                if (Object.hasOwn(source, prop)) {
                    const sourceValue = source[prop];
                    const targetValue = target[prop];
                    // If both values are plain objects, enqueue for further merging.
                    if (Object.hasOwn(target, prop) && targetValue?.constructor === Object &&
                        sourceValue?.constructor === Object) {
                        stack.push({ target: targetValue, source: sourceValue });
                    }
                    else {
                        target[prop] = sourceValue;
                    }
                }
            }
        }
    }
    else // Stack implementation for multiple source objects.
     {
        const stack = [{ target, sources: sourceObj }];
        while (stack.length > 0) {
            const { target, sources } = stack.pop();
            for (const source of sources) {
                for (const prop in source) {
                    if (Object.hasOwn(source, prop)) {
                        const sourceValue = source[prop];
                        const targetValue = target[prop];
                        // If both values are plain objects, push for further merging with a new object.
                        if (Object.hasOwn(target, prop) && targetValue?.constructor === Object &&
                            sourceValue?.constructor === Object) {
                            target[prop] = Object.assign({}, targetValue); // Copy existing target data.
                            stack.push({ target: target[prop], sources: [sourceValue] });
                        }
                        else {
                            target[prop] = sourceValue;
                        }
                    }
                }
            }
        }
    }
    return target;
}
/**
 * Seals all entries traversed that are objects including entries in arrays.
 *
 * @param data - An object or array.
 *
 * @param [options] - Options
 *
 * @param [options.skipKeys] - A Set of strings indicating keys of objects to not seal.
 *
 * @returns The sealed object.
 *
 * @typeParam T - Type of data.
 */
function deepSeal(data, { skipKeys } = {}) {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError(`deepSeal error: 'data' is not an object or array.`);
    }
    if (skipKeys !== void 0 && Object.prototype.toString.call(skipKeys) !== '[object Set]') {
        throw new TypeError(`deepSeal error: 'options.skipKeys' is not a Set.`);
    }
    const stack = [data];
    while (stack.length > 0) {
        const obj = stack.pop();
        if (typeof obj !== 'object' || obj === null || Object.isSealed(obj)) {
            continue;
        }
        // Collect nested properties before freezing.
        const children = [];
        if (Array.isArray(obj)) {
            for (let cntr = 0; cntr < obj.length; cntr++) {
                children.push(obj[cntr]);
            }
        }
        else {
            for (const key in obj) {
                if (Object.hasOwn(obj, key) && !skipKeys?.has?.(key)) {
                    children.push(obj[key]);
                }
            }
        }
        // Freeze after collecting children to avoid modifying a frozen object.
        Object.seal(obj);
        // Push collected children onto the stack for further processing.
        stack.push(...children);
    }
    return data;
}
/**
 * Determine if the given object has a getter & setter accessor.
 *
 * @param object - An object.
 *
 * @param accessor - Accessor to test.
 *
 * @returns Whether the given object has the getter and setter for accessor.
 *
 * @typeParam T - Type of data.
 * @typeParam K - Accessor key.
 */
function hasAccessor(object, accessor) {
    if (typeof object !== 'object' || object === null || object === void 0) {
        return false;
    }
    // Check for instance accessor.
    const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
    if (iDescriptor !== void 0 && iDescriptor.get !== void 0 && iDescriptor.set !== void 0) {
        return true;
    }
    // Walk parent prototype chain. Check for descriptor at each prototype level.
    for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
        const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
        if (descriptor !== void 0 && descriptor.get !== void 0 && descriptor.set !== void 0) {
            return true;
        }
    }
    return false;
}
/**
 * Determine if the given object has a getter accessor.
 *
 * @param object - An object.
 *
 * @param accessor - Accessor to test.
 *
 * @returns Whether the given object has the getter for accessor.
 *
 * @typeParam T - Type of data.
 * @typeParam K - Accessor key.
 */
function hasGetter(object, accessor) {
    if (typeof object !== 'object' || object === null || object === void 0) {
        return false;
    }
    // Check for instance accessor.
    const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
    if (iDescriptor !== void 0 && iDescriptor.get !== void 0) {
        return true;
    }
    // Walk parent prototype chain. Check for descriptor at each prototype level.
    for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
        const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
        if (descriptor !== void 0 && descriptor.get !== void 0) {
            return true;
        }
    }
    return false;
}
/**
 * Returns whether the target is or has the given prototype walking up the prototype chain.
 *
 * @param target - Any target class / constructor function to test.
 *
 * @param Prototype - Class / constructor function to find.
 *
 * @returns Target matches prototype.
 *
 * @typeParam T - Prototype class / constructor.
 */
function hasPrototype(target, Prototype) {
    if (typeof target !== 'function') {
        return false;
    }
    if (target === Prototype) {
        return true;
    }
    // Walk parent prototype chain. Check for descriptor at each prototype level.
    for (let proto = Object.getPrototypeOf(target); proto; proto = Object.getPrototypeOf(proto)) {
        if (proto === Prototype) {
            return true;
        }
    }
    return false;
}
/**
 * Determine if the given object has a setter accessor.
 *
 * @param object - An object.
 *
 * @param accessor - Accessor to test.
 *
 * @returns Whether the given object has the setter for accessor.
 *
 * @typeParam T - Type of data.
 * @typeParam K - Accessor key.
 */
function hasSetter(object, accessor) {
    if (typeof object !== 'object' || object === null || object === void 0) {
        return false;
    }
    // Check for instance accessor.
    const iDescriptor = Object.getOwnPropertyDescriptor(object, accessor);
    if (iDescriptor !== void 0 && iDescriptor.set !== void 0) {
        return true;
    }
    // Walk parent prototype chain. Check for descriptor at each prototype level.
    for (let o = Object.getPrototypeOf(object); o; o = Object.getPrototypeOf(o)) {
        const descriptor = Object.getOwnPropertyDescriptor(o, accessor);
        if (descriptor !== void 0 && descriptor.set !== void 0) {
            return true;
        }
    }
    return false;
}
/**
 * Tests for whether an object is async iterable.
 *
 * @param value - Any value.
 *
 * @returns Whether value is async iterable.
 */
function isAsyncIterable(value) {
    if (typeof value !== 'object' || value === null || value === void 0) {
        return false;
    }
    return Symbol.asyncIterator in value;
}
/**
 * Tests for whether an object is iterable.
 *
 * @param value - Any value.
 *
 * @returns Whether object is iterable.
 */
function isIterable(value) {
    if (value === null || value === void 0 || typeof value !== 'object') {
        return false;
    }
    return Symbol.iterator in value;
}
/**
 * Tests for whether object is not null, typeof object, and not an array.
 *
 * @param value - Any value.
 *
 * @returns Is it an object.
 */
function isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}
/**
 * Tests for whether the given value is a plain object.
 *
 * An object is plain if it is created by either: `{}`, `new Object()` or `Object.create(null)`.
 *
 * @param value - Any value
 *
 * @returns Is it a plain object.
 */
function isPlainObject(value) {
    if (Object.prototype.toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.prototype;
}
/**
 * Safely returns keys on an object or an empty array if not an object.
 *
 * @param object - An object.
 *
 * @returns Object keys or empty array.
 */
function objectKeys(object) {
    return typeof object === 'object' && object !== null ? Object.keys(object) : [];
}
/**
 * Safely returns an objects size. Note for String objects Unicode is not taken into consideration.
 *
 * @param object - Any value, but size returned for object / Map / Set / arrays / strings.
 *
 * @returns Size of object.
 */
function objectSize(object) {
    if (object === void 0 || object === null || typeof object !== 'object') {
        return 0;
    }
    const tag = Object.prototype.toString.call(object);
    if (tag === '[object Map]' || tag === '[object Set]') {
        return object.size;
    }
    if (tag === '[object String]') {
        return object.length;
    }
    return Object.keys(object).length;
}
/**
 * Provides a way to safely access an objects data / entries given an accessor string which describes the
 * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
 * to walk.
 *
 * @param data - An object to access entry data.
 *
 * @param accessor - A string describing the entries to access with keys separated by `.`.
 *
 * @param [defaultValue] - (Optional) A default value to return if an entry for accessor is not found.
 *
 * @returns The value referenced by the accessor.
 *
 * @typeParam T - Type of data.
 * @typeParam P - Accessor type.
 * @typeParam R - Return value / Inferred deep access type or any provided default value type.
 */
function safeAccess(data, accessor, defaultValue) {
    if (typeof data !== 'object' || data === null) {
        return defaultValue;
    }
    if (typeof accessor !== 'string') {
        return defaultValue;
    }
    const keys = accessor.split('.');
    let result = data;
    // Walk through the given object by the accessor indexes.
    for (let cntr = 0; cntr < keys.length; cntr++) {
        // If the next level of object access is undefined or null then return the default value.
        if (result[keys[cntr]] === void 0 || result[keys[cntr]] === null) {
            return defaultValue;
        }
        result = result[keys[cntr]];
    }
    return result;
}
/**
 * Compares a source object and values of entries against a target object. If the entries in the source object match
 * the target object then `true` is returned otherwise `false`. If either object is undefined or null then false
 * is returned.
 *
 * Note: The source and target should be JSON objects.
 *
 * @param source - Source object.
 *
 * @param target - Target object.
 *
 * @param [options] - Options.
 *
 * @param [options.arrayIndex] - Set to `false` to exclude equality testing for array contents; default: `true`.
 *
 * @param [options.hasOwnOnly] - Set to `false` to include enumerable prototype properties; default: `true`.
 *
 * @returns True if equal.
 */
function safeEqual(source, target, options) {
    if (typeof source !== 'object' || source === null || typeof target !== 'object' || target === null) {
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
/**
 * Returns an iterator of safe keys useful with {@link safeAccess} and {@link safeSet} by traversing the given object.
 *
 * Note: Keys are only generated for JSON objects; {@link Map} and {@link Set} are not indexed.
 *
 * @param data - An object to traverse for accessor keys.
 *
 * @param [options] - Options.
 *
 * @param [options.arrayIndex] - Set to `false` to exclude safe keys for array indexing; default: `true`.
 *
 * @param [options.hasOwnOnly] - Set to `false` to include enumerable prototype properties; default: `true`.
 *
 * @returns Safe key iterator.
 */
function* safeKeyIterator(data, { arrayIndex = true, hasOwnOnly = true } = {}) {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError(`safeKeyIterator error: 'data' is not an object.`);
    }
    if (typeof arrayIndex !== 'boolean') {
        throw new TypeError(`safeKeyIterator error: 'options.arrayIndex' is not a boolean.`);
    }
    if (typeof hasOwnOnly !== 'boolean') {
        throw new TypeError(`safeKeyIterator error: 'options.hasOwnOnly' is not a boolean.`);
    }
    const stack = [{ obj: data, prefix: '' }];
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
            }
            else if (typeof value === 'object' && value !== null) {
                stack.push({ obj: value, prefix: fullKey }); // Push to stack for DFS traversal.
            }
            else if (typeof value !== 'function') {
                yield fullKey;
            }
        }
    }
}
/**
 * Provides a way to safely set an objects data / entries given an accessor string which describes the
 * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
 * to walk.
 *
 * @param data - An object to access entry data.
 *
 * @param accessor - A string describing the entries to access.
 *
 * @param value - A new value to set if an entry for accessor is found.
 *
 * @param [options] - Options.
 *
 * @param [options.operation] - Operation to perform including: `add`, `div`, `mult`, `set`, `set-undefined`, `sub`;
 *        default: `set`.
 *
 * @param [options.createMissing] - If `true` missing accessor entries will be created as objects automatically;
 *        default: `false`.
 *
 * @returns True if successful.
 */
function safeSet(data, accessor, value, { operation = 'set', createMissing = false } = {}) {
    if (typeof data !== 'object' || data === null) {
        throw new TypeError(`safeSet error: 'data' is not an object.`);
    }
    if (typeof accessor !== 'string') {
        throw new TypeError(`safeSet error: 'accessor' is not a string.`);
    }
    if (typeof operation !== 'string') {
        throw new TypeError(`safeSet error: 'options.operation' is not a string.`);
    }
    if (operation !== 'add' && operation !== 'div' && operation !== 'mult' && operation !== 'set' &&
        operation !== 'set-undefined' && operation !== 'sub') {
        throw new Error(`safeSet error: Unknown 'options.operation'.`);
    }
    if (typeof createMissing !== 'boolean') {
        throw new TypeError(`safeSet error: 'options.createMissing' is not a boolean.`);
    }
    const access = accessor.split('.');
    let result = false;
    // Verify first level missing property.
    if (access.length === 1 && !createMissing && !(access[0] in data)) {
        return false;
    }
    // Walk through the given object by the accessor indexes.
    for (let cntr = 0; cntr < access.length; cntr++) {
        // If data is an array perform validation that the accessor is a positive integer otherwise quit.
        if (Array.isArray(data)) {
            const number = (+access[cntr]);
            if (!Number.isInteger(number) || number < 0) {
                return false;
            }
        }
        if (cntr === access.length - 1) {
            switch (operation) {
                case 'add':
                    data[access[cntr]] += value;
                    result = true;
                    break;
                case 'div':
                    data[access[cntr]] /= value;
                    result = true;
                    break;
                case 'mult':
                    data[access[cntr]] *= value;
                    result = true;
                    break;
                case 'set':
                    data[access[cntr]] = value;
                    result = true;
                    break;
                case 'set-undefined':
                    if (data[access[cntr]] === void 0) {
                        data[access[cntr]] = value;
                    }
                    result = true;
                    break;
                case 'sub':
                    data[access[cntr]] -= value;
                    result = true;
                    break;
            }
        }
        else {
            // If createMissing is true and the next level of object access is undefined then create a new object entry.
            if (createMissing && data[access[cntr]] === void 0) {
                data[access[cntr]] = {};
            }
            // Abort if the next level is null or not an object and containing a value.
            if (data[access[cntr]] === null || typeof data[access[cntr]] !== 'object') {
                return false;
            }
            data = data[access[cntr]];
        }
    }
    return result;
}

export { deepFreeze, deepMerge, deepSeal, hasAccessor, hasGetter, hasPrototype, hasSetter, isAsyncIterable, isIterable, isObject, isPlainObject, klona, objectKeys, objectSize, safeAccess, safeEqual, safeKeyIterator, safeSet };
//# sourceMappingURL=index.js.map
