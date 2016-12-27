/**
 * String Model
 */
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
            return h.replace(/<script[^>]*>([\\S\\s]*?)<\/script>/g, '');
        },
        /**
         * 是否是手机号码
         * @param m
         * @returns {boolean}
         */
        isMobile: function (m) {
            return /^(1[3456789]\d{9})$/.test(S.trim(m));
        },
        /**
         * 是否是座机号码
         * @param str
         * @returns {boolean}
         */
        isTelephone: function (str) {
            return /((0[1-9]{2,3}[\s-]?)?\d{7,8})/gi.test(S.trim(str));
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
                    if (!arguments[1].hasOwnProperty(key)) continue;
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
        },
        /**
         * 左侧填充
         * @param obj
         * @param len
         * @param ch
         */
        padLeft: function (obj, len, ch) {
            ch = S.isUndefined(ch) ? '0' : ch;
            var s = String(obj);
            while (s.length < len)
                s = ch + s;
            return s;
        },
        /**
         * 右侧填充
         * @param obj
         * @param len
         * @param ch
         */
        padRight: function (obj, len, ch) {
            ch = S.isUndefined(ch) ? '0' : ch;
            var s = String(obj);
            while (s.length < len)
                s += ch;
            return s;
        }
    });
})(SINGER);