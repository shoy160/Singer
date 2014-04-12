(function (S, undefined) {
    var AP = Array.prototype,
        indexOf = AP.indexOf,
        lastIndexOf = AP.lastIndexOf,
        UF = undefined;
    S._mix(S, {
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