/**
 * Json 序列化
 */
import {
    isEmpty,
    isArray,
    isString,
    isObject,
    isNumber
} from "../utils/index"
import {
    each
} from './array'
import {
    keys
} from './object'

export const json = obj => {
    if (isEmpty(obj)) return obj;
    if (isObject(obj)) {
        if (Date === obj.constructor) {
            return "'new Date(" + obj.valueOf() + ")'";
        }
        var fmt = function (s) {
            if (isObject(s) && s != null) return json(s);
            return (isString(s) || isNumber(s)) ? "'" + s + "'" : s;
        };
        var arr = [],
            arrItem;
        if (isArray(obj)) {
            each(obj, function (jsonItem) {
                if (isNumber(jsonItem))
                    arr.push(jsonItem);
                else if (isString(jsonItem))
                    arr.push("'" + jsonItem + "'");
                else if (isArray(jsonItem)) {
                    arr.push(json(jsonItem));
                } else {
                    arrItem = [];
                    each(keys(jsonItem), function (key) {
                        arrItem.push("'" + key + "':" + fmt(jsonItem[key]));
                    });
                    arr.push('{' + arrItem.join(',') + '}');
                }
            });
            return '[' + arr.join(',') + ']';
        } else {
            each(keys(obj), function (key) {
                arr.push("'" + key + "':" + fmt(obj[key]));
            });
            return '{' + arr.join(',') + '}';
        }
    } else if (isString(obj)) {
        obj = obj.replace(/'(new Date\(\d+\))'/gi, "$1");
        return eval("(" + obj + ")");
    }
}