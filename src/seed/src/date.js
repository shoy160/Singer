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