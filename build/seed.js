/**
 * @class SINGER
 * @author shoy
 * @date 2014-02-18
 */
var singer = window.SINGER = (function (undefined) {
    var self = this,
        S,
        guid = 0,
        EMPTY = '',
        loggerLevel = {
            debug: 10,
            info: 20,
            warn: 30,
            error: 40
        };

    function getLogger(logger) {
        var obj = {};
        for (var cat in loggerLevel) {
            (function (obj, cat) {
                obj[cat] = function (msg) {
                    return S.log(msg, cat, logger);
                };
            })(obj, cat);
        }
        return obj;
    }

    S = {
        __BUILD_TIME: '@TIME@',
        Env: {
            host: self
        },
        Config: {
            debug: '@DEBUG@',
            fns: {}
        },
        Version: '@VERSION@',
        /**
         * 类型判断
         * @param obj
         * @param type
         * @return boolean
         */
        is: function (obj, type) {
            var isNan = {"NaN": 1, "Infinity": 1, "-Infinity": 1}
            type = type.toLowerCase();
            if (type == "finite") {
                return !isNan["hasOwnProperty"](+obj);
            }
            if (type == "array") {
                return obj instanceof Array;
            }
            if (undefined === obj && type !== "undefined") return false;
            return  (type == "null" && obj === null) ||
                (type == typeof obj && obj !== null) ||
                (type == "object" && obj === Object(obj)) ||
                (type == "array" && Array.isArray && Array.isArray(obj)) ||
                Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() == type;
        },
        isBoolean: function (obj) {
            return S.is(obj, "boolean");
        },
        isDate: function (obj) {
            return S.is(obj, "date");
        },
        isRegExp: function (obj) {
            return S.is(obj, "regexp");
        },
        isObject: function (obj) {
            return S.is(obj, "object");
        },
        isArray: function (obj) {
            return S.is(obj, "array");
        },
        isNumber: function (obj) {
            return S.is(obj, "number");
        },
        isFunction: function (obj) {
            return S.is(obj, "function");
        },
        isNull: function (obj) {
            return S.is(obj, "null");
        },
        isString: function (obj) {
            return S.is(obj, "string");
        },
        isEmpty: function (obj) {
            return EMPTY === obj || S.isNull(obj);
        },
        /**
         * set SINGER Configuration
         * @param configName
         * @param configValue
         */
        config: function (configName, configValue) {
            var cfg,
                r,
                self = this,
                Config = S.Config,
                configFns = Config.fns;
            if (S.isObject(configName)) {
                for (var c in configName) {
                    Config[c] = configName[c];
                }
            } else {
                cfg = configFns[configName];
                if (configValue === undefined) {
                    if (cfg) {
                        r = cfg.call(self);
                    } else {
                        r = Config[configName];
                    }
                } else {
                    if (cfg) {
                        r = cfg.call(self, configValue);
                    } else {
                        Config[configName] = configValue;
                    }
                }
            }
            return r;
        },
        log: function (msg, cat, logger) {
            if ('@DEBUG@') {
                var matched = false;
                if (logger) {
                    matched = S.isObject(msg);
                    if (!matched)
                        msg = logger + ": " + msg;
                }
                if (typeof console !== 'undefined' && console.log) {
                    if (matched) console[cat && console[cat] ? cat : 'log'](logger + ":");
                    console[cat && console[cat] ? cat : 'log'](msg);
                    return msg;
                }
            }
            return undefined;
        },
        getLogger: function (logger) {
            return getLogger(logger);
        },
        guid: function (pre) {
            return (pre || '') + guid++;
        },
        _mix: function (target, resource) {
            for (var name in resource) {
                if (resource.hasOwnProperty(name))
                    target[name] = resource[name];
            }
        }
    };
    S.Logger = {};
    S.Logger.Level = {
        DEBUG: 'debug',
        INFO: 'info',
        WARN: 'warn',
        ERROR: 'error'
    };
    return S;
})();
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
/**
 * Json 序列化
 */
