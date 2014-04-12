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
    S.ucFirst = function (str) {
        str += '';
        return str.charAt(0).toUpperCase() + str.substring(1);
    };
    /**
     * 以某个字符串开始
     * @param str
     * @param prefix
     * @returns {boolean}
     */
    S.startsWith = function (str, prefix) {
        return str.lastIndexOf(prefix, 0) === 0;
    };
    /**
     * 以某个字符串结束
     * @param str
     * @param suffix
     * @returns {boolean}
     */
    S.endsWith = function (str, suffix) {
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
                var reg = new RegExp("\\{" + (i - 1) + "\\}", "gi");
                result = result.replace(reg, arguments[i]);
            }
        }
        return result;
    };
})(SINGER);