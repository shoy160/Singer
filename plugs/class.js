function Class() {
}
Class.extend = function extend(props) {
    var prototype = new this();
    var _super = this.prototype;
    for (var name in props) {
        if (typeof props[name] == "function"
            && typeof _super[name] == "function") {
            prototype[name] = (function (super_fn, fn) {
                return function () {
                    var tmp = this.callSuper;
                    this.callSuper = super_fn;
                    var ret = fn.apply(this, arguments);
                    this.callSuper = tmp;
                    if (!this.callSuper) {
                        delete this.callSuper;
                    }
                    return ret;
                }
            })(_super[name], props[name])
        } else {
            prototype[name] = props[name];
        }
    }
    function Class() {
    }

    Class.prototype = prototype;
    Class.prototype.constructor = Class;
    Class.extend = extend;
    Class.create = Class.prototype.create = function () {
        var instance = new this();
        if (instance.init) {
            instance.init.apply(instance, arguments);
        }
        return instance;
    }
    return Class;
};
/**
 * 类型判断
 * @param obj
 * @param type
 */
function is(obj, type) {
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
}

function isObject(o) {
    return is(o, "object");
}
function isArray(o) {
    return is(o, "array");
}
function isNumber(o) {
    return is(o, "number");
}
function isFunction(o) {
    return is(o, "function");
}
function isNull(o) {
    return is(o, "null");
}
function isString(o) {
    return is(o, "string");
}

/**
 * 扩展
 * @returns {String}
 */
String.prototype.format = function () {
    if (arguments.length <= 0) return this;
    var result = this;
    if (1 === arguments.length && isObject(arguments[0])) {
        for (var key in arguments[0]) {
            var reg = new RegExp("\\{" + key + "\\}", "gi");
            result = result.replace(reg, arguments[0][key]);
        }
    } else {
        for (var i = 0; i < arguments.length; i++) {
            var reg = new RegExp("\\{" + i + "\\}", "gi");
            result = result.replace(reg, arguments[i]);
        }
    }
    return result;
};

Date.prototype.left = function () {
    var arr = {state: -1};
    var nDifference = this - (new Date());
    if (nDifference < 0) {
        arr.state = 1;
        nDifference = Math.abs(nDifference);
    }
    var iDays = nDifference / (1000 * 60 * 60 * 24);
    arr.dd = parseInt(iDays);
    var temp = iDays - arr.dd;
    arr.hh = parseInt(temp * 24);
    temp = temp * 24 - arr.hh;
    arr.mm = parseInt(temp * 60);
    temp = temp * 60 - arr.mm;
    arr.ss = parseInt(temp * 60);
    temp = temp * 60 - arr.ss;
    arr.ms = parseInt(temp * 60);
    return arr;
};