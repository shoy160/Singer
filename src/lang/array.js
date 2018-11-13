/**
 * Array Model
 */
import {
    isUndefined,
    isFunction
} from '../utils'

import {
    keys
} from "./object";

var AP = Array.prototype,
    indexOf = AP.indexOf,
    lastIndexOf = AP.lastIndexOf,
    UF = undefined,
    FALSE = false;

export const each = (object, fn, context) => {
    if (object) {
        var key,
            val,
            __keys,
            i = 0,
            length = object && object.length,
            isObj = isUndefined(length) || isFunction(object);

        context = context || null;

        if (isObj) {
            __keys = keys(object);
            for (; i < __keys.length; i++) {
                key = __keys[i];
                if (fn.call(context, object[key], key, object) === FALSE) {
                    break;
                }
            }
        } else {
            for (val = object[0]; i < length; val = object[++i]) {
                if (fn.call(context, val, i, object) === FALSE) {
                    break;
                }
            }
        }
    }
    return object;
}

export const index = (item, arr, fromIndex) => {
    if (indexOf) {
        return fromIndex === UF ?
            indexOf.call(arr, item) :
            indexOf.call(arr, item, fromIndex);
    }
    var i = fromIndex || 0;
    for (; i < arr.length; i++) {
        if (arr[i] === item)
            break;
    }
    return i;
}
export const lastIndex = (item, arr, fromIndex) => {
    if (lastIndexOf) {
        return fromIndex === UF ?
            lastIndexOf.call(arr, item) :
            lastIndexOf.call(arr, item, fromIndex);
    }
    if (fromIndex === UF) {
        fromIndex = arr.length - 1;
    }
    var i = fromIndex;
    for (; i >= 0; i--) {
        if (arr[i] === item)
            break;
    }
    return i;
}
export const inArray = (item, arr) => {
    return index(item, arr) >= 0;
}
export const find = (list, fn, context) => {
    var current = null;
    arrayFn.each(list, function (item, i) {
        if (fn.call(context, item, i)) {
            current = item;
            return false;
        }
    });
    return current;
}
export const filter = (list, fn, context) => {
    var results = [];
    arrayFn.each(list, function (item, i) {
        if (fn.call(context, item, i))
            results.push(item);
    });
    return results;
}