(function(S){
    S.json = function (json) {
        if (S.isEmpty(json)) return json;
        if (S.isObject(json)) {
            if (Date === json.constructor) {
                return "'new Date(" + json.valueOf() + ")'";
            }
            var fmt = function (s) {
                if (S.isObject(s) && s != null) return S.json(s);
                return (S.isString(s) || S.isNumber(s)) ? "'" + s + "'" : s;
            };
            var arr = [],
                arrItem,
                jsonItem;
            if (S.isArray(json)) {
                for (var i = 0; i < json.length; i++) {
                    jsonItem = json[i];
                    if (S.isNumber(jsonItem))
                        arr.push(jsonItem);
                    else if(S.isString(jsonItem))
                        arr.push("'"+jsonItem+"'");
                    else {
                        arrItem = [];
                        for (var j in jsonItem) {
                            arrItem.push("'" + j + "':" + fmt(jsonItem[j]));
                        }
                        arr.push('{' + arrItem.join(',') + '}');
                    }
                }
                return '[' + arr.join(',') + ']';
            } else {
                for (var i in json) arr.push("'" + i + "':" + fmt(json[i]));
                return '{' + arr.join(',') + '}';
            }
        } else if (S.isString(json)) {
            json = json.replace(/'(new Date\(\d+\))'/gi, "$1");
            return eval("(" + json + ")");
        }
    };
})(SINGER);
(function (S) {
    var MIX_CIRCULAR_DETECTION = '__MIX_CIRCULAR',
        hasEnumBug = !({toString: 1}.propertyIsEnumerable('toString')),
        enumProperties = [
            'constructor',
            'hasOwnProperty',
            'isPrototypeOf',
            'propertyIsEnumerable',
            'toString',
            'toLocaleString',
            'valueOf'
        ];
    S._mix(S, {
        /**
         * 获取对象属性名
         */
        keys: Object.keys || function (o) {
            var result = [], p, i;

            for (p in o) {
                if (o.hasOwnProperty(p)) {
                    result.push(p);
                }
            }
            if (hasEnumBug) {
                for (i = enumProperties.length - 1; i >= 0; i--) {
                    p = enumProperties[i];
                    if (o.hasOwnProperty(p)) {
                        result.push(p);
                    }
                }
            }
            return result;
        },
        /**
         * 扩展
         * @param target    当前对象
         * @param resource  资源对象
         * @param overwrite 是否重写
         * @param whiteList 白名单
         * @param deep      是否深度复制
         */
        mix: function (target, resource, overwrite, whiteList, deep) {
            if (overwrite && S.isObject(overwrite)) {
                whiteList = overwrite["whiteList"];
                deep = overwrite["deep"];
                overwrite = overwrite["overwrite"];
            }
            if (whiteList && !S.isFunction(whiteList)) {
                var originalWl = whiteList;
                whiteList = function (name, val) {
                    return S.inArray(name, originalWl) ? val : undefined;
                };
            }
            if (overwrite === undefined) {
                overwrite = true;
            }
            var cache = [],
                c,
                i = 0;
            mixInternal(target, resource, overwrite, whiteList, deep, cache);
            while ((c = cache[i++])) {
                delete c[MIX_CIRCULAR_DETECTION];
            }
            return target;
        },
        /**
         * 克隆对象
         * @param obj
         * @returns {*}
         */
        clone: function (obj) {
            var objClone;
            if (obj.constructor === Object) {
                objClone = new obj.constructor();
            } else {
                objClone = new obj.constructor(obj.valueOf());
            }
            for (var key in obj) {
                if (obj.hasOwnProperty(key) && objClone[key] != obj[key]) {
                    if (typeof(obj[key]) == 'object') {
                        objClone[key] = obj[key].clone();
                    } else {
                        objClone[key] = obj[key];
                    }
                }
            }
            objClone.toString = obj.toString;
            objClone.valueOf = obj.valueOf;
            return objClone;
        }
    });

    function mixInternal(target, resource, overwrite, whiteList, deep, cache) {
        if (!resource || !target) {
            return resource;
        }
        var i, p, keys, len;

        // 记录循环标志
        resource[MIX_CIRCULAR_DETECTION] = target;

        // 记录被记录了循环标志的对像
        cache.push(resource);

        // mix all properties
        keys = S.keys(resource);
        len = keys.length;
        for (i = 0; i < len; i++) {
            p = keys[i];
            if (p !== MIX_CIRCULAR_DETECTION) {
                // no hasOwnProperty judge!
                _mix(p, target, resource, overwrite, whiteList, deep, cache);
            }
        }
        return target;
    }

    function _mix(p, r, s, ov, wl, deep, cache) {
        // 要求覆盖
        // 或者目的不存在
        // 或者深度mix
        if (ov || !(p in r) || deep) {
            var target = r[p],
                src = s[p];
            // prevent never-end loop
            if (target === src) {
                // S.mix({},{x:undefined})
                if (target === undefined) {
                    r[p] = target;
                }
                return;
            }
            if (wl) {
                src = wl.call(s, p, src);
            }
            // 来源是数组和对象，并且要求深度 mix
            if (deep && src && (S.isArray(src) || S.isObject(src))) {
                if (src[MIX_CIRCULAR_DETECTION]) {
                    r[p] = src[MIX_CIRCULAR_DETECTION];
                } else {
                    // 目标值为对象或数组，直接 mix
                    // 否则 新建一个和源值类型一样的空数组/对象，递归 mix
                    var clone = target && (S.isArray(target) || S.isObject(target)) ?
                        target :
                        (S.isArray(src) ? [] : {});
                    r[p] = clone;
                    mixInternal(clone, src, ov, wl, true, cache);
                }
            } else if (src !== undefined && (ov || !(p in r))) {
                r[p] = src;
            }
        }
    }
})(SINGER);
(function (S, undefined) {
    var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
        trim = String.prototype.trim,
        SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
        EMPTY = '';
    S._mix(S, {
        /**
         * trim
         * @param str
         * @returns {*}
         */
        trim: function (str) {
            return S.isEmpty(str) ? str : (trim ? trim.call(str) : (str + '').replace(RE_TRIM, EMPTY));
        },
        lengthCn: function (str) {
            if (!S.isString(str)) return 0;
            return str.replace(/[\u4e00-\u9fa5]/g, "**").length;
        },
        subCn: function (str, num, strip) {
            if (S.lengthCn(str) <= num) return str.toString();
            for (var i = 0; i < str.length; i++) {
                if (S.lengthCn(this.substr(0, i)) >= num) {
                    return str.substr(0, i) + (strip || "...");
                }
            }
            return str;
        },
        stripTags: function (str) {
            return str.replace(/<\/?[^>]+>/gi, '');
        },
        stripScript: function (h) {
            return h.replace(/<script[^>]*>([\\S\\s]*?)<\/script>/g, '')
        },
        isMobile: function (m) {
            return /^((0[1-9]{2,3}[\s-]?)?\d{7,8})|(1[3,5,8]\d{9})$/.test(L.trim(m))
        },
        /**
         * 替代
         * @param str
         * @param o
         * @param regexp
         * @returns {*}
         */
        substitute: function (str, o, regexp) {
            if (!(S.isString(str) && o)) {
                return str;
            }
            return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
                if (match.charAt(0) === '\\') {
                    return match.slice(1);
                }
                return (o[name] === undefined) ? EMPTY : o[name];
            });
        },
        /**
         * 首字母大写
         * @param str
         * @returns {string}
         */
        ucFirst: function (str) {
            str += '';
            return str.charAt(0).toUpperCase() + str.substring(1);
        },
        /**
         * 以某个字符串开始
         * @param str
         * @param prefix
         * @returns {boolean}
         */
        startsWith: function (str, prefix) {
            return str.lastIndexOf(prefix, 0) === 0;
        },
        /**
         * 以某个字符串结束
         * @param str
         * @param suffix
         * @returns {boolean}
         */
        endsWith: function (str, suffix) {
            var ind = str.length - suffix.length;
            return ind >= 0 && str.indexOf(suffix, ind) === ind;
        },
        /**
         *  格式化字符串
         * @param str
         * @returns {*}
         */
        format: function (str) {
            if (arguments.length <= 1) return str || EMPTY;
            var result = str;
            if (2 === arguments.length && S.isObject(arguments[1])) {
                for (var key in arguments[1]) {
                    var reg = new RegExp("\\{" + key + "\\}", "gi");
                    result = result.replace(reg, arguments[1][key]);
                }
            } else {
                for (var i = 1; i < arguments.length; i++) {
                    var reg = new RegExp("\\{" + (i - 1) + "\\}", "gi");
                    result = result.replace(reg, arguments[i]);
                }
            }
            return result;
        }
    });
})(SINGER);
/**
 * 终端识别
 */
(function(S){

})(SINGER);
/**
 * Uri
 */
(function(S){
    S.uri = function (uri) {
        var q = [], qs;
        qs = (uri ? uri + "" : location.search);
        if (qs.indexOf('?') >= 0) {
            qs = qs.substring(1);
        }
        if (qs) {
            qs = qs.split('&');
        }
        if (qs.length > 0) {
            for (var i = 0; i < qs.length; i++) {
                var qt = qs[i].split('=');
                q[qt[0]] = decodeURIComponent(qt[1]);
            }
        }
        return q;
    };
})(SINGER);