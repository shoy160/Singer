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
                (type == typeof obj && obj !== null) ||
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
        },
        _mix:function(target,resource){
            for(var name in resource){
                if(resource.hasOwnProperty(name))
                target[name]=resource[name];
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