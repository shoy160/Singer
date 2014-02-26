/**
 * @class SINGER
 * @author shoy
 * @date 2014-02-18
 */
var SINGER = (function (undefined) {
    var self = this,
        S,
        guid = 0,
        EMPTY = '',
        loggerLevel = {
            debug: 10,
            info: 20,
            warn: 30,
            error: 40
        },
        toString = Object.prototype.toString;

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
         * set SINGER Configuration
         * @param configName
         * @param configValue
         */
        config: function (configName, configValue) {
            var cfg,
                r,
                self = this,
                toString = Object.prototype.toString,
                Config = S.Config,
                configFns = Config.fns;
            if ("[object Object]" === toString.call(configName)) {
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
                var matched = 1;
                if (logger) {
                    var level,minLevel,maxLevel,cfg;
                    cfg = S.Config.logger||{};
                    cat = cat || 'debug';
                    level = loggerLevel[cat] || loggerLevel.debug;

                    if (matched) {
                        msg = logger + ": " + msg;
                    }
                }
                if (typeof console !== 'undefined' && console.log) {
                    console[cat && console[cat] ? cat : 'log'](msg);
                    return msg;
                }
            }
            return undefined;
        },
        getLogger: function (logger) {
            return getLogger(logger);
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