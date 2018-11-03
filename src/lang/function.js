/**
 * Function Model
 * @author shoy
 * @date 2015/4/7.
 */
import {
    isString,
    getLogger
} from "../utils/index"
var logger = getLogger('lang.function')

export const later = (method, time, isInterval, context, data) => {
    var timer,
        f;
    time = time || 0;
    if (isString(method))
        method = context[method];
    if (!method) {
        logger.error("fn is undefined");
        return
    }
    f = function () {
        method.apply(context, data);
    };
    timer = (isInterval ? setInterval(f, time) : setTimeout(f, time));
    return {
        timer: timer,
        isInterval: isInterval,
        cancel: function () {
            if (this.isInterval) {
                clearInterval(timer);
            } else {
                clearTimeout(timer);
            }
        }
    };
}