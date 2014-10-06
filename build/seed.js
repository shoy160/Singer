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
            fns: {}
        },
        Version: '0.5.2',
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
/**
 * date
 */
(function (S) {
    var AP = Date.prototype;
    AP.addDays = AP.addDays || function (days) {
        this.setDate(this.getDate() + days);
        return this;
    };
    AP.format = AP.format || function (strFormat) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(strFormat))
            strFormat = strFormat.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(strFormat)) {
                strFormat =
                    strFormat.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                        (o[k]) :
                        (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return strFormat;
    };
    S._mix(S, {
        nowTick: Date.now || function () {
            return +new Date();
        },
        now: function () {
            return new Date(S.nowTick());
        },
        addDays: function (date, days) {
            if (!S.isDate(date)) return S.now();
            days = (S.isNumber(days) ? days : 0);
            return new Date(date.addDays(days));
        },
        formatDate: function (date, strFormat) {
            if (!S.isDate(date)) return date;
            strFormat = strFormat || "yyyy-MM-dd";
            return date.format(strFormat);
        }
    });
})(SINGER);
/**
 * Json 序列化
 */
(function (S) {
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
                arrItem;
            if (S.isArray(json)) {
                S.each(json, function (jsonItem) {
                    if (S.isNumber(jsonItem))
                        arr.push(jsonItem);
                    else if (S.isString(jsonItem))
                        arr.push("'" + jsonItem + "'");
                    else {
                        arrItem = [];
                        S.each(S.keys(jsonItem), function (key) {
                            arrItem.push("'" + key + "':" + fmt(jsonItem[key]));
                        });
                        arr.push('{' + arrItem.join(',') + '}');
                    }
                });
                return '[' + arr.join(',') + ']';
            } else {
                S.each(S.keys(json), function (key) {
                    arr.push("'" + key + "':" + fmt(json[key]));
                });
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
            var result = str,
                reg;
            if (2 === arguments.length && S.isObject(arguments[1])) {
                for (var key in arguments[1]) {
                    reg = new RegExp("\\{" + key + "\\}", "gi");
                    result = result.replace(reg, arguments[1][key]);
                }
            } else {
                for (var i = 1; i < arguments.length; i++) {
                    reg = new RegExp("\\{" + (i - 1) + "\\}", "gi");
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
(function (S) {
    /*global process*/

    var win = S.Env.host,
        doc = win.document,
        navigator = win.navigator,
        ua = navigator && navigator.userAgent || '';

    function numberify(s) {
        var c = 0;
        // convert '1.2.3.4' to 1.234
        return parseFloat(s.replace(/\./g, function () {
            return (c++ === 0) ? '.' : '';
        }));
    }

    function setTridentVersion(ua, UA) {
        var core, m;
        UA[core = 'trident'] = 0.1; // Trident detected, look for revision

        // Get the Trident's accurate version
        if ((m = ua.match(/Trident\/([\d.]*)/)) && m[1]) {
            UA[core] = numberify(m[1]);
        }

        UA.core = core;
    }

    function getIEVersion(ua) {
        var m, v;
        if ((m = ua.match(/MSIE ([^;]*)|Trident.*; rv(?:\s|:)?([0-9.]+)/)) &&
            (v = (m[1] || m[2]))) {
            return numberify(v);
        }
        return 0;
    }

    function getDescriptorFromUserAgent(ua) {
        var EMPTY = '',
            os,
            core = EMPTY,
            shell = EMPTY, m,
            IE_DETECT_RANGE = [6, 9],
            ieVersion,
            v,
            end,
            VERSION_PLACEHOLDER = '{{version}}',
            IE_DETECT_TPL = '<!--[if IE ' + VERSION_PLACEHOLDER + ']><' + 's></s><![endif]-->',
            div = doc && doc.createElement('div'),
            s = [];
        /**
         * UA
         * @class SINGER.UA
         * @singleton
         */
        var UA = {
            /**
             * webkit version
             * @type undefined|Number
             * @member SINGER.UA
             */
            webkit: undefined,
            /**
             * trident version
             * @type undefined|Number
             * @member SINGER.UA
             */
            trident: undefined,
            /**
             * gecko version
             * @type undefined|Number
             * @member SINGER.UA
             */
            gecko: undefined,
            /**
             * presto version
             * @type undefined|Number
             * @member SINGER.UA
             */
            presto: undefined,
            /**
             * chrome version
             * @type undefined|Number
             * @member SINGER.UA
             */
            chrome: undefined,
            /**
             * safari version
             * @type undefined|Number
             * @member SINGER.UA
             */
            safari: undefined,
            /**
             * firefox version
             * @type undefined|Number
             * @member SINGER.UA
             */
            firefox: undefined,
            /**
             * ie version
             * @type undefined|Number
             * @member SINGER.UA
             */
            ie: undefined,
            /**
             * ie document mode
             * @type undefined|Number
             * @member SINGER.UA
             */
            ieMode: undefined,
            /**
             * opera version
             * @type undefined|Number
             * @member SINGER.UA
             */
            opera: undefined,
            /**
             * mobile browser. apple, android.
             * @type String
             * @member SINGER.UA
             */
            mobile: undefined,
            /**
             * browser render engine name. webkit, trident
             * @type String
             * @member SINGER.UA
             */
            core: undefined,
            /**
             * browser shell name. ie, chrome, firefox
             * @type String
             * @member SINGER.UA
             */
            shell: undefined,

            /**
             * PhantomJS version number
             * @type undefined|Number
             * @member SINGER.UA
             */
            phantomjs: undefined,

            /**
             * operating system. android, ios, linux, windows
             * @type string
             * @member SINGER.UA
             */
            os: undefined,

            /**
             * ipad ios version
             * @type Number
             * @member SINGER.UA
             */
            ipad: undefined,
            /**
             * iphone ios version
             * @type Number
             * @member SINGER.UA
             */
            iphone: undefined,
            /**
             * ipod ios
             * @type Number
             * @member SINGER.UA
             */
            ipod: undefined,
            /**
             * ios version
             * @type Number
             * @member SINGER.UA
             */
            ios: undefined,

            /**
             * android version
             * @type Number
             * @member SINGER.UA
             */
            android: undefined,

            /**
             * nodejs version
             * @type Number
             * @member SINGER.UA
             */
            nodejs: undefined
        };

        // ejecta
        if (div && div.getElementsByTagName) {
            // try to use IE-Conditional-Comment detect IE more accurately
            // IE10 doesn't support this method, @ref: http://blogs.msdn.com/b/ie/archive/2011/07/06/html5-parsing-in-ie10.aspx
            div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, '');
            s = div.getElementsByTagName('s');
        }

        if (s.length > 0) {

            setTridentVersion(ua, UA);

            // Detect the accurate version
            // 注意：
            //  UA.shell = ie, 表示外壳是 ie
            //  但 UA.ie = 7, 并不代表外壳是 ie7, 还有可能是 ie8 的兼容模式
            //  对于 ie8 的兼容模式，还要通过 documentMode 去判断。但此处不能让 UA.ie = 8, 否则
            //  很多脚本判断会失误。因为 ie8 的兼容模式表现行为和 ie7 相同，而不是和 ie8 相同
            for (v = IE_DETECT_RANGE[0], end = IE_DETECT_RANGE[1]; v <= end; v++) {
                div.innerHTML = IE_DETECT_TPL.replace(VERSION_PLACEHOLDER, v);
                if (s.length > 0) {
                    UA[shell = 'ie'] = v;
                    break;
                }
            }

            // win8 embed app
            if (!UA.ie && (ieVersion = getIEVersion(ua))) {
                UA[shell = 'ie'] = ieVersion;
            }

        } else {
            // WebKit
            if ((m = ua.match(/AppleWebKit\/([\d.]*)/)) && m[1]) {
                UA[core = 'webkit'] = numberify(m[1]);

                if ((m = ua.match(/OPR\/(\d+\.\d+)/)) && m[1]) {
                    UA[shell = 'opera'] = numberify(m[1]);
                }
                // Chrome
                else if ((m = ua.match(/Chrome\/([\d.]*)/)) && m[1]) {
                    UA[shell = 'chrome'] = numberify(m[1]);
                }
                // Safari
                else if ((m = ua.match(/\/([\d.]*) Safari/)) && m[1]) {
                    UA[shell = 'safari'] = numberify(m[1]);
                }

                // Apple Mobile
                if (/ Mobile\//.test(ua) && ua.match(/iPad|iPod|iPhone/)) {
                    UA.mobile = 'apple'; // iPad, iPhone or iPod Touch

                    m = ua.match(/OS ([^\s]*)/);
                    if (m && m[1]) {
                        UA.ios = numberify(m[1].replace('_', '.'));
                    }
                    os = 'ios';
                    m = ua.match(/iPad|iPod|iPhone/);
                    if (m && m[0]) {
                        UA[m[0].toLowerCase()] = UA.ios;
                    }
                } else if (/ Android/i.test(ua)) {
                    if (/Mobile/.test(ua)) {
                        os = UA.mobile = 'android';
                    }
                    m = ua.match(/Android ([^\s]*);/);
                    if (m && m[1]) {
                        UA.android = numberify(m[1]);
                    }
                }
                // Other WebKit Mobile Browsers
                else if ((m = ua.match(/NokiaN[^\/]*|Android \d\.\d|webOS\/\d\.\d/))) {
                    UA.mobile = m[0].toLowerCase(); // Nokia N-series, Android, webOS, ex: NokiaN95
                }

                if ((m = ua.match(/PhantomJS\/([^\s]*)/)) && m[1]) {
                    UA.phantomjs = numberify(m[1]);
                }
            }
            // NOT WebKit
            else {
                // Presto
                // ref: http://www.useragentstring.com/pages/useragentstring.php
                if ((m = ua.match(/Presto\/([\d.]*)/)) && m[1]) {
                    UA[core = 'presto'] = numberify(m[1]);

                    // Opera
                    if ((m = ua.match(/Opera\/([\d.]*)/)) && m[1]) {
                        UA[shell = 'opera'] = numberify(m[1]); // Opera detected, look for revision

                        if ((m = ua.match(/Opera\/.* Version\/([\d.]*)/)) && m[1]) {
                            UA[shell] = numberify(m[1]);
                        }

                        // Opera Mini
                        if ((m = ua.match(/Opera Mini[^;]*/)) && m) {
                            UA.mobile = m[0].toLowerCase(); // ex: Opera Mini/2.0.4509/1316
                        }
                        // Opera Mobile
                        // ex: Opera/9.80 (Windows NT 6.1; Opera Mobi/49; U; en) Presto/2.4.18 Version/10.00
                        // issue: 由于 Opera Mobile 有 Version/ 字段，可能会与 Opera 混淆，同时对于 Opera Mobile 的版本号也比较混乱
                        else if ((m = ua.match(/Opera Mobi[^;]*/)) && m) {
                            UA.mobile = m[0];
                        }
                    }

                    // NOT WebKit or Presto
                } else {
                    // MSIE
                    // 由于最开始已经使用了 IE 条件注释判断，因此落到这里的唯一可能性只有 IE10+
                    // and analysis tools in nodejs
                    if ((ieVersion = getIEVersion(ua))) {
                        UA[shell = 'ie'] = ieVersion;
                        setTridentVersion(ua, UA);
                        // NOT WebKit, Presto or IE
                    } else {
                        // Gecko
                        if ((m = ua.match(/Gecko/))) {
                            UA[core = 'gecko'] = 0.1; // Gecko detected, look for revision
                            if ((m = ua.match(/rv:([\d.]*)/)) && m[1]) {
                                UA[core] = numberify(m[1]);
                                if (/Mobile|Tablet/.test(ua)) {
                                    UA.mobile = 'firefox';
                                }
                            }
                            // Firefox
                            if ((m = ua.match(/Firefox\/([\d.]*)/)) && m[1]) {
                                UA[shell = 'firefox'] = numberify(m[1]);
                            }
                        }
                    }
                }
            }
        }

        if (!os) {
            if ((/windows|win32/i).test(ua)) {
                os = 'windows';
            } else if ((/macintosh|mac_powerpc/i).test(ua)) {
                os = 'macintosh';
            } else if ((/linux/i).test(ua)) {
                os = 'linux';
            } else if ((/rhino/i).test(ua)) {
                os = 'rhino';
            }
        }

        UA.os = os;
        UA.core = UA.core || core;
        UA.shell = shell;
        UA.ieMode = UA.ie && doc.documentMode || UA.ie;

        return UA;
    }

    var UA = SINGER.UA = getDescriptorFromUserAgent(ua);

    // nodejs
    if (typeof process === 'object') {
        var versions, nodeVersion;

        if ((versions = process.versions) && (nodeVersion = versions.node)) {
            UA.os = process.platform;
            UA.nodejs = numberify(nodeVersion);
        }
    }

    // use by analysis tools in nodejs
    UA.getDescriptorFromUserAgent = getDescriptorFromUserAgent;

    //设置html的Css
//    var browsers = [
//            // browser core type
//            'webkit',
//            'trident',
//            'gecko',
//            'presto',
//            // browser type
//            'chrome',
//            'safari',
//            'firefox',
//            'ie',
//            'opera'
//        ],
//        documentElement = doc && doc.documentElement,
//        className = '';
//    if (documentElement) {
//        S.each(browsers, function (key) {
//            var v = UA[key];
//            if (v) {
//                className += ' ks-' + key + (parseInt(v) + '');
//                className += ' ks-' + key;
//            }
//        });
//        if (S.trim(className)) {
//            documentElement.className = S.trim(documentElement.className + className);
//        }
//    }
})(SINGER);
/**
 * Uri
 */
(function (S) {
    S._mix(S, {
        /**
         * 获取页面参数
         * @param uri
         * @returns {Array}
         */
        uri: function (uri) {
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
        },
        /**
         * cookie操作
         */
        cookie: {
            set: function (name, value, minutes, domain) {
                if ("string" !== typeof name || "" === S.trim(name)) return;
                var c = name + '=' + encodeURI(value);
                if ("number" === typeof minutes && minutes > 0) {
                    var time = (new Date()).getTime() + 1000 * 60 * minutes;
                    c += ';expires=' + (new Date(time)).toGMTString();
                }
                if ("string" == typeof domain)
                    c += ';domain=' + domain;
                document.cookie = c + '; path=/';
            },
            get: function (name) {
                var b = document.cookie;
                var d = name + '=';
                var c = b.indexOf('; ' + d);
                if (c == -1) {
                    c = b.indexOf(d);
                    if (c != 0) {
                        return null;
                    }
                }
                else {
                    c += 2;
                }
                var a = b.indexOf(';', c);
                if (a == -1) {
                    a = b.length;
                }
                return decodeURI(b.substring(c + d.length, a));
            },
            clear: function (name, domain) {
                if (this.get(name)) {
                    document.cookie = name + '=' + (domain ? '; domain=' + domain : '') + '; expires=Thu, 01-Jan-70 00:00:01 GMT';
                }
            }
        },
        /**
         * 参数化
         * @param data 参数对象
         * @returns {string} 参数字符
         */
        stringify: function (data) {
            if (!data || data.length || !S.isObject(data)) return "";
            var list = [];
            S.each(S.keys(data), function (key) {
                var item = data[key];
                if (S.isString(item))
                    list.push(key + '=' + encodeURIComponent(item));
                else
                    list.push(key + '=' + encodeURIComponent(S.json(item)));
            });
            return list.join('&');
        }
    });
})(SINGER);