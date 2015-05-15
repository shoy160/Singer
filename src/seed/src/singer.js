/**
 * @class SINGER
 * @author shoy
 * @date 2014-02-18
 */
var singer = SINGER = window.SINGER = (function (undefined) {
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
            if (!loggerLevel.hasOwnProperty(cat))
                continue;
            (function (obj, cat) {
                obj[cat] = function (msg) {
                    return S.log(msg, cat, logger);
                };
            })(obj, cat);
        }
        return obj;
    }

    S = {
        __BUILD_TIME: '2014-10-04',
        Env: {
            host: self
        },
        Config: {
            debug: true,
            loggerLevel: 'debug',
            fns: {}
        },
        Version: '0.2.2',
        /**
         * 类型判断
         * @param obj
         * @param type
         * @return boolean
         */
        is: function (obj, type) {
            var isNan = {"NaN": 1, "Infinity": 1, "-Infinity": 1};
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
        /**
         * 布尔类型判断
         * @param obj
         * @returns {boolean|*|Boolean}
         */
        isBoolean: function (obj) {
            return S.is(obj, "boolean");
        },
        /**
         * 日期类型判断
         * @param obj
         * @returns {boolean|*|Boolean}
         */
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
        isUndefined: function (obj) {
            return S.is(obj, "undefined");
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
                    if (configName.hasOwnProperty(c))
                        Config[c] = configName[c];
                }
            } else {
                cfg = configFns[configName];
                if (S.isUndefined(configValue)) {
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
            if (!S.Config.debug) return undefined;
            if ((loggerLevel[S.Config.loggerLevel] || 1000) > loggerLevel[cat == 'log' ? 'debug' : cat])
                return "min level";
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