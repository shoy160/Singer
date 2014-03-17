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
            return  (type == "null" && obj === null) ||
                // is(undefined,'undefined')
                (type == typeof obj && obj !== null) ||
                // Object(Object) == Object -> true
                // Object({}) == {}         -> false
                (type == "object" && obj === Object(obj)) ||
                (type == "array" && Array.isArray && Array.isArray(obj)) ||
                Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() == type;
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
                    if(!matched)
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
/**
 * Json 序列化
 */
(function(S,undefined){
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
    return S;
})(SINGER);
(function (S, undefined) {
    var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g,
        trim = String.prototype.trim,
        SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g,
        EMPTY = '';
    /**
     * trim
     * @param str
     * @returns {*}
     */
    S.trim = function (str) {
        return S.isEmpty(str) ? str : (trim ? trim.call(str) : (str + '').replace(RE_TRIM, EMPTY));
    };
    /**
     * 替代
     * @param str
     * @param o
     * @param regexp
     * @returns {*}
     */
    S.substitute = function (str, o, regexp) {
        if (!(S.isString(str) && o)) {
            return str;
        }
        return str.replace(regexp || SUBSTITUTE_REG, function (match, name) {
            if (match.charAt(0) === '\\') {
                return match.slice(1);
            }
            return (o[name] === undefined) ? EMPTY : o[name];
        });
    };
    /**
     * 首字母大写
     * @param str
     * @returns {string}
     */
    S.ucFirst=function(str){
        str += '';
        return str.charAt(0).toUpperCase() + str.substring(1);
    };
    /**
     * 以某个字符串开始
     * @param str
     * @param prefix
     * @returns {boolean}
     */
    S.startsWith=function (str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
    };
    /**
     * 以某个字符串结束
     * @param str
     * @param suffix
     * @returns {boolean}
     */
    S.endsWith=function (str, suffix) {
        var ind = str.length - suffix.length;
        return ind >= 0 && str.indexOf(suffix, ind) === ind;
    };
    /**
     *  格式化字符串
     * @param str
     * @returns {*}
     */
    S.format = function (str) {
        if (arguments.length <= 1) return str || EMPTY;
        var result = str;
        if (2 === arguments.length && S.isObject(arguments[1])) {
            for (var key in arguments[1]) {
                var reg = new RegExp("\\{" + key + "\\}", "gi");
                result = result.replace(reg, arguments[1][key]);
            }
        } else {
            for (var i = 1; i < arguments.length; i++) {
                var reg = new RegExp("\\{" + (i-1) + "\\}", "gi");
                result = result.replace(reg, arguments[i]);
            }
        }
        return result;
    };
})(SINGER);
/**
 * Uri
 */
(function(S,undefined){
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
    return S;
})(SINGER);