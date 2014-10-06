(function (S, undefined) {
    var AP = Array.prototype,
        indexOf = AP.indexOf,
        lastIndexOf = AP.lastIndexOf,
        UF = undefined,
        FALSE = false;
    ;
    S._mix(S, {
        each: function (object, fn, context) {
            if (object) {
                var key,
                    val,
                    keys,
                    i = 0,
                    length = object && object.length,
                    isObj = S.isUndefined(length) || S.isFunction(object);

                context = context || null;

                if (isObj) {
                    keys = S.keys(object);
                    for (; i < keys.length; i++) {
                        key = keys[i];
                        if (fn.call(context, object[key], key, object) === FALSE) {
                            break;
                        }
                    }
                } else {
                    for (val = object[0];
                         i < length; val = object[++i]) {
                        if (fn.call(context, val, i, object) === FALSE) {
                            break;
                        }
                    }
                }
            }
            return object;
        },
        index: function (item, arr, fromIndex) {
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
        },
        lastIndex: function (item, arr, fromIndex) {
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
        },
        inArray: function (item, arr) {
            return S.index(item, arr) >= 0;
        }
    });
})(SINGER);