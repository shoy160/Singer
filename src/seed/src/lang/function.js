/**
 * Function Model
 * @author shoy
 * @date 2015/4/7.
 */
(function (S) {
    S._mix(S, {
        later: function (method, time, isInterval, context, data) {
            var timer,
                f;
            time = time || 0;
            if (S.isString(method))
                method = context[method];
            if (!method) {
                S.error("fn is undefined");
            }
            f = function () {
                method.apply(context, data);
            };
            timer = (isInterval ? setInterval(f, time) : setTimeout(f, time));
            return{
                timer: timer,
                isInterval: isInterval,
                cancel: function () {
                    if (this.isInterval) {
                        clearInterval(timer);
                    } else {
                        clearTimeout(timer);
                    }
                }
            }
        }
    });
})(SINGER);
