(function ($) {
    String.prototype.format = function () {
        if (arguments.length <= 0) return this;
        var result = this;
        if (1 === arguments.length && "object" === typeof arguments[0]) {
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
    var def = {}, timer, errors = {"-1": "样品试销活动未开启！", "-2": "样品试销活动已结束！"};
    var getLeft = function (date) {
        var arr = {};
        if ("string" === typeof date)
            date = new Date(date);
        if (!(date instanceof Date)) {
            arr.code = -1;
            return arr;
        }
        var nDifference = date - (new Date());
        if (nDifference < 0) {
            arr.code = -2;
            return arr;
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
    $.fn.countDown = function (opt) {
        opt = $.extend(def, opt || {});
        var $t = $(this), dc , date, cf = $t.data("config");
        if (cf) dc = eval("(" + cf + ")");
        if (dc && (dc instanceof Object)) {
            opt = $.extend(dc, opt || {});
        }
        date = opt.date;
        if ("string" == typeof date) {
            date = new Date(opt.date.replace(/-/gi, "/"));
        }
        var tmp = opt.tmp || $t.html() || "还剩<em>{dd}</em>天<em>{hh}</em>小时<em>{mm}</em>分<em>{ss}</em>秒 结束";
        timer = setInterval(function () {
            var left = getLeft(date);
            if (!left) {
                clearInterval(timer);
                return false;
            }
            if (left.code < 0) {
                $t.html(errors[left.code]);
                clearInterval(timer);
            } else {
                $t.html(tmp.format(left));
            }
        }, 500);
    }
})(jQuery);