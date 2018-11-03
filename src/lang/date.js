/**
 * Date Model
 */
import {
    isDate,
    isNumber,
    isString,
    getLogger
} from '../utils/index'
const weeks = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
var logger = getLogger('lang.date')
var AP = Date.prototype;
AP.addDays = AP.addDays || function (days) {
    this.setDate(this.getDate() + days);
    return this;
};

/**
 * 相差天数
 */
AP.differDate = function (date) {
    date = parseDate(date)
    var currentDate = new Date(this.getFullYear(), this.getMonth() + 1, this.getDate());
    var targetDate = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());
    var diff = currentDate - targetDate;
    logger.debug(`diff:${diff}`)
    return diff / (1000 * 60 * 60 * 24);
};

/**
 * 日期对比
 */
AP.left = function (date) {
    var arr = {
        status: true,
    };
    date = parseDate(date)
    var nDifference = this - (date ? date : new Date());
    if (nDifference < 0) {
        arr.status = false;
        nDifference = Math.abs(nDifference);
    }
    var iDays = nDifference / (1000 * 60 * 60 * 24);
    arr.dd = iDays > 1 ? parseInt(iDays) : 0;
    var temp = iDays - arr.dd;
    var hh = temp * 24;
    arr.hh = hh > 1 ? parseInt(hh) : 0;
    temp = temp * 24 - arr.hh;
    hh = temp * 60;
    arr.mm = hh > 1 ? parseInt(hh) : 0;
    temp = temp * 60 - arr.mm;
    hh = temp * 60;
    arr.ss = hh > 1 ? parseInt(hh) : 0;
    temp = temp * 60 - arr.ss;
    hh = temp * 1000;
    arr.ms = hh > 1 ? parseInt(hh) : 0;
    return arr;
};

/**
 * 日期格式化
 */
AP.format = AP.format || function (strFormat) {
    if (strFormat === 'soon' || strFormat === 'week') {
        var left = this.left();
        var leftDay = Math.abs(this.differDate(now()))
        if (leftDay < 5) {
            var str = '';
            if (leftDay > 0) {
                if (leftDay == 1)
                    return (left.status ? "明天" : "昨天") + this.format(' hh:mm');
                if (strFormat == 'week') {
                    return weeks[this.getDay()];
                } else {
                    str = leftDay + '天';
                }
            } else if (left.hh > 0) {
                str = left.hh + '小时';
            } else if (left.mm > 0) {
                str = left.mm + '分钟';
            } else if (left.ss > 10) {
                str = left.ss + '秒';
            } else {
                return '刚刚';
            }
            return str + (left.status ? '后' : '前');
        }
        strFormat = 'yyyy-MM-dd';
    }
    if (strFormat === "date")
        return this;
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    //替换年
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

/**
 * 转换时间
 * @param {*} date 
 */
export const parseDate = date => {
    if (isDate(date) || !date)
        return date
    try {
        if (isString(date) && /Date\((\d+)\)/gi.test(date)) {
            date = new Date(RegExp.$1 * 1);
        }
        if (isNumber(date) || isString(date)) {
            return new Date(date)
        }
    } catch (e) {
        logger.error(`${date} parse to date error`, e)
        return date
    }
}
/**
 * 当前时间戳
 */
export const tick = Date.now || (() => {
    return +new Date();
})
/**
 * 现在的时间
 * @returns {Date}
 */
export const now = () => {
    return new Date(tick());
}
/**
 * 添加天数
 * @param date
 * @param days
 * @returns {*}
 */
export const addDays = (date, days) => {
    date = parseDate(date)
    if (!isDate(date)) return now();
    days = (isNumber(days) ? days : 0);
    return new Date(date.addDays(days));
}
/**
 * 格式化时间
 * @param date
 * @param strFormat
 * @returns {*}
 */
export const formatDate = (date, strFormat) => {
    date = parseDate(date)
    if (!isDate(date)) return date;
    strFormat = strFormat || "yyyy-MM-dd";
    return date.format(strFormat);
}
/**
 * 计算剩余时间
 * @param date
 * @param begin 默认当前时间
 * @returns {*}
 */
export const leftTime = (date, begin) => {
    date = parseDate(date)
    return date.left(begin)
}