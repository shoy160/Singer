/**
 * Date Model
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
    AP.left = function () {
        var arr = {status: true};
        var nDifference = this - (new Date());
        if (nDifference < 0) {
            arr.status = false;
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
    S._mix(S, {
        /**
         * 当前时间戳
         */
        nowTick: Date.now || function () {
            return +new Date();
        },
        /**
         * 现在的时间
         * @returns {Date}
         */
        now: function () {
            return new Date(S.nowTick());
        },
        /**
         * 添加天数
         * @param date
         * @param days
         * @returns {*}
         */
        addDays: function (date, days) {
            if (!S.isDate(date)) return S.now();
            days = (S.isNumber(days) ? days : 0);
            return new Date(date.addDays(days));
        },
        /**
         * 格式化时间
         * @param date
         * @param strFormat
         * @returns {*}
         */
        formatDate: function (date, strFormat) {
            if (!S.isDate(date)) return date;
            strFormat = strFormat || "yyyy-MM-dd";
            return date.format(strFormat);
        },
        /**
         * 计算剩余时间
         * @param date
         * @returns {*}
         */
        leftTime: function (date) {
            return date.left();
        }
    });
})(SINGER);