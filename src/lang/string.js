/**
 * String Model
 */
import {
    isEmpty,
    isString,
    isObject,
    isUndefined
} from "../utils";
var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
    _trim = String.prototype.trim,
    SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
    EMPTY = '';
/**
 * trim
 * @param str
 * @returns {*}
 */
export const trim = str => {
    return isEmpty(str) ? str : (_trim ? _trim.call(str) : (str + '').replace(RE_TRIM, EMPTY));
}
export const lenCn = str => {
    if (!isString(str)) return 0;
    return str.replace(/[\u4e00-\u9fa5]/g, "**").length;
}
export const subCn = (str, num, strip) => {
    if (lenCn(str) <= num) return str.toString();
    for (var i = 0; i < str.length; i++) {
        if (lenCn(str.substr(0, i)) >= num) {
            return str.substr(0, i) + (strip || "...");
        }
    }
    return str;
}
export const clearTags = (str, tag, includeContent) => {
    tag = tag || EMPTY;
    var reg;
    if (!tag) {
        reg = new RegExp('</?[0-9a-z]+[^>]*>', 'gi');
    } else {
        if (includeContent) {
            reg = new RegExp('<' + tag + '[^>]*>([\\S\\s]*?)<\/' + tag + '>', 'gi');
        } else {
            reg = new RegExp('</?' + tag + '[^>]*>', 'gi');
        }
    }
    return str.replace(reg, EMPTY);
}
export const clearScript = str => {
    return clearTags(str, 'script', true);
}
export const clearTrn = str => {
    return str.replace(/[\r\n\t]/g, '');
}
/**
 * 是否是手机号码
 * @param m
 * @returns {boolean}
 */
export const isMobile = m => {
    return /^(1[3456789]\d{9})$/.test(trim(m));
}
/**
 * 是否是座机号码
 * @param str
 * @returns {boolean}
 */
export const isTelephone = str => {
    return /((0[1-9]{2,3}[\s-]?)?\d{7,8})/gi.test(trim(str));
}
/**
 * 替代
 * @param str
 * @param o
 * @param regexp
 * @returns {*}
 */
export const substitute = (str, o, regexp) => {
    if (!(isString(str) && o)) {
        return str;
    }
    return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
        if (match.charAt(0) === '\\') {
            return match.slice(1);
        }
        return (o[name] === undefined) ? EMPTY : o[name];
    });
}
/**
 * 首字母大写
 * @param str
 * @returns {string}
 */
export const ucFirst = str => {
    str += '';
    return str.charAt(0).toUpperCase() + str.substring(1);
}
/**
 * 以某个字符串开始
 * @param str
 * @param prefix
 * @returns {boolean}
 */
export const startsWith = (str, prefix) => {
    return str.lastIndexOf(prefix, 0) === 0;
}
/**
 * 以某个字符串结束
 * @param str
 * @param suffix
 * @returns {boolean}
 */
export const endsWith = (str, suffix) => {
    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) === ind;
}
/**
 *  格式化字符串
 * @param str
 * @returns {*}
 */
export const format = (str, ...args) => {
    if (args.length <= 0) return str || EMPTY;
    var result = str,
        reg;
    if (1 === args.length && isObject(args[0])) {
        for (var key in args[0]) {
            if (!args[0].hasOwnProperty(key)) continue;
            reg = new RegExp("\\{" + key + "\\}", "gi");
            result = result.replace(reg, args[0][key]);
        }
    } else {
        for (var i = 0; i < args.length; i++) {
            reg = new RegExp("\\{" + i + "\\}", "gi");
            result = result.replace(reg, args[i]);
        }
    }
    return result;
}
/**
 * 左侧填充
 * @param obj
 * @param len
 * @param ch
 */
export const padLeft = (obj, len, ch) => {
    ch = isUndefined(ch) ? '0' : ch;
    var s = String(obj);
    while (s.length < len)
        s = ch + s;
    return s;
}
/**
 * 右侧填充
 * @param obj
 * @param len
 * @param ch
 */
export const padRight = (obj, len, ch) => {
    ch = isUndefined(ch) ? '0' : ch;
    var s = String(obj);
    while (s.length < len)
        s += ch;
    return s
}

export const compare = (source, target, tmp = '<b style="color:red">{0}</b>') => {
    if (source === target) return source;
    if (!isString(source) || !isString(target)) return source;
    var diff = EMPTY
    var index = 0
    var str = EMPTY
    while (source.length > 0) {
        var char = source[0]
        if (target.length - 1 < index) {
            str += format(tmp, diff + source)
            return str
        }
        if (target[index] === char) {
            if (diff != EMPTY) {
                char = format(tmp, diff)
                diff = EMPTY
            }
            str += char
        } else {
            diff += char
        }
        source = source.substr(1)
        index++
    }
    if (diff != EMPTY) {
        str += format(tmp, diff)
    }
    return str
}