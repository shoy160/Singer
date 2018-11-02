'use strict'

var self = window,
    GUID = 0,
    EMPTY = '',
    loggerLevel = {
        debug: 10,
        info: 20,
        warn: 30,
        error: 40
    };

const singer = {
    __BUILD_TIME: '2018-11-02',
    Version: '2.0.1',
    Env: {
        host: self
    },
    Config: {
        debug: true,
        loggerLevel: 'debug',
        fns: {}
    },
    logger: {
        level: {
            DEBUG: 'debug',
            INFO: 'info',
            WARN: 'warn',
            ERROR: 'error'
        }
    }
}

export const is = (obj, type) => {
    var isNan = {
        "NaN": 1,
        "Infinity": 1,
        "-Infinity": 1
    };
    type = type.toLowerCase();
    if (type == "finite") {
        return !isNan["hasOwnProperty"](+obj);
    }
    if (type == "array") {
        return obj instanceof Array;
    }
    if (undefined === obj && type !== "undefined") return false;
    return (type == "null" && obj === null) ||
        (type == typeof obj && obj !== null) ||
        (type == "object" && obj === Object(obj)) ||
        (type == "array" && Array.isArray && Array.isArray(obj)) ||
        Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() == type;
}

export const isBoolean = obj => {
    return is(obj, "boolean")
}

/**
 * 日期类型判断
 * @param obj
 * @returns {boolean|*|Boolean}
 */
export const isDate = obj => {
    return is(obj, "date")
}
export const isRegExp = obj => {
    return is(obj, "regexp")
}
export const isObject = obj => {
    return is(obj, "object")
}
export const isArray = obj => {
    return is(obj, "array")
}
export const isNumber = obj => {
    return is(obj, "number")
}
export const isFunction = obj => {
    return is(obj, "function")
}
export const isNull = obj => {
    return is(obj, "null")
}
export const isString = obj => {
    return is(obj, "string")
}
export const isEmpty = obj => {
    return EMPTY === obj || isNull(obj)
}
export const isUndefined = obj => {
    return is(obj, "undefined")
}

export const config = (configName, configValue) => {
    var cfg,
        r,
        self = this,
        Config = singer.Config,
        configFns = Config.fns;
    if (isObject(configName)) {
        for (var c in configName) {
            if (configName.hasOwnProperty(c))
                Config[c] = configName[c];
        }
    } else {
        cfg = configFns[configName];
        if (isUndefined(configValue)) {
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
}

export const log = (msg, cat, logger) => {
    if (!singer.Config.debug) return undefined;
    if ((loggerLevel[singer.Config.loggerLevel] || 1000) > loggerLevel[cat == 'log' ? 'debug' : cat])
        return "min level";
    var matched = false;
    if (logger) {
        matched = isObject(msg);
        if (!matched)
            msg = logger + ": " + msg;
    }
    if (typeof console !== 'undefined' && console.log) {
        if (matched) console[cat && console[cat] ? cat : 'log'](logger + ":");
        console[cat && console[cat] ? cat : 'log'](msg);
        return msg;
    }
}

export const getLogger = logger => {
    var obj = {};
    for (var cat in loggerLevel) {
        if (!loggerLevel.hasOwnProperty(cat))
            continue;
        (function (obj, cat) {
            obj[cat] = function (msg) {
                return log(msg, cat, logger);
            };
        })(obj, cat);
    }
    return obj;
}

export const guid = pre => {
    return (pre || '') + GUID++;
}

export const _mix = (target, resource) => {
    for (var name in resource) {
        if (resource.hasOwnProperty(name))
            target[name] = resource[name];
    }
}

export default singer